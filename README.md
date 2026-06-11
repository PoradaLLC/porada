# porada

> B2B consulting / agency site for Porada Solutions, with an AI pitch generator wired into the admin dashboard.

## What this is

Porada is the public-facing website and lightweight CRM for Porada Solutions. The marketing surface lists services, testimonials, and a blog; the admin surface is a leads inbox plus a Claude-powered pitch generator that drafts outbound copy for an inbound lead.

The codebase was forked from [`forteca-poc`](https://github.com/PoradaLLC/forteca-poc) (see commit history: "Rebrand Sierra-117 to Porada") and slimmed down — it shares the same `formula/` template (see [Formula doc](https://github.com/PoradaLLC/docs/blob/main/src/content/docs/repos/formula.md)) but drops bookings, payments, calendars, and image hosting. If you need a property-engine flavor of this site, look at `forteca-poc`; if you need a marketing-only flavor, look at `forteca-cleaning`.

## Tech stack

- **Framework:** Next.js 16.2.3 (App Router), React 19.2.4, TypeScript 5
- **Styling:** Tailwind CSS 4 (PostCSS-based, no config file)
- **Data:** Supabase (Postgres, 4 migrations: base schema, leads, demo URL, job status)
- **Auth:** Supabase Auth (admin-only)
- **AI:** `@anthropic-ai/sdk` for the admin pitch generator
- **Forms:** react-hook-form + Zod
- **Icons:** Lucide React
- **Deploy:** Vercel (empty `vercel.json` — defaults are fine)

> **Heads-up:** Next.js 16 has breaking changes from earlier versions — see `AGENTS.md` and consult `node_modules/next/dist/docs/` before relying on remembered APIs.

## Quick start

```sh
npm install
npm run dev   # http://localhost:3000
```

Required environment variables (drop into `.env.local`):

```sh
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SECRET_KEY=
ANTHROPIC_API_KEY=          # required only for /admin pitch generator
```

Supabase migrations live in `supabase/migrations/`; apply them with the Supabase CLI (`supabase db push`) against a project linked via `supabase link`.

## Repo layout

```
src/
  app/
    (marketing)/      # public pages (home, services, testimonials, blog)
    (legacy)/         # old routes kept for redirects
    admin/            # auth-gated dashboard: leads + AI pitch generator
    payment/          # legacy payment routes
    api/
      booking/        # legacy booking endpoint
      contact/        # contact form submissions
  components/
    layout/           # Header, Footer
    property/         # leftover from the real-estate fork
  lib/
    supabase/         # browser, server, middleware clients
    email.ts
    validators.ts
formula/              # 10-file LLM template — see Formula doc
supabase/
  migrations/         # 4 migrations
```

## Common commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Next dev server on port 3000 |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |

There are no tests in this repo.

## Deployment

Vercel auto-builds on push to `main`. The project's Vercel settings hold the env vars listed above. `vercel.json` is intentionally empty — no cron jobs, no redirects, no special headers.

## Related

- [`forteca-poc`](https://github.com/PoradaLLC/forteca-poc) — the parent repo this was forked from; full booking platform.
- [`forteca-cleaning`](https://github.com/PoradaLLC/forteca-cleaning) — sister marketing site with the same `formula/` template.
- [`docs`](https://github.com/PoradaLLC/docs) — the engineering documentation portal that pulls this README in.

## Operational notes

- The admin pitch generator hits the Anthropic API with each request; there is no caching layer in place. Watch usage if leads volume picks up.
- Migrations evolved with the rebrand — the `(legacy)` route group and `payment/` directory are tombstones from the property-engine days. Don't add new code there; delete on a future cleanup pass.
