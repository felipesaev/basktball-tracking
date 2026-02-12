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

// === Rachas (Pickup Games) ===

export type GameResult = "win" | "loss";

export interface PickupGame {
  id: string;
  date: string;
  location: string | null;
  duration_minutes: number;
  players_notes: string | null;
  points: number;
  assists: number;
  rebounds: number;
  steals: number;
  blocks: number;
  result: GameResult;
  notes: string | null;
  created_at: string;
}

// === Jogos Oficiais (Official Games) ===

export type GameStatus = "scheduled" | "completed" | "cancelled";

export interface OfficialGame {
  id: string;
  date: string;
  time: string | null;
  opponent: string;
  location: string | null;
  status: GameStatus;
  team_score: number | null;
  opponent_score: number | null;
  points: number;
  assists: number;
  rebounds: number;
  steals: number;
  blocks: number;
  minutes_played: number;
  fouls: number;
  notes: string | null;
  created_at: string;
}

// === Stats compartilhados ===

export interface PlayerStats {
  points: number;
  assists: number;
  rebounds: number;
  steals: number;
  blocks: number;
}

export const GAME_RESULT_LABELS: Record<GameResult, string> = {
  win: "Vitoria",
  loss: "Derrota",
};

export const GAME_STATUS_LABELS: Record<GameStatus, string> = {
  scheduled: "Agendado",
  completed: "Finalizado",
  cancelled: "Cancelado",
};

export const STAT_LABELS: Record<keyof PlayerStats, string> = {
  points: "Pontos",
  assists: "Assistencias",
  rebounds: "Rebotes",
  steals: "Roubos",
  blocks: "Tocos",
};

export const STAT_SHORT_LABELS: Record<keyof PlayerStats, string> = {
  points: "PTS",
  assists: "AST",
  rebounds: "REB",
  steals: "STL",
  blocks: "BLK",
};
