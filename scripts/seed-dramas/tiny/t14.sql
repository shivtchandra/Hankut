INSERT INTO public.dramas (title_kr, title_en, aliases, year, network, genres, status)
SELECT * FROM (VALUES
('쌍갑포차','Mystic Pop-up Bar',ARRAY['쌍갑포차','Mystic Pop-up Bar']::text[],2020,'JTBC',ARRAY['Drama']::text[],'published'),
('날씨가 좋으면 찾아가겠어요','When the Weather Is Fine',ARRAY['날씨가 좋으면 찾아가겠어요','When the Weather Is Fine','날씨가좋으면찾아가겠어요']::text[],2020,'JTBC',ARRAY['Drama']::text[],'published'),
('어비스','Abyss',ARRAY['어비스','Abyss']::text[],2019,'tvN',ARRAY['Drama']::text[],'published'),
('우아한 가','Graceful Family',ARRAY['우아한 가','Graceful Family','우아한가']::text[],2019,'Maeil Broadcasting Network',ARRAY['Drama']::text[],'published'),
('검색어를 입력하세요: www','Search: WWW',ARRAY['검색어를 입력하세요: www','Search: WWW','검색어를입력하세요:www']::text[],2019,'tvN',ARRAY['Drama']::text[],'published'),
('열혈사제','The Fiery Priest',ARRAY['열혈사제','The Fiery Priest']::text[],2019,'SBS',ARRAY['Drama']::text[],'published'),
('무법 변호사','Lawless Lawyer',ARRAY['무법 변호사','Lawless Lawyer','무법변호사']::text[],2018,'tvN',ARRAY['Drama']::text[],'published'),
('나의 아저씨','My Mister',ARRAY['나의 아저씨','My Mister','나의아저씨']::text[],2018,'tvN',ARRAY['드라마']::text[],'published'),
('내 뒤에 테리우스','My Secret Terrius',ARRAY['내 뒤에 테리우스','My Secret Terrius','내뒤에테리우스']::text[],2018,'MBC',ARRAY['Drama']::text[],'published'),
('서른이지만 열일곱입니다','Still 17',ARRAY['서른이지만 열일곱입니다','Still 17','서른이지만열일곱입니다']::text[],2018,'SBS',ARRAY['Drama']::text[],'published'),
('슈츠','Suits',ARRAY['슈츠','Suits']::text[],2018,'KBS2',ARRAY['Drama']::text[],'published'),
('황후의 품격','The Last Empress',ARRAY['황후의 품격','The Last Empress','황후의품격']::text[],2018,'SBS',ARRAY['Drama']::text[],'published'),
('여우각시별','Where Stars Land',ARRAY['여우각시별','Where Stars Land']::text[],2018,'SBS',ARRAY['Drama']::text[],'published'),
('사랑의 온도','Temperature of Love',ARRAY['사랑의 온도','Temperature of Love','사랑의온도']::text[],2017,'Seoul Broadcasting System',ARRAY['Drama']::text[],'published'),
('하백의 신부 2017','The Bride of Habaek',ARRAY['하백의 신부 2017','The Bride of Habaek','하백의신부2017']::text[],2017,'tvN',ARRAY['Drama']::text[],'published')
) AS v(title_kr, title_en, aliases, year, network, genres, status)
WHERE NOT EXISTS (
  SELECT 1 FROM public.dramas d
  WHERE lower(d.title_en) = lower(v.title_en) OR d.title_kr = v.title_kr
);