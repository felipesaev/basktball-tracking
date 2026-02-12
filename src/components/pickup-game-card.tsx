import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { MapPin, Clock } from "lucide-react";
import { PickupGame, GAME_RESULT_LABELS } from "@/lib/types";
import { GameStatsDisplay } from "./game-stats-display";

interface PickupGameCardProps {
  game: PickupGame;
}

export function PickupGameCard({ game }: PickupGameCardProps) {
  const isWin = game.result === "win";

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium">
            {format(new Date(game.date + "T12:00:00"), "dd MMM, EEE", {
              locale: ptBR,
            })}
          </h3>
          <Badge
            variant={isWin ? "default" : "destructive"}
          >
            {GAME_RESULT_LABELS[game.result]}
          </Badge>
        </div>

        <div className="flex items-center gap-3 mb-3 text-sm text-muted-foreground">
          {game.location && (
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {game.location}
            </span>
          )}
          {game.duration_minutes > 0 && (
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {game.duration_minutes}min
            </span>
          )}
        </div>

        <GameStatsDisplay
          stats={{
            points: game.points,
            assists: game.assists,
            rebounds: game.rebounds,
            steals: game.steals,
            blocks: game.blocks,
          }}
        />

        {game.players_notes && (
          <p className="mt-2 text-xs text-muted-foreground">
            {game.players_notes}
          </p>
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
