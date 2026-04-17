"use client";

import { useState } from "react";
import { Plus, Trash2, CreditCard, RefreshCw, X, Loader2, Copy, Check } from "lucide-react";
import { createCustomer, deleteCustomer, createOneTimeCharge, createSubscription } from "@/app/admin/actions";

interface Customer {
  id: string;
  name: string;
  email: string;
  company: string | null;
  phone: string | null;
  stripe_customer_id: string | null;
  created_at: string;
}

export function CustomerList({ customers }: { customers: Customer[] }) {
  const [showAdd, setShowAdd] = useState(false);
  const [showCharge, setShowCharge] = useState<Customer | null>(null);
  const [showSubscription, setShowSubscription] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(false);
  const [invoiceResult, setInvoiceResult] = useState<{ invoiceId: string; customerName: string } | null>(null);

  async function handleCreateCustomer(formData: FormData) {
    setLoading(true);
    try {
      await createCustomer(formData);
      setShowAdd(false);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this customer?")) return;
    await deleteCustomer(id);
  }

  async function handleCharge(formData: FormData) {
    setLoading(true);
    try {
      const customerName = showCharge?.name ?? "Customer";
      const result = await createOneTimeCharge(formData);
      setShowCharge(null);
      if (result.invoiceId) {
        setInvoiceResult({ invoiceId: result.invoiceId, customerName });
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }

  async function handleSubscription(formData: FormData) {
    setLoading(true);
    try {
      await createSubscription(formData);
      setShowSubscription(null);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }

  return (
    <>
      <div style={{ marginBottom: 20 }}>
        <button type="button" className="admin-btn admin-btn-primary" onClick={() => setShowAdd(true)}>
          <Plus aria-hidden="true" style={{ width: 14, height: 14 }} />
          Add customer
        </button>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Company</th>
              <th>Stripe</th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: "center", padding: "40px 20px", color: "var(--ink-soft)" }}>
                  No customers yet. Add your first customer above.
                </td>
              </tr>
            ) : (
              customers.map((customer) => (
                <tr key={customer.id}>
                  <td style={{ color: "var(--ink)", fontWeight: 500 }}>{customer.name}</td>
                  <td style={{ color: "var(--ink-soft)", fontFamily: "var(--font-mono-family)", fontSize: 13 }}>
                    {customer.email}
                  </td>
                  <td style={{ color: "var(--ink-soft)" }}>{customer.company ?? "—"}</td>
                  <td>
                    {customer.stripe_customer_id ? (
                      <span className="admin-badge accent">
                        <CreditCard aria-hidden="true" style={{ width: 11, height: 11 }} />
                        linked
                      </span>
                    ) : (
                      <span className="admin-badge">not linked</span>
                    )}
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <div style={{ display: "inline-flex", gap: 6 }}>
                      {customer.stripe_customer_id && (
                        <>
                          <button
                            type="button"
                            className="admin-btn admin-btn-ghost"
                            style={{ padding: "7px 9px" }}
                            onClick={() => setShowCharge(customer)}
                            title="One-time charge"
                          >
                            <CreditCard aria-hidden="true" style={{ width: 13, height: 13 }} />
                          </button>
                          <button
                            type="button"
                            className="admin-btn admin-btn-ghost"
                            style={{ padding: "7px 9px" }}
                            onClick={() => setShowSubscription(customer)}
                            title="Add subscription"
                          >
                            <RefreshCw aria-hidden="true" style={{ width: 13, height: 13 }} />
                          </button>
                        </>
                      )}
                      <button
                        type="button"
                        className="admin-btn admin-btn-danger"
                        style={{ padding: "7px 9px" }}
                        onClick={() => handleDelete(customer.id)}
                        title="Delete"
                      >
                        <Trash2 aria-hidden="true" style={{ width: 13, height: 13 }} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showAdd && (
        <Modal title="Add customer" onClose={() => setShowAdd(false)}>
          <form action={handleCreateCustomer}>
            <FormField name="name" label="Name" required />
            <FormField name="email" label="Email" type="email" required />
            <FormField name="company" label="Company" />
            <FormField name="phone" label="Phone" />
            <SubmitButton loading={loading} label="Create customer" />
          </form>
        </Modal>
      )}

      {showCharge && (
        <Modal title={`Charge ${showCharge.name}`} onClose={() => setShowCharge(null)}>
          <form action={handleCharge}>
            <input type="hidden" name="stripeCustomerId" value={showCharge.stripe_customer_id ?? ""} />
            <input type="hidden" name="customerEmail" value={showCharge.email} />
            <div className="admin-field">
              <label htmlFor="charge-amount">Amount (cents) *</label>
              <input
                id="charge-amount"
                name="amount"
                type="number"
                min={50}
                required
                placeholder="e.g. 5000 = $50.00"
                className="admin-input"
              />
              <p
                style={{
                  marginTop: 6,
                  fontFamily: "var(--font-mono-family)",
                  fontSize: 11,
                  color: "var(--ink-faint)",
                }}
              >
                Enter amount in cents. 100 = $1.00
              </p>
            </div>
            <FormField name="description" label="Description" required />
            <SubmitButton loading={loading} label="Send invoice" />
          </form>
        </Modal>
      )}

      {showSubscription && (
        <Modal title={`Subscribe ${showSubscription.name}`} onClose={() => setShowSubscription(null)}>
          <form action={handleSubscription}>
            <input type="hidden" name="stripeCustomerId" value={showSubscription.stripe_customer_id ?? ""} />
            <input type="hidden" name="customerEmail" value={showSubscription.email} />
            <FormField name="priceId" label="Stripe Price ID" required placeholder="price_..." />
            <p
              style={{
                marginTop: 6,
                fontFamily: "var(--font-mono-family)",
                fontSize: 11,
                color: "var(--ink-faint)",
              }}
            >
              Create prices in your Stripe dashboard first, then paste the Price ID here.
            </p>
            <SubmitButton loading={loading} label="Create subscription" />
          </form>
        </Modal>
      )}

      {invoiceResult && (
        <Modal title="Invoice sent" onClose={() => setInvoiceResult(null)}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div
              style={{
                borderRadius: 10,
                border: "1px solid color-mix(in oklab, var(--accent) 40%, transparent)",
                background: "var(--accent-soft)",
                padding: 16,
              }}
            >
              <p style={{ color: "var(--ink)", fontWeight: 500, marginBottom: 8 }}>
                Invoice sent to {invoiceResult.customerName}
              </p>
              <p style={{ fontFamily: "var(--font-mono-family)", fontSize: 12, color: "var(--ink-soft)", marginBottom: 10 }}>
                Share this code with your customer so they can pay at /pay:
              </p>
              <CopyableCode value={invoiceResult.invoiceId} />
            </div>
            <p style={{ fontFamily: "var(--font-mono-family)", fontSize: 11, color: "var(--ink-faint)" }}>
              The customer can also pay directly from the email Stripe sent them.
            </p>
            <button
              type="button"
              className="admin-btn admin-btn-ghost"
              style={{ width: "100%", justifyContent: "center" }}
              onClick={() => setInvoiceResult(null)}
            >
              Done
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}

function CopyableCode({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <code
        style={{
          flex: 1,
          borderRadius: 8,
          background: "var(--bg)",
          border: "1px solid var(--rule-strong)",
          padding: "10px 14px",
          fontFamily: "var(--font-mono-family)",
          fontSize: 14,
          color: "var(--ink)",
          userSelect: "all",
          overflow: "auto",
        }}
      >
        {value}
      </code>
      <button
        type="button"
        className="admin-btn admin-btn-ghost"
        style={{ padding: "8px 10px" }}
        onClick={handleCopy}
        title="Copy to clipboard"
      >
        {copied ? (
          <Check aria-hidden="true" style={{ width: 14, height: 14, color: "var(--accent)" }} />
        ) : (
          <Copy aria-hidden="true" style={{ width: 14, height: 14 }} />
        )}
      </button>
    </div>
  );
}

function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
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
        if (e.target === e.currentTarget) onClose();
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
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h3
            style={{
              fontFamily: "var(--font-display-family)",
              fontSize: 22,
              letterSpacing: "-0.015em",
              color: "var(--ink)",
              fontWeight: 400,
            }}
          >
            {title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
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
        {children}
      </div>
    </div>
  );
}

function FormField({
  name,
  label,
  type = "text",
  required = false,
  placeholder,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div className="admin-field">
      <label htmlFor={`cust-${name}`}>
        {label} {required && "*"}
      </label>
      <input
        id={`cust-${name}`}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="admin-input"
      />
    </div>
  );
}

function SubmitButton({ loading, label }: { loading: boolean; label: string }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="admin-btn admin-btn-primary"
      style={{ width: "100%", justifyContent: "center", marginTop: 18 }}
    >
      {loading ? (
        <>
          <Loader2 aria-hidden="true" style={{ width: 14, height: 14 }} className="animate-spin" />
          Processing…
        </>
      ) : (
        label
      )}
    </button>
  );
}
