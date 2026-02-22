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
