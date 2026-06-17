import Link from "next/link";
import { DoorClosed, Home } from "lucide-react";
import { rooms } from "@/components/demo/venue";

/**
 * Demo-themed 404. Renders inside the demo layout (nav + footer), so a bad room
 * slug — e.g. a `notFound()` from /demo/rooms/[slug] — stays in the venue's world
 * instead of dropping to the bare Next.js error page.
 */
export default function DemoNotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 sm:px-6 py-24 text-center">
      <div
        className="mx-auto mb-6 h-16 w-16 rounded-full flex items-center justify-center"
        style={{ background: "var(--glow)", border: "1px solid var(--brass)" }}
      >
        <DoorClosed size={30} style={{ color: "var(--brass-bright)" }} />
      </div>
      <h1 className="font-display text-3xl sm:text-4xl" style={{ color: "var(--parchment)" }}>
        This door doesn&apos;t open.
      </h1>
      <p className="mt-3 text-base" style={{ color: "var(--muted)" }}>
        We couldn&apos;t find that page. The room may have been renamed, or the link is off by a
        letter. Here are the four doors we do have:
      </p>

      <div className="mt-7 grid gap-2.5 sm:grid-cols-2 text-left">
        {rooms.map((r) => (
          <Link
            key={r.slug}
            href={`/demo/rooms/${r.slug}`}
            className="demo-card p-4 transition-transform hover:scale-[1.01]"
            style={{ ["--accent" as string]: r.accent, ["--accent-soft" as string]: r.accentSoft }}
          >
            <div className="font-display text-base" style={{ color: "var(--parchment)" }}>
              {r.name}
            </div>
            <div className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>
              {r.players.min}–{r.players.max} players · {r.durationMin} min
            </div>
          </Link>
        ))}
      </div>

      <Link href="/demo" className="demo-btn demo-btn-primary px-6 py-3 mt-8 inline-flex">
        <Home size={16} /> Back to the lobby
      </Link>
    </div>
  );
}
