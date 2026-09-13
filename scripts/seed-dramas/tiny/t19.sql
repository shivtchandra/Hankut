INSERT INTO public.dramas (title_kr, title_en, aliases, year, network, genres, status)
SELECT * FROM (VALUES
('계백','Gyebaek',ARRAY['계백','Gyebaek']::text[],2011,'MBC',ARRAY['Drama']::text[],'published'),
('주간 아이돌','Weekly Idol',ARRAY['주간 아이돌','Weekly Idol','주간아이돌']::text[],2011,'Munhwa Broadcasting Corporation',ARRAY['Drama']::text[],'published'),
('아테나: 전쟁의 여신','Athena: Goddess of War',ARRAY['아테나: 전쟁의 여신','Athena: Goddess of War','아테나:전쟁의여신']::text[],2010,'SBS',ARRAY['Drama']::text[],'published'),
('아가씨를 부탁해','My Fair Lady',ARRAY['아가씨를 부탁해','My Fair Lady','아가씨를부탁해']::text[],2009,'KBS2',ARRAY['Drama']::text[],'published'),
('에덴의 동쪽','East of Eden',ARRAY['에덴의 동쪽','East of Eden','에덴의동쪽']::text[],2008,'MBC',ARRAY['Drama']::text[],'published'),
('우리 결혼했어요','We Got Married',ARRAY['우리 결혼했어요','We Got Married','우리결혼했어요']::text[],2008,'Munhwa Broadcasting Corporation',ARRAY['Drama']::text[],'published'),
('왕과 나','The King and I',ARRAY['왕과 나','The King and I','왕과나']::text[],2007,'Seoul Broadcasting System',ARRAY['Drama']::text[],'published'),
('개와 늑대의 시간','Time Between Dog and Wolf',ARRAY['개와 늑대의 시간','Time Between Dog and Wolf','개와늑대의시간']::text[],2007,'Munhwa Broadcasting Corporation',ARRAY['Drama']::text[],'published'),
('환상의 커플','Couple or Trouble',ARRAY['환상의 커플','Couple or Trouble','환상의커플']::text[],2006,'Munhwa Broadcasting Corporation',ARRAY['Drama']::text[],'published'),
('별은 내 가슴에','Star in My Heart',ARRAY['별은 내 가슴에','Star in My Heart','별은내가슴에']::text[],1997,'Munhwa Broadcasting Corporation',ARRAY['Drama']::text[],'published'),
('첫사랑','First Love',ARRAY['첫사랑','First Love']::text[],1996,'KBS2',ARRAY['Drama']::text[],'published'),
('여명의 눈동자','Eyes of Dawn',ARRAY['여명의 눈동자','Eyes of Dawn','여명의눈동자']::text[],1991,'Munhwa Broadcasting Corporation',ARRAY['Drama']::text[],'published'),
('21세기 대군부인','Perfect Crown',ARRAY['21세기 대군부인','Perfect Crown','21세기대군부인']::text[],2026,'MBC',ARRAY['Drama']::text[],'published'),
('동궁','The East Palace',ARRAY['동궁','The East Palace']::text[],2026,'Netflix',ARRAY['Drama']::text[],'published'),
('에스콰이어: 변호사를 꿈꾸는 변호사들','Beyond the Bar',ARRAY['에스콰이어: 변호사를 꿈꾸는 변호사들','Beyond the Bar','에스콰이어:변호사를꿈꾸는변호사들']::text[],2025,'JTBC',ARRAY['Drama']::text[],'published')
) AS v(title_kr, title_en, aliases, year, network, genres, status)
WHERE NOT EXISTS (
  SELECT 1 FROM public.dramas d
  WHERE lower(d.title_en) = lower(v.title_en) OR d.title_kr = v.title_kr
);