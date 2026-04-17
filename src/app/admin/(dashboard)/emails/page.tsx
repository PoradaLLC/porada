import { getEmails } from "@/app/admin/actions";
import { EmailsDashboard } from "./EmailsDashboard";

export default async function EmailsPage() {
  const emails = await getEmails();

  return (
    <div className="admin-page">
      <header className="admin-page-head">
        <div>
          <h1>Emails</h1>
          <div className="sub">§ outbound · {emails.length} sent</div>
        </div>
      </header>

      <EmailsDashboard initialEmails={emails} />
    </div>
  );
}
