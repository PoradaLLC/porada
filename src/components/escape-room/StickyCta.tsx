"use client";

/**
 * Small persistent "Get my free preview" button that appears once the visitor
 * scrolls past the hero, so the capture form is always one tap away no matter
 * how deep they are in the proof. Hides itself when the form is on screen.
 */

import { useEffect, useState } from "react";

export function StickyCta() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    function onScroll() {
      const form = document.getElementById("preview");
      const pastHero = window.scrollY > window.innerHeight * 0.9;
      // Hide once the form itself is comfortably in view.
      const formVisible = form ? form.getBoundingClientRect().top < window.innerHeight * 0.8 : false;
      setShow(pastHero && !formVisible);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div className={`er-sticky${show ? " show" : ""}`}>
      <a href="#preview" className="er-btn er-btn-primary" tabIndex={show ? 0 : -1} aria-hidden={!show}>
        Get my free preview →
      </a>
    </div>
  );
}
