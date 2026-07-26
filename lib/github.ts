import { createHmac, timingSafeEqual } from "node:crypto";

export function verifyGitHubSignature(rawBody: string, signature: string | null): boolean {
  const secret = process.env.GITHUB_WEBHOOK_SECRET;
  if (!secret) return process.env.NODE_ENV !== "production";
  if (!signature?.startsWith("sha256=")) return false;
  const expected = `sha256=${createHmac("sha256", secret).update(rawBody).digest("hex")}`;
  const expectedBuffer = Buffer.from(expected);
  const signatureBuffer = Buffer.from(signature);
  return expectedBuffer.length === signatureBuffer.length && timingSafeEqual(expectedBuffer, signatureBuffer);
}

export function extractWorkflowLog(payload: Record<string, unknown>): string {
  if (typeof payload.opspilot_logs === "string" && payload.opspilot_logs.trim()) return payload.opspilot_logs;
  const workflowRun = payload.workflow_run as Record<string, unknown> | undefined;
  const name = typeof workflowRun?.name === "string" ? workflowRun.name : "GitHub Actions";
  const conclusion = typeof workflowRun?.conclusion === "string" ? workflowRun.conclusion : "failure";
  return [`Workflow: ${name}`, `Conclusion: ${conclusion}`, "Detailed logs were not included in the webhook payload.", "Configure a GitHub App installation token to fetch the workflow log archive."].join("\n");
}
