import re
from dataclasses import dataclass
from typing import Pattern
from fastapi import FastAPI
from .models import AnalysisInput, AnalysisResult, Evidence

app = FastAPI(title="OpsPilot Analysis Service", version="0.1.0", description="Produces structured, evidence-backed analysis of CI/CD failures.")

@dataclass(frozen=True)
class Rule:
    pattern: Pattern[str]
    category: str
    severity: str
    root_cause: str
    fix: str
    files: list[str]

RULES = [
    Rule(re.compile(r"(must supply|missing|undefined).*(api[_ -]?secret|environment|env var|token)", re.I), "ENVIRONMENT_CONFIGURATION", "HIGH", "A required deployment secret or environment variable is missing or incorrectly mapped.", "Verify the variable in the deployment environment and map the same name in the workflow configuration.", [".github/workflows/*.yml", ".env.example", "src/config/*"]),
    Rule(re.compile(r"cannot find module|module not found|eresolve|dependency conflict", re.I), "DEPENDENCY", "HIGH", "The build cannot resolve a dependency or contains incompatible versions.", "Align package versions, regenerate the lockfile and reinstall in a clean environment.", ["package.json", "package-lock.json", "pnpm-lock.yaml"]),
    Rule(re.compile(r"type error|typescript|failed to compile|build failed", re.I), "BUILD", "HIGH", "The application failed compilation or static type validation.", "Correct the first reported source error and rerun the production build.", ["tsconfig.json", "src/**/*", "app/**/*"]),
    Rule(re.compile(r"econnrefused|database.*(failed|unavailable)|prisma.*p\d{4}|connection timed out", re.I), "DATABASE", "CRITICAL", "The application could not establish or maintain its database connection.", "Validate DATABASE_URL, database health, network access and migration state.", ["prisma/schema.prisma", "src/lib/db.*", ".env.example"]),
    Rule(re.compile(r"health check failed|deployment failed|container.*exited|port.*not bound", re.I), "DEPLOYMENT", "CRITICAL", "The deployed service did not become healthy or its container exited.", "Inspect runtime logs, bind to the platform PORT and verify the health-check route.", ["Dockerfile", "docker-compose.yml", "render.yaml", "vercel.json"])
]

def analyse_with_rules(data: AnalysisInput) -> AnalysisResult:
    lines = data.log.splitlines()
    for rule in RULES:
        matches = [Evidence(source="workflow-log", line=line.strip(), lineNumber=index + 1) for index, line in enumerate(lines) if rule.pattern.search(line)][:5]
        if matches:
            workflow = data.workflowName or "Workflow"
            return AnalysisResult(category=rule.category, severity=rule.severity, confidence=0.92 if len(matches) > 1 else 0.84, rootCause=rule.root_cause, summary=f"{workflow} failed in {data.repository}: {rule.root_cause}", suggestedFix=rule.fix, filesToInspect=rule.files, evidence=matches, recommendedSteps=[rule.fix, f"Inspect {rule.files[0]}.", "Rerun the workflow and verify that the original evidence does not recur."])
    first_line = next((line.strip() for line in lines if line.strip()), "No useful log line available")
    return AnalysisResult(category="UNKNOWN", severity="MEDIUM", confidence=0.35, rootCause="The available evidence is insufficient to identify a reliable root cause.", summary=f"Additional logs are required for {data.repository}.", suggestedFix="Fetch the full job log and locate the earliest error before the final exit message.", filesToInspect=[".github/workflows/*.yml"], evidence=[Evidence(source="workflow-log", line=first_line)], recommendedSteps=["Download the complete failed job log.", "Locate the first actionable error.", "Apply the smallest verified fix and rerun the workflow."])

@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "service": "opspilot-analysis"}

@app.post("/v1/analyse", response_model=AnalysisResult)
def analyse(data: AnalysisInput) -> AnalysisResult:
    return analyse_with_rules(data)
