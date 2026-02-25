import { canPerformAction } from "@/lib/limit-guard";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

function jsonError(message: string, status = 400, extra?: Record<string, unknown>) {
  return NextResponse.json({ error: message, ...extra }, { status });
}

export async function POST(req: Request) {
  const body: unknown = await req.json().catch(() => null);
  if (!body || typeof body !== "object") return jsonError("Invalid JSON body.");

  const userId = (body as Record<string, unknown>).userId;
  const content = (body as Record<string, unknown>).content;
  if (typeof userId !== "string" || userId.trim().length === 0) return jsonError("userId is required.");
  if (typeof content !== "string" || content.trim().length === 0) return jsonError("content is required.");

  const allowed = await canPerformAction(userId, "POST");
  if (!allowed.allowed) {
    return jsonError("Free tier post limit reached. Upgrade to continue.", 402, {
      current: allowed.current,
      limit: allowed.limit,
    });
  }

  const post = await prisma.post.create({
    data: { userId, content: content.trim() },
    select: { id: true, createdAt: true },
  });

  return NextResponse.json({ post });
}

