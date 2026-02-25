import JobCard from "@/components/jobs/JobCard";
import PostComposer from "@/components/posts/PostComposer";
import { getRecommendedJobs } from "@/lib/matching";

type Props = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function DashboardPage({ searchParams }: Props) {
  const params = (await searchParams) ?? {};
  const seekerId = typeof params.seekerId === "string" ? params.seekerId : null;
  const payment = typeof params.payment === "string" ? params.payment : null;

  const recs = seekerId ? await getRecommendedJobs(seekerId) : [];

  return (
    <main className="mx-auto w-full max-w-[1400px] px-4 py-10 md:px-6">
      <div className="mx-auto max-w-5xl">
        <h1 className="font-display text-5xl font-black tracking-tight text-cream md:text-6xl">
          Dashboard
        </h1>
        <p className="mt-3 text-sm text-white/65 md:text-base">
          {payment === "success"
            ? "Payment successful — Premium is being activated."
            : payment === "cancelled"
              ? "Payment cancelled."
              : "Your personalized feed."}
        </p>

        {!seekerId ? (
          <div className="mt-8 rounded-3xl border border-white/10 bg-surface-card p-6 text-white/70">
            Pass `?seekerId=...` to view recommendations.
          </div>
        ) : (
          <>
            <div className="mt-8">
              <PostComposer userId={seekerId} />
            </div>

            <div className="mt-10 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold tracking-wide text-white/60">
                  For you
                </p>
                <h2 className="mt-2 text-2xl font-black tracking-tight text-cream md:text-3xl">
                  Top Picks
                </h2>
              </div>
              <p className="text-sm text-white/60">{recs.length} matches ≥ 80%</p>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
              {recs.map((job) => (
                <JobCard
                  key={job.jobId}
                  jobId={job.jobId}
                  roleName={job.roleName}
                  companyName={job.companyName}
                  responsibilities={job.responsibilities}
                  matchScore={job.score}
                  label={job.label}
                  seekerId={seekerId}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}

