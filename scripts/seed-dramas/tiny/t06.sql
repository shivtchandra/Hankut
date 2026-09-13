INSERT INTO public.dramas (title_kr, title_en, aliases, year, network, genres, status)
SELECT * FROM (VALUES
('세상 어디에도 없는 착한남자','The Innocent Man',ARRAY['세상 어디에도 없는 착한남자','The Innocent Man','세상어디에도없는착한남자']::text[],2012,'Korean Broadcasting System',ARRAY['Drama']::text[],'published'),
('제빵왕 김탁구','Bread, Love and Dreams',ARRAY['제빵왕 김탁구','Bread, Love and Dreams','제빵왕김탁구']::text[],2010,'KBS2',ARRAY['Drama']::text[],'published'),
('엄마친구아들','Love Next Door',ARRAY['엄마친구아들','Love Next Door']::text[],2024,'tvN',ARRAY['Drama']::text[],'published'),
('기생수: 더 그레이','Parasyte: The Grey',ARRAY['기생수: 더 그레이','Parasyte: The Grey','기생수:더그레이']::text[],2024,'Netflix',ARRAY['Drama']::text[],'published'),
('이재, 곧 죽습니다','Death''s Game',ARRAY['이재, 곧 죽습니다','Death''s Game','이재,곧죽습니다']::text[],2023,'TVING',ARRAY['Drama']::text[],'published'),
('킹더랜드','King the Land',ARRAY['킹더랜드','King the Land']::text[],2023,'JTBC',ARRAY['Drama']::text[],'published'),
('마이데몬','My Demon',ARRAY['마이데몬','My Demon']::text[],2023,'SBS',ARRAY['Drama']::text[],'published'),
('기상청 사람들: 사내연애 잔혹사 편','Forecasting Love and Weather',ARRAY['기상청 사람들: 사내연애 잔혹사 편','Forecasting Love and Weather','기상청사람들:사내연애잔혹사편']::text[],2022,'JTBC',ARRAY['Drama']::text[],'published'),
('작은 아씨들','Little Women',ARRAY['작은 아씨들','Little Women','작은아씨들']::text[],2022,'tvN',ARRAY['Drama']::text[],'published'),
('슈룹','Under the Queen''s Umbrella',ARRAY['슈룹','Under the Queen''s Umbrella']::text[],2022,'tvN',ARRAY['사극','코미디']::text[],'published'),
('고스트포스','GhostForce',ARRAY['고스트포스','GhostForce']::text[],2021,'Disney Channel',ARRAY['Drama']::text[],'published'),
('해피니스','Happiness',ARRAY['해피니스','Happiness']::text[],2021,'tvN',ARRAY['스릴러']::text[],'published'),
('그 해 우리는','Our Beloved Summer',ARRAY['그 해 우리는','Our Beloved Summer','그해우리는']::text[],2021,'Netflix',ARRAY['로맨스']::text[],'published'),
('연모','The King''s Affection',ARRAY['연모','The King''s Affection']::text[],2021,'KBS2',ARRAY['Drama']::text[],'published'),
('고요의 바다','The Silent Sea',ARRAY['고요의 바다','The Silent Sea','고요의바다']::text[],2021,'Netflix',ARRAY['Drama']::text[],'published')
) AS v(title_kr, title_en, aliases, year, network, genres, status)
WHERE NOT EXISTS (
  SELECT 1 FROM public.dramas d
  WHERE lower(d.title_en) = lower(v.title_en) OR d.title_kr = v.title_kr
);