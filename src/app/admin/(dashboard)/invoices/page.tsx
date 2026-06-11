import Link from "next/link";
import { InvoiceList } from "./InvoiceList";

export interface InvoiceRow {
  id: string;
  customer_email: string;
  customer_name: string | null;
  description: string;
  amount_cents: number;
  currency: string;
  status: "open" | "paid" | "cancelled" | "expired";
  stripe_session_id: string | null;
  paid_at: string | null;
  created_at: string;
}

async function getInvoices(): Promise<InvoiceRow[]> {
  if (!process.env.SUPABASE_SECRET_KEY) return [];
  try {
    const { createServiceClient } = await import("@/lib/supabase/server");
    const supabase = await createServiceClient();
    const { data } = await supabase
      .from("invoices")
      .select("*")
      .order("created_at", { ascending: false });
    return (data ?? []) as InvoiceRow[];
  } catch {
    return [];
  }
}

export default async function InvoicesPage({
  searchParams,
}: {
  searchParams: Promise<{ created?: string }>;
}) {
  const invoices = await getInvoices();
  const { created } = await searchParams;
  const openCount = invoices.filter((i) => i.status === "open").length;
  const paidCount = invoices.filter((i) => i.status === "paid").length;

  return (
    <div className="admin-page">
      <header className="admin-page-head">
        <div>
          <h1>Invoices</h1>
          <div className="sub">
            § billing · {invoices.length} total · {openCount} open · {paidCount} paid
          </div>
        </div>
        <Link href="/admin/invoices/new" className="admin-btn admin-btn-primary">
          + New invoice
        </Link>
      </header>
      <InvoiceList invoices={invoices} justCreatedId={created ?? null} />
    </div>
  );
}
