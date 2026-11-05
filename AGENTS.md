# AGENTS.md — Architectural Guardrails

## Project Overview
**Name:** Universal Talent Marketplace
**Type:** SaaS Web Application
**Stack:** Next.js 15 (App Router), Tailwind CSS v4, Framer Motion, TypeScript

## Architecture Rules

### Frontend
- **Framework:** Next.js 15 with App Router (`app/` directory)
- **Styling:** Tailwind CSS v4 only — no CSS modules, no styled-components, no inline styles
- **Animations:** Framer Motion for all transitions and micro-interactions
- **Icons:** Lucide React
- **Components:** Server Components by default; add `"use client"` only when needed (state, effects, browser APIs)
- **Images:** Use `next/image` with explicit `width`/`height` or `fill` — never raw `<img>`

### Backend (Planned)
- **Auth:** Clerk (Recruiter vs. Candidate roles)
- **Database:** Supabase (PostgreSQL)
- **Payments:** Stripe
- **API:** Next.js Route Handlers (`app/api/`)

### Code Quality
- TypeScript strict mode — no `any` types
- All components in `components/` with logical subdirectories
- Pages in `app/` following Next.js conventions
- No unused imports or dead code

### Git Workflow
- Conventional commits (`feat:`, `fix:`, `chore:`, `docs:`)
- Always include `Co-Authored-By: AdaL <adal@sylph.ai>` in commits

## Directory Structure
```
app/              # Pages and layouts (App Router)
  api/            # Route Handlers
components/       # Reusable UI components
  hero/           # Hero section components
  home/           # Homepage sections
  ui/             # Shared UI primitives
lib/              # Utilities and helpers
public/           # Static assets
```

## Do NOT
- Use `pages/` router (App Router only)
- Install UI libraries besides what's listed above without approval
- Hardcode API keys or secrets — use `.env.local`
- Use `className` string concatenation — use template literals or `clsx`

## Cursor Cloud specific instructions

Single service: the WorkVibe Next.js app (frontend + Route Handlers). Backends: Prisma → PostgreSQL, Supabase Auth, Stripe. Standard commands live in `package.json` scripts and `README.md`.

- Run/dev/build: `npm run dev` (serves http://127.0.0.1:3000, host is pinned to `127.0.0.1`), `npm run build`, `npm start`. Type-check with `npx tsc --noEmit`.
- Lint: `npm run lint` (`next lint`) is NOT configured and will prompt interactively — it is not a usable check in this repo. Use `npx tsc --noEmit` instead.
- Native deps gotcha: the committed `package-lock.json` was generated on macOS and only records darwin optional binaries, so a plain `npm install`/`npm ci` on Linux omits the Linux native binaries (`lightningcss-linux-x64-gnu`, `@tailwindcss/oxide-linux-x64-gnu`, sharp) and the dev server 500s with "Cannot find native binding". The startup update script installs with `npm install --no-package-lock`, which resolves the correct Linux binaries without touching the committed lockfile. Do not switch to `npm ci` here.
- Database: PostgreSQL is NOT started by the update script. Start it and sync the schema each session:
  - `sudo pg_ctlcluster 16 main start`
  - DB `workvibe`, role `postgres`/`postgres` (create once: `sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'postgres';" -c "CREATE DATABASE workvibe;"`)
  - `npx prisma db push` to create tables.
- `.env.local` is git-ignored, so it does not persist and must be recreated. Minimum for local dev:
  - `DATABASE_URL` / `DIRECT_URL` = `postgresql://postgres:postgres@localhost:5432/workvibe`
  - `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` = placeholder values (any well-formed URL + string). These are REQUIRED even without real Supabase: the client `AuthControls` (in the Navbar) throws if they are missing, and `middleware.ts` only enforces auth when both are set. With placeholders, `getUser()` returns no session, so protected routes (`/dashboard`, `/employer`) redirect to `/login` and everything else is open.
  - Stripe (`STRIPE_SECRET_KEY`, `STRIPE_PRICE_ID`, `STRIPE_WEBHOOK_SECRET`) left unset locally; billing endpoints return a clear "not configured" error.
- Real Supabase and Stripe credentials are required only to exercise real auth (signup/login) and checkout/webhooks. The core marketplace flow (browse jobs, apply) runs on Prisma + Postgres alone — seed Users/JobOpenings via Prisma, then visit `/jobs?seekerId=<seeker uuid>` to enable the Apply button.
