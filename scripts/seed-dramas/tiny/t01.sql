INSERT INTO public.dramas (title_kr, title_en, aliases, year, network, genres, status)
SELECT * FROM (VALUES
('이태원 클라쓰','Itaewon Class',ARRAY['이태원 클라쓰','Itaewon Class','이태원클라쓰']::text[],2020,'JTBC',ARRAY['드라마','청춘']::text[],'published'),
('시크릿 가든','Secret Garden',ARRAY['시크릿 가든','Secret Garden','시크릿가든']::text[],2010,'SBS',ARRAY['판타지','로맨스']::text[],'published'),
('커피프린스 1호점','The 1st Shop of Coffee Prince',ARRAY['커피프린스 1호점','The 1st Shop of Coffee Prince','커피프린스1호점']::text[],2007,'MBC',ARRAY['로맨스','코미디']::text[],'published'),
('종이의 집: 공동경제구역','Money Heist: Korea - Joint Economic Area',ARRAY['종이의 집: 공동경제구역','Money Heist: Korea - Joint Economic Area','종이의집:공동경제구역']::text[],2022,'Netflix',ARRAY['Drama']::text[],'published'),
('지옥','Hellbound',ARRAY['지옥','Hellbound']::text[],2021,'Netflix',ARRAY['Drama']::text[],'published'),
('미스터 션샤인','Mr. Sunshine',ARRAY['미스터 션샤인','Mr. Sunshine','미스터션샤인']::text[],2018,'tvN',ARRAY['사극','로맨스']::text[],'published'),
('화유기','A Korean Odyssey',ARRAY['화유기','A Korean Odyssey']::text[],2017,'tvN',ARRAY['Drama']::text[],'published'),
('힘쎈여자 도봉순','Strong Woman Do Bong-soon',ARRAY['힘쎈여자 도봉순','Strong Woman Do Bong-soon','힘쎈여자도봉순']::text[],2017,'JTBC',ARRAY['Drama']::text[],'published'),
('화랑','Hwarang: The Poet Warrior Youth',ARRAY['화랑','Hwarang: The Poet Warrior Youth']::text[],2016,'KBS2',ARRAY['Drama']::text[],'published'),
('스위트홈','Sweet Home',ARRAY['스위트홈','Sweet Home']::text[],2020,NULL,ARRAY['Drama']::text[],'published'),
('피노키오','Pinocchio',ARRAY['피노키오','Pinocchio']::text[],2014,'Seoul Broadcasting System',ARRAY['로맨스','드라마']::text[],'published'),
('넌 내게 반했어','Heartstrings',ARRAY['넌 내게 반했어','Heartstrings','넌내게반했어']::text[],2011,'Munhwa Broadcasting Corporation',ARRAY['Drama']::text[],'published'),
('선덕여왕','Queen Seondeok',ARRAY['선덕여왕','Queen Seondeok']::text[],2009,'MBC',ARRAY['Drama']::text[],'published'),
('눈물의 여왕','Queen of Tears',ARRAY['눈물의 여왕','Queen of Tears','눈물의여왕']::text[],2024,'tvN',ARRAY['로맨스','드라마']::text[],'published'),
('환혼','Alchemy of Souls',ARRAY['환혼','Alchemy of Souls']::text[],2022,'tvN',ARRAY['판타지','액션']::text[],'published')
) AS v(title_kr, title_en, aliases, year, network, genres, status)
WHERE NOT EXISTS (
  SELECT 1 FROM public.dramas d
  WHERE lower(d.title_en) = lower(v.title_en) OR d.title_kr = v.title_kr
);