import { randomUUID } from "node:crypto";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { analyseFailure } from "@/lib/analyser";
import { prisma } from "@/lib/db";
import { extractWorkflowLog, verifyGitHubSignature } from "@/lib/github";
import { saveIncidentAnalysis } from "@/lib/incidents";
import { getIncidentQueue, type IncidentJob } from "@/lib/queue";

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  if (!verifyGitHubSignature(rawBody, request.headers.get("x-hub-signature-256"))) {
    return NextResponse.json({ error: "Invalid webhook signature" }, { status: 401 });
  }

  let payload: Record<string, unknown>;
  try { payload = JSON.parse(rawBody) as Record<string, unknown>; }
  catch { return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 }); }

  const event = request.headers.get("x-github-event") ?? "unknown";
  const deliveryId = request.headers.get("x-github-delivery") ?? randomUUID();
  if (event === "ping") return NextResponse.json({ ok: true, message: "OpsPilot webhook is ready" });

  const repositoryPayload = payload.repository as Record<string, unknown> | undefined;
  const fullName = typeof repositoryPayload?.full_name === "string" ? repositoryPayload.full_name : null;
  const githubIdRaw = repositoryPayload?.id;
  if (!fullName || (typeof githubIdRaw !== "number" && typeof githubIdRaw !== "string")) {
    return NextResponse.json({ error: "Repository metadata is missing" }, { status: 400 });
  }

  if (await prisma.webhookDelivery.findUnique({ where: { githubDeliveryId: deliveryId } })) {
    return NextResponse.json({ ok: true, duplicate: true });
  }

  const owner = await prisma.user.upsert({ where: { email: "demo@opspilot.dev" }, update: {}, create: { email: "demo@opspilot.dev", name: "OpsPilot Demo Workspace" } });
  const repository = await prisma.repository.upsert({
    where: { githubId: BigInt(githubIdRaw) }, update: { fullName },
    create: { githubId: BigInt(githubIdRaw), fullName, defaultBranch: typeof repositoryPayload?.default_branch === "string" ? repositoryPayload.default_branch : "main", ownerId: owner.id }
  });
  const delivery = await prisma.webhookDelivery.create({
    data: { githubDeliveryId: deliveryId, event, repositoryId: repository.id, payload: payload as Prisma.InputJsonValue }
  });

  const workflowRun = payload.workflow_run as Record<string, unknown> | undefined;
  const failedConclusions = new Set(["failure", "timed_out", "cancelled", "action_required", "stale"]);
  const conclusion = typeof workflowRun?.conclusion === "string" ? workflowRun.conclusion : null;
  if (event !== "workflow_run" || !failedConclusions.has(conclusion ?? "")) {
    await prisma.webhookDelivery.update({ where: { id: delivery.id }, data: { processed: true, processedAt: new Date() } });
    return NextResponse.json({ ok: true, ignored: true });
  }

  const workflowName = typeof workflowRun?.name === "string" ? workflowRun.name : "GitHub Actions";
  const branch = typeof workflowRun?.head_branch === "string" ? workflowRun.head_branch : undefined;
  const commitSha = typeof workflowRun?.head_sha === "string" ? workflowRun.head_sha : undefined;
  const externalRunId = workflowRun?.id ? String(workflowRun.id) : undefined;
  const log = extractWorkflowLog(payload);
  const incident = await prisma.incident.create({
    data: { repositoryId: repository.id, externalRunId, title: `${workflowName} failed`, summary: "Failure received and queued for evidence-backed analysis.", workflowName, branch, commitSha, rawLog: log }
  });

  const input = { repository: fullName, workflowName, branch, commitSha, log };
  const queue = getIncidentQueue();
  if (queue) {
    const job: IncidentJob = { incidentId: incident.id, input };
    await queue.add("analyse", job, { jobId: `incident-${incident.id}` });
  } else {
    await saveIncidentAnalysis(incident.id, await analyseFailure(input));
  }

  await prisma.webhookDelivery.update({ where: { id: delivery.id }, data: { processed: true, processedAt: new Date() } });
  return NextResponse.json({ ok: true, incidentId: incident.id, queued: Boolean(queue) }, { status: 202 });
}
