INSERT INTO public.dramas (title_kr, title_en, aliases, year, network, genres, status)
SELECT * FROM (VALUES
('힙(HIP)하게','Behind your Touch',ARRAY['힙(HIP)하게','Behind your Touch']::text[],2023,'JTBC',ARRAY['Drama']::text[],'published'),
('정신병동에도 아침이 와요','Daily Dose of Sunshine',ARRAY['정신병동에도 아침이 와요','Daily Dose of Sunshine','정신병동에도아침이와요']::text[],2023,'Netflix',ARRAY['Drama']::text[],'published'),
('이두나!','Doona!',ARRAY['이두나!','Doona!']::text[],2023,'Netflix',ARRAY['Drama']::text[],'published'),
('이번 생도 잘 부탁해','See You in My 19th Life',ARRAY['이번 생도 잘 부탁해','See You in My 19th Life','이번생도잘부탁해']::text[],2023,'tvN',ARRAY['Drama']::text[],'published'),
('웰컴투 삼달리','Welcome to Samdalri',ARRAY['웰컴투 삼달리','Welcome to Samdalri','웰컴투삼달리']::text[],2023,'JTBC',ARRAY['Drama']::text[],'published'),
('어게인 마이 라이프','Again My Life',ARRAY['어게인 마이 라이프','Again My Life','어게인마이라이프']::text[],2022,'SBS',ARRAY['Drama']::text[],'published'),
('고스트 닥터','Ghost Doctor',ARRAY['고스트 닥터','Ghost Doctor','고스트닥터']::text[],2022,'tvN',ARRAY['Drama']::text[],'published'),
('무브 투 헤븐: 나는 유품정리사입니다','Move to Heaven',ARRAY['무브 투 헤븐: 나는 유품정리사입니다','Move to Heaven','무브투헤븐:나는유품정리사입니다']::text[],2021,'Netflix',ARRAY['Drama']::text[],'published'),
('나빌레라','Navillera',ARRAY['나빌레라','Navillera']::text[],2021,'tvN',ARRAY['Drama']::text[],'published'),
('알고있지만','Nevertheless',ARRAY['알고있지만','Nevertheless']::text[],2021,'Netflix',ARRAY['Drama']::text[],'published'),
('아기상어 올리와 윌리엄','Baby Shark''s Big Show!',ARRAY['아기상어 올리와 윌리엄','Baby Shark''s Big Show!','아기상어올리와윌리엄']::text[],2020,'Nickelodeon',ARRAY['Drama']::text[],'published'),
('편의점 샛별이','Backstreet Rookie',ARRAY['편의점 샛별이','Backstreet Rookie','편의점샛별이']::text[],2020,'SBS',ARRAY['Drama']::text[],'published'),
('도도솔솔라라솔','Do Do Sol Sol La La Sol',ARRAY['도도솔솔라라솔','Do Do Sol Sol La La Sol']::text[],2020,'KBS2',ARRAY['Drama']::text[],'published'),
('인간수업','Extracurricular',ARRAY['인간수업','Extracurricular']::text[],2020,'Netflix',ARRAY['Drama']::text[],'published'),
('나 홀로 그대','My Holo Love',ARRAY['나 홀로 그대','My Holo Love','나홀로그대']::text[],2020,'Netflix',ARRAY['Drama']::text[],'published')
) AS v(title_kr, title_en, aliases, year, network, genres, status)
WHERE NOT EXISTS (
  SELECT 1 FROM public.dramas d
  WHERE lower(d.title_en) = lower(v.title_en) OR d.title_kr = v.title_kr
);