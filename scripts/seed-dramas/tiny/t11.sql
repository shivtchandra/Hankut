INSERT INTO public.dramas (title_kr, title_en, aliases, year, network, genres, status)
SELECT * FROM (VALUES
('블랙','Black',ARRAY['블랙','Black']::text[],2017,'OCN',ARRAY['Drama']::text[],'published'),
('7일의 왕비','Queen for Seven Days',ARRAY['7일의 왕비','Queen for Seven Days','7일의왕비']::text[],2017,'KBS2',ARRAY['Drama']::text[],'published'),
('비밀의 숲','Stranger',ARRAY['비밀의 숲','Stranger','비밀의숲']::text[],2017,'tvN',ARRAY['스릴러','법률']::text[],'published'),
('내일 그대와','Tomorrow With You',ARRAY['내일 그대와','Tomorrow With You','내일그대와']::text[],2017,'tvN',ARRAY['Drama']::text[],'published'),
('치즈인더트랩','Cheese in the Trap',ARRAY['치즈인더트랩','Cheese in the Trap']::text[],2016,'tvN',ARRAY['로맨스']::text[],'published'),
('몰랑이','Molang',ARRAY['몰랑이','Molang']::text[],2016,'Disney Jr.',ARRAY['Drama']::text[],'published'),
('너를 기억해','Hello Monster',ARRAY['너를 기억해','Hello Monster','너를기억해']::text[],2015,'KBS2',ARRAY['Drama']::text[],'published'),
('밤을 걷는 선비','Scholar Who Walks the Night',ARRAY['밤을 걷는 선비','Scholar Who Walks the Night','밤을걷는선비']::text[],2015,'MBC',ARRAY['Drama']::text[],'published'),
('퐁당퐁당 Love','Splash Splash Love',ARRAY['퐁당퐁당 Love','Splash Splash Love','퐁당퐁당Love']::text[],2015,'MBC',ARRAY['Drama']::text[],'published'),
('맨도롱 또똣','Warm and Cozy',ARRAY['맨도롱 또똣','Warm and Cozy','맨도롱또똣']::text[],2015,'Munhwa Broadcasting Corporation',ARRAY['Drama']::text[],'published'),
('내겐 너무 사랑스러운 그녀','My Lovely Girl',ARRAY['내겐 너무 사랑스러운 그녀','My Lovely Girl','내겐너무사랑스러운그녀']::text[],2014,'Seoul Broadcasting System',ARRAY['Drama']::text[],'published'),
('야경꾼 일지','Night Watchman''s Journal',ARRAY['야경꾼 일지','Night Watchman''s Journal','야경꾼일지']::text[],2014,'MBC',ARRAY['Drama']::text[],'published'),
('예쁜 남자','Bel Ami',ARRAY['예쁜 남자','Bel Ami','예쁜남자']::text[],2013,'KBS2',ARRAY['Drama']::text[],'published'),
('불의 여신 정이','Goddess of Fire',ARRAY['불의 여신 정이','Goddess of Fire','불의여신정이']::text[],2013,'Munhwa Broadcasting Corporation',ARRAY['Drama']::text[],'published'),
('응답하라 1994','Reply 1994',ARRAY['응답하라 1994','Reply 1994','응답하라1994']::text[],2013,'tvN',ARRAY['로맨스','청춘']::text[],'published')
) AS v(title_kr, title_en, aliases, year, network, genres, status)
WHERE NOT EXISTS (
  SELECT 1 FROM public.dramas d
  WHERE lower(d.title_en) = lower(v.title_en) OR d.title_kr = v.title_kr
);