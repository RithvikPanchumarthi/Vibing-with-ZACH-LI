"use client";

import { TagInput } from "@/components/ui/TagInput";
import { motion } from "framer-motion";
import Link from "next/link";
import { useMemo, useState } from "react";

type Level = "HIGH_CONFIDENCE" | "MODERATE" | "AWARE";

type SkillPayload = {
  name: string;
  level: Level;
};

function toPayload(high: string[], moderate: string[], aware: string[]): SkillPayload[] {
  return [
    ...high.map((name) => ({ name, level: "HIGH_CONFIDENCE" as const })),
    ...moderate.map((name) => ({ name, level: "MODERATE" as const })),
    ...aware.map((name) => ({ name, level: "AWARE" as const })),
  ];
}

export default function SeekerSignupPage() {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [high, setHigh] = useState<string[]>([]);
  const [moderate, setModerate] = useState<string[]>([]);
  const [aware, setAware] = useState<string[]>([]);

  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const counts = useMemo(
    () => ({ high: high.length, moderate: moderate.length, aware: aware.length }),
    [high.length, moderate.length, aware.length],
  );

  const isValid =
    email.trim().length > 0 &&
    counts.high === 5 &&
    counts.moderate === 10 &&
    counts.aware === 5;

  async function handleSubmit() {
    setError(null);
    if (!isValid) {
      setError("Please complete all required fields and skill limits.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/onboarding/seeker", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email,
          firstName: firstName.trim() || null,
          lastName: lastName.trim() || null,
          skills: toPayload(high, moderate, aware),
        }),
      });

      const data: unknown = await res.json();
      if (!res.ok) {
        const message = (() => {
          if (!data || typeof data !== "object") return null;
          if (!("error" in data)) return null;
          const err = (data as Record<string, unknown>).error;
          return typeof err === "string" ? err : null;
        })();
        setError(message);
        return;
      }

      const userId = (() => {
        if (!data || typeof data !== "object") return null;
        if (!("userId" in data)) return null;
        const id = (data as Record<string, unknown>).userId;
        return typeof id === "string" ? id : null;
      })();
      window.location.href = userId ? `/signup/success?userId=${encodeURIComponent(userId)}` : "/signup/success";
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-[1400px] px-4 py-10 md:px-6">
      <div className="mx-auto max-w-3xl">
        <Link href="/signup" className="text-sm font-semibold text-brand hover:underline">
          ← Back
        </Link>

        <h1 className="mt-4 text-balance font-display text-4xl font-black tracking-tight text-cream md:text-6xl">
          Job seeker onboarding
        </h1>
        <p className="mt-3 text-sm text-white/65 md:text-base">
          Add your info and exactly 20 skills: 5 High Confidence, 10 Moderate, 5 Aware.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="mx-auto mt-8 max-w-3xl space-y-6 rounded-3xl border border-white/10 bg-surface-card p-6 md:p-8"
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-cream">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="you@workvibe.com"
              className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none focus:border-white/20"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-cream">Name</label>
            <div className="grid grid-cols-2 gap-3">
              <input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First"
                className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none focus:border-white/20"
              />
              <input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last"
                className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none focus:border-white/20"
              />
            </div>
          </div>
        </div>

        <TagInput
          label="High confidence skills"
          description="Exactly 5. Your strongest signals."
          value={high}
          onChange={setHigh}
          max={5}
        />
        <TagInput
          label="Moderate skills"
          description="Exactly 10. Skills you can confidently use."
          value={moderate}
          onChange={setModerate}
          max={10}
        />
        <TagInput
          label="Aware skills"
          description="Exactly 5. Skills you're familiar with."
          value={aware}
          onChange={setAware}
          max={5}
        />

        {error ? (
          <p className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-100">
            {error}
          </p>
        ) : null}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={!isValid || submitting}
          className={`w-full rounded-2xl px-5 py-3 text-sm font-semibold transition-colors ${
            !isValid || submitting
              ? "cursor-not-allowed bg-white/10 text-white/50"
              : "bg-brand text-black hover:bg-brand-dark"
          }`}
        >
          {submitting ? "Creating account…" : "Create account"}
        </button>
      </motion.div>
    </main>
  );
}

