INSERT INTO public.dramas (title_kr, title_en, aliases, year, network, genres, status)
SELECT * FROM (VALUES
('쩐의 전쟁','War of Money',ARRAY['쩐의 전쟁','War of Money','쩐의전쟁']::text[],2007,'SBS',ARRAY['Drama']::text[],'published'),
('거침없이 하이킥!','High Kick!',ARRAY['거침없이 하이킥!','High Kick!','거침없이하이킥!']::text[],2006,'MBC',ARRAY['Drama']::text[],'published'),
('아이언 키드','Iron Kid',ARRAY['아이언 키드','Iron Kid','아이언키드']::text[],2006,'Korean Broadcasting System',ARRAY['Drama']::text[],'published'),
('천국의 나무','Tree of Heaven',ARRAY['천국의 나무','Tree of Heaven','천국의나무']::text[],2006,'Seoul Broadcasting System',ARRAY['Drama']::text[],'published'),
('굳세어라 금순아','Be Strong',ARRAY['굳세어라 금순아','Be Strong','굳세어라금순아']::text[],2005,'Munhwa Broadcasting Corporation',ARRAY['Drama']::text[],'published'),
('프라하의 연인','Lovers in Prague',ARRAY['프라하의 연인','Lovers in Prague','프라하의연인']::text[],2005,'Seoul Broadcasting System',ARRAY['Drama']::text[],'published'),
('파리의 연인','Lovers in Paris',ARRAY['파리의 연인','Lovers in Paris','파리의연인']::text[],2004,'SBS',ARRAY['로맨스']::text[],'published'),
('올림포스 가디언','Olympus Guardian',ARRAY['올림포스 가디언','Olympus Guardian','올림포스가디언']::text[],2002,'Seoul Broadcasting System',ARRAY['Drama']::text[],'published'),
('명성황후','Empress Myeongseong',ARRAY['명성황후','Empress Myeongseong']::text[],2001,'Korean Broadcasting System',ARRAY['Drama']::text[],'published'),
('스프링 피버','Spring Fever',ARRAY['스프링 피버','Spring Fever','스프링피버']::text[],2026,'tvN',ARRAY['Drama']::text[],'published'),
('김부장','Agent Kim Reactivated',ARRAY['김부장','Agent Kim Reactivated']::text[],2026,'SBS',ARRAY['Drama']::text[],'published'),
('얄미운 사랑','Nice to Not Meet You',ARRAY['얄미운 사랑','Nice to Not Meet You','얄미운사랑']::text[],2025,'tvN',ARRAY['Drama']::text[],'published'),
('마녀','The Witch',ARRAY['마녀','The Witch']::text[],2025,'Channel A',ARRAY['Drama']::text[],'published'),
('당신이 죽였다','As You Stood By',ARRAY['당신이 죽였다','As You Stood By','당신이죽였다']::text[],2025,'Netflix',ARRAY['Drama']::text[],'published'),
('S라인','S Line',ARRAY['S라인','S Line']::text[],2025,'Vidio',ARRAY['Drama']::text[],'published')
) AS v(title_kr, title_en, aliases, year, network, genres, status)
WHERE NOT EXISTS (
  SELECT 1 FROM public.dramas d
  WHERE lower(d.title_en) = lower(v.title_en) OR d.title_kr = v.title_kr
);