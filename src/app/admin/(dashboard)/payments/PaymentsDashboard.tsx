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
      <div className="admin-grid" style={{ marginBottom: 28 }}>
        <div className="admin-card" style={{ cursor: "default" }}>
          <div className="label">Total revenue</div>
          <div className="value" style={{ color: "var(--accent)" }}>
            {formatCurrency(totalRevenue)}
          </div>
        </div>
        <div className="admin-card" style={{ cursor: "default" }}>
          <div className="label">One-time payments</div>
          <div className="value">{oneTimePayments.length}</div>
        </div>
        <div className="admin-card" style={{ cursor: "default" }}>
          <div className="label">Subscriptions</div>
          <div className="value">{subscriptions.length}</div>
        </div>
      </div>

      <div style={{ marginBottom: 20 }}>
        <button
          type="button"
          className="admin-btn admin-btn-primary"
          onClick={() => {
            setShowCreateProduct(true);
            setResult(null);
          }}
        >
          <Plus aria-hidden="true" style={{ width: 14, height: 14 }} />
          Create product / price
        </button>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Amount</th>
              <th>Description</th>
              <th>Invoice ID</th>
              <th>Type</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {payments.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", padding: "40px 20px", color: "var(--ink-soft)" }}>
                  No payments recorded yet.
                </td>
              </tr>
            ) : (
              payments.map((payment) => (
                <tr key={payment.id}>
                  <td style={{ color: "var(--ink-soft)", fontFamily: "var(--font-mono-family)", fontSize: 13 }}>
                    {payment.customer_email ?? "—"}
                  </td>
                  <td style={{ color: "var(--ink)", fontWeight: 500 }}>{formatCurrency(payment.amount)}</td>
                  <td style={{ color: "var(--ink-soft)" }}>{payment.description ?? "—"}</td>
                  <td style={{ color: "var(--ink-faint)", fontFamily: "var(--font-mono-family)", fontSize: 12 }}>
                    {payment.stripe_session_id ?? "—"}
                  </td>
                  <td>
                    <span className={`admin-badge ${payment.mode === "subscription" ? "accent" : "ok"}`}>
                      {payment.mode}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`admin-badge ${
                        payment.status === "completed"
                          ? "ok"
                          : payment.status === "active"
                          ? "accent"
                          : "warn"
                      }`}
                    >
                      {payment.status}
                    </span>
                  </td>
                  <td style={{ color: "var(--ink-faint)", fontFamily: "var(--font-mono-family)", fontSize: 12 }}>
                    {new Date(payment.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showCreateProduct && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Create Stripe product"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
            background: "rgba(10, 10, 10, 0.55)",
            backdropFilter: "blur(6px)",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowCreateProduct(false);
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 440,
              borderRadius: 14,
              border: "1px solid var(--rule-strong)",
              background: "var(--bg-elev)",
              padding: 28,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <h3
                style={{
                  fontFamily: "var(--font-display-family)",
                  fontSize: 22,
                  letterSpacing: "-0.015em",
                  color: "var(--ink)",
                  fontWeight: 400,
                }}
              >
                Create Stripe product
              </h3>
              <button
                type="button"
                aria-label="Close"
                onClick={() => setShowCreateProduct(false)}
                style={{
                  background: "none",
                  border: 0,
                  color: "var(--ink-soft)",
                  cursor: "pointer",
                  padding: 4,
                  lineHeight: 0,
                }}
              >
                <X aria-hidden="true" style={{ width: 18, height: 18 }} />
              </button>
            </div>

            {result ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div
                  style={{
                    borderRadius: 10,
                    border: "1px solid color-mix(in oklab, var(--accent) 40%, transparent)",
                    background: "var(--accent-soft)",
                    padding: 16,
                  }}
                >
                  <p style={{ color: "var(--ink)", fontWeight: 500, marginBottom: 10 }}>Product created</p>
                  <p style={{ fontFamily: "var(--font-mono-family)", fontSize: 12, color: "var(--ink-soft)" }}>
                    Product ID: <span style={{ color: "var(--ink)" }}>{result.productId}</span>
                  </p>
                  <p style={{ fontFamily: "var(--font-mono-family)", fontSize: 12, color: "var(--ink-soft)", marginTop: 4 }}>
                    Price ID: <span style={{ color: "var(--ink)" }}>{result.priceId}</span>
                  </p>
                </div>
                <p style={{ fontFamily: "var(--font-mono-family)", fontSize: 11, color: "var(--ink-faint)" }}>
                  Use this Price ID when creating subscriptions for customers.
                </p>
                <button
                  type="button"
                  className="admin-btn admin-btn-ghost"
                  style={{ width: "100%", justifyContent: "center" }}
                  onClick={() => setShowCreateProduct(false)}
                >
                  Close
                </button>
              </div>
            ) : (
              <form action={handleCreateProduct}>
                <div className="admin-field">
                  <label htmlFor="pd-name">Product name *</label>
                  <input id="pd-name" name="name" required placeholder="e.g. Website Maintenance" className="admin-input" />
                </div>
                <div className="admin-field">
                  <label htmlFor="pd-amount">Amount (cents) *</label>
                  <input
                    id="pd-amount"
                    name="amount"
                    type="number"
                    min={50}
                    required
                    placeholder="e.g. 9900 = $99.00"
                    className="admin-input"
                  />
                </div>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    cursor: "pointer",
                    marginTop: 14,
                    fontFamily: "var(--font-mono-family)",
                    fontSize: 13,
                    color: "var(--ink-soft)",
                  }}
                >
                  <input name="recurring" type="checkbox" value="true" style={{ accentColor: "var(--accent)" }} />
                  Recurring subscription
                </label>
                <div className="admin-field" style={{ marginTop: 14 }}>
                  <label htmlFor="pd-interval">Billing interval</label>
                  <select id="pd-interval" name="interval" className="admin-input">
                    <option value="month">Monthly</option>
                    <option value="year">Yearly</option>
                    <option value="week">Weekly</option>
                  </select>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="admin-btn admin-btn-primary"
                  style={{ width: "100%", justifyContent: "center", marginTop: 18 }}
                >
                  {loading ? (
                    <>
                      <Loader2 aria-hidden="true" style={{ width: 14, height: 14 }} className="animate-spin" />
                      Creating…
                    </>
                  ) : (
                    "Create product"
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
