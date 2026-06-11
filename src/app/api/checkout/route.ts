import { NextResponse } from "next/server";
import { getStripe, siteUrl } from "@/lib/stripe";

export async function POST(req: Request) {
  let invoiceId: string | null = null;
  const contentType = req.headers.get("content-type") ?? "";

  try {
    if (contentType.includes("application/json")) {
      const body = await req.json();
      invoiceId = typeof body?.invoice_id === "string" ? body.invoice_id : null;
    } else {
      const form = await req.formData();
      const v = form.get("invoice_id");
      invoiceId = typeof v === "string" ? v : null;
    }
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!invoiceId) {
    return NextResponse.json({ error: "invoice_id is required" }, { status: 400 });
  }

  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    !process.env.SUPABASE_SECRET_KEY
  ) {
    return NextResponse.json({ error: "Server not configured" }, { status: 500 });
  }

  const { createClient, createServiceClient } = await import("@/lib/supabase/server");
  const cookieClient = await createClient();
  const {
    data: { user },
  } = await cookieClient.auth.getUser();
  if (!user?.email) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const supabase = await createServiceClient();
  const { data: invoice, error } = await supabase
    .from("invoices")
    .select("*")
    .eq("id", invoiceId)
    .maybeSingle();

  if (error || !invoice) {
    return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
  }
  if (user.email.toLowerCase() !== String(invoice.customer_email).toLowerCase()) {
    return NextResponse.json({ error: "This invoice belongs to a different account" }, { status: 403 });
  }
  if (invoice.status !== "open") {
    return NextResponse.json({ error: `Invoice is ${invoice.status}` }, { status: 409 });
  }

  let sessionUrl: string;
  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: invoice.customer_email,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: invoice.currency,
            unit_amount: invoice.amount_cents,
            product_data: {
              name: invoice.description.slice(0, 120),
              description: invoice.description.length > 120 ? invoice.description : undefined,
            },
          },
        },
      ],
      success_url: `${siteUrl()}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl()}/payment/cancel?invoice_id=${invoice.id}`,
      metadata: { invoice_id: invoice.id },
      payment_intent_data: { metadata: { invoice_id: invoice.id } },
    });
    if (!session.url) throw new Error("Stripe did not return a session URL");
    sessionUrl = session.url;

    await supabase
      .from("invoices")
      .update({ stripe_session_id: session.id })
      .eq("id", invoice.id);
  } catch (err) {
    console.error("[checkout] stripe error", err);
    return NextResponse.json({ error: "Failed to start checkout" }, { status: 500 });
  }

  if (contentType.includes("application/json")) {
    return NextResponse.json({ url: sessionUrl });
  }
  return NextResponse.redirect(sessionUrl, 303);
}
