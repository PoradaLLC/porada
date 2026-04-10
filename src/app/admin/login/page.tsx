"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Terminal, Loader2, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

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
    } catch {
      setError("An unexpected error occurred");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#060906] grid-bg px-6">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-brand-accent/10 border border-brand-accent/20">
            <Terminal className="h-7 w-7 text-brand-accent" />
          </div>
          <h1 className="font-mono text-2xl font-bold text-foreground">
            SIERRA<span className="text-brand-accent">-117</span>
          </h1>
          <p className="mt-2 font-mono text-xs text-brand-text">
            Admin Access Required
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="glow-border rounded-xl bg-brand-primary/30 p-8 backdrop-blur space-y-6"
        >
          <div>
            <label htmlFor="admin-email" className="block font-mono text-xs uppercase tracking-widest text-brand-accent mb-2">
              Email
            </label>
            <input
              id="admin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-brand-accent/10 bg-brand-bg/50 px-4 py-3 font-mono text-sm text-foreground placeholder:text-brand-text/40 focus:border-brand-accent/30 focus:outline-none focus:ring-1 focus:ring-brand-accent/20 transition-colors"
              placeholder="admin@sierra-117.dev"
              required
            />
          </div>

          <div>
            <label htmlFor="admin-password" className="block font-mono text-xs uppercase tracking-widest text-brand-accent mb-2">
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-brand-accent/10 bg-brand-bg/50 px-4 py-3 font-mono text-sm text-foreground placeholder:text-brand-text/40 focus:border-brand-accent/30 focus:outline-none focus:ring-1 focus:ring-brand-accent/20 transition-colors"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-3">
              <AlertCircle className="h-4 w-4 text-red-400 flex-shrink-0" />
              <p className="font-mono text-xs text-red-400">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-brand-accent px-6 py-3.5 font-mono text-sm font-bold text-brand-bg hover:bg-brand-accent-light transition-all disabled:opacity-50"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Authenticating...
              </span>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="mt-6 rounded-lg border border-brand-accent/10 bg-brand-primary/20 p-4 font-mono text-xs text-brand-text/50 text-center">
          <p>&gt; authorized personnel only</p>
          <p>&gt; all access attempts are logged</p>
        </div>
      </div>
    </div>
  );
}
