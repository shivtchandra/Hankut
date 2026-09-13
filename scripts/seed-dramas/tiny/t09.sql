INSERT INTO public.dramas (title_kr, title_en, aliases, year, network, genres, status)
SELECT * FROM (VALUES
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