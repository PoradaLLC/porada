"use client";

import { useState } from "react";
import { Loader2, Mail } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function InvoiceSignIn({
  invoiceId,
  customerEmail,
}: {
  invoiceId: string;
  customerEmail: string;
}) {
  const [email, setEmail] = useState("");
  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);

    if (email.trim().toLowerCase() !== customerEmail.toLowerCase()) {
      setError("That email doesn't match this invoice. Use the email this invoice was sent to.");
      setPending(false);
      return;
    }

    try {
      const supabase = createClient();
      const origin = window.location.origin;
      const { error: signInError } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: `${origin}/auth/callback?next=/payment/${invoiceId}`,
          shouldCreateUser: true,
        },
      });
      if (signInError) throw signInError;
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send sign-in link");
    } finally {
      setPending(false);
    }
  }

  if (sent) {
    return (
      <div className="payment-card">
        <div className="payment-icon ok">
          <Mail aria-hidden="true" />
        </div>
        <h1>Check your inbox</h1>
        <p>
          We sent a sign-in link to <strong>{email}</strong>. Click it to view and pay your invoice.
        </p>
        <p
          className="mono"
          style={{
            marginTop: 16,
            fontSize: 11,
            letterSpacing: "0.08em",
            color: "var(--ink-faint)",
          }}
        >
          &gt; the link expires in one hour
        </p>
      </div>
    );
  }

  const hint = maskEmail(customerEmail);

  return (
    <form className="payment-card" onSubmit={handleSubmit}>
      <div
        className="mono"
        style={{
          fontSize: 11,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "var(--ink-faint)",
        }}
      >
        Invoice access
      </div>
      <h1 style={{ marginTop: 8 }}>Sign in to view your invoice</h1>
      <p>Enter the email this invoice was sent to. We&apos;ll email you a one-time sign-in link.</p>

      <div className="admin-field" style={{ marginTop: 24 }}>
        <label htmlFor="signin-email">Email</label>
        <input
          id="signin-email"
          type="email"
          className="admin-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={hint}
          required
          autoComplete="email"
          autoFocus
        />
      </div>

      {error && (
        <div className="admin-error" role="alert" style={{ marginTop: 4 }}>
          {error}
        </div>
      )}

      <button
        type="submit"
        className="btn btn-primary"
        disabled={pending}
        style={{ marginTop: 18, width: "100%" }}
      >
        {pending ? (
          <>
            <Loader2 aria-hidden="true" style={{ width: 14, height: 14 }} className="animate-spin" />
            Sending link…
          </>
        ) : (
          "Send sign-in link →"
        )}
      </button>

      <p
        className="mono"
        style={{
          marginTop: 18,
          fontSize: 11,
          letterSpacing: "0.08em",
          color: "var(--ink-faint)",
          textAlign: "center",
        }}
      >
        &gt; hint: invoice was sent to {hint}
      </p>
    </form>
  );
}

function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!domain) return email;
  if (local.length <= 2) return `${local[0] ?? ""}…@${domain}`;
  return `${local[0]}${"•".repeat(Math.max(1, local.length - 2))}${local[local.length - 1]}@${domain}`;
}
