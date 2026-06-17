/**
 * Demo data for the fictional venue "The Vault".
 *
 * This venue, its rooms, and the leaderboard are entirely invented — no real
 * escape room's name, branding, photos, or records are used (see build brief
 * guardrails).
 *
 * In this landing-page showcase the leaderboard + booking run on in-memory /
 * React state. In a real client build these are backed by our own hosted
 * Supabase database, so the operator owns the customer list and the
 * leaderboard instead of renting it from a booking platform. The shapes below
 * mirror what those tables would look like, so a real backend slots straight in:
 *
 *   // supabase: leaderboard
 *   // select rank() over (partition by room_id order by seconds asc), team_name, seconds, played_on
 *   //   from runs where room_id = $1 order by seconds asc limit 10;
 *
 *   // supabase: reservations
 *   // insert into reservations (room_id, date, time, players, contact_email) values (...)
 */

export type Room = {
  id: string;
  name: string;
  /** one-line, spoiler-free atmosphere hook */
  tagline: string;
  /** atmospheric, spoiler-free description — sells the experience, never the puzzle */
  blurb: string;
  emoji: string; // TODO: replace each emoji placeholder with a real atmospheric room photo (next/image, AVIF/WebP, blur placeholder)
  minPlayers: number;
  maxPlayers: number;
  minAge: number;
  difficulty: 1 | 2 | 3 | 4 | 5;
  durationMin: number;
  pricePerPlayer: number;
  /** decorative gradient so each room reads distinctly without a real photo */
  art: string;
};

export const ROOMS: Room[] = [
  {
    id: "the-vault",
    name: "The Vault",
    tagline: "Sixty minutes. One locked door. Everything you came for is on the other side.",
    blurb:
      "A decommissioned bank, a tip-off, and a closing window. You and your crew talk your way past the last line of security before the morning shift clocks in. Tense, tactile, and built for teams who like to split up and shout findings across the room.",
    emoji: "🔐",
    minPlayers: 2,
    maxPlayers: 6,
    minAge: 12,
    difficulty: 4,
    durationMin: 60,
    pricePerPlayer: 34,
    art: "linear-gradient(150deg, #3a2a16, #120d08 70%)",
  },
  {
    id: "the-lighthouse",
    name: "The Lighthouse",
    tagline: "The keeper vanished. The lamp is still turning. Find out why before the fog rolls in.",
    blurb:
      "A storm-battered lighthouse off a coast that lost three ships last winter. Atmospheric and story-led — more eerie than scary — with a slow-build reveal that rewards teams who read everything and trust each other.",
    emoji: "🗼",
    minPlayers: 2,
    maxPlayers: 5,
    minAge: 10,
    difficulty: 3,
    durationMin: 60,
    pricePerPlayer: 32,
    art: "linear-gradient(150deg, #16303a, #0a1014 70%)",
  },
  {
    id: "midnight-express",
    name: "Midnight Express",
    tagline: "A night train, a missing passenger, and the next station is the end of the line.",
    blurb:
      "Boarded under cover of dark, your carriage is rolling toward a stop nobody is supposed to reach. Fast-paced and physical-light, designed for bigger groups and first-timers who want a win they earn.",
    emoji: "🚂",
    minPlayers: 3,
    maxPlayers: 8,
    minAge: 8,
    difficulty: 2,
    durationMin: 60,
    pricePerPlayer: 30,
    art: "linear-gradient(150deg, #2a1630, #100a14 70%)",
  },
];

export type LeaderboardEntry = {
  team: string;
  seconds: number;
  /** ISO date string — TODO: real runs carry the actual played date from your game-master tool */
  playedOn: string;
  you?: boolean;
};

/** Seed records per room. TODO: replace with real escape times pulled from the
 * operator's game-master / timer system once connected. */
export const SEED_LEADERBOARD: Record<string, LeaderboardEntry[]> = {
  "the-vault": [
    { team: "The Keymasters", seconds: 41 * 60 + 12, playedOn: "2026-05-30" },
    { team: "Vault Raiders", seconds: 44 * 60 + 5, playedOn: "2026-06-02" },
    { team: "Lockpicks Anonymous", seconds: 47 * 60 + 38, playedOn: "2026-05-18" },
    { team: "The Combination", seconds: 49 * 60 + 51, playedOn: "2026-06-09" },
    { team: "Safe & Sound", seconds: 52 * 60 + 9, playedOn: "2026-06-11" },
  ],
  "the-lighthouse": [
    { team: "Fog Walkers", seconds: 43 * 60 + 30, playedOn: "2026-05-22" },
    { team: "The Keepers", seconds: 46 * 60 + 14, playedOn: "2026-06-01" },
    { team: "Saltwater Six", seconds: 48 * 60 + 2, playedOn: "2026-06-07" },
    { team: "North Beacon", seconds: 51 * 60 + 40, playedOn: "2026-06-10" },
  ],
  "midnight-express": [
    { team: "Track Stars", seconds: 38 * 60 + 44, playedOn: "2026-05-28" },
    { team: "The Conductors", seconds: 40 * 60 + 19, playedOn: "2026-06-03" },
    { team: "Last Carriage", seconds: 42 * 60 + 56, playedOn: "2026-06-08" },
    { team: "Night Owls", seconds: 45 * 60 + 11, playedOn: "2026-06-12" },
  ],
};

export function formatTime(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = Math.round(totalSeconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function difficultyLabel(d: number): string {
  return ["", "Gentle", "Easy", "Moderate", "Hard", "Brutal"][d] ?? "Moderate";
}

/** Next 5 days as selectable booking dates, computed at render time on the client. */
export function nextDates(count = 5): { iso: string; label: string }[] {
  const out: { iso: string; label: string }[] = [];
  const today = new Date();
  for (let i = 1; i <= count; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    out.push({
      iso: d.toISOString().slice(0, 10),
      label: d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }),
    });
  }
  return out;
}

export const TIME_SLOTS = ["4:30 PM", "6:00 PM", "7:30 PM", "9:00 PM"];

/* ---------------------------------------------------------------------------
 * Annotated demo snippets (§2 of the landing page).
 *
 * These are the DATA behind the static, lightly-annotated frames lifted from the
 * real Lantern & Lock demo at /demo — so a visitor sees actual product, and what
 * they see here matches what they find when they click "Explore the full demo".
 * Presentation lives in <DemoSnippets/>; copy/numbers live here. Values mirror
 * the live demo's featured room ("The Vault") and its leaderboard.
 * ------------------------------------------------------------------------- */

/** The featured room as it reads on the real demo's card + detail pages. */
export const SNIPPET_ROOM = {
  name: "The Vault",
  tagline: "Sixty minutes to crack the city’s oldest safe — before the night guard’s round.",
  difficulty: 4, // out of 5
  players: "2–6",
  durationMin: 60,
  pricePerPerson: 36,
  rating: 4.9,
  escapeRate: 27, // percent
  bestTime: "05:38",
  award: "Most booked",
  /** heist-room accent gradient, matching the demo's per-room art. */
  art: "linear-gradient(155deg, #2b2113, #14100a 72%)",
} as const;

/** Top of the per-room leaderboard for The Vault (escape time, fastest first). */
export const SNIPPET_BOARD: { team: string; time: string }[] = [
  { team: "The Inside Job", time: "54:10" },
  { team: "Five Finger Discount", time: "56:07" },
  { team: "Safe & Sound", time: "58:02" },
];

/** One callout per snippet: a kicker (what screen) + a one-line "why it matters". */
export type SnippetKind = "roomcard" | "booking" | "detail" | "leaderboard" | "payment";
export const SNIPPET_CALLOUTS: Record<SnippetKind, { tag: string; label: string }> = {
  roomcard: { tag: "Room card", label: "Atmospheric and scannable — the click that starts a booking." },
  booking: { tag: "Booking", label: "Lives inside your site — no third-party popup, no jarring handoff." },
  detail: { tag: "Room page", label: "Sells the experience and books the slot on one screen." },
  leaderboard: { tag: "Leaderboard", label: "The come-back hook most escape-room sites don’t have." },
  payment: { tag: "Checkout", label: "Hands off to your processor — we never touch card details." },
};
