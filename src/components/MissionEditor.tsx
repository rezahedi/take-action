"use client";

import { Upload, X } from "lucide-react";
import { useState } from "react";
import { createMission, updateMission } from "@/app/actions/missions";
import { uploadFile } from "@/app/actions/upload";
import { Button } from "./ui/button";

interface MissionEditorProps {
  initialTitle?: string;
  initialContent?: string;
  isEditing?: boolean;
  missionId?: string;
}

interface FormErrors {
  title?: string;
  content?: string;
}

export default function MissionEditor({
  initialTitle = "",
  initialContent = "",
  isEditing = false,
  missionId,
}: MissionEditorProps) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!content.trim()) {
      newErrors.content = "Content is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (selectedFiles) {
      const newFiles = Array.from(selectedFiles);
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  // Remove file
  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Handle form submission using Server Actions
  // We import server actions and call them from the client component.
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      let imageUrl: string | undefined;

      // If there's at least one file, upload the first one via server action
      if (files.length > 0) {
        const fd = new FormData();
        fd.append("files", files[0]);
        // uploadFile is a server action imported below
        const uploaded = await uploadFile(fd);
        imageUrl = uploaded?.url;
      }

      const payload = {
        title: title.trim(),
        content: content.trim(),
        authorId: "user-1", // TODO: wire real user id
        imageUrl,
      };

      if (isEditing && missionId) {
        await updateMission(missionId, payload);
        alert("Article updated (stub)");
      } else {
        await createMission(payload);
        alert("Article created (stub)");
      }
    } catch (err) {
      console.error("Error submitting article:", err);
      alert("Failed to submit article");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    // In a real app, you would navigate back
    const shouldLeave = window.confirm(
      "Are you sure you want to cancel? Any unsaved changes will be lost.",
    );
    if (shouldLeave) {
      console.log("User cancelled editing");
      // navigation logic would go here
    }
  };

  const pageTitle = isEditing ? "Edit Mission" : "Create New Mission";

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{pageTitle}</h1>
        {isEditing && missionId && (
          <p className="text-muted-foreground mt-2">
            Editing mission ID: {missionId}
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title Section */}
        <div>
          <label htmlFor="title">Title *</label>
          <input
            id="title"
            type="text"
            placeholder="Enter article title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={errors.title ? "border-destructive" : ""}
          />
          {errors.title && <p className="text-destructive">{errors.title}</p>}
        </div>

        {/* Content Section */}
        <div>
          <label htmlFor="content">Content *</label>
          <div className={errors.content ? "border-destructive" : ""}>
            <textarea
              id="content"
              placeholder="Write your mission content..."
              style={{ fontSize: 14, lineHeight: 1.5 }}
              autoCapitalize="off"
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              value={content}
              className="w-full resize-y"
              onChange={(val) => setContent(val.target.value || "")}
            />
          </div>
          {errors.content && (
            <p className="text-sm text-destructive">{errors.content}</p>
          )}
        </div>

        {/* File Upload Section */}
        <div>
          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
            <Upload className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
            <div className="space-y-2">
              <label htmlFor="file-upload">Click to upload files</label>
              <p className="text-xs text-muted-foreground">
                Upload images, documents, or other files to attach to your
                article
              </p>
            </div>
            <input
              id="file-upload"
              type="file"
              multiple
              onChange={handleFileUpload}
              className="sr-only"
            />
          </div>

          {/* Display uploaded files */}
          {files.length > 0 && (
            <div>
              <label htmlFor="file-upload">Uploaded Files:</label>
              <div>
                {files.map((file, index) => (
                  <div
                    // biome-ignore lint/suspicious/noArrayIndexKey: the order won't change
                    key={index}
                  >
                    <div>
                      <span>{file.name}</span>
                      <span>({(file.size / 1024).toFixed(1)} KB)</span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                    >
                      <X />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div>
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="min-w-[100px]"
          >
            {isSubmitting ? "Saving..." : "Save Mission"}
          </Button>
        </div>
      </form>
    </div>
  );
}
