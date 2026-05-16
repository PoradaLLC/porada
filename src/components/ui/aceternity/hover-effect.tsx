"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export function HoverEffect({
  items,
  className,
}: {
  items: {
    num: string;
    title: string;
    desc: string;
    from: string;
    span: string;
  }[];
  className?: string;
}) {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3",
        className,
      )}
    >
      {items.map((item, idx) => (
        <div
          key={item.num}
          className="group relative block h-full w-full p-2"
          onMouseEnter={() => setHovered(idx)}
          onMouseLeave={() => setHovered(null)}
        >
          <AnimatePresence>
            {hovered === idx && (
              <motion.span
                className="absolute inset-0 block h-full w-full rounded-2xl bg-[var(--bg-elev)]"
                layoutId="hoverBackground"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { duration: 0.15 },
                }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.15, delay: 0.2 },
                }}
              />
            )}
          </AnimatePresence>
          <ServiceCard num={item.num} from={item.from} span={item.span}>
            <h3 className="text-[clamp(22px,2.4vw,28px)] leading-tight text-[var(--ink)]">
              {item.title}
            </h3>
            <p className="mt-3 text-[15px] leading-[1.65] text-[var(--ink-soft)]">
              {item.desc}
            </p>
          </ServiceCard>
        </div>
      ))}
    </div>
  );
}

function ServiceCard({
  children,
  num,
  from,
  span,
}: {
  children: ReactNode;
  num: string;
  from: string;
  span: string;
}) {
  return (
    <div
      className={cn(
        "relative z-20 flex h-full min-h-[260px] flex-col justify-between gap-6 overflow-hidden rounded-xl border border-[var(--rule)] bg-transparent px-7 py-7 transition-colors",
        "group-hover:border-[var(--rule-strong)]",
      )}
    >
      <div className="font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--ink-faint)]">
        {num}
      </div>
      <div>{children}</div>
      <div className="flex items-end justify-between border-t border-[var(--rule)] pt-4 text-[12px] uppercase tracking-[0.08em] text-[var(--ink-soft)]">
        <span>{from}</span>
        <span>{span}</span>
      </div>
    </div>
  );
}
