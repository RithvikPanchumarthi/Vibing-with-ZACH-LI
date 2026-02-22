"use client";

import { ArrowRight } from "lucide-react";
import { useState } from "react";

const items = [
  { label: "Find a job", key: "jobs" },
  { label: "Find AI work", key: "ai-work" },
  { label: "Hire now", key: "hire" },
  { label: "Train your model", key: "train" },
];

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  posted: string;
}

export default function CtaGrid() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [activeKey, setActiveKey] = useState<string | null>(null);

  async function handleClick(key: string) {
    if (key === "jobs") {
      const res = await fetch("/api/jobs");
      const data = await res.json();
      setJobs(data.jobs);
      setActiveKey("jobs");
    }
  }

  return (
    <section className="w-full px-4 mt-4 md:px-6">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <button
            key={item.label}
            onClick={() => handleClick(item.key)}
            className="flex items-center justify-between rounded-2xl border border-white/10 bg-surface-card p-6 text-left transition-colors hover:bg-[#22232e]"
          >
            <span className="text-lg font-medium text-brand">
              {item.label}
            </span>
            <ArrowRight className="h-5 w-5 text-brand" />
          </button>
        ))}
      </div>

      {activeKey === "jobs" && jobs.length > 0 && (
        <div className="mx-auto mt-6 max-w-[1400px] space-y-3">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="flex flex-col gap-1 rounded-2xl border border-white/10 bg-surface-card p-5 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="text-lg font-semibold text-cream">{job.title}</p>
                <p className="text-sm text-white/60">
                  {job.company} · {job.location}
                </p>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span className="rounded-full bg-brand/10 px-3 py-1 text-brand">
                  {job.type}
                </span>
                <span className="text-white/60">{job.salary}</span>
                <span className="text-white/40">{job.posted}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
