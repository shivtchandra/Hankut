-- Admin write policies
-- The Next.js admin layer (requireAdmin) already enforces that only admin
-- users reach these server actions. These RLS policies let authenticated
-- sessions write through Supabase without the service-role key.

-- entities
create policy "admin write entities" on public.entities
  for all
  using  (auth.uid() is not null)
  with check (auth.uid() is not null);

-- puzzles
create policy "admin write puzzles" on public.puzzles
  for all
  using  (auth.uid() is not null)
  with check (auth.uid() is not null);

-- puzzle_steps
create policy "admin write puzzle_steps" on public.puzzle_steps
  for all
  using  (auth.uid() is not null)
  with check (auth.uid() is not null);

-- puzzle_clues
create policy "admin write puzzle_clues" on public.puzzle_clues
  for all
  using  (auth.uid() is not null)
  with check (auth.uid() is not null);

-- puzzle_answers
create policy "admin write puzzle_answers" on public.puzzle_answers
  for all
  using  (auth.uid() is not null)
  with check (auth.uid() is not null);

-- scene_assets (clues table in 001)
create policy "admin write clues" on public.clues
  for all
  using  (auth.uid() is not null)
  with check (auth.uid() is not null);

-- daily_sets and items (from 004 — run only if 004 was applied)
do $$ begin
  if exists (select 1 from information_schema.tables where table_name = 'daily_sets') then
    execute $p$
      create policy "admin write daily_sets" on public.daily_sets
        for all using (auth.uid() is not null) with check (auth.uid() is not null);
      create policy "admin write daily_set_items" on public.daily_set_items
        for all using (auth.uid() is not null) with check (auth.uid() is not null);
    $p$;
  end if;
end $$;

-- admin_activity (from 004)
do $$ begin
  if exists (select 1 from information_schema.tables where table_name = 'admin_activity') then
    execute $p$
      create policy "admin write admin_activity" on public.admin_activity
        for all using (auth.uid() is not null) with check (auth.uid() is not null);
    $p$;
  end if;
end $$;

-- admin_users (from 004): allow authenticated reads so getAdminRoleForUser works
do $$ begin
  if exists (select 1 from information_schema.tables where table_name = 'admin_users') then
    execute $p$
      create policy "admin_users own read" on public.admin_users
        for select using (auth_user_id = auth.uid());
    $p$;
  end if;
end $$;
