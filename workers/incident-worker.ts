import { Worker } from "bullmq";
import { analyseFailure } from "@/lib/analyser";
import { saveIncidentAnalysis } from "@/lib/incidents";
import { getRedisConnection, INCIDENT_QUEUE_NAME, type IncidentJob } from "@/lib/queue";

const connection = getRedisConnection();
if (!connection) throw new Error("REDIS_URL is required to start the incident worker");

const worker = new Worker<IncidentJob>(INCIDENT_QUEUE_NAME, async (job) => {
  const analysis = await analyseFailure(job.data.input);
  await saveIncidentAnalysis(job.data.incidentId, analysis);
  return { incidentId: job.data.incidentId, confidence: analysis.confidence };
}, { connection, concurrency: 5 });

worker.on("completed", (job) => console.info(`Incident analysis completed: ${job.id}`));
worker.on("failed", (job, error) => console.error(`Incident analysis failed: ${job?.id}`, error));

async function shutdown(signal: string) {
  console.info(`Received ${signal}; closing worker`);
  await worker.close();
  process.exit(0);
}
process.on("SIGTERM", () => void shutdown("SIGTERM"));
process.on("SIGINT", () => void shutdown("SIGINT"));
