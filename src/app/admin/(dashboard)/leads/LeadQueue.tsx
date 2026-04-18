"use client";

import { useState } from "react";
import { Sparkles, Loader2, X, ExternalLink, Copy, Check } from "lucide-react";
import { generatePitchEmail } from "@/app/admin/actions";

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

export function LeadQueue({ leads }: { leads: Lead[] }) {
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  const [openLead, setOpenLead] = useState<Lead | null>(null);
  const [pitchPreview, setPitchPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function handleGenerate(lead: Lead) {
    setGeneratingId(lead.id);
    setError(null);
    setOpenLead(lead);
    setPitchPreview(lead.pitch_email ?? null);
    try {
      const result = await generatePitchEmail(lead.id);
      setPitchPreview(result.pitchEmail);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate pitch");
    } finally {
      setGeneratingId(null);
    }
  }

  function closeModal() {
    setOpenLead(null);
    setPitchPreview(null);
    setError(null);
    setCopied(false);
  }

  function copyPitch() {
    if (!pitchPreview) return;
    navigator.clipboard.writeText(pitchPreview);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (leads.length === 0) {
    return (
      <div
        className="admin-panel"
        style={{ textAlign: "center", padding: "60px 24px", color: "var(--ink-soft)", marginTop: 0 }}
      >
        No leads yet. The cron fires once a day and will surface fresh prospects here.
      </div>
    );
  }

  return (
    <>
      <div style={{ overflowX: "auto" }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Business</th>
              <th>Contact</th>
              <th>Website</th>
              <th>Summary</th>
              <th>Pitch</th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead.id}>
                <td style={{ color: "var(--ink)", fontWeight: 500, verticalAlign: "top" }}>
                  {lead.business_name}
                </td>
                <td
                  style={{
                    color: "var(--ink-soft)",
                    fontFamily: "var(--font-mono-family)",
                    fontSize: 12,
                    verticalAlign: "top",
                  }}
                >
                  {lead.contact_email ?? <span style={{ color: "var(--ink-faint)" }}>-</span>}
                  {lead.phone && (
                    <div style={{ marginTop: 4, color: "var(--ink-faint)" }}>{lead.phone}</div>
                  )}
                </td>
                <td style={{ verticalAlign: "top" }}>
                  {lead.current_website ? (
                    <a
                      href={lead.current_website}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 4,
                        color: "var(--accent)",
                        fontFamily: "var(--font-mono-family)",
                        fontSize: 12,
                      }}
                    >
                      {lead.current_website.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                      <ExternalLink aria-hidden="true" style={{ width: 11, height: 11 }} />
                    </a>
                  ) : (
                    <span style={{ color: "var(--ink-faint)" }}>-</span>
                  )}
                </td>
                <td
                  style={{
                    color: "var(--ink-soft)",
                    fontSize: 13,
                    lineHeight: 1.5,
                    maxWidth: 360,
                    verticalAlign: "top",
                  }}
                >
                  {lead.summary}
                </td>
                <td style={{ verticalAlign: "top" }}>
                  {lead.pitch_email ? (
                    <span className="admin-badge ok">ready</span>
                  ) : (
                    <span className="admin-badge">pending</span>
                  )}
                </td>
                <td style={{ textAlign: "right", verticalAlign: "top" }}>
                  <button
                    type="button"
                    className="admin-btn admin-btn-primary"
                    disabled={generatingId === lead.id}
                    onClick={() => handleGenerate(lead)}
                  >
                    {generatingId === lead.id ? (
                      <>
                        <Loader2 aria-hidden="true" style={{ width: 13, height: 13 }} className="animate-spin" />
                        Generating…
                      </>
                    ) : (
                      <>
                        <Sparkles aria-hidden="true" style={{ width: 13, height: 13 }} />
                        {lead.pitch_email ? "Regenerate" : "Generate pitch"}
                      </>
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {openLead && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Pitch for ${openLead.business_name}`}
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
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 640,
              borderRadius: 14,
              border: "1px solid var(--rule-strong)",
              background: "var(--bg-elev)",
              padding: 28,
              maxHeight: "90vh",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 16 }}>
              <div>
                <div
                  className="mono"
                  style={{
                    fontSize: 11,
                    color: "var(--ink-faint)",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    marginBottom: 4,
                  }}
                >
                  Pitch email
                </div>
                <h3
                  style={{
                    fontFamily: "var(--font-display-family)",
                    fontSize: 22,
                    letterSpacing: "-0.015em",
                    color: "var(--ink)",
                    fontWeight: 400,
                  }}
                >
                  {openLead.business_name}
                </h3>
              </div>
              <button
                type="button"
                aria-label="Close"
                onClick={closeModal}
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

            {error ? (
              <div
                style={{
                  borderRadius: 10,
                  border: "1px solid color-mix(in oklab, var(--accent) 40%, transparent)",
                  background: "var(--accent-soft)",
                  padding: 16,
                  fontFamily: "var(--font-mono-family)",
                  fontSize: 12,
                  color: "var(--accent)",
                }}
              >
                {error}
              </div>
            ) : generatingId === openLead.id && !pitchPreview ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "48px 0",
                  justifyContent: "center",
                  color: "var(--ink-soft)",
                  fontFamily: "var(--font-mono-family)",
                  fontSize: 13,
                }}
              >
                <Loader2 aria-hidden="true" style={{ width: 16, height: 16 }} className="animate-spin" />
                Generating pitch…
              </div>
            ) : pitchPreview ? (
              <>
                <pre
                  style={{
                    flex: 1,
                    margin: 0,
                    padding: 18,
                    borderRadius: 10,
                    border: "1px solid var(--rule)",
                    background: "var(--bg)",
                    fontFamily: "var(--font-body-family)",
                    fontSize: 14,
                    lineHeight: 1.6,
                    color: "var(--ink)",
                    whiteSpace: "pre-wrap",
                    overflowY: "auto",
                  }}
                >
                  {pitchPreview}
                </pre>
                <div style={{ display: "flex", gap: 10, marginTop: 16, justifyContent: "flex-end" }}>
                  <button
                    type="button"
                    className="admin-btn admin-btn-ghost"
                    onClick={copyPitch}
                  >
                    {copied ? (
                      <>
                        <Check aria-hidden="true" style={{ width: 13, height: 13 }} />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy aria-hidden="true" style={{ width: 13, height: 13 }} />
                        Copy
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    className="admin-btn admin-btn-primary"
                    disabled={generatingId === openLead.id}
                    onClick={() => handleGenerate(openLead)}
                  >
                    {generatingId === openLead.id ? (
                      <>
                        <Loader2 aria-hidden="true" style={{ width: 13, height: 13 }} className="animate-spin" />
                        Regenerating…
                      </>
                    ) : (
                      <>
                        <Sparkles aria-hidden="true" style={{ width: 13, height: 13 }} />
                        Regenerate
                      </>
                    )}
                  </button>
                </div>
              </>
            ) : null}
          </div>
        </div>
      )}
    </>
  );
}
