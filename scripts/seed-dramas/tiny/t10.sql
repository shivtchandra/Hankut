INSERT INTO public.dramas (title_kr, title_en, aliases, year, network, genres, status)
SELECT * FROM (VALUES
('일타 스캔들','Crash Course in Romance',ARRAY['일타 스캔들','Crash Course in Romance','일타스캔들']::text[],2023,'tvN',ARRAY['Drama']::text[],'published'),
('반짝이는 워터멜론','Twinkling Watermelon',ARRAY['반짝이는 워터멜론','Twinkling Watermelon','반짝이는워터멜론']::text[],2023,'tvN',ARRAY['Drama']::text[],'published'),
('소년심판','Juvenile Justice',ARRAY['소년심판','Juvenile Justice']::text[],2022,'Netflix',ARRAY['법률','드라마']::text[],'published'),
('재벌집 막내아들','Reborn Rich',ARRAY['재벌집 막내아들','Reborn Rich','재벌집막내아들']::text[],2022,'JTBC',ARRAY['드라마','판타지']::text[],'published'),
('약한영웅 Class 1','Weak Hero Class 1',ARRAY['약한영웅 Class 1','Weak Hero Class 1','약한영웅Class1']::text[],2022,'Netflix',ARRAY['액션','청춘']::text[],'published'),
('마우스','Mouse',ARRAY['마우스','Mouse']::text[],2021,'tvN',ARRAY['스릴러']::text[],'published'),
('악마판사','The Devil Judge',ARRAY['악마판사','The Devil Judge']::text[],2021,'tvN',ARRAY['Drama']::text[],'published'),
('아스달 연대기','Arthdal Chronicles',ARRAY['아스달 연대기','Arthdal Chronicles','아스달연대기']::text[],2019,'tvN',ARRAY['Drama']::text[],'published'),
('타인은 지옥이다','Hell Is Other People',ARRAY['타인은 지옥이다','Hell Is Other People','타인은지옥이다']::text[],2019,'OCN',ARRAY['Drama']::text[],'published'),
('좋아하면 울리는','Love Alarm',ARRAY['좋아하면 울리는','Love Alarm','좋아하면울리는']::text[],2019,'Netflix',ARRAY['Drama']::text[],'published'),
('로맨스는 별책부록','Romance Is a Bonus Book',ARRAY['로맨스는 별책부록','Romance Is a Bonus Book','로맨스는별책부록']::text[],2019,'tvN',ARRAY['Drama']::text[],'published'),
('조선로코 녹두전','The Tale of Nokdu',ARRAY['조선로코 녹두전','The Tale of Nokdu','조선로코녹두전']::text[],2019,'KBS2',ARRAY['Drama']::text[],'published'),
('알함브라 궁전의 추억','Memories of the Alhambra',ARRAY['알함브라 궁전의 추억','Memories of the Alhambra','알함브라궁전의추억']::text[],2018,'tvN',ARRAY['Drama']::text[],'published'),
('라디오 로맨스','Radio Romance',ARRAY['라디오 로맨스','Radio Romance','라디오로맨스']::text[],2018,'KBS2',ARRAY['Drama']::text[],'published'),
('으라차차 와이키키','Welcome to Waikiki',ARRAY['으라차차 와이키키','Welcome to Waikiki','으라차차와이키키']::text[],2018,'JTBC',ARRAY['Drama']::text[],'published')
) AS v(title_kr, title_en, aliases, year, network, genres, status)
WHERE NOT EXISTS (
  SELECT 1 FROM public.dramas d
  WHERE lower(d.title_en) = lower(v.title_en) OR d.title_kr = v.title_kr
);