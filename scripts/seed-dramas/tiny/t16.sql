INSERT INTO public.dramas (title_kr, title_en, aliases, year, network, genres, status)
SELECT * FROM (VALUES
('대물','Big Thing',ARRAY['대물','Big Thing']::text[],2010,'Seoul Broadcasting System',ARRAY['Drama']::text[],'published'),
('매리는 외박중','Mary Stayed Out All Night',ARRAY['매리는 외박중','Mary Stayed Out All Night','매리는외박중']::text[],2010,'KBS2',ARRAY['Drama']::text[],'published'),
('황진이','Hwang Jini',ARRAY['황진이','Hwang Jini']::text[],2006,'Korean Broadcasting System',ARRAY['Drama']::text[],'published'),
('봄의 왈츠','Spring Waltz',ARRAY['봄의 왈츠','Spring Waltz','봄의왈츠']::text[],2006,'Korean Broadcasting System',ARRAY['Drama']::text[],'published'),
('킬러들의 쇼핑몰','A Shop for Killers',ARRAY['킬러들의 쇼핑몰','A Shop for Killers','킬러들의쇼핑몰']::text[],2024,'Star',ARRAY['Drama']::text[],'published'),
('낮과 밤이 다른 그녀','Miss Night and Day',ARRAY['낮과 밤이 다른 그녀','Miss Night and Day','낮과밤이다른그녀']::text[],2024,'JTBC',ARRAY['Drama']::text[],'published'),
('피라미드 게임','Pyramid Game',ARRAY['피라미드 게임','Pyramid Game','피라미드게임']::text[],2024,'TVING',ARRAY['Drama']::text[],'published'),
('히어로는 아닙니다만','The Atypical Family',ARRAY['히어로는 아닙니다만','The Atypical Family','히어로는아닙니다만']::text[],2024,'JTBC',ARRAY['Drama']::text[],'published'),
('너의 시간 속으로','A Time Called You',ARRAY['너의 시간 속으로','A Time Called You','너의시간속으로']::text[],2023,'Netflix',ARRAY['Drama']::text[],'published'),
('택배기사','Black Knight',ARRAY['택배기사','Black Knight']::text[],2023,'Netflix',ARRAY['Drama']::text[],'published'),
('셀러브리티','Celebrity',ARRAY['셀러브리티','Celebrity']::text[],2023,'Netflix',ARRAY['Drama']::text[],'published'),
('이 연애는 불가항력','Destined With You',ARRAY['이 연애는 불가항력','Destined With You','이연애는불가항력']::text[],2023,'JTBC',ARRAY['Drama']::text[],'published'),
('연애대전','Love to Hate You',ARRAY['연애대전','Love to Hate You']::text[],2023,'Netflix',ARRAY['Drama']::text[],'published'),
('마스크걸','Mask Girl',ARRAY['마스크걸','Mask Girl']::text[],2023,'Netflix',ARRAY['Drama']::text[],'published'),
('천원짜리 변호사','One Dollar Lawyer',ARRAY['천원짜리 변호사','One Dollar Lawyer','천원짜리변호사']::text[],2022,'SBS',ARRAY['Drama']::text[],'published')
) AS v(title_kr, title_en, aliases, year, network, genres, status)
WHERE NOT EXISTS (
  SELECT 1 FROM public.dramas d
  WHERE lower(d.title_en) = lower(v.title_en) OR d.title_kr = v.title_kr
);