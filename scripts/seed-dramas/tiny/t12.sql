INSERT INTO public.dramas (title_kr, title_en, aliases, year, network, genres, status)
SELECT * FROM (VALUES
('그 겨울, 바람이 분다','That Winter, The Wind Blows',ARRAY['그 겨울, 바람이 분다','That Winter, The Wind Blows','그겨울,바람이분다']::text[],2013,'Seoul Broadcasting System',ARRAY['로맨스']::text[],'published'),
('신사의 품격','A Gentleman''s Dignity',ARRAY['신사의 품격','A Gentleman''s Dignity','신사의품격']::text[],2012,'Seoul Broadcasting System',ARRAY['로맨스','코미디']::text[],'published'),
('빅','Big',ARRAY['빅','Big']::text[],2012,'Korean Broadcasting System',ARRAY['Drama']::text[],'published'),
('인현왕후의 남자','Queen In-Hyun''s Man',ARRAY['인현왕후의 남자','Queen In-Hyun''s Man','인현왕후의남자']::text[],2012,'tvN',ARRAY['Drama']::text[],'published'),
('최고의 사랑','The Greatest Love',ARRAY['최고의 사랑','The Greatest Love','최고의사랑']::text[],2011,'MBC',ARRAY['Drama']::text[],'published'),
('추노','Chuno',ARRAY['추노','Chuno']::text[],2010,'KBS2',ARRAY['Drama']::text[],'published'),
('찬란한 유산','Brilliant Legacy',ARRAY['찬란한 유산','Brilliant Legacy','찬란한유산']::text[],2009,'Seoul Broadcasting System',ARRAY['Drama']::text[],'published'),
('다모','Damo',ARRAY['다모','Damo']::text[],2003,'MBC',ARRAY['Drama']::text[],'published'),
('여름향기','Summer Scent',ARRAY['여름향기','Summer Scent']::text[],2003,'KBS2',ARRAY['Drama']::text[],'published'),
('상도','The Merchant of Joseon',ARRAY['상도','The Merchant of Joseon']::text[],2001,'Munhwa Broadcasting Corporation',ARRAY['Drama']::text[],'published'),
('폭군의 셰프','Bon Appétit, Your Majesty',ARRAY['폭군의 셰프','Bon Appétit, Your Majesty','폭군의셰프']::text[],2025,'tvN',ARRAY['Drama']::text[],'published'),
('다 이루어질지니','Genie, Make a Wish',ARRAY['다 이루어질지니','Genie, Make a Wish','다이루어질지니']::text[],2025,'Netflix',ARRAY['Drama']::text[],'published'),
('굿보이','Good Boy',ARRAY['굿보이','Good Boy']::text[],2025,'JTBC',ARRAY['Drama']::text[],'published'),
('별들에게 물어봐','When the Stars Gossip',ARRAY['별들에게 물어봐','When the Stars Gossip','별들에게물어봐']::text[],2025,'tvN',ARRAY['Drama']::text[],'published'),
('더 에이트 쇼','The 8 Show',ARRAY['더 에이트 쇼','The 8 Show','더에이트쇼']::text[],2024,'Netflix',ARRAY['Drama']::text[],'published')
) AS v(title_kr, title_en, aliases, year, network, genres, status)
WHERE NOT EXISTS (
  SELECT 1 FROM public.dramas d
  WHERE lower(d.title_en) = lower(v.title_en) OR d.title_kr = v.title_kr
);