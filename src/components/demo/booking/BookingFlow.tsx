"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar as CalendarIcon,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Info,
  Lock,
  Minus,
  Plug,
  Plus,
  ShieldCheck,
  Tag,
  Trophy,
  Users,
  X,
} from "lucide-react";
import { getRoom, rooms, venue, type Room, type RoomSlug } from "../venue";
import { PhotoSlot } from "../bits";
import { OwnerPreview } from "../owner/OwnerPreview";
import {
  hasAvailability,
  monthGrid,
  monthLabel,
  prettyDate,
  slotsFor,
  isPast,
  WEEKDAYS,
} from "./availability";
import {
  confirmationCode,
  isValidPromo,
  money,
  normalizePromo,
  quote,
  type Quote,
} from "./pricing";

type Step = "room" | "date" | "time" | "party" | "contact" | "payment" | "done";

/** The labeled progress rail across the top — borrows the multi-step checkout anatomy. */
const STAGES: { label: string; short: string; steps: Step[] }[] = [
  { label: "Select experience", short: "Experience", steps: ["room"] },
  { label: "Booking details", short: "Details", steps: ["date", "time", "party"] },
  { label: "Your information", short: "Your info", steps: ["contact"] },
  { label: "Payment", short: "Payment", steps: ["payment"] },
  { label: "Confirmation", short: "Done", steps: ["done"] },
];

function stageIndexFor(step: Step): number {
  return STAGES.findIndex((s) => s.steps.includes(step));
}

interface Contact {
  name: string;
  email: string;
  phone: string;
}

/* ===================================================================== *
 * Root
 * ===================================================================== */
export function BookingFlow({
  initialRoom,
  onClose,
}: {
  initialRoom: RoomSlug | null;
  onClose: () => void;
}) {
  const today = useMemo(() => new Date(), []);
  const [step, setStep] = useState<Step>(initialRoom ? "date" : "room");
  const [roomSlug, setRoomSlug] = useState<RoomSlug | null>(initialRoom);
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [players, setPlayers] = useState(
    () => (initialRoom ? getRoom(initialRoom)?.players.min : undefined) ?? 2,
  );
  const [contact, setContact] = useState<Contact>({ name: "", email: "", phone: "" });
  const [policyAccepted, setPolicyAccepted] = useState(false);
  const [promo, setPromo] = useState<string | null>(null);
  const [view, setView] = useState({ y: today.getFullYear(), m: today.getMonth() });

  const room = roomSlug ? getRoom(roomSlug) : undefined;
  const dialogRef = useRef<HTMLDivElement>(null);

  // Close on Escape; lock body scroll while open.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  function pickRoom(slug: RoomSlug) {
    setRoomSlug(slug);
    setPlayers(getRoom(slug)?.players.min ?? 2);
    setStep("date");
  }
  function pickDate(d: Date) {
    setDate(d);
    setTime(null);
    setStep("time");
  }
  function pickTime(t: string) {
    setTime(t);
    setStep("party");
  }

  const q: Quote | null = room ? quote(room.pricePerPerson, players, promo) : null;
  const stageIdx = stageIndexFor(step);

  const accentStyle = room
    ? ({ ["--accent" as string]: room.accent, ["--accent-soft" as string]: room.accentSoft })
    : undefined;

  return (
    <div
      className="demo-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={`Book ${room ? room.name : "a room"}`}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        style={accentStyle as React.CSSProperties}
        className="demo-checkout demo-rise w-full sm:max-w-3xl lg:max-w-5xl max-h-[94vh] flex flex-col rounded-t-2xl sm:rounded-2xl overflow-hidden"
        data-tour="booking-panel"
      >
        {/* Header */}
        <div className="demo-checkout-head shrink-0 flex items-center justify-between gap-3 px-5 py-4 border-b">
          <div className="flex items-center gap-3 min-w-0">
            {step !== "room" && step !== "done" && (
              <button
                aria-label="Back"
                onClick={() => goBack(step, !!initialRoom, setStep)}
                className="demo-btn demo-btn-ghost h-8 w-8 !p-0 rounded-full shrink-0"
              >
                <ArrowLeft size={16} />
              </button>
            )}
            <div className="min-w-0">
              <div className="text-[0.7rem] uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                {venue.fullName}
              </div>
              <div className="font-display text-base truncate" style={{ color: "var(--parchment)" }}>
                {step === "done" ? "You're booked" : room ? room.name : "Book your escape"}
              </div>
            </div>
          </div>
          <button
            aria-label="Close booking"
            onClick={onClose}
            data-tour="booking-close"
            className="demo-btn demo-btn-ghost h-8 w-8 !p-0 rounded-full shrink-0"
          >
            <X size={16} />
          </button>
        </div>

        {/* Progress rail */}
        <ProgressRail activeIndex={stageIdx} />

        {/* Body: form (left) + live order summary (right) */}
        <div className="demo-checkout-body flex-1 overflow-y-auto demo-scroll">
          <div className="grid lg:grid-cols-[minmax(0,1fr)_340px]">
            {/* Left — the active step */}
            <div className="px-5 py-6 lg:px-7">
              {step === "room" && <RoomStep onPick={pickRoom} />}

              {step === "date" && room && (
                <DateStep
                  room={room}
                  today={today}
                  view={view}
                  setView={setView}
                  selected={date}
                  onPick={pickDate}
                />
              )}

              {step === "time" && room && date && (
                <TimeStep room={room} date={date} selected={time} onPick={pickTime} />
              )}

              {step === "party" && room && (
                <PartyStep
                  room={room}
                  players={players}
                  setPlayers={setPlayers}
                  onNext={() => setStep("contact")}
                />
              )}

              {step === "contact" && room && (
                <ContactStep
                  contact={contact}
                  setContact={setContact}
                  policyAccepted={policyAccepted}
                  setPolicyAccepted={setPolicyAccepted}
                  onNext={() => setStep("payment")}
                />
              )}

              {step === "payment" && room && q && (
                <PaymentStep onPay={() => setStep("done")} />
              )}

              {step === "done" && room && date && time && q && (
                <DoneStep
                  room={room}
                  date={date}
                  time={time}
                  players={players}
                  quote={q}
                  contact={contact}
                  onClose={onClose}
                />
              )}
            </div>

            {/* Right — live order summary */}
            <aside className="demo-summary lg:self-start lg:sticky lg:top-0">
              <OrderSummary
                room={room}
                date={date}
                time={time}
                players={players}
                quote={q}
                promo={promo}
                setPromo={setPromo}
                done={step === "done"}
              />
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}

function goBack(step: Step, lockedRoom: boolean, setStep: (s: Step) => void) {
  const map: Record<Step, Step> = {
    room: "room",
    date: "room",
    time: "date",
    party: "time",
    contact: "party",
    payment: "contact",
    done: "payment",
  };
  let prev = map[step];
  // If the room was pre-selected (came from a room page), don't walk back to room choice.
  if (prev === "room" && lockedRoom) prev = "date";
  setStep(prev);
}

/* ===================================================================== *
 * Progress rail
 * ===================================================================== */
function ProgressRail({ activeIndex }: { activeIndex: number }) {
  return (
    <div className="demo-rail shrink-0 px-5 lg:px-7" aria-label="Checkout progress">
      {/* Full labeled rail on larger screens */}
      <ol className="hidden sm:flex items-center">
        {STAGES.map((s, i) => {
          const done = i < activeIndex;
          const active = i === activeIndex;
          return (
            <li key={s.label} className="flex items-center flex-1 last:flex-none">
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="demo-rail-dot"
                  data-state={done ? "done" : active ? "active" : "todo"}
                >
                  {done ? <Check size={13} strokeWidth={3} /> : i + 1}
                </span>
                <span
                  className="text-[0.74rem] font-medium truncate"
                  style={{
                    color: active
                      ? "var(--parchment)"
                      : done
                        ? "var(--muted)"
                        : "var(--muted-2)",
                  }}
                >
                  {s.label}
                </span>
              </div>
              {i < STAGES.length - 1 && (
                <span className="demo-rail-line" data-state={done ? "done" : "todo"} />
              )}
            </li>
          );
        })}
      </ol>

      {/* Compact rail on mobile */}
      <div className="sm:hidden flex items-center justify-between">
        <span className="text-[0.72rem] font-medium" style={{ color: "var(--parchment)" }}>
          Step {Math.min(activeIndex + 1, STAGES.length)} of {STAGES.length} ·{" "}
          <span style={{ color: "var(--brass-bright)" }}>{STAGES[activeIndex]?.short}</span>
        </span>
        <div className="flex items-center gap-1.5" aria-hidden>
          {STAGES.map((s, i) => (
            <span
              key={s.label}
              className="h-1.5 rounded-full transition-all"
              style={{
                width: i === activeIndex ? 20 : 7,
                background: i <= activeIndex ? "var(--accent)" : "var(--line-strong)",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ===================================================================== *
 * Order summary (right column) — "Your purchase", live + promo
 * ===================================================================== */
function OrderSummary({
  room,
  date,
  time,
  players,
  quote: q,
  promo,
  setPromo,
  done,
}: {
  room: Room | undefined;
  date: Date | null;
  time: string | null;
  players: number;
  quote: Quote | null;
  promo: string | null;
  setPromo: (code: string | null) => void;
  done: boolean;
}) {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  function apply() {
    if (isValidPromo(code)) {
      setPromo(normalizePromo(code));
      setError(null);
    } else {
      setError("That code isn't valid.");
    }
  }

  return (
    <div className="px-5 py-6 lg:px-6">
      <div className="text-[0.7rem] uppercase tracking-wider mb-3" style={{ color: "var(--muted)" }}>
        {done ? "Your purchase" : "Order summary"}
      </div>

      {!room ? (
        <div className="demo-card p-4 text-center">
          <PhotoSlot label="" iconSize={20} className="h-24 w-full rounded-lg mb-3" />
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            Select an experience to start your order.
          </p>
        </div>
      ) : (
        <div className="demo-card p-4">
          {/* Item */}
          <div className="flex items-center gap-3">
            <PhotoSlot label="" iconSize={18} className="h-14 w-14 rounded-lg shrink-0" />
            <div className="min-w-0">
              <div className="font-display text-[0.98rem] truncate" style={{ color: "var(--parchment)" }}>
                {room.name}
              </div>
              <div className="text-xs" style={{ color: "var(--muted)" }}>
                {room.durationMin} min · private game
              </div>
            </div>
          </div>

          {/* Booking facts */}
          <dl className="mt-4 grid gap-1.5 text-sm">
            <SummaryFact label="Date" value={date ? prettyDate(date) : "—"} />
            <SummaryFact label="Time" value={time ?? "—"} />
            <SummaryFact label="Players" value={`${players}`} />
          </dl>

          <div className="demo-divider my-4" />

          {/* Money */}
          {q && (
            <dl className="grid gap-1.5 text-sm">
              <SummaryFact
                label={`Booking subtotal (${money(q.perPerson)} × ${players})`}
                value={money(q.subtotal)}
              />
              {q.discount > 0 && (
                <SummaryFact
                  label={q.discountLabel ?? "Promo discount"}
                  value={`−${money(q.discount)}`}
                  good
                />
              )}
              {q.taxes.map((t) => (
                <SummaryFact key={t.label} label={t.label} value={money(t.amount)} muted />
              ))}
            </dl>
          )}

          {/* Promo code */}
          {!done && (
            <div className="mt-4">
              {promo ? (
                <div className="flex items-center justify-between gap-2 demo-promo-applied">
                  <span className="inline-flex items-center gap-1.5 text-xs" style={{ color: "var(--good)" }}>
                    <Tag size={13} /> {promo} applied
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setPromo(null);
                      setCode("");
                    }}
                    className="text-xs underline"
                    style={{ color: "var(--muted)" }}
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex gap-2">
                    <input
                      className="demo-input flex-1 !py-2 text-sm"
                      placeholder="Promo code"
                      value={code}
                      data-tour="booking-promo"
                      aria-label="Promo code"
                      onChange={(e) => {
                        setCode(e.target.value);
                        setError(null);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          apply();
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={apply}
                      disabled={!code.trim()}
                      className="demo-btn demo-btn-ghost px-4 text-sm"
                    >
                      Apply
                    </button>
                  </div>
                  {error ? (
                    <p className="text-[0.7rem] mt-1.5" style={{ color: "#e08a8a" }}>
                      {error}
                    </p>
                  ) : (
                    <p className="text-[0.7rem] mt-1.5" style={{ color: "var(--muted-2)" }}>
                      Try <span style={{ color: "var(--brass)" }}>LANTERN10</span> for 10% off.
                    </p>
                  )}
                </>
              )}
            </div>
          )}

          <div className="demo-divider my-4" />

          {/* Total */}
          <div className="flex items-end justify-between">
            <span className="text-sm" style={{ color: "var(--muted)" }}>
              Total
            </span>
            <span
              className="font-display text-2xl"
              style={{ color: "var(--brass-bright)" }}
              data-tour="booking-total"
            >
              {q ? money(q.total) : "—"}
            </span>
          </div>

          <p className="text-[0.68rem] mt-3 leading-relaxed" style={{ color: "var(--muted-2)" }}>
            Private room — one price covers your whole crew. Free reschedule up to 24h before.
          </p>
        </div>
      )}
    </div>
  );
}

function SummaryFact({
  label,
  value,
  muted,
  good,
}: {
  label: string;
  value: string;
  muted?: boolean;
  good?: boolean;
}) {
  return (
    <div className="flex justify-between gap-3">
      <dt style={{ color: "var(--muted)" }}>{label}</dt>
      <dd
        style={{
          color: good ? "var(--good)" : muted ? "var(--muted)" : "var(--parchment)",
          textAlign: "right",
        }}
      >
        {value}
      </dd>
    </div>
  );
}

/* ===================================================================== *
 * Step 1 — Room
 * ===================================================================== */
function RoomStep({ onPick }: { onPick: (slug: RoomSlug) => void }) {
  return (
    <div className="demo-pop" data-tour="booking-step-room">
      <h3 className="font-display text-lg" style={{ color: "var(--parchment)" }}>
        Choose your experience
      </h3>
      <p className="text-sm mt-1 mb-4" style={{ color: "var(--muted)" }}>
        Every game is private — just your group, never paired with strangers.
      </p>
      <div className="grid gap-2.5">
        {rooms.map((r) => (
          <button
            key={r.slug}
            onClick={() => onPick(r.slug)}
            data-tour={`booking-room-${r.slug}`}
            className="demo-card flex items-center gap-3 p-3 text-left hover:scale-[1.01] transition-transform"
            style={{ ["--accent" as string]: r.accent, ["--accent-soft" as string]: r.accentSoft }}
          >
            <PhotoSlot label="" iconSize={18} className="h-12 w-12 rounded-lg shrink-0" />
            <div className="min-w-0 flex-1">
              <div className="font-display text-[0.98rem] truncate" style={{ color: "var(--parchment)" }}>
                {r.name}
              </div>
              <div className="text-xs truncate" style={{ color: "var(--muted)" }}>
                {r.players.min}–{r.players.max} players · {r.durationMin} min · {money(r.pricePerPerson)}/person
              </div>
            </div>
            <ChevronRight size={18} style={{ color: "var(--muted)" }} />
          </button>
        ))}
      </div>
    </div>
  );
}

/* ===================================================================== *
 * Step 2 — Date
 * ===================================================================== */
function DateStep({
  room,
  today,
  view,
  setView,
  selected,
  onPick,
}: {
  room: Room;
  today: Date;
  view: { y: number; m: number };
  setView: (v: { y: number; m: number }) => void;
  selected: Date | null;
  onPick: (d: Date) => void;
}) {
  const cells = monthGrid(view.y, view.m);
  const atCurrentMonth = view.y === today.getFullYear() && view.m === today.getMonth();

  function shift(delta: number) {
    const m = view.m + delta;
    setView({ y: view.y + Math.floor(m / 12), m: ((m % 12) + 12) % 12 });
  }

  return (
    <div className="demo-pop" data-tour="booking-step-date">
      <div className="flex items-center gap-2 mb-3" style={{ color: "var(--muted)" }}>
        <CalendarIcon size={15} />
        <span className="text-sm">Choose a date</span>
      </div>

      <div className="demo-card p-3">
        <div className="flex items-center justify-between mb-2">
          <button
            aria-label="Previous month"
            onClick={() => shift(-1)}
            disabled={atCurrentMonth}
            className="demo-btn demo-btn-ghost h-8 w-8 !p-0 rounded-full"
          >
            <ChevronLeft size={16} />
          </button>
          <div className="font-display text-sm" style={{ color: "var(--parchment)" }}>
            {monthLabel(view.y, view.m)}
          </div>
          <button
            aria-label="Next month"
            onClick={() => shift(1)}
            className="demo-btn demo-btn-ghost h-8 w-8 !p-0 rounded-full"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-1">
          {WEEKDAYS.map((d) => (
            <div
              key={d}
              className="text-center text-[0.62rem] font-semibold uppercase tracking-wide py-1"
              style={{ color: "var(--muted-2)" }}
            >
              {d[0]}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {cells.map((d, i) => {
            if (!d) return <div key={i} />;
            const available = hasAvailability(d, room.slug, today);
            const past = isPast(d, today);
            const isSel = selected && d.toDateString() === selected.toDateString();
            const isToday = d.toDateString() === today.toDateString();
            const firstAvailable =
              available && !cells.slice(0, i).some((c) => c && hasAvailability(c, room.slug, today));
            return (
              <button
                key={i}
                disabled={!available}
                onClick={() => onPick(d)}
                data-tour={firstAvailable ? "booking-first-available-day" : undefined}
                className="aspect-square rounded-md text-sm flex items-center justify-center relative transition-colors disabled:cursor-not-allowed"
                style={{
                  background: isSel ? "var(--accent)" : available ? "var(--surface-3)" : "transparent",
                  color: isSel
                    ? "#221a06"
                    : past
                      ? "var(--muted-2)"
                      : available
                        ? "var(--parchment)"
                        : "var(--muted-2)",
                  border: isToday && !isSel ? "1px solid var(--brass)" : "1px solid transparent",
                  opacity: !available && !past ? 0.4 : 1,
                  fontWeight: isSel ? 700 : 500,
                }}
              >
                {d.getDate()}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-4 mt-3 text-[0.7rem]" style={{ color: "var(--muted)" }}>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ background: "var(--surface-3)" }} />
          Available
        </span>
        <span className="flex items-center gap-1.5">
          <span
            className="inline-block h-2.5 w-2.5 rounded-sm"
            style={{ background: "transparent", border: "1px solid var(--line-strong)" }}
          />
          Sold out / past
        </span>
      </div>

      <BuildTierNote />
    </div>
  );
}

/* A small, subtle expandable on the Booking details step explaining how the live
 * site gets built at each tier. Deliberately a caption, never a banner. */
function BuildTierNote() {
  return (
    <details className="demo-tier-note mt-4" data-tour="booking-tier-note">
      <summary>
        <Info size={13} aria-hidden />
        How this gets built
      </summary>
      <div className="demo-tier-body mt-1.5">
        <p>
          <strong>Standard</strong> — your current booking widget embeds here, styled to match.
        </p>
        <p>
          <strong>Premium</strong> — a fully custom flow like this one, on your platform&apos;s API.
        </p>
      </div>
    </details>
  );
}

/* ===================================================================== *
 * Step 3 — Time
 * ===================================================================== */
function TimeStep({
  room,
  date,
  selected,
  onPick,
}: {
  room: Room;
  date: Date;
  selected: string | null;
  onPick: (t: string) => void;
}) {
  const slots = slotsFor(date, room.slug);
  return (
    <div className="demo-pop" data-tour="booking-step-time">
      <div className="flex items-center gap-2 mb-1" style={{ color: "var(--muted)" }}>
        <Clock size={15} />
        <span className="text-sm">Pick a start time</span>
      </div>
      <div className="font-display text-sm mb-3" style={{ color: "var(--parchment)" }}>
        {prettyDate(date)}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {slots.map((s, i) => {
          const isSel = selected === s.time;
          const firstFree = s.available && !slots.slice(0, i).some((x) => x.available);
          return (
            <button
              key={s.time}
              disabled={!s.available}
              onClick={() => onPick(s.time)}
              data-tour={firstFree ? "booking-first-time" : undefined}
              className="demo-btn py-2.5 text-sm rounded-lg"
              style={{
                background: isSel ? "var(--accent)" : "var(--surface-3)",
                color: isSel ? "#221a06" : s.available ? "var(--parchment)" : "var(--muted-2)",
                border: "1px solid var(--line)",
                textDecoration: s.available ? "none" : "line-through",
                opacity: s.available ? 1 : 0.5,
              }}
            >
              {s.time}
            </button>
          );
        })}
      </div>
      <p className="text-[0.72rem] mt-3" style={{ color: "var(--muted-2)" }}>
        All games run {room.durationMin} minutes. Please arrive 15 minutes early.
      </p>

      <AvailabilityNote />
    </div>
  );
}

/* Availability stand-in — the honest sibling of the payment plug-in panel.
 * The calendar and these slots run on seeded demo data; on a live build the
 * real-time openings sync from the client's existing booking platform. Same
 * deliberate hand-off language, sized as a compact caption for this step. */
function AvailabilityNote() {
  return (
    <div className="demo-availability-note mt-4" data-tour="booking-availability-plugin">
      <span className="demo-availability-badge">
        <Plug size={15} strokeWidth={1.5} aria-hidden />
      </span>
      <span className="demo-availability-text">
        <strong>Live availability plugs in here.</strong>
        These times are illustrative. On your live site, real openings sync from your booking
        platform (Bookeo, Resova, FareHarbor) — so a slot can never be double-booked.
      </span>
    </div>
  );
}

/* ===================================================================== *
 * Step 4 — Party size
 * ===================================================================== */
function PartyStep({
  room,
  players,
  setPlayers,
  onNext,
}: {
  room: Room;
  players: number;
  setPlayers: (n: number) => void;
  onNext: () => void;
}) {
  const dec = () => setPlayers(Math.max(room.players.min, players - 1));
  const inc = () => setPlayers(Math.min(room.players.max, players + 1));
  return (
    <div className="demo-pop" data-tour="booking-step-party">
      <div className="flex items-center gap-2 mb-3" style={{ color: "var(--muted)" }}>
        <Users size={15} />
        <span className="text-sm">How many players?</span>
      </div>

      <div className="demo-card p-4 flex items-center justify-between">
        <button
          aria-label="Remove a player"
          onClick={dec}
          disabled={players <= room.players.min}
          className="demo-btn demo-btn-ghost h-11 w-11 !p-0 rounded-full"
        >
          <Minus size={18} />
        </button>
        <div className="text-center">
          <div className="font-display text-4xl" style={{ color: "var(--parchment)" }}>
            {players}
          </div>
          <div className="text-xs" style={{ color: "var(--muted)" }}>
            players ({room.players.min}–{room.players.max})
          </div>
        </div>
        <button
          aria-label="Add a player"
          onClick={inc}
          disabled={players >= room.players.max}
          className="demo-btn demo-btn-ghost h-11 w-11 !p-0 rounded-full"
        >
          <Plus size={18} />
        </button>
      </div>

      <p className="text-[0.72rem] mt-3 px-1" style={{ color: "var(--muted-2)" }}>
        Private room — the price covers your whole group, no strangers added. See the running
        total in your order summary.
      </p>

      <button
        onClick={onNext}
        data-tour="booking-party-next"
        className="demo-btn demo-btn-primary w-full mt-5 py-3"
      >
        Continue to your details
        <ChevronRight size={18} />
      </button>
    </div>
  );
}

/* ===================================================================== *
 * Step 5 — Your information (+ cancellation policy)
 * ===================================================================== */
function ContactStep({
  contact,
  setContact,
  policyAccepted,
  setPolicyAccepted,
  onNext,
}: {
  contact: Contact;
  setContact: (c: Contact) => void;
  policyAccepted: boolean;
  setPolicyAccepted: (b: boolean) => void;
  onNext: () => void;
}) {
  const contactValid =
    contact.name.trim().length > 1 && /\S+@\S+\.\S+/.test(contact.email);
  const valid = contactValid && policyAccepted;

  return (
    <form
      className="demo-pop"
      data-tour="booking-step-contact"
      onSubmit={(e) => {
        e.preventDefault();
        if (valid) onNext();
      }}
    >
      <h3 className="font-display text-lg" style={{ color: "var(--parchment)" }}>
        Your information
      </h3>
      <p className="text-sm mt-1 mb-4" style={{ color: "var(--muted)" }}>
        We&apos;ll send your confirmation, waiver, and arrival details here.
      </p>

      <div className="grid gap-3">
        <label className="block">
          <span className="text-xs" style={{ color: "var(--muted)" }}>Full name</span>
          <input
            className="demo-input mt-1"
            placeholder="Your name"
            value={contact.name}
            data-tour="booking-name"
            onChange={(e) => setContact({ ...contact, name: e.target.value })}
            required
          />
        </label>
        <label className="block">
          <span className="text-xs" style={{ color: "var(--muted)" }}>Email</span>
          <input
            type="email"
            className="demo-input mt-1"
            placeholder="you@example.com"
            value={contact.email}
            data-tour="booking-email"
            onChange={(e) => setContact({ ...contact, email: e.target.value })}
            required
          />
        </label>
        <label className="block">
          <span className="text-xs" style={{ color: "var(--muted)" }}>Phone (optional)</span>
          <input
            type="tel"
            className="demo-input mt-1"
            placeholder="(555) 000-0000"
            value={contact.phone}
            onChange={(e) => setContact({ ...contact, phone: e.target.value })}
          />
        </label>
      </div>

      {/* Cancellation policy */}
      <div className="demo-card p-3.5 mt-5">
        <div className="flex items-center gap-2 mb-1.5" style={{ color: "var(--parchment)" }}>
          <ShieldCheck size={15} style={{ color: "var(--brass)" }} />
          <span className="text-sm font-semibold">Cancellation policy</span>
        </div>
        <p className="text-[0.78rem] leading-relaxed" style={{ color: "var(--muted)" }}>
          Free reschedule or cancellation up to <strong style={{ color: "var(--parchment)" }}>24 hours</strong>{" "}
          before your game. Within 24 hours, bookings are non-refundable but can be moved once,
          subject to availability.
        </p>
        <label className="flex items-start gap-2.5 mt-3 cursor-pointer">
          <input
            type="checkbox"
            className="demo-check mt-0.5"
            checked={policyAccepted}
            data-tour="booking-policy"
            onChange={(e) => setPolicyAccepted(e.target.checked)}
          />
          <span className="text-[0.8rem]" style={{ color: "var(--parchment)" }}>
            I&apos;ve read and accept the cancellation policy.
          </span>
        </label>
      </div>

      <button
        type="submit"
        disabled={!valid}
        data-tour="booking-contact-next"
        className="demo-btn demo-btn-primary w-full mt-5 py-3"
      >
        Continue to payment
        <ChevronRight size={18} />
      </button>
      {!policyAccepted && contactValid && (
        <p className="text-[0.7rem] mt-2 text-center" style={{ color: "var(--muted-2)" }}>
          Please accept the cancellation policy to continue.
        </p>
      )}
    </form>
  );
}

/* ===================================================================== *
 * Step 6 — Payment (honest plug-in stand-in — NO card fields)
 *
 * On a live build this is where the client's existing payment processor's
 * secure checkout takes over. Rather than fake card fields, we show a polished,
 * deliberate placeholder — the same intentional-frame treatment as our photo
 * slots — so the prospect understands exactly what plugs in here.
 * ===================================================================== */
function PaymentStep({ onPay }: { onPay: () => void }) {
  return (
    <div className="demo-pop" data-tour="booking-step-payment">
      <h3 className="font-display text-lg" style={{ color: "var(--parchment)" }}>
        Payment
      </h3>
      <p className="text-sm mt-1 mb-4" style={{ color: "var(--muted)" }}>
        This is the only part we don&apos;t mock up — because it&apos;s already yours.
      </p>

      {/* Intentional plug-in stand-in — deliberate, on-brand, never looks broken */}
      <div
        className="demo-slot demo-payment-slot p-6 sm:p-7 text-center"
        data-tour="booking-payment-plugin"
      >
        <span className="relative z-[1] flex flex-col items-center">
          <span className="demo-payment-badge">
            <Plug size={22} strokeWidth={1.5} aria-hidden />
          </span>
          <span className="font-display text-lg mt-4" style={{ color: "var(--parchment)" }}>
            Secure payment plugs in here.
          </span>
          <span
            className="text-[0.83rem] leading-relaxed mt-2 max-w-sm"
            style={{ color: "var(--muted)" }}
          >
            On your live site, this is your existing payment processor&apos;s secure checkout
            (Stripe, Square, or whatever your booking platform uses). We hand off to it — we never
            store or touch card details.
          </span>
          <span
            className="inline-flex items-center gap-1.5 text-[0.72rem] mt-4"
            style={{ color: "var(--muted-2)" }}
          >
            <Lock size={12} aria-hidden />
            Card details never reach this demo.
          </span>
        </span>
      </div>

      <button
        type="button"
        onClick={onPay}
        data-tour="booking-pay"
        className="demo-btn demo-btn-primary w-full mt-5 py-3"
      >
        Complete demo booking
        <ChevronRight size={18} />
      </button>
      <p className="text-[0.7rem] mt-2 text-center" style={{ color: "var(--muted-2)" }}>
        Demo only — no card is entered and nothing is charged.
      </p>
    </div>
  );
}

/* ===================================================================== *
 * Confirmation
 * ===================================================================== */
function DoneStep({
  room,
  date,
  time,
  players,
  quote: q,
  contact,
  onClose,
}: {
  room: Room;
  date: Date;
  time: string;
  players: number;
  quote: Quote;
  contact: Contact;
  onClose: () => void;
}) {
  const code = confirmationCode(`${room.slug}|${date.toDateString()}|${time}|${players}|${contact.email}`);
  const firstName = contact.name.trim().split(" ")[0];

  return (
    <div className="demo-pop" data-tour="booking-done">
      <div className="text-center">
        <div
          className="mx-auto mb-4 h-16 w-16 rounded-full flex items-center justify-center"
          style={{ background: "var(--accent-soft)", border: "1px solid var(--accent)" }}
        >
          <Check size={30} style={{ color: "var(--brass-bright)" }} />
        </div>
        <h3 className="font-display text-2xl" style={{ color: "var(--parchment)" }}>
          You&apos;re booked{firstName ? `, ${firstName}` : ""}!
        </h3>
        <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>
          A confirmation and your digital waiver are on the way to{" "}
          <span style={{ color: "var(--parchment)" }}>{contact.email || "your inbox"}</span>.
        </p>
        <div className="demo-conf-code mt-4">
          Confirmation <strong>{code}</strong>
        </div>
      </div>

      {/* Booking summary */}
      <div className="demo-card p-4 mt-5 text-left text-sm grid gap-2">
        <Row label="Room" value={room.name} />
        <Row label="When" value={`${prettyDate(date)} · ${time}`} />
        <Row label="Players" value={`${players}`} />
        <Row label="Paid" value={money(q.total)} accent />
        <Row label="Where" value={`${venue.address.line1}, ${venue.address.city}`} />
      </div>

      {/* What to expect */}
      <div className="demo-card p-4 mt-3">
        <div className="flex items-center gap-2 mb-2" style={{ color: "var(--parchment)" }}>
          <Clock size={15} style={{ color: "var(--brass)" }} />
          <span className="text-sm font-semibold">What to expect</span>
        </div>
        <ul className="grid gap-1.5 text-[0.82rem]" style={{ color: "var(--muted)" }}>
          <li>· Arrive <strong style={{ color: "var(--parchment)" }}>15 minutes early</strong> for a quick briefing.</li>
          <li>· Your game runs exactly {room.durationMin} minutes — the clock is real.</li>
          <li>· Reschedule free up to 24 hours before. {room.ageNote}.</li>
        </ul>
      </div>

      {/* Leaderboard / passport hook */}
      <div className="demo-card p-4 mt-3 flex items-center gap-3" style={{ borderColor: "var(--brass)" }}>
        <Trophy size={22} style={{ color: "var(--brass-bright)" }} className="shrink-0" />
        <div className="min-w-0 flex-1">
          <div className="text-sm font-semibold" style={{ color: "var(--parchment)" }}>
            Beat the clock? Stamp your passport.
          </div>
          <div className="text-[0.78rem]" style={{ color: "var(--muted)" }}>
            Escape {room.name} and log your time on the Wall of Fame.
          </div>
        </div>
        <Link
          href="/demo/leaderboard"
          onClick={onClose}
          className="demo-btn demo-btn-ghost px-3 py-2 text-sm shrink-0"
          data-tour="booking-leaderboard-link"
        >
          See it
        </Link>
      </div>

      <p className="text-[0.7rem] mt-3 text-center" style={{ color: "var(--muted-2)" }}>
        Demo only — no card was charged and no real reservation was made.
      </p>

      {/* The Porada offer — shown to the owner right after they've felt the flow. */}
      <OwnerPreview />

      <button onClick={onClose} className="demo-btn demo-btn-ghost w-full mt-5 py-3">
        Close
      </button>
    </div>
  );
}

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex justify-between gap-4">
      <span style={{ color: "var(--muted)" }}>{label}</span>
      <span
        className={accent ? "font-display" : ""}
        style={{ color: accent ? "var(--brass-bright)" : "var(--parchment)", textAlign: "right" }}
      >
        {value}
      </span>
    </div>
  );
}
