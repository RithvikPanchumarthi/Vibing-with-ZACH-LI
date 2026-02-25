import { prisma } from "@/lib/prisma";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { UserRole } from "@prisma/client";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") ?? "/dashboard";

  const origin = url.origin;

  if (!code) {
    return NextResponse.redirect(new URL("/login?error=missing_code", origin));
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data.user?.email) {
    return NextResponse.redirect(new URL("/login?error=oauth_failed", origin));
  }

  const email = data.user.email.toLowerCase();

  // Ensure OAuth users exist in Prisma even before onboarding.
  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: { email, role: UserRole.JOB_SEEKER },
    select: { id: true, role: true },
  });

  if (user.role === UserRole.EMPLOYER) {
    return NextResponse.redirect(new URL(`/dashboard/employer?employerId=${user.id}`, origin));
  }

  return NextResponse.redirect(new URL(`${next}?seekerId=${user.id}`, origin));
}

