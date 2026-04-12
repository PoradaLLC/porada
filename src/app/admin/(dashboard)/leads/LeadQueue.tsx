"use client";

import { useState } from "react";
import {
  X,
  Loader2,
  Send,
  Sparkles,
  ExternalLink,
  XCircle,
  CheckCircle2,
} from "lucide-react";
import {
  generatePitchEmail,
  sendPitchEmail,
  updateLeadStatus,
} from "@/app/admin/actions";

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

const statusConfig: Record<string, { label: string; classes: string }> = {
  new: {
    label: "New",
    classes: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  },
  pitched: {
    label: "Pitched",
    classes: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  },
  converted: {
    label: "Converted",
    classes: "bg-brand-accent/10 text-brand-accent border-brand-accent/20",
  },
  dismissed: {
    label: "Dismissed",
    classes: "bg-white/5 text-white/30 border-white/10",
  },
};

export function LeadQueue({ leads }: { leads: Lead[] }) {
  const [pitchModal, setPitchModal] = useState<Lead | null>(null);
  const [pitchText, setPitchText] = useState("");
  const [generating, setGenerating] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);

  async function handleGeneratePitch(lead: Lead) {
    setPitchModal(lead);
    setPitchText(lead.pitch_email ?? "");

    if (!lead.pitch_email) {
      setGenerating(true);
      try {
        const result = await generatePitchEmail(lead.id);
        setPitchText(result.pitchEmail);
      } catch (err) {
        console.error(err);
      }
      setGenerating(false);
    }
  }

  async function handleSendPitch() {
    if (!pitchModal || !pitchText) return;
    setSending(true);
    try {
      await sendPitchEmail(pitchModal.id, pitchText);
      setSendSuccess(true);
      setTimeout(() => {
        setPitchModal(null);
        setSendSuccess(false);
      }, 2000);
    } catch (err) {
      console.error(err);
    }
    setSending(false);
  }

  async function handleDismiss(leadId: string) {
    await updateLeadStatus(leadId, "dismissed");
  }

  async function handleConvert(leadId: string) {
    await updateLeadStatus(leadId, "converted");
  }

  return (
    <>
      {/* Lead Table */}
      <div className="rounded-xl border border-white/5 bg-white/5 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/5">
              <th className="px-6 py-3 text-left font-mono text-xs uppercase tracking-widest text-white/30">
                Business
              </th>
              <th className="px-6 py-3 text-left font-mono text-xs uppercase tracking-widest text-white/30">
                Email
              </th>
              <th className="px-6 py-3 text-left font-mono text-xs uppercase tracking-widest text-white/30">
                Phone
              </th>
              <th className="px-6 py-3 text-left font-mono text-xs uppercase tracking-widest text-white/30">
                Website
              </th>
              <th className="px-6 py-3 text-left font-mono text-xs uppercase tracking-widest text-white/30">
                Status
              </th>
              <th className="px-6 py-3 text-right font-mono text-xs uppercase tracking-widest text-white/30">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {leads.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-12 text-center font-mono text-sm text-white/20"
                >
                  No leads yet. Leads are generated daily at 9:00 AM ET.
                </td>
              </tr>
            ) : (
              leads.map((lead) => {
                const status = statusConfig[lead.status] ?? statusConfig.new;
                return (
                  <tr
                    key={lead.id}
                    className="hover:bg-white/5 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="font-mono text-sm text-white">
                        {lead.business_name}
                      </div>
                      <div className="mt-1 font-mono text-[11px] text-white/30 max-w-xs truncate">
                        {lead.summary}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-sm text-white/50">
                      {lead.contact_email ?? (
                        <span className="text-white/20">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 font-mono text-sm text-white/50">
                      {lead.phone ?? <span className="text-white/20">—</span>}
                    </td>
                    <td className="px-6 py-4">
                      {lead.current_website ? (
                        <a
                          href={lead.current_website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 font-mono text-sm text-brand-accent hover:text-brand-accent-light transition-colors"
                        >
                          <ExternalLink className="h-3 w-3" />
                          Visit
                        </a>
                      ) : (
                        <span className="font-mono text-[10px] text-white/20">
                          no website
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center rounded-full border px-2 py-1 font-mono text-[10px] ${status.classes}`}
                      >
                        {status.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {(lead.status === "new" ||
                          lead.status === "pitched") && (
                          <button
                            onClick={() => handleGeneratePitch(lead)}
                            title={
                              lead.pitch_email ? "View pitch" : "Generate pitch"
                            }
                            className="rounded-lg border border-white/5 p-2 text-white/30 hover:text-brand-accent hover:border-brand-accent/20 transition-colors"
                          >
                            <Sparkles className="h-3.5 w-3.5" />
                          </button>
                        )}
                        {lead.status === "pitched" && (
                          <button
                            onClick={() => handleConvert(lead.id)}
                            title="Mark as converted"
                            className="rounded-lg border border-white/5 p-2 text-white/30 hover:text-brand-accent hover:border-brand-accent/20 transition-colors"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                        {lead.status === "new" && (
                          <button
                            onClick={() => handleDismiss(lead.id)}
                            title="Dismiss"
                            className="rounded-lg border border-white/5 p-2 text-white/30 hover:text-red-400 hover:border-red-400/20 transition-colors"
                          >
                            <XCircle className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pitch Email Modal */}
      {pitchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-xl border border-white/10 bg-[#080c10] p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-mono text-lg font-bold text-white">
                Pitch: {pitchModal.business_name}
              </h3>
              <button
                onClick={() => {
                  setPitchModal(null);
                  setSendSuccess(false);
                }}
                className="text-white/30 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Lead Summary */}
            <div className="mb-4 rounded-lg border border-white/5 bg-white/5 p-3">
              <p className="font-mono text-xs text-white/40">
                {pitchModal.summary}
              </p>
              {pitchModal.contact_email && (
                <p className="mt-2 font-mono text-xs text-brand-accent">
                  To: {pitchModal.contact_email}
                </p>
              )}
              {!pitchModal.contact_email && (
                <p className="mt-2 font-mono text-xs text-red-400">
                  No contact email found for this lead
                </p>
              )}
            </div>

            {/* Email Body */}
            {generating ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-brand-accent" />
                <span className="ml-3 font-mono text-sm text-white/40">
                  Generating pitch...
                </span>
              </div>
            ) : sendSuccess ? (
              <div className="flex flex-col items-center justify-center py-12 gap-3">
                <CheckCircle2 className="h-8 w-8 text-brand-accent" />
                <p className="font-mono text-sm text-brand-accent font-bold">
                  Email sent successfully!
                </p>
              </div>
            ) : (
              <>
                <textarea
                  value={pitchText}
                  onChange={(e) => setPitchText(e.target.value)}
                  rows={12}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 font-mono text-sm text-white placeholder:text-white/20 focus:border-brand-accent/30 focus:outline-none transition-colors resize-none"
                  placeholder="Pitch email content..."
                />
                <div className="mt-4 flex gap-3">
                  <button
                    onClick={handleSendPitch}
                    disabled={sending || !pitchModal.contact_email || !pitchText}
                    className="flex-1 rounded-lg bg-brand-accent px-6 py-3 font-mono text-sm font-bold text-brand-bg hover:bg-brand-accent-light transition-all disabled:opacity-50 inline-flex items-center justify-center gap-2"
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
                  <button
                    onClick={() => {
                      setPitchModal(null);
                      setSendSuccess(false);
                    }}
                    className="rounded-lg border border-white/10 px-4 py-3 font-mono text-sm text-white/50 hover:text-white hover:border-white/20 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
