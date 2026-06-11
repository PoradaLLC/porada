import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle, ArrowRight } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Payment Successful" };

interface PaidLookup {
  amount_cents: number;
  description: string;
  paid_at: string | null;
  invoice_id: string;
}

async function lookupBySession(sessionId: string): Promise<PaidLookup | null> {
  if (!process.env.SUPABASE_SECRET_KEY) return null;
  try {
    const { createServiceClient } = await import("@/lib/supabase/server");
    const supabase = await createServiceClient();
    const { data } = await supabase
      .from("invoices")
      .select("id, amount_cents, description, paid_at")
      .eq("stripe_session_id", sessionId)
      .maybeSingle();
    if (!data) return null;
    return {
      invoice_id: data.id as string,
      amount_cents: data.amount_cents as number,
      description: data.description as string,
      paid_at: (data.paid_at as string | null) ?? null,
    };
  } catch {
    return null;
  }
}

export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;
  const paid = session_id ? await lookupBySession(session_id) : null;

  return (
    <section className="grid-bg px-6 py-32">
      <div className="mx-auto max-w-lg text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-brand-accent/10 border border-brand-accent/20">
          <CheckCircle className="h-10 w-10 text-brand-accent" />
        </div>
        <h1 className="font-mono text-3xl font-bold text-foreground">
          Payment <span className="text-brand-accent">Successful</span>
        </h1>
        {paid ? (
          <>
            <p className="mt-4 text-brand-text">
              We received <strong>{formatCurrency(paid.amount_cents)}</strong>. A receipt is on its
              way to your inbox.
            </p>
            <div className="mt-8 rounded-xl border border-brand-accent/10 bg-brand-primary/30 p-6 font-mono text-sm text-brand-text/60 text-left">
              <p>
                <span className="text-brand-accent">$</span> amount:{" "}
                <span className="text-brand-accent">{formatCurrency(paid.amount_cents)}</span>
              </p>
              <p>
                <span className="text-brand-accent">$</span> for: {paid.description}
              </p>
              {paid.paid_at && (
                <p>
                  <span className="text-brand-accent">$</span> paid_at: {formatDate(paid.paid_at)}
                </p>
              )}
              <p>
                <span className="text-brand-accent">$</span> reference: {paid.invoice_id.slice(0, 8)}
              </p>
            </div>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href={`/payment/${paid.invoice_id}`}
                className="inline-flex items-center gap-2 rounded-lg border border-brand-accent/30 px-6 py-3 font-mono text-sm text-brand-text hover:border-brand-accent transition-all"
              >
                View invoice
              </Link>
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-lg bg-brand-accent px-8 py-3.5 font-mono text-sm font-bold text-brand-bg hover:bg-brand-accent-light transition-all"
              >
                Back to Home <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </>
        ) : (
          <>
            <p className="mt-4 text-brand-text">
              Thank you for your payment. You&apos;ll receive a confirmation email with your receipt
              shortly.
            </p>
            <div className="mt-8 rounded-xl border border-brand-accent/10 bg-brand-primary/30 p-6 font-mono text-sm text-brand-text/60">
              <p>
                <span className="text-brand-accent">$</span> transaction.status:{" "}
                <span className="text-brand-accent">completed</span>
              </p>
              <p>
                <span className="text-brand-accent">$</span> receipt: sent_to_email
              </p>
            </div>
            <Link
              href="/"
              className="mt-8 inline-flex items-center gap-2 rounded-lg bg-brand-accent px-8 py-3.5 font-mono text-sm font-bold text-brand-bg hover:bg-brand-accent-light transition-all"
            >
              Back to Home <ArrowRight className="h-4 w-4" />
            </Link>
          </>
        )}
      </div>
    </section>
  );
}
