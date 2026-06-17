import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

/**
 * The always-present, quiet door back to Porada.
 *
 * The /demo experience is meant to feel like a real venue's site, so this is a
 * thin, tasteful pill — never a loud banner. It follows the visitor on every demo
 * page and links to the Porada free-preview offer on the landing page. Sits below
 * the booking overlay (z-60) so it never covers the modal.
 */
export function PoradaRibbon() {
  return (
    <Link
      href="/escape-rooms#preview"
      className="demo-porada-pill"
      data-tour="porada-ribbon"
      aria-label="This is a Porada demo — get a site like this for your venue"
    >
      <Sparkles size={14} strokeWidth={1.75} aria-hidden />
      <span className="demo-porada-pill-text">
        <strong>Porada demo</strong>
        <span className="demo-porada-pill-sep" aria-hidden>
          ·
        </span>
        get one for your venue
      </span>
      <ArrowRight size={14} strokeWidth={2} aria-hidden />
    </Link>
  );
}
