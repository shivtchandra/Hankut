INSERT INTO public.dramas (title_kr, title_en, aliases, year, network, genres, status)
SELECT * FROM (VALUES
('지금 헤어지는 중입니다.','Now, We Are Breaking Up',ARRAY['지금 헤어지는 중입니다.','Now, We Are Breaking Up','지금헤어지는중입니다.']::text[],2021,'SBS',ARRAY['Drama']::text[],'published'),
('학교 2021','School 2021',ARRAY['학교 2021','School 2021','학교2021']::text[],2021,'KBS2',ARRAY['Drama']::text[],'published'),
('시지프스 : the myth','Sisyphus: The Myth',ARRAY['시지프스 : the myth','Sisyphus: The Myth','시지프스:themyth']::text[],2021,'JTBC',ARRAY['Drama']::text[],'published'),
('꽃 피면 달 생각하고','When Flowers Bloom, I Think of the Moon',ARRAY['꽃 피면 달 생각하고','When Flowers Bloom, I Think of the Moon','꽃피면달생각하고']::text[],2021,'KBS2',ARRAY['Drama']::text[],'published'),
('유미의 세포들','Yumi''s Cells',ARRAY['유미의 세포들','Yumi''s Cells','유미의세포들']::text[],2021,'tvN',ARRAY['Drama']::text[],'published'),
('18 어게인','18 Again',ARRAY['18 어게인','18 Again','18어게인']::text[],2020,'JTBC',ARRAY['Drama']::text[],'published'),
('암행어사: 조선비밀수사단','Royal Secret Agent',ARRAY['암행어사: 조선비밀수사단','Royal Secret Agent','암행어사:조선비밀수사단']::text[],2020,'KBS2',ARRAY['Drama']::text[],'published'),
('좀비탐정','Zombie Detective',ARRAY['좀비탐정','Zombie Detective']::text[],2020,'KBS2',ARRAY['Drama']::text[],'published'),
('의사요한','Doctor John',ARRAY['의사요한','Doctor John']::text[],2019,'SBS',ARRAY['Drama']::text[],'published'),
('멈추고 싶은 순간 : 어바웃 타임','About Time',ARRAY['멈추고 싶은 순간 : 어바웃 타임','About Time','멈추고싶은순간:어바웃타임']::text[],2018,'tvN',ARRAY['Drama']::text[],'published'),
('하나뿐인 내편','My Only One',ARRAY['하나뿐인 내편','My Only One','하나뿐인내편']::text[],2018,'KBS2',ARRAY['Drama']::text[],'published'),
('뷰티 인사이드','The Beauty Inside',ARRAY['뷰티 인사이드','The Beauty Inside','뷰티인사이드']::text[],2018,'JTBC',ARRAY['Drama']::text[],'published'),
('병원선','Hospital Ship',ARRAY['병원선','Hospital Ship']::text[],2017,'Munhwa Broadcasting Corporation',ARRAY['Drama']::text[],'published'),
('맨투맨','Man to Man',ARRAY['맨투맨','Man to Man']::text[],2017,'JTBC',ARRAY['Drama']::text[],'published'),
('아버지가 이상해','My Father is Strange',ARRAY['아버지가 이상해','My Father is Strange','아버지가이상해']::text[],2017,'KBS2',ARRAY['Drama']::text[],'published')
) AS v(title_kr, title_en, aliases, year, network, genres, status)
WHERE NOT EXISTS (
  SELECT 1 FROM public.dramas d
  WHERE lower(d.title_en) = lower(v.title_en) OR d.title_kr = v.title_kr
);