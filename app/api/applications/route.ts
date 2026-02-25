import { canPerformAction } from "@/lib/limit-guard";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

function jsonError(message: string, status = 400, extra?: Record<string, unknown>) {
  return NextResponse.json({ error: message, ...extra }, { status });
}

function isPrismaUniqueError(e: unknown) {
  return e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002";
}

export async function POST(req: Request) {
  const body: unknown = await req.json().catch(() => null);
  if (!body || typeof body !== "object") return jsonError("Invalid JSON body.");

  const userId = (body as Record<string, unknown>).userId;
  const jobId = (body as Record<string, unknown>).jobId;

  if (typeof userId !== "string" || userId.trim().length === 0) return jsonError("userId is required.");
  if (typeof jobId !== "string" || jobId.trim().length === 0) return jsonError("jobId is required.");

  const allowed = await canPerformAction(userId, "APPLY");
  if (!allowed.allowed) {
    return jsonError("Free tier application limit reached. Upgrade to continue.", 402, {
      current: allowed.current,
      limit: allowed.limit,
    });
  }

  const job = await prisma.jobOpening.findUnique({
    where: { id: jobId },
    select: { id: true },
  });
  if (!job) return jsonError("Job not found.", 404);

  try {
    const application = await prisma.application.create({
      data: { seekerId: userId, jobId },
      select: { id: true, appliedAt: true },
    });
    return NextResponse.json({ application });
  } catch (e: unknown) {
    if (isPrismaUniqueError(e)) {
      return jsonError("You already applied to this job.", 409);
    }
    return jsonError("Failed to apply.", 500);
  }
}

