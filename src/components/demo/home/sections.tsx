import Link from "next/link";
import { ArrowRight, ChevronDown, DoorOpen, Gift, HelpCircle, Sparkles, Trophy, Users2 } from "lucide-react";
import { faqs, featuredRoom, rooms, reviews, venue } from "../venue";
import { RoomCard } from "../RoomCard";
import { BookButton } from "../BookButton";
import { SectionHead, Stars, PhotoSlot, RoomMeters } from "../bits";

/* ---------- Hero ---------- */
export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* The single tasteful homepage motion accent — a slow breathing glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -z-10 -top-32 right-[-12%] h-[460px] w-[460px] rounded-full demo-breathe"
        style={{ background: "radial-gradient(circle, var(--glow), transparent 65%)" }}
      />
      <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-12 pb-16 sm:pt-16 sm:pb-20 grid gap-10 lg:grid-cols-2 lg:items-center">
        <div className="max-w-xl">
          <div className="demo-pill mb-5" style={{ color: "var(--brass-bright)", borderColor: "var(--brass)" }}>
            <Sparkles size={13} /> {venue.stats.award}
          </div>
          <h1 className="font-display text-4xl sm:text-6xl leading-[1.05]" style={{ color: "var(--parchment)" }}>
            {venue.tagline}
          </h1>
          <p className="mt-5 text-lg" style={{ color: "var(--muted)" }}>
            {venue.blurb}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <BookButton className="px-6 py-3 text-base" tour="hero-book" withIcon>
              Book now
            </BookButton>
            <Link href="#rooms" className="demo-btn demo-btn-ghost px-6 py-3 text-base">
              <DoorOpen size={18} /> Explore the rooms
            </Link>
          </div>
          <div className="mt-7 flex items-center gap-3 text-sm" style={{ color: "var(--muted)" }}>
            <Stars rating={5} />
            <span>
              <span style={{ color: "var(--parchment)" }}>{venue.stats.rating}</span> from {venue.stats.reviews} reviews
            </span>
          </div>
        </div>

        <PhotoSlot
          label="Your hero photo"
          hint="A cinematic shot of your best room"
          iconSize={26}
          className="aspect-[4/3] rounded-2xl"
        />
      </div>
    </section>
  );
}

/* ---------- Stat band (social proof) ---------- */
export function StatBand() {
  const stats = [
    { value: venue.stats.reviews, label: "5-star reviews" },
    { value: venue.stats.playersEscaped, label: "players hosted" },
    { value: "4", label: "hand-built rooms" },
    { value: "100%", label: "private games" },
  ];
  return (
    <section className="border-y" style={{ borderColor: "var(--line)", background: "var(--ink-800)" }}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 grid grid-cols-2 sm:grid-cols-4 gap-6">
        {stats.map((s) => (
          <div key={s.label} className="text-center">
            <div className="font-display text-3xl sm:text-4xl" style={{ color: "var(--brass-bright)" }}>
              {s.value}
            </div>
            <div className="mt-1 text-xs uppercase tracking-wide" style={{ color: "var(--muted)" }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------- Featured room spotlight (award / social-proof badge) ---------- */
export function Spotlight() {
  const room = featuredRoom;
  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6 py-20">
      <div
        className="grid gap-8 lg:grid-cols-2 items-center"
        style={{ ["--accent" as string]: room.accent, ["--accent-soft" as string]: room.accentSoft }}
      >
        <PhotoSlot
          label="Your featured-room photo"
          hint={room.name}
          iconSize={24}
          className="aspect-video rounded-2xl"
        >
          {room.award && (
            <span
              className="absolute bottom-4 left-4 z-10 demo-pill"
              style={{ color: "var(--brass-bright)", borderColor: "var(--brass)", background: "rgba(0,0,0,0.55)" }}
            >
              <Trophy size={12} /> {room.award}
            </span>
          )}
        </PhotoSlot>

        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.18em] mb-3" style={{ color: "var(--brass)" }}>
            Featured room
          </div>
          <h2 className="font-display text-3xl sm:text-4xl" style={{ color: "var(--parchment)" }}>
            {room.name}
          </h2>
          <p className="mt-3 text-lg" style={{ color: "var(--muted)" }}>
            {room.tagline}
          </p>
          <p className="mt-4 text-sm" style={{ color: "var(--muted)" }}>
            Our hardest, most atmospheric game — only{" "}
            <span style={{ color: "var(--brass-bright)" }}>{room.escapeRate}% of teams make it out</span>. Bring your
            sharpest crew.
          </p>

          <div className="demo-card mt-5 p-4 max-w-xs">
            <RoomMeters room={room} size={14} />
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <BookButton room={room.slug} className="px-5 py-2.5">
              Book {room.name}
            </BookButton>
            <Link href={`/demo/rooms/${room.slug}`} className="demo-btn demo-btn-ghost px-5 py-2.5">
              Room details
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Rooms grid ---------- */
export function RoomsGrid() {
  return (
    <section id="rooms" className="mx-auto max-w-6xl px-4 sm:px-6 py-20 scroll-mt-20">
      <SectionHead
        eyebrow="Choose your door"
        title="Four rooms. Pick your hour."
        lede="Every game is a private, hand-built set with a live gamemaster watching your back."
      />
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {rooms.map((r) => (
          <RoomCard key={r.slug} room={r} />
        ))}
      </div>
    </section>
  );
}

/* ---------- About / brand story ---------- */
export function About() {
  return (
    <section
      id="about"
      className="border-y scroll-mt-20"
      style={{ borderColor: "var(--line)", background: "var(--ink-800)" }}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-20 grid gap-10 lg:grid-cols-2 items-center">
        <PhotoSlot
          label="Your team photo"
          hint={venue.about.teamHint}
          iconSize={24}
          className="aspect-[4/3] rounded-2xl"
        />
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.18em] mb-3" style={{ color: "var(--brass)" }}>
            {venue.about.eyebrow}
          </div>
          <h2 className="font-display text-3xl sm:text-4xl leading-tight" style={{ color: "var(--parchment)" }}>
            {venue.about.title}
          </h2>
          <div className="mt-4 grid gap-4">
            {venue.about.body.map((p) => (
              <p key={p} className="text-base leading-relaxed" style={{ color: "var(--muted)" }}>
                {p}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Reviews strip ---------- */
export function ReviewsStrip() {
  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6 py-20">
      <SectionHead
        eyebrow="What players say"
        title={`${venue.stats.rating} stars from ${venue.stats.reviews} reviews`}
      />
      <div className="mt-10 flex gap-5 overflow-x-auto pb-4 demo-scroll snap-x">
        {reviews.map((r) => (
          <figure
            key={r.name + r.quote}
            className="demo-card p-6 min-w-[280px] max-w-[340px] snap-start shrink-0 flex flex-col"
          >
            <Stars rating={r.rating} />
            <blockquote className="mt-3 text-sm flex-1" style={{ color: "var(--parchment)" }}>
              “{r.quote}”
            </blockquote>
            <figcaption className="mt-4 text-xs" style={{ color: "var(--muted)" }}>
              <span style={{ color: "var(--brass)" }}>{r.name}</span> · {r.room} · {r.date}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

/* ---------- Groups + Gift cards teasers ---------- */
export function GroupsAndGifts() {
  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6 pb-4 grid gap-6 md:grid-cols-2">
      <div id="groups" className="demo-card p-8 scroll-mt-20" data-tour="groups">
        <Users2 size={26} style={{ color: "var(--brass)" }} />
        <h3 className="font-display text-2xl mt-3" style={{ color: "var(--parchment)" }}>
          {venue.groups.title}
        </h3>
        <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
          {venue.groups.body}
        </p>
        <ul className="mt-4 grid gap-2 text-sm" style={{ color: "var(--muted)" }}>
          {venue.groups.bullets.map((b) => (
            <li key={b} className="flex gap-2.5">
              <span style={{ color: "var(--brass)" }}>•</span>
              {b}
            </li>
          ))}
        </ul>
        <div className="mt-5">
          <BookButton variant="ghost" className="px-5 py-2.5 text-sm">
            Plan a group game
          </BookButton>
        </div>
      </div>

      <div id="gift-cards" className="demo-card overflow-hidden flex flex-col scroll-mt-20" data-tour="gift-cards">
        <PhotoSlot label="Your gift-card art" hint={venue.giftCard.artHint} className="aspect-[16/7] rounded-none" />
        <div className="p-8">
          <Gift size={26} style={{ color: "var(--brass)" }} />
          <h3 className="font-display text-2xl mt-3" style={{ color: "var(--parchment)" }}>
            {venue.giftCard.title}
          </h3>
          <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
            {venue.giftCard.body}
          </p>
          <div className="mt-5">
            <Link href="/demo/gift-cards" className="demo-btn demo-btn-ghost px-5 py-2.5 text-sm" data-tour="gift-cta">
              Buy a gift card <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- FAQ ---------- */
export function Faq() {
  return (
    <section id="faq" className="mx-auto max-w-3xl px-4 sm:px-6 py-20 scroll-mt-20">
      <div className="text-center">
        <HelpCircle size={28} style={{ color: "var(--brass-bright)" }} className="mx-auto" />
        <h2 className="font-display text-3xl sm:text-4xl mt-3" style={{ color: "var(--parchment)" }}>
          Good to know before you book
        </h2>
        <p className="mt-3 text-base" style={{ color: "var(--muted)" }}>
          The questions we hear most — difficulty, kids, accessibility, parking, and what happens if
          you don&apos;t make it out.
        </p>
      </div>

      <div className="mt-10 grid gap-3">
        {faqs.map((item) => (
          <details key={item.q} className="demo-faq-item">
            <summary>
              <span className="demo-faq-q">{item.q}</span>
              <ChevronDown size={18} className="demo-faq-chevron" aria-hidden />
            </summary>
            <p className="demo-faq-a">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

/* ---------- Leaderboard teaser ---------- */
export function LeaderboardTeaser() {
  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
      <div
        className="demo-card p-8 text-center"
        style={{ backgroundImage: "radial-gradient(120% 100% at 50% 0%, var(--glow), transparent 60%)" }}
      >
        <Trophy size={28} style={{ color: "var(--brass-bright)" }} className="mx-auto" />
        <h3 className="font-display text-2xl mt-3" style={{ color: "var(--parchment)" }}>
          Think you&apos;re fast?
        </h3>
        <p className="mt-2 text-sm max-w-xl mx-auto" style={{ color: "var(--muted)" }}>
          Escape the clock and your team lands on the wall of fame. See where the quickest crews in Harbor City stand.
        </p>
        <Link href="/demo/leaderboard" className="demo-btn demo-btn-primary px-6 py-3 mt-5 inline-flex">
          <Trophy size={16} /> View the leaderboard
        </Link>
      </div>
    </section>
  );
}
