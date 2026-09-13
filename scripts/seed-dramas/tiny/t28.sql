INSERT INTO public.dramas (title_kr, title_en, aliases, year, network, genres, status)
SELECT * FROM (VALUES
('모범택시','Taxi Driver',ARRAY['모범택시','Taxi Driver']::text[],2021,'SBS',ARRAY['Drama']::text[],'published'),
('두 번째 남편','The Second Husband',ARRAY['두 번째 남편','The Second Husband','두번째남편']::text[],2021,'MBC',ARRAY['Drama']::text[],'published'),
('바람피면 죽는다','Cheat on Me, if You Can',ARRAY['바람피면 죽는다','Cheat on Me, if You Can','바람피면죽는다']::text[],2020,'KBS2',ARRAY['Drama']::text[],'published'),
('굿캐스팅','Good Casting',ARRAY['굿캐스팅','Good Casting']::text[],2020,'SBS',ARRAY['Drama']::text[],'published'),
('메모리스트','Memorist',ARRAY['메모리스트','Memorist']::text[],2020,'tvN',ARRAY['Drama']::text[],'published'),
('경우의 수','More Than Friends',ARRAY['경우의 수','More Than Friends','경우의수']::text[],2020,'JTBC',ARRAY['Drama']::text[],'published'),
('보건교사 안은영','The School Nurse Files',ARRAY['보건교사 안은영','The School Nurse Files','보건교사안은영']::text[],2020,'Netflix',ARRAY['Drama']::text[],'published'),
('화양연화','When My Love Blooms',ARRAY['화양연화','When My Love Blooms']::text[],2020,'tvN',ARRAY['Drama']::text[],'published'),
('아름다운 세상','Beautiful World',ARRAY['아름다운 세상','Beautiful World','아름다운세상']::text[],2019,'JTBC',ARRAY['Drama']::text[],'published'),
('지정생존자','Designated Survivor: 60 Days',ARRAY['지정생존자','Designated Survivor: 60 Days']::text[],2019,'tvN',ARRAY['Drama']::text[],'published'),
('꽃파당: 조선혼담공작소','Flower Crew: Joseon Marriage Agency',ARRAY['꽃파당: 조선혼담공작소','Flower Crew: Joseon Marriage Agency','꽃파당:조선혼담공작소']::text[],2019,'JTBC',ARRAY['Drama']::text[],'published'),
('해치','Haechi',ARRAY['해치','Haechi']::text[],2019,'Seoul Broadcasting System',ARRAY['Drama']::text[],'published'),
('사이코메트리 그녀석','He Is Psychometric',ARRAY['사이코메트리 그녀석','He Is Psychometric','사이코메트리그녀석']::text[],2019,'tvN',ARRAY['Drama']::text[],'published'),
('스토브리그','Hot Stove League',ARRAY['스토브리그','Hot Stove League']::text[],2019,'SBS',ARRAY['Drama']::text[],'published'),
('첫사랑은 처음이라서','My First First Love',ARRAY['첫사랑은 처음이라서','My First First Love','첫사랑은처음이라서']::text[],2019,'Netflix',ARRAY['Drama']::text[],'published')
) AS v(title_kr, title_en, aliases, year, network, genres, status)
WHERE NOT EXISTS (
  SELECT 1 FROM public.dramas d
  WHERE lower(d.title_en) = lower(v.title_en) OR d.title_kr = v.title_kr
);