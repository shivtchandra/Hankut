INSERT INTO public.dramas (title_kr, title_en, aliases, year, network, genres, status)
SELECT * FROM (VALUES
('동백꽃 필 무렵','When the Camellia Blooms',ARRAY['동백꽃 필 무렵','When the Camellia Blooms','동백꽃필무렵']::text[],2019,'KBS2',ARRAY['로맨스','코미디']::text[],'published'),
('사임당, the Herstory','Saimdang, Memoir of Colors',ARRAY['사임당, the Herstory','Saimdang, Memoir of Colors','사임당,theHerstory']::text[],2017,'SBS',ARRAY['Drama']::text[],'published'),
('학교 2017','School 2017',ARRAY['학교 2017','School 2017','학교2017']::text[],2017,'KBS2',ARRAY['Drama']::text[],'published'),
('신데렐라와 네 명의 기사','Cinderella with Four Knights',ARRAY['신데렐라와 네 명의 기사','Cinderella with Four Knights','신데렐라와네명의기사']::text[],2016,'tvN',ARRAY['Drama']::text[],'published'),
('블러드','Blood',ARRAY['블러드','Blood']::text[],2015,'KBS2',ARRAY['Drama']::text[],'published'),
('닥터 이방인','Doctor Stranger',ARRAY['닥터 이방인','Doctor Stranger','닥터이방인']::text[],2014,'Seoul Broadcasting System',ARRAY['Drama']::text[],'published'),
('응급남녀','Emergency Man and Woman',ARRAY['응급남녀','Emergency Man and Woman']::text[],2014,'tvN',ARRAY['Drama']::text[],'published'),
('미생 - 아직 살아 있지 못한 자','Misaeng',ARRAY['미생 - 아직 살아 있지 못한 자','Misaeng','미생-아직살아있지못한자']::text[],2014,'tvN',ARRAY['Drama']::text[],'published'),
('잭과 팡','Zack & Quack',ARRAY['잭과 팡','Zack & Quack','잭과팡']::text[],2014,'Nick Jr. Channel',ARRAY['Drama']::text[],'published'),
('사랑비','Love Rain',ARRAY['사랑비','Love Rain']::text[],2012,'KBS2',ARRAY['Drama']::text[],'published'),
('쇼 챔피언','Show Champion',ARRAY['쇼 챔피언','Show Champion','쇼챔피언']::text[],2012,'MBC Music',ARRAY['Drama']::text[],'published'),
('아름다운 그대에게','To the Beautiful You',ARRAY['아름다운 그대에게','To the Beautiful You','아름다운그대에게']::text[],2012,'Seoul Broadcasting System',ARRAY['Drama']::text[],'published'),
('49일','49 Days',ARRAY['49일','49 Days']::text[],2011,'Seoul Broadcasting System',ARRAY['Drama']::text[],'published'),
('마이 프린세스','My Princess',ARRAY['마이 프린세스','My Princess','마이프린세스']::text[],2011,'Munhwa Broadcasting Corporation',ARRAY['Drama']::text[],'published'),
('신데렐라 언니','Cinderella''s Sister',ARRAY['신데렐라 언니','Cinderella''s Sister','신데렐라언니']::text[],2010,'Korean Broadcasting System',ARRAY['Drama']::text[],'published'),
('파스타','Pasta',ARRAY['파스타','Pasta']::text[],2010,'Munhwa Broadcasting Corporation',ARRAY['Drama']::text[],'published'),
('일지매','Iljimae',ARRAY['일지매','Iljimae']::text[],2008,'Seoul Broadcasting System',ARRAY['Drama']::text[],'published'),
('바람의 화원','Painter of the Wind',ARRAY['바람의 화원','Painter of the Wind','바람의화원']::text[],2008,'SBS',ARRAY['Drama']::text[],'published'),
('이산','Lee San, Wind of the Palace',ARRAY['이산','Lee San, Wind of the Palace']::text[],2007,'Munhwa Broadcasting Corporation',ARRAY['Drama']::text[],'published'),
('태왕사신기','The Legend',ARRAY['태왕사신기','The Legend']::text[],2007,'MBC',ARRAY['Drama']::text[],'published'),
('기리고','If Wishes Could Kill',ARRAY['기리고','If Wishes Could Kill']::text[],2026,'Netflix',ARRAY['Drama']::text[],'published'),
('중증외상센터','The Trauma Code: Heroes on Call',ARRAY['중증외상센터','The Trauma Code: Heroes on Call']::text[],2025,'Netflix',ARRAY['Drama']::text[],'published'),
('닥터 슬럼프','Doctor Slump',ARRAY['닥터 슬럼프','Doctor Slump','닥터슬럼프']::text[],2024,'JTBC',ARRAY['Drama']::text[],'published'),
('선재 업고 튀어','Lovely Runner',ARRAY['선재 업고 튀어','Lovely Runner','선재업고튀어']::text[],2024,'tvN',ARRAY['Drama']::text[],'published'),
('사냥개들','Bloodhounds',ARRAY['사냥개들','Bloodhounds']::text[],2023,'Netflix',ARRAY['Drama']::text[],'published')
) AS v(title_kr, title_en, aliases, year, network, genres, status)
WHERE NOT EXISTS (
  SELECT 1 FROM public.dramas d
  WHERE lower(d.title_en) = lower(v.title_en) OR d.title_kr = v.title_kr
);