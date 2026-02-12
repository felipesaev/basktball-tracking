import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { MapPin, Clock } from "lucide-react";
import { OfficialGame, GAME_STATUS_LABELS } from "@/lib/types";
import { GameStatsDisplay } from "./game-stats-display";

interface OfficialGameCardProps {
  game: OfficialGame;
}

const statusVariant: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  scheduled: "secondary",
  completed: "default",
  cancelled: "destructive",
};

export function OfficialGameCard({ game }: OfficialGameCardProps) {
  const isCompleted = game.status === "completed";

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="font-medium">vs {game.opponent}</h3>
            <p className="text-sm text-muted-foreground">
              {format(new Date(game.date + "T12:00:00"), "dd MMM, EEE", {
                locale: ptBR,
              })}
              {game.time && ` - ${game.time}`}
            </p>
          </div>
          <Badge variant={statusVariant[game.status]}>
            {GAME_STATUS_LABELS[game.status]}
          </Badge>
        </div>

        {isCompleted && game.team_score !== null && game.opponent_score !== null && (
          <div className="mb-3 rounded-lg bg-muted/50 p-3 text-center">
            <span className="text-2xl font-bold">
              {game.team_score}
            </span>
            <span className="mx-2 text-muted-foreground">x</span>
            <span className="text-2xl font-bold">
              {game.opponent_score}
            </span>
            <p className="text-xs text-muted-foreground mt-1">
              {game.team_score > game.opponent_score ? "Vitoria" : game.team_score < game.opponent_score ? "Derrota" : "Empate"}
            </p>
          </div>
        )}

        <div className="flex items-center gap-3 mb-3 text-sm text-muted-foreground">
          {game.location && (
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {game.location}
            </span>
          )}
          {isCompleted && game.minutes_played > 0 && (
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {game.minutes_played}min
            </span>
          )}
        </div>

        {isCompleted && (
          <GameStatsDisplay
            stats={{
              points: game.points,
              assists: game.assists,
              rebounds: game.rebounds,
              steals: game.steals,
              blocks: game.blocks,
            }}
            minutes={game.minutes_played}
            fouls={game.fouls}
          />
        )}

        {game.notes && (
          <p className="mt-2 text-xs text-muted-foreground italic">
            {game.notes}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
