"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type KindVal =
  | "marketing"
  | "editorial"
  | "portfolio"
  | "ecom"
  | "portal"
  | "app"
  | "migration"
  | "advisory"
  | "other";

const KINDS: { val: KindVal; t: string; s: string; base: number }[] = [
  { val: "marketing", t: "Marketing site", s: "Homepage, about, services", base: 1400 },
  { val: "editorial", t: "Editorial / blog", s: "Content-heavy, custom CMS", base: 2200 },
  { val: "portfolio", t: "Portfolio / studio site", s: "Case studies, craft-forward", base: 1800 },
  { val: "ecom", t: "E-commerce", s: "Products, checkout, care", base: 3000 },
  { val: "portal", t: "Member portal", s: "Accounts, private content", base: 3600 },
  { val: "app", t: "Custom app / tool", s: "Internal or product", base: 4500 },
  { val: "migration", t: "Migration", s: "Platform change, content move", base: 1200 },
  { val: "advisory", t: "Advisory / CTO", s: "Monthly, not a build", base: 1500 },
  { val: "other", t: "Not sure yet", s: "We'll help you figure it out", base: 1800 },
];

const DESIGN_BARS = [
  { val: "template", t: "Template-ish", s: "Polished but quick", mul: 0.85 },
  { val: "custom", t: "Fully custom", s: "Our standard", mul: 1 },
  { val: "premium", t: "Editorial-grade", s: "Slower, much more considered", mul: 1.3 },
] as const;

type Timeline = "relaxed" | "normal" | "firm" | "rush";
const TIMELINES: { val: Timeline; t: string; s: string }[] = [
  { val: "relaxed", t: "Relaxed", s: "No hard deadline" },
  { val: "normal", t: "Normal", s: "6–8 weeks out" },
  { val: "firm", t: "Firm deadline", s: "Specific launch date" },
  { val: "rush", t: "Rush", s: "Under 4 weeks" },
];
const TIMELINE_MUL: Record<Timeline, number> = { relaxed: 0.95, normal: 1, firm: 1.1, rush: 1.3 };
const TIMELINE_LABEL: Record<Timeline, string> = {
  relaxed: "Relaxed",
  normal: "Normal",
  firm: "Firm deadline",
  rush: "Rush",
};

const BUDGETS = [
  { val: "under1500", t: "Under $1.5k", s: "Small & simple" },
  { val: "1500to3k", t: "$1.5k – $3k", s: "Our sweet spot" },
  { val: "3to5k", t: "$3k – $5k", s: "Fully featured" },
  { val: "5plus", t: "$5k+", s: "Complex scope" },
  { val: "unsure", t: "Not sure", s: "That's okay" },
  { val: "monthly", t: "Monthly retainer", s: "Advisory / Care" },
] as const;

const ADDONS = [
  { id: "cms", t: "Custom CMS", s: "Sanity / Payload, content modeling, editor training", cost: 500, pp: "+$500" },
  { id: "blog", t: "Blog / publication", s: "Tags, RSS, author pages", cost: 400, pp: "+$400" },
  { id: "auth", t: "Accounts & auth", s: "Magic links or email+password", cost: 900, pp: "+$900" },
  { id: "payments", t: "Payments (Stripe)", s: "Checkout, customer portal, webhooks", cost: 700, pp: "+$700" },
  { id: "i18n", t: "Multi-language", s: "Up to 3 locales", cost: 500, pp: "+$500" },
];

type DesignVal = (typeof DESIGN_BARS)[number]["val"];

type FormFields = {
  name: string;
  email: string;
  company: string;
  role: string;
  brief: string;
  referral: string;
};
const EMPTY_FORM: FormFields = { name: "", email: "", company: "", role: "", brief: "", referral: "" };

type Errors = Partial<Record<keyof FormFields, string>>;

function fmt(n: number) {
  return "$" + Math.round(n).toLocaleString();
}

export function QuoteWizard() {
  const [step, setStep] = useState(1);
  const [kind, setKind] = useState<KindVal | null>(null);
  const [design, setDesign] = useState<DesignVal>("custom");
  const [timeline, setTimeline] = useState<Timeline>("normal");
  const [budget, setBudget] = useState<string>("");
  const [addons, setAddons] = useState<Record<string, boolean>>({});
  const [form, setForm] = useState<FormFields>(EMPTY_FORM);
  const [errors, setErrors] = useState<Errors>({});

  const selectedKind = useMemo(() => KINDS.find((k) => k.val === kind) ?? null, [kind]);
  const selectedDesign = useMemo(() => DESIGN_BARS.find((d) => d.val === design) ?? DESIGN_BARS[1], [design]);

  const estimate = useMemo(() => {
    if (!selectedKind) return null;
    let sub = selectedKind.base * selectedDesign.mul;
    for (const a of ADDONS) if (addons[a.id]) sub += a.cost;
    sub *= TIMELINE_MUL[timeline];
    return sub;
  }, [selectedKind, selectedDesign, addons, timeline]);

  function go(n: number) {
    const bounded = Math.max(1, Math.min(6, n));
    setStep(bounded);
    if (typeof window !== "undefined") {
      const el = document.querySelector(".quote-shell");
      if (el)
        window.scrollTo({
          top: (el as HTMLElement).offsetTop - 80,
          behavior: "smooth",
        });
    }
  }

  function validateStep4(): boolean {
    const e: Errors = {};
    if (!form.name.trim()) e.name = "We'd like a name to address you by.";
    if (!form.email.trim()) e.email = "Where should we reply?";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) e.email = "That doesn't look like an email.";
    if (!form.brief.trim()) e.brief = "A short paragraph is fine.";
    else if (form.brief.trim().length < 10) e.brief = "A little more detail helps us reply usefully.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function nextFromStep() {
    if (step === 1 && !kind) return;
    if (step === 4 && !validateStep4()) return;
    go(step + 1);
  }

  useEffect(() => {
    if (step !== 4) return;
    setErrors({});
  }, [step]);

  const progressPct = Math.min(100, (step / 5) * 100);
  const addonLabels = ADDONS.filter((a) => addons[a.id]).map((a) => a.t);
  const budgetLabel = BUDGETS.find((b) => b.val === budget)?.t ?? "-";

  return (
    <div className="quote-shell">
      <nav className="stepper" aria-label="Quote steps">
        <ol>
          {[
            { n: 1, label: "Project shape" },
            { n: 2, label: "Scope & add-ons" },
            { n: 3, label: "Timing & budget" },
            { n: 4, label: "About you" },
            { n: 5, label: "Review & send" },
          ].map((s) => {
            const cls = step === s.n ? "active" : step > s.n ? "done" : "";
            return (
              <li
                key={s.n}
                className={cls}
                onClick={() => {
                  if (s.n <= step + 1) go(s.n);
                }}
              >
                <span className="no">
                  <span>{s.n}</span>
                </span>{" "}
                {s.label}
              </li>
            );
          })}
        </ol>
      </nav>

      <div className="stage">
        {/* STEP 1 */}
        <div className={`panel${step === 1 ? " on" : ""}`}>
          <h2>What are we making?</h2>
          <p className="sub">Pick the closest match - we&apos;ll refine together.</p>
          <div className="opt-grid">
            {KINDS.map((k) => (
              <button
                key={k.val}
                type="button"
                className={`opt-card${kind === k.val ? " on" : ""}`}
                onClick={() => setKind(k.val)}
              >
                <span className="t">{k.t}</span>
                <span className="s">{k.s}</span>
              </button>
            ))}
          </div>
          <div className="step-foot">
            <div
              className="mono"
              style={{ fontSize: 11, color: "var(--ink-faint)", letterSpacing: "0.06em" }}
            >
              Step 1 / 5
            </div>
            <div className="progress">
              <div style={{ width: `${progressPct}%` }} />
            </div>
            <button type="button" className="btn btn-primary" onClick={nextFromStep} disabled={!kind}>
              Next →
            </button>
          </div>
        </div>

        {/* STEP 2 */}
        <div className={`panel${step === 2 ? " on" : ""}`}>
          <h2>What&apos;s in scope?</h2>
          <p className="sub">Pick what&apos;s definitely needed. Don&apos;t overthink it - we can adjust.</p>

          <div>
            <label
              className="mono"
              style={{ fontSize: 11, color: "var(--ink-faint)", letterSpacing: "0.1em", textTransform: "uppercase" }}
            >
              Design bar
            </label>
            <div className="opt-grid" style={{ marginTop: 10 }}>
              {DESIGN_BARS.map((d) => (
                <button
                  key={d.val}
                  type="button"
                  className={`opt-card${design === d.val ? " on" : ""}`}
                  onClick={() => setDesign(d.val)}
                >
                  <span className="t">{d.t}</span>
                  <span className="s">{d.s}</span>
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginTop: 8 }}>
            <label
              className="mono"
              style={{ fontSize: 11, color: "var(--ink-faint)", letterSpacing: "0.1em", textTransform: "uppercase" }}
            >
              Add-ons
            </label>
            <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 0 }}>
              {ADDONS.map((a, idx) => (
                <label
                  key={a.id}
                  className="est-check"
                  style={{
                    padding: "14px 0",
                    borderTop: "1px solid var(--rule)",
                    borderBottom: idx === ADDONS.length - 1 ? "1px solid var(--rule)" : undefined,
                  }}
                >
                  <input
                    type="checkbox"
                    checked={!!addons[a.id]}
                    onChange={(e) => {
                      const next = e.target.checked;
                      setAddons((s) => ({ ...s, [a.id]: next }));
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 500 }}>{a.t}</div>
                    <div style={{ fontSize: 13, color: "var(--ink-soft)", marginTop: 2 }}>{a.s}</div>
                  </div>
                  <div className="mono" style={{ fontSize: 12, color: "var(--ink-faint)" }}>
                    {a.pp}
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="step-foot">
            <button type="button" className="btn btn-ghost" onClick={() => go(step - 1)}>
              ← Back
            </button>
            <div className="progress">
              <div style={{ width: `${progressPct}%` }} />
            </div>
            <button type="button" className="btn btn-primary" onClick={nextFromStep}>
              Next →
            </button>
          </div>
        </div>

        {/* STEP 3 */}
        <div className={`panel${step === 3 ? " on" : ""}`}>
          <h2>When &amp; how much?</h2>
          <p className="sub">Honesty here helps us be honest back.</p>

          <div>
            <label
              className="mono"
              style={{ fontSize: 11, color: "var(--ink-faint)", letterSpacing: "0.1em", textTransform: "uppercase" }}
            >
              Timeline
            </label>
            <div className="opt-grid" style={{ marginTop: 10 }}>
              {TIMELINES.map((t) => (
                <button
                  key={t.val}
                  type="button"
                  className={`opt-card${timeline === t.val ? " on" : ""}`}
                  onClick={() => setTimeline(t.val)}
                >
                  <span className="t">{t.t}</span>
                  <span className="s">{t.s}</span>
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginTop: 8 }}>
            <label
              className="mono"
              style={{ fontSize: 11, color: "var(--ink-faint)", letterSpacing: "0.1em", textTransform: "uppercase" }}
            >
              Budget range (rough is fine)
            </label>
            <div className="opt-grid" style={{ marginTop: 10 }}>
              {BUDGETS.map((b) => (
                <button
                  key={b.val}
                  type="button"
                  className={`opt-card${budget === b.val ? " on" : ""}`}
                  onClick={() => setBudget(b.val)}
                >
                  <span className="t">{b.t}</span>
                  <span className="s">{b.s}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="step-foot">
            <button type="button" className="btn btn-ghost" onClick={() => go(step - 1)}>
              ← Back
            </button>
            <div className="progress">
              <div style={{ width: `${progressPct}%` }} />
            </div>
            <button type="button" className="btn btn-primary" onClick={nextFromStep}>
              Next →
            </button>
          </div>
        </div>

        {/* STEP 4 */}
        <div className={`panel${step === 4 ? " on" : ""}`}>
          <h2>A bit about you.</h2>
          <p className="sub">So we know where we&apos;re replying.</p>

          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div className={`field${errors.name ? " has-error" : ""}`}>
                <label className="label" htmlFor="q-name">
                  Your name
                </label>
                <input
                  className="input"
                  id="q-name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.currentTarget.value })}
                  placeholder="Jordan Okafor"
                />
                {errors.name && (
                  <div className="err" style={{ display: "block" }}>
                    {errors.name}
                  </div>
                )}
              </div>
              <div className={`field${errors.email ? " has-error" : ""}`}>
                <label className="label" htmlFor="q-email">
                  Email
                </label>
                <input
                  className="input"
                  id="q-email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.currentTarget.value })}
                  placeholder="you@company.com"
                />
                {errors.email && (
                  <div className="err" style={{ display: "block" }}>
                    {errors.email}
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div className="field">
                <label className="label" htmlFor="q-company">
                  Company
                </label>
                <input
                  className="input"
                  id="q-company"
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.currentTarget.value })}
                  placeholder="Fieldnotes Coffee"
                />
              </div>
              <div className="field">
                <label className="label" htmlFor="q-role">
                  Role
                </label>
                <input
                  className="input"
                  id="q-role"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.currentTarget.value })}
                  placeholder="Director of Ops"
                />
              </div>
            </div>

            <div className={`field${errors.brief ? " has-error" : ""}`}>
              <label className="label" htmlFor="q-brief">
                What&apos;s the project, in a paragraph?
              </label>
              <textarea
                className="textarea"
                id="q-brief"
                value={form.brief}
                onChange={(e) => setForm({ ...form, brief: e.currentTarget.value })}
                placeholder="What are you trying to do? Who's it for? Any context we should know?"
              />
              {errors.brief && (
                <div className="err" style={{ display: "block" }}>
                  {errors.brief}
                </div>
              )}
            </div>

            <div className="field">
              <label className="label" htmlFor="q-referral">
                How&apos;d you find us? (optional)
              </label>
              <input
                className="input"
                id="q-referral"
                value={form.referral}
                onChange={(e) => setForm({ ...form, referral: e.currentTarget.value })}
                placeholder="Google, a friend, that blog post…"
              />
            </div>
          </div>

          <div className="step-foot">
            <button type="button" className="btn btn-ghost" onClick={() => go(step - 1)}>
              ← Back
            </button>
            <div className="progress">
              <div style={{ width: `${progressPct}%` }} />
            </div>
            <button type="button" className="btn btn-primary" onClick={nextFromStep}>
              Review →
            </button>
          </div>
        </div>

        {/* STEP 5 */}
        <div className={`panel${step === 5 ? " on" : ""}`}>
          <h2>One last look.</h2>
          <p className="sub">Check this over; we&apos;ll use it to draft your real quote.</p>
          <div>
            {(
              [
                ["Project shape", selectedKind?.t ?? "-"],
                ["Design bar", selectedDesign.t],
                ["Add-ons", addonLabels.length ? addonLabels.join(", ") : "None"],
                ["Timeline", TIMELINE_LABEL[timeline]],
                ["Budget range", budgetLabel],
                ["From", (form.name || "-") + (form.company ? ` · ${form.company}` : "")],
                ["Email", form.email || "-"],
              ] as [string, string][]
            ).map(([k, v]) => (
              <div key={k} className="review-row">
                <span className="k">{k}</span>
                <span className="v">{v}</span>
              </div>
            ))}
          </div>
          <div className="estimate-big">
            <div className="lab">Ballpark estimate</div>
            <div className="amt">
              {kind === "advisory"
                ? "$1.5k / mo"
                : estimate == null
                ? "-"
                : fmt(estimate)}
            </div>
            <div
              className="mono"
              style={{ fontSize: 11, letterSpacing: "0.06em", opacity: 0.7 }}
            >
              {kind === "advisory"
                ? "~8 hrs/mo · 2 mo minimum"
                : estimate == null
                ? "-"
                : `approx. range · ${fmt(estimate * 0.9)} – ${fmt(estimate * 1.1)}`}
            </div>
          </div>
          <div className="step-foot">
            <button type="button" className="btn btn-ghost" onClick={() => go(step - 1)}>
              ← Back
            </button>
            <div className="progress">
              <div style={{ width: `${progressPct}%` }} />
            </div>
            <button type="button" className="btn btn-primary" onClick={() => go(6)}>
              Send quote request →
            </button>
          </div>
        </div>

        {/* SUCCESS */}
        <div className={`panel${step === 6 ? " on" : ""}`}>
          <div className="success-screen">
            <div className="ring">◇</div>
            <div
              className="mono"
              style={{
                fontSize: 11,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--accent)",
              }}
            >
              Received · thank you
            </div>
            <h2 style={{ marginTop: 16 }}>Got it. We&apos;ll be in touch.</h2>
            <p>
              The team will review your notes personally. You&apos;ll hear back within two business days with a real
              proposal - scope, fixed price, and a timeline we can commit to.
            </p>
            <div style={{ marginTop: 32, display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
              <Link href="/" className="btn btn-ghost">
                Back to home
              </Link>
              <Link href="/work" className="btn btn-primary">
                See recent work →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
