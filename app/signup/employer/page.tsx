"use client";

import { TagInput } from "@/components/ui/TagInput";
import { motion } from "framer-motion";
import Link from "next/link";
import { useMemo, useState } from "react";

export default function EmployerSignupPage() {
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [roleName, setRoleName] = useState("");
  const [responsibilities, setResponsibilities] = useState("");

  const [requiredSkills, setRequiredSkills] = useState<string[]>([]);
  const [optionalSkills, setOptionalSkills] = useState<string[]>([]);

  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const counts = useMemo(
    () => ({ required: requiredSkills.length, optional: optionalSkills.length }),
    [requiredSkills.length, optionalSkills.length],
  );

  const isValid =
    email.trim().length > 0 &&
    companyName.trim().length > 0 &&
    roleName.trim().length > 0 &&
    responsibilities.trim().length > 0 &&
    counts.required === 5 &&
    counts.optional === 10;

  async function handleSubmit() {
    setError(null);
    if (!isValid) {
      setError("Please complete all required fields and skill limits.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/onboarding/employer", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email,
          companyName,
          job: {
            roleName,
            responsibilities,
            requiredSkills,
            optionalSkills,
          },
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
        setError(message ?? "Failed to create employer account.");
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
          Employer onboarding
        </h1>
        <p className="mt-3 text-sm text-white/65 md:text-base">
          Add company details and post your first role. Skills must be exactly 5 required + 10 optional.
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
              placeholder="you@company.com"
              className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none focus:border-white/20"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-cream">Company name</label>
            <input
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="WorkVibe Inc."
              className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none focus:border-white/20"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-cream">Role name</label>
          <input
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
            placeholder="Senior Frontend Engineer"
            className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none focus:border-white/20"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-cream">Responsibilities</label>
          <textarea
            value={responsibilities}
            onChange={(e) => setResponsibilities(e.target.value)}
            rows={5}
            placeholder="What will this person do day-to-day?"
            className="w-full resize-none rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none focus:border-white/20"
          />
        </div>

        <TagInput
          label="Required skills"
          description="Exactly 5. Must-have signals."
          value={requiredSkills}
          onChange={setRequiredSkills}
          max={5}
          placeholder="Type a required skill and press Enter"
        />
        <TagInput
          label="Optional skills"
          description="Exactly 10. Better-to-have signals."
          value={optionalSkills}
          onChange={setOptionalSkills}
          max={10}
          placeholder="Type an optional skill and press Enter"
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
          {submitting ? "Creating employer…" : "Create employer account"}
        </button>
      </motion.div>
    </main>
  );
}

