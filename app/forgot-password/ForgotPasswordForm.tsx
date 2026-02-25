"use client";

import { sendPasswordReset, type ResetState } from "@/app/login/actions";
import Link from "next/link";
import { useFormState, useFormStatus } from "react-dom";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={`w-full rounded-2xl px-5 py-3 text-sm font-semibold transition-colors ${
        pending
          ? "cursor-not-allowed bg-white/10 text-white/50"
          : "bg-[#D3FB52] text-black hover:bg-[#c4ee3b]"
      }`}
    >
      {pending ? "Sending…" : "Send reset email"}
    </button>
  );
}

export default function ForgotPasswordForm() {
  const [state, formAction] = useFormState<ResetState, FormData>(sendPasswordReset, {});

  return (
    <div className="mx-auto mt-10 max-w-md rounded-3xl border border-white/10 bg-surface-card p-7">
      <div className="space-y-2">
        <p className="text-xs font-semibold tracking-wide text-white/60">WorkVibe</p>
        <h1 className="font-display text-4xl font-black tracking-tight text-cream">
          Reset password
        </h1>
        <p className="text-sm text-white/65">
          Enter your email and we’ll send you a reset link.
        </p>
      </div>

      <form action={formAction} className="mt-6 space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-cream">Email</label>
          <input
            name="email"
            type="email"
            required
            placeholder="you@workvibe.com"
            className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none focus:border-white/20"
          />
        </div>

        {state.error ? (
          <p className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-100">
            {state.error}
          </p>
        ) : null}
        {state.sent ? (
          <p className="rounded-2xl border border-[#D3FB52]/20 bg-[#D3FB52]/10 px-4 py-3 text-sm text-[#D3FB52]">
            Reset email sent. Check your inbox.
          </p>
        ) : null}

        <SubmitButton />
      </form>

      <p className="mt-6 text-center text-sm text-white/60">
        <Link href="/login" className="font-semibold text-[#D3FB52] hover:underline">
          Back to login
        </Link>
      </p>
    </div>
  );
}

