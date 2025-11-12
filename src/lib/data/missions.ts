import { eq } from "drizzle-orm";
import { usersSync } from "drizzle-orm/neon";
import redis from "@/cache";
import db from "@/db";
import { missions } from "@/db/schema";

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

export type MissionWithAuthor = {
  id: number;
  title: string;
  content: string;
  summary: string;
  createdAt: string;
  imageUrl?: string | null;
  author: string | null;
};

export async function getMissionById(id: number) {
  const response = await db
    .select({
      id: missions.id,
      title: missions.title,
      content: missions.content,
      summary: missions.summary,
      imageUrl: missions.imageUrl,
      author: usersSync.name,
      createdAt: missions.createdAt,
    })
    .from(missions)
    .where(eq(missions.id, id))
    .leftJoin(usersSync, eq(missions.authorId, usersSync.id));

  return response[0] ? response[0] : null;
}
