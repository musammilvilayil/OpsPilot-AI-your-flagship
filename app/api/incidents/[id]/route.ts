import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { jsonSafe } from "@/lib/json";

const updateSchema = z.object({
  status: z.enum(["OPEN", "INVESTIGATING", "RESOLVED", "IGNORED"]).optional(),
  assigneeId: z.string().cuid().nullable().optional()
});

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const incident = await prisma.incident.findUnique({ where: { id }, include: { repository: true, evidence: true, actions: true, assignee: true } });
  if (!incident) return NextResponse.json({ error: "Incident not found" }, { status: 404 });
  return NextResponse.json(jsonSafe({ incident }));
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const parsed = updateSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid request", details: parsed.error.flatten() }, { status: 400 });
  const incident = await prisma.incident.update({
    where: { id },
    data: { ...parsed.data, resolvedAt: parsed.data.status === "RESOLVED" ? new Date() : undefined },
    include: { repository: true, evidence: true, actions: true }
  });
  return NextResponse.json(jsonSafe({ incident }));
}
