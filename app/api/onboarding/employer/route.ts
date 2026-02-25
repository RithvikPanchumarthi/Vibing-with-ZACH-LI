import { prisma } from "@/lib/prisma";
import { RequirementLevel, UserRole } from "@prisma/client";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

function normalizeTag(raw: string) {
  return raw.trim().replace(/\s+/g, " ");
}

function uniqueNormalized(list: unknown, expectedCount: number): string[] | null {
  if (!Array.isArray(list) || list.length !== expectedCount) return null;
  const out: string[] = [];
  const seen = new Set<string>();
  for (const item of list) {
    if (typeof item !== "string") return null;
    const n = normalizeTag(item);
    if (!n) return null;
    const key = n.toLowerCase();
    if (seen.has(key)) return null;
    seen.add(key);
    out.push(n);
  }
  return out;
}

export async function POST(req: Request) {
  const body: unknown = await req.json().catch(() => null);
  if (!body || typeof body !== "object") return jsonError("Invalid JSON body.");

  const email = (body as Record<string, unknown>).email;
  const companyName = (body as Record<string, unknown>).companyName;
  const job = (body as Record<string, unknown>).job;

  if (typeof email !== "string" || email.trim().length === 0) return jsonError("Email is required.");
  if (typeof companyName !== "string" || companyName.trim().length === 0) return jsonError("Company name is required.");
  if (!job || typeof job !== "object") return jsonError("Job payload is required.");

  const roleName = (job as Record<string, unknown>).roleName;
  const responsibilities = (job as Record<string, unknown>).responsibilities;
  const requiredSkillsRaw = (job as Record<string, unknown>).requiredSkills;
  const optionalSkillsRaw = (job as Record<string, unknown>).optionalSkills;

  if (typeof roleName !== "string" || roleName.trim().length === 0) return jsonError("Role name is required.");
  if (typeof responsibilities !== "string" || responsibilities.trim().length === 0) {
    return jsonError("Responsibilities are required.");
  }

  const requiredSkills = uniqueNormalized(requiredSkillsRaw, 5);
  if (!requiredSkills) return jsonError("Required skills must be exactly 5 unique strings.");
  const optionalSkills = uniqueNormalized(optionalSkillsRaw, 10);
  if (!optionalSkills) return jsonError("Optional skills must be exactly 10 unique strings.");

  const overlap = new Set(requiredSkills.map((s) => s.toLowerCase()));
  if (optionalSkills.some((s) => overlap.has(s.toLowerCase()))) {
    return jsonError("Skills cannot overlap between required and optional.");
  }

  const { userId, jobId } = await prisma.$transaction(async (tx) => {
    const user = await tx.user.upsert({
      where: { email: email.trim().toLowerCase() },
      update: {
        role: UserRole.EMPLOYER,
        companyName: companyName.trim(),
        firstName: null,
        lastName: null,
      },
      create: {
        email: email.trim().toLowerCase(),
        role: UserRole.EMPLOYER,
        companyName: companyName.trim(),
      },
      select: { id: true },
    });

    const jobRow = await tx.jobOpening.create({
      data: {
        employerId: user.id,
        roleName: roleName.trim(),
        responsibilities: responsibilities.trim(),
      },
      select: { id: true },
    });

    await tx.jobSkill.createMany({
      data: [
        ...requiredSkills.map((name) => ({
          jobId: jobRow.id,
          name,
          importance: RequirementLevel.REQUIRED,
        })),
        ...optionalSkills.map((name) => ({
          jobId: jobRow.id,
          name,
          importance: RequirementLevel.BETTER_TO_HAVE,
        })),
      ],
    });

    return { userId: user.id, jobId: jobRow.id };
  });

  return NextResponse.json({ userId, jobId });
}

