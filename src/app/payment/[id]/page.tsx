import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle, AlertCircle } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { InvoiceSignIn } from "./InvoiceSignIn";
import { SignOutButton } from "./SignOutButton";

export const metadata: Metadata = {
  title: "Invoice",
  robots: { index: false, follow: false },
};

interface InvoiceRow {
  id: string;
  customer_email: string;
  customer_name: string | null;
  description: string;
  amount_cents: number;
  currency: string;
  status: "open" | "paid" | "cancelled" | "expired";
  paid_at: string | null;
  created_at: string;
}

async function loadInvoice(id: string): Promise<InvoiceRow | null> {
  if (!process.env.SUPABASE_SECRET_KEY) return null;
  try {
    const { createServiceClient } = await import("@/lib/supabase/server");
    const supabase = await createServiceClient();
    const { data } = await supabase.from("invoices").select("*").eq("id", id).maybeSingle();
    return (data as InvoiceRow | null) ?? null;
  } catch {
    return null;
  }
}

async function getCurrentEmail(): Promise<string | null> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) {
    return null;
  }
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user?.email ?? null;
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function InvoicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!UUID_RE.test(id)) notFound();

  const invoice = await loadInvoice(id);
  if (!invoice) notFound();

  const email = await getCurrentEmail();

  if (!email) {
    return (
      <section className="payment-shell">
        <InvoiceSignIn invoiceId={invoice.id} customerEmail={invoice.customer_email} />
      </section>
    );
  }

  if (email.toLowerCase() !== invoice.customer_email.toLowerCase()) {
    return (
      <section className="payment-shell">
        <div className="payment-card">
          <div className="payment-icon warn">
            <AlertCircle aria-hidden="true" />
          </div>
          <h1>Different account</h1>
          <p>
            This invoice was sent to <strong>{invoice.customer_email}</strong>. You&apos;re currently
            signed in as <strong>{email}</strong>.
          </p>
          <p style={{ marginTop: 12 }}>Sign out and sign back in with the email this invoice was sent to.</p>
          <div style={{ marginTop: 24, display: "flex", justifyContent: "center", gap: 12 }}>
            <SignOutButton redirectTo={`/payment/${invoice.id}`} />
            <Link href="/" className="btn btn-ghost">
              Back to home
            </Link>
          </div>
        </div>
      </section>
    );
  }

  if (invoice.status === "paid") {
    return (
      <section className="payment-shell">
        <div className="payment-card">
          <div className="payment-icon ok">
            <CheckCircle aria-hidden="true" />
          </div>
          <h1>Paid · thank you</h1>
          <p>
            This invoice was paid on{" "}
            <strong>{invoice.paid_at ? formatDate(invoice.paid_at) : "—"}</strong>.
          </p>
          <div className="invoice-summary">
            <div className="invoice-summary-row">
              <span>Amount</span>
              <strong>{formatCurrency(invoice.amount_cents)}</strong>
            </div>
            <div className="invoice-summary-row">
              <span>For</span>
              <span>{invoice.description}</span>
            </div>
          </div>
          <div style={{ marginTop: 24, display: "flex", justifyContent: "center", gap: 12 }}>
            <Link href="/" className="btn btn-ghost">
              Back to home
            </Link>
          </div>
        </div>
      </section>
    );
  }

  if (invoice.status !== "open") {
    return (
      <section className="payment-shell">
        <div className="payment-card">
          <div className="payment-icon warn">
            <AlertCircle aria-hidden="true" />
          </div>
          <h1>This invoice is {invoice.status}</h1>
          <p>Get in touch with us if you believe this is a mistake.</p>
          <div style={{ marginTop: 24, display: "flex", justifyContent: "center", gap: 12 }}>
            <Link href="/contact" className="btn btn-primary">
              Contact us
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="payment-shell">
      <div className="payment-card">
        <div
          className="mono"
          style={{
            fontSize: 11,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--ink-faint)",
          }}
        >
          Invoice · open
        </div>
        <h1 className="invoice-amount">{formatCurrency(invoice.amount_cents)}</h1>
        <p className="invoice-desc">{invoice.description}</p>

        <div className="invoice-summary">
          <div className="invoice-summary-row">
            <span>Billed to</span>
            <span>
              {invoice.customer_name ? `${invoice.customer_name} · ` : ""}
              {invoice.customer_email}
            </span>
          </div>
          <div className="invoice-summary-row">
            <span>Issued</span>
            <span>{formatDate(invoice.created_at)}</span>
          </div>
          <div className="invoice-summary-row">
            <span>Reference</span>
            <span className="mono" style={{ fontSize: 11 }}>
              {invoice.id.slice(0, 8)}
            </span>
          </div>
        </div>

        <form action="/api/checkout" method="POST" style={{ marginTop: 28 }}>
          <input type="hidden" name="invoice_id" value={invoice.id} />
          <button type="submit" className="btn btn-primary pay-btn">
            Pay {formatCurrency(invoice.amount_cents)} →
          </button>
        </form>

        <p
          className="mono"
          style={{
            marginTop: 18,
            fontSize: 11,
            letterSpacing: "0.08em",
            color: "var(--ink-faint)",
            textAlign: "center",
          }}
        >
          &gt; secured by Stripe · we never see your card details
        </p>

        <div style={{ marginTop: 18, textAlign: "center" }}>
          <SignOutButton redirectTo={`/payment/${invoice.id}`} />
        </div>
      </div>
    </section>
  );
}
