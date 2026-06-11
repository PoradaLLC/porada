import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Porada Solutions collects, uses, and protects personal information submitted through poradasolutions.com, including your rights under the New Jersey Data Privacy Act, CalOPPA, and GDPR.",
  alternates: { canonical: "/privacy" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Privacy Policy | Porada Solutions",
    description:
      "How we collect, use, and protect personal information submitted through our website.",
    url: "/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <article>
      <header className="page-hero wrap">
        <div className="eyebrow" style={{ marginBottom: 20 }}>
          § Legal · Privacy
        </div>
        <h1 className="display">Privacy Policy</h1>
        <p className="lede">
          This policy explains what personal information we collect through this website, how we use it, who we share it
          with, and the choices and rights you have.
        </p>
      </header>

      <section className="wrap">
        <div className="post-body">
          {/* TODO: CONFIRM — effective date. Set this to the date you actually publish the policy. */}
          <p>
            <strong>Effective date:</strong> June 10, 2026
          </p>

          <p>
            This Privacy Policy describes how Porada LLC, doing business as Porada Solutions (&ldquo;Porada
            Solutions,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;), handles personal information in
            connection with{" "}
            <Link href="/" className="inline">
              poradasolutions.com
            </Link>{" "}
            (the &ldquo;Site&rdquo;) and the services we provide. We are a small web studio based at 1960 PA-611,
            Swiftwater, PA 18370, serving clients in New York, New Jersey, and Pennsylvania.
          </p>

          <h2>Information we collect</h2>

          <h3>Information you provide to us</h3>
          <p>
            When you use a form on the Site — such as our contact, quote, or booking forms — or otherwise reach out to
            us, you may provide:
          </p>
          <ul>
            <li>Your name</li>
            <li>Your email address</li>
            <li>Your phone number (when you choose to share it)</li>
            <li>Your company or organization (when you choose to share it)</li>
            <li>
              Project details and any other information you include in your message — for example budget range,
              timeline, and a description of the work you&apos;re considering
            </li>
          </ul>
          <p>
            We use this information only to respond to you, prepare a quote or proposal, schedule a call, and provide the
            services you ask about.
          </p>

          <h3>Billing information</h3>
          <p>
            If you are a client paying an invoice, payment is processed by our payment provider, Stripe. Stripe collects
            and processes your payment details (such as card information) directly; we do not receive or store full
            payment card numbers. We retain basic billing records such as your name, email address, invoice description,
            and amount.
          </p>

          <h3>Information collected automatically</h3>
          <p>
            Our hosting provider, Vercel, automatically processes certain technical information as part of delivering the
            Site — for example your IP address, browser type, and request logs. This is standard server activity used to
            operate, secure, and troubleshoot the Site.
          </p>
          <p>
            With your consent (see Cookies below), we also use Google Analytics and the Meta (Facebook) Pixel, which
            collect information such as pages viewed, referring source, approximate location, device and browser
            details, and online identifiers, to help us understand site usage and measure advertising.
          </p>

          <h3>Cookies and similar technologies</h3>
          <p>We use cookies and similar technologies in two categories:</p>
          <ul>
            <li>
              <strong>Strictly necessary.</strong> Our administrative area uses session cookies (provided by Supabase)
              so that authorized team members can sign in. These are required for the Site to function and are not used
              for advertising.
            </li>
            <li>
              <strong>Analytics &amp; advertising (optional, consent-based).</strong> With your consent, we use Google
              Analytics and the Meta (Facebook) Pixel to understand how visitors find and use the Site and to measure and
              improve our advertising. These technologies load <em>only after you accept</em> via our cookie banner, and
              you can decline.
            </li>
          </ul>
          <p>
            You can change your mind at any time by clearing the choice stored in your browser. Most browsers also let
            you block or delete cookies through their settings.
          </p>

          <h3>Conversion measurement (Meta Conversions API)</h3>
          <p>
            When you submit our contact or quote form, we send a limited, server-to-server event to Meta through its
            Conversions API to measure the effectiveness of our advertising. This event includes a hashed (irreversibly
            encoded) version of your email address and name and the page you submitted from; we do not send Meta your
            raw email address or name.{" "}
            {/* TODO: CONFIRM — Unlike the Pixel and Google Analytics, this server-side event currently fires on form
                submission regardless of the cookie banner choice. Confirm you want this behavior, or ask us to gate it
                behind consent as well. */}
          </p>

          <h2>How we use your information</h2>
          <ul>
            <li>To respond to inquiries and communicate with you</li>
            <li>To prepare quotes, proposals, and estimates</li>
            <li>To schedule and conduct calls and meetings</li>
            <li>To provide, maintain, and bill for our services</li>
            <li>To operate, secure, and improve the Site</li>
            <li>With your consent, to measure analytics and improve our advertising</li>
            <li>To comply with legal obligations and enforce our agreements</li>
          </ul>

          <h2>How we share information</h2>
          <p>
            We do not sell your personal information. We share information only with service providers who help us
            operate, and only as needed for them to perform their role:
          </p>
          <ul>
            <li>
              <strong>Supabase</strong> — database and authentication; stores form submissions and powers our admin
              sign-in.
            </li>
            <li>
              <strong>Vercel</strong> — website hosting and infrastructure.
            </li>
            <li>
              <strong>Resend</strong> — sends transactional email such as invoices and payment receipts.
            </li>
            <li>
              <strong>Stripe</strong> — processes payments and stores payment details.
            </li>
            <li>
              <strong>Google</strong> — receives Google Analytics data <em>only if you consent</em>, for website
              analytics.
            </li>
            <li>
              <strong>Meta Platforms</strong> — receives Meta Pixel data <em>only if you consent</em>, and receives
              hashed contact/lead conversion events via the Meta Conversions API when you submit a form, for analytics
              and advertising.
            </li>
            {/* TODO: CONFIRM — We also use Anthropic's API in an internal, admin-only tool to help draft client
                proposals. If any visitor or client personal information is sent to that tool, keep this line and confirm
                the details; if it never processes personal data, you may remove it. */}
            <li>
              <strong>Anthropic</strong> — powers an internal, staff-only tool we use to help draft proposals. Project
              details entered by our team may be processed by this tool.
            </li>
          </ul>
          <p>
            We may also disclose information if required by law, to protect our rights, or in connection with a business
            transfer.
          </p>

          <h2>Data retention</h2>
          {/* TODO: CONFIRM — retention periods. Set concrete timeframes you can actually honor (for example,
              inquiries kept for 24 months, billing records kept for 7 years for tax purposes). */}
          <p>
            We keep personal information only as long as needed for the purposes described above — for example, to
            respond to your inquiry, deliver services, and meet legal, accounting, and tax obligations — after which we
            delete or anonymize it. You can ask us to delete your information sooner (see your rights below).
          </p>

          <h2>Your rights and choices</h2>
          <p>
            Depending on where you live, you may have rights to access, correct, delete, or receive a copy of your
            personal information, and to opt out of certain uses. To exercise any of these rights, email us at{" "}
            {/* TODO: CONFIRM — confirm this inbox exists and is monitored before publishing. */}
            <a href="mailto:privacy@poradasolutions.com" className="inline">
              privacy@poradasolutions.com
            </a>
            . We will respond within the timeframe required by applicable law and may need to verify your identity first.
          </p>

          <h2>New Jersey residents (New Jersey Data Privacy Act)</h2>
          <p>
            If you are a New Jersey resident, the New Jersey Data Privacy Act (NJDPA) gives you the right to:
          </p>
          <ul>
            <li>Confirm whether we process your personal data and access that data</li>
            <li>Correct inaccuracies in your personal data</li>
            <li>Delete personal data we hold about you</li>
            <li>Obtain a portable copy of your personal data</li>
            <li>
              Opt out of the processing of your personal data for targeted advertising, the sale of personal data, or
              profiling that produces legal or similarly significant effects
            </li>
          </ul>
          <p>
            To exercise these rights, contact us at{" "}
            <a href="mailto:privacy@poradasolutions.com" className="inline">
              privacy@poradasolutions.com
            </a>
            . If we decline your request, you may appeal that decision by replying to our response; we will inform you of
            the outcome of the appeal. We do not sell personal data or use it for targeted advertising without your
            consent.
          </p>

          <h2>California residents (CalOPPA)</h2>
          <p>
            Under the California Online Privacy Protection Act (CalOPPA), we disclose the following: this policy applies
            to information collected through the Site; you can review and request changes to your information by emailing
            us; and we will note the effective date of any changes at the top of this policy.
          </p>
          <p>
            <strong>Do Not Track.</strong> Some browsers send a &ldquo;Do Not Track&rdquo; signal. Because there is no
            common industry standard for responding to these signals, we do not currently respond to them. We do,
            however, only load analytics and advertising technologies after you affirmatively consent.
          </p>

          <h2>International visitors (GDPR)</h2>
          <p>
            We are based in the United States, and your information will be processed in the United States. If you are in
            the European Economic Area or the United Kingdom, the General Data Protection Regulation (GDPR) may apply to
            our processing of your personal data.
          </p>
          <p>
            <strong>Legal bases.</strong> We process personal data where it is necessary to take steps at your request
            before entering a contract or to perform a contract (responding to inquiries and providing services), where
            you have given consent (analytics and advertising cookies), where we have a legitimate interest (operating
            and securing the Site), and where required to comply with a legal obligation.
          </p>
          <p>
            <strong>Your GDPR rights.</strong> You may request access, rectification, erasure, restriction, portability,
            and objection to processing, and you may withdraw consent at any time. You also have the right to lodge a
            complaint with your local data protection authority. International transfers of personal data are made with
            appropriate safeguards where required.
          </p>
          <p>
            To exercise any of these rights, email{" "}
            <a href="mailto:privacy@poradasolutions.com" className="inline">
              privacy@poradasolutions.com
            </a>
            .
          </p>

          <h2>Children&apos;s privacy</h2>
          <p>
            The Site is intended for businesses and adults. It is not directed to children, and we do not knowingly
            collect personal information from children under 13 (or under 16 where a higher age applies). If you believe
            a child has provided us personal information, contact us and we will delete it.
          </p>

          <h2>Security</h2>
          <p>
            We use reasonable technical and organizational measures to protect personal information. No method of
            transmission or storage is completely secure, however, and we cannot guarantee absolute security.
          </p>

          <h2>Changes to this policy</h2>
          <p>
            We may update this Privacy Policy from time to time. When we do, we will revise the effective date above.
            Material changes will be reflected on this page; please review it periodically.
          </p>

          <h2>Contact us</h2>
          <p>
            Porada LLC (Porada Solutions)
            <br />
            1960 PA-611, Swiftwater, PA 18370
            <br />
            {/* TODO: CONFIRM — confirm the privacy contact email below. */}
            Email:{" "}
            <a href="mailto:privacy@poradasolutions.com" className="inline">
              privacy@poradasolutions.com
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
