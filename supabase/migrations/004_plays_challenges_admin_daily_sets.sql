-- 004_plays_challenges_admin_daily_sets.sql
-- Adds: daily_sets/items (Today's 5), plays, guesses, clue_usage,
--       player_stats, admin_users, admin_activity, assets tables,
--       entity/puzzle asset links, content_tags, leaderboard_entries, challenges

-- ─── Daily Sets (Today's 5) ───────────────────────────────────────────────────

create table if not exists public.daily_sets (
  id          uuid    primary key default gen_random_uuid(),
  game_date   date    not null unique,
  title       text,
  status      text    not null default 'draft'
                check (status in ('draft','scheduled','published','retired')),
  created_by  uuid    references public.players(id),
  published_at timestamptz,
  created_at  timestamptz not null default now()
);

create table if not exists public.daily_set_items (
  id            uuid  primary key default gen_random_uuid(),
  daily_set_id  uuid  not null references public.daily_sets(id) on delete cascade,
  position      int   not null check (position between 1 and 10),
  puzzle_id     uuid  not null references public.puzzles(id),
  unique(daily_set_id, position)
);

-- ─── Challenges ───────────────────────────────────────────────────────────────

create table if not exists public.challenges (
  id                 uuid  primary key default gen_random_uuid(),
  daily_set_id       uuid  references public.daily_sets(id),
  daily_game_id      uuid  references public.daily_games(id),
  creator_player_id  uuid  references public.players(id),
  invite_code        text  not null unique
                       default upper(substring(replace(gen_random_uuid()::text, '-', '') from 1 for 8)),
  title              text,
  expires_at         timestamptz default now() + interval '7 days',
  max_players        int   default 20,
  status             text  not null default 'active'
                       check (status in ('active','closed','expired')),
  created_at         timestamptz not null default now()
);

-- ─── Play Tracking ────────────────────────────────────────────────────────────

create table if not exists public.plays (
  id                uuid  primary key default gen_random_uuid(),
  player_id         uuid  references public.players(id) on delete set null,
  puzzle_id         uuid  references public.puzzles(id) on delete cascade,
  daily_game_id     uuid  references public.daily_games(id),
  daily_set_item_id uuid  references public.daily_set_items(id),
  challenge_id      uuid  references public.challenges(id),
  guest_id          text,
  started_at        timestamptz not null default now(),
  completed_at      timestamptz,
  solved            boolean default false,
  attempts          int   default 0,
  hints_used        int   default 0,
  steps_revealed    int   default 0,
  score             int   default 0,
  time_seconds      int
);

create table if not exists public.guesses (
  id                 uuid  primary key default gen_random_uuid(),
  play_id            uuid  not null references public.plays(id) on delete cascade,
  attempt_number     int   not null,
  raw_guess          text  not null,
  normalized_guess   text  not null,
  matched_entity_id  uuid  references public.entities(id),
  is_correct         boolean not null default false,
  created_at         timestamptz not null default now()
);

create table if not exists public.clue_usage (
  id              uuid  primary key default gen_random_uuid(),
  play_id         uuid  not null references public.plays(id) on delete cascade,
  clue_id         uuid  references public.puzzle_clues(id),
  scene_clue_id   uuid  references public.clues(id),
  attempt_number  int,
  score_penalty   int   default 0,
  created_at      timestamptz not null default now()
);

-- ─── Player Stats ─────────────────────────────────────────────────────────────

create table if not exists public.player_stats (
  id                uuid    primary key default gen_random_uuid(),
  player_id         uuid    not null unique references public.players(id) on delete cascade,
  current_streak    int     default 0,
  longest_streak    int     default 0,
  total_games       int     default 0,
  total_solves      int     default 0,
  average_score     numeric default 0,
  average_attempts  numeric default 0,
  updated_at        timestamptz not null default now()
);

-- ─── Admin Users & Activity ───────────────────────────────────────────────────

create table if not exists public.admin_users (
  id            uuid  primary key default gen_random_uuid(),
  auth_user_id  uuid  not null unique references auth.users(id) on delete cascade,
  role          text  not null default 'editor'
                  check (role in ('owner','admin','editor','reviewer','analytics')),
  status        text  not null default 'active'
                  check (status in ('active','suspended')),
  created_at    timestamptz not null default now()
);

create table if not exists public.admin_activity (
  id              uuid  primary key default gen_random_uuid(),
  admin_user_id   uuid  references public.admin_users(id),
  action          text  not null,
  entity_type     text,
  entity_id       text,
  before_data     jsonb,
  after_data      jsonb,
  metadata        jsonb,
  created_at      timestamptz not null default now()
);

-- ─── Unified Assets ───────────────────────────────────────────────────────────

create table if not exists public.assets (
  id                uuid  primary key default gen_random_uuid(),
  asset_type        text  not null
                      check (asset_type in ('image','audio','video','poster','thumbnail')),
  storage_provider  text  not null default 'r2',
  storage_key       text  not null unique,
  public_url        text,
  mime_type         text,
  width             int,
  height            int,
  duration_seconds  numeric,
  file_size         int,
  status            text  not null default 'active',
  rights_status     text  not null default 'review_required'
                      check (rights_status in ('unknown','review_required','approved','restricted','rejected')),
  source_url        text,
  source_name       text,
  rights_notes      text,
  uploaded_by       uuid  references public.admin_users(id),
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create table if not exists public.entity_assets (
  entity_id  uuid  not null references public.entities(id) on delete cascade,
  asset_id   uuid  not null references public.assets(id) on delete cascade,
  role       text  not null,
  primary key (entity_id, asset_id, role)
);

create table if not exists public.puzzle_assets (
  puzzle_id  uuid  not null references public.puzzles(id) on delete cascade,
  asset_id   uuid  not null references public.assets(id) on delete cascade,
  role       text  not null,
  primary key (puzzle_id, asset_id, role)
);

-- ─── Content Tags ─────────────────────────────────────────────────────────────

create table if not exists public.content_tags (
  id           uuid  primary key default gen_random_uuid(),
  name         text  not null unique,
  slug         text  not null unique,
  type         text,
  description  text
);

create table if not exists public.entity_tags (
  entity_id  uuid  not null references public.entities(id) on delete cascade,
  tag_id     uuid  not null references public.content_tags(id) on delete cascade,
  primary key (entity_id, tag_id)
);

-- ─── Leaderboard ──────────────────────────────────────────────────────────────

create table if not exists public.leaderboard_entries (
  id            uuid  primary key default gen_random_uuid(),
  period_type   text  not null check (period_type in ('daily','weekly','monthly','all_time')),
  period_start  date,
  period_end    date,
  player_id     uuid  not null references public.players(id) on delete cascade,
  category      text,
  score         int   not null,
  rank          int,
  updated_at    timestamptz not null default now()
);

-- ─── RLS ──────────────────────────────────────────────────────────────────────

alter table public.daily_sets          enable row level security;
alter table public.daily_set_items     enable row level security;
alter table public.challenges          enable row level security;
alter table public.plays               enable row level security;
alter table public.guesses             enable row level security;
alter table public.clue_usage          enable row level security;
alter table public.player_stats        enable row level security;
alter table public.admin_users         enable row level security;
alter table public.admin_activity      enable row level security;
alter table public.assets              enable row level security;
alter table public.entity_assets       enable row level security;
alter table public.puzzle_assets       enable row level security;
alter table public.content_tags        enable row level security;
alter table public.entity_tags         enable row level security;
alter table public.leaderboard_entries enable row level security;

-- Public read policies
create policy "published daily sets public"
  on public.daily_sets for select
  using (status = 'published');

create policy "daily set items public"
  on public.daily_set_items for select
  using (
    exists (
      select 1 from public.daily_sets ds
      where ds.id = daily_set_id and ds.status = 'published'
    )
  );

create policy "active challenges public"
  on public.challenges for select
  using (status = 'active');

-- plays: anyone can insert; can only read own plays
create policy "plays insert public"
  on public.plays for insert
  with check (true);

create policy "plays read own"
  on public.plays for select
  using (
    guest_id = current_setting('app.guest_id', true)
    or player_id = auth.uid()
  );

-- guesses: insert freely; tied to plays RLS above for reads
create policy "guesses insert public"
  on public.guesses for insert
  with check (true);

create policy "guesses read public"
  on public.guesses for select
  using (true);

create policy "clue usage insert public"
  on public.clue_usage for insert
  with check (true);

create policy "player stats public"
  on public.player_stats for select
  using (true);

create policy "content tags public"
  on public.content_tags for select
  using (true);

create policy "entity tags public"
  on public.entity_tags for select
  using (true);

create policy "approved assets public"
  on public.assets for select
  using (rights_status = 'approved' and status = 'active');

create policy "entity assets public"
  on public.entity_assets for select
  using (true);

create policy "puzzle assets public"
  on public.puzzle_assets for select
  using (true);

create policy "leaderboard public"
  on public.leaderboard_entries for select
  using (true);

-- ─── Indexes ──────────────────────────────────────────────────────────────────

create index if not exists daily_sets_date_idx         on public.daily_sets(game_date);
create index if not exists daily_set_items_set_idx     on public.daily_set_items(daily_set_id);
create index if not exists challenges_code_idx         on public.challenges(invite_code);
create index if not exists plays_player_idx            on public.plays(player_id);
create index if not exists plays_puzzle_idx            on public.plays(puzzle_id);
create index if not exists plays_guest_idx             on public.plays(guest_id);
create index if not exists guesses_play_idx            on public.guesses(play_id);
create index if not exists clue_usage_play_idx         on public.clue_usage(play_id);
create index if not exists admin_users_auth_idx        on public.admin_users(auth_user_id);
create index if not exists assets_type_idx             on public.assets(asset_type);
create index if not exists assets_rights_idx           on public.assets(rights_status);
create index if not exists leaderboard_period_idx      on public.leaderboard_entries(period_type, period_start);
create index if not exists admin_activity_type_idx     on public.admin_activity(entity_type, created_at desc);

-- ─── Puzzle Health View ───────────────────────────────────────────────────────

create or replace view public.puzzle_health as
select
  p.id          as puzzle_id,
  p.type,
  p.title,
  p.status,
  (select count(*)::int from public.puzzle_steps  ps where ps.puzzle_id = p.id)   as step_count,
  (select count(*)::int from public.puzzle_answers pa where pa.puzzle_id = p.id)  as answer_count,
  (select count(*)::int from public.puzzle_clues  pc where pc.puzzle_id = p.id)   as clue_count,
  case
    when (select count(*) from public.puzzle_answers pa where pa.puzzle_id = p.id) = 0
      then 'missing_answers'
    when (select count(*) from public.puzzle_steps  ps where ps.puzzle_id = p.id) = 0
      then 'missing_steps'
    else 'healthy'
  end as issue
from public.puzzles p
where p.status not in ('published','archived','rejected');
