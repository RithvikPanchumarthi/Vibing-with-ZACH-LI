import JobCard from "@/components/jobs/JobCard";
import { prisma } from "@/lib/prisma";

type Props = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function JobsPage({ searchParams }: Props) {
  const params = (await searchParams) ?? {};
  const seekerId = typeof params.seekerId === "string" ? params.seekerId : null;

  const jobs = await prisma.jobOpening.findMany({
    select: {
      id: true,
      roleName: true,
      responsibilities: true,
      employer: { select: { companyName: true } },
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <main className="mx-auto w-full max-w-[1400px] px-4 py-10 md:px-6">
      <div className="mx-auto max-w-5xl">
        <h1 className="font-display text-5xl font-black tracking-tight text-cream md:text-6xl">
          Jobs
        </h1>
        <p className="mt-3 text-sm text-white/65 md:text-base">
          Browse the latest roles on WorkVibe.
        </p>
        {seekerId ? (
          <p className="mt-2 text-xs font-semibold tracking-wide text-white/50">
            Applying as seeker: <span className="text-white/70">{seekerId}</span>
          </p>
        ) : (
          <p className="mt-2 text-xs text-white/50">
            Tip: add <span className="font-mono">?seekerId=...</span> to enable Apply + limit handling.
          </p>
        )}

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
          {jobs.map((job) => (
            <JobCard
              key={job.id}
              jobId={job.id}
              roleName={job.roleName}
              companyName={job.employer.companyName}
              responsibilities={job.responsibilities}
              seekerId={seekerId}
            />
          ))}
        </div>
      </div>
    </main>
  );
}

