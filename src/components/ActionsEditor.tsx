"use client";

import EditAction from "@/components/EditAction";
import type { MissionAction } from "@/lib/data/missions";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

const ActionsEditor = ({
  initialActions = [],
  isEditing = false,
  missionId,
}: {
  initialActions: MissionAction[];
  isEditing?: boolean;
  missionId?: string;
}) => {
  const handleChange = (src: string) => {
    console.log("handleChange", src, missionId);
  };
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Edit Actions</h1>
        {isEditing && missionId && (
          <p className="text-muted-foreground mt-2">
            Editing mission ID: {missionId}
          </p>
        )}
      </div>

      <form className="space-y-6">
        <div className="space-y-4">
          {initialActions.length > 0 &&
            initialActions.map((action) => (
              <EditAction
                key={action.id}
                action={action}
                onTitleChange={handleChange}
                onContentChange={handleChange}
              />
            ))}
        </div>

        {/* Action Buttons */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline">
                Cancel
              </Button>
              <Button type="submit" className="min-w-[100px]">
                Save Actions
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

export default ActionsEditor;
