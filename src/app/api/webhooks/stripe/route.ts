import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!sig || !secret) {
    return NextResponse.json({ error: "Webhook not configured" }, { status: 400 });
  }

  const raw = await req.text();

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(raw, sig, secret);
  } catch (err) {
    console.error("[webhook] signature verification failed", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const invoiceId = session.metadata?.invoice_id;

    if (invoiceId && process.env.SUPABASE_SECRET_KEY) {
      const { createServiceClient } = await import("@/lib/supabase/server");
      const supabase = await createServiceClient();

      await supabase
        .from("invoices")
        .update({
          status: "paid",
          paid_at: new Date().toISOString(),
          stripe_session_id: session.id,
        })
        .eq("id", invoiceId);

      await supabase.from("payments").insert({
        stripe_session_id: session.id,
        customer_email: session.customer_details?.email ?? null,
        amount: session.amount_total ?? 0,
        description: invoiceId,
        status: "completed",
        mode: "payment",
      });
    }
  }

  return NextResponse.json({ received: true });
}
