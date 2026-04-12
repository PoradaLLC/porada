import type { Metadata } from "next";
import { PaymentTerminal } from "./PaymentTerminal";
import { Shield, CreditCard, Lock } from "lucide-react";

export const metadata: Metadata = {
  title: "Pay",
  description: "Secure payment portal — Schtubbs",
};

export default function PayPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative grid-bg px-6 py-24">
        <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-brand-accent/5 rounded-full blur-[100px]" />
        <div className="relative mx-auto max-w-7xl">
          <p className="font-mono text-xs font-semibold uppercase tracking-widest text-brand-accent mb-2">
            // Payment
          </p>
          <h1 className="font-mono text-4xl font-bold text-foreground md:text-6xl">
            Pay Your <span className="text-brand-accent text-glow">Invoice</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-brand-text leading-relaxed">
            Use the invoice code we sent you to pull up your payment, or enter a
            custom amount if we agreed on a price over email or call.
          </p>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="border-y border-white/5 bg-brand-primary/50 px-6 py-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            {[
              { icon: Lock, label: "SSL Encrypted" },
              { icon: CreditCard, label: "Powered by Stripe" },
              { icon: Shield, label: "PCI Compliant" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <item.icon className="h-4 w-4 text-brand-accent" />
                <span className="font-mono text-xs text-brand-text">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Payment Form */}
      <section className="border-t border-white/5 bg-brand-bg px-6 py-24">
        <div className="mx-auto max-w-xl" data-reveal>
          <PaymentTerminal />
        </div>
      </section>
    </>
  );
}
