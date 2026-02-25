# WorkVibe ✨
**The High-Fidelity Matching Engine for the 2026 Talent Economy**

WorkVibe is a Next.js 15 SaaS built for the DataExpert.io Vibe Coding Challenge. It replaces outdated keyword searches with a weighted "Vibe Match" algorithm that quantifies professional compatibility.

## 🚀 Live Demo
**URL:** [https://workvibe.vercel.app](https://workvibe.vercel.app)

## 🧠 The Matching Engine (Core Innovation)
Unlike traditional job boards, WorkVibe uses a weighted scoring system based on a **5-10-5 Skill Hierarchy**:
- **High Confidence (5 skills):** Weighted at 100% for compatibility.
- **Moderate (10 skills):** Weighted at 60% for compatibility.
- **Aware (5 skills):** Weighted at 20% for compatibility.

This ensures Employers see candidates who are actually proficient in "Required" skills rather than just mentioning them.

## 🛠️ The "Brain Dead" Stack
- **Framework:** Next.js 15 (App Router) for high-performance server-side rendering.
- **Database:** Supabase (PostgreSQL) + Prisma ORM for relational integrity.
- **Auth:** Supabase Auth (Email/Password + GitHub OAuth integration).
- **Payments:** Stripe (Webhooks for instant 'isPremium' user flag updates).
- **Styling:** Tailwind CSS + Framer Motion (Infinite Logo Marquee & Dynamic Match Badges).

## 💰 SaaS Features
- **Usage Guard:** Free tier limited to 1 post/application to drive conversion.
- **Employer Spotlight:** Premium job listings are automatically sorted to the top of the feed using PostgreSQL indexing.
- **AI Integration:** Structured output logic for automated skill extraction (PDF Parsing).

## 🏎️ Environment Setup
To run locally:
1. Clone the repo and run `npm install`.
2. Sync the database: `npx prisma db push`.
3. Start the dev server: `npm run dev`.
