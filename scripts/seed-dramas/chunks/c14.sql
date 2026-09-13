INSERT INTO public.dramas (title_kr, title_en, aliases, year, network, genres, status)
SELECT * FROM (VALUES
('사운드트랙 #1','Soundtrack #1',ARRAY['사운드트랙 #1','Soundtrack #1','사운드트랙#1']::text[],2022,'Star',ARRAY['Drama']::text[],'published'),
('금수저','The Golden Spoon',ARRAY['금수저','The Golden Spoon']::text[],2022,'MBC',ARRAY['Drama']::text[],'published'),
('괴물','Beyond Evil',ARRAY['괴물','Beyond Evil']::text[],2021,'JTBC',ARRAY['스릴러','범죄']::text[],'published'),
('달리와 감자탕','Dali and Cocky Prince',ARRAY['달리와 감자탕','Dali and Cocky Prince','달리와감자탕']::text[],2021,'KBS2',ARRAY['Drama']::text[],'published'),
('홍천기','Lovers of the Red Sky',ARRAY['홍천기','Lovers of the Red Sky']::text[],2021,'SBS',ARRAY['Drama']::text[],'published'),
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
('아버지가 이상해','My Father is Strange',ARRAY['아버지가 이상해','My Father is Strange','아버지가이상해']::text[],2017,'KBS2',ARRAY['Drama']::text[],'published'),
('애타는 로맨스','My Secret Romance',ARRAY['애타는 로맨스','My Secret Romance','애타는로맨스']::text[],2017,'OCN',ARRAY['Drama']::text[],'published'),
('변혁의 사랑','Revolutionary Love',ARRAY['변혁의 사랑','Revolutionary Love','변혁의사랑']::text[],2017,'tvN',ARRAY['Drama']::text[],'published'),
('군주','Ruler: Master of the Mask',ARRAY['군주','Ruler: Master of the Mask']::text[],2017,'Munhwa Broadcasting Corporation',ARRAY['Drama']::text[],'published'),
('더 패키지','The Package',ARRAY['더 패키지','The Package','더패키지']::text[],2017,'JTBC',ARRAY['Drama']::text[],'published'),
('질투의 화신','Don''t Dare to Dream',ARRAY['질투의 화신','Don''t Dare to Dream','질투의화신']::text[],2016,'Seoul Broadcasting System',ARRAY['Drama']::text[],'published')
) AS v(title_kr, title_en, aliases, year, network, genres, status)
WHERE NOT EXISTS (
  SELECT 1 FROM public.dramas d
  WHERE lower(d.title_en) = lower(v.title_en) OR d.title_kr = v.title_kr
);