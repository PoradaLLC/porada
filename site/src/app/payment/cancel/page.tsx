import type { Metadata } from "next";
import Link from "next/link";
import { XCircle, ArrowRight } from "lucide-react";

export const metadata: Metadata = { title: "Payment Cancelled" };

export default function PaymentCancelPage() {
  return (
    <section className="grid-bg px-6 py-32">
      <div className="mx-auto max-w-lg text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-500/10 border border-red-500/20">
          <XCircle className="h-10 w-10 text-red-400" />
        </div>
        <h1 className="font-mono text-3xl font-bold text-foreground">
          Payment Cancelled
        </h1>
        <p className="mt-4 text-brand-text">
          Your payment was cancelled. No charges were made.
        </p>
        <Link
          href="/contact"
          className="mt-8 inline-flex items-center gap-2 rounded-lg bg-brand-accent px-8 py-3.5 font-mono text-sm font-bold text-brand-bg hover:bg-brand-accent-light transition-all"
        >
          Contact Us <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
