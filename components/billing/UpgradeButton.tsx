import { createCheckoutSession } from "@/app/actions/billing";

export function UpgradeButton({ userId }: { userId: string }) {
  return (
    <form action={createCheckoutSession} className="space-y-3">
      <input type="hidden" name="userId" value={userId} />
      <button
        type="submit"
        className="w-full rounded-2xl bg-brand px-5 py-3 text-sm font-semibold text-black transition-colors hover:bg-brand-dark"
      >
        Upgrade to Premium
      </button>
    </form>
  );
}

