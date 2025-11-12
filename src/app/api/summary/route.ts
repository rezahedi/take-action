import { eq, isNull } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import summarizeMission from "@/ai/summarize";
import redis from "@/cache";
import db from "@/db";
import { missions } from "@/db/schema";

export async function GET(req: NextRequest) {
  if (
    process.env.NODE_ENV !== "development" &&
    req.headers.get("authorization") !== `bearer ${process.env.CRON_SECRET}`
  )
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rows = await db
    .select({
      id: missions.id,
      title: missions.title,
      content: missions.content,
    })
    .from(missions)
    .limit(2)
    .where(isNull(missions.summary));

  let updated = 0;

  console.log("Starting AI summary job");

  for (const row of rows) {
    try {
      const summary = await summarizeMission(row.title, row.content);
      if (summary !== "") {
        await db
          .update(missions)
          .set({ summary })
          .where(eq(missions.id, row.id));
        updated++;
      }
    } catch (e) {
      console.error(`Failed to summarize id ${row.id}`, e);
    }
  }

  if (updated > 0) {
    try {
      await redis.del("missions:all");
    } catch (e) {
      console.warn("Failed to clear missions cache", e);
    }
  }

  console.log(`Concluding AI summary job, updated ${updated} rows`);

  return NextResponse.json({ ok: true, updated });
}
