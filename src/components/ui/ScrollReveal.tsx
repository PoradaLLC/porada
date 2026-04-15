"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function ScrollRevealInit() {
  const pathname = usePathname();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "-40px" }
    );

    const timer = requestAnimationFrame(() => {
      document.querySelectorAll("[data-reveal]:not(.revealed)").forEach((el) => {
        observer.observe(el);
      });
    });

    return () => {
      cancelAnimationFrame(timer);
      observer.disconnect();
    };
  }, [pathname]);

  return null;
}
