export const mockIncidents = [
  {
    id: "demo-cloudinary-secret", title: "Deploy MEGHAM to production",
    summary: "Deploy workflow failed because CLOUDINARY_API_SECRET was not available to the build step.",
    repository: { fullName: "musammilvilayil/Megham" }, workflowName: "Production Deploy", branch: "main", commitSha: "a82f91d",
    status: "OPEN", severity: "HIGH", category: "ENVIRONMENT_CONFIGURATION", confidence: 0.93,
    detectedAt: new Date(Date.now() - 12 * 60_000),
    rootCause: "A required Cloudinary deployment secret is missing from the workflow environment.",
    suggestedFix: "Add CLOUDINARY_API_SECRET to repository or deployment secrets and map it in deploy.yml.",
    evidence: [{ id: "e1", source: "workflow-log", line: "Error: Must supply api_secret", lineNumber: 118 }],
    actions: [
      { id: "a1", label: "Verify CLOUDINARY_API_SECRET exists", completed: false },
      { id: "a2", label: "Map the secret in deploy.yml", completed: false },
      { id: "a3", label: "Rerun Production Deploy", completed: false }
    ]
  },
  {
    id: "demo-prisma-db", title: "Run integration tests",
    summary: "Integration tests could not connect to PostgreSQL during CI.",
    repository: { fullName: "musammilvilayil/OpsPilot-AI-your-flagship" }, workflowName: "CI", branch: "agent/initial-mvp", commitSha: "22b4cc1",
    status: "INVESTIGATING", severity: "CRITICAL", category: "DATABASE", confidence: 0.88,
    detectedAt: new Date(Date.now() - 54 * 60_000),
    rootCause: "The test job started before PostgreSQL became healthy.",
    suggestedFix: "Add a database health check and wait condition before running Prisma migrations.",
    evidence: [{ id: "e2", source: "workflow-log", line: "P1001: Can't reach database server at postgres:5432", lineNumber: 74 }],
    actions: [{ id: "a4", label: "Add PostgreSQL health check", completed: true }, { id: "a5", label: "Run prisma migrate deploy", completed: false }]
  },
  {
    id: "demo-typescript", title: "Build Projexify web application",
    summary: "Next.js compilation stopped on an invalid TypeScript property.",
    repository: { fullName: "musammilvilayil/Projexify" }, workflowName: "Build and Test", branch: "main", commitSha: "bf091aa",
    status: "RESOLVED", severity: "MEDIUM", category: "BUILD", confidence: 0.97,
    detectedAt: new Date(Date.now() - 4 * 60 * 60_000),
    rootCause: "The dashboard component referenced a property absent from the API response type.",
    suggestedFix: "Update the response type and guard optional fields.",
    evidence: [{ id: "e3", source: "workflow-log", line: "Type error: Property 'ownerName' does not exist", lineNumber: 203 }],
    actions: [{ id: "a6", label: "Update ProjectResponse type", completed: true }, { id: "a7", label: "Confirm production build", completed: true }]
  }
] as const;

export async function getDashboardData() {
  try {
    const { prisma } = await import("@/lib/db");
    const incidents = await prisma.incident.findMany({ include: { repository: true, evidence: true, actions: true }, orderBy: { detectedAt: "desc" }, take: 12 });
    if (incidents.length > 0) return incidents;
  } catch (error) { console.warn("Database unavailable; rendering portfolio demo data", error); }
  return [...mockIncidents];
}

export async function getIncident(id: string) {
  try {
    const { prisma } = await import("@/lib/db");
    const incident = await prisma.incident.findUnique({ where: { id }, include: { repository: true, evidence: true, actions: true } });
    if (incident) return incident;
  } catch (error) { console.warn("Database unavailable; rendering demo incident", error); }
  return mockIncidents.find((incident) => incident.id === id) ?? mockIncidents[0];
}
