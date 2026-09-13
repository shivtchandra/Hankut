create extension if not exists pgcrypto;

create table if not exists public.dramas (
  id uuid primary key default gen_random_uuid(),
  title_kr text not null,
  title_en text not null,
  aliases text[] default '{}',
  year int,
  network text,
  ott_platform text,
  genres text[] default '{}',
  episode_count int,
  synopsis text,
  poster_url text,
  country text default 'KR',
  status text not null default 'draft' check (status in ('draft','review','published','archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.scenes (
  id uuid primary key default gen_random_uuid(),
  drama_id uuid not null references public.dramas(id) on delete cascade,
  scene_code text not null,
  episode int,
  timestamp_start numeric,
  timestamp_end numeric,
  difficulty numeric default 5 check (difficulty between 0 and 10),
  recognition_score numeric default 0.5,
  description text,
  location text,
  characters text[] default '{}',
  status text not null default 'draft' check (status in ('draft','review','approved','published','rejected')),
  rights_status text not null default 'review_required' check (rights_status in ('unknown','review_required','approved','rejected')),
  source_url text,
  source_note text,
  created_at timestamptz not null default now(),
  unique(drama_id, scene_code)
);

create table if not exists public.scene_assets (
  id uuid primary key default gen_random_uuid(),
  scene_id uuid not null references public.scenes(id) on delete cascade,
  frame_order int not null check (frame_order between 1 and 5),
  asset_key text not null unique,
  public_url text,
  mime_type text,
  width int,
  height int,
  file_size int,
  source_url text,
  source_note text,
  rights_status text not null default 'review_required' check (rights_status in ('unknown','review_required','approved','rejected')),
  created_at timestamptz not null default now(),
  unique(scene_id, frame_order)
);

create table if not exists public.clues (
  id uuid primary key default gen_random_uuid(),
  scene_id uuid not null references public.scenes(id) on delete cascade,
  clue_order int not null,
  type text not null,
  value text not null,
  unlock_after int not null default 2 check (unlock_after between 1 and 5),
  unique(scene_id, clue_order)
);

create table if not exists public.daily_games (
  id uuid primary key default gen_random_uuid(),
  game_date date not null unique,
  scene_id uuid not null references public.scenes(id),
  difficulty numeric,
  status text not null default 'draft' check (status in ('draft','scheduled','published','retired')),
  created_at timestamptz not null default now()
);

create table if not exists public.players (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique,
  display_name text,
  created_at timestamptz not null default now()
);

create table if not exists public.plays (
  id uuid primary key default gen_random_uuid(),
  player_id uuid references public.players(id) on delete set null,
  daily_game_id uuid not null references public.daily_games(id) on delete cascade,
  attempts int default 0,
  hints_used int default 0,
  solved boolean default false,
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.guesses (
  id uuid primary key default gen_random_uuid(),
  play_id uuid not null references public.plays(id) on delete cascade,
  guessed_drama_id uuid references public.dramas(id),
  raw_guess text,
  attempt_number int not null,
  is_correct boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.challenges (
  id uuid primary key default gen_random_uuid(),
  daily_game_id uuid not null references public.daily_games(id) on delete cascade,
  creator_player_id uuid references public.players(id) on delete set null,
  invite_code text not null unique,
  expires_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists scenes_drama_idx on public.scenes(drama_id);
create index if not exists assets_scene_idx on public.scene_assets(scene_id);
create index if not exists clues_scene_idx on public.clues(scene_id);
create index if not exists daily_games_date_idx on public.daily_games(game_date desc);

alter table public.dramas enable row level security;
alter table public.scenes enable row level security;
alter table public.scene_assets enable row level security;
alter table public.clues enable row level security;
alter table public.daily_games enable row level security;
alter table public.players enable row level security;
alter table public.plays enable row level security;
alter table public.guesses enable row level security;
alter table public.challenges enable row level security;

create policy "published dramas are public" on public.dramas for select using (status='published');
create policy "published scenes are public" on public.scenes for select using (status='published');
create policy "approved assets are public" on public.scene_assets for select using (rights_status='approved');
create policy "clues are public" on public.clues for select using (exists (select 1 from public.scenes s where s.id=clues.scene_id and s.status='published'));
create policy "published daily games are public" on public.daily_games for select using (status='published');
create policy "players can read own player row" on public.players for select using (auth.uid() = auth_user_id);
create policy "players can insert self row" on public.players for insert with check (auth.uid() = auth_user_id);
create policy "players can read own plays" on public.plays for select using (exists (select 1 from public.players p where p.id=plays.player_id and p.auth_user_id=auth.uid()));
create policy "players can insert own plays" on public.plays for insert with check (exists (select 1 from public.players p where p.id=plays.player_id and p.auth_user_id=auth.uid()));
create policy "players can read own guesses" on public.guesses for select using (exists (select 1 from public.plays pl join public.players p on p.id=pl.player_id where pl.id=guesses.play_id and p.auth_user_id=auth.uid()));
create policy "players can insert own guesses" on public.guesses for insert with check (exists (select 1 from public.plays pl join public.players p on p.id=pl.player_id where pl.id=guesses.play_id and p.auth_user_id=auth.uid()));
create policy "published challenges public" on public.challenges for select using (true);
