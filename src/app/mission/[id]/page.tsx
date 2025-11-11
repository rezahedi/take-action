import NotFound from "@/app/not-found";
import MissionViewer from "@/components/MissionViewer";
import { getMissionById } from "@/lib/data/missions";

interface ViewMissionPageProps {
  params: Promise<{
    id: string;
  }>;
}
const ViewMissionPage = async ({ params }: ViewMissionPageProps) => {
  const { id } = await params;

  // Mock permission check - in a real app, this would come from auth/user context
  const canEdit = true; // Set to true for demonstration

  const mission = await getMissionById(Number(id));

  if (!mission) return NotFound();

  return <MissionViewer mission={mission} canEdit={canEdit} />;
};

export default ViewMissionPage;
