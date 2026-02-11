export type ShotType =
  | "free_throw"
  | "three_pointer"
  | "mid_range"
  | "layup"
  | "post";

export type Mood = "great" | "good" | "ok" | "tired";

export interface TrainingSession {
  id: string;
  date: string;
  notes: string | null;
  difficulty: number;
  duration_minutes: number;
  mood: Mood;
  video_url: string | null;
  created_at: string;
}

export interface ShotLog {
  id: string;
  session_id: string;
  shot_type: ShotType;
  made: number;
  missed: number;
  created_at: string;
}

export interface DrillCompletion {
  id: string;
  session_id: string;
  drill_id: string;
  completed: boolean;
  notes: string | null;
}

export interface Drill {
  id: string;
  name: string;
  description: string;
  youtube_url: string;
  shot_type: ShotType | "warmup" | "combo";
  sets: number;
  reps: number;
  day_of_week: number[]; // 0=Sun, 1=Mon, ..., 6=Sat
}

export interface SessionWithShots extends TrainingSession {
  shot_logs: ShotLog[];
}

export const SHOT_TYPE_LABELS: Record<ShotType, string> = {
  free_throw: "Lance Livre",
  three_pointer: "3 Pontos",
  mid_range: "Meia Distancia",
  layup: "Bandeja",
  post: "Post",
};

export const SHOT_TYPE_COLORS: Record<ShotType, string> = {
  free_throw: "hsl(var(--chart-1))",
  three_pointer: "hsl(var(--chart-2))",
  mid_range: "hsl(var(--chart-3))",
  layup: "hsl(var(--chart-4))",
  post: "hsl(var(--chart-5))",
};

export const MOOD_LABELS: Record<Mood, string> = {
  great: "Otimo",
  good: "Bom",
  ok: "OK",
  tired: "Cansado",
};

export const MOOD_EMOJIS: Record<Mood, string> = {
  great: "🔥",
  good: "💪",
  ok: "👍",
  tired: "😴",
};
