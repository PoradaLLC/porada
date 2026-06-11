import Link from "next/link";
import { HeroCanvas } from "@/components/site/HeroCanvas";
import { ArrowIcon } from "@/components/site/ArrowIcon";
import { TextGenerateEffect } from "@/components/ui/aceternity/text-generate-effect";
import { InfiniteMovingCards } from "@/components/ui/aceternity/infinite-moving-cards";
import { HoverEffect } from "@/components/ui/aceternity/hover-effect";
import { CardSpotlight } from "@/components/ui/aceternity/card-spotlight";
import { HeroHighlight } from "@/components/ui/aceternity/hero-highlight";

const services = [
  {
    num: "01 / Websites",
    title: "Websites that don't make you cringe",
    desc:
      "Marketing sites, portfolios, and content-heavy publications. Built with whatever stack actually fits - not the one on a blog post.",
    from: "From $1.5k",
    span: "1–3 wks",
  },
  {
    num: "02 / Product & Apps",
    title: "Small apps that carry their weight",
    desc:
      "Internal tools, member portals, booking flows, dashboards. We design them, build them, and won't disappear after launch.",
    from: "From $3.5k",
    span: "2–4 wks",
  },
  {
    num: "03 / Tech advisory",
    title: "A fractional CTO who returns emails",
    desc:
      "Stack audits, vendor picks, hiring the first engineer, untangling the dashboard nobody remembers building.",
    from: "$1.5k / mo",
    span: "Ongoing",
  },
  {
    num: "04 / Care & hosting",
    title: "We keep the lights on",
    desc:
      "Hosting, backups, security updates, content edits, the occasional \u201Ccan you change the header real quick.\u201D On a friendly retainer.",
    from: "From $180 / mo",
    span: "Month-to-month",
  },
  {
    num: "05 / Migrations",
    title: "Move platforms without the all-nighter",
    desc:
      "WordPress \u2192 modern CMS, Squarespace \u2192 custom, Webflow \u2192 a stack your team can own. We plan it, you approve it, nothing breaks.",
    from: "From $1.2k",
    span: "1–2 wks",
  },
  {
    num: "06 / Workshops",
    title: "Half-days for your team",
    desc:
      "Design-system basics, \u201Chow our website actually works,\u201D picking an analytics stack you'll actually read.",
    from: "$750 / session",
    span: "Half-day",
  },
];

const workPreview = [
  {
    idx: "2026.04",
    id: "church-of-saint-luke",
    title: "Church of Saint Luke",
    sum: "Parish website on Next.js + Vercel. Plain, fast, accessible. Service times and announcements in one place.",
    meta: "Website · Next.js",
  },
  {
    idx: "2026.04",
    id: "forteca-estate",
    title: "Forteca Estate",
    sum: "Brand site for a real-estate business. Quiet, editorial presentation with Supabase-backed contact.",
    meta: "Website · Next.js",
  },
  {
    idx: "2026.03",
    id: "pocono-property-care",
    title: "Pocono Property Care",
    sum: "Property-management inquiry site for Kacper Liszewski. Sub-second mobile load, inquiries land where they should.",
    meta: "Website · Next.js + Supabase",
  },
];

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="hero wrap">
        <HeroCanvas />
        <div className="hero-inner">
          <div className="hero-eyebrow">
            <span>Porada Solutions · A small tech studio · Since 2026</span>
          </div>
          <h1 className="display">
            We build <HeroHighlight delay={0.3}>useful</HeroHighlight>
            <br />
            websites and <HeroHighlight delay={0.9}>untangle</HeroHighlight>
            <br />
            the tech behind them.
          </h1>
          <TextGenerateEffect
            className="hero-sub"
            words="A three-person studio helping small businesses and local organizations ship sites that actually work — and the systems that keep them running. No buzzwords, no framework cosplay."
          />
          <div className="hero-ctas">
            <Link href="/quote" className="btn btn-primary">
              Start a project <ArrowIcon />
            </Link>
            <Link href="/work" className="btn btn-ghost">
              See recent work
            </Link>
          </div>
          <div className="hero-meta">
            <div>
              <div className="k">Est.</div>
              <div className="v">2026</div>
            </div>
            <div>
              <div className="k">Projects shipped</div>
              <div className="v">3</div>
            </div>
            <div>
              <div className="k">Typical timeline</div>
              <div className="v">1–3 wks</div>
            </div>
          </div>
        </div>
      </section>

      <div className="border-y border-[var(--rule)]" aria-hidden="true">
        <InfiniteMovingCards
          speed="slow"
          items={[
            { quote: "Websites that load in under a second" },
            { quote: "Migrations without the all-nighter" },
            { quote: "Design that reads like a good email" },
            { quote: "Hosting we can explain to your parents" },
          ]}
        />
      </div>

      {/* SERVICES */}
      <section className="section">
        <div className="wrap">
          <header
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "end",
              gap: 32,
              marginBottom: 48,
              flexWrap: "wrap",
            }}
          >
            <div>
              <div className="eyebrow" style={{ marginBottom: 16 }}>
                § 01 - What we do
              </div>
              <h2 className="display" style={{ fontSize: "clamp(36px, 5vw, 68px)", maxWidth: "18ch" }}>
                Six ways we help.
              </h2>
            </div>
            <Link href="/services" className="btn btn-ghost">
              All services →
            </Link>
          </header>

          <HoverEffect items={services} />
        </div>
      </section>

      {/* STATEMENT */}
      <section className="section">
        <div className="wrap grid-2" style={{ gap: 80, alignItems: "start" }}>
          <div>
            <div className="eyebrow" style={{ marginBottom: 16 }}>
              § 02 - Why us
            </div>
            <p className="statement">
              Most agencies sell you a <em>shape</em>. We build you something you can <em>live in</em>.
            </p>
          </div>
          <div className="stack-lg" style={{ color: "var(--ink-soft)", fontSize: 17, lineHeight: 1.65 }}>
            <p>
              We&apos;re three people - two software engineers and a security engineer - building websites and small
              tools for clients who want their software to work in a year, not just on launch day.
            </p>
            <p>
              Porada Solutions is new, deliberately small, and based in the NY/NJ/PA area. We pick projects we can
              actually commit to, ship quickly, and stay around to maintain. Every site we hand off is something your
              team - or ours - can keep running without surprises.
            </p>
            <Link href="/about" className="inline" style={{ color: "var(--ink)" }}>
              More about the studio →
            </Link>
          </div>
        </div>
      </section>

      {/* WORK PREVIEW */}
      <section className="section">
        <div className="wrap">
          <header
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "end",
              gap: 32,
              marginBottom: 32,
              flexWrap: "wrap",
            }}
          >
            <div>
              <div className="eyebrow" style={{ marginBottom: 16 }}>
                § 03 - Recent work
              </div>
              <h2 className="display" style={{ fontSize: "clamp(36px, 5vw, 68px)", maxWidth: "14ch" }}>
                A few we&apos;re proud of.
              </h2>
            </div>
            <Link href="/work" className="btn btn-ghost">
              All case studies →
            </Link>
          </header>

          <div>
            {workPreview.map((w) => (
              <CardSpotlight key={w.id}>
                <Link href={`/work#${w.id}`} className="work-row">
                  <div className="idx">{w.idx}</div>
                  <div className="ttl">{w.title}</div>
                  <div className="sum">{w.sum}</div>
                  <div className="meta">{w.meta}</div>
                  <div className="arrow-wrap">
                    <svg width="20" height="20" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                      <path d="M4 4l8 8M12 4v8H4" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                  </div>
                </Link>
              </CardSpotlight>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section">
        <div className="wrap">
          <div className="cta-block">
            <div className="arc2" />
            <div className="arc" />
            <div className="cta-inner">
              <div
                className="eyebrow"
                style={{ color: "var(--cta-fg-faint)", marginBottom: 16 }}
              >
                § 04 - Let&apos;s talk
              </div>
              <h2>Have a project? Tell us about it.</h2>
              <p
                style={{
                  marginTop: 24,
                  maxWidth: "48ch",
                  fontSize: 17,
                  color: "var(--cta-fg-soft)",
                }}
              >
                We read every inquiry personally and reply within two business days. If we&apos;re not the right fit,
                we&apos;ll point you to someone who is.
              </p>
              <div style={{ marginTop: 36, display: "flex", gap: 12, flexWrap: "wrap" }}>
                <Link href="/quote" className="btn btn-accent">
                  Get a quote →
                </Link>
                <Link
                  href="/contact"
                  className="btn btn-ghost"
                  style={{
                    borderColor: "var(--cta-fg-border)",
                    color: "var(--cta-fg)",
                  }}
                >
                  Or just say hello
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
