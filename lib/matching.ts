import { prisma } from "@/lib/prisma";
import { RequirementLevel, SkillLevel, UserRole } from "@prisma/client";

export type MatchBreakdown = {
  requiredTotal: number;
  requiredMatched: number;
  betterTotal: number;
  betterMatched: number;
};

export type MatchResult = {
  score: number; // 0..100
  breakdown: MatchBreakdown;
  matchReason: string;
};

export const SKILL_WEIGHTS = {
  HIGH_CONFIDENCE: 10,
  MODERATE: 6,
  AWARE: 3,
} as const satisfies Record<SkillLevel, number>;

const MODERATE_REQUIRED_MULTIPLIER = 0.6;
const BETTER_TO_HAVE_BONUS = 2;

function clampScore(x: number) {
  if (x < 0) return 0;
  if (x > 100) return 100;
  return Math.round(x);
}

function norm(s: string) {
  return s.trim().toLowerCase();
}

export function scoreSeekerForJob(args: {
  seekerSkills: Array<{ name: string; level: SkillLevel }>;
  jobSkills: Array<{ name: string; importance: RequirementLevel }>;
}): MatchResult {
  const seekerMap = new Map<string, SkillLevel>();
  for (const s of args.seekerSkills) {
    const key = norm(s.name);
    if (!key) continue;
    // If duplicates exist, keep the highest-confidence level.
    const prev = seekerMap.get(key);
    if (!prev) {
      seekerMap.set(key, s.level);
      continue;
    }
    const prevW = SKILL_WEIGHTS[prev];
    const nextW = SKILL_WEIGHTS[s.level];
    if (nextW > prevW) seekerMap.set(key, s.level);
  }

  const required = args.jobSkills.filter((j) => j.importance === RequirementLevel.REQUIRED);
  const better = args.jobSkills.filter((j) => j.importance === RequirementLevel.BETTER_TO_HAVE);

  let points = 0;
  let requiredMatched = 0;
  let betterMatched = 0;

  for (const req of required) {
    const level = seekerMap.get(norm(req.name));
    if (!level) continue;
    requiredMatched += 1;

    if (level === SkillLevel.HIGH_CONFIDENCE) {
      points += SKILL_WEIGHTS.HIGH_CONFIDENCE; // max weight
    } else if (level === SkillLevel.MODERATE) {
      points += SKILL_WEIGHTS.HIGH_CONFIDENCE * MODERATE_REQUIRED_MULTIPLIER; // 60% of max
    } else {
      // Not specified in requirements: treat as the level weight.
      points += SKILL_WEIGHTS.AWARE;
    }
  }

  for (const b of better) {
    const level = seekerMap.get(norm(b.name));
    if (!level) continue;
    betterMatched += 1;
    points += BETTER_TO_HAVE_BONUS;
  }

  const maxPoints = required.length * SKILL_WEIGHTS.HIGH_CONFIDENCE + better.length * BETTER_TO_HAVE_BONUS;
  const score = maxPoints === 0 ? 0 : (points / maxPoints) * 100;

  const breakdown: MatchBreakdown = {
    requiredTotal: required.length,
    requiredMatched,
    betterTotal: better.length,
    betterMatched,
  };

  const matchReason = `Matches ${requiredMatched} of ${required.length} required skills.`;

  return { score: clampScore(score), breakdown, matchReason };
}

export type SeekerMatch = {
  seekerId: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  score: number;
  matchReason: string;
};

export async function getMatchesForJob(jobId: string): Promise<SeekerMatch[]> {
  const job = await prisma.jobOpening.findUnique({
    where: { id: jobId },
    select: {
      id: true,
      requirements: { select: { name: true, importance: true } },
    },
  });
  if (!job) return [];

  const seekers = await prisma.user.findMany({
    where: { role: UserRole.JOB_SEEKER },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      skills: { select: { name: true, level: true } },
    },
  });

  return seekers
    .map((s) => {
      const r = scoreSeekerForJob({ seekerSkills: s.skills, jobSkills: job.requirements });
      return {
        seekerId: s.id,
        email: s.email,
        firstName: s.firstName,
        lastName: s.lastName,
        score: r.score,
        matchReason: r.matchReason,
      };
    })
    .sort((a, b) => b.score - a.score);
}

export type RecommendedJob = {
  jobId: string;
  employerId: string;
  companyName: string | null;
  roleName: string;
  responsibilities: string;
  score: number;
  label: "Top Picks";
};

export async function getRecommendedJobs(seekerId: string): Promise<RecommendedJob[]> {
  const seeker = await prisma.user.findUnique({
    where: { id: seekerId },
    select: { id: true, role: true, skills: { select: { name: true, level: true } } },
  });
  if (!seeker || seeker.role !== UserRole.JOB_SEEKER) return [];

  const jobs = await prisma.jobOpening.findMany({
    select: {
      id: true,
      roleName: true,
      responsibilities: true,
      employerId: true,
      employer: { select: { companyName: true } },
      requirements: { select: { name: true, importance: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const scored = jobs
    .map((j) => {
      const r = scoreSeekerForJob({ seekerSkills: seeker.skills, jobSkills: j.requirements });
      return {
        jobId: j.id,
        employerId: j.employerId,
        companyName: j.employer.companyName,
        roleName: j.roleName,
        responsibilities: j.responsibilities,
        score: r.score,
        label: "Top Picks" as const,
      };
    })
    .filter((j) => j.score >= 80)
    .sort((a, b) => b.score - a.score);

  return scored;
}

