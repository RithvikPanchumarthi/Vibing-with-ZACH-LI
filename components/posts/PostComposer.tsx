"use client";

import ProUpgradeModal from "@/components/billing/ProUpgradeModal";
import { submitPost } from "@/app/actions/posting";
import { useState, useTransition } from "react";

export default function PostComposer({ userId }: { userId: string }) {
  const [content, setContent] = useState("");
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function onSubmit() {
    setError(null);
    const fd = new FormData();
    fd.set("userId", userId);
    fd.set("content", content);

    startTransition(async () => {
      try {
        await submitPost(fd);
        setContent("");
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "Failed to post.";
        if (msg === "DAILY_LIMIT_REACHED") {
          setUpgradeOpen(true);
          return;
        }
        setError(msg);
      }
    });
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-surface-card p-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-wide text-white/60">Post</p>
          <h3 className="mt-2 text-xl font-black tracking-tight text-cream">
            Share an update
          </h3>
        </div>
      </div>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={4}
        placeholder="What are you working on today?"
        className="mt-4 w-full resize-none rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none focus:border-white/20"
      />

      {error ? (
        <p className="mt-3 text-sm text-red-200">{error}</p>
      ) : null}

      <button
        type="button"
        onClick={onSubmit}
        disabled={pending || content.trim().length === 0}
        className={`mt-4 w-full rounded-2xl px-5 py-3 text-sm font-semibold transition-colors ${
          pending || content.trim().length === 0
            ? "cursor-not-allowed bg-white/10 text-white/50"
            : "bg-brand text-black hover:bg-brand-dark"
        }`}
      >
        {pending ? "Posting…" : "Submit Post"}
      </button>

      <ProUpgradeModal
        open={upgradeOpen}
        onClose={() => setUpgradeOpen(false)}
        userId={userId}
        variant="employer"
      />
    </div>
  );
}

