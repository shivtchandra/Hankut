-- Daily scenes for 2026-09-16/18/21/24 pointed at draft duplicate dramas created by
-- quickCreateDrama. Drafts are excluded from the guess autocomplete, and their
-- aliases didn't include the real titles, so correct guesses were marked wrong.
-- Repoint scenes to the published rows, keep the alt title as an alias, and
-- archive the duplicates (no deletes).

begin;

-- Vincenzo
update scenes set drama_id = '5e75ac32-5565-44a2-89ab-a9b2039a6807'
where drama_id = 'af1d5fcd-7c63-4d54-99f4-b1401dc633b8';

-- Weightlifting Fairy Kim Bok-joo
update scenes set drama_id = '660b969b-e0a8-4897-ae66-eb16008dc94f'
where drama_id = '9e463f50-58c0-422a-b56b-073cec67054c';

-- Strong Woman Do Bong-soon (draft was "Strong Girl Bong-soon")
update scenes set drama_id = 'bbf70783-8736-4062-8e89-cc0efa2edd76'
where drama_id = 'f2ef80ab-46f7-454d-ba71-b7e7c0fe5655';

update dramas set aliases = array_append(aliases, 'Strong Girl Bong-soon')
where id = 'bbf70783-8736-4062-8e89-cc0efa2edd76'
  and not ('Strong Girl Bong-soon' = any(aliases));

update dramas set status = 'archived'
where id in (
  'af1d5fcd-7c63-4d54-99f4-b1401dc633b8',
  '9e463f50-58c0-422a-b56b-073cec67054c',
  'f2ef80ab-46f7-454d-ba71-b7e7c0fe5655'
);

-- The K2 has no published row: fill in the draft and publish it.
update dramas set
  title_kr = '더 케이투',
  title_en = 'The K2',
  aliases  = array['더 케이투', '더케이투', 'The K2', 'K2'],
  year     = coalesce(year, 2016),
  network  = coalesce(network, 'tvN'),
  status   = 'published'
where id = 'b5cdf3e3-784d-4ee8-b6c8-977858d848bd';

commit;
