import ApplyButton from "@/components/jobs/ApplyButton";
import Link from "next/link";

type Props = {
  jobId: string;
  roleName: string;
  companyName?: string | null;
  responsibilities: string;
  matchScore?: number | null;
  label?: string | null;
  seekerId?: string | null;
};

export default function JobCard({
  jobId,
  roleName,
  companyName,
  responsibilities,
  matchScore,
  label,
  seekerId,
}: Props) {
  const score = typeof matchScore === "number" ? matchScore : null;
  const isHigh = score !== null && score >= 80;

  return (
    <article
      className={`group rounded-3xl border bg-surface-card p-6 transition-colors hover:bg-[#22232e] ${
        isHigh
          ? "border-[#D3FB52]/30 shadow-[0_0_0_1px_rgba(211,251,82,0.20),0_0_30px_rgba(211,251,82,0.12)]"
          : "border-white/10"
      }`}
    >
      <Link href={`/jobs/${encodeURIComponent(jobId)}`} className="block">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold tracking-wide text-white/60">
              {companyName ?? "Company"}
            </p>
            <h3 className="mt-2 text-pretty text-lg font-black tracking-tight text-cream md:text-xl">
              {roleName}
            </h3>
          </div>

          {score !== null ? (
            <span className="shrink-0 rounded-full border border-[#D3FB52]/30 bg-[#D3FB52]/10 px-3 py-1 text-xs font-semibold text-[#D3FB52]">
              {score}% Vibe Match
            </span>
          ) : null}
        </div>

        <p className="mt-3 line-clamp-3 text-sm text-white/65">{responsibilities}</p>
      </Link>

      <div className="mt-5 flex items-center justify-between gap-3">
        {label ? (
          <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs font-semibold text-white/70">
            {label}
          </span>
        ) : (
          <span />
        )}

        <div className="flex items-center gap-3">
          {seekerId ? <ApplyButton seekerId={seekerId} jobId={jobId} /> : null}
          <Link
            href={`/jobs/${encodeURIComponent(jobId)}`}
            className="text-sm font-semibold text-brand transition-colors group-hover:text-brand-dark"
          >
            View →
          </Link>
        </div>
      </div>
    </article>
  );
}

