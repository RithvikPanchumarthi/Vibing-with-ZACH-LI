import Link from "next/link";

export default function SignupPage() {
  return (
    <main className="mx-auto w-full max-w-[1400px] px-4 py-10 md:px-6">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-balance font-display text-5xl font-black tracking-tight text-cream md:text-7xl">
          Choose your path
        </h1>
        <p className="mt-4 text-pretty text-base text-white/70 md:text-lg">
          Create an account as a job seeker or an employer. You can upgrade
          anytime.
        </p>
      </div>

      <div className="mx-auto mt-10 grid max-w-5xl grid-cols-1 gap-4 md:grid-cols-2">
        <Link
          href="/signup/seeker"
          className="group rounded-3xl border border-white/10 bg-surface-card p-8 transition-colors hover:bg-[#22232e]"
        >
          <p className="text-xs font-semibold tracking-wide text-white/60">
            Job seeker
          </p>
          <h2 className="mt-3 text-2xl font-black tracking-tight text-cream">
            Find your next role
          </h2>
          <p className="mt-3 text-sm text-white/65">
            Build a profile, showcase skills, and apply to roles across WorkVibe.
          </p>
          <p className="mt-6 text-sm font-semibold text-brand">
            Continue →
          </p>
        </Link>

        <Link
          href="/signup/employer"
          className="group rounded-3xl border border-white/10 bg-surface-card p-8 transition-colors hover:bg-[#22232e]"
        >
          <p className="text-xs font-semibold tracking-wide text-white/60">
            Employer
          </p>
          <h2 className="mt-3 text-2xl font-black tracking-tight text-cream">
            Hire great talent
          </h2>
          <p className="mt-3 text-sm text-white/65">
            Create your company profile and post your first role in minutes.
          </p>
          <p className="mt-6 text-sm font-semibold text-brand">
            Continue →
          </p>
        </Link>
      </div>
    </main>
  );
}

