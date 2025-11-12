import { eq } from "drizzle-orm";
import { usersSync } from "drizzle-orm/neon";
import db from "@/db";
import { missions } from "@/db/schema";
import resend from "@/email";
import CelebrationTemplate from "@/email/templates/Celebration";

const BASE_URL = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : `http://localhost:3000`;

export default async function sendCelebrationEmail(
  missionId: number,
  pageviews: number,
) {
  const response = await db
    .select({
      email: usersSync.email,
      id: usersSync.id,
      title: missions.title,
      name: usersSync.name,
    })
    .from(missions)
    .leftJoin(usersSync, eq(missions.authorId, usersSync.id))
    .where(eq(missions.id, missionId));

  const { email, id, title, name } = response[0];
  if (!email) {
    console.log(
      `Skipping sending a celebration for getting ${pageviews} on mission ${missionId}, could not find email`,
    );
    return;
  }

  const emailRes = await resend.emails.send({
    from: "Take Action <noreply@rezahedi.dev>", // replace with your domain when ready
    to: email,
    subject: `✨ Your mission got ${pageviews} views! ✨`,
    react: (
      <CelebrationTemplate
        missionTitle={title}
        missionUrl={`${BASE_URL}/mission/${missionId}`}
        name={name ?? "Friend"}
        pageviews={pageviews}
      />
    ),
  });

  if (!emailRes.error) {
    console.log(
      `Sent ${id} a celebration for getting ${pageviews} on mission ${missionId}`,
    );
  } else {
    console.log(
      `Error sending ${id} a celebration for getting ${pageviews} on mission ${missionId}`,
      emailRes.error,
    );
  }
}
