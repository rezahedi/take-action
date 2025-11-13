import { eq, sql } from "drizzle-orm";
import { usersSync } from "drizzle-orm/neon";
import redis from "@/cache";
import db from "@/db";
import { actionStats, actions, missions } from "@/db/schema";

export type MissionList = {
  id: number;
  title: string;
  summary: string | null;
  author: string | null;
  imageUrl?: string | null;
  createdAt: string;
};

export async function getMissions(): Promise<MissionList[]> {
  const cached: MissionList[] | null = await redis.get("missions:all");
  if (cached) {
    console.log("Get missions cache hit!");
    return cached;
  }
  console.log("Get missions cache miss!");

  const response = await db
    .select({
      id: missions.id,
      title: missions.title,
      summary: missions.summary,
      author: usersSync.name,
      imageUrl: missions.imageUrl,
      createdAt: missions.createdAt,
    })
    .from(missions)
    .leftJoin(usersSync, eq(missions.authorId, usersSync.id));

  await redis.set("missions:all", response, {
    ex: 60,
  });

  return response;
}

export type MissionWithDetail = {
  id: number;
  title: string;
  content: string;
  summary: string | null;
  createdAt: string;
  imageUrl?: string | null;
  author: string | null;
  actions: { id: number; title: string; content: string; count: number }[];
};

export async function getMissionById(
  id: number,
): Promise<MissionWithDetail | null> {
  const response = await db
    .select({
      id: missions.id,
      title: missions.title,
      content: missions.content,
      summary: missions.summary,
      imageUrl: missions.imageUrl,
      author: usersSync.name,
      createdAt: missions.createdAt,

      actionId: actions.id,
      actionTitle: actions.title,
      actionContent: actions.content,
      actionCount: sql<number>`COUNT(${actionStats.id})`.as("action_count"),
    })
    .from(missions)
    .where(eq(missions.id, id))
    .leftJoin(usersSync, eq(missions.authorId, usersSync.id))
    .leftJoin(actions, eq(missions.id, actions.missionId))
    .leftJoin(actionStats, eq(actions.id, actionStats.actionId))
    .groupBy(missions.id, usersSync.id, actions.id);

  if (response.length === 0) return null;

  const groupedData: MissionWithDetail = {
    ...response[0],
    actions: response
      .filter((r) => r.actionId !== null)
      .map((r) => ({
        // biome-ignore lint/style/noNonNullAssertion: null actionIds filtered out before
        id: r.actionId!,
        title: r.actionTitle || "",
        content: r.actionContent || "",
        count: r.actionCount,
      })),
  };

  return groupedData;
}
