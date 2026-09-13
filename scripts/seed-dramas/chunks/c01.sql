INSERT INTO public.dramas (title_kr, title_en, aliases, year, network, genres, status)
SELECT * FROM (VALUES
('김비서가 왜 그럴까','What''s Wrong with Secretary Kim',ARRAY['김비서가 왜 그럴까','What''s Wrong with Secretary Kim','김비서가왜그럴까']::text[],2018,'TVN (Southeast Asia)',ARRAY['로맨스','코미디']::text[],'published'),
('더 킹 : 영원의 군주','The King: Eternal Monarch',ARRAY['더 킹 : 영원의 군주','The King: Eternal Monarch','더킹:영원의군주']::text[],2015,'SBS',ARRAY['Drama']::text[],'published'),
('로봇이 아니야','I''m Not a Robot',ARRAY['로봇이 아니야','I''m Not a Robot','로봇이아니야']::text[],2017,'Munhwa Broadcasting Corporation',ARRAY['Drama']::text[],'published'),
('더블유','W',ARRAY['더블유','W']::text[],2016,'MBC',ARRAY['Drama']::text[],'published'),
('오 나의 귀신님','Oh My Ghostess',ARRAY['오 나의 귀신님','Oh My Ghostess','오나의귀신님']::text[],2015,'tvN',ARRAY['Drama']::text[],'published'),
('프로듀사','Producer',ARRAY['프로듀사','Producer']::text[],2015,'KBS2',ARRAY['Drama']::text[],'published'),
('주몽','Jumong',ARRAY['주몽','Jumong']::text[],2006,'Munhwa Broadcasting Corporation',ARRAY['Drama']::text[],'published'),
('응답하라 1988','Reply 1988',ARRAY['응답하라 1988','Reply 1988','응답하라1988']::text[],2015,'tvN',ARRAY['로맨스','가족','코미디']::text[],'published'),
('드림하이','Dream High',ARRAY['드림하이','Dream High']::text[],2011,'KBS2',ARRAY['청춘','음악']::text[],'published'),
('겨울연가','Winter Sonata',ARRAY['겨울연가','Winter Sonata']::text[],2002,'KBS2',ARRAY['로맨스']::text[],'published'),
('어쩌다 발견한 하루','Extraordinary You',ARRAY['어쩌다 발견한 하루','Extraordinary You','어쩌다발견한하루']::text[],2019,'MBC',ARRAY['Drama']::text[],'published'),
('당신이 잠든 사이에','While You Were Sleeping',ARRAY['당신이 잠든 사이에','While You Were Sleeping','당신이잠든사이에']::text[],2017,'Seoul Broadcasting System',ARRAY['Drama']::text[],'published'),
('구르미 그린 달빛','Love in the Moonlight',ARRAY['구르미 그린 달빛','Love in the Moonlight','구르미그린달빛']::text[],2016,'Korean Broadcasting System',ARRAY['Drama']::text[],'published'),
('역도요정 김복주','Weightlifting Fairy Kim Bok-Joo',ARRAY['역도요정 김복주','Weightlifting Fairy Kim Bok-Joo','역도요정김복주']::text[],2016,'Munhwa Broadcasting Corporation',ARRAY['Drama']::text[],'published'),
('하이바이, 마마!','Hi Bye, Mama!',ARRAY['하이바이, 마마!','Hi Bye, Mama!','하이바이,마마!']::text[],2020,'tvN',ARRAY['Drama']::text[],'published'),
('이태원 클라쓰','Itaewon Class',ARRAY['이태원 클라쓰','Itaewon Class','이태원클라쓰']::text[],2020,'JTBC',ARRAY['드라마','청춘']::text[],'published'),
('시크릿 가든','Secret Garden',ARRAY['시크릿 가든','Secret Garden','시크릿가든']::text[],2010,'SBS',ARRAY['판타지','로맨스']::text[],'published'),
('커피프린스 1호점','The 1st Shop of Coffee Prince',ARRAY['커피프린스 1호점','The 1st Shop of Coffee Prince','커피프린스1호점']::text[],2007,'MBC',ARRAY['로맨스','코미디']::text[],'published'),
('종이의 집: 공동경제구역','Money Heist: Korea - Joint Economic Area',ARRAY['종이의 집: 공동경제구역','Money Heist: Korea - Joint Economic Area','종이의집:공동경제구역']::text[],2022,'Netflix',ARRAY['Drama']::text[],'published'),
('지옥','Hellbound',ARRAY['지옥','Hellbound']::text[],2021,'Netflix',ARRAY['Drama']::text[],'published'),
('미스터 션샤인','Mr. Sunshine',ARRAY['미스터 션샤인','Mr. Sunshine','미스터션샤인']::text[],2018,'tvN',ARRAY['사극','로맨스']::text[],'published'),
('화유기','A Korean Odyssey',ARRAY['화유기','A Korean Odyssey']::text[],2017,'tvN',ARRAY['Drama']::text[],'published'),
('힘쎈여자 도봉순','Strong Woman Do Bong-soon',ARRAY['힘쎈여자 도봉순','Strong Woman Do Bong-soon','힘쎈여자도봉순']::text[],2017,'JTBC',ARRAY['Drama']::text[],'published'),
('화랑','Hwarang: The Poet Warrior Youth',ARRAY['화랑','Hwarang: The Poet Warrior Youth']::text[],2016,'KBS2',ARRAY['Drama']::text[],'published'),
('스위트홈','Sweet Home',ARRAY['스위트홈','Sweet Home']::text[],2020,NULL,ARRAY['Drama']::text[],'published')
) AS v(title_kr, title_en, aliases, year, network, genres, status)
WHERE NOT EXISTS (
  SELECT 1 FROM public.dramas d
  WHERE lower(d.title_en) = lower(v.title_en) OR d.title_kr = v.title_kr
);