import { Queue, type ConnectionOptions } from "bullmq";
import type { AnalysisInput } from "@/lib/types";

export const INCIDENT_QUEUE_NAME = "incident-analysis";
let queue: Queue | null = null;

export function getRedisConnection(): ConnectionOptions | null {
  const redisUrl = process.env.REDIS_URL;
  if (!redisUrl) return null;
  const parsed = new URL(redisUrl);
  return {
    host: parsed.hostname,
    port: Number(parsed.port || 6379),
    username: parsed.username || undefined,
    password: parsed.password || undefined,
    db: parsed.pathname.length > 1 ? Number(parsed.pathname.slice(1)) : 0,
    tls: parsed.protocol === "rediss:" ? {} : undefined
  };
}

export function getIncidentQueue(): Queue | null {
  const connection = getRedisConnection();
  if (!connection) return null;
  queue ??= new Queue(INCIDENT_QUEUE_NAME, {
    connection,
    defaultJobOptions: { attempts: 3, backoff: { type: "exponential", delay: 2000 }, removeOnComplete: 100, removeOnFail: 500 }
  });
  return queue;
}

export type IncidentJob = { incidentId: string; input: AnalysisInput };
