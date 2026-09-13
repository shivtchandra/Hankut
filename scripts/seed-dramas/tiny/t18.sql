INSERT INTO public.dramas (title_kr, title_en, aliases, year, network, genres, status)
SELECT * FROM (VALUES
('최고의 한방','Hit the Top',ARRAY['최고의 한방','Hit the Top','최고의한방']::text[],2017,'Korean Broadcasting System',ARRAY['Drama']::text[],'published'),
('그녀는 거짓말을 너무 사랑해','The Liar and His Lover',ARRAY['그녀는 거짓말을 너무 사랑해','The Liar and His Lover','그녀는거짓말을너무사랑해']::text[],2017,'tvN',ARRAY['Drama']::text[],'published'),
('돌아와요 아저씨','Come Back Mister',ARRAY['돌아와요 아저씨','Come Back Mister','돌아와요아저씨']::text[],2016,'Seoul Broadcasting System',ARRAY['Drama']::text[],'published'),
('사랑하는 은동아','Beloved Eun-dong',ARRAY['사랑하는 은동아','Beloved Eun-dong','사랑하는은동아']::text[],2015,'JTBC',ARRAY['Drama']::text[],'published'),
('순정에 반하다','Falling for Innocence',ARRAY['순정에 반하다','Falling for Innocence','순정에반하다']::text[],2015,'JTBC',ARRAY['Drama']::text[],'published'),
('상류사회','High Society',ARRAY['상류사회','High Society']::text[],2015,'SBS',ARRAY['Drama']::text[],'published'),
('하녀들','Maids',ARRAY['하녀들','Maids']::text[],2015,'JTBC',ARRAY['Drama']::text[],'published'),
('두번째 스무살','Second 20s',ARRAY['두번째 스무살','Second 20s','두번째스무살']::text[],2015,'tvN',ARRAY['Drama']::text[],'published'),
('트라이앵글','Triangle',ARRAY['트라이앵글','Triangle']::text[],2014,'Munhwa Broadcasting Corporation',ARRAY['Drama']::text[],'published'),
('7급 공무원','7th Grade Civil Servant',ARRAY['7급 공무원','7th Grade Civil Servant','7급공무원']::text[],2013,'Munhwa Broadcasting Corporation',ARRAY['Drama']::text[],'published'),
('야왕','Queen of Ambition',ARRAY['야왕','Queen of Ambition']::text[],2013,'SBS',ARRAY['Drama']::text[],'published'),
('투웍스','Two Weeks',ARRAY['투웍스','Two Weeks']::text[],2013,'Munhwa Broadcasting Corporation',ARRAY['Drama']::text[],'published'),
('천일의 약속','A Thousand Days'' Promise',ARRAY['천일의 약속','A Thousand Days'' Promise','천일의약속']::text[],2011,'Seoul Broadcasting System',ARRAY['Drama']::text[],'published'),
('꽃미남 라면가게','Flower Boy Ramen Shop',ARRAY['꽃미남 라면가게','Flower Boy Ramen Shop','꽃미남라면가게']::text[],2011,'tvN',ARRAY['Drama']::text[],'published'),
('영광의 재인','Glory Jane',ARRAY['영광의 재인','Glory Jane','영광의재인']::text[],2011,'Korean Broadcasting System',ARRAY['Drama']::text[],'published')
) AS v(title_kr, title_en, aliases, year, network, genres, status)
WHERE NOT EXISTS (
  SELECT 1 FROM public.dramas d
  WHERE lower(d.title_en) = lower(v.title_en) OR d.title_kr = v.title_kr
);