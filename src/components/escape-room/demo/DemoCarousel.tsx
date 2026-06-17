"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, ImageIcon, Lock, Plug, Star } from "lucide-react";
import {
  SNIPPET_BOARD,
  SNIPPET_CALLOUTS,
  SNIPPET_ROOM,
  type SnippetKind,
} from "./demoData";

/**
 * Demo carousel — the "show" half of the single mechanism section.
 *
 * One large, real frame at a time (a sliding track of static screens lifted from
 * the live Lantern & Lock demo at /demo), with a swipeable/clickable thumbnail
 * strip below and a one-line caption. Replaces the old static grid of snippets:
 * same real screens, but presented as a focused, scannable carousel so the
 * mechanism section does its job once.
 *
 * Motion: the track slides via transform only, gated behind
 * `prefers-reduced-motion: no-preference` (reduced motion snaps with no
 * transition). The carousel renders slide 0 immediately — no first-paint delay —
 * and the whole block fades in on scroll via the global `data-reveal` system.
 *
 * Data/numbers live in demoData.ts; this is presentation only.
 */

const r = SNIPPET_ROOM;

function Meter({ value, max = 5 }: { value: number; max?: number }) {
  return (
    <span className="er-snip-meter" aria-hidden>
      {Array.from({ length: max }).map((_, i) => (
        <i key={i} className={i < value ? "on" : ""} />
      ))}
    </span>
  );
}

/** Mini photo placeholder, echoing the demo's intentional empty <PhotoSlot/>. */
function PhotoSlot({ style, children }: { style?: React.CSSProperties; children?: React.ReactNode }) {
  return (
    <div className="er-snip-photo" style={style} aria-hidden>
      {children}
      <ImageIcon size={16} strokeWidth={1.5} />
      <span>your room photo</span>
    </div>
  );
}

function RoomCardScreen() {
  return (
    <div className="er-snip-roomcard">
      <PhotoSlot style={{ background: r.art }}>
        <span className="er-snip-award">{r.award}</span>
      </PhotoSlot>
      <div className="er-snip-rc-body">
        <h5>{r.name}</h5>
        <p>{r.tagline}</p>
        <div className="er-snip-stats">
          <span>Difficulty</span>
          <Meter value={r.difficulty} />
          <span>· {r.players} · {r.durationMin} min</span>
        </div>
        <div className="er-snip-rc-foot">
          <span className="er-snip-price">${r.pricePerPerson}<small>/person</small></span>
          <span className="er-snip-go">Book →</span>
        </div>
      </div>
    </div>
  );
}

function BookingScreen() {
  const steps = ["Room", "Date", "Time", "Party", "Pay"];
  return (
    <div className="er-snip-book">
      <div className="er-snip-steps">
        {steps.map((s, i) => (
          <span key={s} className={i === 1 ? "on" : i < 1 ? "done" : ""}>{s}</span>
        ))}
      </div>
      <div className="er-snip-sub">{r.name} · pick a date &amp; time</div>
      <div className="er-snip-cal">
        {Array.from({ length: 14 }).map((_, i) => (
          <span key={i} className={`er-snip-day${i === 9 ? " on" : ""}`} />
        ))}
      </div>
      <div className="er-snip-chips">
        <span>4:30</span>
        <span className="on">6:00</span>
        <span>7:30</span>
        <span>9:00</span>
      </div>
    </div>
  );
}

function DetailScreen() {
  return (
    <div className="er-snip-detail">
      <PhotoSlot style={{ background: r.art }} />
      <div className="er-snip-detail-body">
        <h5>{r.name}</h5>
        <div className="er-snip-rating">
          <Star size={12} fill="currentColor" strokeWidth={0} />
          {r.rating} · Challenging
        </div>
        <div className="er-snip-facts">
          <span><b>{r.escapeRate}%</b> escape</span>
          <span><b>{r.bestTime}</b> record</span>
        </div>
        <div className="er-snip-rail">
          <span className="er-snip-price">${r.pricePerPerson}<small>/person</small></span>
          <span className="er-snip-go solid">Check availability</span>
        </div>
      </div>
    </div>
  );
}

function LeaderboardScreen() {
  return (
    <div className="er-snip-board">
      <div className="er-snip-sub">{r.name} · fastest escapes</div>
      <table>
        <tbody>
          {SNIPPET_BOARD.map((row, i) => (
            <tr key={row.team} className={i === 0 ? "top" : ""}>
              <td className="rank">{i + 1}</td>
              <td>{row.team}</td>
              <td className="time">{row.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PaymentScreen() {
  return (
    <div className="er-snip-pay">
      <div className="er-snip-steps">
        {["Party", "Contact", "Pay"].map((s, i) => (
          <span key={s} className={i === 2 ? "on" : "done"}>{s}</span>
        ))}
      </div>
      <div className="er-snip-pay-slot">
        <span className="er-snip-plug"><Plug size={18} strokeWidth={1.5} /></span>
        <b>Secure payment plugs in here.</b>
        <p>Your existing processor’s checkout (Stripe, Square…). We hand off — never store card data.</p>
        <span className="er-snip-lock"><Lock size={11} /> Card details never reach the demo.</span>
      </div>
    </div>
  );
}

const SCREENS: Record<SnippetKind, () => React.ReactElement> = {
  roomcard: RoomCardScreen,
  detail: DetailScreen,
  booking: BookingScreen,
  leaderboard: LeaderboardScreen,
  payment: PaymentScreen,
};

const URLS: Record<SnippetKind, string> = {
  roomcard: "lanternandlock.example",
  detail: "…/rooms/the-vault",
  booking: "…/rooms/the-vault/book",
  leaderboard: "…/leaderboard",
  payment: "…/book · payment",
};

// Order chosen to read like the booking journey: browse → book → play → return.
const ORDER: SnippetKind[] = ["roomcard", "detail", "booking", "leaderboard", "payment"];

/** A single browser-chrome frame around one demo screen — reused at full size
 *  in the stage and scaled down inside each thumbnail. */
function Frame({ kind }: { kind: SnippetKind }) {
  const Screen = SCREENS[kind];
  return (
    <div className="er-snip-frame">
      <div className="er-snip-bar">
        <span className="er-snip-dots" aria-hidden>
          <i /><i /><i />
        </span>
        <span className="er-snip-url">{URLS[kind]}</span>
      </div>
      <div className="er-snip-screen">
        <Screen />
      </div>
    </div>
  );
}

const SWIPE_THRESHOLD = 40;

export function DemoCarousel() {
  const [active, setActive] = useState(0);
  const startX = useRef<number | null>(null);
  const count = ORDER.length;

  const go = (next: number) => setActive(((next % count) + count) % count);

  const onTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0]?.clientX ?? null;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (startX.current == null) return;
    const dx = (e.changedTouches[0]?.clientX ?? startX.current) - startX.current;
    if (dx <= -SWIPE_THRESHOLD) go(active + 1);
    else if (dx >= SWIPE_THRESHOLD) go(active - 1);
    startX.current = null;
  };

  const { tag, label } = SNIPPET_CALLOUTS[ORDER[active]];

  return (
    <div className="er-carousel" data-reveal>
      <div className="er-car-stage">
        <button
          type="button"
          className="er-car-arrow prev"
          onClick={() => go(active - 1)}
          aria-label="Previous screen"
        >
          <ChevronLeft size={18} strokeWidth={2} />
        </button>

        <div className="er-car-viewport" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
          <div className="er-car-track" style={{ transform: `translateX(-${active * 100}%)` }}>
            {ORDER.map((kind, i) => (
              <div className="er-car-slide" key={kind} aria-hidden={i !== active}>
                <Frame kind={kind} />
              </div>
            ))}
          </div>
        </div>

        <button
          type="button"
          className="er-car-arrow next"
          onClick={() => go(active + 1)}
          aria-label="Next screen"
        >
          <ChevronRight size={18} strokeWidth={2} />
        </button>
      </div>

      <p className="er-car-cap" aria-live="polite">
        <span className="er-snip-cap-tag">{tag}</span>
        {label}
      </p>

      <div className="er-car-strip" role="tablist" aria-label="Demo screens">
        {ORDER.map((kind, i) => (
          <button
            type="button"
            key={kind}
            className={`er-cthumb${i === active ? " on" : ""}`}
            onClick={() => go(i)}
            role="tab"
            aria-selected={i === active}
            aria-label={SNIPPET_CALLOUTS[kind].tag}
          >
            <span className="er-cthumb-inner" aria-hidden>
              <Frame kind={kind} />
            </span>
            <span className="er-cthumb-tag">{SNIPPET_CALLOUTS[kind].tag}</span>
          </button>
        ))}
      </div>

      <div className="er-snips-foot" data-reveal>
        <span className="er-snips-note">Real screens — not mockups. Open the whole thing and click around.</span>
        <Link href="/demo" className="er-btn er-btn-primary">
          Explore the full demo →
        </Link>
      </div>
    </div>
  );
}
