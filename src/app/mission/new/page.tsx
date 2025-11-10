import { stackServerApp } from "@/stack/server";

export default async function NewMissionPage() {
  await stackServerApp.getUser({ or: "redirect" });

  return <div>New Mission</div>;
}
