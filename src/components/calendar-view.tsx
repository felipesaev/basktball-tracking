"use client";

import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
  getDay,
  isSameDay,
  isToday,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface CalendarViewProps {
  month: Date;
  trainedDates: string[];
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
}

export function CalendarView({
  month,
  trainedDates,
  selectedDate,
  onSelectDate,
}: CalendarViewProps) {
  const start = startOfMonth(month);
  const end = endOfMonth(month);
  const days = eachDayOfInterval({ start, end });
  const startDayOfWeek = getDay(start);

  const weekDays = ["D", "S", "T", "Q", "Q", "S", "S"];

  return (
    <div>
      <h3 className="mb-3 text-center font-medium">
        {format(month, "MMMM yyyy", { locale: ptBR })}
      </h3>

      <div className="grid grid-cols-7 gap-1">
        {weekDays.map((day, i) => (
          <div
            key={i}
            className="text-center text-xs font-medium text-muted-foreground py-1"
          >
            {day}
          </div>
        ))}

        {Array.from({ length: startDayOfWeek }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}

        {days.map((day) => {
          const dateStr = format(day, "yyyy-MM-dd");
          const isTrained = trainedDates.includes(dateStr);
          const isSelected = selectedDate === dateStr;
          const today = isToday(day);

          return (
            <button
              key={dateStr}
              onClick={() => isTrained && onSelectDate(dateStr)}
              className={cn(
                "aspect-square flex items-center justify-center rounded-md text-sm transition-colors",
                isTrained && "bg-green-500/20 text-green-400 font-medium",
                isSelected && "ring-2 ring-primary bg-primary/10",
                today && !isTrained && "border border-muted-foreground/30",
                !isTrained && "text-muted-foreground/40"
              )}
            >
              {format(day, "d")}
            </button>
          );
        })}
      </div>
    </div>
  );
}
