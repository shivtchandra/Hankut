INSERT INTO public.dramas (title_kr, title_en, aliases, year, network, genres, status)
SELECT * FROM (VALUES
('경우의 수','More Than Friends',ARRAY['경우의 수','More Than Friends','경우의수']::text[],2020,'JTBC',ARRAY['Drama']::text[],'published'),
('보건교사 안은영','The School Nurse Files',ARRAY['보건교사 안은영','The School Nurse Files','보건교사안은영']::text[],2020,'Netflix',ARRAY['Drama']::text[],'published'),
('화양연화','When My Love Blooms',ARRAY['화양연화','When My Love Blooms']::text[],2020,'tvN',ARRAY['Drama']::text[],'published'),
('아름다운 세상','Beautiful World',ARRAY['아름다운 세상','Beautiful World','아름다운세상']::text[],2019,'JTBC',ARRAY['Drama']::text[],'published'),
('지정생존자','Designated Survivor: 60 Days',ARRAY['지정생존자','Designated Survivor: 60 Days']::text[],2019,'tvN',ARRAY['Drama']::text[],'published'),
('꽃파당: 조선혼담공작소','Flower Crew: Joseon Marriage Agency',ARRAY['꽃파당: 조선혼담공작소','Flower Crew: Joseon Marriage Agency','꽃파당:조선혼담공작소']::text[],2019,'JTBC',ARRAY['Drama']::text[],'published'),
('해치','Haechi',ARRAY['해치','Haechi']::text[],2019,'Seoul Broadcasting System',ARRAY['Drama']::text[],'published'),
('사이코메트리 그녀석','He Is Psychometric',ARRAY['사이코메트리 그녀석','He Is Psychometric','사이코메트리그녀석']::text[],2019,'tvN',ARRAY['Drama']::text[],'published'),
('스토브리그','Hot Stove League',ARRAY['스토브리그','Hot Stove League']::text[],2019,'SBS',ARRAY['Drama']::text[],'published'),
('첫사랑은 처음이라서','My First First Love',ARRAY['첫사랑은 처음이라서','My First First Love','첫사랑은처음이라서']::text[],2019,'Netflix',ARRAY['Drama']::text[],'published'),
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