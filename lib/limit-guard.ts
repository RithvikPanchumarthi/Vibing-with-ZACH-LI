import { prisma } from "@/lib/prisma";

export const LIMITS = {
  POSTS: 1,
  APPLICATIONS: 1,
  EMPLOYER_JOB_POSTS: 1,
  EMPLOYER_COMPANY_POSTS: 1,
} as const;

export type ActionType = "POST" | "APPLY" | "JOB_POST";

export type LimitResult =
  | { allowed: true }
  | { allowed: false };

export async function canPerformAction(
  userId: string,
  actionType: ActionType,
): Promise<LimitResult> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { isPremium: true },
  });

  if (!user) return { allowed: false };

  if (user.isPremium) return { allowed: true };

  if (actionType === "POST") {
    const count = await prisma.post.count({
      where: { userId },
    });
    if (count >= LIMITS.POSTS) return { allowed: false };
    return { allowed: true };
  }

  if (actionType === "APPLY") {
    const count = await prisma.application.count({
      where: { seekerId: userId },
    });
    if (count >= LIMITS.APPLICATIONS) return { allowed: false };
    return { allowed: true };
  }

  const count = await prisma.jobOpening.count({
    where: { employerId: userId },
  });
  if (count >= LIMITS.EMPLOYER_JOB_POSTS) return { allowed: false };
  return { allowed: true };
}

