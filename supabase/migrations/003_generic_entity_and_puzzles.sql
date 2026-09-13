-- 003_generic_entity_and_puzzles.sql
-- Expansion for Korean Daily Recognition Game: Entity Graph & Generic Puzzle Engine

-- Generic Entities Table
create table if not exists public.entities (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('drama', 'movie', 'song', 'album', 'person', 'place', 'brand', 'food', 'show', 'character', 'quote', 'object', 'meme', 'slang', 'event')),
  title_kr text not null,
  title_en text not null,
  aliases text[] default '{}',
  slug text unique,
  description text,
  metadata jsonb default '{}'::jsonb,
  poster_url text,
  thumbnail_url text,
  status text not null default 'published' check (status in ('draft', 'review', 'published', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Entity Relations Table (Graph relations e.g. IU acted_in Hotel Del Luna, Song X soundtrack_of Drama Y)
create table if not exists public.entity_relations (
  id uuid primary key default gen_random_uuid(),
  source_entity_id uuid not null references public.entities(id) on delete cascade,
  target_entity_id uuid not null references public.entities(id) on delete cascade,
  relation_type text not null, -- acted_in, starred_in, soundtrack_of, set_in, created_by, character_in, etc.
  confidence numeric default 1.0,
  source text,
  notes text,
  created_at timestamptz not null default now(),
  unique(source_entity_id, target_entity_id, relation_type)
);

-- Generic Puzzles Table
create table if not exists public.puzzles (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('scene', 'song', 'chosung', 'connections', 'people', 'movie', 'place', 'food', 'brand', 'quote', 'timeline', 'object')),
  title text not null,
  description text,
  entity_id uuid references public.entities(id) on delete set null,
  difficulty numeric default 5.0 check (difficulty between 0 and 10),
  actual_difficulty numeric,
  estimated_time int default 60, -- seconds
  status text not null default 'published' check (status in ('draft', 'review', 'approved', 'scheduled', 'published', 'archived', 'rejected')),
  author_id uuid references public.players(id) on delete set null,
  reviewer_id uuid references public.players(id) on delete set null,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Generic Puzzle Steps (for progressive reveals)
create table if not exists public.puzzle_steps (
  id uuid primary key default gen_random_uuid(),
  puzzle_id uuid not null references public.puzzles(id) on delete cascade,
  step_number int not null check (step_number >= 1),
  step_type text not null check (step_type in ('image', 'audio', 'text', 'metadata', 'silhouette', 'crop', 'letter', 'relationship', 'location', 'multiple_choice')),
  asset_id text,
  asset_url text,
  text_content text,
  metadata jsonb default '{}'::jsonb,
  score_penalty numeric default 0,
  unlock_rule text,
  created_at timestamptz not null default now(),
  unique(puzzle_id, step_number)
);

-- Puzzle Answers
create table if not exists public.puzzle_answers (
  id uuid primary key default gen_random_uuid(),
  puzzle_id uuid not null references public.puzzles(id) on delete cascade,
  entity_id uuid references public.entities(id) on delete set null,
  answer_text text not null,
  normalized_answer text not null,
  is_primary boolean default false,
  case_sensitive boolean default false,
  created_at timestamptz not null default now()
);

-- Puzzle Clues (Generic clue ladder)
create table if not exists public.puzzle_clues (
  id uuid primary key default gen_random_uuid(),
  puzzle_id uuid not null references public.puzzles(id) on delete cascade,
  clue_order int not null,
  type text not null,
  label text not null,
  value text not null,
  unlock_after_attempt int not null default 1,
  score_penalty numeric default 10,
  display_order int default 1,
  status text not null default 'active',
  unique(puzzle_id, clue_order)
);

-- Audio Assets Table
create table if not exists public.audio_assets (
  id uuid primary key default gen_random_uuid(),
  puzzle_id uuid references public.puzzles(id) on delete set null,
  title text not null,
  artist text,
  asset_key text not null unique,
  public_url text not null,
  duration_seconds numeric,
  sample_start_seconds numeric default 0,
  mime_type text default 'audio/mpeg',
  file_size int,
  source_url text,
  source_note text,
  rights_status text not null default 'review_required' check (rights_status in ('unknown', 'review_required', 'approved', 'restricted', 'rejected')),
  created_at timestamptz not null default now()
);

-- Content Rights Reviews Table
create table if not exists public.rights_reviews (
  id uuid primary key default gen_random_uuid(),
  target_type text not null check (target_type in ('scene_asset', 'audio_asset', 'entity', 'puzzle')),
  target_id uuid not null,
  rights_status text not null default 'review_required',
  source_url text,
  source_name text,
  reviewer_notes text,
  reviewed_by uuid references public.players(id),
  reviewed_at timestamptz default now(),
  created_at timestamptz not null default now()
);

-- Player Sessions & Accounts
create table if not exists public.player_sessions (
  id uuid primary key default gen_random_uuid(),
  player_id uuid not null references public.players(id) on delete cascade,
  device_info text,
  last_active timestamptz default now(),
  created_at timestamptz not null default now()
);

-- Challenge Players Leaderboard / Room tracking
create table if not exists public.challenge_players (
  id uuid primary key default gen_random_uuid(),
  challenge_id uuid not null references public.challenges(id) on delete cascade,
  player_id uuid references public.players(id) on delete set null,
  guest_name text not null,
  score int not null default 0,
  completed_at timestamptz default now(),
  attempts int default 1,
  time_seconds int default 0,
  created_at timestamptz not null default now()
);

-- Site Settings
create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz default now()
);

-- Feature Flags
create table if not exists public.feature_flags (
  key text primary key,
  enabled boolean default true,
  description text,
  updated_at timestamptz default now()
);

-- Audit Log
create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_email text,
  action text not null,
  entity_type text,
  entity_id text,
  before_state jsonb,
  after_state jsonb,
  created_at timestamptz default now()
);

-- Indexes
create index if not exists entities_type_idx on public.entities(type);
create index if not exists entities_slug_idx on public.entities(slug);
create index if not exists entity_relations_source_idx on public.entity_relations(source_entity_id);
create index if not exists entity_relations_target_idx on public.entity_relations(target_entity_id);
create index if not exists puzzles_type_idx on public.puzzles(type);
create index if not exists puzzles_status_idx on public.puzzles(status);
create index if not exists puzzle_steps_puzzle_idx on public.puzzle_steps(puzzle_id);

-- Row Level Security Enablement
alter table public.entities enable row level security;
alter table public.entity_relations enable row level security;
alter table public.puzzles enable row level security;
alter table public.puzzle_steps enable row level security;
alter table public.puzzle_answers enable row level security;
alter table public.puzzle_clues enable row level security;
alter table public.audio_assets enable row level security;
alter table public.rights_reviews enable row level security;
alter table public.challenge_players enable row level security;

-- Public RLS Policies
create policy "published entities public" on public.entities for select using (status = 'published');
create policy "entity relations public" on public.entity_relations for select using (true);
create policy "published puzzles public" on public.puzzles for select using (status = 'published');
create policy "puzzle steps public" on public.puzzle_steps for select using (exists (select 1 from public.puzzles p where p.id = puzzle_steps.puzzle_id and p.status = 'published'));
create policy "puzzle answers public" on public.puzzle_answers for select using (exists (select 1 from public.puzzles p where p.id = puzzle_answers.puzzle_id and p.status = 'published'));
create policy "puzzle clues public" on public.puzzle_clues for select using (exists (select 1 from public.puzzles p where p.id = puzzle_clues.puzzle_id and p.status = 'published'));
create policy "approved audio assets public" on public.audio_assets for select using (rights_status = 'approved');
create policy "challenge players public" on public.challenge_players for select using (true);
create policy "challenge players insert public" on public.challenge_players for insert with check (true);
