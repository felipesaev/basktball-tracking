"use client";

import { useState, useMemo } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Dumbbell } from "lucide-react";
import { getDrillsForDay } from "@/data/drills";
import { DrillCard } from "@/components/drill-card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export default function TrainPage() {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const todayDrills = useMemo(() => getDrillsForDay(dayOfWeek), [dayOfWeek]);

  const [completedDrills, setCompletedDrills] = useState<Set<string>>(
    new Set()
  );

  const toggleDrill = (drillId: string) => {
    setCompletedDrills((prev) => {
      const next = new Set(prev);
      if (next.has(drillId)) {
        next.delete(drillId);
      } else {
        next.add(drillId);
      }
      return next;
    });
  };

  const completedCount = completedDrills.size;
  const totalCount = todayDrills.length;
  const progressPercent =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const dayLabels: Record<number, string> = {
    0: "Domingo - Sessao Leve",
    1: "Segunda - Lance Livre & Meia Distancia",
    2: "Terca - 3 Pontos & Combos",
    3: "Quarta - Bandejas & Post",
    4: "Quinta - Lance Livre & Meia Distancia",
    5: "Sexta - 3 Pontos & Combos",
    6: "Sabado - Bandejas & Post",
  };

  const warmupDrills = todayDrills.filter(
    (d) => d.shot_type === "warmup"
  );
  const mainDrills = todayDrills.filter(
    (d) => d.shot_type !== "warmup"
  );

  return (
    <div className="px-4 py-6">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Dumbbell className="h-5 w-5 text-primary" />
          <h1 className="text-xl font-bold">Treino do Dia</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          {format(today, "EEEE, dd 'de' MMMM", { locale: ptBR })}
        </p>
        <Badge variant="secondary" className="mt-2">
          {dayLabels[dayOfWeek]}
        </Badge>
      </div>

      {/* Progresso */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">Progresso</span>
          <span className="text-sm font-medium">
            {completedCount}/{totalCount}
          </span>
        </div>
        <Progress value={progressPercent} className="h-2" />
      </div>

      {/* Aquecimento */}
      {warmupDrills.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
            Aquecimento
          </h2>
          <div className="space-y-3">
            {warmupDrills.map((drill) => (
              <DrillCard
                key={drill.id}
                drill={drill}
                completed={completedDrills.has(drill.id)}
                onToggle={() => toggleDrill(drill.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Treino Principal */}
      {mainDrills.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
            Treino Principal
          </h2>
          <div className="space-y-3">
            {mainDrills.map((drill) => (
              <DrillCard
                key={drill.id}
                drill={drill}
                completed={completedDrills.has(drill.id)}
                onToggle={() => toggleDrill(drill.id)}
              />
            ))}
          </div>
        </div>
      )}

      {progressPercent === 100 && (
        <div className="mt-6 rounded-lg bg-green-500/10 border border-green-500/30 p-4 text-center">
          <p className="text-green-400 font-medium">
            Treino completo! Agora registre sua sessao.
          </p>
        </div>
      )}
    </div>
  );
}
