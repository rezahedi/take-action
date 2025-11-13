import { useState } from "react";
import { markActionDone } from "@/app/actions/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { MissionAction } from "@/lib/data/missions";

const ActionCard = ({ action }: { action: MissionAction }) => {
  const [isMarked, setIsMarked] = useState<boolean>(action.isMarked);
  const [count, setCount] = useState<number>(action.count);

  const handleMarkDone = async () => {
    if (isMarked) return;

    setIsMarked(true);
    setCount(count + 1);
    await markActionDone(action.id);
  };

  return (
    <Card key={action.id}>
      <CardContent className="px-6">
        <h5 className="text-lg font-semibold">{action.title}</h5>
        <p>{action.content}</p>
        <div className="flex justify-end gap-2 pt-4">
          <Badge variant="secondary">
            {count > 0 ? String(count) : `No`} Change makers
          </Badge>
          <Button disabled={isMarked} onClick={handleMarkDone}>
            {isMarked ? `Marked` : `Mark as Done`}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActionCard;
