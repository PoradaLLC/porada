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
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-mono text-2xl font-bold text-white">Payments</h1>
        <p className="mt-1 font-mono text-sm text-white/40">
          &gt; track revenue & manage billing
        </p>
      </div>
      <PaymentsDashboard payments={payments} />
    </div>
  );
}
