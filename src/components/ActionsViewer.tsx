import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

interface ActionProp {
  id: number;
  title: string;
  content: string;
  count: number;
}

const ActionsViewer = ({ actions }: { actions: ActionProp[] }) => {
  return (
    <div className="space-y-6 max-w-2xl">
      <h3 className="text-3xl font-bold my-4">Actions</h3>
      {actions.length > 0 &&
        actions.map((action) => (
          <Card key={action.id}>
            <CardContent className="px-6">
              <h5 className="text-lg font-semibold">{action.title}</h5>
              <p>{action.content}</p>
              <div className="flex justify-end gap-2 pt-4">
                <Badge variant="secondary">
                  {action.count > 0 ? action.count : `No`} Change makers
                </Badge>
                <Button>Mark as Done</Button>
              </div>
            </CardContent>
          </Card>
        ))}
    </div>
  );
};

export default ActionsViewer;
