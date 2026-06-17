import { DemoCarousel } from "./demo/DemoCarousel";

/**
 * The ONE mechanism section — does the "features" job exactly once.
 *
 * Replaces the three former passes (snippet grid + the 01–11 feature cards + the
 * standalone "full digital menu"). It is structured as:
 *   1. show  — <DemoCarousel/>: one large real frame at a time + a swipeable strip
 *   2. proof — 1–2 short, clearly-illustrative outcome lines (mid-page proof)
 *   3. tell  — a compact differentiator list: name + one outcome line, no card
 *              chrome, no numbering, no badges (reuses the `.er-menu` grid)
 * Then the quiet, future-tense "later" aside for the physical/AI services.
 *
 * Data arrays live up top, presentation below (cinematic-dark style preserved).
 * Motion is the global `data-reveal` scroll-reveal; the differentiator items
 * carry it individually so the list cascades in (staggered via CSS).
 */

/** The differentiator list — every capability, paired with its owner outcome.
 *  One flat list; no tiers, no numbering, no badges. */
const DIFFERENTIATORS: { t: string; o: string }[] = [
  { t: "Embedded booking", o: "Reserve inside your site — fewer drop-offs" },
  { t: "Customer accounts", o: "An owned player list you keep" },
  { t: "Completionist passport", o: "Repeat visits across every room" },
  { t: "Hosted leaderboard", o: "The come-back hook we build and host" },
  { t: "Gift cards", o: "Prepaid revenue + brand-new customers" },
  { t: "Corporate funnel", o: "Fills weekday daytime dead hours" },
  { t: "Funnel optimization", o: "More of the traffic you already get converts" },
  { t: "Promo codes", o: "Fill slow nights on demand" },
  { t: "Local SEO + Google", o: "Found for “escape room near me”" },
  { t: "Review funnel", o: "More 5-star reviews, higher ranking" },
  { t: "Room teasers", o: "Spoiler-free curiosity that books" },
  { t: "Care & hosting", o: "We keep it fast and online" },
];

/** Mid-page proof. Honest per the module guardrail (no fake testimonials /
 *  invented clients): these are clearly-labeled illustrative outcome lines that
 *  name the mechanism behind each, not quotes attributed to real operators. */
const PROOF: { line: string; by: string }[] = [
  {
    line: "“Players come back to beat their time — and bring a bigger group next time.”",
    by: "the hosted-leaderboard effect",
  },
  {
    line: "“Booking lives in the site, so far fewer people bail at the popup.”",
    by: "the embedded-funnel effect",
  },
];

const LATER: string[] = [
  "Electrical-engineering & microcontroller consulting (prop builds & repairs)",
  "Full 3D room scans / immersive previews",
  "AI-generated room content (intro/outro screens)",
  "AI support agents for your game masters",
  "Interactive in-room AI characters",
];

export function Mechanism() {
  return (
    <section className="er-section er-wrap" id="how">
      <div className="er-head" data-reveal>
        <div className="er-eyebrow">See it, then scan it</div>
        <h2 className="er-display">A working escape-room site — and everything it does for your bookings.</h2>
        <p className="er-lede">
          Real screens from a demo we built, then the whole capability list at a glance — every feature paired with what
          it does for your bottom line.
        </p>
      </div>

      {/* 1 — show */}
      <DemoCarousel />

      {/* 2 — proof (illustrative, mid-page) */}
      <div className="er-proof" data-reveal>
        <div className="er-proof-lines">
          {PROOF.map((p) => (
            <blockquote className="er-proof-quote" key={p.by}>
              <p>{p.line}</p>
              <cite>{p.by}</cite>
            </blockquote>
          ))}
        </div>
        <p className="er-proof-note">
          Illustrative outcomes — real operator quotes replace these once your first sites are live.
        </p>
      </div>

      {/* 3 — tell */}
      <div className="er-mech-tell">
        <h3 className="er-mech-subhead" data-reveal>Everything we build into it</h3>
        <div className="er-menu">
          {DIFFERENTIATORS.map((m) => (
            <div className="er-menu-item" data-reveal key={m.t}>
              <div className="t">{m.t}</div>
              <div className="o">{m.o}</div>
            </div>
          ))}
        </div>

        {/* Secondary, future-tense aside — deliberately quieter than everything above. */}
        <aside className="er-later" data-reveal>
          <h3>Once your site’s live, there’s more we can do.</h3>
          <p>
            We also do the physical, in-room side — electronics, custom props, AI features. But first, let’s get your
            site right. These come later, on request, when you’re ready:
          </p>
          <ul>
            {LATER.map((l) => (
              <li key={l}>{l}</li>
            ))}
          </ul>
        </aside>
      </div>
    </section>
  );
}
