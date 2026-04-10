import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle, ArrowRight } from "lucide-react";

export const metadata: Metadata = { title: "Payment Successful" };

export default function PaymentSuccessPage() {
  return (
    <section className="grid-bg px-6 py-32">
      <div className="mx-auto max-w-lg text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-brand-accent/10 border border-brand-accent/20">
          <CheckCircle className="h-10 w-10 text-brand-accent" />
        </div>
        <h1 className="font-mono text-3xl font-bold text-foreground">
          Payment <span className="text-brand-accent">Successful</span>
        </h1>
        <p className="mt-4 text-brand-text">
          Thank you for your payment. You&apos;ll receive a confirmation email
          with your receipt shortly.
        </p>
        <div className="mt-8 rounded-xl border border-brand-accent/10 bg-brand-primary/30 p-6 font-mono text-sm text-brand-text/60">
          <p><span className="text-brand-accent">$</span> transaction.status: <span className="text-brand-accent">completed</span></p>
          <p><span className="text-brand-accent">$</span> receipt: sent_to_email</p>
        </div>
        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 rounded-lg bg-brand-accent px-8 py-3.5 font-mono text-sm font-bold text-brand-bg hover:bg-brand-accent-light transition-all"
        >
          Back to Home <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
