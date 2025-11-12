"use server";

import redis from "@/cache";

const keyFor = (id: number) => `pageviews:articles${id}`;

export async function incrementPageview(missionId: number) {
  const missionKey = keyFor(missionId);
  const newVal = await redis.incr(missionKey);
  return Number(newVal);
}
