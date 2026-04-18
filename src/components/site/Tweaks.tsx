"use client";

import { useEffect, useState } from "react";

type Theme = "atlas" | "signal";
const THEME_KEY = "s117-theme";

function readInitialTheme(): Theme {
  if (typeof document === "undefined") return "atlas";
  const attr = document.documentElement.getAttribute("data-theme");
  return attr === "signal" ? "signal" : "atlas";
}

// theme-color now comes from two static <meta> tags with
// prefers-color-scheme media queries; globals.css's color-scheme rule
// (light on Atlas, dark on Signal) re-runs the media eval when the
// user toggles, so we don't need to mutate that tag from JS.
// apple-mobile-web-app-status-bar-style doesn't support media queries,
// so we still manage it imperatively for the save-to-home-screen case.
function syncAppleStatusBar(theme: Theme) {
  if (typeof document === "undefined") return;
  const existing = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
  if (existing) existing.parentNode?.removeChild(existing);
  const bar = document.createElement("meta");
  bar.setAttribute("name", "apple-mobile-web-app-status-bar-style");
  bar.setAttribute("content", theme === "signal" ? "black-translucent" : "default");
  document.head.appendChild(bar);
}

export function Tweaks() {
  const [theme, setTheme] = useState<Theme>("atlas");

  useEffect(() => {
    setTheme(readInitialTheme());
  }, []);

  function toggle() {
    const next: Theme = theme === "atlas" ? "signal" : "atlas";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    syncAppleStatusBar(next);
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      /* ignore */
    }
  }

  return (
    <button
      type="button"
      className="tweaks-fab"
      aria-label={`Switch to ${theme === "atlas" ? "Signal" : "Atlas"} theme`}
      onClick={toggle}
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
  );
}
