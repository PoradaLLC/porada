import { formatDate } from "@/lib/utils";
import { Mail } from "lucide-react";

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  created_at: string;
}

async function getMessages(): Promise<ContactSubmission[]> {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return [];
  try {
    const { createServiceClient } = await import("@/lib/supabase/server");
    const supabase = await createServiceClient();
    const { data } = await supabase
      .from("contact_submissions")
      .select("*")
      .order("created_at", { ascending: false });
    return (data ?? []) as ContactSubmission[];
  } catch {
    return [];
  }
}

export default async function MessagesPage() {
  const messages = await getMessages();

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-mono text-2xl font-bold text-white">Messages</h1>
        <p className="mt-1 font-mono text-sm text-white/40">
          &gt; contact form submissions
        </p>
      </div>

      <div className="space-y-4">
        {messages.length === 0 ? (
          <div className="rounded-xl border border-white/5 bg-white/5 p-12 text-center">
            <p className="font-mono text-sm text-white/20">No messages yet.</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className="rounded-xl border border-white/5 bg-white/5 p-6"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-accent/10 border border-brand-accent/20">
                    <Mail className="h-4 w-4 text-brand-accent" />
                  </div>
                  <div>
                    <h3 className="font-mono text-sm font-bold text-white">
                      {msg.name}
                    </h3>
                    <p className="font-mono text-xs text-white/30">{msg.email}</p>
                  </div>
                </div>
                <span className="font-mono text-xs text-white/20">
                  {formatDate(msg.created_at)}
                </span>
              </div>
              <div className="ml-11">
                <p className="font-mono text-xs text-brand-accent mb-2">
                  {msg.subject}
                </p>
                <p className="font-mono text-sm text-white/50 leading-relaxed whitespace-pre-wrap">
                  {msg.message}
                </p>
                {msg.phone && (
                  <p className="mt-2 font-mono text-xs text-white/20">
                    phone: {msg.phone}
                  </p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
