"use client";

/**
 * Scroll-reveal driver for the escape-room landing page.
 *
 * Renders nothing. On mount it "arms" reveal by adding `reveal-on` to <html>,
 * then watches every `[data-reveal]` element and adds `.is-in` as it enters the
 * viewport. The CSS hides `[data-reveal]` ONLY under `.reveal-on`, so:
 *   - no JS / JS error  → nothing is armed → everything renders normally
 *   - reduced motion    → we reveal all immediately, no transition (CSS guard)
 *
 * Motion is transform/opacity only and is an accent, never a gate on content.
 */

import { useEffect } from "react";

export function ScrollReveal() {
  useEffect(() => {
    const root = document.documentElement;
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (els.length === 0) return;

    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    // Arm reveal: from here, CSS may hide un-revealed elements.
    root.classList.add("reveal-on");

    if (reduced || !("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("is-in"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.12 },
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return null;
}
