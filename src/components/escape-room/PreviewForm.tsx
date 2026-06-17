"use client";

/**
 * Free-preview capture form — the one conversion on the page.
 *
 * Two steps, step one kept tiny to maximize conversion:
 *   Step 1: current website URL + email only ("give me your site and email,
 *           I'll send a free, custom preview in a few days").
 *   Step 2: what their game masters use (useful for the leaderboard's time
 *           data + future work) and a theme/vibe note.
 *
 * No proof anywhere on the page is gated behind this — only the personalized,
 * hand-built preview costs an email. The copy makes clear it's human-delivered,
 * not an instant template gimmick.
 *
 * TODO (backend): on completion, POST to a server action that inserts into the
 * `leads` table (current_website → current_website, email → contact_email,
 * derived host → business_name, gmTools + vibe → summary; demo_url stays null
 * until we build the preview) and sends a Resend confirmation. See
 * src/lib/email.ts and src/lib/supabase/server.ts for the existing patterns.
 */

import { useState, type FormEvent } from "react";
import { trackEvent } from "@/lib/capi";

type Step1Errors = Partial<Record<"website" | "email", string>>;

export function PreviewForm() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [website, setWebsite] = useState("");
  const [email, setEmail] = useState("");
  const [gmTools, setGmTools] = useState("");
  const [vibe, setVibe] = useState("");
  const [errors, setErrors] = useState<Step1Errors>({});

  function submitStep1(e: FormEvent) {
    e.preventDefault();
    const next: Step1Errors = {};
    if (!website.trim()) next.website = "We need your current site to build the preview.";
    if (!email.trim()) next.email = "Where should we send it?";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) next.email = "That doesn’t look like an email.";
    setErrors(next);
    if (Object.keys(next).length === 0) setStep(2);
  }

  function submitStep2(e: FormEvent) {
    e.preventDefault();
    // TODO: replace this client-only completion with a server action that
    // persists the lead + emails a confirmation (see header note).
    trackEvent("Lead", { em: email.trim() });
    setStep(3);
  }

  return (
    <section className="er-cta-band" id="preview">
      <div className="er-wrap er-cta-grid">
        {/* Pitch side — loudest moment on the page: one headline, one line, the
            three objections answered as chips, trust bullets relocated below. */}
        <div className="er-cta-pitch">
          <span className="er-step-tag">Your free preview</span>
          <h2 className="er-cta-headline">
            We’ll hand-build a free preview using <em>your</em> rooms.
          </h2>
          <p className="er-cta-line">
            Drop your site and email below. In a few days a real person sends back a custom preview of your venue on a
            site like the demo — booking, room pages, leaderboard and all.
          </p>

          {/* The three questions a skeptical owner asks, answered right at the form. */}
          <ul className="er-cta-answers">
            <li><strong>$0 to look</strong> — nothing owed until your site is live and you approve it</li>
            <li><strong>Live in ~2–4 weeks</strong> after you approve — your side of it is small</li>
            <li><strong>Keep your booking system</strong> — we embed it styled to match, or rebuild on its API</li>
          </ul>

          <ul className="er-cta-trust">
            <li>Hand-built by a person, not an instant template generator</li>
            <li>You don’t have to sign anything to see it</li>
            <li>The demo, leaderboard, and our work are free to poke at right now</li>
          </ul>
        </div>

        {/* Form side */}
        <div className="er-form er-cta-form">
          <div className="er-form-steps" aria-hidden="true">
            <span className={`dot${step >= 1 ? " on" : ""}`} />
            <span className={`dot${step >= 2 ? " on" : ""}`} />
          </div>

          {step === 1 && (
            <form onSubmit={submitStep1} noValidate>
              <p className="er-mono" style={{ fontSize: 11, color: "var(--er-ink-faint)", letterSpacing: "0.08em", marginBottom: 18 }}>
                STEP 1 / 2 · 20 seconds
              </p>
              <label className={`er-field${errors.website ? " err" : ""}`}>
                <span className="lab">Your current website</span>
                <input
                  className="er-input"
                  type="text"
                  inputMode="url"
                  placeholder="thevault.com"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />
                {errors.website && <span className="msg">{errors.website}</span>}
              </label>
              <label className={`er-field${errors.email ? " err" : ""}`}>
                <span className="lab">Email</span>
                <input
                  className="er-input"
                  type="email"
                  placeholder="you@yourvenue.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {errors.email && <span className="msg">{errors.email}</span>}
              </label>
              <div className="er-form-foot">
                <span className="er-mono" style={{ fontSize: 11, color: "var(--er-ink-faint)" }}>
                  We use your URL to detect your booking setup, too.
                </span>
                <button type="submit" className="er-btn er-btn-primary">
                  Next →
                </button>
              </div>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={submitStep2} noValidate>
              <p className="er-mono" style={{ fontSize: 11, color: "var(--er-accent)", letterSpacing: "0.08em", marginBottom: 8 }}>
                STEP 2 / 2 · OPTIONAL BUT HELPFUL
              </p>
              <p style={{ color: "var(--er-ink-soft)", fontSize: 15, marginBottom: 18, lineHeight: 1.55 }}>
                A couple things so your preview actually fits your venue.
              </p>
              <label className="er-field">
                <span className="lab">What do your game masters use to run the rooms?</span>
                <input
                  className="er-input"
                  type="text"
                  placeholder="e.g. our timer software, a booking tool, a spreadsheet…"
                  value={gmTools}
                  onChange={(e) => setGmTools(e.target.value)}
                />
              </label>
              <label className="er-field">
                <span className="lab">Theme / vibe we should match</span>
                <textarea
                  className="er-textarea"
                  placeholder="Horror? Heist? Family-friendly? Any colors or feel you love (or hate)?"
                  value={vibe}
                  onChange={(e) => setVibe(e.target.value)}
                />
              </label>
              <div className="er-form-foot">
                <button type="button" className="er-btn er-btn-ghost" onClick={() => setStep(1)}>
                  ← Back
                </button>
                <button type="submit" className="er-btn er-btn-primary">
                  Send — build my preview →
                </button>
              </div>
            </form>
          )}

          {step === 3 && (
            <div className="er-form-done" role="status">
              <div className="ring" aria-hidden="true">✓</div>
              <h3>Got it. We’re on it.</h3>
              <p>
                A real person will hand-build your preview and email it to{" "}
                <strong style={{ color: "var(--er-ink)" }}>{email || "you"}</strong> in a few days. No payment, no
                commitment — just a look at what your venue could be.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
