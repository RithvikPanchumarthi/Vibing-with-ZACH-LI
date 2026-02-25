"use server";

import { prisma } from "@/lib/prisma";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { UserRole } from "@prisma/client";
import { redirect } from "next/navigation";

export type LoginState = { error?: string };

function safeString(x: FormDataEntryValue | null) {
  return typeof x === "string" ? x : "";
}

export async function loginWithPassword(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = safeString(formData.get("email")).trim().toLowerCase();
  const password = safeString(formData.get("password"));

  if (!email) return { error: "Email is required." };
  if (!password) return { error: "Password is required." };

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error || !data.user?.email) {
    return { error: "Invalid email or password." };
  }

  // Ensure cookies/session are fully synchronized for SSR.
  await supabase.auth.getUser();

  const prismaUser = await prisma.user.upsert({
    where: { email },
    update: {},
    create: { email, role: UserRole.JOB_SEEKER },
    select: { id: true, role: true },
  });

  if (prismaUser.role === UserRole.EMPLOYER) {
    redirect(`/dashboard/employer?employerId=${prismaUser.id}`);
  }

  redirect(`/dashboard?seekerId=${prismaUser.id}`);
}

export type ResetState = { error?: string; sent?: boolean };

export async function sendPasswordReset(_prev: ResetState, formData: FormData): Promise<ResetState> {
  const email = safeString(formData.get("email")).trim().toLowerCase();
  if (!email) return { error: "Email is required." };

  const supabase = await createSupabaseServerClient();
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ?? process.env.APP_URL ?? "http://localhost:3000";

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${baseUrl}/reset-password`,
  });

  if (error) {
    return { error: "Failed to send reset email. Try again." };
  }

  return { sent: true };
}

