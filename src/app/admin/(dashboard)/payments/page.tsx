import { PaymentsDashboard } from "./PaymentsDashboard";

interface Payment {
  id: string;
  customer_email: string | null;
  amount: number;
  description: string | null;
  status: string;
  mode: string;
  stripe_session_id: string | null;
  created_at: string;
}

async function getPayments(): Promise<Payment[]> {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return [];
  try {
    const { createServiceClient } = await import("@/lib/supabase/server");
    const supabase = await createServiceClient();
    const { data } = await supabase
      .from("payments")
      .select("*")
      .order("created_at", { ascending: false });
    return (data ?? []) as Payment[];
  } catch {
    return [];
  }
}

export default async function PaymentsPage() {
  const payments = await getPayments();

  return (
    <div className="admin-page">
      <header className="admin-page-head">
        <div>
          <h1>Payments</h1>
          <div className="sub">§ revenue · {payments.length} total</div>
        </div>
      </header>
      <PaymentsDashboard payments={payments} />
    </div>
  );
}
