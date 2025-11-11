"use server";

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

  console.log("Creating mission", data);

  return { success: true, message: "Mission created" };
}

export async function updateMission(_id: string, data: UpdateMissionInput) {
  const user = await stackServerApp.getUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  console.log("Updating mission", data);

  return { success: true, message: "Mission updated" };
}

export async function deleteMission(id: string) {
  const user = await stackServerApp.getUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  console.log("Deleting mission", id);

  return { success: true, message: "Mission deleted" };
}
