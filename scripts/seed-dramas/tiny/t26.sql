INSERT INTO public.dramas (title_kr, title_en, aliases, year, network, genres, status)
SELECT * FROM (VALUES
('미녀와 순정남','Beauty and Mr. Romantic',ARRAY['미녀와 순정남','Beauty and Mr. Romantic','미녀와순정남']::text[],2024,'KBS2',ARRAY['Drama']::text[],'published'),
('세작, 매혹된 자들','Captivating the King',ARRAY['세작, 매혹된 자들','Captivating the King','세작,매혹된자들']::text[],2024,'tvN',ARRAY['Drama']::text[],'published'),
('로얄로더','The Impossible Heir',ARRAY['로얄로더','The Impossible Heir']::text[],2024,'Disney+',ARRAY['Drama']::text[],'published'),
('졸업','The Midnight Romance in Hagwon',ARRAY['졸업','The Midnight Romance in Hagwon']::text[],2024,'tvN',ARRAY['Drama']::text[],'published'),
('운수 오진 날','A Bloody Lucky Day',ARRAY['운수 오진 날','A Bloody Lucky Day','운수오진날']::text[],2023,'TVN (Southeast Asia)',ARRAY['Drama']::text[],'published'),
('오늘도 사랑스럽개','A Good Day to Be a Dog',ARRAY['오늘도 사랑스럽개','A Good Day to Be a Dog','오늘도사랑스럽개']::text[],2023,'MBC',ARRAY['Drama']::text[],'published'),
('닥터 차정숙','Doctor Cha Jung-sook',ARRAY['닥터 차정숙','Doctor Cha Jung-sook','닥터차정숙']::text[],2023,'JTBC',ARRAY['Drama']::text[],'published'),
('방과 후 전쟁활동','Duty After School',ARRAY['방과 후 전쟁활동','Duty After School','방과후전쟁활동']::text[],2023,'TVING',ARRAY['Drama']::text[],'published'),
('꼭두의 계절','Kokdu: Season of Deity',ARRAY['꼭두의 계절','Kokdu: Season of Deity','꼭두의계절']::text[],2023,'MBC',ARRAY['Drama']::text[],'published'),
('판도라: 조작된 낙원','Pandora: Beneath the Paradise',ARRAY['판도라: 조작된 낙원','Pandora: Beneath the Paradise','판도라:조작된낙원']::text[],2023,'tvN',ARRAY['Drama']::text[],'published'),
('7인의 탈출','The Escape of the Seven',ARRAY['7인의 탈출','The Escape of the Seven','7인의탈출']::text[],2023,'SBS',ARRAY['Drama']::text[],'published'),
('나쁜 엄마','The Good Bad Mother',ARRAY['나쁜 엄마','The Good Bad Mother','나쁜엄마']::text[],2023,'JTBC',ARRAY['Drama']::text[],'published'),
('진짜가 나타났다!','The Real Has Come!',ARRAY['진짜가 나타났다!','The Real Has Come!','진짜가나타났다!']::text[],2023,'KBS2',ARRAY['Drama']::text[],'published'),
('꽃선비 열애사','The Secret Romantic Guesthouse',ARRAY['꽃선비 열애사','The Secret Romantic Guesthouse','꽃선비열애사']::text[],2023,'SBS',ARRAY['Drama']::text[],'published'),
('크레이지 러브','Crazy Love',ARRAY['크레이지 러브','Crazy Love','크레이지러브']::text[],2022,'KBS2',ARRAY['Drama']::text[],'published')
) AS v(title_kr, title_en, aliases, year, network, genres, status)
WHERE NOT EXISTS (
  SELECT 1 FROM public.dramas d
  WHERE lower(d.title_en) = lower(v.title_en) OR d.title_kr = v.title_kr
);