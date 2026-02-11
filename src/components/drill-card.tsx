"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Circle, ChevronDown, ChevronUp } from "lucide-react";
import { Drill, SHOT_TYPE_LABELS } from "@/lib/types";

function getYoutubeId(url: string): string | null {
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([^&?/]+)/
  );
  return match ? match[1] : null;
}

interface DrillCardProps {
  drill: Drill;
  completed: boolean;
  onToggle: () => void;
}

export function DrillCard({ drill, completed, onToggle }: DrillCardProps) {
  const [expanded, setExpanded] = useState(false);
  const videoId = getYoutubeId(drill.youtube_url);
  const shotLabel =
    drill.shot_type === "warmup"
      ? "Aquecimento"
      : drill.shot_type === "combo"
        ? "Combo"
        : SHOT_TYPE_LABELS[drill.shot_type];

  return (
    <Card className={completed ? "border-green-500/30 bg-green-500/5" : ""}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <button onClick={onToggle} className="mt-0.5 shrink-0">
            {completed ? (
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            ) : (
              <Circle className="h-5 w-5 text-muted-foreground" />
            )}
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3
                className={`font-medium text-sm ${completed ? "line-through text-muted-foreground" : ""}`}
              >
                {drill.name}
              </h3>
              <Badge variant="secondary" className="text-[10px] shrink-0">
                {shotLabel}
              </Badge>
            </div>

            <p className="text-xs text-muted-foreground mb-2">
              {drill.sets}x{drill.reps} reps
            </p>

            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? (
                <>
                  <ChevronUp className="mr-1 h-3 w-3" />
                  Menos
                </>
              ) : (
                <>
                  <ChevronDown className="mr-1 h-3 w-3" />
                  Detalhes & Video
                </>
              )}
            </Button>

            {expanded && (
              <div className="mt-3 space-y-3">
                <p className="text-xs text-muted-foreground">
                  {drill.description}
                </p>
                {videoId && (
                  <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                    <iframe
                      src={`https://www.youtube.com/embed/${videoId}`}
                      title={drill.name}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute inset-0 h-full w-full"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
