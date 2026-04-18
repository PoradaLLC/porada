"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Kind =
  | { val: "marketing"; label: "Marketing site"; from: "from $1.2k"; base: 1200 }
  | { val: "editorial"; label: "Editorial / blog"; from: "from $1.8k"; base: 1800 }
  | { val: "ecom"; label: "E-commerce"; from: "from $2.8k"; base: 2800 }
  | { val: "portal"; label: "Member portal"; from: "from $3.2k"; base: 3200 }
  | { val: "app"; label: "Custom web app"; from: "from $4.2k"; base: 4200 }
  | { val: "migration"; label: "Migration only"; from: "from $1k"; base: 1000 };

const kinds: Kind[] = [
  { val: "marketing", label: "Marketing site", from: "from $1.2k", base: 1200 },
  { val: "editorial", label: "Editorial / blog", from: "from $1.8k", base: 1800 },
  { val: "ecom", label: "E-commerce", from: "from $2.8k", base: 2800 },
  { val: "portal", label: "Member portal", from: "from $3.2k", base: 3200 },
  { val: "app", label: "Custom web app", from: "from $4.2k", base: 4200 },
  { val: "migration", label: "Migration only", from: "from $1k", base: 1000 },
];

const designBars = [
  { val: "template", t: "Template\u2011ish", s: "–15%", mul: 0.85 },
  { val: "custom", t: "Fully custom", s: "baseline", mul: 1 },
  { val: "premium", t: "Editorial\u2011grade", s: "+25%", mul: 1.25 },
];

const rushBars = [
  { val: "normal", t: "Normal", s: "6–8 wks", mul: 1 },
  { val: "firm", t: "Firm deadline", s: "+10%", mul: 1.1 },
  { val: "rush", t: "Rush (< 4 wks)", s: "+30%", mul: 1.3 },
];

type Addon = {
  id: string;
  label: string;
  desc: string;
  cost: number;
  recurring?: boolean;
  pp: string;
};

const addons: Addon[] = [
  { id: "cms", label: "Custom CMS setup", desc: "Sanity / Payload, content modeling, editor training", cost: 500, pp: "+$500" },
  { id: "blog", label: "Blog / publication section", desc: "Tagging, RSS, author pages", cost: 400, pp: "+$400" },
  { id: "auth", label: "User accounts & auth", desc: "Magic links or password + session management", cost: 900, pp: "+$900" },
  { id: "payments", label: "Payments (Stripe)", desc: "Checkout, customer portal, webhooks", cost: 700, pp: "+$700" },
  { id: "i18n", label: "Multi\u2011language", desc: "Up to 3 locales, translation workflow", cost: 500, pp: "+$500" },
  { id: "care", label: "Care & hosting retainer", desc: "Monthly - hosting, backups, small edits", cost: 180, recurring: true, pp: "+$180/mo" },
];

function fmt(n: number) {
  return "$" + Math.round(n).toLocaleString();
}
function fmtK(n: number) {
  if (n >= 1000) return "$" + (n / 1000).toFixed(1) + "k";
  return "$" + Math.round(n);
}

export function Estimator() {
  const [kind, setKind] = useState<Kind>(kinds[0]);
  const [pages, setPages] = useState(8);
  const [design, setDesign] = useState(designBars[1]);
  const [rush, setRush] = useState(rushBars[0]);
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const { total, lo, hi, rows, recurring } = useMemo(() => {
    const pageFactor = 1 + (pages - 6) * 0.06;
    const pageMul = Math.max(0.6, pageFactor);
    let subtotal = kind.base * pageMul * design.mul;
    let addonsOne = 0;
    let addonsMonth = 0;
    for (const a of addons) {
      if (!checked[a.id]) continue;
      if (a.recurring) addonsMonth += a.cost;
      else addonsOne += a.cost;
    }
    subtotal += addonsOne;
    subtotal *= rush.mul;
    const r: { id: string; k: string; v: string }[] = [
      { id: "base", k: `Base · ${kind.label.toLowerCase()}`, v: fmt(kind.base) },
      { id: "pages", k: `Pages (${pages})`, v: "×" + pageMul.toFixed(2) },
      { id: "design", k: "Design bar", v: "×" + design.mul.toFixed(2) },
      { id: "rush", k: "Timeline", v: "×" + rush.mul.toFixed(2) },
    ];
    for (const a of addons) {
      if (checked[a.id] && !a.recurring) {
        r.push({ id: `addon-${a.id}`, k: a.label, v: "+" + fmt(a.cost) });
      }
    }
    return {
      total: subtotal,
      lo: subtotal * 0.9,
      hi: subtotal * 1.1,
      rows: r,
      recurring: addonsMonth,
    };
  }, [kind, pages, design, rush, checked]);

  return (
    <div className="est" id="estimator">
      <div className="est-header">
        <div>
          <div className="eyebrow" style={{ marginBottom: 6 }}>
            § Quick estimator · 60 seconds
          </div>
          <h3>Sanity-check your budget.</h3>
        </div>
        <Link href="/quote" className="btn btn-ghost">
          Send this as a quote →
        </Link>
      </div>
      <div className="est-body">
        <div className="est-form">
          <div className="est-row">
            <label className="cap">What are we making?</label>
            <div className="est-opts">
              {kinds.map((k) => (
                <button
                  key={k.val}
                  type="button"
                  className={`est-opt${kind.val === k.val ? " on" : ""}`}
                  onClick={() => setKind(k)}
                >
                  <span className="t">{k.label}</span>
                  <span className="s">{k.from}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="est-row">
            <label className="cap" htmlFor="pagesRange">
              How many pages / views?
            </label>
            <div className="est-slider">
              <input
                id="pagesRange"
                type="range"
                min={3}
                max={40}
                value={pages}
                onChange={(e) => {
                  const n = parseInt(e.target.value, 10);
                  if (Number.isFinite(n)) setPages(n);
                }}
              />
              <div className="val">
                <span>{pages}</span> pages
              </div>
            </div>
          </div>

          <div className="est-row">
            <label className="cap">Design bar</label>
            <div className="est-opts">
              {designBars.map((d) => (
                <button
                  key={d.val}
                  type="button"
                  className={`est-opt${design.val === d.val ? " on" : ""}`}
                  onClick={() => setDesign(d)}
                >
                  <span className="t">{d.t}</span>
                  <span className="s">{d.s}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="est-row">
            <label className="cap">Add-ons</label>
            {addons.map((a) => (
              <label key={a.id} className="est-check">
                <input
                  type="checkbox"
                  checked={!!checked[a.id]}
                  onChange={(e) => {
                    const next = e.target.checked;
                    setChecked((c) => ({ ...c, [a.id]: next }));
                  }}
                />
                <div>
                  <div className="t">{a.label}</div>
                  <div className="s">{a.desc}</div>
                </div>
                <div className="pp">{a.pp}</div>
              </label>
            ))}
          </div>

          <div className="est-row">
            <label className="cap">Timeline urgency</label>
            <div className="est-opts">
              {rushBars.map((r) => (
                <button
                  key={r.val}
                  type="button"
                  className={`est-opt${rush.val === r.val ? " on" : ""}`}
                  onClick={() => setRush(r)}
                >
                  <span className="t">{r.t}</span>
                  <span className="s">{r.s}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <aside className="est-summary">
          <h4>Your estimate</h4>
          <div className="est-total">{fmt(total)}</div>
          <div className="est-range">
            approx. range <span>{`${fmtK(lo)} – ${fmtK(hi)}`}</span>
          </div>
          <div className="est-break">
            {rows.map((row) => (
              <div key={row.id} className="row">
                <span>{row.k}</span>
                <span>{row.v}</span>
              </div>
            ))}
          </div>
          {recurring > 0 && (
            <div
              style={{
                marginTop: 14,
                fontFamily: "var(--font-mono-family)",
                fontSize: 13,
                color: "var(--accent)",
              }}
            >
              + {fmt(recurring)} / month recurring
            </div>
          )}
          <div className="est-disclaimer">
            Rough order of magnitude - not a binding quote. Real estimates come after a short call so we can actually
            understand what you need.
          </div>
          <Link
            href="/quote"
            className="btn btn-primary"
            style={{ marginTop: 22, width: "100%", justifyContent: "center" }}
          >
            Send this as a quote →
          </Link>
        </aside>
      </div>
    </div>
  );
}
