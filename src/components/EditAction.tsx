import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { MissionAction } from "@/lib/data/missions";

interface ActionErrors {
  title?: string;
  content?: string;
}

const EditAction = ({
  action,
  onTitleChange,
  onContentChange,
}: {
  action: MissionAction;
  onTitleChange: (str: string) => void;
  onContentChange: (str: string) => void;
}) => {
  const [errors, _setErrors] = useState<ActionErrors>({});

  return (
    <Card>
      <CardContent>
        <div className="space-y-2">
          <Label htmlFor={`title${action.id}`}>Title *</Label>
          <Input
            id={`title${action.id}`}
            type="text"
            placeholder="Enter mission title..."
            value={action.title}
            onChange={(e) => onTitleChange(e.target.value)}
            className={errors.title ? "border-destructive" : ""}
          />
          {errors.title && (
            <p className="text-sm text-destructive">{errors.title}</p>
          )}
          <Label htmlFor={`content${action.id}`}>Content *</Label>
          <Textarea
            id={`content${action.id}`}
            defaultValue={action.content}
            onChange={(e) => onContentChange(e.target.value)}
            className={errors.content ? "border-destructive" : ""}
          />
          {errors.content && (
            <p className="text-sm text-destructive">{errors.content}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EditAction;
