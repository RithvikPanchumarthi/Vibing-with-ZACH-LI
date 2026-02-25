import { prisma } from "@/lib/prisma";

export const LIMITS = {
  POSTS: 3,
  APPLICATIONS: 15,
  EMPLOYER_JOB_POSTS: 1,
  EMPLOYER_COMPANY_POSTS: 3,
} as const;

export type ActionType = "POST" | "APPLY" | "JOB_POST";

export type LimitResult =
  | { allowed: true }
  | { allowed: false; current: number; limit: number };

function startOfTodayLocal(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
}

export async function canPerformAction(
  userId: string,
  actionType: ActionType,
): Promise<LimitResult> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { isPremium: true },
  });

  if (!user) {
    return { allowed: false, current: 0, limit: 0 };
  }

  if (user.isPremium) return { allowed: true };

  const since = startOfTodayLocal();

  if (actionType === "POST") {
    const count = await prisma.post.count({
      where: { userId, createdAt: { gte: since } },
    });
    if (count >= LIMITS.POSTS) return { allowed: false, current: count, limit: LIMITS.POSTS };
    return { allowed: true };
  }

  if (actionType === "APPLY") {
    const count = await prisma.application.count({
      where: { seekerId: userId, appliedAt: { gte: since } },
    });
    if (count >= LIMITS.APPLICATIONS) {
      return { allowed: false, current: count, limit: LIMITS.APPLICATIONS };
    }
    return { allowed: true };
  }

  const count = await prisma.jobOpening.count({
    where: { employerId: userId, createdAt: { gte: since } },
  });
  if (count >= LIMITS.EMPLOYER_JOB_POSTS) {
    return { allowed: false, current: count, limit: LIMITS.EMPLOYER_JOB_POSTS };
  }
  return { allowed: true };
}

