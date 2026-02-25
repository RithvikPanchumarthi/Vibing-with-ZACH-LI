"use client";

import { createCheckoutSession } from "@/app/actions/billing";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect } from "react";

type Variant = "seeker" | "employer";

type Props = {
  open: boolean;
  onClose: () => void;
  userId: string;
  variant: Variant;
};

const copy: Record<Variant, { title: string; body: string }> = {
  seeker: {
    title: "Upgrade to WorkVibe Pro",
    body: "You've used your one free credit. Upgrade to WorkVibe Pro for unlimited access and matching.",
  },
  employer: {
    title: "Upgrade to WorkVibe Pro",
    body: "You've used your one free credit. Upgrade to WorkVibe Pro for unlimited access and matching.",
  },
};

export default function ProUpgradeModal({ open, onClose, userId, variant }: Props) {
  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  const c = copy[variant];

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            type="button"
            aria-label="Close upgrade modal"
            onClick={onClose}
            className="absolute inset-0 cursor-default bg-black/70"
          />

          <motion.div
            initial={{ opacity: 0, y: 14, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.98 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-[#D3FB52]/25 bg-[#121212] shadow-[0_0_0_1px_rgba(211,251,82,0.18),0_0_40px_rgba(211,251,82,0.10)]"
          >
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(700px_circle_at_20%_-20%,rgba(211,251,82,0.18),transparent_55%)]" />

            <div className="relative p-7">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <p className="inline-flex w-fit items-center rounded-full border border-[#D3FB52]/25 bg-[#D3FB52]/10 px-3 py-1 text-xs font-semibold text-[#D3FB52]">
                    WorkVibe Pro
                  </p>
                  <h3 className="text-balance font-display text-3xl font-black tracking-tight text-cream">
                    {c.title}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white/80 hover:bg-white/10"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <p className="mt-4 text-pretty text-sm text-white/70">{c.body}</p>

              <div className="mt-6 grid grid-cols-1 gap-3">
                <form action={createCheckoutSession}>
                  <input type="hidden" name="userId" value={userId} />
                  <button
                    type="submit"
                    className="w-full rounded-2xl bg-[#D3FB52] px-5 py-3 text-sm font-black text-black transition-colors hover:bg-[#c4ee3b]"
                  >
                    Upgrade to Pro - $19/mo
                  </button>
                </form>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white/85 hover:bg-white/10"
                >
                  Not now
                </button>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-2 text-xs text-white/55">
                <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1">
                  Higher daily limits
                </span>
                <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1">
                  Faster matching
                </span>
                <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1">
                  Priority access
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

