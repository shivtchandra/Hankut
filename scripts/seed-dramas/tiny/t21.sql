INSERT INTO public.dramas (title_kr, title_en, aliases, year, network, genres, status)
SELECT * FROM (VALUES
('퀸메이커','Queenmaker',ARRAY['퀸메이커','Queenmaker']::text[],2023,'Netflix',ARRAY['Drama']::text[],'published'),
('힘쎈여자 강남순','Strong Girl Nam-soon',ARRAY['힘쎈여자 강남순','Strong Girl Nam-soon','힘쎈여자강남순']::text[],2023,'JTBC',ARRAY['Drama']::text[],'published'),
('붉은 단심','Bloody Heart',ARRAY['붉은 단심','Bloody Heart','붉은단심']::text[],2022,'KBS2',ARRAY['Drama']::text[],'published'),
('미남당','Café Minamdang',ARRAY['미남당','Café Minamdang']::text[],2022,'KBS2',ARRAY['Drama']::text[],'published'),
('커넥트','Connect',ARRAY['커넥트','Connect']::text[],2022,'Hulu',ARRAY['Drama']::text[],'published'),
('월수금화목토','Love in Contract',ARRAY['월수금화목토','Love in Contract']::text[],2022,'tvN',ARRAY['Drama']::text[],'published'),
('군검사 도베르만','Military Prosecutor Doberman',ARRAY['군검사 도베르만','Military Prosecutor Doberman','군검사도베르만']::text[],2022,'tvN',ARRAY['Drama']::text[],'published'),
('어쩌다 전원일기','Once Upon a Small Town',ARRAY['어쩌다 전원일기','Once Upon a Small Town','어쩌다전원일기']::text[],2022,'Netflix',ARRAY['Drama']::text[],'published'),
('조선 정신과 의사 유세풍','Poong, the Joseon Psychiatrist',ARRAY['조선 정신과 의사 유세풍','Poong, the Joseon Psychiatrist','조선정신과의사유세풍']::text[],2022,'tvN',ARRAY['Drama']::text[],'published'),
('3인칭 복수','Revenge of Others',ARRAY['3인칭 복수','Revenge of Others','3인칭복수']::text[],2022,'Star',ARRAY['Drama']::text[],'published'),
('사운드트랙 #1','Soundtrack #1',ARRAY['사운드트랙 #1','Soundtrack #1','사운드트랙#1']::text[],2022,'Star',ARRAY['Drama']::text[],'published'),
('금수저','The Golden Spoon',ARRAY['금수저','The Golden Spoon']::text[],2022,'MBC',ARRAY['Drama']::text[],'published'),
('괴물','Beyond Evil',ARRAY['괴물','Beyond Evil']::text[],2021,'JTBC',ARRAY['스릴러','범죄']::text[],'published'),
('달리와 감자탕','Dali and Cocky Prince',ARRAY['달리와 감자탕','Dali and Cocky Prince','달리와감자탕']::text[],2021,'KBS2',ARRAY['Drama']::text[],'published'),
('홍천기','Lovers of the Red Sky',ARRAY['홍천기','Lovers of the Red Sky']::text[],2021,'SBS',ARRAY['Drama']::text[],'published')
) AS v(title_kr, title_en, aliases, year, network, genres, status)
WHERE NOT EXISTS (
  SELECT 1 FROM public.dramas d
  WHERE lower(d.title_en) = lower(v.title_en) OR d.title_kr = v.title_kr
);