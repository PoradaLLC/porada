"use client";

import { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";

type Item = { quote: string };

export function InfiniteMovingCards({
  items,
  direction = "left",
  speed = "slow",
  pauseOnHover = true,
  className,
}: {
  items: Item[];
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLUListElement>(null);
  const [start, setStart] = useState(false);

  useEffect(() => {
    if (!containerRef.current || !scrollerRef.current) return;
    const scroller = scrollerRef.current;
    const container = containerRef.current;

    const children = Array.from(scroller.children);
    children.forEach((child) => {
      const dup = child.cloneNode(true) as HTMLElement;
      dup.setAttribute("aria-hidden", "true");
      scroller.appendChild(dup);
    });

    container.style.setProperty(
      "--animation-direction",
      direction === "left" ? "forwards" : "reverse",
    );
    const duration =
      speed === "fast" ? "20s" : speed === "normal" ? "40s" : "80s";
    container.style.setProperty("--animation-duration", duration);

    setStart(true);
  }, [direction, speed]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "scroller relative z-20 max-w-full overflow-hidden",
        "[mask-image:linear-gradient(to_right,transparent,white_15%,white_85%,transparent)]",
        className,
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          "flex w-max min-w-full shrink-0 flex-nowrap gap-10 py-6",
          start && "animate-scroll",
          pauseOnHover && "hover:[animation-play-state:paused]",
        )}
      >
        {items.map((item, idx) => (
          <li
            key={idx}
            className="shrink-0 px-4 text-[clamp(20px,3vw,32px)] italic text-[var(--ink-soft)]"
          >
            {item.quote}
            <span className="ml-10 inline-block align-middle text-[var(--accent)]">
              ✦
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
