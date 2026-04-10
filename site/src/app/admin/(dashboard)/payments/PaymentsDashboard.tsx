"use client";

import { useState } from "react";
import { Plus, Loader2, X } from "lucide-react";
import { createStripeProduct } from "@/app/admin/actions";
import { formatCurrency } from "@/lib/utils";

interface Payment {
  id: string;
  customer_email: string | null;
  amount: number;
  description: string | null;
  status: string;
  mode: string;
  stripe_session_id: string | null;
  created_at: string;
}

export function PaymentsDashboard({ payments }: { payments: Payment[] }) {
  const [showCreateProduct, setShowCreateProduct] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ productId: string; priceId: string } | null>(null);

  const totalRevenue = payments
    .filter((p) => p.status === "completed" || p.status === "invoiced")
    .reduce((sum, p) => sum + (p.amount ?? 0), 0);

  const oneTimePayments = payments.filter((p) => p.mode === "payment");
  const subscriptions = payments.filter((p) => p.mode === "subscription");

  async function handleCreateProduct(formData: FormData) {
    setLoading(true);
    try {
      const res = await createStripeProduct(formData);
      setResult({ productId: res.productId!, priceId: res.priceId! });
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }

  return (
    <>
      {/* Revenue Stats */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <div className="rounded-xl border border-white/5 bg-white/5 p-6">
          <p className="font-mono text-xs text-white/30 mb-1">TOTAL REVENUE</p>
          <p className="font-mono text-2xl font-bold text-brand-accent">
            {formatCurrency(totalRevenue)}
          </p>
        </div>
        <div className="rounded-xl border border-white/5 bg-white/5 p-6">
          <p className="font-mono text-xs text-white/30 mb-1">ONE-TIME PAYMENTS</p>
          <p className="font-mono text-2xl font-bold text-white">{oneTimePayments.length}</p>
        </div>
        <div className="rounded-xl border border-white/5 bg-white/5 p-6">
          <p className="font-mono text-xs text-white/30 mb-1">SUBSCRIPTIONS</p>
          <p className="font-mono text-2xl font-bold text-white">{subscriptions.length}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="mb-6">
        <button
          onClick={() => {
            setShowCreateProduct(true);
            setResult(null);
          }}
          className="inline-flex items-center gap-2 rounded-lg bg-brand-accent px-4 py-2.5 font-mono text-sm font-bold text-brand-bg hover:bg-brand-accent-light transition-all"
        >
          <Plus className="h-4 w-4" />
          Create Product / Price
        </button>
      </div>

      {/* Payments Table */}
      <div className="rounded-xl border border-white/5 bg-white/5 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/5">
              <th className="px-6 py-3 text-left font-mono text-xs uppercase tracking-widest text-white/30">Customer</th>
              <th className="px-6 py-3 text-left font-mono text-xs uppercase tracking-widest text-white/30">Amount</th>
              <th className="px-6 py-3 text-left font-mono text-xs uppercase tracking-widest text-white/30">Description</th>
              <th className="px-6 py-3 text-left font-mono text-xs uppercase tracking-widest text-white/30">Type</th>
              <th className="px-6 py-3 text-left font-mono text-xs uppercase tracking-widest text-white/30">Status</th>
              <th className="px-6 py-3 text-left font-mono text-xs uppercase tracking-widest text-white/30">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {payments.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center font-mono text-sm text-white/20">
                  No payments recorded yet.
                </td>
              </tr>
            ) : (
              payments.map((payment) => (
                <tr key={payment.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 font-mono text-sm text-white/50">{payment.customer_email ?? "—"}</td>
                  <td className="px-6 py-4 font-mono text-sm text-white font-bold">
                    {formatCurrency(payment.amount)}
                  </td>
                  <td className="px-6 py-4 font-mono text-sm text-white/50">{payment.description ?? "—"}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 font-mono text-[10px] ${
                        payment.mode === "subscription"
                          ? "bg-blue-500/10 text-blue-400"
                          : "bg-brand-accent/10 text-brand-accent"
                      }`}
                    >
                      {payment.mode}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 font-mono text-[10px] ${
                        payment.status === "completed"
                          ? "bg-brand-accent/10 text-brand-accent"
                          : payment.status === "active"
                            ? "bg-blue-500/10 text-blue-400"
                            : "bg-yellow-500/10 text-yellow-400"
                      }`}
                    >
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-white/30">
                    {new Date(payment.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Create Product Modal */}
      {showCreateProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-white/10 bg-[#0a0f0a] p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-mono text-lg font-bold text-white">Create Stripe Product</h3>
              <button
                onClick={() => setShowCreateProduct(false)}
                className="text-white/30 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {result ? (
              <div className="space-y-4">
                <div className="rounded-lg border border-brand-accent/20 bg-brand-accent/5 p-4">
                  <p className="font-mono text-sm text-brand-accent font-bold mb-2">Product Created!</p>
                  <p className="font-mono text-xs text-white/50">
                    Product ID: <span className="text-white/70">{result.productId}</span>
                  </p>
                  <p className="font-mono text-xs text-white/50 mt-1">
                    Price ID: <span className="text-white/70">{result.priceId}</span>
                  </p>
                </div>
                <p className="font-mono text-[10px] text-white/30">
                  Use this Price ID when creating subscriptions for customers.
                </p>
                <button
                  onClick={() => setShowCreateProduct(false)}
                  className="w-full rounded-lg border border-white/10 px-4 py-2.5 font-mono text-sm text-white/50 hover:text-white hover:border-white/20 transition-all"
                >
                  Close
                </button>
              </div>
            ) : (
              <form action={handleCreateProduct} className="space-y-4">
                <div>
                  <label className="block font-mono text-xs uppercase tracking-widest text-brand-accent mb-2">
                    Product Name *
                  </label>
                  <input
                    name="name"
                    required
                    placeholder="e.g. Website Maintenance"
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 font-mono text-sm text-white placeholder:text-white/20 focus:border-brand-accent/30 focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block font-mono text-xs uppercase tracking-widest text-brand-accent mb-2">
                    Amount (cents) *
                  </label>
                  <input
                    name="amount"
                    type="number"
                    min="50"
                    required
                    placeholder="e.g. 9900 = $99.00"
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 font-mono text-sm text-white placeholder:text-white/20 focus:border-brand-accent/30 focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      name="recurring"
                      type="checkbox"
                      value="true"
                      className="rounded border-white/10 bg-white/5 text-brand-accent focus:ring-brand-accent"
                    />
                    <span className="font-mono text-sm text-white/50">Recurring subscription</span>
                  </label>
                </div>
                <div>
                  <label className="block font-mono text-xs uppercase tracking-widest text-brand-accent mb-2">
                    Billing Interval
                  </label>
                  <select
                    name="interval"
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 font-mono text-sm text-white focus:border-brand-accent/30 focus:outline-none transition-colors"
                  >
                    <option value="month">Monthly</option>
                    <option value="year">Yearly</option>
                    <option value="week">Weekly</option>
                  </select>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-lg bg-brand-accent px-6 py-3 font-mono text-sm font-bold text-brand-bg hover:bg-brand-accent-light transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <span className="inline-flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Creating...
                    </span>
                  ) : (
                    "Create Product"
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
