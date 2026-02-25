"use server";

import { canPerformAction } from "@/lib/limit-guard";
import { prisma } from "@/lib/prisma";

export async function submitPost(formData: FormData) {
  const userId = formData.get("userId");
  const content = formData.get("content");

  if (typeof userId !== "string" || userId.trim().length === 0) {
    throw new Error("Missing userId");
  }
  if (typeof content !== "string" || content.trim().length === 0) {
    throw new Error("Missing content");
  }

  const allowed = await canPerformAction(userId, "POST");
  if (!allowed.allowed) {
    throw new Error("DAILY_LIMIT_REACHED");
  }

  await prisma.post.create({
    data: { userId, content: content.trim() },
    select: { id: true },
  });
}

export async function applyToJob(formData: FormData) {
  const seekerId = formData.get("seekerId");
  const jobId = formData.get("jobId");

  if (typeof seekerId !== "string" || seekerId.trim().length === 0) {
    throw new Error("Missing seekerId");
  }
  if (typeof jobId !== "string" || jobId.trim().length === 0) {
    throw new Error("Missing jobId");
  }

  const allowed = await canPerformAction(seekerId, "APPLY");
  if (!allowed.allowed) {
    throw new Error("DAILY_LIMIT_REACHED");
  }

  await prisma.application.create({
    data: { seekerId, jobId },
    select: { id: true },
  });
}

