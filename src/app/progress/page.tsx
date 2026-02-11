"use client";

import { useEffect, useState } from "react";
import { format, endOfWeek, eachWeekOfInterval } from "date-fns";
import { TrendingUp, Target, Crosshair } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ProgressLineChart,
  VolumeBarChart,
} from "@/components/progress-chart";
import { StatsCard } from "@/components/stats-card";
import { supabase } from "@/lib/supabase";
import { SessionWithShots, SHOT_TYPE_LABELS, ShotType } from "@/lib/types";

export default function ProgressPage() {
  const [sessions, setSessions] = useState<SessionWithShots[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const { data: sessionsData, error } = await supabase
        .from("training_sessions")
        .select("*")
        .order("date", { ascending: true });

      if (error) throw error;

      if (sessionsData && sessionsData.length > 0) {
        const sessionIds = sessionsData.map((s) => s.id);
        const { data: shotsData } = await supabase
          .from("shot_logs")
          .select("*")
          .in("session_id", sessionIds);

        const withShots: SessionWithShots[] = sessionsData.map((session) => ({
          ...session,
          shot_logs: (shotsData || []).filter(
            (s) => s.session_id === session.id
          ),
        }));

        setSessions(withShots);
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  }

  const accuracyData = sessions
    .filter((s) => s.shot_logs.length > 0)
    .map((session) => {
      const made = session.shot_logs.reduce((sum, s) => sum + s.made, 0);
      const total = session.shot_logs.reduce(
        (sum, s) => sum + s.made + s.missed,
        0
      );
      return {
        date: session.date,
        percentage: total > 0 ? Math.round((made / total) * 100) : 0,
        label: format(new Date(session.date + "T12:00:00"), "dd/MM"),
      };
    });

  function getTypeAccuracyData(shotType: ShotType) {
    return sessions
      .filter((s) => s.shot_logs.some((l) => l.shot_type === shotType))
      .map((session) => {
        const logs = session.shot_logs.filter(
          (l) => l.shot_type === shotType
        );
        const made = logs.reduce((sum, s) => sum + s.made, 0);
        const total = logs.reduce(
          (sum, s) => sum + s.made + s.missed,
          0
        );
        return {
          date: session.date,
          percentage: total > 0 ? Math.round((made / total) * 100) : 0,
          label: format(new Date(session.date + "T12:00:00"), "dd/MM"),
        };
      });
  }

  const volumeData = (() => {
    if (sessions.length === 0) return [];

    const firstDate = new Date(sessions[0].date + "T12:00:00");
    const lastDate = new Date(
      sessions[sessions.length - 1].date + "T12:00:00"
    );
    const weeks = eachWeekOfInterval(
      { start: firstDate, end: lastDate },
      { weekStartsOn: 1 }
    );

    return weeks.slice(-8).map((weekStart) => {
      const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
      const weekSessions = sessions.filter((s) => {
        const d = new Date(s.date + "T12:00:00");
        return d >= weekStart && d <= weekEnd;
      });
      const totalShots = weekSessions.reduce(
        (sum, s) =>
          sum +
          s.shot_logs.reduce((ss, l) => ss + l.made + l.missed, 0),
        0
      );
      return {
        label: format(weekStart, "dd/MM"),
        shots: totalShots,
      };
    });
  })();

  const allShots = sessions.flatMap((s) => s.shot_logs);
  const totalMade = allShots.reduce((sum, s) => sum + s.made, 0);
  const totalAttempts = allShots.reduce(
    (sum, s) => sum + s.made + s.missed,
    0
  );
  const totalSessions = sessions.length;

  return (
    <div className="px-4 py-6">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <TrendingUp className="h-5 w-5 text-primary" />
          <h1 className="text-xl font-bold">Progresso</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Acompanhe sua evolucao ao longo do tempo
        </p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-40 animate-pulse rounded-lg bg-muted"
            />
          ))}
        </div>
      ) : sessions.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <TrendingUp className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
          <h2 className="mb-1 font-medium">Sem dados ainda</h2>
          <p className="text-sm text-muted-foreground">
            Registre treinos para ver seus graficos de evolucao
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-2 mb-6">
            <StatsCard
              title="Sessoes"
              value={totalSessions}
              icon={Target}
            />
            <StatsCard
              title="Cestas"
              value={totalMade}
              icon={Crosshair}
            />
            <StatsCard
              title="Acerto"
              value={`${totalAttempts > 0 ? Math.round((totalMade / totalAttempts) * 100) : 0}%`}
              icon={TrendingUp}
            />
          </div>

          <Card className="mb-6">
            <CardContent className="p-4">
              <h2 className="text-sm font-semibold mb-4">
                Percentual de Acerto
              </h2>
              <Tabs defaultValue="all">
                <TabsList className="mb-4 w-full">
                  <TabsTrigger value="all" className="flex-1 text-xs">
                    Geral
                  </TabsTrigger>
                  <TabsTrigger value="free_throw" className="flex-1 text-xs">
                    L. Livre
                  </TabsTrigger>
                  <TabsTrigger
                    value="three_pointer"
                    className="flex-1 text-xs"
                  >
                    3 Pts
                  </TabsTrigger>
                  <TabsTrigger value="mid_range" className="flex-1 text-xs">
                    Meia
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="all">
                  {accuracyData.length > 0 ? (
                    <ProgressLineChart data={accuracyData} />
                  ) : (
                    <p className="text-center text-sm text-muted-foreground py-8">
                      Sem dados
                    </p>
                  )}
                </TabsContent>

                {(
                  ["free_throw", "three_pointer", "mid_range"] as ShotType[]
                ).map((type) => (
                  <TabsContent key={type} value={type}>
                    {getTypeAccuracyData(type).length > 0 ? (
                      <ProgressLineChart
                        data={getTypeAccuracyData(type)}
                        color={
                          type === "free_throw"
                            ? "hsl(45, 93%, 47%)"
                            : type === "three_pointer"
                              ? "hsl(221, 83%, 53%)"
                              : "hsl(280, 65%, 60%)"
                        }
                      />
                    ) : (
                      <p className="text-center text-sm text-muted-foreground py-8">
                        Sem dados para{" "}
                        {SHOT_TYPE_LABELS[type]}
                      </p>
                    )}
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardContent className="p-4">
              <h2 className="text-sm font-semibold mb-4">
                Volume Semanal (arremessos)
              </h2>
              {volumeData.length > 0 ? (
                <VolumeBarChart data={volumeData} />
              ) : (
                <p className="text-center text-sm text-muted-foreground py-8">
                  Sem dados
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <h2 className="text-sm font-semibold mb-4">
                Acerto por Tipo de Arremesso
              </h2>
              <div className="space-y-3">
                {(Object.keys(SHOT_TYPE_LABELS) as ShotType[]).map(
                  (type) => {
                    const typeShots = allShots.filter(
                      (s) => s.shot_type === type
                    );
                    const made = typeShots.reduce(
                      (sum, s) => sum + s.made,
                      0
                    );
                    const total = typeShots.reduce(
                      (sum, s) => sum + s.made + s.missed,
                      0
                    );
                    const pct =
                      total > 0 ? Math.round((made / total) * 100) : 0;

                    return (
                      <div key={type}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs">
                            {SHOT_TYPE_LABELS[type]}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {pct}% ({made}/{total})
                          </span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                          <div
                            className="h-full rounded-full bg-primary transition-all"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
