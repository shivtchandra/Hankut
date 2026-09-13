INSERT INTO public.dramas (title_kr, title_en, aliases, year, network, genres, status)
SELECT * FROM (VALUES
('우리들의 블루스','Our Blues',ARRAY['우리들의 블루스','Our Blues','우리들의블루스']::text[],2022,'tvN',ARRAY['Drama']::text[],'published'),
('썸바디','Somebody',ARRAY['썸바디','Somebody']::text[],2022,'Netflix',ARRAY['Drama']::text[],'published'),
('안나라수마나라','The Sound of Magic',ARRAY['안나라수마나라','The Sound of Magic']::text[],2022,'Netflix',ARRAY['Drama']::text[],'published'),
('간 떨어지는 동거','My Roommate is a Gumiho',ARRAY['간 떨어지는 동거','My Roommate is a Gumiho','간떨어지는동거']::text[],2021,'tvN',ARRAY['Drama']::text[],'published'),
('원 더 우먼','One the Woman',ARRAY['원 더 우먼','One the Woman','원더우먼']::text[],2021,'SBS',ARRAY['Drama']::text[],'published'),
('대박부동산','Sell Your Haunted House',ARRAY['대박부동산','Sell Your Haunted House']::text[],2021,'KBS2',ARRAY['Drama']::text[],'published'),
('오월의 청춘','Youth of May',ARRAY['오월의 청춘','Youth of May','오월의청춘']::text[],2021,'KBS2',ARRAY['Drama']::text[],'published'),
('앨리스','Alice',ARRAY['앨리스','Alice']::text[],2020,'SBS',ARRAY['Drama']::text[],'published'),
('그 남자의 기억법','Find Me in Your Memory',ARRAY['그 남자의 기억법','Find Me in Your Memory','그남자의기억법']::text[],2020,'MBC',ARRAY['Drama']::text[],'published'),
('키포와 신기한 동물들','Kipo and the Age of Wonderbeasts',ARRAY['키포와 신기한 동물들','Kipo and the Age of Wonderbeasts','키포와신기한동물들']::text[],2020,'Netflix',ARRAY['Drama']::text[],'published'),
('어서와','Welcome',ARRAY['어서와','Welcome']::text[],2020,'KBS2',ARRAY['Drama']::text[],'published'),
('닥터 프리즈너','Doctor Prisoner',ARRAY['닥터 프리즈너','Doctor Prisoner','닥터프리즈너']::text[],2019,'KBS2',ARRAY['Drama']::text[],'published'),
('열여덟의 순간','The Moment of 18',ARRAY['열여덟의 순간','The Moment of 18','열여덟의순간']::text[],2019,'JTBC',ARRAY['Drama']::text[],'published'),
('사의 찬미','The Hymn of Death',ARRAY['사의 찬미','The Hymn of Death','사의찬미']::text[],2018,'SBS',ARRAY['Drama']::text[],'published'),
('크리미널 마인드','Criminal Minds',ARRAY['크리미널 마인드','Criminal Minds','크리미널마인드']::text[],2017,'tvN',ARRAY['Drama']::text[],'published')
) AS v(title_kr, title_en, aliases, year, network, genres, status)
WHERE NOT EXISTS (
  SELECT 1 FROM public.dramas d
  WHERE lower(d.title_en) = lower(v.title_en) OR d.title_kr = v.title_kr
);