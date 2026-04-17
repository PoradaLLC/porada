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
    <div className="admin-page">
      <header className="admin-page-head">
        <div>
          <h1>Settings</h1>
          <div className="sub">§ system configuration · environment + setup</div>
        </div>
      </header>

      <section className="admin-panel" style={{ marginTop: 0 }}>
        <div className="panel-title">
          <span className="dot" />
          environment status
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {envStatus.map((env) => (
            <div
              key={env.name}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px 14px",
                borderRadius: 8,
                border: "1px solid var(--rule)",
                background: "var(--bg)",
                fontFamily: "var(--font-mono-family)",
                fontSize: 12,
                color: "var(--ink-soft)",
              }}
            >
              <span>{env.name}</span>
              <span className={`admin-badge ${env.set ? "ok" : "danger"}`}>
                {env.set ? "configured" : "not set"}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="admin-panel">
        <div className="panel-title">
          <span className="dot" />
          quick setup guide
        </div>
        <ol
          style={{
            margin: 0,
            paddingLeft: 20,
            fontFamily: "var(--font-mono-family)",
            fontSize: 13,
            color: "var(--ink-soft)",
            lineHeight: 1.8,
          }}
        >
          <li>Create a Supabase project and add the URL + keys to .env.local</li>
          <li>Run the migration SQL in Supabase SQL Editor (see supabase/migrations/)</li>
          <li>Create an admin user and set their role in Supabase</li>
          <li>Add Stripe keys for payment processing</li>
          <li>Add Resend API key for email notifications</li>
          <li>Set up a Stripe webhook pointing to /api/stripe/webhook</li>
        </ol>
      </section>
    </div>
  );
}
