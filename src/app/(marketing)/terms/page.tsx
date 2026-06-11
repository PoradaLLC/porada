import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Use",
  description:
    "The terms that govern your use of poradasolutions.com, including intellectual property, acceptable use, disclaimers, limitation of liability, and governing law.",
  alternates: { canonical: "/terms" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Terms of Use | Porada Solutions",
    description: "The terms that govern your use of our website.",
    url: "/terms",
  },
};

export default function TermsPage() {
  return (
    <article>
      <header className="page-hero wrap">
        <div className="eyebrow" style={{ marginBottom: 20 }}>
          § Legal · Terms
        </div>
        <h1 className="display">Terms of Use</h1>
        <p className="lede">
          These terms govern your use of this website. By using the Site, you agree to them.
        </p>
      </header>

      <section className="wrap">
        <div className="post-body">
          {/* TODO: CONFIRM — effective date. Set this to the date you actually publish these terms. */}
          <p>
            <strong>Effective date:</strong> June 10, 2026
          </p>

          <p>
            These Terms of Use (&ldquo;Terms&rdquo;) apply to your access to and use of{" "}
            <Link href="/" className="inline">
              poradasolutions.com
            </Link>{" "}
            (the &ldquo;Site&rdquo;), operated by Porada LLC, doing business as Porada Solutions (&ldquo;Porada
            Solutions,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;). By accessing or using the Site,
            you agree to be bound by these Terms. If you do not agree, please do not use the Site.
          </p>

          <h2>Intellectual property</h2>
          <p>
            The Site and its contents — including text, design, graphics, logos, layout, code, and other materials — are
            owned by Porada LLC or our licensors and are protected by intellectual property laws. You may view and use
            the Site for your own informational purposes. You may not copy, reproduce, republish, distribute, modify, or
            create derivative works from the Site or its contents without our prior written permission, except as
            permitted by applicable law. &ldquo;Porada Solutions&rdquo; and our logo are our marks and may not be used
            without permission.
          </p>

          <h2>Acceptable use</h2>
          <p>When using the Site, you agree not to:</p>
          <ul>
            <li>Use the Site for any unlawful purpose or in violation of these Terms</li>
            <li>Attempt to gain unauthorized access to any part of the Site, its systems, or networks</li>
            <li>Interfere with or disrupt the operation, security, or integrity of the Site</li>
            <li>Introduce malware, or scrape, harvest, or collect data through automated means without permission</li>
            <li>Misrepresent your identity or submit false information through our forms</li>
            <li>Infringe the intellectual property or other rights of Porada Solutions or any third party</li>
          </ul>

          <h2>Pricing is indicative, not a binding offer</h2>
          <p>
            Any prices, estimates, ballpark figures, or package descriptions shown on the Site — including those
            produced by our quote tool — are for general informational purposes only. They are indicative and do{" "}
            <strong>not</strong> constitute a binding offer, quotation, or contract. Actual pricing depends on project
            scope and is set out only in a written proposal or agreement that we sign with you.
          </p>

          <h2>No warranty</h2>
          <p>
            The Site is provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis. To the fullest extent
            permitted by law, we disclaim all warranties, express or implied, including warranties of merchantability,
            fitness for a particular purpose, and non-infringement. We do not warrant that the Site will be
            uninterrupted, error-free, secure, or free of harmful components, or that any information on it is accurate,
            complete, or current.
          </p>

          <h2>Limitation of liability</h2>
          <p>
            To the fullest extent permitted by law, Porada LLC and its owners, members, and team members will not be
            liable for any indirect, incidental, special, consequential, or punitive damages, or for any loss of
            profits, data, goodwill, or other intangible losses, arising out of or relating to your use of (or inability
            to use) the Site. Our total liability for any claim relating to the Site is limited to the amount you paid
            us, if any, to access the Site.
          </p>

          <h2>Third-party links</h2>
          <p>
            The Site may contain links to third-party websites or services that we do not control. We are not
            responsible for the content, policies, or practices of those third parties, and links do not imply our
            endorsement.
          </p>

          <h2>Disclaimer</h2>
          <p>
            Content on the Site is provided for general information only and is not professional advice. Please see our{" "}
            <Link href="/disclaimer" className="inline">
              Disclaimer
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="inline">
              Privacy Policy
            </Link>{" "}
            for more.
          </p>

          <h2>Governing law</h2>
          <p>
            These Terms are governed by the laws of the Commonwealth of Pennsylvania, without regard to its conflict of
            laws principles. You agree that any dispute relating to the Site or these Terms will be subject to the
            exclusive jurisdiction of the state and federal courts located in Pennsylvania.
          </p>

          <h2>Changes to these terms</h2>
          <p>
            We may revise these Terms from time to time. When we do, we will update the effective date above. Your
            continued use of the Site after changes take effect means you accept the revised Terms.
          </p>

          <h2>Contact us</h2>
          <p>
            Porada LLC (Porada Solutions)
            <br />
            1960 PA-611, Swiftwater, PA 18370
            <br />
            {/* TODO: CONFIRM — confirm the legal/contact email below. */}
            Email:{" "}
            <a href="mailto:legal@poradasolutions.com" className="inline">
              legal@poradasolutions.com
            </a>
            <br />
            Phone:{" "}
            <a href="tel:+12019695875" className="inline">
              (201) 969-5875
            </a>
          </p>
        </div>
      </section>
    </article>
  );
}
