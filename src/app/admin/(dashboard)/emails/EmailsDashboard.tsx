"use client";

import { useState } from "react";
import {
  Mail,
  Send,
  X,
  ChevronDown,
  ChevronRight,
  Loader2,
  CheckCircle,
  AlertCircle,
  Clock,
} from "lucide-react";
import {
  sendNewEmail,
  getEmailDetail,
  type ResendEmail,
} from "@/app/admin/actions";

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { icon: React.ElementType; color: string }> = {
    delivered: { icon: CheckCircle, color: "text-green-400" },
    sent: { icon: Send, color: "text-blue-400" },
    opened: { icon: Mail, color: "text-brand-accent" },
    clicked: { icon: CheckCircle, color: "text-brand-accent" },
    bounced: { icon: AlertCircle, color: "text-red-400" },
    complained: { icon: AlertCircle, color: "text-orange-400" },
  };
  const { icon: Icon, color } = config[status] ?? {
    icon: Clock,
    color: "text-white/30",
  };

  return (
    <span className={`inline-flex items-center gap-1 font-mono text-xs ${color}`}>
      <Icon className="h-3 w-3" />
      {status}
    </span>
  );
}

export function EmailsDashboard({
  initialEmails,
}: {
  initialEmails: ResendEmail[];
}) {
  const [emails] = useState(initialEmails);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [expandedHtml, setExpandedHtml] = useState<string | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [showCompose, setShowCompose] = useState(false);

  // Compose state
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState<{
    ok: boolean;
    msg: string;
  } | null>(null);

  async function handleExpand(emailId: string) {
    if (expandedId === emailId) {
      setExpandedId(null);
      setExpandedHtml(null);
      return;
    }

    setExpandedId(emailId);
    setExpandedHtml(null);
    setLoadingDetail(true);

    try {
      const detail = await getEmailDetail(emailId);
      setExpandedHtml(detail?.html ?? "<p>No content available</p>");
    } catch {
      setExpandedHtml("<p>Failed to load email content</p>");
    }
    setLoadingDetail(false);
  }

  async function handleSend() {
    if (!to || !subject || !body) return;

    setSending(true);
    setSendResult(null);

    try {
      await sendNewEmail(to, subject, body);
      setSendResult({ ok: true, msg: "Email sent." });
      setTo("");
      setSubject("");
      setBody("");
    } catch (err) {
      setSendResult({
        ok: false,
        msg: err instanceof Error ? err.message : "Failed to send",
      });
    }
    setSending(false);
  }

  const inputClass =
    "w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 font-mono text-sm text-white placeholder:text-white/20 focus:border-brand-accent/30 focus:outline-none transition-colors";

  return (
    <>
      {/* Header bar */}
      <div className="flex items-center justify-between mb-6">
        <p className="font-mono text-xs text-white/30">
          {emails.length} email{emails.length !== 1 ? "s" : ""}
        </p>
        <button
          onClick={() => {
            setShowCompose(true);
            setSendResult(null);
          }}
          className="inline-flex items-center gap-2 rounded-lg bg-brand-accent/10 border border-brand-accent/20 px-4 py-2 font-mono text-xs text-brand-accent hover:bg-brand-accent/20 transition-colors"
        >
          <Send className="h-3.5 w-3.5" />
          Compose Email
        </button>
      </div>

      {/* Email list */}
      <div className="space-y-2">
        {emails.length === 0 ? (
          <div className="rounded-xl border border-white/5 bg-white/5 p-12 text-center">
            <p className="font-mono text-sm text-white/20">
              No emails sent yet.
            </p>
          </div>
        ) : (
          emails.map((email) => {
            const isExpanded = expandedId === email.id;
            return (
              <div
                key={email.id}
                className="rounded-xl border border-white/5 bg-white/5 overflow-hidden"
              >
                <button
                  onClick={() => handleExpand(email.id)}
                  className="w-full flex items-center gap-4 px-6 py-4 text-left hover:bg-white/[0.02] transition-colors"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-accent/10 border border-brand-accent/20 shrink-0">
                    <Mail className="h-4 w-4 text-brand-accent" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm text-white truncate">
                        {email.to?.[0] ?? "unknown"}
                      </span>
                      <StatusBadge status={email.last_event ?? "sent"} />
                    </div>
                    <p className="font-mono text-xs text-white/40 truncate mt-0.5">
                      {email.subject}
                    </p>
                  </div>
                  <span className="font-mono text-xs text-white/20 shrink-0">
                    {formatDate(email.created_at)}
                  </span>
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4 text-white/20 shrink-0" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-white/20 shrink-0" />
                  )}
                </button>

                {isExpanded && (
                  <div className="border-t border-white/5 px-6 py-4">
                    <div className="flex gap-4 mb-4 font-mono text-xs text-white/30">
                      <span>
                        From: <span className="text-white/50">{email.from}</span>
                      </span>
                      <span>
                        To:{" "}
                        <span className="text-white/50">
                          {email.to?.join(", ")}
                        </span>
                      </span>
                    </div>
                    {loadingDetail ? (
                      <div className="flex items-center gap-2 py-8 justify-center">
                        <Loader2 className="h-4 w-4 animate-spin text-brand-accent" />
                        <span className="font-mono text-xs text-white/30">
                          Loading...
                        </span>
                      </div>
                    ) : (
                      <div
                        className="rounded-lg border border-white/5 bg-black/30 p-4 overflow-auto max-h-96"
                        dangerouslySetInnerHTML={{
                          __html: expandedHtml ?? "",
                        }}
                      />
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Compose Modal */}
      {showCompose && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-xl border border-white/10 bg-[#0c1117] p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-mono text-lg font-bold text-white">
                Compose Email
              </h2>
              <button
                onClick={() => setShowCompose(false)}
                className="text-white/30 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block font-mono text-xs uppercase tracking-widest text-brand-accent mb-2">
                  To *
                </label>
                <input
                  type="email"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  placeholder="recipient@example.com"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block font-mono text-xs uppercase tracking-widest text-brand-accent mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Email subject"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block font-mono text-xs uppercase tracking-widest text-brand-accent mb-2">
                  Body *
                </label>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Write your email here (plain text, will be wrapped in branded template)..."
                  rows={8}
                  className={`${inputClass} resize-none`}
                />
              </div>

              {sendResult && (
                <div
                  className={`flex items-center gap-2 rounded-lg border px-4 py-3 ${
                    sendResult.ok
                      ? "border-green-500/20 bg-green-500/5"
                      : "border-red-500/20 bg-red-500/5"
                  }`}
                >
                  {sendResult.ok ? (
                    <CheckCircle className="h-4 w-4 text-green-400 shrink-0" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
                  )}
                  <p
                    className={`font-mono text-xs ${
                      sendResult.ok ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {sendResult.msg}
                  </p>
                </div>
              )}

              <button
                onClick={handleSend}
                disabled={sending || !to || !subject || !body}
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-brand-accent px-8 py-3 font-mono text-sm font-bold text-brand-bg hover:bg-brand-accent-light transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Send Email
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
