import { eq } from "drizzle-orm";
import { usersSync } from "drizzle-orm/neon";
import db from "@/db";
import { missions } from "@/db/schema";

export async function getMissions() {
  const response = await db
    .select({
      id: missions.id,
      title: missions.title,
      content: missions.content,
      author: usersSync.name,
      createdAt: missions.createdAt,
    })
    .from(missions)
    .leftJoin(usersSync, eq(missions.authorId, usersSync.id));
  return response;
}

export async function getMissionById(id: number) {
  const response = await db
    .select({
      id: missions.id,
      title: missions.title,
      content: missions.content,
      imageUrl: missions.imageUrl,
      author: usersSync.name,
      createdAt: missions.createdAt,
    })
    .from(missions)
    .where(eq(missions.id, id))
    .leftJoin(usersSync, eq(missions.authorId, usersSync.id));

  return response[0] ? response[0] : null;
}
