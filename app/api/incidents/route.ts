import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { jsonSafe } from "@/lib/json";

export async function GET(request: NextRequest) {
  const status = request.nextUrl.searchParams.get("status");
  const incidents = await prisma.incident.findMany({
    where: status ? { status: status as "OPEN" | "INVESTIGATING" | "RESOLVED" | "IGNORED" } : undefined,
    include: { repository: true, evidence: true, actions: true },
    orderBy: { detectedAt: "desc" }, take: 100
  });
  return NextResponse.json(jsonSafe({ incidents }));
}
