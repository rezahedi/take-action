"use server";

import { eq } from "drizzle-orm";
import summarizeMission from "@/ai/summarize";
import redis from "@/cache";
import db from "@/db";
import { authorizeUserToEditMission } from "@/db/authz";
import { missions } from "@/db/schema";
import { stackServerApp } from "@/stack/server";

export type CreateMissionInput = {
  title: string;
  content: string;
  authorId: string;
  imageUrl?: string;
};

export type UpdateMissionInput = {
  title?: string;
  content?: string;
  imageUrl?: string;
};

export async function createMission(data: CreateMissionInput) {
  const user = await stackServerApp.getUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const summary = await summarizeMission(data.title || "", data.content || "");
  const response = await db
    .insert(missions)
    .values({
      title: data.title,
      content: data.content,
      slug: Date.now().toString(),
      published: true,
      authorId: user.id,
      imageUrl: data.imageUrl ?? undefined,
      summary,
    })
    .returning({ insertedId: missions.id });

  if (response.length !== 1)
    return { success: false, message: `Couldn't create the mission` };

  redis.del("missions:all");

  return {
    success: true,
    message: `Mission with ID ${response[0].insertedId} created`,
  };
}

export async function updateMission(id: string, data: UpdateMissionInput) {
  const user = await stackServerApp.getUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  if (!authorizeUserToEditMission(user.id, Number(id)))
    throw new Error("Forbidden");

  const summary = await summarizeMission(data.title || "", data.content || "");
  await db
    .update(missions)
    .set({
      title: data.title,
      content: data.content,
      imageUrl: data.imageUrl ?? undefined,
      summary: summary ?? undefined,
    })
    .where(eq(missions.id, Number(id)));

  redis.del("missions:all");

  return { success: true, message: `Mission ${id} deleted` };
}

export async function deleteMission(id: string) {
  const user = await stackServerApp.getUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  await db.delete(missions).where(eq(missions.id, Number(id)));

  redis.del("missions:all");

  return { success: true, message: `Mission ${id} deleted` };
}
