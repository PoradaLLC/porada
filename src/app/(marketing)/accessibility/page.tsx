import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Accessibility Statement",
  description:
    "Porada Solutions is committed to making poradasolutions.com accessible and usable for everyone, aiming to meet WCAG 2.1 Level AA. Here's how to report an accessibility issue.",
  alternates: { canonical: "/accessibility" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Accessibility Statement | Porada Solutions",
    description: "Our commitment to an accessible website and how to report issues.",
    url: "/accessibility",
  },
};

export default function AccessibilityPage() {
  return (
    <article>
      <header className="page-hero wrap">
        <div className="eyebrow" style={{ marginBottom: 20 }}>
          § Legal · Accessibility
        </div>
        <h1 className="display">Accessibility Statement</h1>
        <p className="lede">
          We want everyone to be able to use this website. Accessibility is part of how we build, and an ongoing effort.
        </p>
      </header>

      <section className="wrap">
        <div className="post-body">
          <h2>Our commitment</h2>
          <p>
            Porada Solutions is committed to ensuring that poradasolutions.com is accessible to people with disabilities.
            We aim to conform to the{" "}
            <a
              href="https://www.w3.org/TR/WCAG21/"
              className="inline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Web Content Accessibility Guidelines (WCAG) 2.1
            </a>{" "}
            at Level AA. These guidelines explain how to make web content more accessible for people with a wide range of
            abilities.
          </p>

          <h2>Ongoing effort</h2>
          <p>
            Accessibility is not a one-time task. As a small studio, we review accessibility as part of our regular work
            and improve the Site over time. We test with the goal of supporting keyboard navigation, sufficient color
            contrast, readable typography, descriptive text for meaningful images, and clear, well-structured content.
          </p>
          <p>
            Despite our efforts, some content may not yet be fully accessible. We treat any issue you report as an
            opportunity to fix it.
          </p>

          <h2>Reporting an accessibility issue</h2>
          <p>
            If you encounter a barrier on the Site, or need information in a different format, please let us know. Tell
            us the page address and a short description of the problem, and we&apos;ll work to resolve it and help you
            get what you need.
          </p>
          <p>
            {/* TODO: CONFIRM — confirm the accessibility contact email below. */}
            Email:{" "}
            <a href="mailto:accessibility@poradasolutions.com" className="inline">
              accessibility@poradasolutions.com
            </a>
            <br />
            Phone:{" "}
            <a href="tel:+12019695875" className="inline">
              (201) 969-5875
            </a>
          </p>

          <h2>Last reviewed</h2>
          {/* TODO: CONFIRM — update this date whenever you review the Site for accessibility. */}
          <p>This statement was last reviewed on June 10, 2026.</p>
        </div>
      </section>
    </article>
  );
}
