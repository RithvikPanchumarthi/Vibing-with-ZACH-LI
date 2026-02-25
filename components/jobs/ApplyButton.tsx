"use client";

import { applyToJob } from "@/app/actions/posting";
import ProUpgradeModal from "@/components/billing/ProUpgradeModal";
import { useState, useTransition } from "react";

export default function ApplyButton({
  seekerId,
  jobId,
}: {
  seekerId: string;
  jobId: string;
}) {
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function onApply() {
    setError(null);
    const fd = new FormData();
    fd.set("seekerId", seekerId);
    fd.set("jobId", jobId);

    startTransition(async () => {
      try {
        await applyToJob(fd);
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "Failed to apply.";
        if (msg === "DAILY_LIMIT_REACHED") {
          setUpgradeOpen(true);
          return;
        }
        setError(msg);
      }
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={onApply}
        disabled={pending}
        className={`inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-semibold transition-colors ${
          pending
            ? "cursor-not-allowed bg-white/10 text-white/50"
            : "bg-brand text-black hover:bg-brand-dark"
        }`}
      >
        {pending ? "Applying…" : "Apply"}
      </button>
      {error ? <p className="mt-2 text-sm text-red-200">{error}</p> : null}

      <ProUpgradeModal
        open={upgradeOpen}
        onClose={() => setUpgradeOpen(false)}
        userId={seekerId}
        variant="seeker"
      />
    </>
  );
}

