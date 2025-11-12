"use server";

import redis from "@/cache";
import sendCelebrationEmail from "@/email/celebration-email";

const keyFor = (id: number) => `pageviews:articles${id}`;

const milestones = [10, 50, 100, 1000, 10000];

export async function incrementPageview(missionId: number) {
  const missionKey = keyFor(missionId);
  const newVal = await redis.incr(missionKey);

  if (milestones.includes(newVal)) sendCelebrationEmail(missionId, newVal); // Don't need await,

  return Number(newVal);
}
