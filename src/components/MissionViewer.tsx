"use client";

import { Calendar, ChevronRight, Edit, Eye, Home, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { incrementPageview } from "@/app/actions/pageviews";
import ActionsViewer from "@/components/ActionsViewer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { MissionWithDetail } from "@/lib/data/missions";

interface MissionViewerProps {
  mission: MissionWithDetail;
  canEdit?: boolean;
}

export default function MissionViewer({
  mission,
  canEdit = false,
}: MissionViewerProps) {
  const [localPageviews, setLocalPageviews] = useState<number>(0);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  useEffect(() => {
    (async () => {
      const newCount = await incrementPageview(mission.id);
      setLocalPageviews(newCount ?? null);
    })();
  }, [mission.id]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
        <Link
          href="/"
          className="flex items-center hover:text-foreground transition-colors"
        >
          <Home className="h-4 w-4 mr-1" />
          Home
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground font-medium">{mission.title}</span>
      </nav>

      {/* Mission Header */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex-1">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            {mission.title}
          </h1>

          {/* Mission Metadata */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center">
              <User className="h-4 w-4 mr-1" />
              <span>By {mission.author}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              <span>{formatDate(mission.createdAt)}</span>
            </div>
            <Badge variant="secondary">Mission</Badge>
            <div className="ml-3 flex items-center text-sm text-muted-foreground">
              <Eye className="size-4 mr-1" />
              <span>{localPageviews ? localPageviews : "-"}</span>
              <span className="ml-1">views</span>
            </div>
          </div>
        </div>

        {/* Edit Button - Only shown if user has edit permissions */}
        {canEdit && (
          <Link href={`/mission/edit/${mission.id}`} className="ml-4">
            <Button variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Edit Mission
            </Button>
          </Link>
        )}
      </div>

      {/* Mission Content */}
      <Card>
        <CardContent className="pt-6">
          {/* Mission Image - Display if exists */}
          {mission.imageUrl && (
            <div className="mb-8">
              <div className="relative w-full h-64 md:h-80 rounded-lg overflow-hidden">
                <Image
                  src={mission.imageUrl}
                  alt={`Image for ${mission.title}`}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          )}

          {/* Rendered Markdown Content */}
          <div className="prose prose-stone dark:prose-invert max-w-none">
            <ReactMarkdown
              components={{
                // Customize heading styles
                h1: ({ children }) => (
                  <h1 className="text-3xl font-bold mt-8 mb-4 text-foreground">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-2xl font-semibold mt-6 mb-3 text-foreground">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-xl font-semibold mt-4 mb-2 text-foreground">
                    {children}
                  </h3>
                ),
                // Customize paragraph styles
                p: ({ children }) => (
                  <p className="mb-4 text-foreground leading-7">{children}</p>
                ),
                // Customize list styles
                ul: ({ children }) => (
                  <ul className="mb-4 ml-6 list-disc text-foreground">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="mb-4 ml-6 list-decimal text-foreground">
                    {children}
                  </ol>
                ),
                li: ({ children }) => (
                  <li className="mb-1 text-foreground">{children}</li>
                ),
                // Customize code styles
                code: ({ children, className }) => {
                  const isInline = !className;
                  return isInline ? (
                    <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-foreground">
                      {children}
                    </code>
                  ) : (
                    <code className={className}>{children}</code>
                  );
                },
                pre: ({ children }) => (
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto mb-4 text-sm">
                    {children}
                  </pre>
                ),
                // Customize blockquote styles
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-muted-foreground pl-4 italic my-4 text-muted-foreground">
                    {children}
                  </blockquote>
                ),
                // Customize link styles
                a: ({ children, href }) => (
                  <a
                    href={href}
                    className="text-primary hover:underline font-medium"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {children}
                  </a>
                ),
                // Customize table styles
                table: ({ children }) => (
                  <div className="overflow-x-auto mb-4">
                    <table className="min-w-full border-collapse border border-border">
                      {children}
                    </table>
                  </div>
                ),
                th: ({ children }) => (
                  <th className="border border-border bg-muted px-4 py-2 text-left font-semibold">
                    {children}
                  </th>
                ),
                td: ({ children }) => (
                  <td className="border border-border px-4 py-2">{children}</td>
                ),
              }}
            >
              {mission.content}
            </ReactMarkdown>
          </div>
        </CardContent>
      </Card>

      <ActionsViewer actions={mission.actions} />

      {/* Footer Actions */}
      <div className="mt-8 flex justify-between items-center">
        <Link href="/">
          <Button variant="outline">← Back to Missions</Button>
        </Link>

        {canEdit && (
          <Link href={`/mission/edit/${mission.id}`}>
            <Button>
              <Edit className="h-4 w-4 mr-2" />
              Edit This Mission
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
