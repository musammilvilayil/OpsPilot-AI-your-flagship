export type Severity = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
export type IncidentCategory = "ENVIRONMENT_CONFIGURATION" | "DEPENDENCY" | "BUILD" | "TEST" | "DATABASE" | "AUTHENTICATION" | "DEPLOYMENT" | "UNKNOWN";
export type AnalysisEvidence = { source: string; line: string; lineNumber?: number };
export type IncidentAnalysis = {
  category: IncidentCategory;
  severity: Severity;
  confidence: number;
  rootCause: string;
  summary: string;
  suggestedFix: string;
  filesToInspect: string[];
  evidence: AnalysisEvidence[];
  recommendedSteps: string[];
};
export type AnalysisInput = { repository: string; workflowName?: string; branch?: string; commitSha?: string; log: string };
