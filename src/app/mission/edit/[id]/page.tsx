import { stackServerApp } from "@/stack/server";

interface ViewMissionPageProps {
  params: Promise<{
    id: string;
  }>;
}
const EditMissionPage = async ({ params }: ViewMissionPageProps) => {
  await stackServerApp.getUser({ or: "redirect" });
  const { id } = await params;

  return <div>Mission {id}</div>;
};

export default EditMissionPage;
