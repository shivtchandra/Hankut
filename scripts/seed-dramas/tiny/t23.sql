INSERT INTO public.dramas (title_kr, title_en, aliases, year, network, genres, status)
SELECT * FROM (VALUES
('애타는 로맨스','My Secret Romance',ARRAY['애타는 로맨스','My Secret Romance','애타는로맨스']::text[],2017,'OCN',ARRAY['Drama']::text[],'published'),
('변혁의 사랑','Revolutionary Love',ARRAY['변혁의 사랑','Revolutionary Love','변혁의사랑']::text[],2017,'tvN',ARRAY['Drama']::text[],'published'),
('군주','Ruler: Master of the Mask',ARRAY['군주','Ruler: Master of the Mask']::text[],2017,'Munhwa Broadcasting Corporation',ARRAY['Drama']::text[],'published'),
('더 패키지','The Package',ARRAY['더 패키지','The Package','더패키지']::text[],2017,'JTBC',ARRAY['Drama']::text[],'published'),
('질투의 화신','Don''t Dare to Dream',ARRAY['질투의 화신','Don''t Dare to Dream','질투의화신']::text[],2016,'Seoul Broadcasting System',ARRAY['Drama']::text[],'published'),
('옥중화','Flowers of the Prison',ARRAY['옥중화','Flowers of the Prison']::text[],2016,'Munhwa Broadcasting Corporation',ARRAY['Drama']::text[],'published'),
('청춘시대','Hello, My Twenties!',ARRAY['청춘시대','Hello, My Twenties!']::text[],2016,'JTBC',ARRAY['Drama']::text[],'published'),
('대박','The Royal Gambler',ARRAY['대박','The Royal Gambler']::text[],2016,'Seoul Broadcasting System',ARRAY['Drama']::text[],'published'),
('해적왕 작스톰','Zak Storm',ARRAY['해적왕 작스톰','Zak Storm','해적왕작스톰']::text[],2016,'Canal J',ARRAY['Drama']::text[],'published'),
('발칙하게 고고','Cheer Up!',ARRAY['발칙하게 고고','Cheer Up!','발칙하게고고']::text[],2015,'KBS2',ARRAY['Drama']::text[],'published'),
('디데이','D-Day',ARRAY['디데이','D-Day']::text[],2015,'JTBC',ARRAY['Drama']::text[],'published'),
('애인 있어요','I Have a Lover',ARRAY['애인 있어요','I Have a Lover','애인있어요']::text[],2015,'Seoul Broadcasting System',ARRAY['Drama']::text[],'published'),
('빛나거나 미치거나','Shine or Go Crazy',ARRAY['빛나거나 미치거나','Shine or Go Crazy','빛나거나미치거나']::text[],2015,'MBC',ARRAY['Drama']::text[],'published'),
('화정','Splendid Politics',ARRAY['화정','Splendid Politics']::text[],2015,'MBC',ARRAY['Drama']::text[],'published'),
('엔젤 아이즈','Angel Eyes',ARRAY['엔젤 아이즈','Angel Eyes','엔젤아이즈']::text[],2014,'Seoul Broadcasting System',ARRAY['Drama']::text[],'published')
) AS v(title_kr, title_en, aliases, year, network, genres, status)
WHERE NOT EXISTS (
  SELECT 1 FROM public.dramas d
  WHERE lower(d.title_en) = lower(v.title_en) OR d.title_kr = v.title_kr
);