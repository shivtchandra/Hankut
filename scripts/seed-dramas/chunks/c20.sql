INSERT INTO public.dramas (title_kr, title_en, aliases, year, network, genres, status)
SELECT * FROM (VALUES
('역전의 여왕','Queen of Reversals',ARRAY['역전의 여왕','Queen of Reversals','역전의여왕']::text[],2010,'MBC',ARRAY['Drama']::text[],'published'),
('자명고','Ja Myung Go',ARRAY['자명고','Ja Myung Go']::text[],2009,'Seoul Broadcasting System',ARRAY['Drama']::text[],'published'),
('돌아온 일지매','The Return of Iljimae',ARRAY['돌아온 일지매','The Return of Iljimae','돌아온일지매']::text[],2009,'MBC',ARRAY['Drama']::text[],'published'),
('아내의 유혹','Temptation of Wife',ARRAY['아내의 유혹','Temptation of Wife','아내의유혹']::text[],2008,'Seoul Broadcasting System',ARRAY['Drama']::text[],'published'),
('너는 내 운명','You Are My Destiny',ARRAY['너는 내 운명','You Are My Destiny','너는내운명']::text[],2008,'KBS 1TV',ARRAY['Drama']::text[],'published'),
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