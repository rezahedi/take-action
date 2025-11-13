import type { MissionAction } from "@/lib/data/missions";
import ActionCard from "./ui/ActionCard";

const ActionsViewer = ({ actions }: { actions: MissionAction[] }) => {
  return (
    <div className="space-y-6 max-w-2xl">
      <h3 className="text-3xl font-bold my-4">Actions</h3>
      {actions.length > 0 &&
        actions.map((action) => <ActionCard key={action.id} action={action} />)}
    </div>
  );
};

export default ActionsViewer;
