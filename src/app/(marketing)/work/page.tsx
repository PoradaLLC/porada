import type { Metadata } from "next";
import Link from "next/link";
import { WorkGrid } from "./WorkGrid";

export const metadata: Metadata = {
  title: "Work — Selected websites & apps by Porada Solutions",
  description:
    "Selected Porada Solutions case studies, 2023–2026. A small studio ships a small number of projects — websites, small apps, and platform migrations for clients in the NY/NJ/PA area and beyond.",
  alternates: { canonical: "/work" },
  openGraph: {
    title: "Work | Porada Solutions",
    description: "Selected case studies — websites, small apps, and platform migrations.",
    url: "/work",
  },
};

export default function WorkPage() {
  return (
    <>
      <section className="page-hero wrap">
        <div className="eyebrow" style={{ marginBottom: 20 }}>
          § Work · Selected projects 2023-2026
        </div>
        <h1 className="display">
          Things we&apos;ve <em>actually</em> shipped.
        </h1>
        <p className="lede">
          A small studio ships a small number of projects. Here&apos;s an honest sample - what we built, what worked,
          and what we&apos;d do differently. Click any project for the full story.
        </p>
      </section>

      <section className="wrap">
        <WorkGrid />
      </section>

      <section className="section">
        <div className="wrap" style={{ textAlign: "center" }}>
          <h2
            className="display"
            style={{
              fontSize: "clamp(32px, 4vw, 56px)",
              maxWidth: "22ch",
              margin: "0 auto",
              letterSpacing: "-0.02em",
            }}
          >
            We pick clients carefully. If you made it this far, you probably fit.
          </h2>
          <div style={{ marginTop: 32 }}>
            <Link href="/quote" className="btn btn-primary">
              Start your project →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
