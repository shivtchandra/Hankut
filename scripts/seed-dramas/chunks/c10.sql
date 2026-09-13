INSERT INTO public.dramas (title_kr, title_en, aliases, year, network, genres, status)
SELECT * FROM (VALUES
('보이스','Voice',ARRAY['보이스','Voice']::text[],2017,'OCN',ARRAY['스릴러']::text[],'published'),
('또 오해영','Another Miss Oh',ARRAY['또 오해영','Another Miss Oh','또오해영']::text[],2016,'tvN',ARRAY['로맨스','코미디']::text[],'published'),
('무림학교','Moorim School',ARRAY['무림학교','Moorim School']::text[],2016,'KBS2',ARRAY['Drama']::text[],'published'),
('우리 옆집에 EXO가 산다','EXO Next Door',ARRAY['우리 옆집에 EXO가 산다','EXO Next Door','우리옆집에EXO가산다']::text[],2015,'JTBC2',ARRAY['Drama']::text[],'published'),
('하이드 지킬, 나','Jekyll and Me',ARRAY['하이드 지킬, 나','Jekyll and Me','하이드지킬,나']::text[],2015,'SBS',ARRAY['Drama']::text[],'published'),
('가면','Mask',ARRAY['가면','Mask']::text[],2015,'Seoul Broadcasting System',ARRAY['Drama']::text[],'published'),
('리멤버 - 아들의 전쟁','Remember: War of the Son',ARRAY['리멤버 - 아들의 전쟁','Remember: War of the Son','리멤버-아들의전쟁']::text[],2015,'SBS',ARRAY['Drama']::text[],'published'),
('조선 총잡이','Gunman in Joseon',ARRAY['조선 총잡이','Gunman in Joseon','조선총잡이']::text[],2014,'KBS2',ARRAY['Drama']::text[],'published'),
('하이스쿨 러브온','Hi! School: Love On',ARRAY['하이스쿨 러브온','Hi! School: Love On','하이스쿨러브온']::text[],2014,'KBS2',ARRAY['Drama']::text[],'published'),
('괜찮아, 사랑이야','It''s Okay, That''s Love',ARRAY['괜찮아, 사랑이야','It''s Okay, That''s Love','괜찮아,사랑이야']::text[],2014,'SBS',ARRAY['Drama']::text[],'published'),
('가족끼리 왜 이래','What Happens to My Family?',ARRAY['가족끼리 왜 이래','What Happens to My Family?','가족끼리왜이래']::text[],2014,'KBS2',ARRAY['Drama']::text[],'published'),
('더킹2Hearts','The King 2 Hearts',ARRAY['더킹2Hearts','The King 2 Hearts']::text[],2012,'Munhwa Broadcasting Corporation',ARRAY['Drama']::text[],'published'),
('마의','The King''s Doctor',ARRAY['마의','The King''s Doctor']::text[],2012,'Munhwa Broadcasting Corporation',ARRAY['Drama']::text[],'published'),
('내게 거짓말을 해봐','Lie to Me',ARRAY['내게 거짓말을 해봐','Lie to Me','내게거짓말을해봐']::text[],2011,'Seoul Broadcasting System',ARRAY['Drama']::text[],'published'),
('공주의 남자','The Princess'' Man',ARRAY['공주의 남자','The Princess'' Man','공주의남자']::text[],2011,'KBS2',ARRAY['Drama']::text[],'published'),
('대물','Big Thing',ARRAY['대물','Big Thing']::text[],2010,'Seoul Broadcasting System',ARRAY['Drama']::text[],'published'),
('매리는 외박중','Mary Stayed Out All Night',ARRAY['매리는 외박중','Mary Stayed Out All Night','매리는외박중']::text[],2010,'KBS2',ARRAY['Drama']::text[],'published'),
('황진이','Hwang Jini',ARRAY['황진이','Hwang Jini']::text[],2006,'Korean Broadcasting System',ARRAY['Drama']::text[],'published'),
('봄의 왈츠','Spring Waltz',ARRAY['봄의 왈츠','Spring Waltz','봄의왈츠']::text[],2006,'Korean Broadcasting System',ARRAY['Drama']::text[],'published'),
('킬러들의 쇼핑몰','A Shop for Killers',ARRAY['킬러들의 쇼핑몰','A Shop for Killers','킬러들의쇼핑몰']::text[],2024,'Star',ARRAY['Drama']::text[],'published'),
('낮과 밤이 다른 그녀','Miss Night and Day',ARRAY['낮과 밤이 다른 그녀','Miss Night and Day','낮과밤이다른그녀']::text[],2024,'JTBC',ARRAY['Drama']::text[],'published'),
('피라미드 게임','Pyramid Game',ARRAY['피라미드 게임','Pyramid Game','피라미드게임']::text[],2024,'TVING',ARRAY['Drama']::text[],'published'),
('히어로는 아닙니다만','The Atypical Family',ARRAY['히어로는 아닙니다만','The Atypical Family','히어로는아닙니다만']::text[],2024,'JTBC',ARRAY['Drama']::text[],'published'),
('너의 시간 속으로','A Time Called You',ARRAY['너의 시간 속으로','A Time Called You','너의시간속으로']::text[],2023,'Netflix',ARRAY['Drama']::text[],'published'),
('택배기사','Black Knight',ARRAY['택배기사','Black Knight']::text[],2023,'Netflix',ARRAY['Drama']::text[],'published')
) AS v(title_kr, title_en, aliases, year, network, genres, status)
WHERE NOT EXISTS (
  SELECT 1 FROM public.dramas d
  WHERE lower(d.title_en) = lower(v.title_en) OR d.title_kr = v.title_kr
);