import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

type Level = "HIGH_CONFIDENCE" | "MODERATE" | "AWARE";

function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

function normalizeTag(raw: string) {
  return raw.trim().replace(/\s+/g, " ");
}

function isSkillLevel(x: unknown): x is Level {
  return x === "HIGH_CONFIDENCE" || x === "MODERATE" || x === "AWARE";
}

export async function POST(req: Request) {
  const body: unknown = await req.json().catch(() => null);
  if (!body || typeof body !== "object") return jsonError("Invalid JSON body.");

  const email = (body as Record<string, unknown>).email;
  const firstName = (body as Record<string, unknown>).firstName;
  const lastName = (body as Record<string, unknown>).lastName;
  const skills = (body as Record<string, unknown>).skills;

  if (typeof email !== "string" || email.trim().length === 0) {
    return jsonError("Email is required.");
  }

  const safeFirstName = typeof firstName === "string" ? firstName.trim() : "";
  const safeLastName = typeof lastName === "string" ? lastName.trim() : "";

  if (!Array.isArray(skills)) return jsonError("Skills must be an array.");
  if (skills.length !== 20) return jsonError("Skills must be exactly 20 total.");

  const seen = new Set<string>();
  const counts: Record<Level, number> = { HIGH_CONFIDENCE: 0, MODERATE: 0, AWARE: 0 };

  const normalized = skills.map((s) => {
    if (!s || typeof s !== "object") return null;
    const name = (s as Record<string, unknown>).name;
    const level = (s as Record<string, unknown>).level;
    if (typeof name !== "string") return null;
    if (!isSkillLevel(level)) return null;
    const n = normalizeTag(name);
    if (!n) return null;
    const key = n.toLowerCase();
    if (seen.has(key)) return null;
    seen.add(key);
    counts[level] += 1;
    return { name: n, level };
  });

  if (normalized.some((x) => x === null)) return jsonError("Invalid or duplicate skills.");
  if (counts.HIGH_CONFIDENCE !== 5 || counts.MODERATE !== 10 || counts.AWARE !== 5) {
    return jsonError("Skill limits must be 5 High, 10 Moderate, 5 Aware.");
  }

  const result = await prisma.user.upsert({
    where: { email: email.trim().toLowerCase() },
    update: {
      role: UserRole.JOB_SEEKER,
      firstName: safeFirstName || null,
      lastName: safeLastName || null,
      companyName: null,
    },
    create: {
      email: email.trim().toLowerCase(),
      role: UserRole.JOB_SEEKER,
      firstName: safeFirstName || null,
      lastName: safeLastName || null,
    },
    select: { id: true },
  });

  const skillRows = (normalized as Array<{ name: string; level: Level }>).map((s) => ({
    userId: result.id,
    name: s.name,
    level: s.level,
  }));

  await prisma.$transaction([
    prisma.userSkill.deleteMany({ where: { userId: result.id } }),
    prisma.userSkill.createMany({ data: skillRows }),
  ]);

  return NextResponse.json({ userId: result.id });
}

