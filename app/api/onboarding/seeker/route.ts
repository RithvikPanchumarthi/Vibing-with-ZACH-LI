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

  const normalizedSkills: Array<{ name: string; level: Level }> = [];

  if (skills !== undefined) {
    if (!Array.isArray(skills)) return jsonError("Skills must be an array.");

    const seen = new Set<string>();
    const counts: Record<Level, number> = { HIGH_CONFIDENCE: 0, MODERATE: 0, AWARE: 0 };

    for (const s of skills) {
      if (!s || typeof s !== "object") return jsonError("Invalid skills.");
      const name = (s as Record<string, unknown>).name;
      const level = (s as Record<string, unknown>).level;
      if (typeof name !== "string") return jsonError("Invalid skills.");
      if (!isSkillLevel(level)) return jsonError("Invalid skills.");
      const n = normalizeTag(name);
      if (!n) return jsonError("Invalid skills.");
      const key = n.toLowerCase();
      if (seen.has(key)) return jsonError("Invalid or duplicate skills.");
      seen.add(key);
      counts[level] += 1;
      normalizedSkills.push({ name: n, level });
    }

    if (counts.HIGH_CONFIDENCE > 5 || counts.MODERATE > 10 || counts.AWARE > 5) {
      return jsonError("Skill limits are max 5 High, 10 Moderate, 5 Aware.");
    }
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

  if (skills !== undefined) {
    const skillRows = normalizedSkills.map((s) => ({
      userId: result.id,
      name: s.name,
      level: s.level,
    }));

    await prisma.$transaction([
      prisma.userSkill.deleteMany({ where: { userId: result.id } }),
      ...(skillRows.length > 0 ? [prisma.userSkill.createMany({ data: skillRows })] : []),
    ]);
  }

  return NextResponse.json({ userId: result.id });
}

