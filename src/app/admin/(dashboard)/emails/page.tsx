import { getEmails } from "@/app/admin/actions";
import { EmailsDashboard } from "./EmailsDashboard";

export default async function EmailsPage() {
  const emails = await getEmails();

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-mono text-2xl font-bold text-white">Emails</h1>
        <p className="mt-1 font-mono text-sm text-white/40">
          &gt; sent emails and compose
        </p>
      </div>

      <EmailsDashboard initialEmails={emails} />
    </div>
  );
}
