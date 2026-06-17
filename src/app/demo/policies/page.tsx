import type { Metadata } from "next";
import Link from "next/link";
import { CalendarClock, FileText, Plug, ShieldCheck, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "Policies & waiver — Lantern & Lock Escape Co.",
  description:
    "Cancellation, age, safety, and privacy policies for Lantern & Lock, plus where your signable digital waiver lives.",
  robots: { index: false, follow: false },
};

const POLICIES: { icon: React.ReactNode; title: string; body: string }[] = [
  {
    icon: <CalendarClock size={18} strokeWidth={1.6} aria-hidden />,
    title: "Cancellation & reschedule",
    body:
      "Free reschedule or cancellation up to 24 hours before your game. Within 24 hours, bookings are non-refundable but can be moved once, subject to availability.",
  },
  {
    icon: <Users size={18} strokeWidth={1.6} aria-hidden />,
    title: "Age & supervision",
    body:
      "Under-16s are welcome with a participating adult, and under-12s must play alongside an adult. Each room lists its own recommended age on its page.",
  },
  {
    icon: <ShieldCheck size={18} strokeWidth={1.6} aria-hidden />,
    title: "Safety & comfort",
    body:
      "You are never locked in and can step out at any time. No live actors, gore, or jump-scares in any room. Tell us about access needs and we'll help you pick a room.",
  },
  {
    icon: <FileText size={18} strokeWidth={1.6} aria-hidden />,
    title: "Waiver",
    body:
      "Every player signs a short liability waiver before play. Arrive about 15 minutes early so your crew can sign and get briefed without eating into your hour.",
  },
];

export default function PoliciesPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
      <div className="text-xs uppercase tracking-wide" style={{ color: "var(--brass)" }}>
        The fine print
      </div>
      <h1 className="font-display text-3xl sm:text-4xl mt-1" style={{ color: "var(--parchment)" }}>
        Policies &amp; waiver
      </h1>
      <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
        The short version of how we keep games fair, safe, and easy to plan. Full detail lives in our{" "}
        <Link href="/demo#faq" style={{ color: "var(--brass)" }}>
          FAQ
        </Link>
        .
      </p>

      {/* Honest plug-in stand-in — same family as the booking flow's payment /
          availability panels. The summaries below are real venue policy; the
          signable waiver document itself plugs in on a live build. */}
      <div className="demo-availability-note mt-6" data-tour="policies-plugin">
        <span className="demo-availability-badge">
          <Plug size={15} strokeWidth={1.5} aria-hidden />
        </span>
        <span className="demo-availability-text">
          <strong>Your waiver &amp; policy documents plug in here.</strong>
          On a live build, this is your real signable digital waiver and full policy text — players
          sign online before arrival, and signed copies sync to your booking platform. Nothing on this
          demo is collected or stored.
        </span>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {POLICIES.map((p) => (
          <div key={p.title} className="demo-card p-5">
            <div className="flex items-center gap-2" style={{ color: "var(--brass-bright)" }}>
              {p.icon}
              <h2 className="font-display text-lg" style={{ color: "var(--parchment)" }}>
                {p.title}
              </h2>
            </div>
            <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
              {p.body}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
