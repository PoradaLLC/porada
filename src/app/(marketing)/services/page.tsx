import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Services — Web design, development, fractional CTO & more",
  description:
    "Websites, small apps, fractional CTO advisory, care & hosting, platform migrations, and workshops — six services Porada Solutions delivers for small businesses and agency partners.",
  alternates: { canonical: "/services" },
  openGraph: {
    title: "Services | Porada Solutions",
    description:
      "Web design, development, fractional CTO, hosting, migrations, and workshops — for small businesses and agency partners.",
    url: "/services",
  },
};

const serviceBlocks = [
  {
    num: "01 / 06",
    title: "Websites that don't make you cringe six months later.",
    desc:
      "Marketing sites, portfolios, content publications. We design with your team in mind \u2014 not a template marketplace \u2014 and build on whatever stack is actually right for what you're doing.",
    bullets: [
      "Discovery, IA, and copy consultation",
      "Custom visual design (no themes, no kits)",
      "Built on Astro, Next, Eleventy, or good old Rails",
      "A CMS your team can actually use \u2014 Sanity, Payload, Decap, WP",
      "Analytics, forms, SEO basics all set up",
      "Handoff doc and 30 days of post-launch support",
    ],
    side: [
      ["Starting at", "$1,500"],
      ["Timeline", "1–3 weeks"],
      ["Team", "2–3 people"],
      ["Best for", "Small business · Local org"],
    ],
  },
  {
    num: "02 / 06",
    title: "Small apps that actually carry their weight.",
    desc:
      "Internal tools, member portals, booking systems, lightweight dashboards. Built with the same care as a public site \u2014 because your team deserves that too.",
    bullets: [
      'Product-shaping workshops (not just "we\u2019ll build what you say")',
      "Auth, roles, billing, whatever shape it needs",
      "Postgres-first, no surprise vendor lock-in",
      "Accessible, keyboard-friendly, screen-reader tested",
      "Observability + error reporting set up on day one",
    ],
    side: [
      ["Starting at", "$3,500"],
      ["Timeline", "2–4 weeks"],
      ["Team", "2–3 people"],
      ["Best for", "Small business · Internal tools"],
    ],
  },
  {
    num: "03 / 06",
    title: 'Tech advisory, without the "strategic framework."',
    desc:
      'We act as your outside technical brain. You bring questions, we bring fifteen years of opinions and a warm, plainspoken "here\u2019s what I\u2019d do" attitude.',
    bullets: [
      "Stack audits and migration plans",
      "Hiring your first (or next) engineer",
      "Vendor selection \u2014 CMSs, analytics, payments, email",
      "Code review + architecture sanity checks",
      "Weekly office hours, async by default",
    ],
    side: [
      ["Rate", "$1,500 / mo"],
      ["Commitment", "2 mo min"],
      ["Hours", "~8 / mo"],
      ["Best for", "Founders · Small teams"],
    ],
  },
  {
    num: "04 / 06",
    title: "Care & hosting - we keep the lights on.",
    desc:
      'The unglamorous, essential part. Hosting, backups, security updates, small content changes, "can we add a page" requests. Predictable monthly pricing, no hostage relationships.',
    bullets: [
      "Managed hosting (our infra or yours)",
      "Daily backups, tested restores",
      "Weekly dependency + security patches",
      "Up to 2 hours/month of small content or design edits",
      "One human as your point of contact \u2014 no ticket roulette",
    ],
    side: [
      ["Starts at", "$180 / mo"],
      ["Commitment", "Month-to-month"],
      ["Response time", "< 1 business day"],
      ["Best for", "Everyone"],
    ],
  },
  {
    num: "05 / 06",
    title: "Migrations without the all-nighter.",
    desc:
      'Move off a platform you\u2019ve outgrown \u2014 carefully, with a real plan, and zero "oh no, we forgot the old blog posts." We\u2019ve done WordPress, Squarespace, Webflow, Wix, Ghost, and a few things that didn\u2019t have names.',
    bullets: [
      "Content audit + URL mapping (no broken links)",
      "Data export, normalization, and import",
      'Parallel staging until you say "go"',
      "DNS, email, analytics cutover plan",
      "30 days of monitoring after launch",
    ],
    side: [
      ["Starting at", "$1,200"],
      ["Timeline", "1–2 weeks"],
      ["Downtime", "Target: zero"],
      ["Best for", "Anyone stuck"],
    ],
  },
  {
    num: "06 / 06",
    title: "Workshops - half-days for your team.",
    desc:
      "Sometimes the best deliverable is your team knowing what we know. We run small, pragmatic sessions on the things that come up most often.",
    bullets: [
      '"How our website actually works" \u2014 for non-technical teams',
      "Design-system basics for marketing & content folks",
      "Picking analytics you\u2019ll actually read",
      "Briefing a developer without losing your mind",
    ],
    side: [
      ["Rate", "$750 / session"],
      ["Format", "Remote or on-site"],
      ["Team size", "Up to 12"],
      ["Best for", "In-house teams"],
    ],
  },
];

const matrix: { row: string; cells: ("y" | "n")[] }[] = [
  { row: "Marketing site refresh", cells: ["y", "n", "n", "y", "n"] },
  { row: "Internal tool / portal", cells: ["n", "y", "y", "y", "n"] },
  { row: '"Our CMS is a nightmare"', cells: ["n", "n", "y", "n", "y"] },
  { row: "Hiring our first dev", cells: ["n", "n", "y", "n", "n"] },
  { row: "Sleep better about hosting", cells: ["n", "n", "n", "y", "n"] },
  { row: '"We outgrew our platform"', cells: ["y", "n", "y", "n", "y"] },
];

export default function ServicesPage() {
  return (
    <>
      <section className="page-hero wrap">
        <div className="eyebrow" style={{ marginBottom: 20 }}>
          § Services · 01-06
        </div>
        <h1 className="display">
          Six ways we can <em>help</em>.
        </h1>
        <p className="lede">
          We only do work we&apos;re genuinely good at - which means we&apos;ll tell you if a project isn&apos;t ours,
          and who to call instead. Here&apos;s the full list, honest pricing, and what to expect when we work together.
        </p>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          {serviceBlocks.map((b) => (
            <article key={b.num} className="svc-block">
              <div className="num">{b.num}</div>
              <div>
                <h2>{b.title}</h2>
                <p className="desc">{b.desc}</p>
                <ul>
                  {b.bullets.map((bl) => (
                    <li key={bl}>{bl}</li>
                  ))}
                </ul>
              </div>
              <div className="side">
                <h4>At a glance</h4>
                {b.side.map(([k, v]) => (
                  <div key={k} className="row">
                    <span>{k}</span>
                    <span>{v}</span>
                  </div>
                ))}
              </div>
            </article>
          ))}

          <div className="matrix">
            <table>
              <thead>
                <tr>
                  <th>What you need</th>
                  <th>Website</th>
                  <th>Product</th>
                  <th>Advisory</th>
                  <th>Care</th>
                  <th>Migration</th>
                </tr>
              </thead>
              <tbody>
                {matrix.map((r) => (
                  <tr key={r.row}>
                    <td>{r.row}</td>
                    {r.cells.map((c, i) => (
                      <td key={i} className={c}>
                        {c === "y" ? "●" : "-"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div
            style={{
              marginTop: 64,
              display: "flex",
              gap: 12,
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <Link href="/quote" className="btn btn-primary">
              Get a tailored quote →
            </Link>
            <Link href="/contact" className="btn btn-ghost">
              Not sure? Ask us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
