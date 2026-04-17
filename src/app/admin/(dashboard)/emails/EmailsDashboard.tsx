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
  const config: Record<string, { icon: React.ElementType; kind: "ok" | "warn" | "danger" | "accent" | "" }> = {
    delivered: { icon: CheckCircle, kind: "ok" },
    sent: { icon: Send, kind: "accent" },
    opened: { icon: Mail, kind: "accent" },
    clicked: { icon: CheckCircle, kind: "accent" },
    bounced: { icon: AlertCircle, kind: "danger" },
    complained: { icon: AlertCircle, kind: "warn" },
  };
  const { icon: Icon, kind } = config[status] ?? { icon: Clock, kind: "" as const };

  return (
    <span className={`admin-badge ${kind}`}>
      <Icon aria-hidden="true" style={{ width: 11, height: 11 }} />
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

  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState<{ ok: boolean; msg: string } | null>(null);

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

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <p style={{ fontFamily: "var(--font-mono-family)", fontSize: 12, color: "var(--ink-faint)" }}>
          {emails.length} email{emails.length !== 1 ? "s" : ""}
        </p>
        <button
          type="button"
          className="admin-btn admin-btn-primary"
          onClick={() => {
            setShowCompose(true);
            setSendResult(null);
          }}
        >
          <Send aria-hidden="true" style={{ width: 13, height: 13 }} />
          Compose email
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {emails.length === 0 ? (
          <div
            className="admin-panel"
            style={{ marginTop: 0, textAlign: "center", padding: "60px 24px", color: "var(--ink-soft)" }}
          >
            No emails sent yet.
          </div>
        ) : (
          emails.map((email) => {
            const isExpanded = expandedId === email.id;
            return (
              <div
                key={email.id}
                style={{
                  border: "1px solid var(--rule)",
                  background: "var(--bg-elev)",
                  borderRadius: 12,
                  overflow: "hidden",
                }}
              >
                <button
                  type="button"
                  onClick={() => handleExpand(email.id)}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    padding: "14px 18px",
                    textAlign: "left",
                    background: "transparent",
                    border: 0,
                    color: "inherit",
                    cursor: "pointer",
                  }}
                >
                  <div
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 10,
                      border: "1px solid var(--rule-strong)",
                      background: "var(--accent-soft)",
                      display: "grid",
                      placeItems: "center",
                      color: "var(--accent)",
                      flexShrink: 0,
                    }}
                  >
                    <Mail aria-hidden="true" style={{ width: 14, height: 14 }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                      <span
                        style={{
                          fontFamily: "var(--font-mono-family)",
                          fontSize: 13,
                          color: "var(--ink)",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {email.to?.[0] ?? "unknown"}
                      </span>
                      <StatusBadge status={email.last_event ?? "sent"} />
                    </div>
                    <p
                      style={{
                        marginTop: 2,
                        fontFamily: "var(--font-mono-family)",
                        fontSize: 12,
                        color: "var(--ink-soft)",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {email.subject}
                    </p>
                  </div>
                  <span
                    style={{
                      fontFamily: "var(--font-mono-family)",
                      fontSize: 11,
                      color: "var(--ink-faint)",
                      flexShrink: 0,
                    }}
                  >
                    {formatDate(email.created_at)}
                  </span>
                  {isExpanded ? (
                    <ChevronDown aria-hidden="true" style={{ width: 14, height: 14, color: "var(--ink-faint)", flexShrink: 0 }} />
                  ) : (
                    <ChevronRight aria-hidden="true" style={{ width: 14, height: 14, color: "var(--ink-faint)", flexShrink: 0 }} />
                  )}
                </button>

                {isExpanded && (
                  <div style={{ borderTop: "1px solid var(--rule)", padding: "14px 18px" }}>
                    <div
                      style={{
                        display: "flex",
                        gap: 16,
                        marginBottom: 12,
                        fontFamily: "var(--font-mono-family)",
                        fontSize: 11,
                        color: "var(--ink-faint)",
                        flexWrap: "wrap",
                      }}
                    >
                      <span>
                        From: <span style={{ color: "var(--ink-soft)" }}>{email.from}</span>
                      </span>
                      <span>
                        To: <span style={{ color: "var(--ink-soft)" }}>{email.to?.join(", ")}</span>
                      </span>
                    </div>
                    {loadingDetail ? (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          padding: "24px 0",
                          justifyContent: "center",
                        }}
                      >
                        <Loader2 aria-hidden="true" style={{ width: 14, height: 14, color: "var(--accent)" }} className="animate-spin" />
                        <span style={{ fontFamily: "var(--font-mono-family)", fontSize: 12, color: "var(--ink-soft)" }}>
                          Loading…
                        </span>
                      </div>
                    ) : (
                      <div
                        style={{
                          borderRadius: 8,
                          border: "1px solid var(--rule)",
                          background: "var(--bg)",
                          padding: 16,
                          overflow: "auto",
                          maxHeight: 384,
                          color: "var(--ink)",
                        }}
                        dangerouslySetInnerHTML={{ __html: expandedHtml ?? "" }}
                      />
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {showCompose && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Compose email"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
            background: "rgba(10, 10, 10, 0.55)",
            backdropFilter: "blur(6px)",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowCompose(false);
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 520,
              borderRadius: 14,
              border: "1px solid var(--rule-strong)",
              background: "var(--bg-elev)",
              padding: 28,
              boxShadow: "var(--shadow)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2
                style={{
                  fontFamily: "var(--font-display-family)",
                  fontSize: 22,
                  letterSpacing: "-0.015em",
                  color: "var(--ink)",
                  fontWeight: 400,
                }}
              >
                Compose email
              </h2>
              <button
                type="button"
                aria-label="Close"
                onClick={() => setShowCompose(false)}
                style={{
                  background: "none",
                  border: 0,
                  color: "var(--ink-soft)",
                  cursor: "pointer",
                  padding: 4,
                  lineHeight: 0,
                }}
              >
                <X aria-hidden="true" style={{ width: 18, height: 18 }} />
              </button>
            </div>

            <div className="admin-field">
              <label htmlFor="em-to">To *</label>
              <input
                id="em-to"
                type="email"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder="recipient@example.com"
                className="admin-input"
              />
            </div>
            <div className="admin-field">
              <label htmlFor="em-subject">Subject *</label>
              <input
                id="em-subject"
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Email subject"
                className="admin-input"
              />
            </div>
            <div className="admin-field">
              <label htmlFor="em-body">Body *</label>
              <textarea
                id="em-body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Write your email here (plain text, will be wrapped in branded template)…"
                rows={8}
                className="admin-input"
                style={{ resize: "vertical" }}
              />
            </div>

            {sendResult && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "12px 14px",
                  marginTop: 14,
                  borderRadius: 8,
                  border: `1px solid ${
                    sendResult.ok
                      ? "color-mix(in oklab, var(--positive) 40%, transparent)"
                      : "color-mix(in oklab, var(--accent) 40%, transparent)"
                  }`,
                  background: sendResult.ok ? "color-mix(in oklab, var(--positive) 10%, transparent)" : "var(--accent-soft)",
                  fontFamily: "var(--font-mono-family)",
                  fontSize: 12,
                  color: sendResult.ok ? "var(--positive)" : "var(--accent)",
                }}
              >
                {sendResult.ok ? (
                  <CheckCircle aria-hidden="true" style={{ width: 14, height: 14, flexShrink: 0 }} />
                ) : (
                  <AlertCircle aria-hidden="true" style={{ width: 14, height: 14, flexShrink: 0 }} />
                )}
                <span>{sendResult.msg}</span>
              </div>
            )}

            <button
              type="button"
              onClick={handleSend}
              disabled={sending || !to || !subject || !body}
              className="admin-btn admin-btn-primary"
              style={{ width: "100%", justifyContent: "center", marginTop: 18 }}
            >
              {sending ? (
                <>
                  <Loader2 aria-hidden="true" style={{ width: 14, height: 14 }} className="animate-spin" />
                  Sending…
                </>
              ) : (
                <>
                  <Send aria-hidden="true" style={{ width: 14, height: 14 }} />
                  Send email
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
