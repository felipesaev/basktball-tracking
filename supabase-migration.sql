-- Basketball Training Tracker - Database Schema
-- Execute este SQL no SQL Editor do Supabase

-- Tabela de sessoes de treino
create table if not exists training_sessions (
  id uuid default gen_random_uuid() primary key,
  date date not null default current_date,
  notes text,
  difficulty integer not null default 3 check (difficulty >= 1 and difficulty <= 5),
  duration_minutes integer not null default 0,
  mood text not null default 'good' check (mood in ('great', 'good', 'ok', 'tired')),
  video_url text,
  created_at timestamptz default now()
);

-- Tabela de logs de arremessos
create table if not exists shot_logs (
  id uuid default gen_random_uuid() primary key,
  session_id uuid not null references training_sessions(id) on delete cascade,
  shot_type text not null check (shot_type in ('free_throw', 'three_pointer', 'mid_range', 'layup', 'post')),
  made integer not null default 0,
  missed integer not null default 0,
  created_at timestamptz default now()
);

-- Tabela de drills completados
create table if not exists drill_completions (
  id uuid default gen_random_uuid() primary key,
  session_id uuid not null references training_sessions(id) on delete cascade,
  drill_id text not null,
  completed boolean not null default false,
  notes text
);

-- Indices para performance
create index if not exists idx_training_sessions_date on training_sessions(date desc);
create index if not exists idx_shot_logs_session on shot_logs(session_id);
create index if not exists idx_drill_completions_session on drill_completions(session_id);

-- Disable RLS (uso pessoal sem autenticacao)
alter table training_sessions enable row level security;
alter table shot_logs enable row level security;
alter table drill_completions enable row level security;

-- Politicas permissivas (acesso total sem auth)
create policy "Allow all on training_sessions" on training_sessions for all using (true) with check (true);
create policy "Allow all on shot_logs" on shot_logs for all using (true) with check (true);
create policy "Allow all on drill_completions" on drill_completions for all using (true) with check (true);

-- Migracao: adicionar video_url (executar se a tabela ja existe)
-- alter table training_sessions add column if not exists video_url text;
