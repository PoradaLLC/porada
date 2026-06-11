"use client";

import { motion } from "motion/react";
import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

export function HeroHighlight({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <span className={cn("relative inline-block whitespace-nowrap", className)}>
      <span className="relative z-10 italic">{children}</span>
      <svg
        className="pointer-events-none absolute -bottom-[0.12em] left-[-0.05em] right-[-0.05em] z-0 h-[0.35em] w-[110%]"
        viewBox="0 0 300 30"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <motion.path
          d="M5 20 C 60 5, 140 30, 200 12 S 280 8, 295 18"
          fill="none"
          stroke="var(--accent)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeOpacity="0.45"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{
            duration: 1.4,
            ease: "easeInOut",
            delay,
          }}
        />
      </svg>
    </span>
  );
}
