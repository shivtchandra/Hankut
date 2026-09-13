INSERT INTO public.dramas (title_kr, title_en, aliases, year, network, genres, status)
SELECT * FROM (VALUES
('힐러','Healer',ARRAY['힐러','Healer']::text[],2014,'KBS2',ARRAY['Drama']::text[],'published'),
('시티헌터','City Hunter',ARRAY['시티헌터','City Hunter']::text[],2011,'Seoul Broadcasting System',ARRAY['Drama']::text[],'published'),
('단, 하나의 사랑','Angel''s Last Mission: Love',ARRAY['단, 하나의 사랑','Angel''s Last Mission: Love','단,하나의사랑']::text[],2019,'KBS2',ARRAY['Drama']::text[],'published'),
('진심이 닿다','Touch Your Heart',ARRAY['진심이 닿다','Touch Your Heart','진심이닿다']::text[],2019,'tvN',ARRAY['Drama']::text[],'published'),
('내 아이디는 강남미인','My ID is Gangnam Beauty',ARRAY['내 아이디는 강남미인','My ID is Gangnam Beauty','내아이디는강남미인']::text[],2018,'JTBC',ARRAY['Drama']::text[],'published'),
('후아유 : 학교 2015','Who Are You: School 2015',ARRAY['후아유 : 학교 2015','Who Are You: School 2015','후아유:학교2015']::text[],2015,'Korean Broadcasting System',ARRAY['Drama']::text[],'published'),
('굿 닥터','Good Doctor',ARRAY['굿 닥터','Good Doctor','굿닥터']::text[],2013,'KBS2',ARRAY['Drama']::text[],'published'),
('내 여자친구는 구미호','My Girlfriend Is a Nine-Tailed Fox',ARRAY['내 여자친구는 구미호','My Girlfriend Is a Nine-Tailed Fox','내여자친구는구미호']::text[],2010,'SBS',ARRAY['Drama']::text[],'published'),
('개인의 취향','Personal Taste',ARRAY['개인의 취향','Personal Taste','개인의취향']::text[],2010,'Munhwa Broadcasting Corporation',ARRAY['Drama']::text[],'published'),
('궁','Princess Hours',ARRAY['궁','Princess Hours']::text[],2006,'Munhwa Broadcasting Corporation',ARRAY['Drama']::text[],'published'),
('내 남편과 결혼해줘','Marry My Husband',ARRAY['내 남편과 결혼해줘','Marry My Husband','내남편과결혼해줘']::text[],2024,'tvN',ARRAY['Drama']::text[],'published'),
('너도 인간이니','Are You Human?',ARRAY['너도 인간이니','Are You Human?','너도인간이니']::text[],2018,'KBS2',ARRAY['Drama']::text[],'published'),
('함부로 애틋하게','Uncontrollably Fond',ARRAY['함부로 애틋하게','Uncontrollably Fond','함부로애틋하게']::text[],2016,'KBS2',ARRAY['Drama']::text[],'published'),
('아이리스','Iris',ARRAY['아이리스','Iris']::text[],2009,'KBS2',ARRAY['Drama']::text[],'published'),
('마이걸','My Girl',ARRAY['마이걸','My Girl']::text[],2005,'Seoul Broadcasting System',ARRAY['Drama']::text[],'published')
) AS v(title_kr, title_en, aliases, year, network, genres, status)
WHERE NOT EXISTS (
  SELECT 1 FROM public.dramas d
  WHERE lower(d.title_en) = lower(v.title_en) OR d.title_kr = v.title_kr
);