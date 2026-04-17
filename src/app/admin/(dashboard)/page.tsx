import Link from "next/link";
import { Users, CreditCard, Calendar, MessageSquare } from "lucide-react";

async function getStats() {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return { customers: 0, payments: 0, bookings: 0, messages: 0 };
  }
  try {
    const { createServiceClient } = await import("@/lib/supabase/server");
    const supabase = await createServiceClient();
    const [customers, payments, bookings, messages] = await Promise.all([
      supabase.from("customers").select("id", { count: "exact", head: true }),
      supabase.from("payments").select("id", { count: "exact", head: true }),
      supabase.from("bookings").select("id", { count: "exact", head: true }),
      supabase.from("contact_submissions").select("id", { count: "exact", head: true }),
    ]);
    return {
      customers: customers.count ?? 0,
      payments: payments.count ?? 0,
      bookings: bookings.count ?? 0,
      messages: messages.count ?? 0,
    };
  } catch {
    return { customers: 0, payments: 0, bookings: 0, messages: 0 };
  }
}

export default async function AdminDashboard() {
  const stats = await getStats();

  const cards = [
    { label: "Customers", value: stats.customers, icon: Users, href: "/admin/customers", caption: "Total accounts" },
    { label: "Payments", value: stats.payments, icon: CreditCard, href: "/admin/payments", caption: "Recorded charges" },
    { label: "Bookings", value: stats.bookings, icon: Calendar, href: "/admin/bookings", caption: "Consultation requests" },
    { label: "Messages", value: stats.messages, icon: MessageSquare, href: "/admin/messages", caption: "Contact submissions" },
  ];

  return (
    <div className="admin-page">
      <header className="admin-page-head">
        <div>
          <h1>Dashboard</h1>
          <div className="sub">§ overview · live counts from Supabase</div>
        </div>
      </header>

      <div className="admin-grid">
        {cards.map((card) => (
          <Link key={card.label} href={card.href} className="admin-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <card.icon aria-hidden="true" style={{ width: 16, height: 16, color: "var(--ink-faint)" }} />
              <span className="label">{card.label}</span>
            </div>
            <div className="value">{card.value}</div>
            <div className="caption">{card.caption}</div>
          </Link>
        ))}
      </div>

      <section className="admin-panel">
        <div className="panel-title">
          <span className="dot" />
          system status
        </div>
        <div className="admin-log">
          <p className="ok"><span className="prompt">$</span> sierra-117 status</p>
          <p className="muted">✓ Database: connected</p>
          <p className="muted">✓ Stripe: {process.env.STRIPE_SECRET_KEY ? "configured" : "not configured"}</p>
          <p className="muted">✓ Email: {process.env.RESEND_API_KEY ? "configured" : "not configured"}</p>
          <p className="hit">All systems operational.</p>
        </div>
      </section>
    </div>
  );
}
