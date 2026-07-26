from typing import Literal
from pydantic import BaseModel, Field

Category = Literal["ENVIRONMENT_CONFIGURATION", "DEPENDENCY", "BUILD", "TEST", "DATABASE", "AUTHENTICATION", "DEPLOYMENT", "UNKNOWN"]
Severity = Literal["CRITICAL", "HIGH", "MEDIUM", "LOW"]

class AnalysisInput(BaseModel):
    repository: str
    workflowName: str | None = None
    branch: str | None = None
    commitSha: str | None = None
    log: str = Field(min_length=1, max_length=500_000)

class Evidence(BaseModel):
    source: str
    line: str
    lineNumber: int | None = None

class AnalysisResult(BaseModel):
    category: Category
    severity: Severity
    confidence: float = Field(ge=0, le=1)
    rootCause: str
    summary: str
    suggestedFix: str
    filesToInspect: list[str]
    evidence: list[Evidence]
    recommendedSteps: list[str]
