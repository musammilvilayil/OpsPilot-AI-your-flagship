import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    app: "ok",
    databaseConfigured: Boolean(process.env.DATABASE_URL),
    redisConfigured: Boolean(process.env.REDIS_URL),
    aiServiceConfigured: Boolean(process.env.AI_SERVICE_URL),
    timestamp: new Date().toISOString()
  }, { headers: { "cache-control": "no-store" } });
}
