"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Logo } from "@/components/site/Logo";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (
        !process.env.NEXT_PUBLIC_SUPABASE_URL ||
        !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
      ) {
        setError(
          "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY environment variables."
        );
        setLoading(false);
        return;
      }

      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError(authError.message);
        setLoading(false);
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch (err) {
      const message =
        process.env.NODE_ENV === "development" && err instanceof Error
          ? err.message
          : "An unexpected error occurred. Please try again.";
      setError(message);
      setLoading(false);
    }
  }

  return (
    <div className="admin-login-shell">
      <div style={{ width: "100%", maxWidth: 420 }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div
            style={{
              margin: "0 auto 16px",
              width: 52,
              height: 52,
              borderRadius: 14,
              border: "1px solid var(--rule-strong)",
              display: "grid",
              placeItems: "center",
              color: "var(--ink)",
            }}
          >
            <Logo size={28} />
          </div>
          <div
            style={{
              fontFamily: "var(--font-mono-family)",
              fontSize: 13,
              letterSpacing: "0.08em",
              color: "var(--ink)",
            }}
          >
            SIERRA&nbsp;·&nbsp;117
          </div>
          <div
            style={{
              fontFamily: "var(--font-mono-family)",
              fontSize: 11,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--ink-faint)",
              marginTop: 6,
            }}
          >
            Admin access required
          </div>
        </div>

        <form onSubmit={handleSubmit} className="admin-login-card" noValidate>
          <h1>Sign in</h1>
          <p className="hint" style={{ marginTop: 8 }}>
            Authorized personnel only
          </p>

          <div style={{ marginTop: 24 }}>
            <div className="admin-field">
              <label htmlFor="admin-email">Email</label>
              <input
                id="admin-email"
                type="email"
                className="admin-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@sierra-117.net"
                autoComplete="email"
                required
              />
            </div>
            <div className="admin-field">
              <label htmlFor="admin-password">Password</label>
              <input
                id="admin-password"
                type="password"
                className="admin-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                required
              />
            </div>
          </div>

          {error && (
            <div className="admin-error" role="alert" style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <AlertCircle aria-hidden="true" style={{ width: 14, height: 14, flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="admin-btn admin-btn-primary"
            style={{ marginTop: 24, width: "100%", justifyContent: "center" }}
          >
            {loading ? (
              <>
                <Loader2 aria-hidden="true" style={{ width: 14, height: 14 }} className="animate-spin" />
                Authenticating…
              </>
            ) : (
              "Sign in"
            )}
          </button>
        </form>

        <div
          style={{
            marginTop: 20,
            textAlign: "center",
            fontFamily: "var(--font-mono-family)",
            fontSize: 11,
            letterSpacing: "0.06em",
            color: "var(--ink-faint)",
          }}
        >
          <p>&gt; authorized personnel only</p>
          <p>&gt; all access attempts are logged</p>
        </div>
      </div>
    </div>
  );
}
