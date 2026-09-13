-- Publishing lifecycle + content health helpers

alter table public.scenes
  drop constraint if exists scenes_status_check;

alter table public.scenes
  add constraint scenes_status_check
  check (status in (
    'draft',
    'content_review',
    'rights_review',
    'ready',
    'scheduled',
    'published',
    'rejected',
    'archived'
  ));

-- Keep unique date (already present) and expose content-health views
create or replace view public.content_health as
select
  s.id as scene_id,
  s.scene_code,
  d.title_kr,
  d.title_en,
  (
    select count(*)::int
    from public.scene_assets a
    where a.scene_id = s.id
  ) as frame_count,
  (
    select count(*)::int
    from public.clues c
    where c.scene_id = s.id
  ) as clue_count,
  s.rights_status,
  s.status,
  case
    when (
      select count(*) from public.scene_assets a where a.scene_id = s.id
    ) < 5 then 'missing_frames'
    when (
      select count(*) from public.clues c where c.scene_id = s.id
    ) = 0 then 'missing_clues'
    when s.rights_status <> 'approved' then 'rights_review'
    else 'healthy'
  end as issue
from public.scenes s
join public.dramas d on d.id = s.drama_id
where s.status not in ('published', 'archived', 'rejected');
