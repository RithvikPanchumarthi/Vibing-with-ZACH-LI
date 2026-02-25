import { Globe, Instagram, Linkedin, Twitter } from "lucide-react";
import Link from "next/link";

const groups = [
  {
    title: "Students",
    links: [
      { label: "Find jobs", href: "/jobs" },
      { label: "Find AI work", href: "/ai-work" },
      { label: "Career advice", href: "/career" },
    ],
  },
  {
    title: "WorkVibe AI",
    links: [
      { label: "Overview", href: "/ai" },
      { label: "Fellowships", href: "/ai/fellowships" },
      { label: "Research", href: "/research" },
    ],
  },
  {
    title: "Employers",
    links: [
      { label: "Hire now", href: "/hire" },
      { label: "Talent network", href: "/employers/network" },
      { label: "Pricing", href: "/pricing" },
    ],
  },
  {
    title: "Career centers",
    links: [
      { label: "Platform", href: "/career-centers" },
      { label: "Student outcomes", href: "/outcomes" },
      { label: "Partner support", href: "/support" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Press", href: "/press" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help center", href: "/help" },
      { label: "Contact", href: "/contact" },
      { label: "Privacy", href: "/privacy" },
    ],
  },
];

export default function Footer() {
  const companies = [
    "Google",
    "Microsoft",
    "Amazon",
    "Apple",
    "Meta",
    "Netflix",
    "OpenAI",
    "Stripe",
    "Salesforce",
    "NVIDIA",
  ] as const;

  return (
    <footer className="w-full bg-[#052326] px-4 pt-16 md:px-6">
      <div className="mx-auto max-w-[1400px]">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="max-w-sm text-sm text-white/70">
              © 2026 WorkVibe. Built for the future of work.
            </p>

            <div className="mt-6 flex items-center gap-3">
              <Link
                href="#"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/80 transition-colors hover:bg-white/10"
                aria-label="Twitter"
              >
                <Twitter className="h-4 w-4" />
              </Link>
              <Link
                href="#"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/80 transition-colors hover:bg-white/10"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-4 w-4" />
              </Link>
              <Link
                href="#"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/80 transition-colors hover:bg-white/10"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </Link>
              <Link
                href="#"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/80 transition-colors hover:bg-white/10"
                aria-label="Website"
              >
                <Globe className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-4 text-sm">
              <Link href="#" className="font-semibold text-[#D3FB52] hover:underline">
                Privacy
              </Link>
              <Link href="#" className="font-semibold text-[#D3FB52] hover:underline">
                Terms
              </Link>
              <Link href="#" className="font-semibold text-[#D3FB52] hover:underline">
                LinkedIn
              </Link>
            </div>
          </div>

          <div className="lg:col-span-8">
            <div className="hidden grid-cols-2 gap-6 md:grid md:grid-cols-3">
              {groups.map((g) => (
                <div key={g.title} className="space-y-3">
                  <p className="text-sm font-semibold text-cream">{g.title}</p>
                  <ul className="space-y-2">
                    {g.links.map((l) => (
                      <li key={l.label}>
                        <Link
                          href={l.href}
                          className="text-sm text-white/65 transition-colors hover:text-white"
                        >
                          {l.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="space-y-3 md:hidden">
              {groups.map((g) => (
                <details
                  key={g.title}
                  className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4"
                >
                  <summary className="cursor-pointer list-none text-sm font-semibold text-cream">
                    {g.title}
                  </summary>
                  <ul className="mt-4 space-y-2">
                    {g.links.map((l) => (
                      <li key={l.label}>
                        <Link href={l.href} className="text-sm text-white/65">
                          {l.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </details>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16 border-t border-white/10 py-14">
          <div className="mx-auto max-w-4xl text-center">
            <p
              className="wv-wordmark-glow mx-auto w-fit bg-gradient-to-r from-[#D3FB52] via-[#b9ff66] to-[#D3FB52] bg-clip-text text-5xl font-black tracking-tight text-transparent md:text-7xl"
            >
              WorkVibe
            </p>

            <p className="mt-4 text-sm font-semibold tracking-wide text-white/80 md:text-base">
              Looking forward to collaborate
            </p>

            <div className="mt-10 overflow-hidden rounded-3xl border border-white/10 bg-white/5 py-5">
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#052326] to-transparent" />
                <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#052326] to-transparent" />

                <div className="wv-marquee flex w-[200%] items-center gap-8 px-6">
                  {[...companies, ...companies].map((name, idx) => (
                    <div
                      key={`${name}-${idx}`}
                      className="flex h-10 items-center justify-center rounded-2xl border border-white/10 bg-black/15 px-6 text-sm font-semibold text-white/70"
                    >
                      {name}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <p className="mt-10 text-sm text-white/50">
              © 2026 WorkVibe. Built for the future of work.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

