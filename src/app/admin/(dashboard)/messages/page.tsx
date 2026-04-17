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
    <div className="admin-page">
      <header className="admin-page-head">
        <div>
          <h1>Messages</h1>
          <div className="sub">§ contact form submissions · {messages.length} total</div>
        </div>
      </header>

      {messages.length === 0 ? (
        <div
          className="admin-panel"
          style={{ textAlign: "center", padding: "60px 24px", color: "var(--ink-soft)" }}
        >
          No messages yet.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {messages.map((msg) => (
            <article key={msg.id} className="admin-panel" style={{ marginTop: 0, padding: 22 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: 12,
                  marginBottom: 12,
                  flexWrap: "wrap",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 10,
                      border: "1px solid var(--rule-strong)",
                      display: "grid",
                      placeItems: "center",
                      color: "var(--accent)",
                      background: "var(--accent-soft)",
                    }}
                  >
                    <Mail aria-hidden="true" style={{ width: 15, height: 15 }} />
                  </div>
                  <div>
                    <div
                      style={{
                        fontFamily: "var(--font-display-family)",
                        fontSize: 18,
                        letterSpacing: "-0.01em",
                        color: "var(--ink)",
                      }}
                    >
                      {msg.name}
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--font-mono-family)",
                        fontSize: 12,
                        color: "var(--ink-soft)",
                        marginTop: 2,
                      }}
                    >
                      {msg.email}
                    </div>
                  </div>
                </div>
                <span
                  style={{
                    fontFamily: "var(--font-mono-family)",
                    fontSize: 11,
                    color: "var(--ink-faint)",
                    letterSpacing: "0.04em",
                  }}
                >
                  {formatDate(msg.created_at)}
                </span>
              </div>
              <div style={{ paddingLeft: 46 }}>
                {msg.subject && (
                  <div
                    style={{
                      fontFamily: "var(--font-mono-family)",
                      fontSize: 11,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "var(--accent)",
                      marginBottom: 8,
                    }}
                  >
                    {msg.subject}
                  </div>
                )}
                <p
                  style={{
                    fontSize: 14,
                    color: "var(--ink)",
                    lineHeight: 1.55,
                    whiteSpace: "pre-wrap",
                    margin: 0,
                  }}
                >
                  {msg.message}
                </p>
                {msg.phone && (
                  <p
                    style={{
                      marginTop: 10,
                      fontFamily: "var(--font-mono-family)",
                      fontSize: 11,
                      color: "var(--ink-faint)",
                    }}
                  >
                    Phone · {msg.phone}
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
