import { UpgradeButton } from "@/components/billing/UpgradeButton";
import Link from "next/link";

type Props = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function SignupSuccessPage({ searchParams }: Props) {
  const params = (await searchParams) ?? {};
  const userId = typeof params.userId === "string" ? params.userId : null;

  return (
    <main className="mx-auto w-full max-w-[1400px] px-4 py-14 md:px-6">
      <div className="mx-auto max-w-2xl rounded-3xl border border-white/10 bg-surface-card p-8">
        <p className="text-xs font-semibold tracking-wide text-white/60">
          Welcome to WorkVibe
        </p>
        <h1 className="mt-3 text-balance font-display text-4xl font-black tracking-tight text-cream md:text-5xl">
          You&apos;re in.
        </h1>
        <p className="mt-4 text-pretty text-sm text-white/65 md:text-base">
          Your account is created. Upgrade anytime to unlock higher daily limits.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-3 md:grid-cols-2">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-black/20 px-5 py-3 text-sm font-semibold text-white/85 hover:bg-black/30"
          >
            Back to home
          </Link>
          {userId ? (
            <UpgradeButton userId={userId} />
          ) : (
            <div className="rounded-2xl border border-white/10 bg-black/20 px-5 py-3 text-sm text-white/60">
              Missing `userId` — complete onboarding first.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

