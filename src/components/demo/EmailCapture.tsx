"use client";

import { useState } from "react";
import { CheckCircle2, Send } from "lucide-react";
import { venue } from "./venue";

/** Lightweight newsletter / email capture (retention). In-memory only. */
export function EmailCapture() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  return (
    <div data-tour="email-capture">
      <h4 className="font-display text-lg" style={{ color: "var(--parchment)" }}>
        {venue.newsletter.title}
      </h4>
      <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
        {venue.newsletter.body}
      </p>
      {done ? (
        <p className="mt-4 inline-flex items-center gap-2 text-sm" style={{ color: "var(--brass-bright)" }}>
          <CheckCircle2 size={16} /> You&apos;re on the list. (Demo — nothing was sent.)
        </p>
      ) : (
        <form
          className="mt-4 flex gap-2 max-w-sm"
          onSubmit={(e) => {
            e.preventDefault();
            if (email.trim()) setDone(true);
          }}
        >
          <input
            type="email"
            className="demo-input"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-label="Email address"
          />
          <button type="submit" className="demo-btn demo-btn-primary px-4 shrink-0" aria-label="Join the list">
            <Send size={16} />
          </button>
        </form>
      )}
    </div>
  );
}
