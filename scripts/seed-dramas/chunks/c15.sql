INSERT INTO public.dramas (title_kr, title_en, aliases, year, network, genres, status)
SELECT * FROM (VALUES
('옥중화','Flowers of the Prison',ARRAY['옥중화','Flowers of the Prison']::text[],2016,'Munhwa Broadcasting Corporation',ARRAY['Drama']::text[],'published'),
('청춘시대','Hello, My Twenties!',ARRAY['청춘시대','Hello, My Twenties!']::text[],2016,'JTBC',ARRAY['Drama']::text[],'published'),
('대박','The Royal Gambler',ARRAY['대박','The Royal Gambler']::text[],2016,'Seoul Broadcasting System',ARRAY['Drama']::text[],'published'),
('해적왕 작스톰','Zak Storm',ARRAY['해적왕 작스톰','Zak Storm','해적왕작스톰']::text[],2016,'Canal J',ARRAY['Drama']::text[],'published'),
('발칙하게 고고','Cheer Up!',ARRAY['발칙하게 고고','Cheer Up!','발칙하게고고']::text[],2015,'KBS2',ARRAY['Drama']::text[],'published'),
('디데이','D-Day',ARRAY['디데이','D-Day']::text[],2015,'JTBC',ARRAY['Drama']::text[],'published'),
('애인 있어요','I Have a Lover',ARRAY['애인 있어요','I Have a Lover','애인있어요']::text[],2015,'Seoul Broadcasting System',ARRAY['Drama']::text[],'published'),
('빛나거나 미치거나','Shine or Go Crazy',ARRAY['빛나거나 미치거나','Shine or Go Crazy','빛나거나미치거나']::text[],2015,'MBC',ARRAY['Drama']::text[],'published'),
('화정','Splendid Politics',ARRAY['화정','Splendid Politics']::text[],2015,'MBC',ARRAY['Drama']::text[],'published'),
('엔젤 아이즈','Angel Eyes',ARRAY['엔젤 아이즈','Angel Eyes','엔젤아이즈']::text[],2014,'Seoul Broadcasting System',ARRAY['Drama']::text[],'published'),
('나쁜 녀석들','Bad Guys',ARRAY['나쁜 녀석들','Bad Guys','나쁜녀석들']::text[],2014,'OCN',ARRAY['범죄']::text[],'published'),
('백년의 신부','Bride of the Century',ARRAY['백년의 신부','Bride of the Century','백년의신부']::text[],2014,'TV CHOSUN',ARRAY['Drama']::text[],'published'),
('운명처럼 널 사랑해','Fated to Love You',ARRAY['운명처럼 널 사랑해','Fated to Love You','운명처럼널사랑해']::text[],2014,'Munhwa Broadcasting Corporation',ARRAY['Drama']::text[],'published'),
('왕의 얼굴','The King''s Face',ARRAY['왕의 얼굴','The King''s Face','왕의얼굴']::text[],2014,'Korean Broadcasting System',ARRAY['Drama']::text[],'published'),
('삼총사','The Three Musketeers',ARRAY['삼총사','The Three Musketeers']::text[],2014,'tvN',ARRAY['Drama']::text[],'published'),
('쓰리 데이즈','Three Days',ARRAY['쓰리 데이즈','Three Days','쓰리데이즈']::text[],2014,'Seoul Broadcasting System',ARRAY['Drama']::text[],'published'),
('너희들은 포위됐다','You''re All Surrounded',ARRAY['너희들은 포위됐다','You''re All Surrounded','너희들은포위됐다']::text[],2014,'Seoul Broadcasting System',ARRAY['Drama']::text[],'published'),
('총리와 나','Prime Minister and I',ARRAY['총리와 나','Prime Minister and I','총리와나']::text[],2013,'KBS2',ARRAY['Drama']::text[],'published'),
('최고다 이순신','You''re the Best, Lee Soon-shin',ARRAY['최고다 이순신','You''re the Best, Lee Soon-shin','최고다이순신']::text[],2013,'Korean Broadcasting System',ARRAY['Drama']::text[],'published'),
('시계마을 티키톡!','Tickety Toc',ARRAY['시계마을 티키톡!','Tickety Toc','시계마을티키톡!']::text[],2012,'Korea Educational Broadcasting System',ARRAY['Drama']::text[],'published'),
('무사 백동수','Warrior Baek Dong-soo',ARRAY['무사 백동수','Warrior Baek Dong-soo','무사백동수']::text[],2011,'Seoul Broadcasting System',ARRAY['Drama']::text[],'published'),
('공부의 신','Master of Study',ARRAY['공부의 신','Master of Study','공부의신']::text[],2010,'KBS2',ARRAY['Drama']::text[],'published'),
('오! 마이 레이디','Oh! My Lady',ARRAY['오! 마이 레이디','Oh! My Lady','오!마이레이디']::text[],2010,'Seoul Broadcasting System',ARRAY['Drama']::text[],'published'),
('변신자동차 또봇','Tobot',ARRAY['변신자동차 또봇','Tobot','변신자동차또봇']::text[],2010,NULL,ARRAY['Drama']::text[],'published'),
('신데렐라 맨','Cinderella Man',ARRAY['신데렐라 맨','Cinderella Man','신데렐라맨']::text[],2009,'MBC',ARRAY['Drama']::text[],'published')
) AS v(title_kr, title_en, aliases, year, network, genres, status)
WHERE NOT EXISTS (
  SELECT 1 FROM public.dramas d
  WHERE lower(d.title_en) = lower(v.title_en) OR d.title_kr = v.title_kr
);