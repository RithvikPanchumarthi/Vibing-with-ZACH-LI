"use client";

import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import Link from "next/link";
import { useState, useTransition } from "react";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [pending, startTransition] = useTransition();

  function onSubmit() {
    setError(null);
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    startTransition(async () => {
      const supabase = createSupabaseBrowserClient();
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) {
        setError("Reset failed. Please open the link from your email again.");
        return;
      }
      setSuccess(true);
    });
  }

  return (
    <main className="mx-auto w-full max-w-[1400px] px-4 py-12 md:px-6">
      <div className="mx-auto mt-10 max-w-md rounded-3xl border border-white/10 bg-surface-card p-7">
        <div className="space-y-2">
          <p className="text-xs font-semibold tracking-wide text-white/60">WorkVibe</p>
          <h1 className="font-display text-4xl font-black tracking-tight text-cream">
            Choose a new password
          </h1>
          <p className="text-sm text-white/65">Minimum 8 characters.</p>
        </div>

        <div className="mt-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-cream">New password</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              minLength={8}
              placeholder="••••••••"
              className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none focus:border-white/20"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-cream">Confirm password</label>
            <input
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              type="password"
              minLength={8}
              placeholder="••••••••"
              className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none focus:border-white/20"
            />
          </div>

          {error ? (
            <p className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-100">
              {error}
            </p>
          ) : null}
          {success ? (
            <p className="rounded-2xl border border-[#D3FB52]/20 bg-[#D3FB52]/10 px-4 py-3 text-sm text-[#D3FB52]">
              Password updated. You can log in now.
            </p>
          ) : null}

          <button
            type="button"
            onClick={onSubmit}
            disabled={pending}
            className={`w-full rounded-2xl px-5 py-3 text-sm font-semibold transition-colors ${
              pending
                ? "cursor-not-allowed bg-white/10 text-white/50"
                : "bg-[#D3FB52] text-black hover:bg-[#c4ee3b]"
            }`}
          >
            {pending ? "Updating…" : "Update password"}
          </button>

          <p className="text-center text-sm text-white/60">
            <Link href="/login" className="font-semibold text-[#D3FB52] hover:underline">
              Back to login
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

