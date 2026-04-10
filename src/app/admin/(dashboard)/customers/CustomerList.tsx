"use client";

import { useState } from "react";
import { Plus, Trash2, CreditCard, RefreshCw, X, Loader2, Copy, Check } from "lucide-react";
import { createCustomer, deleteCustomer, createOneTimeCharge, createSubscription } from "@/app/admin/actions";
import { formatCurrency } from "@/lib/utils";

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
      {/* Add Button */}
      <div className="mb-6">
        <button
          onClick={() => setShowAdd(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-brand-accent px-4 py-2.5 font-mono text-sm font-bold text-brand-bg hover:bg-brand-accent-light transition-all"
        >
          <Plus className="h-4 w-4" />
          Add Customer
        </button>
      </div>

      {/* Customer Table */}
      <div className="rounded-xl border border-white/5 bg-white/5 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/5">
              <th className="px-6 py-3 text-left font-mono text-xs uppercase tracking-widest text-white/30">Name</th>
              <th className="px-6 py-3 text-left font-mono text-xs uppercase tracking-widest text-white/30">Email</th>
              <th className="px-6 py-3 text-left font-mono text-xs uppercase tracking-widest text-white/30">Company</th>
              <th className="px-6 py-3 text-left font-mono text-xs uppercase tracking-widest text-white/30">Stripe</th>
              <th className="px-6 py-3 text-right font-mono text-xs uppercase tracking-widest text-white/30">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {customers.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center font-mono text-sm text-white/20">
                  No customers yet. Add your first customer above.
                </td>
              </tr>
            ) : (
              customers.map((customer) => (
                <tr key={customer.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 font-mono text-sm text-white">{customer.name}</td>
                  <td className="px-6 py-4 font-mono text-sm text-white/50">{customer.email}</td>
                  <td className="px-6 py-4 font-mono text-sm text-white/50">{customer.company ?? "—"}</td>
                  <td className="px-6 py-4">
                    {customer.stripe_customer_id ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-brand-accent/10 px-2 py-1 font-mono text-[10px] text-brand-accent">
                        <CreditCard className="h-3 w-3" />
                        linked
                      </span>
                    ) : (
                      <span className="font-mono text-[10px] text-white/20">not linked</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {customer.stripe_customer_id && (
                        <>
                          <button
                            onClick={() => setShowCharge(customer)}
                            title="One-time charge"
                            className="rounded-lg border border-white/5 p-2 text-white/30 hover:text-brand-accent hover:border-brand-accent/20 transition-colors"
                          >
                            <CreditCard className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => setShowSubscription(customer)}
                            title="Add subscription"
                            className="rounded-lg border border-white/5 p-2 text-white/30 hover:text-brand-accent hover:border-brand-accent/20 transition-colors"
                          >
                            <RefreshCw className="h-3.5 w-3.5" />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleDelete(customer.id)}
                        className="rounded-lg border border-white/5 p-2 text-white/30 hover:text-red-400 hover:border-red-400/20 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Customer Modal */}
      {showAdd && (
        <Modal title="Add Customer" onClose={() => setShowAdd(false)}>
          <form action={handleCreateCustomer} className="space-y-4">
            <FormField name="name" label="Name" required />
            <FormField name="email" label="Email" type="email" required />
            <FormField name="company" label="Company" />
            <FormField name="phone" label="Phone" />
            <SubmitButton loading={loading} label="Create Customer" />
          </form>
        </Modal>
      )}

      {/* One-Time Charge Modal */}
      {showCharge && (
        <Modal title={`Charge ${showCharge.name}`} onClose={() => setShowCharge(null)}>
          <form action={handleCharge} className="space-y-4">
            <input type="hidden" name="stripeCustomerId" value={showCharge.stripe_customer_id ?? ""} />
            <input type="hidden" name="customerEmail" value={showCharge.email} />
            <div>
              <label className="block font-mono text-xs uppercase tracking-widest text-brand-accent mb-2">
                Amount (cents) *
              </label>
              <input
                name="amount"
                type="number"
                min="50"
                required
                placeholder="e.g. 5000 = $50.00"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 font-mono text-sm text-white placeholder:text-white/20 focus:border-brand-accent/30 focus:outline-none transition-colors"
              />
              <p className="mt-1 font-mono text-[10px] text-white/20">Enter amount in cents. 100 = $1.00</p>
            </div>
            <FormField name="description" label="Description" required />
            <SubmitButton loading={loading} label="Send Invoice" />
          </form>
        </Modal>
      )}

      {/* Subscription Modal */}
      {showSubscription && (
        <Modal title={`Subscribe ${showSubscription.name}`} onClose={() => setShowSubscription(null)}>
          <form action={handleSubscription} className="space-y-4">
            <input type="hidden" name="stripeCustomerId" value={showSubscription.stripe_customer_id ?? ""} />
            <input type="hidden" name="customerEmail" value={showSubscription.email} />
            <FormField name="priceId" label="Stripe Price ID" required placeholder="price_..." />
            <p className="font-mono text-[10px] text-white/20">
              Create prices in your Stripe Dashboard first, then paste the Price ID here.
            </p>
            <SubmitButton loading={loading} label="Create Subscription" />
          </form>
        </Modal>
      )}
      {/* Invoice Created Modal */}
      {invoiceResult && (
        <Modal title="Invoice Sent" onClose={() => setInvoiceResult(null)}>
          <div className="space-y-4">
            <div className="rounded-lg border border-brand-accent/20 bg-brand-accent/5 p-4">
              <p className="font-mono text-sm text-brand-accent font-bold mb-3">
                Invoice sent to {invoiceResult.customerName}
              </p>
              <p className="font-mono text-xs text-white/40 mb-2">
                Share this code with your customer so they can pay at /pay:
              </p>
              <CopyableCode value={invoiceResult.invoiceId} />
            </div>
            <p className="font-mono text-[10px] text-white/30">
              The customer can also pay directly from the email Stripe sent them.
            </p>
            <button
              onClick={() => setInvoiceResult(null)}
              className="w-full rounded-lg border border-white/10 px-4 py-2.5 font-mono text-sm text-white/50 hover:text-white hover:border-white/20 transition-all"
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
    <div className="flex items-center gap-2">
      <code className="flex-1 rounded-lg bg-white/5 border border-white/10 px-4 py-2.5 font-mono text-sm text-white select-all">
        {value}
      </code>
      <button
        onClick={handleCopy}
        className="rounded-lg border border-white/10 p-2.5 text-white/30 hover:text-brand-accent hover:border-brand-accent/20 transition-colors"
        title="Copy to clipboard"
      >
        {copied ? <Check className="h-4 w-4 text-brand-accent" /> : <Copy className="h-4 w-4" />}
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl border border-white/10 bg-[#080c10] p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-mono text-lg font-bold text-white">{title}</h3>
          <button onClick={onClose} className="text-white/30 hover:text-white transition-colors">
            <X className="h-5 w-5" />
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
    <div>
      <label className="block font-mono text-xs uppercase tracking-widest text-brand-accent mb-2">
        {label} {required && "*"}
      </label>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 font-mono text-sm text-white placeholder:text-white/20 focus:border-brand-accent/30 focus:outline-none transition-colors"
      />
    </div>
  );
}

function SubmitButton({ loading, label }: { loading: boolean; label: string }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="w-full rounded-lg bg-brand-accent px-6 py-3 font-mono text-sm font-bold text-brand-bg hover:bg-brand-accent-light transition-all disabled:opacity-50"
    >
      {loading ? (
        <span className="inline-flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          Processing...
        </span>
      ) : (
        label
      )}
    </button>
  );
}
