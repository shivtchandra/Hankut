INSERT INTO public.dramas (title_kr, title_en, aliases, year, network, genres, status)
SELECT * FROM (VALUES
('고스트포스','GhostForce',ARRAY['고스트포스','GhostForce']::text[],2021,'Disney Channel',ARRAY['Drama']::text[],'published'),
('해피니스','Happiness',ARRAY['해피니스','Happiness']::text[],2021,'tvN',ARRAY['스릴러']::text[],'published'),
('그 해 우리는','Our Beloved Summer',ARRAY['그 해 우리는','Our Beloved Summer','그해우리는']::text[],2021,'Netflix',ARRAY['로맨스']::text[],'published'),
('연모','The King''s Affection',ARRAY['연모','The King''s Affection']::text[],2021,'KBS2',ARRAY['Drama']::text[],'published'),
('고요의 바다','The Silent Sea',ARRAY['고요의 바다','The Silent Sea','고요의바다']::text[],2021,'Netflix',ARRAY['Drama']::text[],'published'),
('그녀의 사생활','Her Private Life',ARRAY['그녀의 사생활','Her Private Life','그녀의사생활']::text[],2019,'tvN',ARRAY['Drama']::text[],'published'),
('날 녹여주오','Melting Me Softly',ARRAY['날 녹여주오','Melting Me Softly','날녹여주오']::text[],2019,'tvN',ARRAY['Drama']::text[],'published'),
('초면에 사랑합니다','The Secret Life of My Secretary',ARRAY['초면에 사랑합니다','The Secret Life of My Secretary','초면에사랑합니다']::text[],2019,'SBS',ARRAY['Drama']::text[],'published'),
('이번 생은 처음이라','Because This is My First Life',ARRAY['이번 생은 처음이라','Because This is My First Life','이번생은처음이라']::text[],2017,'tvN',ARRAY['로맨스','코미디']::text[],'published'),
('쌈 마이웨이','Fight for My Way',ARRAY['쌈 마이웨이','Fight for My Way','쌈마이웨이']::text[],2017,'KBS2',ARRAY['Drama']::text[],'published'),
('싸우자 귀신아','Hey Ghost, Let''s Fight',ARRAY['싸우자 귀신아','Hey Ghost, Let''s Fight','싸우자귀신아']::text[],2016,'tvN',ARRAY['Drama']::text[],'published'),
('오 마이 비너스','Oh My Venus',ARRAY['오 마이 비너스','Oh My Venus','오마이비너스']::text[],2015,'KBS2',ARRAY['Drama']::text[],'published'),
('오렌지 마멀레이드','Orange Marmalade',ARRAY['오렌지 마멀레이드','Orange Marmalade','오렌지마멀레이드']::text[],2015,'KBS2',ARRAY['Drama']::text[],'published'),
('이웃집 꽃미남','Flower Boys Next Door',ARRAY['이웃집 꽃미남','Flower Boys Next Door','이웃집꽃미남']::text[],2013,'tvN',ARRAY['Drama']::text[],'published'),
('구가의 서','Gu Family Book',ARRAY['구가의 서','Gu Family Book','구가의서']::text[],2013,'Munhwa Broadcasting Corporation',ARRAY['Drama']::text[],'published'),
('신의','Faith',ARRAY['신의','Faith']::text[],2012,'Seoul Broadcasting System',ARRAY['Drama']::text[],'published'),
('응답하라 1997','Reply 1997',ARRAY['응답하라 1997','Reply 1997','응답하라1997']::text[],2012,'tvN',ARRAY['로맨스','가족']::text[],'published'),
('학교 2013','School 2013',ARRAY['학교 2013','School 2013','학교2013']::text[],2012,'Korean Broadcasting System',ARRAY['Drama']::text[],'published'),
('보스를 지켜라','Protect the Boss',ARRAY['보스를 지켜라','Protect the Boss','보스를지켜라']::text[],2011,'Seoul Broadcasting System',ARRAY['Drama']::text[],'published'),
('꼬마버스 타요','Tayo the Little Bus',ARRAY['꼬마버스 타요','Tayo the Little Bus','꼬마버스타요']::text[],2010,'Korea Educational Broadcasting System',ARRAY['Drama']::text[],'published'),
('미안하다, 사랑한다','I''m Sorry, I Love You',ARRAY['미안하다, 사랑한다','I''m Sorry, I Love You','미안하다,사랑한다']::text[],2004,'Korean Broadcasting System',ARRAY['Drama']::text[],'published'),
('이 사랑 통역 되나요?','Can This Love Be Translated?',ARRAY['이 사랑 통역 되나요?','Can This Love Be Translated?','이사랑통역되나요?']::text[],2026,'Netflix',ARRAY['Drama']::text[],'published'),
('경성크리처','Gyeongseong Creature',ARRAY['경성크리처','Gyeongseong Creature']::text[],2023,'Netflix',ARRAY['Drama']::text[],'published'),
('파친코','Pachinko',ARRAY['파친코','Pachinko']::text[],2022,'Apple',ARRAY['가족','시대극']::text[],'published'),
('배가본드','Vagabond',ARRAY['배가본드','Vagabond']::text[],2019,'SBS',ARRAY['Drama']::text[],'published')
) AS v(title_kr, title_en, aliases, year, network, genres, status)
WHERE NOT EXISTS (
  SELECT 1 FROM public.dramas d
  WHERE lower(d.title_en) = lower(v.title_en) OR d.title_kr = v.title_kr
);