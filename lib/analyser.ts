import { z } from "zod";
import type { AnalysisInput, IncidentAnalysis, IncidentCategory, Severity } from "@/lib/types";

const serviceResponseSchema = z.object({
  category: z.enum(["ENVIRONMENT_CONFIGURATION", "DEPENDENCY", "BUILD", "TEST", "DATABASE", "AUTHENTICATION", "DEPLOYMENT", "UNKNOWN"]),
  severity: z.enum(["CRITICAL", "HIGH", "MEDIUM", "LOW"]),
  confidence: z.number().min(0).max(1),
  rootCause: z.string(),
  summary: z.string(),
  suggestedFix: z.string(),
  filesToInspect: z.array(z.string()),
  evidence: z.array(z.object({ source: z.string(), line: z.string(), lineNumber: z.number().optional() })),
  recommendedSteps: z.array(z.string())
});

type Rule = { pattern: RegExp; category: IncidentCategory; severity: Severity; rootCause: string; fix: string; files: string[] };

const rules: Rule[] = [
  {
    pattern: /(must supply|missing|undefined).*(api[_ -]?secret|environment|env var|token)/i,
    category: "ENVIRONMENT_CONFIGURATION",
    severity: "HIGH",
    rootCause: "A required deployment secret or environment variable is missing or incorrectly mapped.",
    fix: "Verify the variable in the deployment environment and map the same name in the workflow configuration.",
    files: [".github/workflows/*.yml", ".env.example", "src/config/*"]
  },
  {
    pattern: /(cannot find module|module not found|eresolve|dependency conflict)/i,
    category: "DEPENDENCY",
    severity: "HIGH",
    rootCause: "The build cannot resolve a dependency or the dependency graph contains incompatible versions.",
    fix: "Inspect the lockfile and package manifest, align package versions, then reinstall dependencies in a clean environment.",
    files: ["package.json", "package-lock.json", "pnpm-lock.yaml"]
  },
  {
    pattern: /(type error|typescript|failed to compile|build failed)/i,
    category: "BUILD",
    severity: "HIGH",
    rootCause: "The application failed during compilation or static type validation.",
    fix: "Open the first referenced source file, correct the reported type or import error, and rerun the build locally.",
    files: ["tsconfig.json", "src/**/*", "app/**/*"]
  },
  {
    pattern: /(test failed|assertionerror|expected .* received|pytest)/i,
    category: "TEST",
    severity: "MEDIUM",
    rootCause: "An automated test assertion failed and blocked the workflow.",
    fix: "Reproduce the failing test, compare expected and actual behaviour, then fix the implementation or outdated assertion.",
    files: ["tests/**/*", "vitest.config.*", "pytest.ini"]
  },
  {
    pattern: /(econnrefused|database.*(failed|unavailable)|prisma.*p\d{4}|connection timed out)/i,
    category: "DATABASE",
    severity: "CRITICAL",
    rootCause: "The application could not establish or maintain its database connection.",
    fix: "Validate DATABASE_URL, network access and migration state before retrying the deployment.",
    files: ["prisma/schema.prisma", "src/lib/db.*", ".env.example"]
  },
  {
    pattern: /(unauthorized|forbidden|invalid signature|jwt.*expired)/i,
    category: "AUTHENTICATION",
    severity: "CRITICAL",
    rootCause: "An authentication credential, token or webhook signature was rejected.",
    fix: "Rotate or remap the credential, verify token audience and expiry, and confirm signature generation uses the raw request body.",
    files: ["src/lib/auth.*", "src/middleware.*", "app/api/**/*"]
  },
  {
    pattern: /(health check failed|deployment failed|container.*exited|port.*not bound)/i,
    category: "DEPLOYMENT",
    severity: "CRITICAL",
    rootCause: "The deployed service did not become healthy or its container exited unexpectedly.",
    fix: "Inspect runtime logs, confirm the service binds to the platform PORT, and validate the health-check path.",
    files: ["Dockerfile", "docker-compose.yml", "render.yaml", "vercel.json"]
  }
];

function buildEvidence(log: string, pattern: RegExp) {
  return log.split("\n").map((line, index) => ({ line, index })).filter(({ line }) => pattern.test(line)).slice(0, 5).map(({ line, index }) => ({ source: "workflow-log", line: line.trim(), lineNumber: index + 1 }));
}

export function analyseWithRules(input: AnalysisInput): IncidentAnalysis {
  const match = rules.find((rule) => rule.pattern.test(input.log));
  if (!match) {
    const fallbackLine = input.log.split("\n").find((line) => line.trim()) ?? "No useful log line was available.";
    return {
      category: "UNKNOWN", severity: "MEDIUM", confidence: 0.35,
      rootCause: "The available evidence is insufficient to identify a reliable root cause.",
      summary: `${input.workflowName ?? "Workflow"} failed for ${input.repository}, but additional logs are required.`,
      suggestedFix: "Fetch the complete job log and inspect the earliest error before the final process exit message.",
      filesToInspect: [".github/workflows/*.yml"],
      evidence: [{ source: "workflow-log", line: fallbackLine }],
      recommendedSteps: ["Download the complete failed job log.", "Locate the first error rather than the final exit-code message.", "Rerun the workflow after applying the smallest verified fix."]
    };
  }
  const evidence = buildEvidence(input.log, match.pattern);
  return {
    category: match.category, severity: match.severity, confidence: evidence.length > 1 ? 0.92 : 0.82,
    rootCause: match.rootCause,
    summary: `${input.workflowName ?? "Workflow"} failed in ${input.repository}: ${match.rootCause}`,
    suggestedFix: match.fix,
    filesToInspect: match.files,
    evidence: evidence.length ? evidence : [{ source: "workflow-log", line: input.log.split("\n")[0] ?? "Failure detected" }],
    recommendedSteps: [match.fix, `Inspect ${match.files.slice(0, 2).join(" and ")}.`, "Rerun the failed workflow and confirm the same error does not recur."]
  };
}

export async function analyseFailure(input: AnalysisInput): Promise<IncidentAnalysis> {
  const serviceUrl = process.env.AI_SERVICE_URL;
  if (!serviceUrl) return analyseWithRules(input);
  try {
    const response = await fetch(`${serviceUrl.replace(/\/$/, "")}/v1/analyse`, {
      method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(input), signal: AbortSignal.timeout(8000)
    });
    if (!response.ok) throw new Error(`AI service returned ${response.status}`);
    return serviceResponseSchema.parse(await response.json());
  } catch (error) {
    console.warn("AI service unavailable; using deterministic analyser", error);
    return analyseWithRules(input);
  }
}
