"use client";

import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";
import { PlayerStats, STAT_LABELS } from "@/lib/types";

interface StatCounterProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
}

function StatCounter({ label, value, onChange }: StatCounterProps) {
  return (
    <div className="flex items-center justify-between rounded-lg border bg-card p-3">
      <span className="text-sm font-medium">{label}</span>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => onChange(Math.max(0, value - 1))}
          disabled={value === 0}
        >
          <Minus className="h-3 w-3" />
        </Button>
        <span className="w-8 text-center text-lg font-bold">{value}</span>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => onChange(value + 1)}
        >
          <Plus className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}

interface GameStatsInputProps {
  stats: PlayerStats;
  onStatsChange: (stats: PlayerStats) => void;
  showMinutes?: boolean;
  minutes?: number;
  onMinutesChange?: (value: number) => void;
  showFouls?: boolean;
  fouls?: number;
  onFoulsChange?: (value: number) => void;
}

export function GameStatsInput({
  stats,
  onStatsChange,
  showMinutes,
  minutes = 0,
  onMinutesChange,
  showFouls,
  fouls = 0,
  onFoulsChange,
}: GameStatsInputProps) {
  const updateStat = (key: keyof PlayerStats, value: number) => {
    onStatsChange({ ...stats, [key]: value });
  };

  return (
    <div className="space-y-2">
      {(Object.keys(STAT_LABELS) as (keyof PlayerStats)[]).map((key) => (
        <StatCounter
          key={key}
          label={STAT_LABELS[key]}
          value={stats[key]}
          onChange={(v) => updateStat(key, v)}
        />
      ))}
      {showMinutes && onMinutesChange && (
        <StatCounter
          label="Minutos"
          value={minutes}
          onChange={onMinutesChange}
        />
      )}
      {showFouls && onFoulsChange && (
        <StatCounter
          label="Faltas"
          value={fouls}
          onChange={onFoulsChange}
        />
      )}
    </div>
  );
}
