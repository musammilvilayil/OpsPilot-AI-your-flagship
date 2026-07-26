import { describe, expect, it } from "vitest";
import { analyseWithRules } from "@/lib/analyser";

const base = { repository: "musammilvilayil/Megham", workflowName: "Deploy", branch: "main", commitSha: "abc123" };

describe("evidence-backed analyser", () => {
  it("detects missing deployment secrets", () => {
    const result = analyseWithRules({ ...base, log: "Building application\nError: Must supply api_secret environment variable\nProcess exited with code 1" });
    expect(result.category).toBe("ENVIRONMENT_CONFIGURATION");
    expect(result.severity).toBe("HIGH");
    expect(result.evidence[0].line).toContain("api_secret");
    expect(result.filesToInspect).toContain(".github/workflows/*.yml");
  });
  it("returns a safe low-confidence fallback for insufficient evidence", () => {
    const result = analyseWithRules({ ...base, log: "Process exited with code 1" });
    expect(result.category).toBe("UNKNOWN");
    expect(result.confidence).toBeLessThan(0.5);
    expect(result.rootCause).toContain("insufficient");
  });
});
