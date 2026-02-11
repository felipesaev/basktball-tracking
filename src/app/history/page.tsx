"use client";

import { useEffect, useState } from "react";
import { format, subMonths, addMonths } from "date-fns";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CalendarView } from "@/components/calendar-view";
import { SessionCard } from "@/components/session-card";
import { supabase } from "@/lib/supabase";
import { SessionWithShots } from "@/lib/types";

export default function HistoryPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [sessions, setSessions] = useState<SessionWithShots[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSessions();
  }, []);

  async function loadSessions() {
    try {
      const { data: sessionsData, error } = await supabase
        .from("training_sessions")
        .select("*")
        .order("date", { ascending: false });

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
      console.error("Erro ao carregar sessoes:", error);
    } finally {
      setLoading(false);
    }
  }

  const trainedDates = [...new Set(sessions.map((s) => s.date))];

  const selectedSessions = selectedDate
    ? sessions.filter((s) => s.date === selectedDate)
    : sessions.slice(0, 5);

  return (
    <div className="px-4 py-6">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Calendar className="h-5 w-5 text-primary" />
          <h1 className="text-xl font-bold">Historico</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          {trainedDates.length} sessoes registradas
        </p>
      </div>

      <div className="mb-6 rounded-lg border p-4">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="font-medium text-sm">
            {format(currentMonth, "MMMM yyyy")}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <CalendarView
          month={currentMonth}
          trainedDates={trainedDates}
          selectedDate={selectedDate}
          onSelectDate={(date) =>
            setSelectedDate(date === selectedDate ? null : date)
          }
        />
      </div>

      <div>
        <h2 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
          {selectedDate
            ? `Sessao de ${format(new Date(selectedDate + "T12:00:00"), "dd/MM/yyyy")}`
            : "Ultimas Sessoes"}
        </h2>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-24 animate-pulse rounded-lg bg-muted"
              />
            ))}
          </div>
        ) : selectedSessions.length === 0 ? (
          <div className="rounded-lg border border-dashed p-6 text-center">
            <p className="text-sm text-muted-foreground">
              {selectedDate
                ? "Nenhum treino neste dia"
                : "Nenhum treino registrado ainda"}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {selectedSessions.map((session) => (
              <SessionCard key={session.id} session={session} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
