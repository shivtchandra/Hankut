INSERT INTO public.dramas (title_kr, title_en, aliases, year, network, genres, status)
SELECT * FROM (VALUES
('미안하다, 사랑한다','I''m Sorry, I Love You',ARRAY['미안하다, 사랑한다','I''m Sorry, I Love You','미안하다,사랑한다']::text[],2004,'Korean Broadcasting System',ARRAY['Drama']::text[],'published'),
('이 사랑 통역 되나요?','Can This Love Be Translated?',ARRAY['이 사랑 통역 되나요?','Can This Love Be Translated?','이사랑통역되나요?']::text[],2026,'Netflix',ARRAY['Drama']::text[],'published'),
('경성크리처','Gyeongseong Creature',ARRAY['경성크리처','Gyeongseong Creature']::text[],2023,'Netflix',ARRAY['Drama']::text[],'published'),
('파친코','Pachinko',ARRAY['파친코','Pachinko']::text[],2022,'Apple',ARRAY['가족','시대극']::text[],'published'),
('배가본드','Vagabond',ARRAY['배가본드','Vagabond']::text[],2019,'SBS',ARRAY['Drama']::text[],'published'),
('동백꽃 필 무렵','When the Camellia Blooms',ARRAY['동백꽃 필 무렵','When the Camellia Blooms','동백꽃필무렵']::text[],2019,'KBS2',ARRAY['로맨스','코미디']::text[],'published'),
('사임당, the Herstory','Saimdang, Memoir of Colors',ARRAY['사임당, the Herstory','Saimdang, Memoir of Colors','사임당,theHerstory']::text[],2017,'SBS',ARRAY['Drama']::text[],'published'),
('학교 2017','School 2017',ARRAY['학교 2017','School 2017','학교2017']::text[],2017,'KBS2',ARRAY['Drama']::text[],'published'),
('신데렐라와 네 명의 기사','Cinderella with Four Knights',ARRAY['신데렐라와 네 명의 기사','Cinderella with Four Knights','신데렐라와네명의기사']::text[],2016,'tvN',ARRAY['Drama']::text[],'published'),
('블러드','Blood',ARRAY['블러드','Blood']::text[],2015,'KBS2',ARRAY['Drama']::text[],'published'),
('닥터 이방인','Doctor Stranger',ARRAY['닥터 이방인','Doctor Stranger','닥터이방인']::text[],2014,'Seoul Broadcasting System',ARRAY['Drama']::text[],'published'),
('응급남녀','Emergency Man and Woman',ARRAY['응급남녀','Emergency Man and Woman']::text[],2014,'tvN',ARRAY['Drama']::text[],'published'),
('미생 - 아직 살아 있지 못한 자','Misaeng',ARRAY['미생 - 아직 살아 있지 못한 자','Misaeng','미생-아직살아있지못한자']::text[],2014,'tvN',ARRAY['Drama']::text[],'published'),
('잭과 팡','Zack & Quack',ARRAY['잭과 팡','Zack & Quack','잭과팡']::text[],2014,'Nick Jr. Channel',ARRAY['Drama']::text[],'published'),
('사랑비','Love Rain',ARRAY['사랑비','Love Rain']::text[],2012,'KBS2',ARRAY['Drama']::text[],'published')
) AS v(title_kr, title_en, aliases, year, network, genres, status)
WHERE NOT EXISTS (
  SELECT 1 FROM public.dramas d
  WHERE lower(d.title_en) = lower(v.title_en) OR d.title_kr = v.title_kr
);