import type { Metadata } from "next";
import { QuoteWizard } from "./QuoteWizard";

export const metadata: Metadata = {
  title: "Get a quote — Project estimate in 90 seconds",
  description:
    "A short quote builder from Porada Solutions. Tell us about your website or app project in four steps — we draft a real proposal within two business days.",
  alternates: { canonical: "/quote" },
  openGraph: {
    title: "Get a quote | Porada Solutions",
    description: "Four steps, ~90 seconds, real proposal within two business days.",
    url: "/quote",
  },
};

export default function QuotePage() {
  return (
    <>
      <section className="page-hero wrap">
        <div className="eyebrow" style={{ marginBottom: 20 }}>
          § Quote builder · 4 steps · ~90 seconds
        </div>
        <h1 className="display">
          Tell us about your <em>project</em>.
        </h1>
        <p className="lede">
          We&apos;ll use what you share here to draft a real proposal - scope, fixed price, timeline - and send it over
          within two business days.
        </p>
      </section>

      <section className="wrap" style={{ paddingBottom: 120 }}>
        <QuoteWizard />
      </section>
    </>
  );
}
