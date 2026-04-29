import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description:
    "Porada is Michal Bienias, Marcin Bienias, and Daniel Bzura - a three-person studio based in the NY/NJ/PA area, building careful websites and tools.",
};

const team = [
  {
    name: "Michal Bienias",
    role: "Software Engineer",
    blurb:
      "Michal builds and ships the end-to-end work - front-end, back-end, infrastructure. Lead on the Pocono Property Care and Church of Saint Luke builds.",
    chips: ["Next.js", "Supabase", "Vercel"],
    art: "warm" as const,
  },
  {
    name: "Marcin Bienias",
    role: "Software Engineer",
    blurb:
      "Marcin works alongside Michal on full-stack implementation, with a focus on integrations and data. Lead on the Forteca Estate build.",
    chips: ["Next.js", "Supabase", "Integrations"],
    art: "cool" as const,
  },
  {
    name: "Daniel Bzura",
    role: "Cybersecurity Engineer",
    blurb:
      "Daniel handles security reviews, auth, and infrastructure hardening across every project before it ships. He's the reason our sites don't embarrass us later.",
    chips: ["Security", "Auth", "Infra"],
    art: "warm" as const,
  },
];

const values = [
  {
    num: "01",
    title: "Care over craft theater.",
    text: '"Craft" as performance gets old. We care whether the thing works in a year.',
  },
  {
    num: "02",
    title: "Boring tech, sharp design.",
    text: "New tools need to earn their place. New ideas can go anywhere.",
  },
  {
    num: "03",
    title: "Small is the point.",
    text: "Three of us doing careful work beats twelve of us doing a lot of work.",
  },
  {
    num: "04",
    title: "Write everything down.",
    text: "If it's not written, it didn't happen. Two-years-from-now you will thank us.",
  },
];

const numbers = [
  { n: "2026", lbl: "Founded" },
  { n: "3", lbl: "Projects shipped" },
  { n: "3", lbl: "Humans, full stop" },
];

const clients = ["Pocono Property Care", "Forteca Estate", "Church of Saint Luke"];

function TeamArt({ theme }: { theme: "warm" | "cool" }) {
  if (theme === "warm") {
    return (
      <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="300" fill="#ede8dd" />
        <circle cx="200" cy="155" r="95" fill="#800020" />
        <circle cx="255" cy="105" r="50" fill="#f0d8b8" opacity="0.85" />
        <rect x="50" y="20" width="80" height="260" fill="#c97a8c" opacity="0.7" />
        <path d="M 20 260 Q 200 180 380 260" fill="none" stroke="#1a1815" strokeWidth="1.5" opacity="0.4" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="300" fill="#d5dfe6" />
      <rect x="120" y="60" width="180" height="180" fill="#5a6c7a" />
      <circle cx="120" cy="60" r="40" fill="#9ab0bd" />
      <circle cx="300" cy="240" r="40" fill="#800020" />
      <path d="M 0 180 L 400 180" stroke="#1a1815" strokeWidth="1" opacity="0.3" />
      <path d="M 0 200 L 400 200" stroke="#1a1815" strokeWidth="1" opacity="0.15" />
    </svg>
  );
}

export default function AboutPage() {
  return (
    <>
      <section className="page-hero wrap">
        <div className="eyebrow" style={{ marginBottom: 20 }}>
          § About · Three people, a small studio
        </div>
        <h1 className="display">
          A studio built by <em>people</em> who still reply to their own emails.
        </h1>
        <p className="lede">
          Porada is Michal Bienias, Marcin Bienias, and Daniel Bzura - two software engineers and a security
          engineer based in the NY/NJ/PA area. We started the studio in 2026 because the kind of work we wanted to do
          didn&apos;t really exist in the middle of the market: careful, small, maintainable websites and tools, shipped
          by the people who actually build them.
        </p>
      </section>

      <section className="wrap">
        <div className="team team-3">
          {team.map((p) => (
            <article key={p.name} className="person">
              <div className="avatar">
                <TeamArt theme={p.art} />
              </div>
              <div className="person-body">
                <h3>{p.name}</h3>
                <div className="role">{p.role}</div>
                <p>{p.blurb}</p>
                <div className="meta">
                  {p.chips.map((c) => (
                    <span key={c} className="chip">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="story">
            <div>
              <div className="eyebrow" style={{ marginBottom: 16 }}>
                § Origin
              </div>
              <h2>We wanted a studio that didn&apos;t exist yet.</h2>
            </div>
            <div className="story-body">
              <p>
                We kept seeing the same pattern: a small business or local organization would hire someone to build them
                a site, and within six months nobody knew how to change the phone number on the homepage. The work was
                either too expensive, too abandoned, or both.
              </p>
              <p className="emph">It wasn&apos;t a design problem or an engineering problem - it was a care problem.</p>
              <p>
                Porada is our answer to that. We keep the studio small on purpose so the people you meet in
                the kickoff are the people doing the work. We pick technology a regular team can maintain. We&apos;re
                based in the NY/NJ/PA area, so for local clients we can actually show up.
              </p>
              <p>
                Three people, a small number of careful projects, and a commitment to still being around in a year. That
                is the size and shape of the thing.
              </p>
            </div>
          </div>

          <div className="values">
            {values.map((v) => (
              <div key={v.num}>
                <div className="big">{v.num}</div>
                <h4>{v.title}</h4>
                <p>{v.text}</p>
              </div>
            ))}
          </div>

          <div className="numbers numbers-3">
            {numbers.map((n) => (
              <div key={n.lbl}>
                <div className="n">{n.n}</div>
                <div className="lbl">{n.lbl}</div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 80 }}>
            <div className="eyebrow" style={{ marginBottom: 20 }}>
              § Clients to date
            </div>
            <div className="clients clients-3">
              {clients.map((c) => (
                <div key={c}>{c}</div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap" style={{ textAlign: "center" }}>
          <h2
            className="display"
            style={{
              fontSize: "clamp(36px, 5vw, 72px)",
              letterSpacing: "-0.03em",
              maxWidth: "22ch",
              margin: "0 auto",
            }}
          >
            If this sounds like the kind of studio you&apos;d like to work with, let&apos;s talk.
          </h2>
          <div style={{ marginTop: 32, display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/quote" className="btn btn-primary">
              Start a project →
            </Link>
            <Link href="/contact" className="btn btn-ghost">
              Or just say hi
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
