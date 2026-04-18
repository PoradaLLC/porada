import type { Metadata } from "next";
import { LocalClock } from "@/components/site/LocalClock";
import { ContactFormClient } from "./ContactFormClient";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Send Sierra-117 a note. No CAPTCHAs, no lead forms, no auto-responder robot - we read everything personally.",
};

export default function ContactPage() {
  return (
    <>
      <section className="page-hero wrap">
        <div className="eyebrow" style={{ marginBottom: 20 }}>
          § Contact · We reply within 2 business days
        </div>
        <h1 className="display">
          Say <em>hi</em>, ask a question.
        </h1>
        <p className="lede">
          No CAPTCHAs, no lead forms, no auto-responder robot. Fill in a few fields below and one of us - Michal,
          Marcin, or Daniel - will read it and reply personally.
        </p>
      </section>

      <section className="wrap" style={{ paddingBottom: 120 }}>
        <div className="contact-grid">
          <aside className="contact-meta">
            <div className="block">
              <h4>Email</h4>
              <p>
                <a href="mailto:team@sierra-117.net" className="inline">
                  team@sierra-117.net
                </a>
              </p>
            </div>
            <div className="block">
              <h4>Hours</h4>
              <p>
                Mon – Fri · 9am – 6pm Eastern
                <br />
                We answer on weekends too, just more slowly.
              </p>
            </div>
            <div className="block">
              <h4>For students / juniors</h4>
              <p>
                We&apos;re a three-person studio so we don&apos;t have internships right now - but we always reply to
                student email with a short list of studios we&apos;d recommend instead.
              </p>
            </div>
            <div className="block">
              <h4>Local time</h4>
              <LocalClock />
            </div>
          </aside>

          <div>
            <ContactFormClient />
          </div>
        </div>
      </section>
    </>
  );
}
