-- Basketball Training Tracker - Migracao: Rachas e Jogos Oficiais
-- Execute este SQL no SQL Editor do Supabase

-- Tabela de rachas (jogos informais)
create table if not exists pickup_games (
  id uuid default gen_random_uuid() primary key,
  date date not null default current_date,
  location text,
  duration_minutes integer not null default 0,
  players_notes text,
  points integer not null default 0,
  assists integer not null default 0,
  rebounds integer not null default 0,
  steals integer not null default 0,
  blocks integer not null default 0,
  result text not null default 'win' check (result in ('win', 'loss')),
  notes text,
  created_at timestamptz default now()
);

-- Tabela de jogos oficiais
create table if not exists official_games (
  id uuid default gen_random_uuid() primary key,
  date date not null,
  time text,
  opponent text not null,
  location text,
  status text not null default 'scheduled' check (status in ('scheduled', 'completed', 'cancelled')),
  team_score integer,
  opponent_score integer,
  points integer not null default 0,
  assists integer not null default 0,
  rebounds integer not null default 0,
  steals integer not null default 0,
  blocks integer not null default 0,
  minutes_played integer not null default 0,
  fouls integer not null default 0,
  notes text,
  created_at timestamptz default now()
);

-- Indices para performance
create index if not exists idx_pickup_games_date on pickup_games(date desc);
create index if not exists idx_official_games_date on official_games(date desc);
create index if not exists idx_official_games_status on official_games(status);

-- RLS (mesmo padrao: acesso total sem auth)
alter table pickup_games enable row level security;
alter table official_games enable row level security;

create policy "Allow all on pickup_games" on pickup_games for all using (true) with check (true);
create policy "Allow all on official_games" on official_games for all using (true) with check (true);
