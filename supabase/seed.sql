insert into public.admin_allowlist (email)
values ('shivachandra9490@gmail.com')
on conflict do nothing;

insert into public.dramas (id, title_kr, title_en, aliases, year, network, genres, status) values
('00000000-0000-0000-0000-000000000001','폭싹 속았수다','When Life Gives You Tangerines',array['폭싹 속았수다','When Life Gives You Tangerines','폭싹속았수다'],2025,'Netflix',array['Drama','Romance','Family'],'published'),
('00000000-0000-0000-0000-000000000002','나의 해방일지','My Liberation Notes',array['나의 해방일지','My Liberation Notes'],2022,'JTBC',array['Drama','Slice of Life'],'published'),
('00000000-0000-0000-0000-000000000003','우리들의 블루스','Our Blues',array['우리들의 블루스','Our Blues'],2022,'tvN',array['Drama'],'published'),
('00000000-0000-0000-0000-000000000004','무빙','Moving',array['무빙','Moving'],2023,'Disney+',array['Action','Fantasy','Drama'],'published'),
('00000000-0000-0000-0000-000000000005','호텔 델루나','Hotel del Luna',array['호텔 델루나','Hotel del Luna'],2019,'tvN',array['Fantasy','Romance'],'published')
on conflict (id) do nothing;

insert into public.scenes (id, drama_id, scene_code, episode, difficulty, recognition_score, description, status, rights_status)
values ('00000000-0000-0000-0000-000000000101','00000000-0000-0000-0000-000000000001','S03-tangerines-01',3,6.8,0.7,'Demo frames for first published puzzle.','published','approved')
on conflict (drama_id, scene_code) do nothing;

insert into public.scene_assets (scene_id, frame_order, asset_key, public_url, mime_type, rights_status) values
('00000000-0000-0000-0000-000000000101',1,'demo/frame-1.svg','/demo/frame-1.svg','image/svg+xml','approved'),
('00000000-0000-0000-0000-000000000101',2,'demo/frame-2.svg','/demo/frame-2.svg','image/svg+xml','approved'),
('00000000-0000-0000-0000-000000000101',3,'demo/frame-3.svg','/demo/frame-3.svg','image/svg+xml','approved'),
('00000000-0000-0000-0000-000000000101',4,'demo/frame-4.svg','/demo/frame-4.svg','image/svg+xml','approved'),
('00000000-0000-0000-0000-000000000101',5,'demo/frame-5.svg','/demo/frame-5.svg','image/svg+xml','approved')
on conflict (scene_id, frame_order) do nothing;

insert into public.clues (scene_id, clue_order, type, value, unlock_after) values
('00000000-0000-0000-0000-000000000101',1,'방영','2025',1),
('00000000-0000-0000-0000-000000000101',2,'플랫폼','Netflix',2),
('00000000-0000-0000-0000-000000000101',3,'배경','제주',3)
on conflict (scene_id, clue_order) do nothing;

insert into public.daily_games (game_date, scene_id, difficulty, status)
values ((timezone('Asia/Seoul', now()))::date, '00000000-0000-0000-0000-000000000101', 6.8, 'published')
on conflict (game_date) do update set scene_id = excluded.scene_id, status = 'published', difficulty = excluded.difficulty;
