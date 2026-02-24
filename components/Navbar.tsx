import Link from "next/link";

const navLinks = [
  { label: "Find a job", href: "/jobs" },
  { label: "Hire now", href: "/hire" },
  { label: "Workvibe Events", href: "/events" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  return (
    <header className="w-full px-6 py-4">
      <nav className="relative mx-auto flex max-w-[1400px] items-center justify-between">
        <Link href="/" className="text-2xl font-bold italic text-brand">
          WorkVibe
        </Link>

        <ul className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                className="text-sm text-white/70 transition-colors hover:text-white"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="rounded-lg border border-white/20 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-white/5"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="rounded-lg bg-brand px-5 py-2 text-sm font-semibold text-black transition-colors hover:bg-brand-dark"
          >
            Sign up
          </Link>
        </div>
      </nav>
    </header>
  );
}
