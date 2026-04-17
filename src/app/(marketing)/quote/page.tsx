import type { Metadata } from "next";
import { QuoteWizard } from "./QuoteWizard";

export const metadata: Metadata = {
  title: "Get a quote",
  description:
    "A short quote builder. Tell us about your project in four steps — we draft a real proposal within two business days.",
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
          We&apos;ll use what you share here to draft a real proposal — scope, fixed price, timeline — and send it over
          within two business days.
        </p>
      </section>

      <section className="wrap" style={{ paddingBottom: 120 }}>
        <QuoteWizard />
      </section>
    </>
  );
}
