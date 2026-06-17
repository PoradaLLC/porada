"use client";

/**
 * The Porada offer + free-preview capture, shown to the *owner* right after the
 * demo's booking confirmation — the moment they've just felt how good the flow is.
 *
 * This is the third of the three Porada CTAs (landing primary form, demo ribbon,
 * this confirmation offer). It is deliberately separate from the fictional venue's
 * newsletter (EmailCapture): different audience, different ask. The Standard /
 * Premium tiers are stated plainly here — not buried in a collapsed note — so an
 * owner sees exactly what they'd get.
 *
 * Two-step capture, mirroring the landing form:
 *   Step 1 — current site URL + email (tiny, to maximize conversion)
 *   Step 2 — what their game masters use + theme/vibe note
 *
 * Client-only in the demo. On a live build this posts to the same `leads` pipeline
 * as the landing PreviewForm.
 */

import { useState, type FormEvent } from "react";
import { ArrowLeft, ArrowRight, Check, Sparkles } from "lucide-react";

export function OwnerPreview() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [website, setWebsite] = useState("");
  const [email, setEmail] = useState("");
  const [gmTools, setGmTools] = useState("");
  const [vibe, setVibe] = useState("");
  const [errors, setErrors] = useState<{ website?: string; email?: string }>({});

  function submitStep1(e: FormEvent) {
    e.preventDefault();
    const next: { website?: string; email?: string } = {};
    if (!website.trim()) next.website = "We need your current site to build the preview.";
    if (!email.trim()) next.email = "Where should we send it?";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) next.email = "That doesn’t look like an email.";
    setErrors(next);
    if (Object.keys(next).length === 0) setStep(2);
  }

  function submitStep2(e: FormEvent) {
    e.preventDefault();
    setStep(3);
  }

  return (
    <section className="demo-offer mt-6" data-tour="owner-preview" aria-label="Get this site for your venue">
      <div className="demo-offer-head">
        <span className="demo-pill" style={{ color: "var(--brass-bright)", borderColor: "var(--brass)" }}>
          <Sparkles size={13} /> Built by Porada
        </span>
        <h3 className="font-display text-2xl mt-3" style={{ color: "var(--parchment)" }}>
          That booking flow? It could be yours.
        </h3>
        <p className="text-sm mt-2" style={{ color: "var(--muted)" }}>
          This whole demo — booking, room pages, leaderboard, gift cards — is the kind of site Porada
          builds for escape rooms. Tell us about your venue and we&apos;ll hand-build a free preview
          using <em>your</em> rooms. No payment, no commitment.
        </p>
      </div>

      {/* Plain two-tier framing — what you actually get, stated up front. */}
      <div className="demo-tier-grid mt-5">
        <div className="demo-tier-card">
          <div className="demo-tier-card-name">Standard</div>
          <p>
            Keep your booking platform — we embed your existing Bookeo / Resova / FareHarbor widget
            right in the page, styled to match. You don&apos;t switch anything.
          </p>
        </div>
        <div className="demo-tier-card">
          <div className="demo-tier-card-name">Premium</div>
          <p>
            A fully custom flow like the one you just used, built on your platform&apos;s API — with
            your existing payment processor&apos;s secure hosted checkout handed off at the end.
          </p>
        </div>
      </div>

      {/* Capture */}
      <div className="demo-card p-5 mt-5">
        <div className="demo-form-steps mb-4" aria-hidden>
          <span className={`demo-form-dot${step >= 1 ? " on" : ""}`} />
          <span className={`demo-form-dot${step >= 2 ? " on" : ""}`} />
        </div>

        {step === 1 && (
          <form onSubmit={submitStep1} noValidate className="grid gap-3">
            <p className="text-[0.7rem] uppercase tracking-wider" style={{ color: "var(--muted-2)" }}>
              Step 1 of 2 · about 20 seconds
            </p>
            <label className="block">
              <span className="text-xs" style={{ color: "var(--muted)" }}>Your current website</span>
              <input
                className="demo-input mt-1"
                type="text"
                inputMode="url"
                placeholder="yourvenue.com"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
              {errors.website && (
                <span className="text-[0.7rem] mt-1 block" style={{ color: "#e08a8a" }}>
                  {errors.website}
                </span>
              )}
            </label>
            <label className="block">
              <span className="text-xs" style={{ color: "var(--muted)" }}>Email</span>
              <input
                className="demo-input mt-1"
                type="email"
                placeholder="you@yourvenue.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && (
                <span className="text-[0.7rem] mt-1 block" style={{ color: "#e08a8a" }}>
                  {errors.email}
                </span>
              )}
            </label>
            <button type="submit" className="demo-btn demo-btn-primary w-full py-3 mt-1">
              Get my free preview <ArrowRight size={16} />
            </button>
            <p className="text-[0.7rem] text-center" style={{ color: "var(--muted-2)" }}>
              We use your URL to detect your booking setup, too.
            </p>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={submitStep2} noValidate className="grid gap-3">
            <p className="text-[0.7rem] uppercase tracking-wider" style={{ color: "var(--brass)" }}>
              Step 2 of 2 · optional but helpful
            </p>
            <label className="block">
              <span className="text-xs" style={{ color: "var(--muted)" }}>
                What do your game masters use to run the rooms?
              </span>
              <input
                className="demo-input mt-1"
                type="text"
                placeholder="e.g. our timer software, a booking tool, a spreadsheet…"
                value={gmTools}
                onChange={(e) => setGmTools(e.target.value)}
              />
            </label>
            <label className="block">
              <span className="text-xs" style={{ color: "var(--muted)" }}>Theme / vibe we should match</span>
              <textarea
                className="demo-input mt-1"
                rows={3}
                placeholder="Horror? Heist? Family-friendly? Any colors or feel you love (or hate)?"
                value={vibe}
                onChange={(e) => setVibe(e.target.value)}
              />
            </label>
            <div className="flex gap-2 mt-1">
              <button type="button" className="demo-btn demo-btn-ghost px-4 py-3" onClick={() => setStep(1)}>
                <ArrowLeft size={16} /> Back
              </button>
              <button type="submit" className="demo-btn demo-btn-primary flex-1 py-3">
                Send — build my preview <ArrowRight size={16} />
              </button>
            </div>
          </form>
        )}

        {step === 3 && (
          <div className="text-center py-2" role="status">
            <div
              className="mx-auto mb-3 h-14 w-14 rounded-full flex items-center justify-center"
              style={{ background: "var(--glow)", border: "1px solid var(--brass)" }}
            >
              <Check size={26} style={{ color: "var(--brass-bright)" }} />
            </div>
            <h4 className="font-display text-xl" style={{ color: "var(--parchment)" }}>
              Got it. We&apos;re on it.
            </h4>
            <p className="text-sm mt-2" style={{ color: "var(--muted)" }}>
              A real person will hand-build your preview and email it to{" "}
              <span style={{ color: "var(--parchment)" }}>{email || "you"}</span> in a few days. No
              payment, no commitment.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
