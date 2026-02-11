"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { StatsCard } from "@/components/stats-card";
import {
  Target,
  Flame,
  Calendar,
  Trophy,
  Dumbbell,
  TrendingUp,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { SessionWithShots, SHOT_TYPE_LABELS, ShotType } from "@/lib/types";
import { format, subDays, parseISO, startOfDay } from "date-fns";

export default function DashboardPage() {
  const [sessions, setSessions] = useState<SessionWithShots[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const { data: sessionsData, error: sessionsError } = await supabase
        .from("training_sessions")
        .select("*")
        .order("date", { ascending: false })
        .limit(30);

      if (sessionsError) throw sessionsError;

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

  function calculateStreak(): number {
    if (sessions.length === 0) return 0;
    const dates = sessions.map((s) => s.date).sort().reverse();
    const uniqueDates = [...new Set(dates)];

    let streak = 0;

    for (const dateStr of uniqueDates) {
      const sessionDate = startOfDay(parseISO(dateStr));
      const expected = startOfDay(subDays(new Date(), streak));

      if (sessionDate.getTime() === expected.getTime()) {
        streak++;
      } else if (streak === 0) {
        const yesterday = startOfDay(subDays(new Date(), 1));
        if (sessionDate.getTime() === yesterday.getTime()) {
          streak = 1;
        } else {
          break;
        }
      } else {
        break;
      }
    }

    return streak;
  }

  const currentMonth = format(new Date(), "yyyy-MM");
  const monthlySessions = sessions.filter((s) =>
    s.date.startsWith(currentMonth)
  ).length;

  const allShots = sessions.flatMap((s) => s.shot_logs);
  const totalMade = allShots.reduce((sum, s) => sum + s.made, 0);
  const totalAttempts = allShots.reduce(
    (sum, s) => sum + s.made + s.missed,
    0
  );
  const overallAccuracy =
    totalAttempts > 0 ? Math.round((totalMade / totalAttempts) * 100) : 0;

  const shotTypeAccuracy = (
    Object.keys(SHOT_TYPE_LABELS) as ShotType[]
  ).map((type) => {
    const typeShots = allShots.filter((s) => s.shot_type === type);
    const made = typeShots.reduce((sum, s) => sum + s.made, 0);
    const total = typeShots.reduce((sum, s) => sum + s.made + s.missed, 0);
    return {
      type,
      label: SHOT_TYPE_LABELS[type],
      accuracy: total > 0 ? Math.round((made / total) * 100) : 0,
      total,
    };
  });

  const bestType = shotTypeAccuracy
    .filter((s) => s.total > 0)
    .sort((a, b) => b.accuracy - a.accuracy)[0];

  const lastSession = sessions[0];
  const streak = calculateStreak();

  return (
    <div className="px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Hoops Tracker</h1>
        <p className="text-sm text-muted-foreground">
          {format(new Date(), "EEEE, dd/MM/yyyy")}
        </p>
      </div>

      <Link href="/train">
        <Button className="mb-6 h-14 w-full text-base" size="lg">
          <Dumbbell className="mr-2 h-5 w-5" />
          Iniciar Treino de Hoje
        </Button>
      </Link>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-20 animate-pulse rounded-lg bg-muted"
            />
          ))}
        </div>
      ) : sessions.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <Target className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
          <h2 className="mb-1 font-medium">Nenhum treino registrado</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Comece seu primeiro treino e registre seus arremessos!
          </p>
          <Link href="/log">
            <Button variant="outline">Registrar Sessao</Button>
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 mb-6">
            <StatsCard
              title="Streak"
              value={`${streak} dia${streak !== 1 ? "s" : ""}`}
              icon={Flame}
            />
            <StatsCard
              title="Acerto Geral"
              value={`${overallAccuracy}%`}
              subtitle={`${totalMade}/${totalAttempts}`}
              icon={Target}
            />
            <StatsCard
              title="Sessoes no Mes"
              value={monthlySessions}
              icon={Calendar}
            />
            {bestType && (
              <StatsCard
                title="Melhor Tipo"
                value={`${bestType.accuracy}%`}
                subtitle={bestType.label}
                icon={Trophy}
              />
            )}
          </div>

          {lastSession && (
            <div className="mb-6">
              <h2 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
                Ultimo Treino
              </h2>
              <div className="rounded-lg border p-4">
                <p className="text-sm font-medium mb-2">
                  {format(
                    new Date(lastSession.date + "T12:00:00"),
                    "dd/MM/yyyy"
                  )}
                  {lastSession.duration_minutes > 0 &&
                    ` - ${lastSession.duration_minutes}min`}
                </p>
                <div className="space-y-1.5">
                  {lastSession.shot_logs
                    .filter((log) => log.made + log.missed > 0)
                    .map((log) => {
                      const total = log.made + log.missed;
                      const pct = Math.round((log.made / total) * 100);
                      return (
                        <div
                          key={log.shot_type}
                          className="flex items-center justify-between"
                        >
                          <span className="text-xs text-muted-foreground">
                            {SHOT_TYPE_LABELS[log.shot_type as ShotType]}
                          </span>
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 w-20 rounded-full bg-muted overflow-hidden">
                              <div
                                className="h-full rounded-full bg-green-500"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            <span className="text-xs font-medium w-8 text-right">
                              {pct}%
                            </span>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <Link href="/history">
              <Button variant="outline" className="w-full h-12">
                <Calendar className="mr-2 h-4 w-4" />
                Historico
              </Button>
            </Link>
            <Link href="/progress">
              <Button variant="outline" className="w-full h-12">
                <TrendingUp className="mr-2 h-4 w-4" />
                Progresso
              </Button>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
