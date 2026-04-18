"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowIcon } from "@/components/site/ArrowIcon";

type Errors = Partial<Record<"name" | "email" | "message", string>>;

export function ContactFormClient() {
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = (data.get("name") as string | null)?.trim() ?? "";
    const email = (data.get("email") as string | null)?.trim() ?? "";
    const message = (data.get("message") as string | null)?.trim() ?? "";

    const next: Errors = {};
    if (!name) next.name = "We'd love a name to address the reply to.";
    if (!email) next.email = "An email helps us reply.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      next.email = "That doesn't look like an email address.";
    if (!message) next.message = "A short note is plenty - but we need something.";
    else if (message.length < 10) next.message = "A little more detail helps us reply usefully.";

    if (Object.keys(next).length > 0) {
      setErrors(next);
      return;
    }
    setErrors({});
    setSent(true);
    setTimeout(() => {
      const el = document.getElementById("contact-form-anchor");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 0);
  }

  if (sent) {
    return (
      <div className="success-box" role="status">
        <div
          style={{
            fontFamily: "var(--font-mono-family)",
            fontSize: 11,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--accent)",
          }}
        >
          ◇ Delivered
        </div>
        <h3 style={{ marginTop: 12 }}>Got it - thanks.</h3>
        <p>
          Your message landed in our inbox. We usually reply within two business days; sometimes faster if the
          coffee&apos;s good.
        </p>
        <div style={{ marginTop: 24 }}>
          <Link href="/" className="btn btn-ghost">
            Back to home →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit} noValidate id="contact-form-anchor">
      <h2>Drop us a note.</h2>
      <p className="hint">A paragraph is plenty. We&apos;ll write back with questions.</p>

      <div className={`field${errors.name ? " has-error" : ""}`}>
        <label className="label" htmlFor="c-name">
          Your name
        </label>
        <input className="input" id="c-name" name="name" type="text" placeholder="e.g. Jordan Okafor" />
        {errors.name && <div className="err" style={{ display: "block" }}>{errors.name}</div>}
      </div>

      <div className={`field${errors.email ? " has-error" : ""}`}>
        <label className="label" htmlFor="c-email">
          Email
        </label>
        <input className="input" id="c-email" name="email" type="email" placeholder="you@company.com" />
        {errors.email && <div className="err" style={{ display: "block" }}>{errors.email}</div>}
      </div>

      <div className="field">
        <label className="label" htmlFor="c-company">
          Company (optional)
        </label>
        <input className="input" id="c-company" name="company" type="text" placeholder="Where are you writing from?" />
      </div>

      <div className="field">
        <label className="label" htmlFor="c-topic">
          What&apos;s this about?
        </label>
        <select className="select input" id="c-topic" name="topic" defaultValue="Starting a project">
          <option>Starting a project</option>
          <option>Pricing / timeline question</option>
          <option>Press &amp; interviews</option>
          <option>Just saying hi</option>
          <option>Something else</option>
        </select>
      </div>

      <div className={`field${errors.message ? " has-error" : ""}`}>
        <label className="label" htmlFor="c-msg">
          Your message
        </label>
        <textarea
          className="textarea"
          id="c-msg"
          name="message"
          placeholder="A paragraph is fine. Who you are, what you're trying to do, any dates or constraints."
        />
        {errors.message && <div className="err" style={{ display: "block" }}>{errors.message}</div>}
      </div>

      <div
        style={{
          marginTop: 28,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <p
          className="mono"
          style={{
            fontSize: 11,
            color: "var(--ink-faint)",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          Typical reply · &lt; 48 hrs · from a human
        </p>
        <button type="submit" className="btn btn-primary">
          Send message <ArrowIcon />
        </button>
      </div>
    </form>
  );
}
