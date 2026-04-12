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
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return [];
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
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-mono text-2xl font-bold text-white">Lead Queue</h1>
        <p className="mt-1 font-mono text-sm text-white/40">
          &gt; ai-generated local business leads
        </p>
      </div>
      <LeadQueue leads={leads} />
    </div>
  );
}
