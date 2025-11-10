interface ViewMissionPageProps {
  params: Promise<{
    id: string;
  }>;
}
const ViewMissionPage = async ({ params }: ViewMissionPageProps) => {
  const { id } = await params;

  return <div>Mission {id}</div>;
};

export default ViewMissionPage;
