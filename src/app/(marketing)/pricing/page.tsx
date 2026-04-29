import type { Metadata } from "next";
import Link from "next/link";
import { Estimator } from "./Estimator";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    'Transparent pricing for Porada websites, apps, and care. Three tiers, a live estimator, no "contact us" games.',
};

const tiers = [
  {
    label: "01 / STARTER",
    name: "Small & sharp",
    price: "$1.2k",
    small: "one-time",
    desc: "For small businesses who need a site that looks like they care and loads fast. Up to 6 pages, no custom CMS.",
    bullets: [
      "6 pages of custom design",
      "Mobile & keyboard-ready",
      "Simple content updates via Decap or WP",
      "1–2 weeks start to finish",
      "30-day post-launch support",
    ],
    ctaLabel: "Start here →",
    ctaKind: "ghost" as const,
  },
  {
    label: "02 / STANDARD · Most popular",
    name: "Considered & complete",
    price: "$2.5k",
    small: "one-time",
    desc:
      "The sweet spot. A real design system, a CMS your team can use, thoughtful inner pages, and things like a blog or case-study section.",
    bullets: [
      "Up to 14 pages + dynamic templates",
      "Custom CMS (Sanity, Payload, or WP)",
      "Blog + tagging + RSS",
      "Light animations & interactions",
      "Analytics + SEO baseline",
      "60 days post-launch support",
    ],
    ctaLabel: "Start here →",
    ctaKind: "primary" as const,
    featured: true,
  },
  {
    label: "03 / CUSTOM",
    name: "Product shape",
    price: "$4k+",
    small: "scoped",
    desc:
      "When you need more than a marketing site - a small app, a portal, a booking tool, or a migration with real complexity. Quoted by shape, not by page count.",
    bullets: [
      "Full product design & system",
      "Custom back end (Next.js / Supabase)",
      "Auth, roles, billing as needed",
      "Observability & error reporting",
      "Long-term support relationship",
    ],
    ctaLabel: "Talk to us →",
    ctaKind: "ghost" as const,
  },
];

const alwaysIn = [
  "Responsive + keyboard-friendly",
  "WCAG 2.2 AA accessibility pass",
  "Analytics wired up",
  "Page-speed budget defined",
  "SEO basics (meta, sitemap, OG)",
  "30-day post-launch support",
  "Your code in your GitHub",
];
const neverSurprises = [
  "Hidden scope changes",
  '"Enterprise" upsell pricing',
  "Locked-in hosting",
  "NDAs that forbid you talking to us",
  "Overseas subcontractors you didn't meet",
  "Agency-y jargon on invoices",
];

export default function PricingPage() {
  return (
    <>
      <section className="page-hero wrap">
        <div className="eyebrow" style={{ marginBottom: 20 }}>
          § Pricing · Transparent, boring, predictable
        </div>
        <h1 className="display">
          Honest numbers, up <em>front</em>.
        </h1>
        <p className="lede">
          No &quot;contact us for pricing.&quot; Here&apos;s what we charge, roughly what you get, and a quick estimator
          so you can sanity-check your budget before you even write to us.
        </p>
      </section>

      <section className="wrap" style={{ paddingBottom: 40 }}>
        <div className="tier-grid">
          {tiers.map((t) => (
            <div key={t.label} className={`tier${t.featured ? " featured" : ""}`}>
              <div className="eyebrow">{t.label}</div>
              <h3>{t.name}</h3>
              <div className="price">
                {t.price} <small>{t.small}</small>
              </div>
              <p className="desc">{t.desc}</p>
              <ul>
                {t.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
              <Link href="/quote" className={`btn btn-${t.ctaKind}`}>
                {t.ctaLabel}
              </Link>
            </div>
          ))}
        </div>

        <div className="tier retainer-card" style={{ marginTop: 32 }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 40, alignItems: "start" }}>
            <div style={{ flex: "1 1 360px" }}>
              <div className="eyebrow">04 / RETAINER</div>
              <h3>Ongoing care</h3>
              <div className="price">
                $500 <small>/month</small>
              </div>
              <p className="desc">
                Keep your site healthy after launch. We handle updates, content changes, performance
                monitoring, and small enhancements so you never have to think about it. Cancel
                anytime with 30 days notice.
              </p>
            </div>
            <div style={{ flex: "1 1 280px" }}>
              <ul>
                <li>Up to 8 hours of dev/design work per month</li>
                <li>Priority response within 24 hours</li>
                <li>Dependency & security updates</li>
                <li>Uptime monitoring & alerts</li>
                <li>Monthly performance report</li>
                <li>Rollover up to 4 unused hours</li>
              </ul>
              <Link href="/quote" className="btn btn-ghost" style={{ marginTop: 16 }}>
                Add to any tier →
              </Link>
            </div>
          </div>
        </div>

        <Estimator />
      </section>

      <section className="section">
        <div className="wrap grid-2" style={{ gap: 64, alignItems: "start" }}>
          <div>
            <div className="eyebrow" style={{ marginBottom: 16 }}>
              § What&apos;s always included
            </div>
            <h2 className="display" style={{ fontSize: "clamp(32px, 4vw, 52px)", maxWidth: "18ch" }}>
              The boring stuff that nobody mentions but you care about.
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
            <div>
              <div className="eyebrow" style={{ marginBottom: 8 }}>
                Always in
              </div>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  color: "var(--ink-soft)",
                  fontSize: 14,
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                {alwaysIn.map((i) => (
                  <li key={i}>✓ {i}</li>
                ))}
              </ul>
            </div>
            <div>
              <div className="eyebrow" style={{ marginBottom: 8 }}>
                Never surprises
              </div>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  color: "var(--ink-soft)",
                  fontSize: 14,
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                {neverSurprises.map((i) => (
                  <li key={i}>- {i}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
