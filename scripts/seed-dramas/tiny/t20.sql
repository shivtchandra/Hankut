INSERT INTO public.dramas (title_kr, title_en, aliases, year, network, genres, status)
SELECT * FROM (VALUES
('탄금','Dear Hongrang',ARRAY['탄금','Dear Hongrang']::text[],2025,'Netflix',ARRAY['Drama']::text[],'published'),
('선의의 경쟁','Friendly Rivalry',ARRAY['선의의 경쟁','Friendly Rivalry','선의의경쟁']::text[],2025,'U+Mobile',ARRAY['Drama']::text[],'published'),
('스터디그룹','Study Group',ARRAY['스터디그룹','Study Group']::text[],2025,'TVING',ARRAY['Drama']::text[],'published'),
('자백의 대가','The Price of Confession',ARRAY['자백의 대가','The Price of Confession','자백의대가']::text[],2025,'Netflix',ARRAY['Drama']::text[],'published'),
('살인자ㅇ난감','A Killer Paradox',ARRAY['살인자ㅇ난감','A Killer Paradox']::text[],2024,'Netflix',ARRAY['Drama']::text[],'published'),
('닭강정','Chicken Nugget',ARRAY['닭강정','Chicken Nugget']::text[],2024,'Netflix',ARRAY['Drama']::text[],'published'),
('조립식 가족','Family by Choice',ARRAY['조립식 가족','Family by Choice','조립식가족']::text[],2024,'JTBC',ARRAY['Drama']::text[],'published'),
('재벌X형사','Flex X Cop',ARRAY['재벌X형사','Flex X Cop']::text[],2024,'SBS',ARRAY['Drama']::text[],'published'),
('종말의 바보','Goodbye Earth',ARRAY['종말의 바보','Goodbye Earth','종말의바보']::text[],2024,'Netflix',ARRAY['Drama']::text[],'published'),
('아무도 없는 숲속에서','The Frog',ARRAY['아무도 없는 숲속에서','The Frog','아무도없는숲속에서']::text[],2024,'Netflix',ARRAY['Drama']::text[],'published'),
('지금 거신 전화는','When the Phone Rings',ARRAY['지금 거신 전화는','When the Phone Rings','지금거신전화는']::text[],2024,'MBC',ARRAY['Drama']::text[],'published'),
('딜리버리 맨!','Delivery Man',ARRAY['딜리버리 맨!','Delivery Man','딜리버리맨!']::text[],2023,'Genie',ARRAY['Drama']::text[],'published'),
('무빙','Moving',ARRAY['무빙','Moving']::text[],2023,'Hulu',ARRAY['액션','판타지']::text[],'published'),
('슈퍼맨과 나의 모험','My Adventures with Superman',ARRAY['슈퍼맨과 나의 모험','My Adventures with Superman','슈퍼맨과나의모험']::text[],2023,'Adult Swim',ARRAY['Drama']::text[],'published'),
('연인','My Dearest',ARRAY['연인','My Dearest']::text[],2023,'MBC',ARRAY['Drama']::text[],'published')
) AS v(title_kr, title_en, aliases, year, network, genres, status)
WHERE NOT EXISTS (
  SELECT 1 FROM public.dramas d
  WHERE lower(d.title_en) = lower(v.title_en) OR d.title_kr = v.title_kr
);