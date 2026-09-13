INSERT INTO public.dramas (title_kr, title_en, aliases, year, network, genres, status)
SELECT * FROM (VALUES
('풀하우스','Full House',ARRAY['풀하우스','Full House']::text[],2004,'KBS2',ARRAY['Drama']::text[],'published'),
('폭싹 속았수다','When Life Gives You Tangerines',ARRAY['폭싹 속았수다','When Life Gives You Tangerines','폭싹속았수다']::text[],2025,'Netflix',ARRAY['가족','로맨스']::text[],'published'),
('더 글로리','The Glory',ARRAY['더 글로리','The Glory','더글로리']::text[],2022,'Netflix',ARRAY['스릴러','복수']::text[],'published'),
('슬기로운 의사생활','Hospital Playlist',ARRAY['슬기로운 의사생활','Hospital Playlist','슬기로운의사생활']::text[],2020,'tvN',ARRAY['의료','드라마']::text[],'published'),
('SKY 캐슬','SKY Castle',ARRAY['SKY 캐슬','SKY Castle','SKY캐슬']::text[],2018,'JTBC',ARRAY['드라마','스릴러']::text[],'published'),
('수상한 파트너','Suspicious Partner',ARRAY['수상한 파트너','Suspicious Partner','수상한파트너']::text[],2017,'SBS',ARRAY['Drama']::text[],'published'),
('마녀보감','Secret Healer',ARRAY['마녀보감','Secret Healer']::text[],2016,'JTBC',ARRAY['Drama']::text[],'published'),
('볼트론: 전설 속의 수호자','Voltron: Legendary Defender',ARRAY['볼트론: 전설 속의 수호자','Voltron: Legendary Defender','볼트론:전설속의수호자']::text[],2016,'Netflix',ARRAY['Drama']::text[],'published'),
('용팔이','Yong-pal',ARRAY['용팔이','Yong-pal']::text[],2015,'Seoul Broadcasting System',ARRAY['Drama']::text[],'published'),
('옥탑방 왕세자','Rooftop Prince',ARRAY['옥탑방 왕세자','Rooftop Prince','옥탑방왕세자']::text[],2012,'Seoul Broadcasting System',ARRAY['Drama']::text[],'published'),
('로보카폴리','Robocar Poli',ARRAY['로보카폴리','Robocar Poli']::text[],2011,'EBS 1TV',ARRAY['Drama']::text[],'published'),
('성균관 스캔들','Sungkyunkwan Scandal',ARRAY['성균관 스캔들','Sungkyunkwan Scandal','성균관스캔들']::text[],2010,'KBS2',ARRAY['사극','로맨스']::text[],'published'),
('해신','Emperor of the Sea',ARRAY['해신','Emperor of the Sea']::text[],2004,'KBS2',ARRAY['Drama']::text[],'published'),
('천국의 계단','Stairway to Heaven',ARRAY['천국의 계단','Stairway to Heaven','천국의계단']::text[],2003,'SBS',ARRAY['Drama']::text[],'published'),
('가을동화','Autumn in My Heart',ARRAY['가을동화','Autumn in My Heart']::text[],2000,'KBS2',ARRAY['로맨스']::text[],'published')
) AS v(title_kr, title_en, aliases, year, network, genres, status)
WHERE NOT EXISTS (
  SELECT 1 FROM public.dramas d
  WHERE lower(d.title_en) = lower(v.title_en) OR d.title_kr = v.title_kr
);