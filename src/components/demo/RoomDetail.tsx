import Link from "next/link";
import {
  ArrowLeft,
  CalendarClock,
  Car,
  Clock,
  MapPin,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  TriangleAlert,
  Trophy,
  Users,
} from "lucide-react";
import { rooms, reviews, venue, type Room } from "./venue";
import { BookButton } from "./BookButton";
import { PhotoSlot, RoomMeters, Stars } from "./bits";

function Spec({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center text-center gap-1 px-2 py-3">
      <Icon size={18} style={{ color: "var(--brass)" }} />
      <div className="text-[0.66rem] uppercase tracking-wide" style={{ color: "var(--muted)" }}>
        {label}
      </div>
      <div className="text-sm font-medium" style={{ color: "var(--parchment)" }}>
        {value}
      </div>
    </div>
  );
}

export function RoomDetail({ room }: { room: Room }) {
  const roomReviews = reviews.filter((r) => r.room === room.name).slice(0, 2);
  const related = rooms.filter((r) => r.slug !== room.slug).slice(0, 3);

  return (
    <div
      style={{ ["--accent" as string]: room.accent, ["--accent-soft" as string]: room.accentSoft }}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-6">
        <Link
          href="/demo#rooms"
          className="inline-flex items-center gap-1.5 text-sm"
          style={{ color: "var(--muted)" }}
        >
          <ArrowLeft size={15} /> All rooms
        </Link>
      </div>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 pt-6 grid gap-8 lg:grid-cols-[1.4fr_1fr] items-start">
        <div>
          <PhotoSlot
            label="Your hero photo"
            hint={room.name}
            iconSize={24}
            className="aspect-[16/10] rounded-2xl"
          >
            {room.award && (
              <span
                className="absolute top-4 left-4 z-10 demo-pill"
                style={{ color: "var(--brass-bright)", borderColor: "var(--brass)", background: "rgba(0,0,0,0.5)" }}
              >
                <Trophy size={12} /> Award winner
              </span>
            )}
          </PhotoSlot>

          {/* Gallery — four more empty frames */}
          <div className="mt-3 grid grid-cols-4 gap-3">
            {room.gallery.map((caption) => (
              <PhotoSlot key={caption} label="Photo" hint={caption} iconSize={14} className="aspect-square rounded-lg" />
            ))}
          </div>
        </div>

        {/* Sticky booking rail */}
        <div className="lg:sticky lg:top-20">
          <h1 className="font-display text-3xl sm:text-4xl leading-tight" style={{ color: "var(--parchment)" }}>
            {room.name}
          </h1>
          <p className="mt-2 text-base" style={{ color: "var(--muted)" }}>
            {room.tagline}
          </p>

          {/* Three rating meters (carried in from the card) */}
          <div className="demo-card mt-5 p-4">
            <RoomMeters room={room} size={14} />
          </div>

          <div className="demo-card mt-3 grid grid-cols-3 divide-x" style={{ borderColor: "var(--line)" }}>
            <Spec icon={Clock} label="Duration" value={`${room.durationMin} min`} />
            <Spec icon={Users} label="Players" value={`${room.players.min}–${room.players.max}`} />
            <Spec icon={ShieldCheck} label="Ages" value={room.ageNote.replace(/^Ages\s*/, "").split(" ")[0]} />
          </div>

          <div className="mt-4 flex items-end justify-between">
            <div>
              <div className="font-display text-3xl" style={{ color: "var(--brass-bright)" }}>
                ${room.pricePerPerson}
              </div>
              <div className="text-xs" style={{ color: "var(--muted)" }}>
                per person · private room
              </div>
            </div>
            <div className="text-right text-xs" style={{ color: "var(--muted)" }}>
              {room.difficultyLabel}
            </div>
          </div>

          <BookButton room={room.slug} className="w-full mt-5 py-3.5 text-base" tour="book-room" withIcon>
            Book this room
          </BookButton>

          <div className="mt-4 grid gap-2 text-xs" style={{ color: "var(--muted)" }}>
            <span className="flex items-center gap-2">
              <ShieldCheck size={14} style={{ color: "var(--brass)" }} /> {room.ageNote}
            </span>
            <span className="flex items-center gap-2">
              <Trophy size={14} style={{ color: "var(--brass)" }} /> {room.escapeRate}% of teams escape · record {room.bestTime}
            </span>
          </div>
        </div>
      </section>

      {/* Story + what to expect */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-14 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <h2 className="font-display text-2xl" style={{ color: "var(--parchment)" }}>
            The story
          </h2>
          <div className="mt-4 grid gap-4">
            {room.blurb.map((p, i) => (
              <p key={i} className="text-base leading-relaxed" style={{ color: "var(--muted)" }}>
                {p}
              </p>
            ))}
          </div>

          <h3 className="font-display text-xl mt-10" style={{ color: "var(--parchment)" }}>
            What to expect
          </h3>
          <ul className="mt-4 grid gap-3">
            {room.whatToExpect.map((w) => (
              <li key={w} className="flex gap-3 text-sm" style={{ color: "var(--muted)" }}>
                <Sparkles size={16} className="shrink-0 mt-0.5" style={{ color: "var(--brass)" }} />
                {w}
              </li>
            ))}
          </ul>

          {/* Replayability — come back and beat your time */}
          <div
            className="demo-card mt-8 p-5 flex items-start gap-3"
            style={{ backgroundImage: "radial-gradient(120% 100% at 0% 0%, var(--glow), transparent 55%)" }}
          >
            <RotateCcw size={20} className="shrink-0 mt-0.5" style={{ color: "var(--brass-bright)" }} />
            <div>
              <h4 className="font-display text-lg" style={{ color: "var(--parchment)" }}>
                Escaped already? Come back and beat your time.
              </h4>
              <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
                Only <span style={{ color: "var(--brass-bright)" }}>{room.escapeRate}%</span> of teams make it out — and
                the record on {room.name} is <span style={{ color: "var(--brass-bright)" }}>{room.bestTime}</span>. Sign
                in to track your best run and stamp your passport.
              </p>
              <Link
                href="/demo/leaderboard"
                className="mt-3 inline-flex items-center gap-1.5 text-sm"
                style={{ color: "var(--brass-bright)" }}
              >
                <Trophy size={14} /> See the leaderboard
              </Link>
            </div>
          </div>
        </div>

        <aside className="grid gap-5">
          <div className="demo-card p-5">
            <h3 className="font-display text-lg flex items-center gap-2" style={{ color: "var(--parchment)" }}>
              <TriangleAlert size={16} style={{ color: "var(--brass)" }} /> Good to know
            </h3>
            <ul className="mt-3 grid gap-2.5 text-sm" style={{ color: "var(--muted)" }}>
              {room.notes.map((n) => (
                <li key={n} className="flex gap-2.5">
                  <span style={{ color: "var(--brass)" }}>•</span>
                  {n}
                </li>
              ))}
              <li className="flex gap-2.5">
                <span style={{ color: "var(--brass)" }}>•</span>
                {room.ageNote}.
              </li>
            </ul>
          </div>

          <div className="demo-card p-5">
            <h3 className="font-display text-lg flex items-center gap-2" style={{ color: "var(--parchment)" }}>
              <CalendarClock size={16} style={{ color: "var(--brass)" }} /> Before you arrive
            </h3>
            <ul className="mt-3 grid gap-2.5 text-sm" style={{ color: "var(--muted)" }}>
              <li className="flex gap-2.5">
                <MapPin size={15} className="shrink-0 mt-0.5" style={{ color: "var(--brass)" }} />
                {venue.address.line1}, {venue.address.city}, {venue.address.region}
              </li>
              <li className="flex gap-2.5">
                <Clock size={15} className="shrink-0 mt-0.5" style={{ color: "var(--brass)" }} />
                Arrive 15 minutes early to sign the waiver and get briefed.
              </li>
              <li className="flex gap-2.5">
                <Car size={15} className="shrink-0 mt-0.5" style={{ color: "var(--brass)" }} />
                Free lot parking behind the building on Marrow Street.
              </li>
            </ul>
          </div>
        </aside>
      </section>

      {/* Room reviews */}
      {roomReviews.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 sm:px-6 pb-6">
          <h2 className="font-display text-2xl mb-6" style={{ color: "var(--parchment)" }}>
            What teams said
          </h2>
          <div className="grid gap-5 sm:grid-cols-2">
            {roomReviews.map((r) => (
              <figure key={r.quote} className="demo-card p-6">
                <Stars rating={r.rating} />
                <blockquote className="mt-3 text-sm" style={{ color: "var(--parchment)" }}>
                  “{r.quote}”
                </blockquote>
                <figcaption className="mt-3 text-xs" style={{ color: "var(--muted)" }}>
                  <span style={{ color: "var(--brass)" }}>{r.name}</span> · {r.date}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}

      {/* Related rooms */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-14">
        <h2 className="font-display text-2xl mb-6" style={{ color: "var(--parchment)" }}>
          More rooms
        </h2>
        <div className="grid gap-5 sm:grid-cols-3">
          {related.map((r) => (
            <Link
              key={r.slug}
              href={`/demo/rooms/${r.slug}`}
              className="demo-card overflow-hidden group"
              style={{ ["--accent" as string]: r.accent, ["--accent-soft" as string]: r.accentSoft }}
            >
              <PhotoSlot label="Your photo" hint={r.name} iconSize={16} className="aspect-[16/9] rounded-none" />
              <div className="p-4">
                <div className="font-display text-lg" style={{ color: "var(--parchment)" }}>
                  {r.name}
                </div>
                <div className="text-xs mt-1" style={{ color: "var(--muted)" }}>
                  {r.difficultyLabel} · ${r.pricePerPerson}/person
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Final CTA band */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 pb-8">
        <div
          className="demo-card p-8 sm:p-10 text-center"
          style={{ backgroundImage: "radial-gradient(120% 100% at 50% 0%, var(--accent-soft), transparent 60%)" }}
        >
          <h2 className="font-display text-2xl sm:text-3xl" style={{ color: "var(--parchment)" }}>
            Ready for {room.name}?
          </h2>
          <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
            Private game · {room.players.min}–{room.players.max} players · ${room.pricePerPerson} each
          </p>
          <div className="mt-5 flex justify-center">
            <BookButton room={room.slug} className="px-7 py-3 text-base" withIcon>
              Book this room
            </BookButton>
          </div>
        </div>
      </section>
    </div>
  );
}
