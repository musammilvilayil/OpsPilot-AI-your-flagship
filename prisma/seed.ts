import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.upsert({
    where: { email: "musammil@opspilot.dev" },
    update: { name: "Muhammad Musammil" },
    create: { email: "musammil@opspilot.dev", name: "Muhammad Musammil" }
  });
  const repository = await prisma.repository.upsert({
    where: { githubId: 1312622972n }, update: {},
    create: { githubId: 1312622972n, fullName: "musammilvilayil/OpsPilot-AI-your-flagship", ownerId: user.id }
  });
  await prisma.incident.deleteMany({ where: { repositoryId: repository.id } });
  await prisma.incident.create({
    data: {
      repositoryId: repository.id,
      title: "CI database connection failed",
      summary: "The integration test job could not reach PostgreSQL.",
      workflowName: "CI", branch: "agent/initial-mvp", commitSha: "demo123",
      severity: "CRITICAL", category: "DATABASE", confidence: 0.91,
      rootCause: "PostgreSQL was not healthy before Prisma migrations started.",
      suggestedFix: "Add a service health check and wait for PostgreSQL before running migrations.",
      rawLog: "P1001: Can't reach database server at postgres:5432",
      evidence: { create: [{ source: "workflow-log", line: "P1001: Can't reach database server at postgres:5432", lineNumber: 74 }] },
      actions: { create: [{ label: "Add PostgreSQL health check" }, { label: "Run prisma migrate deploy" }, { label: "Rerun CI workflow" }] }
    }
  });
}

main().then(() => console.info("OpsPilot demo data seeded")).finally(async () => prisma.$disconnect());
