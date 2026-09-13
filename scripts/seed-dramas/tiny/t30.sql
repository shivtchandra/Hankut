INSERT INTO public.dramas (title_kr, title_en, aliases, year, network, genres, status)
SELECT * FROM (VALUES
('뱀파이어 탐정','Vampire Detective',ARRAY['뱀파이어 탐정','Vampire Detective','뱀파이어탐정']::text[],2016,'OCN',ARRAY['Drama']::text[],'published'),
('앵그리맘','Angry Mom',ARRAY['앵그리맘','Angry Mom']::text[],2015,'Munhwa Broadcasting Corporation',ARRAY['Drama']::text[],'published'),
('달려라 방탄','Run BTS',ARRAY['달려라 방탄','Run BTS','달려라방탄']::text[],2015,NULL,ARRAY['Drama']::text[],'published'),
('너를 사랑한 시간','The Time We Were Not in Love',ARRAY['너를 사랑한 시간','The Time We Were Not in Love','너를사랑한시간']::text[],2015,'Seoul Broadcasting System',ARRAY['Drama']::text[],'published'),
('마녀의 연애','A Witch''s Love',ARRAY['마녀의 연애','A Witch''s Love','마녀의연애']::text[],2014,'tvN',ARRAY['Drama']::text[],'published'),
('앙큼한 돌싱녀','Cunning Single Lady',ARRAY['앙큼한 돌싱녀','Cunning Single Lady','앙큼한돌싱녀']::text[],2014,'Munhwa Broadcasting Corporation',ARRAY['Drama']::text[],'published'),
('로맨스가 필요해 3','I Need Romance 3',ARRAY['로맨스가 필요해 3','I Need Romance 3','로맨스가필요해3']::text[],2014,'tvN',ARRAY['Drama']::text[],'published'),
('라이어 게임','Liar Game',ARRAY['라이어 게임','Liar Game','라이어게임']::text[],2014,'tvN',ARRAY['Drama']::text[],'published'),
('연애 말고 결혼','Marriage, Not Dating',ARRAY['연애 말고 결혼','Marriage, Not Dating','연애말고결혼']::text[],2014,'tvN',ARRAY['Drama']::text[],'published'),
('모던파머','Modern Farmer',ARRAY['모던파머','Modern Farmer']::text[],2014,'Seoul Broadcasting System',ARRAY['Drama']::text[],'published'),
('밀회','Secret Affair',ARRAY['밀회','Secret Affair']::text[],2014,'JTBC',ARRAY['Drama']::text[],'published'),
('비밀의 문','Secret Door',ARRAY['비밀의 문','Secret Door','비밀의문']::text[],2014,'Seoul Broadcasting System',ARRAY['Drama']::text[],'published'),
('잉여공주','The Idle Mermaid',ARRAY['잉여공주','The Idle Mermaid']::text[],2014,'tvN',ARRAY['Drama']::text[],'published'),
('메디컬 탑팀','Medical Top Team',ARRAY['메디컬 탑팀','Medical Top Team','메디컬탑팀']::text[],2013,'Munhwa Broadcasting Corporation',ARRAY['Drama']::text[],'published'),
('각시탈','Bridal Mask',ARRAY['각시탈','Bridal Mask']::text[],2012,'KBS2',ARRAY['Drama']::text[],'published')
) AS v(title_kr, title_en, aliases, year, network, genres, status)
WHERE NOT EXISTS (
  SELECT 1 FROM public.dramas d
  WHERE lower(d.title_en) = lower(v.title_en) OR d.title_kr = v.title_kr
);