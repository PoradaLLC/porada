"use client";

import { useEffect, useState } from "react";

type Theme = "atlas" | "signal";
const THEME_KEY = "s117-theme";
const THEME_COLORS: Record<Theme, string> = {
  atlas: "#f3efe7",
  signal: "#0c0e0d",
};

function readInitialTheme(): Theme {
  if (typeof document === "undefined") return "atlas";
  const attr = document.documentElement.getAttribute("data-theme");
  return attr === "signal" ? "signal" : "atlas";
}

function syncThemeColor(theme: Theme) {
  if (typeof document === "undefined") return;
  let meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  if (!meta) {
    meta = document.createElement("meta");
    meta.name = "theme-color";
    document.head.appendChild(meta);
  }
  meta.setAttribute("content", THEME_COLORS[theme]);
}

export function Tweaks() {
  const [theme, setTheme] = useState<Theme>("atlas");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setTheme(readInitialTheme());
  }, []);

  function apply(next: Theme) {
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    syncThemeColor(next);
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      /* ignore */
    }
  }

  return (
    <>
      <button
        type="button"
        className="tweaks-fab"
        aria-label="Open design tweaks"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M4 7h10M14 7a3 3 0 106 0M20 17H10M10 17a3 3 0 11-6 0"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      </button>
      <div
        className={`tweaks-panel${open ? " open" : ""}`}
        role="dialog"
        aria-label="Design direction tweaks"
      >
        <h5>Design direction</h5>
        <div className="seg" role="tablist">
          <button
            type="button"
            className={theme === "atlas" ? "on" : ""}
            onClick={() => apply("atlas")}
            role="tab"
            aria-selected={theme === "atlas"}
          >
            Atlas
          </button>
          <button
            type="button"
            className={theme === "signal" ? "on" : ""}
            onClick={() => apply("signal")}
            role="tab"
            aria-selected={theme === "signal"}
          >
            Signal
          </button>
        </div>
        <label style={{ marginTop: 14 }}>
          <span style={{ display: "block", color: "var(--ink-faint)", marginBottom: 4 }}>
            Atlas — warm &amp; human
          </span>
          Cream, terracotta, Fraunces display.
        </label>
        <label>
          <span style={{ display: "block", color: "var(--ink-faint)", marginBottom: 4 }}>
            Signal — technical &amp; quiet
          </span>
          Near-black, mint, Space Grotesk.
        </label>
      </div>
    </>
  );
}
