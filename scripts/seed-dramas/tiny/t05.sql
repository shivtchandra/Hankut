INSERT INTO public.dramas (title_kr, title_en, aliases, year, network, genres, status)
SELECT * FROM (VALUES
('허준','Hur Jun',ARRAY['허준','Hur Jun']::text[],1999,'MBC',ARRAY['Drama']::text[],'published'),
('참교육','Teach You a Lesson',ARRAY['참교육','Teach You a Lesson']::text[],2026,'Netflix',ARRAY['Drama']::text[],'published'),
('빅마우스','Big Mouth',ARRAY['빅마우스','Big Mouth']::text[],2022,'MBC',ARRAY['Drama']::text[],'published'),
('청춘기록','Record of Youth',ARRAY['청춘기록','Record of Youth']::text[],2020,'tvN',ARRAY['Drama']::text[],'published'),
('구미호뎐','Tale of the Nine Tailed',ARRAY['구미호뎐','Tale of the Nine Tailed']::text[],2020,'tvN',ARRAY['Drama']::text[],'published'),
('경이로운 소문','The Uncanny Counter',ARRAY['경이로운 소문','The Uncanny Counter','경이로운소문']::text[],2020,'tvN',ARRAY['Drama']::text[],'published'),
('백일의 낭군님','100 Days My Prince',ARRAY['백일의 낭군님','100 Days My Prince','백일의낭군님']::text[],2018,'TVN (Southeast Asia)',ARRAY['Drama']::text[],'published'),
('밥 잘 사주는 예쁜 누나','Something in the Rain',ARRAY['밥 잘 사주는 예쁜 누나','Something in the Rain','밥잘사주는예쁜누나']::text[],2018,'JTBC',ARRAY['로맨스']::text[],'published'),
('시카고 타자기','Chicago Typewriter',ARRAY['시카고 타자기','Chicago Typewriter','시카고타자기']::text[],2017,'tvN',ARRAY['Drama']::text[],'published'),
('레인보우 루비','Rainbow Ruby',ARRAY['레인보우 루비','Rainbow Ruby','레인보우루비']::text[],2016,'EBS 1TV',ARRAY['Drama']::text[],'published'),
('쇼핑왕 루이','Shopaholic Louis',ARRAY['쇼핑왕 루이','Shopaholic Louis','쇼핑왕루이']::text[],2016,'MBC',ARRAY['Drama']::text[],'published'),
('감각남녀','A Girl Who Sees Smells',ARRAY['감각남녀','A Girl Who Sees Smells']::text[],2015,'Seoul Broadcasting System',ARRAY['Drama']::text[],'published'),
('육룡이 나르샤','Six Flying Dragons',ARRAY['육룡이 나르샤','Six Flying Dragons','육룡이나르샤']::text[],2015,'SBS',ARRAY['Drama']::text[],'published'),
('아랑사또전','Arang and the Magistrate',ARRAY['아랑사또전','Arang and the Magistrate']::text[],2012,'Munhwa Broadcasting Corporation',ARRAY['Drama']::text[],'published'),
('보고싶다','Missing You',ARRAY['보고싶다','Missing You']::text[],2012,'Munhwa Broadcasting Corporation',ARRAY['Drama']::text[],'published')
) AS v(title_kr, title_en, aliases, year, network, genres, status)
WHERE NOT EXISTS (
  SELECT 1 FROM public.dramas d
  WHERE lower(d.title_en) = lower(v.title_en) OR d.title_kr = v.title_kr
);