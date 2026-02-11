"use client";

import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";

interface ShotCounterProps {
  label: string;
  made: number;
  missed: number;
  onMadeChange: (value: number) => void;
  onMissedChange: (value: number) => void;
}

export function ShotCounter({
  label,
  made,
  missed,
  onMadeChange,
  onMissedChange,
}: ShotCounterProps) {
  const total = made + missed;
  const percentage = total > 0 ? Math.round((made / total) * 100) : 0;

  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-medium">{label}</h3>
        <span className="text-sm text-muted-foreground">
          {percentage}% ({made}/{total})
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Acertos */}
        <div>
          <p className="mb-1.5 text-center text-xs text-green-400">Acertos</p>
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => onMadeChange(Math.max(0, made - 1))}
              disabled={made === 0}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="w-8 text-center text-lg font-bold text-green-400">
              {made}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => onMadeChange(made + 1)}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Erros */}
        <div>
          <p className="mb-1.5 text-center text-xs text-red-400">Erros</p>
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => onMissedChange(Math.max(0, missed - 1))}
              disabled={missed === 0}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="w-8 text-center text-lg font-bold text-red-400">
              {missed}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => onMissedChange(missed + 1)}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
