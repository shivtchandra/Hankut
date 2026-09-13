INSERT INTO public.dramas (title_kr, title_en, aliases, year, network, genres, status)
SELECT * FROM (VALUES
('김비서가 왜 그럴까','What''s Wrong with Secretary Kim',ARRAY['김비서가 왜 그럴까','What''s Wrong with Secretary Kim','김비서가왜그럴까']::text[],2018,'TVN (Southeast Asia)',ARRAY['로맨스','코미디']::text[],'published'),
('더 킹 : 영원의 군주','The King: Eternal Monarch',ARRAY['더 킹 : 영원의 군주','The King: Eternal Monarch','더킹:영원의군주']::text[],2015,'SBS',ARRAY['Drama']::text[],'published'),
('로봇이 아니야','I''m Not a Robot',ARRAY['로봇이 아니야','I''m Not a Robot','로봇이아니야']::text[],2017,'Munhwa Broadcasting Corporation',ARRAY['Drama']::text[],'published'),
('더블유','W',ARRAY['더블유','W']::text[],2016,'MBC',ARRAY['Drama']::text[],'published'),
('오 나의 귀신님','Oh My Ghostess',ARRAY['오 나의 귀신님','Oh My Ghostess','오나의귀신님']::text[],2015,'tvN',ARRAY['Drama']::text[],'published'),
('프로듀사','Producer',ARRAY['프로듀사','Producer']::text[],2015,'KBS2',ARRAY['Drama']::text[],'published'),
('주몽','Jumong',ARRAY['주몽','Jumong']::text[],2006,'Munhwa Broadcasting Corporation',ARRAY['Drama']::text[],'published'),
('응답하라 1988','Reply 1988',ARRAY['응답하라 1988','Reply 1988','응답하라1988']::text[],2015,'tvN',ARRAY['로맨스','가족','코미디']::text[],'published'),
('드림하이','Dream High',ARRAY['드림하이','Dream High']::text[],2011,'KBS2',ARRAY['청춘','음악']::text[],'published'),
('겨울연가','Winter Sonata',ARRAY['겨울연가','Winter Sonata']::text[],2002,'KBS2',ARRAY['로맨스']::text[],'published'),
('어쩌다 발견한 하루','Extraordinary You',ARRAY['어쩌다 발견한 하루','Extraordinary You','어쩌다발견한하루']::text[],2019,'MBC',ARRAY['Drama']::text[],'published'),
('당신이 잠든 사이에','While You Were Sleeping',ARRAY['당신이 잠든 사이에','While You Were Sleeping','당신이잠든사이에']::text[],2017,'Seoul Broadcasting System',ARRAY['Drama']::text[],'published'),
('구르미 그린 달빛','Love in the Moonlight',ARRAY['구르미 그린 달빛','Love in the Moonlight','구르미그린달빛']::text[],2016,'Korean Broadcasting System',ARRAY['Drama']::text[],'published'),
('역도요정 김복주','Weightlifting Fairy Kim Bok-Joo',ARRAY['역도요정 김복주','Weightlifting Fairy Kim Bok-Joo','역도요정김복주']::text[],2016,'Munhwa Broadcasting Corporation',ARRAY['Drama']::text[],'published'),
('하이바이, 마마!','Hi Bye, Mama!',ARRAY['하이바이, 마마!','Hi Bye, Mama!','하이바이,마마!']::text[],2020,'tvN',ARRAY['Drama']::text[],'published')
) AS v(title_kr, title_en, aliases, year, network, genres, status)
WHERE NOT EXISTS (
  SELECT 1 FROM public.dramas d
  WHERE lower(d.title_en) = lower(v.title_en) OR d.title_kr = v.title_kr
);