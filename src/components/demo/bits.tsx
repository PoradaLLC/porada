import { ImageIcon, Star } from "lucide-react";
import type { Room } from "./venue";

/**
 * Intentional EMPTY photo/media frame. There is no real imagery in this demo on
 * purpose — every slot is a polished, on-brand placeholder so a prospect pictures
 * their OWN photo here. Children (badges, captions) render above the frame.
 */
export function PhotoSlot({
  label = "Your photo here",
  hint,
  className = "",
  iconSize = 18,
  children,
}: {
  label?: string;
  hint?: string;
  className?: string;
  iconSize?: number;
  children?: React.ReactNode;
}) {
  return (
    <div className={`demo-slot ${className}`}>
      <span className="demo-slot-label">
        <ImageIcon size={iconSize} strokeWidth={1.5} aria-hidden />
        {label ? <span>{label}</span> : null}
        {hint && <span className="demo-slot-hint">{hint}</span>}
      </span>
      {children}
    </div>
  );
}

/** One labelled 1–5 star meter (Difficulty / Physical / Scare). Filled uses the single accent. */
export function Meter({
  label,
  value,
  max = 5,
  size = 13,
}: {
  label: string;
  value: number;
  max?: number;
  size?: number;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-[0.7rem] uppercase tracking-wide" style={{ color: "var(--muted)" }}>
        {label}
      </span>
      <span className="flex items-center gap-0.5" aria-label={`${label}: ${value} of ${max}`}>
        {Array.from({ length: max }).map((_, i) => (
          <Star
            key={i}
            size={size}
            strokeWidth={1.5}
            style={{ color: i < value ? "var(--brass)" : "var(--line-strong)" }}
            fill={i < value ? "var(--brass)" : "transparent"}
          />
        ))}
      </span>
    </div>
  );
}

/** The three-meter block carried across room cards and the room detail page. */
export function RoomMeters({ room, className = "", size }: { room: Room; className?: string; size?: number }) {
  return (
    <div className={`grid gap-1.5 ${className}`}>
      <Meter label="Difficulty" value={room.difficulty} size={size} />
      <Meter label="Physical" value={room.physical} size={size} />
      <Meter label="Scare" value={room.scare} size={size} />
    </div>
  );
}

/** Star rating row (reviews). */
export function Stars({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={size}
          style={{ color: "var(--brass)" }}
          fill={i < rating ? "var(--brass)" : "transparent"}
          strokeWidth={1.5}
        />
      ))}
    </span>
  );
}

/** Section heading with eyebrow. */
export function SectionHead({
  eyebrow,
  title,
  lede,
  center,
}: {
  eyebrow?: string;
  title: string;
  lede?: string;
  center?: boolean;
}) {
  return (
    <div className={center ? "text-center max-w-2xl mx-auto" : "max-w-2xl"}>
      {eyebrow && (
        <div
          className="text-xs font-semibold uppercase tracking-[0.18em] mb-3"
          style={{ color: "var(--brass)" }}
        >
          {eyebrow}
        </div>
      )}
      <h2 className="font-display text-3xl sm:text-4xl leading-tight" style={{ color: "var(--parchment)" }}>
        {title}
      </h2>
      {lede && (
        <p className="mt-3 text-base sm:text-lg" style={{ color: "var(--muted)" }}>
          {lede}
        </p>
      )}
    </div>
  );
}
