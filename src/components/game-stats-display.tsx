import { Badge } from "@/components/ui/badge";
import { PlayerStats, STAT_SHORT_LABELS } from "@/lib/types";

interface GameStatsDisplayProps {
  stats: PlayerStats;
  minutes?: number;
  fouls?: number;
}

export function GameStatsDisplay({ stats, minutes, fouls }: GameStatsDisplayProps) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {(Object.keys(STAT_SHORT_LABELS) as (keyof PlayerStats)[]).map((key) => (
        <Badge key={key} variant="secondary" className="text-[11px]">
          {stats[key]} {STAT_SHORT_LABELS[key]}
        </Badge>
      ))}
      {minutes !== undefined && minutes > 0 && (
        <Badge variant="secondary" className="text-[11px]">
          {minutes} MIN
        </Badge>
      )}
      {fouls !== undefined && fouls > 0 && (
        <Badge variant="secondary" className="text-[11px]">
          {fouls} FAL
        </Badge>
      )}
    </div>
  );
}
