import { CustomerList } from "./CustomerList";

interface Customer {
  id: string;
  name: string;
  email: string;
  company: string | null;
  phone: string | null;
  stripe_customer_id: string | null;
  created_at: string;
}

async function getCustomers(): Promise<Customer[]> {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return [];
  try {
    const { createServiceClient } = await import("@/lib/supabase/server");
    const supabase = await createServiceClient();
    const { data } = await supabase
      .from("customers")
      .select("*")
      .order("created_at", { ascending: false });
    return (data ?? []) as Customer[];
  } catch {
    return [];
  }
}

export default async function CustomersPage() {
  const customers = await getCustomers();

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-mono text-2xl font-bold text-white">Customers</h1>
        <p className="mt-1 font-mono text-sm text-white/40">
          &gt; manage client accounts & billing
        </p>
      </div>
      <CustomerList customers={customers} />
    </div>
  );
}
