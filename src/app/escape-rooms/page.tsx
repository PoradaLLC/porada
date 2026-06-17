import { EscapeNav } from "@/components/escape-room/EscapeNav";
import { Hero } from "@/components/escape-room/Hero";
import { Mechanism } from "@/components/escape-room/Mechanism";
import { WhyUs } from "@/components/escape-room/WhyUs";
import { PreviewForm } from "@/components/escape-room/PreviewForm";
import { EscapeFooter } from "@/components/escape-room/EscapeFooter";
import { StickyCta } from "@/components/escape-room/StickyCta";
import { ScrollReveal } from "@/components/escape-room/ScrollReveal";

/**
 * Clean conversion architecture — each section does ONE job, in order:
 *   1. Hero            — relevance (+ stat row reinforcement, inside <Hero/>)
 *   2. Mechanism       — the single show-then-tell section (carousel + proof +
 *                        compact differentiator list). Replaces the three former
 *                        feature passes (snippet grid, 01–11 cards, digital menu).
 *   ·  Mid-page CTA    — the second of three identical asks (#preview)
 *   3. WhyUs           — confidence: guarantee + "how we build it" reassurance
 *   4. PreviewForm     — the action (closing CTA)
 * Footer + corner pill (StickyCta) persist; ScrollReveal arms the motion.
 */
export default function EscapeRoomsPage() {
  return (
    <>
      <EscapeNav />

      {/* 1 — Hero (relevance) + stat row */}
      <Hero />

      {/* 2 — One mechanism section: show (carousel) → proof → tell (list) */}
      <Mechanism />

      {/* Mid-page CTA — a convinced skimmer can act the moment the proof lands. */}
      <section className="er-offer er-wrap" data-reveal>
        <p className="er-offer-line">
          Want this for <em>your</em> venue? We’ll hand-build a free preview using your own rooms.
        </p>
        <a href="#preview" className="er-btn er-btn-primary">
          Get my free preview →
        </a>
      </section>

      {/* 3 — Guarantee + how we build it (confidence / objection handling) */}
      <WhyUs />

      {/* 4 — Free-preview capture form (action) */}
      <PreviewForm />

      {/* Footer */}
      <EscapeFooter />

      {/* Corner pill */}
      <StickyCta />

      {/* Scroll-reveal driver (renders nothing; arms [data-reveal] on mount) */}
      <ScrollReveal />
    </>
  );
}
