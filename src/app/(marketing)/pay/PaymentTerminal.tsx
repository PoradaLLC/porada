"use client";

import { useState } from "react";
import { CreditCard, Loader2, AlertCircle, Terminal } from "lucide-react";

type PaymentMode = "one-time" | "subscription";

interface PricingOption {
  id: string;
  name: string;
  amount: number;
  mode: PaymentMode;
  interval?: string;
}

const pricingOptions: PricingOption[] = [
  { id: "starter-site", name: "Starter Website", amount: 150000, mode: "one-time" },
  { id: "business-site", name: "Business Website", amount: 350000, mode: "one-time" },
  { id: "ecommerce-site", name: "E-Commerce Platform", amount: 750000, mode: "one-time" },
  { id: "maintenance-monthly", name: "Monthly Maintenance", amount: 19900, mode: "subscription", interval: "month" },
  { id: "support-monthly", name: "Priority Support", amount: 49900, mode: "subscription", interval: "month" },
];

function formatUSD(cents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

export function PaymentTerminal() {
  const [mode, setMode] = useState<"preset" | "custom">("preset");
  const [selected, setSelected] = useState<string | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handlePayPreset() {
    if (!selected || !email) {
      setError("Please select a service and enter your email.");
      return;
    }

    const option = pricingOptions.find((o) => o.id === selected);
    if (!option) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          priceId: option.id,
          mode: option.mode,
          customerEmail: email,
        }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || "Failed to create checkout session. Make sure Stripe is configured.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  }

  async function handlePayCustom() {
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
      const res = await fetch("/api/stripe/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: cents,
          description: description || "Custom payment",
          customerEmail: email,
        }),
      });

      const data = await res.json();
      if (data.clientSecret) {
        // For custom amounts, redirect to Stripe Checkout instead
        const checkoutRes = await fetch("/api/stripe/create-checkout-custom", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: cents,
            description: description || "Schtubbs Payment",
            customerEmail: email,
          }),
        });
        const checkoutData = await checkoutRes.json();
        if (checkoutData.url) {
          window.location.href = checkoutData.url;
        } else {
          setError(checkoutData.error || "Failed to create checkout session.");
        }
      } else {
        setError(data.error || "Failed to create payment. Make sure Stripe is configured.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  }

  return (
    <div className="glow-border rounded-xl bg-brand-primary/30 backdrop-blur overflow-hidden">
      {/* Terminal Header */}
      <div className="flex items-center gap-2 px-6 py-3 border-b border-brand-accent/10 bg-brand-primary/50">
        <div className="h-3 w-3 rounded-full bg-red-500/60" />
        <div className="h-3 w-3 rounded-full bg-yellow-500/60" />
        <div className="h-3 w-3 rounded-full bg-green-500/60" />
        <span className="ml-2 font-mono text-xs text-brand-text/60">
          schtubbs — payment terminal
        </span>
      </div>

      <div className="p-8">
        {/* Mode Toggle */}
        <div className="flex rounded-lg border border-brand-accent/10 bg-brand-bg/50 p-1 mb-8">
          <button
            onClick={() => { setMode("preset"); setError(""); }}
            className={`flex-1 rounded-md px-4 py-2.5 font-mono text-sm transition-all ${
              mode === "preset"
                ? "bg-brand-accent/10 text-brand-accent border border-brand-accent/20"
                : "text-brand-text hover:text-foreground"
            }`}
          >
            Select Service
          </button>
          <button
            onClick={() => { setMode("custom"); setError(""); }}
            className={`flex-1 rounded-md px-4 py-2.5 font-mono text-sm transition-all ${
              mode === "custom"
                ? "bg-brand-accent/10 text-brand-accent border border-brand-accent/20"
                : "text-brand-text hover:text-foreground"
            }`}
          >
            Custom Amount
          </button>
        </div>

        {mode === "preset" ? (
          <>
            {/* Preset Options */}
            <div className="space-y-3 mb-8">
              <p className="font-mono text-xs uppercase tracking-widest text-brand-accent mb-3">
                <Terminal className="inline h-3 w-3 mr-1" />
                One-Time Services
              </p>
              {pricingOptions
                .filter((o) => o.mode === "one-time")
                .map((option) => (
                  <label
                    key={option.id}
                    className={`flex items-center justify-between cursor-pointer rounded-lg border p-4 transition-all ${
                      selected === option.id
                        ? "border-brand-accent bg-brand-accent/5 text-brand-accent"
                        : "border-brand-accent/10 bg-brand-bg/30 text-brand-text hover:border-brand-accent/30"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="pricing"
                        value={option.id}
                        checked={selected === option.id}
                        onChange={() => setSelected(option.id)}
                        className="sr-only"
                      />
                      <div
                        className={`h-4 w-4 rounded-full border-2 flex items-center justify-center ${
                          selected === option.id
                            ? "border-brand-accent"
                            : "border-brand-text/30"
                        }`}
                      >
                        {selected === option.id && (
                          <div className="h-2 w-2 rounded-full bg-brand-accent" />
                        )}
                      </div>
                      <span className="font-mono text-sm">{option.name}</span>
                    </div>
                    <span className="font-mono text-sm font-bold">
                      {formatUSD(option.amount)}
                    </span>
                  </label>
                ))}

              <p className="font-mono text-xs uppercase tracking-widest text-brand-accent mt-6 mb-3">
                <Terminal className="inline h-3 w-3 mr-1" />
                Recurring Plans
              </p>
              {pricingOptions
                .filter((o) => o.mode === "subscription")
                .map((option) => (
                  <label
                    key={option.id}
                    className={`flex items-center justify-between cursor-pointer rounded-lg border p-4 transition-all ${
                      selected === option.id
                        ? "border-brand-accent bg-brand-accent/5 text-brand-accent"
                        : "border-brand-accent/10 bg-brand-bg/30 text-brand-text hover:border-brand-accent/30"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="pricing"
                        value={option.id}
                        checked={selected === option.id}
                        onChange={() => setSelected(option.id)}
                        className="sr-only"
                      />
                      <div
                        className={`h-4 w-4 rounded-full border-2 flex items-center justify-center ${
                          selected === option.id
                            ? "border-brand-accent"
                            : "border-brand-text/30"
                        }`}
                      >
                        {selected === option.id && (
                          <div className="h-2 w-2 rounded-full bg-brand-accent" />
                        )}
                      </div>
                      <span className="font-mono text-sm">{option.name}</span>
                    </div>
                    <span className="font-mono text-sm font-bold">
                      {formatUSD(option.amount)}
                      <span className="text-brand-text/40 font-normal">/mo</span>
                    </span>
                  </label>
                ))}
            </div>

            {/* Email */}
            <div className="mb-6">
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
              <div className="flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-3 mb-6">
                <AlertCircle className="h-4 w-4 text-red-400 flex-shrink-0" />
                <p className="font-mono text-xs text-red-400">{error}</p>
              </div>
            )}

            <button
              onClick={handlePayPreset}
              disabled={loading || !selected}
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
                  {selected
                    ? formatUSD(
                        pricingOptions.find((o) => o.id === selected)?.amount ?? 0
                      )
                    : "Now"}
                </>
              )}
            </button>
          </>
        ) : (
          <>
            {/* Custom Amount */}
            <div className="space-y-6 mb-8">
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
                  Description
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What is this payment for?"
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
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-3 mb-6">
                <AlertCircle className="h-4 w-4 text-red-400 flex-shrink-0" />
                <p className="font-mono text-xs text-red-400">{error}</p>
              </div>
            )}

            <button
              onClick={handlePayCustom}
              disabled={loading || !customAmount}
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
          </>
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
