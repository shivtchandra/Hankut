-- 007: Global leaderboard
-- Guests pick a nickname tied to their device id (players.guest_id).
-- Rankings are computed live from plays: first completed play per guest per
-- puzzle counts (replays / duplicate submissions are ignored).

-- Mini-game plays reference daily_set_items, not daily_games.
alter table public.plays alter column daily_game_id drop not null;

alter table public.players add column if not exists guest_id text;
create unique index if not exists players_guest_id_key on public.players(guest_id);
create unique index if not exists players_display_name_lower_key on public.players(lower(display_name));
alter table public.players drop constraint if exists players_display_name_len;
alter table public.players add constraint players_display_name_len
  check (display_name is null or char_length(display_name) between 2 and 16);

create index if not exists plays_guest_completed_idx
  on public.plays(guest_id) where completed_at is not null;

create or replace function public.get_leaderboard(
  p_period   text default 'all',
  p_limit    int  default 50,
  p_guest_id text default null
)
returns table (
  rank           bigint,
  display_name   text,
  total_score    bigint,
  solves         bigint,
  games          bigint,
  current_streak int,
  is_me          boolean
)
language sql
stable
as $$
  with today as (
    select (now() at time zone 'Asia/Seoul')::date as d
  ),
  base as (
    select
      p.guest_id,
      coalesce(p.daily_game_id::text, p.daily_set_item_id::text) as target,
      coalesce(dg.game_date, ds.game_date)                       as game_date,
      coalesce(p.solved, false)                                  as solved,
      greatest(0, least(25, coalesce(p.score, 0)))               as score,
      p.completed_at
    from public.plays p
    left join public.daily_games dg      on dg.id  = p.daily_game_id
    left join public.daily_set_items dsi on dsi.id = p.daily_set_item_id
    left join public.daily_sets ds       on ds.id  = dsi.daily_set_id
    where p.completed_at is not null
      and p.guest_id is not null
      and p.challenge_id is null
  ),
  firsts as (
    select distinct on (guest_id, target) *
    from base
    where game_date is not null
    order by guest_id, target, completed_at
  ),
  named as (
    select f.*, pl.display_name
    from firsts f
    join public.players pl on pl.guest_id = f.guest_id
    where pl.display_name is not null
      and f.game_date <= (select d from today)
  ),
  streaks as (
    select guest_id, count(*)::int as streak
    from (
      select guest_id, d, d - (row_number() over (partition by guest_id order by d))::int as grp
      from (select distinct guest_id, game_date as d from named) x
    ) y
    group by guest_id, grp
    having max(d) >= (select d from today) - 1
  ),
  filtered as (
    select n.*
    from named n, today t
    where case p_period
      when 'today' then n.game_date = t.d
      when 'week'  then n.game_date > t.d - 7
      when 'month' then n.game_date >= date_trunc('month', t.d)::date
      else true
    end
  ),
  agg as (
    select
      guest_id,
      max(display_name)                 as display_name,
      sum(score)::bigint                as total_score,
      count(*) filter (where solved)    as solves,
      count(*)                          as games,
      min(completed_at)                 as first_at
    from filtered
    group by guest_id
  ),
  ranked as (
    select
      a.*,
      rank()       over (order by total_score desc, solves desc)           as rnk,
      row_number() over (order by total_score desc, solves desc, first_at) as rn
    from agg a
  )
  select
    r.rnk,
    r.display_name,
    r.total_score,
    r.solves,
    r.games,
    coalesce(s.streak, 0),
    (p_guest_id is not null and r.guest_id = p_guest_id)
  from ranked r
  left join streaks s on s.guest_id = r.guest_id
  where r.rn <= p_limit or r.guest_id = p_guest_id
  order by r.rn;
$$;
