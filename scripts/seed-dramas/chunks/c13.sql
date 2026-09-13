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
('연인','My Dearest',ARRAY['연인','My Dearest']::text[],2023,'MBC',ARRAY['Drama']::text[],'published'),
('퀸메이커','Queenmaker',ARRAY['퀸메이커','Queenmaker']::text[],2023,'Netflix',ARRAY['Drama']::text[],'published'),
('힘쎈여자 강남순','Strong Girl Nam-soon',ARRAY['힘쎈여자 강남순','Strong Girl Nam-soon','힘쎈여자강남순']::text[],2023,'JTBC',ARRAY['Drama']::text[],'published'),
('붉은 단심','Bloody Heart',ARRAY['붉은 단심','Bloody Heart','붉은단심']::text[],2022,'KBS2',ARRAY['Drama']::text[],'published'),
('미남당','Café Minamdang',ARRAY['미남당','Café Minamdang']::text[],2022,'KBS2',ARRAY['Drama']::text[],'published'),
('커넥트','Connect',ARRAY['커넥트','Connect']::text[],2022,'Hulu',ARRAY['Drama']::text[],'published'),
('월수금화목토','Love in Contract',ARRAY['월수금화목토','Love in Contract']::text[],2022,'tvN',ARRAY['Drama']::text[],'published'),
('군검사 도베르만','Military Prosecutor Doberman',ARRAY['군검사 도베르만','Military Prosecutor Doberman','군검사도베르만']::text[],2022,'tvN',ARRAY['Drama']::text[],'published'),
('어쩌다 전원일기','Once Upon a Small Town',ARRAY['어쩌다 전원일기','Once Upon a Small Town','어쩌다전원일기']::text[],2022,'Netflix',ARRAY['Drama']::text[],'published'),
('조선 정신과 의사 유세풍','Poong, the Joseon Psychiatrist',ARRAY['조선 정신과 의사 유세풍','Poong, the Joseon Psychiatrist','조선정신과의사유세풍']::text[],2022,'tvN',ARRAY['Drama']::text[],'published'),
('3인칭 복수','Revenge of Others',ARRAY['3인칭 복수','Revenge of Others','3인칭복수']::text[],2022,'Star',ARRAY['Drama']::text[],'published')
) AS v(title_kr, title_en, aliases, year, network, genres, status)
WHERE NOT EXISTS (
  SELECT 1 FROM public.dramas d
  WHERE lower(d.title_en) = lower(v.title_en) OR d.title_kr = v.title_kr
);