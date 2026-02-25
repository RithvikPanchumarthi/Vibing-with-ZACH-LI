import { prisma } from "@/lib/prisma";

export const FREE_TIER_LIMITS = {
  postsPerDay: 3,
  applicationsPerDay: 10,
} as const;

function startOfTodayUtc(): Date {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}

export type LimitStatus = {
  isPremium: boolean;
  today: {
    posts: number;
    applications: number;
  };
  limits: typeof FREE_TIER_LIMITS;
  allowed: {
    createPost: boolean;
    createApplication: boolean;
  };
};

export async function checkLimits(userId: string): Promise<LimitStatus> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { isPremium: true },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const since = startOfTodayUtc();

  const [posts, applications] = await Promise.all([
    prisma.post.count({ where: { userId, createdAt: { gte: since } } }),
    prisma.application.count({ where: { seekerId: userId, appliedAt: { gte: since } } }),
  ]);

  if (user.isPremium) {
    return {
      isPremium: true,
      today: { posts, applications },
      limits: FREE_TIER_LIMITS,
      allowed: { createPost: true, createApplication: true },
    };
  }

  return {
    isPremium: false,
    today: { posts, applications },
    limits: FREE_TIER_LIMITS,
    allowed: {
      createPost: posts < FREE_TIER_LIMITS.postsPerDay,
      createApplication: applications < FREE_TIER_LIMITS.applicationsPerDay,
    },
  };
}

