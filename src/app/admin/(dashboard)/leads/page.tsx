import { LeadQueue } from "./LeadQueue";

interface Lead {
  id: string;
  business_name: string;
  contact_email: string | null;
  phone: string | null;
  current_website: string | null;
  summary: string;
  status: string;
  pitch_email: string | null;
  pitched_at: string | null;
  created_at: string;
}

async function getLeads(): Promise<Lead[]> {
  if (!process.env.SUPABASE_SECRET_KEY) return [];
  try {
    const { createServiceClient } = await import("@/lib/supabase/server");
    const supabase = await createServiceClient();
    const { data } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });
    return (data ?? []) as Lead[];
  } catch {
    return [];
  }
}

export default async function LeadsPage() {
  const leads = await getLeads();

  return (
    <div className="admin-page">
      <header className="admin-page-head">
        <div>
          <h1>Lead queue</h1>
          <div className="sub">§ outbound · {leads.length} total · cron runs daily at 13:00 UTC</div>
        </div>
      </header>
      <LeadQueue leads={leads} />
    </div>
  );
}
