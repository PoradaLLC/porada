import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Process",
  description:
    "Six weeks, six phases, zero surprises — how Sierra-117 runs a typical engagement, from first conversation to launch.",
};

const phases = [
  {
    week: "00",
    title: "Conversation.",
    hours: "Before we sign anything",
    body:
      "We talk for an hour. You describe what you're trying to do and what's in the way. We ask annoyingly specific questions about your team, your existing tooling, and your actual goals (not the ones in the brief).",
    bullets: [
      "60-minute call, no slides",
      "Written summary sent within 48 hours",
      "We tell you honestly if we're the wrong fit",
    ],
    deliv: "A short written proposal with scope, timeline, and a fixed price.",
  },
  {
    week: "01",
    title: "Discovery & kickoff.",
    hours: "≈ 20 hours · async + 2 meetings",
    body:
      "Once we're working together, we spend a week understanding the shape of the thing. Your team, your content, your audience, the constraints you didn't think to mention.",
    bullets: [
      "Stakeholder interviews (we actually talk to 3–5 people)",
      "Content audit of what exists today",
      "Technical audit of your current stack & integrations",
      "Success metrics agreed in writing",
    ],
    deliv: "A Sierra\u2011117 brief — 6–10 pages, plain English, signed off before we go further.",
  },
  {
    week: "02",
    title: "Design — first pass.",
    hours: "≈ 30 hours · two rounds",
    body:
      'Two directions for the home page and one key inner page. We present them live in Figma with context, not as a "reveal." You pick one and we refine.',
    bullets: [
      "Two distinct home-page directions",
      "One inner-page layout per direction",
      "Type system, color palette, and components sketched",
      "One 90-minute review call",
    ],
    deliv: "A clear design direction, signed off.",
  },
  {
    week: "03",
    title: "Design — full system.",
    hours: "≈ 40 hours · continuous review",
    body:
      "Every remaining page, every component, every state — including the boring ones nobody notices until they break. We build a shared Figma library your team can use later.",
    bullets: [
      "All page layouts + responsive behavior",
      "Error states, empty states, loading states",
      "A written rationale for the decisions we made",
    ],
    deliv: "A complete visual system & Figma library.",
  },
  {
    week: "04",
    title: "Build — front & back.",
    hours: "≈ 60 hours · preview deploys daily",
    body:
      "Engineering starts when design is ~80% done. You get a preview URL on day one and a fresh deploy every time we push. No \u201Cbig reveal\u201D at the end.",
    bullets: [
      "Production-grade codebase from the first commit",
      "CMS configured, content seeded",
      "Preview deploys on every branch",
      "Accessibility audit baked into each component",
    ],
    deliv: "A working site at a preview URL, updated daily.",
  },
  {
    week: "05",
    title: "Polish, QA & training.",
    hours: "≈ 25 hours",
    body:
      "We run a proper QA pass across devices and browsers. You get a training session so your team isn't afraid of the CMS. We write a handoff doc in English, not runbook-speak.",
    bullets: [
      "Cross-browser & device QA",
      "Lighthouse / performance budget met",
      "CMS walkthrough video for your team",
      "Plain-English handoff document",
    ],
    deliv: "A site ready to ship & a team trained to run it.",
  },
  {
    week: "06",
    title: "Launch & aftercare.",
    hours: "30 days of monitoring included",
    body:
      "We cut over DNS, watch the dashboards, and fix anything that surfaces in the first thirty days at no cost. Then we stay around on a Care plan if you want us.",
    bullets: [
      "DNS / email / analytics cutover plan",
      "Live monitoring for the first 30 days",
      "Optional Care & hosting retainer from here on",
    ],
    deliv: "A live site, and a human on the other end for as long as you want.",
  },
];

const principles = [
  { num: "01", title: "No surprise invoices.", text: "Fixed prices for fixed scopes. If something new comes up, we flag it in writing before we do it, not after." },
  { num: "02", title: "One human, not a ticket queue.", text: "You always have a direct line to the person working on your project. No account managers playing telephone." },
  { num: "03", title: "Boring technology, where possible.", text: "We pick the framework your next hire will recognize. New shiny things have to earn their place." },
  { num: "04", title: "Write it down.", text: "Decisions live in a shared doc with dates on them. Two years later, you'll know why we did what we did." },
  { num: "05", title: "Accessibility isn\u2019t a phase.", text: "It's baked into every component from day one. WCAG 2.2 AA as a floor, not a ceiling." },
  { num: "06", title: "Preview early, often.", text: "You see a working URL by week one. We'd rather catch misunderstandings on week two than week five." },
  { num: "07", title: "Own your stuff.", text: 'Code in your GitHub org. CMS in your account. No "we host the keys." You can fire us and keep everything.' },
  { num: "08", title: "Finish.", text: "We'd rather do fewer things completely than a dozen halfway. Launch dates are honored or renegotiated in writing." },
];

const faqs = [
  {
    q: "How much do you actually cost?",
    a: "A small marketing site is usually $1.2k–$2.5k. A mid-sized content site or small e-commerce runs $2.5k–$3.5k. A custom tool or member portal is typically $3.5k–$5k. We stay in that range on purpose — it keeps us honest and it keeps us picking work we can actually finish.",
    open: true,
  },
  {
    q: "Do you work with WordPress?",
    a: "Sometimes — we don\u2019t have ideology about it. If your team already uses WordPress and likes it, we'll work with it. If you're open to alternatives, we'll suggest a CMS that's lighter and harder to break. Either way, we're not snobs.",
  },
  {
    q: "Can we keep our domain / host / email?",
    a: "Yes, and we prefer that. Sierra\u2011117 has no interest in holding your credentials hostage. We'll help you tidy up what you have or move it to something you actually control.",
  },
  {
    q: "What happens after launch?",
    a: "30 days of bug fixes included, no charge. After that, you can take your code and run, hire us on a Care retainer for ongoing maintenance, or pull us in project-by-project. We don't require ongoing work.",
  },
  {
    q: "Do you sign NDAs?",
    a: "Happy to. We have a simple mutual NDA we'll send over. We do ask for permission to reference our work publicly, usually 90 days after launch, but we'll absolutely keep something confidential if you need us to.",
  },
  {
    q: "Where are you based?",
    a: "Remote-first, North America. We travel to clients occasionally for kickoffs and launches if it makes sense, but most projects run smoothly entirely async.",
  },
  {
    q: 'Why "Sierra\u2011117"?',
    a: 'Sierra is the NATO phonetic for S — for "studio" and "small." 117 is a highway that passes our founders\u2019 hometown in Oregon. It sounded like a signal callsign, which felt right for a tech studio. Also: it was available.',
  },
];

export default function ProcessPage() {
  return (
    <>
      <section className="page-hero wrap">
        <div className="eyebrow" style={{ marginBottom: 20 }}>
          § Process · A typical engagement
        </div>
        <h1 className="display">
          Six weeks, six <em>phases</em>, zero surprises.
        </h1>
        <p className="lede">
          Every project is different, but our rhythm is consistent. Here&apos;s the shape of a standard website
          engagement — expand or contract for bigger products and smaller pages.
        </p>
      </section>

      <section className="wrap">
        <div className="timeline">
          {phases.map((p) => (
            <div key={p.week} className="tl-row">
              <div className="tl-week">
                Week<span>{p.week}</span>
              </div>
              <div className="tl-title">
                <h3>{p.title}</h3>
                <div className="hours">{p.hours}</div>
              </div>
              <div className="tl-body">
                <p>{p.body}</p>
                <ul>
                  {p.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
                <div className="deliv">
                  <b>You get</b> {p.deliv}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <header style={{ marginBottom: 40 }}>
            <div className="eyebrow" style={{ marginBottom: 16 }}>
              § How we work
            </div>
            <h2 className="display" style={{ fontSize: "clamp(36px, 5vw, 68px)", maxWidth: "18ch" }}>
              Eight principles we&apos;ll actually stick to.
            </h2>
          </header>
          <div className="principles">
            {principles.map((p) => (
              <div key={p.num}>
                <div className="num">{p.num}</div>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap" style={{ maxWidth: 900 }}>
          <header style={{ marginBottom: 40 }}>
            <div className="eyebrow" style={{ marginBottom: 16 }}>
              § FAQ
            </div>
            <h2 className="display" style={{ fontSize: "clamp(36px, 5vw, 68px)", maxWidth: "18ch" }}>
              Before you ask, probably.
            </h2>
          </header>
          <div className="faq">
            {faqs.map((f) => (
              <details key={f.q} open={f.open}>
                <summary>
                  {f.q} <span className="ic">+</span>
                </summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
