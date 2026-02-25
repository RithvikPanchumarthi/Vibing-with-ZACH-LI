"use client";

import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function AuthControls() {
  const [loading, setLoading] = useState(true);
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();

    supabase.auth.getSession().then(({ data }) => {
      setSignedIn(Boolean(data.session));
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setSignedIn(Boolean(session));
      setLoading(false);
    });

    return () => {
      sub.subscription.unsubscribe();
    };
  }, []);

  async function logout() {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  if (loading) {
    return (
      <div className="h-9 w-[160px] rounded-lg border border-white/10 bg-white/5" />
    );
  }

  if (signedIn) {
    return (
      <button
        type="button"
        onClick={logout}
        className="rounded-lg border border-white/20 px-5 py-2 text-sm font-semibold text-white/85 transition-colors hover:bg-white/5"
      >
        Logout
      </button>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Link
        href="/login"
        className="rounded-lg border border-white/20 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-white/5"
      >
        Log in
      </Link>
      <Link
        href="/signup"
        className="rounded-lg bg-brand px-5 py-2 text-sm font-semibold text-black transition-colors hover:bg-brand-dark"
      >
        Sign up
      </Link>
    </div>
  );
}

