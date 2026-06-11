import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Disclaimer",
  description:
    "Content on poradasolutions.com is provided for general information only and is not professional advice. Case study results do not guarantee similar outcomes.",
  alternates: { canonical: "/disclaimer" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Disclaimer | Porada Solutions",
    description: "General information, not professional advice.",
    url: "/disclaimer",
  },
};

export default function DisclaimerPage() {
  return (
    <article>
      <header className="page-hero wrap">
        <div className="eyebrow" style={{ marginBottom: 20 }}>
          § Legal · Disclaimer
        </div>
        <h1 className="display">Disclaimer</h1>
        <p className="lede">
          Information on this site is general in nature. It isn&apos;t professional advice, and results vary.
        </p>
      </header>

      <section className="wrap">
        <div className="post-body">
          <h2>General information only</h2>
          <p>
            The content on poradasolutions.com is provided for general informational purposes only. It is not
            professional advice — technical, legal, financial, or otherwise — and should not be relied on as a substitute
            for advice tailored to your specific situation. Before making decisions based on anything you read here,
            please consult a qualified professional. Your use of this information is at your own risk.
          </p>

          <h2>Results are not guaranteed</h2>
          <p>
            Any case studies, project examples, or outcomes described on this site reflect specific past engagements.
            They are illustrative and do not guarantee or predict similar results for your project. Outcomes depend on
            many factors unique to each client and situation.
          </p>

          <p>
            For more, see our{" "}
            <Link href="/terms" className="inline">
              Terms of Use
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="inline">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </section>
    </article>
  );
}
