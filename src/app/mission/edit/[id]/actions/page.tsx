import { notFound } from "next/navigation";
import ActionsEditor from "@/components/ActionsEditor";
import MissionEditor from "@/components/MissionEditor";
import { getMissionById } from "@/lib/data/missions";
import { stackServerApp } from "@/stack/server";

interface EditMissionPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditActionsPage({
  params,
}: EditMissionPageProps) {
  const { id } = await params;
  const _user = await stackServerApp.getUser({ or: "redirect" });

  // we'll uncomment this later when the missions have real IDs
  // if (user.id !== id) {
  //   stackServerApp.redirectToHome();
  // }

  // In a real app, you would fetch the mission data here
  // For now, we'll just show some mock data if it's not "new"
  if (id === "new") {
    return <MissionEditor isEditing={true} missionId={id} />;
  }

  const mission = await getMissionById(+id);
  if (!mission) {
    notFound();
  }
  return (
    <ActionsEditor
      initialActions={mission.actions}
      isEditing={true}
      missionId={id}
    />
  );
}
