import { Terminal } from "lucide-react";

export default function SettingsPage() {
  const envStatus = [
    { name: "NEXT_PUBLIC_SUPABASE_URL", set: !!process.env.NEXT_PUBLIC_SUPABASE_URL },
    { name: "NEXT_PUBLIC_SUPABASE_ANON_KEY", set: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY },
    { name: "SUPABASE_SERVICE_ROLE_KEY", set: !!process.env.SUPABASE_SERVICE_ROLE_KEY },
    { name: "STRIPE_SECRET_KEY", set: !!process.env.STRIPE_SECRET_KEY },
    { name: "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY", set: !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY },
    { name: "STRIPE_WEBHOOK_SECRET", set: !!process.env.STRIPE_WEBHOOK_SECRET },
    { name: "RESEND_API_KEY", set: !!process.env.RESEND_API_KEY },
    { name: "RESEND_FROM_EMAIL", set: !!process.env.RESEND_FROM_EMAIL },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-mono text-2xl font-bold text-white">Settings</h1>
        <p className="mt-1 font-mono text-sm text-white/40">
          &gt; system configuration
        </p>
      </div>

      {/* Environment Variables */}
      <div className="rounded-xl border border-white/5 bg-white/5 p-6 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Terminal className="h-4 w-4 text-brand-accent" />
          <h2 className="font-mono text-sm font-bold text-white">
            Environment Status
          </h2>
        </div>
        <div className="space-y-2">
          {envStatus.map((env) => (
            <div
              key={env.name}
              className="flex items-center justify-between rounded-lg bg-white/5 px-4 py-2.5"
            >
              <span className="font-mono text-xs text-white/50">
                {env.name}
              </span>
              {env.set ? (
                <span className="font-mono text-[10px] text-brand-accent">
                  configured
                </span>
              ) : (
                <span className="font-mono text-[10px] text-red-400">
                  not set
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Setup Instructions */}
      <div className="rounded-xl border border-white/5 bg-white/5 p-6">
        <h2 className="font-mono text-sm font-bold text-white mb-4">
          Quick Setup Guide
        </h2>
        <div className="font-mono text-xs text-white/30 space-y-3">
          <p>1. Create a Supabase project and add the URL + keys to .env.local</p>
          <p>2. Run the migration SQL in Supabase SQL Editor (see supabase/migrations/)</p>
          <p>3. Create an admin user and set their role in Supabase</p>
          <p>4. Add Stripe keys for payment processing</p>
          <p>5. Add Resend API key for email notifications</p>
          <p>6. Set up a Stripe webhook pointing to /api/stripe/webhook</p>
        </div>
      </div>
    </div>
  );
}
