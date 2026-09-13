INSERT INTO public.dramas (title_kr, title_en, aliases, year, network, genres, status)
SELECT * FROM (VALUES
('사내맞선','Business Proposal',ARRAY['사내맞선','Business Proposal']::text[],2022,'Seoul Broadcasting System',ARRAY['Drama']::text[],'published'),
('갯마을 차차차','Hometown Cha-Cha-Cha',ARRAY['갯마을 차차차','Hometown Cha-Cha-Cha','갯마을차차차']::text[],2021,'tvN',ARRAY['로맨스','코미디']::text[],'published'),
('마이 네임','My Name',ARRAY['마이 네임','My Name','마이네임']::text[],2021,'Netflix',ARRAY['Drama']::text[],'published'),
('시그널','Signal',ARRAY['시그널','Signal']::text[],2016,'tvN',ARRAY['스릴러','범죄']::text[],'published'),
('그녀는 예뻤다','She Was Pretty',ARRAY['그녀는 예뻤다','She Was Pretty','그녀는예뻤다']::text[],2015,'MBC',ARRAY['Drama']::text[],'published'),
('기황후','Empress Ki',ARRAY['기황후','Empress Ki']::text[],2013,'Munhwa Broadcasting Corporation',ARRAY['Drama']::text[],'published'),
('너의 목소리가 들려','I Can Hear Your Voice',ARRAY['너의 목소리가 들려','I Can Hear Your Voice','너의목소리가들려']::text[],2013,'SBS',ARRAY['Drama']::text[],'published'),
('주군의 태양','Master''s Sun',ARRAY['주군의 태양','Master''s Sun','주군의태양']::text[],2013,'Seoul Broadcasting System',ARRAY['Drama']::text[],'published'),
('동이','Dong Yi',ARRAY['동이','Dong Yi']::text[],2010,'Munhwa Broadcasting Corporation',ARRAY['Drama']::text[],'published'),
('장난스런 키스','Playful Kiss',ARRAY['장난스런 키스','Playful Kiss','장난스런키스']::text[],2010,'Munhwa Broadcasting Corporation',ARRAY['Drama']::text[],'published'),
('미남이시네요','You''re Beautiful',ARRAY['미남이시네요','You''re Beautiful']::text[],2009,'TBS Television',ARRAY['Drama']::text[],'published'),
('이상한 변호사 우영우','Extraordinary Attorney Woo',ARRAY['이상한 변호사 우영우','Extraordinary Attorney Woo','이상한변호사우영우']::text[],2022,'Netflix',ARRAY['법률','드라마']::text[],'published'),
('악의 꽃','Flower of Evil',ARRAY['악의 꽃','Flower of Evil','악의꽃']::text[],2020,'tvN',ARRAY['Drama']::text[],'published'),
('남자친구','Encounter',ARRAY['남자친구','Encounter']::text[],2018,'tvN',ARRAY['Drama']::text[],'published'),
('닥터스','The Doctors',ARRAY['닥터스','The Doctors']::text[],2016,'SBS',ARRAY['Drama']::text[],'published')
) AS v(title_kr, title_en, aliases, year, network, genres, status)
WHERE NOT EXISTS (
  SELECT 1 FROM public.dramas d
  WHERE lower(d.title_en) = lower(v.title_en) OR d.title_kr = v.title_kr
);