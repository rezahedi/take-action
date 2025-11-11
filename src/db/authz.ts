import { eq } from "drizzle-orm";
import db from ".";
import { missions } from "./schema";

export async function authorizeUserToEditMission(
  loggedInUserId: string,
  missionId: number,
) {
  const response = await db
    .select({
      authorId: missions.authorId,
    })
    .from(missions)
    .where(eq(missions.id, missionId));

  if (!response.length) {
    return false;
  }

  return response[0].authorId === loggedInUserId;
}
