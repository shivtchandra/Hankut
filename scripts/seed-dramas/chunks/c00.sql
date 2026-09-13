INSERT INTO public.dramas (title_kr, title_en, aliases, year, network, genres, status)
SELECT * FROM (VALUES
('오징어 게임','Squid Game',ARRAY['오징어 게임','Squid Game','오징어게임']::text[],2021,'Netflix',ARRAY['스릴러','액션']::text[],'published'),
('쓸쓸하고 찬란하神 도깨비','Goblin',ARRAY['쓸쓸하고 찬란하神 도깨비','Goblin','쓸쓸하고찬란하神도깨비']::text[],2016,'tvN',ARRAY['판타지']::text[],'published'),
('낭만닥터 김사부','Romantic Doctor, Teacher Kim',ARRAY['낭만닥터 김사부','Romantic Doctor, Teacher Kim','낭만닥터김사부']::text[],2016,'SBS',ARRAY['의료']::text[],'published'),
('킬미힐미','Kill Me, Heal Me',ARRAY['킬미힐미','Kill Me, Heal Me']::text[],2015,'MBC',ARRAY['로맨스','코미디']::text[],'published'),
('해를 품은 달','The Moon Embracing the Sun',ARRAY['해를 품은 달','The Moon Embracing the Sun','해를품은달']::text[],2012,'MBC',ARRAY['사극','로맨스']::text[],'published'),
('내 이름은 김삼순','My Name Is Kim Sam-soon',ARRAY['내 이름은 김삼순','My Name Is Kim Sam-soon','내이름은김삼순']::text[],2005,'MBC',ARRAY['로맨스','코미디']::text[],'published'),
('대장금','Jewel in the Palace',ARRAY['대장금','Jewel in the Palace']::text[],2003,'MBC',ARRAY['사극']::text[],'published'),
('사랑의 불시착','Crash Landing on You',ARRAY['사랑의 불시착','Crash Landing on You','사랑의불시착']::text[],2019,'tvN',ARRAY['로맨스','코미디']::text[],'published'),
('펜트하우스','The Penthouse: War in Life',ARRAY['펜트하우스','The Penthouse: War in Life']::text[],2020,'SBS',ARRAY['스릴러','드라마']::text[],'published'),
('여신강림','True Beauty',ARRAY['여신강림','True Beauty']::text[],2020,'tvN',ARRAY['Drama']::text[],'published'),
('쓸쓸하고 찬란하神 - 도깨비','Guardian: The Lonely and Great God',ARRAY['쓸쓸하고 찬란하神 - 도깨비','Guardian: The Lonely and Great God','쓸쓸하고찬란하神-도깨비']::text[],2016,'tvN',ARRAY['판타지','로맨스']::text[],'published'),
('태양의 후예','Descendants of the Sun',ARRAY['태양의 후예','Descendants of the Sun','태양의후예']::text[],2016,'KBS2',ARRAY['로맨스','액션']::text[],'published'),
('사이코지만 괜찮아','It''s Okay to Not Be Okay',ARRAY['사이코지만 괜찮아','It''s Okay to Not Be Okay','사이코지만괜찮아']::text[],2020,'tvN',ARRAY['로맨스','드라마']::text[],'published'),
('꽃보다 남자','Boys Over Flowers',ARRAY['꽃보다 남자','Boys Over Flowers','꽃보다남자']::text[],2009,'KBS2',ARRAY['로맨스','청춘']::text[],'published'),
('빈센조','Vincenzo',ARRAY['빈센조','Vincenzo']::text[],2021,'tvN',ARRAY['범죄','코미디']::text[],'published'),
('설강화 : snowdrop','Snowdrop',ARRAY['설강화 : snowdrop','Snowdrop','설강화:snowdrop']::text[],2021,'JTBC',ARRAY['Drama']::text[],'published'),
('철인왕후','Mr. Queen',ARRAY['철인왕후','Mr. Queen']::text[],2020,'tvN',ARRAY['Drama']::text[],'published'),
('호텔 델루나','Hotel del Luna',ARRAY['호텔 델루나','Hotel del Luna','호텔델루나']::text[],2019,'tvN',ARRAY['판타지','로맨스']::text[],'published'),
('지금 우리 학교는','All of Us Are Dead',ARRAY['지금 우리 학교는','All of Us Are Dead','지금우리학교는']::text[],2022,'Netflix',ARRAY['스릴러','좀비']::text[],'published'),
('부부의 세계','The World of the Married',ARRAY['부부의 세계','The World of the Married','부부의세계']::text[],2020,'JTBC',ARRAY['드라마','스릴러']::text[],'published'),
('상속자들','The Heirs',ARRAY['상속자들','The Heirs']::text[],2013,'Seoul Broadcasting System',ARRAY['로맨스','청춘']::text[],'published'),
('스타트업','Start-Up',ARRAY['스타트업','Start-Up']::text[],2020,'tvN',ARRAY['로맨스','청춘']::text[],'published'),
('별에서 온 그대','My Love from the Star',ARRAY['별에서 온 그대','My Love from the Star','별에서온그대']::text[],2013,'SBS',ARRAY['Drama']::text[],'published'),
('달의 연인 - 보보경심 려','Moon Lovers: Scarlet Heart Ryeo',ARRAY['달의 연인 - 보보경심 려','Moon Lovers: Scarlet Heart Ryeo','달의연인-보보경심려']::text[],2016,'Seoul Broadcasting System',ARRAY['Drama']::text[],'published'),
('푸른 바다의 전설','The Legend of the Blue Sea',ARRAY['푸른 바다의 전설','The Legend of the Blue Sea','푸른바다의전설']::text[],2016,'SBS',ARRAY['Drama']::text[],'published')
) AS v(title_kr, title_en, aliases, year, network, genres, status)
WHERE NOT EXISTS (
  SELECT 1 FROM public.dramas d
  WHERE lower(d.title_en) = lower(v.title_en) OR d.title_kr = v.title_kr
);