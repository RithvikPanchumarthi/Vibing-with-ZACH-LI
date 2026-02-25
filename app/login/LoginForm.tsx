"use client";

import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { loginWithPassword, type LoginState } from "@/app/login/actions";
import Link from "next/link";
import { useFormState, useFormStatus } from "react-dom";
import { useEffect, useState } from "react";

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
      {pending ? "Logging in…" : "Login"}
    </button>
  );
}

export default function LoginForm() {
  const [state, formAction] = useFormState<LoginState, FormData>(loginWithPassword, {});
  const [oauthError, setOauthError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        window.location.href = "/dashboard";
      }
    });
  }, []);

  async function signInWithGithub() {
    setOauthError(null);
    const supabase = createSupabaseBrowserClient();
    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ?? process.env.APP_URL ?? window.location.origin;

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${baseUrl}/api/auth/callback`,
      },
    });

    if (error) {
      setOauthError("GitHub sign-in failed. Please try again.");
    }
  }

  return (
    <div className="mx-auto mt-10 max-w-md rounded-3xl border border-white/10 bg-surface-card p-7">
      <div className="space-y-2">
        <p className="text-xs font-semibold tracking-wide text-white/60">WorkVibe</p>
        <h1 className="font-display text-4xl font-black tracking-tight text-cream">
          Welcome back
        </h1>
        <p className="text-sm text-white/65">Login with email/password or continue with GitHub.</p>
      </div>

      <button
        type="button"
        onClick={signInWithGithub}
        className="mt-6 w-full rounded-2xl border border-white/10 bg-black/20 px-5 py-3 text-sm font-semibold text-white/85 hover:bg-black/30"
      >
        Continue with GitHub
      </button>

      {oauthError ? (
        <p className="mt-3 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-100">
          {oauthError}
        </p>
      ) : null}

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-white/10" />
        <p className="text-xs font-semibold text-white/40">or</p>
        <div className="h-px flex-1 bg-white/10" />
      </div>

      <form action={formAction} className="space-y-4">
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

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-cream">Password</label>
            <Link href="/forgot-password" className="text-xs font-semibold text-[#D3FB52] hover:underline">
              Forgot password?
            </Link>
          </div>
          <input
            name="password"
            type="password"
            required
            minLength={8}
            placeholder="••••••••"
            className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none focus:border-white/20"
          />
          <p className="text-xs text-white/45">Minimum 8 characters.</p>
        </div>

        {state.error ? (
          <p className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-100">
            {state.error}
          </p>
        ) : null}

        <SubmitButton />
      </form>

      <p className="mt-6 text-center text-sm text-white/60">
        New here?{" "}
        <Link href="/signup" className="font-semibold text-[#D3FB52] hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}

