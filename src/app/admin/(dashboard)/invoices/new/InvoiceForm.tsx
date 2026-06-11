"use client";

import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";

interface Props {
  action: (formData: FormData) => Promise<void>;
}

export function InvoiceForm({ action }: Props) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    const dollars = Number(fd.get("amount_dollars"));
    if (!Number.isFinite(dollars) || dollars <= 0) {
      setError("Enter an amount greater than zero.");
      return;
    }
    startTransition(async () => {
      try {
        await action(fd);
      } catch (err) {
        // redirect() from a server action throws NEXT_REDIRECT — let it propagate
        if (err instanceof Error && err.message.includes("NEXT_REDIRECT")) throw err;
        setError(err instanceof Error ? err.message : "Failed to create invoice");
      }
    });
  }

  return (
    <form className="admin-panel" onSubmit={handleSubmit} style={{ maxWidth: 640, padding: 28 }}>
      <div className="admin-field">
        <label htmlFor="inv-email">Customer email</label>
        <input
          id="inv-email"
          name="customer_email"
          type="email"
          className="admin-input"
          placeholder="client@example.com"
          required
          autoComplete="off"
        />
      </div>

      <div className="admin-field">
        <label htmlFor="inv-name">Customer name (optional)</label>
        <input
          id="inv-name"
          name="customer_name"
          type="text"
          className="admin-input"
          placeholder="Jordan Okafor"
          autoComplete="off"
        />
      </div>

      <div className="admin-field">
        <label htmlFor="inv-amount">Amount (USD)</label>
        <input
          id="inv-amount"
          name="amount_dollars"
          type="number"
          inputMode="decimal"
          min="0.50"
          max="100000"
          step="0.01"
          className="admin-input"
          placeholder="2450.00"
          required
        />
      </div>

      <div className="admin-field">
        <label htmlFor="inv-desc">Description</label>
        <textarea
          id="inv-desc"
          name="description"
          className="admin-input"
          placeholder="Phase 1 deposit — Fieldnotes Coffee website"
          rows={3}
          required
          maxLength={500}
        />
      </div>

      {error && (
        <div className="admin-error" role="alert" style={{ marginTop: 4 }}>
          {error}
        </div>
      )}

      <div style={{ marginTop: 24, display: "flex", gap: 12, justifyContent: "flex-end" }}>
        <button type="submit" className="admin-btn admin-btn-primary" disabled={pending}>
          {pending ? (
            <>
              <Loader2 aria-hidden="true" style={{ width: 13, height: 13 }} className="animate-spin" />
              Creating…
            </>
          ) : (
            "Create & send invoice"
          )}
        </button>
      </div>

      <p
        style={{
          marginTop: 16,
          fontFamily: "var(--font-mono-family)",
          fontSize: 11,
          color: "var(--ink-faint)",
          letterSpacing: "0.06em",
        }}
      >
        &gt; the customer will receive an email with a magic-link sign-in to pay.
      </p>
    </form>
  );
}
