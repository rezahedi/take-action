"use server";

import db from "@/db";
import { actionStats } from "@/db/schema";
import { stackServerApp } from "@/stack/server";

export async function markActionDone(actionId: number) {
  const user = await stackServerApp.getUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const response = await db
    .insert(actionStats)
    .values({
      actionId: actionId,
      userId: user.id,
    })
    .returning({ insertedId: actionStats.id });

  if (response.length !== 1) return false;

  return true;
}
