"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function InteractiveEffects() {
  const pathname = usePathname();

  useEffect(() => {
    const cleanups: (() => void)[] = [];

    // === EFFECT 1: Mouse-tracking gradient on hero ===
    const hero = document.querySelector<HTMLElement>("[data-hero-gradient]");
    const heroOverlay = document.getElementById("hero-gradient-overlay");

    if (hero && heroOverlay) {
      const isTouchDevice = window.matchMedia("(hover: none)").matches;
      if (!isTouchDevice) {
        const onMove = (e: MouseEvent) => {
          const rect = hero.getBoundingClientRect();
          heroOverlay.style.opacity = "1";
          heroOverlay.style.background = `radial-gradient(600px circle at ${e.clientX - rect.left}px ${e.clientY - rect.top}px, rgba(34, 211, 238, 0.12), transparent 70%)`;
        };
        const onLeave = () => {
          heroOverlay.style.opacity = "0";
        };
        hero.addEventListener("mousemove", onMove);
        hero.addEventListener("mouseleave", onLeave);
        cleanups.push(() => {
          hero.removeEventListener("mousemove", onMove);
          hero.removeEventListener("mouseleave", onLeave);
        });
      }
    }

    // === EFFECT 2: Spotlight card hover ===
    const cards = document.querySelectorAll<HTMLElement>("[data-spotlight]");
    cards.forEach((card) => {
      const onMove = (e: MouseEvent) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
        card.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
        card.style.setProperty("--spotlight-opacity", "1");
      };
      const onLeave = () => {
        card.style.setProperty("--spotlight-opacity", "0");
      };
      card.addEventListener("mousemove", onMove);
      card.addEventListener("mouseleave", onLeave);
      cleanups.push(() => {
        card.removeEventListener("mousemove", onMove);
        card.removeEventListener("mouseleave", onLeave);
      });
    });

    // === EFFECT 3: Parallax hero ===
    const parallaxEls = document.querySelectorAll<HTMLElement>("[data-parallax]");
    let parallaxTicking = false;

    const updateParallax = () => {
      if (hero) {
        const heroBottom = hero.offsetTop + hero.offsetHeight;
        const scrollY = window.scrollY;
        if (scrollY < heroBottom) {
          parallaxEls.forEach((el) => {
            const speed = parseFloat(el.dataset.parallax || "0.3");
            el.style.transform = `translateY(${scrollY * speed}px)`;
          });
        }
      }
      parallaxTicking = false;
    };

    const onScrollParallax = () => {
      if (!parallaxTicking) {
        requestAnimationFrame(updateParallax);
        parallaxTicking = true;
      }
    };

    if (parallaxEls.length > 0) {
      window.addEventListener("scroll", onScrollParallax, { passive: true });
      cleanups.push(() => window.removeEventListener("scroll", onScrollParallax));
    }

    // === EFFECT 4: Scroll-linked background shift ===
    const tintOverlay = document.getElementById("scroll-tint-overlay");
    let tintTicking = false;

    const updateTint = () => {
      if (!tintOverlay) {
        tintTicking = false;
        return;
      }
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const pct = maxScroll > 0 ? window.scrollY / maxScroll : 0;

      let r = 0,
        g = 0,
        b = 0,
        a = 0;
      if (pct < 0.25) {
        const t = pct / 0.25;
        r = 40;
        g = 20;
        b = 0;
        a = t * 0.04;
      } else if (pct < 0.5) {
        const t = (pct - 0.25) / 0.25;
        r = Math.round(40 * (1 - t));
        g = Math.round(20 * (1 - t) + 30 * t);
        b = Math.round(60 * t);
        a = 0.04;
      } else if (pct < 0.75) {
        const t = (pct - 0.5) / 0.25;
        r = 0;
        g = Math.round(30 * (1 - t));
        b = Math.round(60 * (1 - t));
        a = 0.04 * (1 - t);
      }

      tintOverlay.style.background = `rgba(${r}, ${g}, ${b}, ${a})`;
      tintTicking = false;
    };

    const onScrollTint = () => {
      if (!tintTicking) {
        requestAnimationFrame(updateTint);
        tintTicking = true;
      }
    };

    if (tintOverlay) {
      window.addEventListener("scroll", onScrollTint, { passive: true });
      cleanups.push(() => window.removeEventListener("scroll", onScrollTint));
    }

    return () => cleanups.forEach((fn) => fn());
  }, [pathname]);

  return (
    <div
      id="scroll-tint-overlay"
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
}
