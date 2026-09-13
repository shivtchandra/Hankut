INSERT INTO public.dramas (title_kr, title_en, aliases, year, network, genres, status)
SELECT * FROM (VALUES
('피노키오','Pinocchio',ARRAY['피노키오','Pinocchio']::text[],2014,'Seoul Broadcasting System',ARRAY['로맨스','드라마']::text[],'published'),
('넌 내게 반했어','Heartstrings',ARRAY['넌 내게 반했어','Heartstrings','넌내게반했어']::text[],2011,'Munhwa Broadcasting Corporation',ARRAY['Drama']::text[],'published'),
('선덕여왕','Queen Seondeok',ARRAY['선덕여왕','Queen Seondeok']::text[],2009,'MBC',ARRAY['Drama']::text[],'published'),
('눈물의 여왕','Queen of Tears',ARRAY['눈물의 여왕','Queen of Tears','눈물의여왕']::text[],2024,'tvN',ARRAY['로맨스','드라마']::text[],'published'),
('환혼','Alchemy of Souls',ARRAY['환혼','Alchemy of Souls']::text[],2022,'tvN',ARRAY['판타지','액션']::text[],'published'),
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
('닥터스','The Doctors',ARRAY['닥터스','The Doctors']::text[],2016,'SBS',ARRAY['Drama']::text[],'published'),
('힐러','Healer',ARRAY['힐러','Healer']::text[],2014,'KBS2',ARRAY['Drama']::text[],'published'),
('시티헌터','City Hunter',ARRAY['시티헌터','City Hunter']::text[],2011,'Seoul Broadcasting System',ARRAY['Drama']::text[],'published'),
('단, 하나의 사랑','Angel''s Last Mission: Love',ARRAY['단, 하나의 사랑','Angel''s Last Mission: Love','단,하나의사랑']::text[],2019,'KBS2',ARRAY['Drama']::text[],'published'),
('진심이 닿다','Touch Your Heart',ARRAY['진심이 닿다','Touch Your Heart','진심이닿다']::text[],2019,'tvN',ARRAY['Drama']::text[],'published'),
('내 아이디는 강남미인','My ID is Gangnam Beauty',ARRAY['내 아이디는 강남미인','My ID is Gangnam Beauty','내아이디는강남미인']::text[],2018,'JTBC',ARRAY['Drama']::text[],'published')
) AS v(title_kr, title_en, aliases, year, network, genres, status)
WHERE NOT EXISTS (
  SELECT 1 FROM public.dramas d
  WHERE lower(d.title_en) = lower(v.title_en) OR d.title_kr = v.title_kr
);