import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Video } from "lucide-react";
import {
  SessionWithShots,
  SHOT_TYPE_LABELS,
  MOOD_EMOJIS,
  MOOD_LABELS,
  ShotType,
} from "@/lib/types";

interface SessionCardProps {
  session: SessionWithShots;
}

export function SessionCard({ session }: SessionCardProps) {
  const totalMade = session.shot_logs.reduce((sum, log) => sum + log.made, 0);
  const totalMissed = session.shot_logs.reduce(
    (sum, log) => sum + log.missed,
    0
  );
  const total = totalMade + totalMissed;
  const percentage = total > 0 ? Math.round((totalMade / total) * 100) : 0;

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium">
            {format(new Date(session.date + "T12:00:00"), "dd MMM, EEE", {
              locale: ptBR,
            })}
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-sm">
              {MOOD_EMOJIS[session.mood]} {MOOD_LABELS[session.mood]}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <Badge variant="secondary">{percentage}% acerto</Badge>
          <Badge variant="outline">
            {totalMade}/{total} cestas
          </Badge>
          {session.duration_minutes > 0 && (
            <Badge variant="outline">{session.duration_minutes}min</Badge>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {session.shot_logs
            .filter((log) => log.made + log.missed > 0)
            .map((log) => {
              const logTotal = log.made + log.missed;
              const logPct = Math.round((log.made / logTotal) * 100);
              return (
                <span
                  key={log.shot_type}
                  className="text-[11px] text-muted-foreground"
                >
                  {SHOT_TYPE_LABELS[log.shot_type as ShotType]}: {logPct}%
                </span>
              );
            })}
        </div>

        {session.notes && (
          <p className="mt-2 text-xs text-muted-foreground italic">
            {session.notes}
          </p>
        )}

        {session.video_url && (
          <a
            href={session.video_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center gap-1.5 text-xs text-primary hover:underline"
          >
            <Video className="h-3.5 w-3.5" />
            Ver video do treino
          </a>
        )}
      </CardContent>
    </Card>
  );
}
