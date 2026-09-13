INSERT INTO public.dramas (title_kr, title_en, aliases, year, network, genres, status)
SELECT * FROM (VALUES
('일단 뜨겁게 청소하라','Clean with Passion for Now',ARRAY['일단 뜨겁게 청소하라','Clean with Passion for Now','일단뜨겁게청소하라']::text[],2018,'JTBC',ARRAY['Drama']::text[],'published'),
('대군 - 사랑을 그리다','Grand Prince',ARRAY['대군 - 사랑을 그리다','Grand Prince','대군-사랑을그리다']::text[],2018,'TV CHOSUN',ARRAY['Drama']::text[],'published'),
('위대한 유혹자','Tempted',ARRAY['위대한 유혹자','Tempted','위대한유혹자']::text[],2018,'MBC',ARRAY['Drama']::text[],'published'),
('김과장','Good Manager',ARRAY['김과장','Good Manager']::text[],2017,'KBS2',ARRAY['Drama']::text[],'published'),
('피고인','Innocent Defendant',ARRAY['피고인','Innocent Defendant']::text[],2017,'SBS',ARRAY['Drama']::text[],'published'),
('내성적인 보스','Introverted Boss',ARRAY['내성적인 보스','Introverted Boss','내성적인보스']::text[],2017,'tvN',ARRAY['Drama']::text[],'published'),
('미씽9','Missing 9',ARRAY['미씽9','Missing 9']::text[],2017,'Munhwa Broadcasting Corporation',ARRAY['Drama']::text[],'published'),
('슬기로운 감빵생활','Prison Playbook',ARRAY['슬기로운 감빵생활','Prison Playbook','슬기로운감빵생활']::text[],2017,'tvN',ARRAY['Drama']::text[],'published'),
('역적 : 백성을 훔친 도적','Rebel: Thief Who Stole the People',ARRAY['역적 : 백성을 훔친 도적','Rebel: Thief Who Stole the People','역적:백성을훔친도적']::text[],2017,'Munhwa Broadcasting Corporation',ARRAY['Drama']::text[],'published'),
('다시 만난 세계','Reunited Worlds',ARRAY['다시 만난 세계','Reunited Worlds','다시만난세계']::text[],2017,'Seoul Broadcasting System',ARRAY['Drama']::text[],'published'),
('터널','Tunnel',ARRAY['터널','Tunnel']::text[],2017,'OCN',ARRAY['스릴러']::text[],'published'),
('미녀 공심이','Beautiful Gong Shim',ARRAY['미녀 공심이','Beautiful Gong Shim','미녀공심이']::text[],2016,'Seoul Broadcasting System',ARRAY['Drama']::text[],'published'),
('굿바이 미스터 블랙','Goodbye Mr. Black',ARRAY['굿바이 미스터 블랙','Goodbye Mr. Black','굿바이미스터블랙']::text[],2016,'Munhwa Broadcasting Corporation',ARRAY['Drama']::text[],'published'),
('운빨로맨스','Lucky Romance',ARRAY['운빨로맨스','Lucky Romance']::text[],2016,'Munhwa Broadcasting Corporation',ARRAY['Drama']::text[],'published'),
('공항 가는 길','On the Way to the Airport',ARRAY['공항 가는 길','On the Way to the Airport','공항가는길']::text[],2016,'Korean Broadcasting System',ARRAY['Drama']::text[],'published')
) AS v(title_kr, title_en, aliases, year, network, genres, status)
WHERE NOT EXISTS (
  SELECT 1 FROM public.dramas d
  WHERE lower(d.title_en) = lower(v.title_en) OR d.title_kr = v.title_kr
);