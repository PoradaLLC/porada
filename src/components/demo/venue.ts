/**
 * Lantern & Lock Escape Co. — single shared CONTENT module for the demo venue.
 *
 * ONE source of truth for venue copy, rooms, ratings, reviews, leaderboard, gift/group
 * copy, and the demo account. Presentation reads from here. The dated "before" version
 * (next prompt) reuses this SAME data, so keep DATA here and PRESENTATION in components.
 *
 * The venue is fictional; the four rooms are themed after the most recognizable
 * escape-room genres (heist, prison break, space station, Egyptian tomb). No real
 * venue's name, copy, branding, or imagery is reused. Room copy is spoiler-free.
 *
 * MEDIA: there are no photo URLs here on purpose. Every image slot in the UI is an
 * intentional, on-brand empty placeholder (see <PhotoSlot/>), so a prospect imagines
 * their OWN photos there. `gallery` holds the captions/hints for those empty frames.
 */

export type RoomSlug =
  | "the-vault"
  | "cell-block-d"
  | "drift-station"
  | "tomb-of-anketh";

export interface Room {
  slug: RoomSlug;
  name: string;
  /** One-line hook for cards. */
  tagline: string;
  /** Three star-meter ratings, 1..5 (the Escaparium room-card pattern). */
  difficulty: number;
  physical: number;
  scare: number;
  /** Human label for the difficulty, shown on the detail page. */
  difficultyLabel: string;
  durationMin: number;
  players: { min: number; max: number };
  pricePerPerson: number;
  ageNote: string;
  /** Replayability framing — a memorable success stat + the record to chase. */
  escapeRate: number; // percent
  bestTime: string; // mm:ss
  /** Spoiler-free narrative — sells atmosphere, reveals nothing. */
  blurb: string[];
  whatToExpect: string[];
  /** Honest physical / sensory notes, like the good real sites surface. */
  notes: string[];
  /** Theme accent for subtle per-room atmosphere (NOT used for CTAs — those use one accent). */
  accent: string;
  accentSoft: string;
  /** The featured room carries an original award/social-proof badge on the home page. */
  featured?: boolean;
  award?: string;
  /** Caption/hint shown inside each empty photo placeholder for this room's gallery. */
  gallery: string[];
}

export interface Review {
  name: string;
  rating: number; // 1..5
  room: string;
  quote: string;
  date: string;
}

export interface LeaderboardRow {
  team: string;
  room: RoomSlug;
  /** seconds remaining on the clock when they escaped (higher = faster escape). */
  timeRemaining: number;
  date: string;
}

/** A stamp in the completionist passport for the (fake) signed-in account. */
export interface PassportStamp {
  room: RoomSlug;
  clearedOn: string;
  bestTime: string; // mm:ss they escaped in
}

export const venue = {
  name: "Lantern & Lock",
  fullName: "Lantern & Lock Escape Co.",
  tagline: "Four doors. Sixty minutes. One way out.",
  blurb:
    "Four hand-built escape rooms in the Old Mill District — a bank vault, a cell block, a failing space station, and a pharaoh's tomb. Private games only; you'll never be paired with strangers. Book online in under a minute.",
  address: {
    line1: "218 Marrow Street",
    line2: "Old Mill District",
    city: "Harbor City",
    region: "OR",
    zip: "97000",
  },
  phone: "(555) 014-7720",
  email: "hello@lanternandlock.example",
  hours: [
    { days: "Mon – Thu", time: "3:00pm – 10:00pm" },
    { days: "Fri", time: "2:00pm – 11:30pm" },
    { days: "Sat", time: "10:00am – 11:30pm" },
    { days: "Sun", time: "10:00am – 9:00pm" },
  ],
  social: { instagram: "@lanternandlock", facebook: "/lanternandlock", tiktok: "@lanternandlock" },
  stats: {
    reviews: "1,900+",
    rating: "4.9",
    playersEscaped: "38,000+",
    award: "Voted Harbor City's Best — 2025",
  },
  /** Short brand story for the home-page About block. */
  about: {
    eyebrow: "Our story",
    title: "Built by hand, in an old mill, by people who love a good lock",
    body: [
      "Lantern & Lock started in a single rented unit on Marrow Street, where two friends built a bank-vault set out of plywood, salvaged brass, and stubbornness. People kept coming back, so we kept building doors.",
      "Today we design, build, and host all four rooms ourselves — every prop, every clue, every late-timed hint in your earpiece. No franchise kit, no stranger pairing, no off-the-shelf puzzles. Just four worlds we're a little obsessed with, waiting for your crew.",
    ],
    teamHint: "Your team photo here",
  },
  /** Gift-card copy — never-expire framing (retention). */
  giftCard: {
    eyebrow: "Gift cards",
    title: "Give an hour they'll talk about for years",
    body: "Redeemable on any room, any time, for any size group. Delivered by email in seconds — and they never expire.",
    denominations: [60, 100, 150, 220],
    artHint: "Your gift-card art here",
  },
  /** Group / corporate copy (kept light). */
  groups: {
    eyebrow: "Groups & events",
    title: "Team offsites, birthdays & private buyouts",
    body:
      "Run side-by-side rooms for a head-to-head team battle, or take the whole place for up to 28 players. We handle the catering hand-off, the scoreboard, and the bragging rights.",
    bullets: [
      "Head-to-head: two crews, two rooms, one winner",
      "Private buyout for up to 28 players",
      "Corporate offsites, birthdays & bachelor(ette) parties",
    ],
  },
  /** Newsletter / email-capture copy (retention). */
  newsletter: {
    title: "New rooms drop a few times a year",
    body: "Join the list for early-access booking, members-only times, and the occasional puzzle in your inbox.",
  },
} as const;

/**
 * Primary nav. The polished site collapses everything behind a single persistent
 * "Book" CTA (rendered separately in the nav) plus a sign-in entry.
 */
export const navLinks: { label: string; href: string; tour?: string }[] = [
  { label: "Rooms", href: "/demo#rooms", tour: "nav-rooms" },
  { label: "Leaderboard", href: "/demo/leaderboard", tour: "nav-leaderboard" },
  { label: "Gift Cards", href: "/demo/gift-cards", tour: "nav-gift" },
  { label: "Groups", href: "/demo#groups", tour: "nav-groups" },
];

export const rooms: Room[] = [
  {
    slug: "the-vault",
    name: "The Vault",
    tagline: "Sixty minutes to crack the city's oldest safe — before the night guard's round.",
    difficulty: 4,
    physical: 2,
    scare: 1,
    difficultyLabel: "Challenging",
    durationMin: 60,
    players: { min: 2, max: 6 },
    pricePerPerson: 36,
    ageNote: "Ages 12+",
    escapeRate: 27,
    bestTime: "05:38",
    blurb: [
      "The Meridian Trust has stood on the corner of Marrow Street since 1911, and in all that time no one has opened the manager's safe without the manager. Tonight, the manager is conveniently out of town — and you have the run of the floor until the watchman finishes his rounds.",
      "Read the ledgers, work the dials, and trip the old time-lock in the right order. Get the door open, get what's inside, and be gone before the brass clock over the lobby strikes the hour.",
    ],
    whatToExpect: [
      "A slick, satisfying heist built on combination locks, hidden mechanisms, and clever misdirection.",
      "Rewards methodical teams who split up and work the room in parallel.",
      "A real 'we actually pulled it off' ending when the vault swings open.",
    ],
    notes: [
      "No crawling. Some reaching and fine-motor work on the dials.",
      "A short stretch of dramatic low light midway through.",
    ],
    accent: "#e2b24a",
    accentSoft: "rgba(226,178,74,0.16)",
    gallery: ["The vault door", "The time-lock", "Inside the vault", "The deposit cage"],
  },
  {
    slug: "cell-block-d",
    name: "Cell Block D",
    tagline: "The lights drop at lockdown. You've got one hour to clear the wall before the count.",
    difficulty: 3,
    physical: 3,
    scare: 2,
    difficultyLabel: "Moderate",
    durationMin: 60,
    players: { min: 2, max: 8 },
    pricePerPerson: 34,
    ageNote: "Ages 10+ — under 12 must play with an adult",
    escapeRate: 44,
    bestTime: "07:12",
    blurb: [
      "Lights-out on D-Block. The guard who owed you a favor just walked off shift, and a sympathetic trustee left exactly one thing out of place. From the bunk to the yard fence, every escape that ever worked here is hidden in plain sight.",
      "Pop the cell, cross the catwalk, and make the wall before the next count — when a single empty bunk brings the whole block down on you. Our most popular first game, and the one most teams come back to beat.",
    ],
    whatToExpect: [
      "A classic, crowd-pleasing prison break — our most welcoming room for first-timers and big groups.",
      "Hands-on searching and teamwork over fiendish logic; everyone finds something to do.",
      "A genuine sprint of a finale once the wall is in sight.",
    ],
    notes: [
      "Some bending, reaching, and a low step-through. Nothing strenuous.",
      "Brief moments of low light, never total darkness. No scares.",
    ],
    accent: "#8fa6bd",
    accentSoft: "rgba(143,166,189,0.16)",
    gallery: ["D-Block corridor", "Cell 14", "The catwalk", "The yard gate"],
  },
  {
    slug: "drift-station",
    name: "Drift Station",
    tagline: "Station Kepler is losing air and tumbling toward the dark. Reboot the core before life support fails.",
    difficulty: 5,
    physical: 2,
    scare: 3,
    difficultyLabel: "Expert",
    durationMin: 60,
    players: { min: 2, max: 6 },
    pricePerPerson: 38,
    ageNote: "Ages 12+",
    escapeRate: 18,
    bestTime: "02:44",
    featured: true,
    award: "Winner — Golden Lantern Award, Best New Room 2025",
    blurb: [
      "A micrometeor tore through Research Station Kepler an hour ago. The crew is gone, the reactor is in a slow shutdown, and the station has started to spin — every minute, a little more air, a little more heat, a little more light bleeds out into space.",
      "Work the airlock, the cryo deck, and the observation ring to bring the core back online and steady the station before the countdown reaches zero. Our hardest, most technical game — the lowest escape rate we run.",
    ],
    whatToExpect: [
      "A tense, immersive sci-fi story with layered, interlocking puzzles for experienced teams.",
      "Real built-in technology — switches that throw, panels that light, systems that respond.",
      "The lowest escape rate of any room here. Bring your sharpest crew.",
    ],
    notes: [
      "Low, colored lighting throughout and a few dramatic blackout beats.",
      "Atmospheric sound and effects; tense, but no live actors and no gore.",
      "Some reaching; no crawling required.",
    ],
    accent: "#4cc4d6",
    accentSoft: "rgba(76,196,214,0.16)",
    gallery: ["The airlock", "Cryo deck", "Reactor core", "Observation ring"],
  },
  {
    slug: "tomb-of-anketh",
    name: "Tomb of Anketh",
    tagline: "The boy-king's tomb sealed three thousand years ago. You woke it. Find the way out before the sand fills the door.",
    difficulty: 2,
    physical: 2,
    scare: 1,
    difficultyLabel: "Easy",
    durationMin: 60,
    players: { min: 2, max: 8 },
    pricePerPerson: 32,
    ageNote: "Ages 7+ — all ages welcome",
    escapeRate: 63,
    bestTime: "10:05",
    blurb: [
      "Generations of explorers searched for the lost tomb of Anketh, the boy-king buried with a secret his priests swore would never be found. Your expedition just did — and the moment the last torch was lit, the great stone door ground shut behind you.",
      "Read the painted walls, follow the old gods through the burial chamber, and find the pharaoh's hidden way out before the sand timer runs dry. Bright, adventurous, and full of delightful surprises — our favorite for families and first-timers.",
    ],
    whatToExpect: [
      "A warm, story-rich adventure that rewards reading and curiosity over brute force.",
      "Hands-on, discovery-driven puzzles kids and grown-ups solve side by side — zero scares.",
      "Our highest success rate. A guaranteed good time for mixed-age groups.",
    ],
    notes: [
      "Warmly lit throughout. No crawling, no scares, no strobe.",
      "Step stools provided so younger explorers can reach everything.",
    ],
    accent: "#d98a4a",
    accentSoft: "rgba(217,138,74,0.16)",
    gallery: ["The painted stair", "Burial chamber", "The sealed door", "Mask of Anketh"],
  },
];

export function getRoom(slug: string): Room | undefined {
  return rooms.find((r) => r.slug === slug);
}

export function roomName(slug: RoomSlug): string {
  return getRoom(slug)?.name ?? slug;
}

export const featuredRoom: Room = rooms.find((r) => r.featured) ?? rooms[0];

export const reviews: Review[] = [
  {
    name: "Marisol D.",
    rating: 5,
    room: "Drift Station",
    quote:
      "Genuinely the most immersive hour I've spent indoors. The set looks unreal — switches actually work, the whole station 'fails' around you. Our gamemaster's hints were perfectly timed. We did NOT make it out. We're already rebooking.",
    date: "May 2026",
  },
  {
    name: "Theo & the design team",
    rating: 5,
    room: "The Vault",
    quote:
      "Booked it for a work outing and it was the best team thing we've done. Slick puzzles, zero dead time, and when the vault door actually swung open the whole room cheered. Booking took me about forty seconds on my phone.",
    date: "Apr 2026",
  },
  {
    name: "The Okonkwo family",
    rating: 5,
    room: "Tomb of Anketh",
    quote:
      "Our 8-year-old is still talking about the hidden door in the tomb. Bright, friendly, and the staff were so good with the kids. We'll be back to try the prison break next.",
    date: "Jun 2026",
  },
  {
    name: "Priya R.",
    rating: 5,
    room: "Cell Block D",
    quote:
      "Beautiful set, real storytelling — you can tell it's hand-built and not some kit. We cleared the wall with ninety seconds to spare and high-fived total strangers in the lobby. Perfect first escape room.",
    date: "May 2026",
  },
  {
    name: "Dani K.",
    rating: 5,
    room: "Drift Station",
    quote:
      "I'm not usually into sci-fi and I was completely hooked. Tense in the best way — the lights drop, the alarms go, and you forget it's a Tuesday in Harbor City. The finale got an actual gasp out of me.",
    date: "Mar 2026",
  },
  {
    name: "Coach Whitman",
    rating: 5,
    room: "Cell Block D",
    quote:
      "Brought the whole varsity squad across two rooms. Easy to book the group, clear pricing, and they handled 14 teenagers like pros. Highly recommend for any team.",
    date: "Feb 2026",
  },
];

/**
 * Pre-booking FAQ. Answers the questions a real player asks before they commit —
 * difficulty/scariness, age, privacy, accessibility, lateness, and the big
 * reassurance ("can we leave?"). Presentation lives in <Faq/>; copy lives here.
 */
export const faqs: { q: string; a: string }[] = [
  {
    q: "Is the door really locked? Can we leave if someone gets uncomfortable?",
    a: "You are never locked in. The door is always openable from the inside, and you can step out for a break or leave entirely at any moment — no questions asked. Your gamemaster is watching the whole time and is one button away if you need anything.",
  },
  {
    q: "Are the rooms wheelchair accessible?",
    a: "Our lobby, restrooms, and three of our four rooms (The Vault, Cell Block D, and Tomb of Anketh) are step-free and wheelchair accessible. Drift Station has a low step-through into one area. Tell us about any mobility needs when you book and we'll make sure your game works for everyone in your group.",
  },
  {
    q: "I'm a little claustrophobic — will I be okay?",
    a: "None of our rooms are cramped or pitch-black. Spaces are open enough to move around freely, and any low-light moments are brief and never total darkness. Because you can leave at any time and your gamemaster can raise the lights on request, most nervous players do completely fine. If in doubt, call us and we'll talk you through the room.",
  },
  {
    q: "How scary are the rooms?",
    a: "Most of our rooms aren't scary at all — every room shows a 1–5 \"Scare\" meter so there are no surprises. The Vault and Tomb of Anketh have zero scares and are great for kids and nervous first-timers. We never use live actors, gore, or jump-scares in any room.",
  },
  {
    q: "Can kids play? Do under-18s need an adult?",
    a: "Yes — Tomb of Anketh welcomes ages 7+, and it's a family favorite. Each room lists its own minimum age. Players under 16 should have an adult in the group; under-12s must play with a participating adult. For teen birthday groups, give us a call and we'll sort out supervision.",
  },
  {
    q: "Is the game private, or will we be paired with strangers?",
    a: "Every game is 100% private. It's only ever your group in the room — we never add strangers to fill seats. The per-person price covers your whole crew for the full hour.",
  },
  {
    q: "What if we arrive late?",
    a: "Please arrive 15 minutes before your start time. The clock is tied to the schedule, so if you're running late we'll give you as much of your hour as we can before the next booking — but we can't always run the full 60 minutes. If you're going to be more than 10 minutes late, call us and we'll do our best to help.",
  },
  {
    q: "What's your cancellation and reschedule policy?",
    a: "Free reschedule or cancellation up to 24 hours before your game. Within 24 hours, bookings are non-refundable but can be moved once, subject to availability.",
  },
  {
    q: "What should we bring, and where do we put our stuff?",
    a: "Just yourselves — no special clothing or equipment needed. Wear comfortable shoes. We have free lockers in the lobby for bags, coats, and phones (no phones in the room, but your gamemaster takes a team photo at the end).",
  },
  {
    q: "What happens if we don't escape in time?",
    a: "You won't be left hanging. If the clock runs out, your gamemaster walks you through the puzzles you didn't reach so you always see how the story ends — and you'll know exactly how close you came. Plenty of teams come straight back to settle the score.",
  },
  {
    q: "Where do we park?",
    a: "There's a free lot behind the building on Marrow Street, plus street parking out front. We're a short walk from the Old Mill District transit stop, and rideshare drops you right at the door.",
  },
];

/** Seeded leaderboard. timeRemaining = seconds left on the 60:00 clock at escape. */
export const leaderboardSeed: LeaderboardRow[] = [
  { team: "Zero-G Heroes", room: "drift-station", timeRemaining: 191, date: "Jun 14, 2026" },
  { team: "The Vacuum", room: "drift-station", timeRemaining: 96, date: "May 30, 2026" },
  { team: "Last Orbit", room: "drift-station", timeRemaining: 42, date: "Jun 02, 2026" },
  { team: "The Inside Job", room: "the-vault", timeRemaining: 350, date: "Jun 09, 2026" },
  { team: "Five Finger Discount", room: "the-vault", timeRemaining: 233, date: "May 21, 2026" },
  { team: "Safe & Sound", room: "the-vault", timeRemaining: 118, date: "Jun 11, 2026" },
  { team: "The Lifers", room: "cell-block-d", timeRemaining: 522, date: "Jun 12, 2026" },
  { team: "Cell Mates", room: "cell-block-d", timeRemaining: 308, date: "May 18, 2026" },
  { team: "Parole Now", room: "cell-block-d", timeRemaining: 144, date: "Jun 07, 2026" },
  { team: "Curse Breakers", room: "tomb-of-anketh", timeRemaining: 687, date: "Jun 13, 2026" },
  { team: "The Sandkings", room: "tomb-of-anketh", timeRemaining: 540, date: "May 25, 2026" },
  { team: "Junior Explorers", room: "tomb-of-anketh", timeRemaining: 399, date: "Jun 01, 2026" },
];

/**
 * The (fake) signed-in account used to demo retention features: a completionist
 * passport (which rooms you've cleared) and a gift-card balance. In-memory only.
 */
export const demoAccount = {
  name: "Alex Rivera",
  email: "alex@example.com",
  giftBalance: 50,
  passport: [
    { room: "tomb-of-anketh", clearedOn: "May 2026", bestTime: "12:40" },
    { room: "cell-block-d", clearedOn: "Jun 2026", bestTime: "09:15" },
  ] satisfies PassportStamp[],
} as const;

/** Format seconds-remaining as the escape time (e.g. 191 -> "56:49 escape"). */
export function escapeClock(timeRemaining: number, totalMin = 60): string {
  const used = totalMin * 60 - timeRemaining;
  const m = Math.floor(used / 60);
  const s = used % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
