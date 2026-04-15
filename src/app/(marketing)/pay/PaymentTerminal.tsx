"use client";

import { useState } from "react";
import { CreditCard, Loader2, AlertCircle, FileText } from "lucide-react";

type Mode = "invoice" | "custom";

export function PaymentTerminal() {
  const [mode, setMode] = useState<Mode>("invoice");
  const [email, setEmail] = useState("");
  const [invoiceCode, setInvoiceCode] = useState("");
  const [customAmount, setCustomAmount] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleInvoiceLookup() {
    if (!email || !invoiceCode) {
      setError("Please enter your email and invoice code.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/stripe/lookup-invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, invoiceCode }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || "Invoice not found. Check your email and code, or contact us.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  }

  async function handleCustomPayment() {
    const cents = Math.round(parseFloat(customAmount) * 100);
    if (!cents || cents < 50) {
      setError("Minimum payment is $0.50");
      return;
    }
    if (!email) {
      setError("Please enter your email.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/stripe/create-checkout-custom", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: cents,
          description: description || "Sierra-117 Payment",
          customerEmail: email,
        }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || "Failed to create payment session.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  }

  return (
    <div className="glow-border rounded-xl bg-brand-primary/30 backdrop-blur overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-6 py-3 border-b border-brand-accent/10 bg-brand-primary/50">
        <div className="h-3 w-3 rounded-full bg-red-500/60" />
        <div className="h-3 w-3 rounded-full bg-yellow-500/60" />
        <div className="h-3 w-3 rounded-full bg-green-500/60" />
        <span className="ml-2 font-mono text-xs text-brand-text/60">
          sierra-117 — payment terminal
        </span>
      </div>

      <div className="p-8">
        {/* Mode Toggle */}
        <div className="flex rounded-lg border border-brand-accent/10 bg-brand-bg/50 p-1 mb-8">
          <button
            onClick={() => { setMode("invoice"); setError(""); }}
            className={`flex-1 rounded-md px-4 py-2.5 font-mono text-sm transition-all ${
              mode === "invoice"
                ? "bg-brand-accent/10 text-brand-accent border border-brand-accent/20"
                : "text-brand-text hover:text-foreground"
            }`}
          >
            Pay Invoice
          </button>
          <button
            onClick={() => { setMode("custom"); setError(""); }}
            className={`flex-1 rounded-md px-4 py-2.5 font-mono text-sm transition-all ${
              mode === "custom"
                ? "bg-brand-accent/10 text-brand-accent border border-brand-accent/20"
                : "text-brand-text hover:text-foreground"
            }`}
          >
            Pay Custom Amount
          </button>
        </div>

        {mode === "invoice" ? (
          <div className="space-y-6">
            <div className="rounded-lg border border-brand-accent/10 bg-brand-bg/30 p-4 mb-2">
              <p className="font-mono text-xs text-brand-text/50">
                Enter the invoice code we sent you along with your email to
                pull up your payment.
              </p>
            </div>

            <div>
              <label className="block font-mono text-xs uppercase tracking-widest text-brand-accent mb-2">
                Email *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full rounded-lg border border-brand-accent/10 bg-brand-bg/50 px-4 py-3 font-mono text-sm text-foreground placeholder:text-brand-text/40 focus:border-brand-accent/30 focus:outline-none focus:ring-1 focus:ring-brand-accent/20 transition-colors"
              />
            </div>

            <div>
              <label className="block font-mono text-xs uppercase tracking-widest text-brand-accent mb-2">
                Invoice Code *
              </label>
              <input
                type="text"
                value={invoiceCode}
                onChange={(e) => setInvoiceCode(e.target.value)}
                placeholder="INV-XXXXXXXX"
                className="w-full rounded-lg border border-brand-accent/10 bg-brand-bg/50 px-4 py-3 font-mono text-sm text-foreground placeholder:text-brand-text/40 focus:border-brand-accent/30 focus:outline-none focus:ring-1 focus:ring-brand-accent/20 transition-colors"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-3">
                <AlertCircle className="h-4 w-4 text-red-400 flex-shrink-0" />
                <p className="font-mono text-xs text-red-400">{error}</p>
              </div>
            )}

            <button
              onClick={handleInvoiceLookup}
              disabled={loading || !email || !invoiceCode}
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-brand-accent px-8 py-4 font-mono text-sm font-bold text-brand-bg hover:bg-brand-accent-light transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_20px_rgba(52,211,153,0.15)]"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Looking up invoice...
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4" />
                  Find & Pay Invoice
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="rounded-lg border border-brand-accent/10 bg-brand-bg/30 p-4 mb-2">
              <p className="font-mono text-xs text-brand-text/50">
                Pay a specific amount — use this if we gave you a total over
                email or on a call.
              </p>
            </div>

            <div>
              <label className="block font-mono text-xs uppercase tracking-widest text-brand-accent mb-2">
                Amount (USD) *
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-sm text-brand-text/40">
                  $
                </span>
                <input
                  type="number"
                  min="0.50"
                  step="0.01"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full rounded-lg border border-brand-accent/10 bg-brand-bg/50 pl-8 pr-4 py-3 font-mono text-sm text-foreground placeholder:text-brand-text/40 focus:border-brand-accent/30 focus:outline-none focus:ring-1 focus:ring-brand-accent/20 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block font-mono text-xs uppercase tracking-widest text-brand-accent mb-2">
                What&apos;s this for?
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Website deposit, monthly retainer"
                className="w-full rounded-lg border border-brand-accent/10 bg-brand-bg/50 px-4 py-3 font-mono text-sm text-foreground placeholder:text-brand-text/40 focus:border-brand-accent/30 focus:outline-none focus:ring-1 focus:ring-brand-accent/20 transition-colors"
              />
            </div>

            <div>
              <label className="block font-mono text-xs uppercase tracking-widest text-brand-accent mb-2">
                Email *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full rounded-lg border border-brand-accent/10 bg-brand-bg/50 px-4 py-3 font-mono text-sm text-foreground placeholder:text-brand-text/40 focus:border-brand-accent/30 focus:outline-none focus:ring-1 focus:ring-brand-accent/20 transition-colors"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-3">
                <AlertCircle className="h-4 w-4 text-red-400 flex-shrink-0" />
                <p className="font-mono text-xs text-red-400">{error}</p>
              </div>
            )}

            <button
              onClick={handleCustomPayment}
              disabled={loading || !customAmount || !email}
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-brand-accent px-8 py-4 font-mono text-sm font-bold text-brand-bg hover:bg-brand-accent-light transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_20px_rgba(52,211,153,0.15)]"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Redirecting to Stripe...
                </>
              ) : (
                <>
                  <CreditCard className="h-4 w-4" />
                  Pay{" "}
                  {customAmount
                    ? `$${parseFloat(customAmount).toFixed(2)}`
                    : "Now"}
                </>
              )}
            </button>
          </div>
        )}

        {/* Footer */}
        <div className="mt-6 rounded-lg border border-brand-accent/10 bg-brand-bg/30 p-4">
          <div className="font-mono text-[10px] text-brand-text/40 space-y-1">
            <p>
              <span className="text-brand-accent">$</span> payment.provider:
              stripe
            </p>
            <p>
              <span className="text-brand-accent">$</span> encryption: AES-256
            </p>
            <p>
              <span className="text-brand-accent">$</span> compliance: PCI DSS
              Level 1
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
