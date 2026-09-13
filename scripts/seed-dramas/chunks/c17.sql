INSERT INTO public.dramas (title_kr, title_en, aliases, year, network, genres, status)
SELECT * FROM (VALUES
('7인의 탈출','The Escape of the Seven',ARRAY['7인의 탈출','The Escape of the Seven','7인의탈출']::text[],2023,'SBS',ARRAY['Drama']::text[],'published'),
('나쁜 엄마','The Good Bad Mother',ARRAY['나쁜 엄마','The Good Bad Mother','나쁜엄마']::text[],2023,'JTBC',ARRAY['Drama']::text[],'published'),
('진짜가 나타났다!','The Real Has Come!',ARRAY['진짜가 나타났다!','The Real Has Come!','진짜가나타났다!']::text[],2023,'KBS2',ARRAY['Drama']::text[],'published'),
('꽃선비 열애사','The Secret Romantic Guesthouse',ARRAY['꽃선비 열애사','The Secret Romantic Guesthouse','꽃선비열애사']::text[],2023,'SBS',ARRAY['Drama']::text[],'published'),
('크레이지 러브','Crazy Love',ARRAY['크레이지 러브','Crazy Love','크레이지러브']::text[],2022,'KBS2',ARRAY['Drama']::text[],'published'),
('당신이 소원을 말하면','If You Wish Upon Me',ARRAY['당신이 소원을 말하면','If You Wish Upon Me','당신이소원을말하면']::text[],2022,'KBS2',ARRAY['Drama']::text[],'published'),
('키스 식스 센스','Kiss Sixth Sense',ARRAY['키스 식스 센스','Kiss Sixth Sense','키스식스센스']::text[],2022,'Disney+',ARRAY['Drama']::text[],'published'),
('너에게 가는 속도 493KM','Love All Play',ARRAY['너에게 가는 속도 493KM','Love All Play','너에게가는속도493KM']::text[],2022,'KBS2',ARRAY['Drama']::text[],'published'),
('나의 해방일지','My Liberation Notes',ARRAY['나의 해방일지','My Liberation Notes','나의해방일지']::text[],2022,'JTBC',ARRAY['드라마']::text[],'published'),
('수리남','Narco-Saints',ARRAY['수리남','Narco-Saints']::text[],2022,'Netflix',ARRAY['Drama']::text[],'published'),
('블랙의 신부','Remarriage & Desires',ARRAY['블랙의 신부','Remarriage & Desires','블랙의신부']::text[],2022,'Netflix',ARRAY['Drama']::text[],'published'),
('서른, 아홉','Thirty-Nine',ARRAY['서른, 아홉','Thirty-Nine','서른,아홉']::text[],2022,'JTBC',ARRAY['Drama']::text[],'published'),
('내일','Tomorrow',ARRAY['내일','Tomorrow']::text[],2022,'MBC',ARRAY['Drama']::text[],'published'),
('배드 앤 크레이지','Bad and Crazy',ARRAY['배드 앤 크레이지','Bad and Crazy','배드앤크레이지']::text[],2021,'tvN',ARRAY['Drama']::text[],'published'),
('어느 날 우리 집 현관으로 멸망이 들어왔다','Doom at Your Service',ARRAY['어느 날 우리 집 현관으로 멸망이 들어왔다','Doom at Your Service','어느날우리집현관으로멸망이들어왔다']::text[],2021,'tvN',ARRAY['Drama']::text[],'published'),
('지리산','Jirisan',ARRAY['지리산','Jirisan']::text[],2021,'tvN',ARRAY['Drama']::text[],'published'),
('로스쿨','Law School',ARRAY['로스쿨','Law School']::text[],2021,'JTBC',ARRAY['Drama']::text[],'published'),
('멜랑꼴리아','Melancholia',ARRAY['멜랑꼴리아','Melancholia']::text[],2021,'tvN',ARRAY['Drama']::text[],'published'),
('라켓소년단','Racket Boys',ARRAY['라켓소년단','Racket Boys']::text[],2021,'SBS',ARRAY['Drama']::text[],'published'),
('달이 뜨는 강','River Where the Moon Rises',ARRAY['달이 뜨는 강','River Where the Moon Rises','달이뜨는강']::text[],2021,'KBS2',ARRAY['Drama']::text[],'published'),
('모범택시','Taxi Driver',ARRAY['모범택시','Taxi Driver']::text[],2021,'SBS',ARRAY['Drama']::text[],'published'),
('두 번째 남편','The Second Husband',ARRAY['두 번째 남편','The Second Husband','두번째남편']::text[],2021,'MBC',ARRAY['Drama']::text[],'published'),
('바람피면 죽는다','Cheat on Me, if You Can',ARRAY['바람피면 죽는다','Cheat on Me, if You Can','바람피면죽는다']::text[],2020,'KBS2',ARRAY['Drama']::text[],'published'),
('굿캐스팅','Good Casting',ARRAY['굿캐스팅','Good Casting']::text[],2020,'SBS',ARRAY['Drama']::text[],'published'),
('메모리스트','Memorist',ARRAY['메모리스트','Memorist']::text[],2020,'tvN',ARRAY['Drama']::text[],'published')
) AS v(title_kr, title_en, aliases, year, network, genres, status)
WHERE NOT EXISTS (
  SELECT 1 FROM public.dramas d
  WHERE lower(d.title_en) = lower(v.title_en) OR d.title_kr = v.title_kr
);