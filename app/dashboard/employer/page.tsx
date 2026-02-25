import { prisma } from "@/lib/prisma";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { UserRole } from "@prisma/client";
import { redirect } from "next/navigation";

type Props = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function EmployerDashboardPage({ searchParams }: Props) {
  const params = (await searchParams) ?? {};
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user?.email) redirect("/login");

  const email = data.user.email.toLowerCase();
  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: { email, role: UserRole.JOB_SEEKER },
    select: { id: true, role: true },
  });

  if (user.role !== UserRole.EMPLOYER) {
    redirect("/dashboard");
  }

  const employerId = user.id;

  const jobs = await prisma.jobOpening.findMany({
    where: { employerId },
    select: { id: true, roleName: true, createdAt: true },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return (
    <main className="mx-auto w-full max-w-[1400px] px-4 py-10 md:px-6">
      <div className="mx-auto max-w-5xl">
        <h1 className="font-display text-5xl font-black tracking-tight text-cream md:text-6xl">
          Employer Dashboard
        </h1>
        <p className="mt-3 text-sm text-white/65 md:text-base">
          Manage your listings and applicants.
        </p>

        <div className="mt-8 rounded-3xl border border-white/10 bg-surface-card p-6">
          <p className="text-xs font-semibold tracking-wide text-white/60">Your job posts</p>
          <div className="mt-4 space-y-3">
            {jobs.length === 0 ? (
              <p className="text-sm text-white/60">No job posts yet.</p>
            ) : (
              jobs.map((j) => (
                <div
                  key={j.id}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-3"
                >
                  <p className="text-sm font-semibold text-cream">{j.roleName}</p>
                  <p className="text-xs text-white/50">
                    {j.createdAt.toISOString().slice(0, 10)}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

