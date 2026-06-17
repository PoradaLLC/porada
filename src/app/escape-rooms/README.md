# Escape-room landing page (`/escape-rooms`)

A single, conversion-focused landing page targeting **independent escape-room
operators**. It sells one thing: trusting Porada to build and run their
**website and digital presence**. The page *demonstrates* the craft by being an
escape-room-style site itself, and captures the operator as a lead by offering a
free, hand-built preview of their venue.

It is a **self-contained module** — its own dark theme (`escape-room.css`), its
own nav/footer, and a portable demo (`components/escape-room/demo/`). It does
not touch the main cream "Atlas" marketing theme.

Live at `/escape-rooms`.

---

## Phase 1 research → design decisions

**Methodology note (honest):** outbound web access (WebSearch / fetch / curl)
was **blocked in the build environment**, so live per-venue crawls weren't
possible this run. The findings below are synthesized from the well-documented,
highly consistent failure patterns of the small-independent escape-room segment
(Wix/Squarespace/Weebly sites running FareHarbor/Bookeo/Resova widgets) and map
directly to the brief's checklist. They're framed as aggregate category problems
— **no real venue is named, shown, or disparaged.** Re-run with web access
enabled to attach hard per-site evidence (URLs, Lighthouse scores, screenshots).

| # | Recurring mistake (typical independent escape-room site) | We fix it by… | Where on the page |
|---|---|---|---|
| 1 | No single, obvious, always-visible "Book now" path | One primary CTA everywhere + a sticky CTA that follows scroll | Hero, `EscapeNav`, `StickyCta` |
| 2 | Bolted-on third-party booking widget that clashes & breaks immersion | On-brand booking that lives *inside* the site | Demo booking screen, Feature 01, Before/After "Booking step" tab |
| 3 | Pricing hidden until deep in the funnel | Price shown up front (per-player + live total before any date picker) | Demo room/booking, room stat strip |
| 4 | Missing decision facts: group size, age, difficulty, duration | A stat strip on every room (players / ages / difficulty / time / price) | `StatStrip` in demo, Before/After room tab |
| 5 | Slow load, heavy unoptimized images, no mobile optimization | Mobile-first, flat & fast, no gradient soup; image placeholders flagged for `next/image` | Whole page; `TODO`s in `demoData.ts` |
| 6 | Weak/spoiler-y room pages | Atmospheric, spoiler-free room detail pages that sell the experience | Demo room detail, Before/After room tab |
| 7 | Dated/default template design, clashing fonts, low contrast | Bespoke immersive dark system, one display serif + one mono, accessible contrast | `escape-room.css` |
| 8 | No trust signals (reviews, real team, social proof) | Trust strip + "small registered studio with shipped work" + guarantee | Hero trust strip, `WhyUs`, `EscapeFooter` |
| 9 | No FAQ / no pre-booking logistics | Decision facts surfaced inline; guarantee answers the biggest risk question | Stat strips, `WhyUs` (see TODO to add a full FAQ) |
| 10 | Revenue features hidden/missing (gift cards, corporate, groups) | Gift cards + corporate funnel given first-class feature billing | `Features` 05–06, `DigitalMenu` |
| 11 | Poor/absent local SEO & Google Business Profile | Local SEO called out as a feature; `LocalBusiness`-style data in footer | `Features` 09, `EscapeFooter`, layout metadata |
| 12 | No above-the-fold contact/logistics | Real NAP + tap-to-call in footer; outcome-framed trust strip in hero | Hero, `EscapeFooter` |
| 13 | No reason to return (no leaderboard/accounts/loyalty) | Hosted leaderboard + accounts + completionist passport | Demo post-game, `Features` 02–04 |
| 14 | Confusing multi-room / multi-page navigation | Clean rooms grid front-and-center; clear in-demo nav | Demo home, Before/After homepage tab |
| 15 | Vague CTA copy / contact-form-only dead ends | Consistent action CTA ("Book now" / "Get my free preview"); a real two-step capture form | Throughout; `PreviewForm` |

Two guiding principles from the brief are baked in:
- **Proof before pitch** — the visitor sees and interacts with the demo,
  before/after, and leaderboard *before* any feature list or ask. None of the
  proof is gated behind the form.
- **Every feature is paired with its business outcome** — see the differentiator
  list in `Mechanism.tsx`, where each capability states what it does for the
  owner's bottom line.

---

## Page structure

A clean conversion architecture — each section does **one job**, in order:
**1 Hero** (relevance) → **2 Mechanism** (the single show-then-tell section) →
mid-page CTA → **3 WhyUs** (confidence) → **4 PreviewForm** (action). The three
former feature passes (snippet grid + the 01–11 feature cards + the standalone
"full digital menu") are consolidated into the one Mechanism section.

```
src/app/escape-rooms/
  layout.tsx          # wraps page in `.er-root`, imports the scoped theme, sets metadata
  escape-room.css     # the entire dark theme — scoped under .er-root, never leaks
  page.tsx            # composes the conversion sections in order
  README.md           # this file

src/components/escape-room/
  EscapeNav.tsx       # minimal dark nav, single CTA
  Hero.tsx            # §1 relevance — one-line subhead + stat row reinforcement
  Mechanism.tsx       # §2 the ONE mechanism section: carousel (show) + illustrative
                      #    proof + compact differentiator list (tell) + quiet "later" aside
  WhyUs.tsx           # §3 trust + guarantee + how-we-build-it reassurance + pricing/timeline
  PreviewForm.tsx     # §4 high-contrast free-preview capture band               [client]
  EscapeFooter.tsx    # Porada branding + links to real shipped work
  StickyCta.tsx       # persistent "Get my free preview" corner pill             [client]
  ScrollReveal.tsx    # renders nothing; arms [data-reveal] scroll motion        [client]
  demo/
    demoData.ts       # fictional "The Vault" rooms + seed leaderboard + snippet data (Supabase-shaped)
    DemoCarousel.tsx  # §2a one large real frame at a time + swipeable thumbnail strip [client]
    VaultDemo.tsx     # standalone interactive demo (not mounted on this page)
```

### The mechanism section (§2) — show, then tell, once
The page used to do the features job three times. It now does it once:

- **Show — `DemoCarousel.tsx` (§2a):** five **real static frames lifted from the
  live `/demo`** (room card → room page → booking step → leaderboard → payment
  stand-in) presented as a carousel — one large frame at a time with a sliding
  track, a swipeable/clickable thumbnail strip, prev/next arrows, and a one-line
  caption. Numbers mirror the real demo's featured room ("The Vault"); copy/data
  live in `demoData.ts`, presentation in `DemoCarousel.tsx`. A single
  `"Explore the full demo →"` button opens the real, interactive site.
- **Proof (§2b):** 1–2 short, **clearly-illustrative** outcome lines mid-page
  (labeled as such — see guardrails), naming the mechanism behind each.
- **Tell (§2c):** a compact differentiator list — feature name + one outcome
  line, no card chrome, no numbering, no badges (reuses the `.er-menu` grid:
  3 / 2 / 1 columns) — followed by the quiet, future-tense "later" aside.

Motion is handled globally by **`ScrollReveal.tsx`**: it arms `reveal-on` on
`<html>`, then adds `.is-in` to every `[data-reveal]` as it enters the viewport
(transform/opacity only, staggered, `prefers-reduced-motion` + no-JS safe). The
carousel slide uses a transform transition gated behind
`prefers-reduced-motion: no-preference`, and the differentiator items cascade in.

### Backend (showcase vs. real)
Accounts, passport, and leaderboard are conceptually backed by our own hosted
**Supabase** DB. In this landing page they use in-memory/React state, but the
shapes in `demoData.ts` mirror the real tables (with the queries sketched in
comments) so a real backend slots straight in. The capture form maps cleanly to
the existing `leads` table (`current_website`, `contact_email`, `business_name`,
`summary`, `demo_url`).

---

## TODO placeholders to fill in

Search the module for `TODO:` — current list:

- **`demoData.ts`** — replace each room `emoji` with a real atmospheric,
  spoiler-free room photo (`next/image`, AVIF/WebP, blur placeholder); replace
  seed leaderboard rows + dates with real escape times from the operator's
  game-master/timer system once connected.
- **`VaultDemo.tsx`** — "team photo" placeholders on the post-game screen
  (upload/display real team photos).
- **`PreviewForm.tsx`** — wire form completion to a server action that inserts
  the lead into Supabase and sends a Resend confirmation (currently client-only
  + `trackEvent`). See `src/lib/email.ts` and `src/lib/supabase/server.ts`.
- **`layout.tsx`** — add a dedicated Open Graph image for this page (pattern in
  `src/app/opengraph-image.tsx`).
- **Mid-page proof** (`Mechanism.tsx` → `PROOF`) — swap the clearly-illustrative
  outcome lines for real, attributed operator quotes once the first client sites
  are live.
- **Optional, recommended next:** a dedicated FAQ block (scariness, physicality,
  accessibility, parking, lateness, group logistics) — finding #9. Not built yet
  to keep scope tight; easy to add as a new section component.

## Guardrails honored
- Demo venue ("The Vault") is **fictional** — no real name/logo/photo/copy used.
- No specific competitor is named, screenshot, or disparaged — comparisons are
  to "typical escape-room sites" in aggregate.
- No fake testimonials or invented client names — the mid-page proof lines in
  `Mechanism.tsx` are **clearly labeled illustrative** ("real operator quotes
  replace these once your first sites are live") and name the mechanism, not a
  fictional person. Trust otherwise comes from the real, registered studio and
  its real shipped work.
- Room content is atmospheric but **spoiler-free**.
- Physical/in-room/AI services are kept strictly secondary and future-tense in a
  single quiet aside (`Mechanism` → `.er-later`).
- `prefers-reduced-motion` respected; semantic HTML, keyboard-navigable slider
  and demo, focus-visible styles, alt/aria where needed.
