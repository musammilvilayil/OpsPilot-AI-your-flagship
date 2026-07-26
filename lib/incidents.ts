import type { IncidentAnalysis } from "@/lib/types";
import { prisma } from "@/lib/db";

export async function saveIncidentAnalysis(incidentId: string, analysis: IncidentAnalysis) {
  return prisma.incident.update({
    where: { id: incidentId },
    data: {
      summary: analysis.summary,
      severity: analysis.severity,
      category: analysis.category,
      confidence: analysis.confidence,
      rootCause: analysis.rootCause,
      suggestedFix: analysis.suggestedFix,
      evidence: { deleteMany: {}, create: analysis.evidence },
      actions: { deleteMany: {}, create: analysis.recommendedSteps.map((label) => ({ label })) }
    },
    include: { evidence: true, actions: true, repository: true }
  });
}
