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
    <div className="admin-page">
      <header className="admin-page-head">
        <div>
          <h1>Customers</h1>
          <div className="sub">§ client accounts · {customers.length} total</div>
        </div>
      </header>
      <CustomerList customers={customers} />
    </div>
  );
}
