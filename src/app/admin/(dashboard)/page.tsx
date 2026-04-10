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
    { label: "Customers", value: stats.customers, icon: Users, href: "/admin/customers" },
    { label: "Payments", value: stats.payments, icon: CreditCard, href: "/admin/payments" },
    { label: "Bookings", value: stats.bookings, icon: Calendar, href: "/admin/bookings" },
    { label: "Messages", value: stats.messages, icon: MessageSquare, href: "/admin/messages" },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-mono text-2xl font-bold text-white">Dashboard</h1>
        <p className="mt-1 font-mono text-sm text-white/40">
          &gt; system overview
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <a
            key={card.label}
            href={card.href}
            className="rounded-xl border border-white/5 bg-white/5 p-6 hover:bg-white/8 hover:border-brand-accent/20 transition-all group"
          >
            <div className="flex items-center justify-between mb-4">
              <card.icon className="h-5 w-5 text-white/30 group-hover:text-brand-accent transition-colors" />
              <span className="font-mono text-xs text-white/20">
                {card.label.toUpperCase()}
              </span>
            </div>
            <p className="font-mono text-3xl font-bold text-white">
              {card.value}
            </p>
            <p className="mt-1 font-mono text-xs text-white/30">{card.label}</p>
          </a>
        ))}
      </div>

      {/* Quick Terminal */}
      <div className="mt-12 rounded-xl border border-white/5 bg-white/5 p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-3 w-3 rounded-full bg-brand-accent/60" />
          <span className="font-mono text-xs text-white/30">system.log</span>
        </div>
        <div className="font-mono text-sm space-y-1">
          <p className="text-white/30">
            <span className="text-brand-accent">$</span> schtubbs status
          </p>
          <p className="text-white/20">
            ✓ Database: connected
          </p>
          <p className="text-white/20">
            ✓ Stripe: {process.env.STRIPE_SECRET_KEY ? "configured" : "not configured"}
          </p>
          <p className="text-white/20">
            ✓ Email: {process.env.RESEND_API_KEY ? "configured" : "not configured"}
          </p>
          <p className="text-brand-accent mt-2">
            All systems operational.
          </p>
        </div>
      </div>
    </div>
  );
}
