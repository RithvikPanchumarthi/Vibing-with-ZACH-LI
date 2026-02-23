# skills.md — Development Standards & Patterns

## Agent Skills (Cursor)

Installed into `~/.cursor/skills/`:
- `clone-anywebsite` (web cloning playbook)
- `create-skill` (scaffold new skills)
- `posthog-analytics` (PostHog dashboard automation)

Usage (in Cursor chat):
- Run `/clone-anywebsite` (or `/create-skill`, `/posthog-analytics`)
- If they don’t appear yet, restart Cursor once after installation.

## Tailwind CSS v4 Rules
- Use `@import "tailwindcss"` in `globals.css` (not `@tailwind` directives)
- PostCSS plugin: `@tailwindcss/postcss` (not `tailwindcss` directly)
- Use Tailwind utility classes exclusively — no custom CSS unless absolutely necessary
- Responsive: mobile-first with `sm:`, `md:`, `lg:`, `xl:` breakpoints
- Dark mode: use `dark:` variant when applicable

## Component Patterns

### Server vs. Client Components
```
Server Component (default):
- No state, no effects, no browser APIs
- Can be async, can fetch data directly
- Better performance, smaller bundle

Client Component ("use client"):
- Needs useState, useEffect, event handlers
- Needs browser APIs (window, document)
- Needs Framer Motion animations
```

### File Naming
- Components: `PascalCase.tsx` (e.g., `HeroSection.tsx`)
- Utilities: `camelCase.ts` (e.g., `formatDate.ts`)
- Pages: `page.tsx` inside route folders
- Layouts: `layout.tsx` inside route folders

## Framer Motion Standards
- Use `motion.div` (not `motion("div")`)
- Stagger children with `staggerChildren` in parent variants
- Entry animations: `initial`, `animate`, `whileInView`
- Hover/tap: `whileHover`, `whileTap`
- Keep durations between 0.3s–0.8s for UI elements
- Use `ease: [0.25, 0.46, 0.45, 0.94]` for smooth easing

## Typography Scale
- Hero headline: `text-5xl md:text-7xl font-bold tracking-tight`
- Section headline: `text-3xl md:text-5xl font-bold`
- Subheadline: `text-lg md:text-xl text-gray-600`
- Body: `text-base text-gray-700`
- Caption: `text-sm text-gray-500`

## Color Palette (Tailwind defaults + custom)
- Primary actions: `bg-blue-600 hover:bg-blue-700 text-white`
- Secondary actions: `bg-gray-100 hover:bg-gray-200 text-gray-900`
- Backgrounds: `bg-white`, `bg-gray-50`, `bg-gray-100`
- Text: `text-gray-900` (headings), `text-gray-600` (body), `text-gray-500` (muted)

## Next.js Image Rules
- Always use `next/image` component
- Provide `width` + `height` for known dimensions
- Use `fill` + `sizes` for responsive/unknown dimensions
- Configure remote domains in `next.config.mjs` `images.remotePatterns`
- Use `priority` on above-the-fold images (Hero, LCP)

## Performance Guidelines
- Lazy load below-the-fold sections with `whileInView`
- Minimize `"use client"` — keep interactive islands small
- Use `next/dynamic` for heavy client components
- Optimize images: WebP/AVIF, proper sizing, `sizes` attribute

## Accessibility
- Semantic HTML: `<main>`, `<section>`, `<nav>`, `<article>`
- All images need `alt` text
- Interactive elements need focus states
- Color contrast: WCAG AA minimum (4.5:1 for text)
- Keyboard navigation support on all interactive elements

## Testing Checklist
- [ ] No TypeScript errors (`npx tsc --noEmit`)
- [ ] Dev server runs without warnings
- [ ] Responsive at 375px, 768px, 1024px, 1440px
- [ ] Animations smooth at 60fps
- [ ] Images load with proper dimensions
- [ ] No layout shift (CLS) on page load
