"use client";

import { useEffect } from "react";
import { motion, stagger, useAnimate } from "motion/react";
import { cn } from "@/lib/utils";

export function TextGenerateEffect({
  words,
  className,
  filter = true,
  duration = 0.6,
  delay = 0,
}: {
  words: string;
  className?: string;
  filter?: boolean;
  duration?: number;
  delay?: number;
}) {
  const [scope, animate] = useAnimate();
  const wordsArray = words.split(" ");

  useEffect(() => {
    animate(
      "span",
      {
        opacity: 1,
        filter: filter ? "blur(0px)" : "none",
      },
      {
        duration,
        delay: stagger(0.08, { startDelay: delay }),
      },
    );
  }, [animate, duration, filter, delay]);

  return (
    <div className={cn(className)}>
      <motion.div ref={scope}>
        {wordsArray.map((word, idx) => (
          <motion.span
            key={`${word}-${idx}`}
            className="opacity-0 inline-block"
            style={{
              filter: filter ? "blur(10px)" : "none",
            }}
          >
            {word}
            {idx < wordsArray.length - 1 ? " " : ""}
          </motion.span>
        ))}
      </motion.div>
    </div>
  );
}
