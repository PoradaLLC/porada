"use client"; // Error boundaries must be Client Components

import Link from "next/link";
import { Home, RotateCcw, TriangleAlert } from "lucide-react";

/**
 * Demo-themed error boundary for the /demo segment. Renders inside the demo layout,
 * so a render error shows on-brand instead of white-screening. Next 16 passes
 * `unstable_retry` to re-render the segment's children.
 */
export default function DemoError({ unstable_retry }: { unstable_retry: () => void }) {
  return (
    <div className="mx-auto max-w-xl px-4 sm:px-6 py-24 text-center">
      <div
        className="mx-auto mb-6 h-16 w-16 rounded-full flex items-center justify-center"
        style={{ background: "var(--glow)", border: "1px solid var(--brass)" }}
      >
        <TriangleAlert size={30} style={{ color: "var(--brass-bright)" }} />
      </div>
      <h1 className="font-display text-3xl sm:text-4xl" style={{ color: "var(--parchment)" }}>
        A clue slipped out of place.
      </h1>
      <p className="mt-3 text-base" style={{ color: "var(--muted)" }}>
        Something went wrong loading this part of the site. Give it another go — and if it keeps
        happening, head back to the lobby.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => unstable_retry()}
          className="demo-btn demo-btn-primary px-6 py-3"
        >
          <RotateCcw size={16} /> Try again
        </button>
        <Link href="/demo" className="demo-btn demo-btn-ghost px-6 py-3">
          <Home size={16} /> Back to the lobby
        </Link>
      </div>
    </div>
  );
}
