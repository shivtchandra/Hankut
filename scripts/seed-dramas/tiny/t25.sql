INSERT INTO public.dramas (title_kr, title_en, aliases, year, network, genres, status)
SELECT * FROM (VALUES
('베토벤 바이러스','Beethoven Virus',ARRAY['베토벤 바이러스','Beethoven Virus','베토벤바이러스']::text[],2008,'Munhwa Broadcasting Corporation',ARRAY['Drama']::text[],'published'),
('쾌도 홍길동','Hong Gil Dong',ARRAY['쾌도 홍길동','Hong Gil Dong','쾌도홍길동']::text[],2008,'KBS2',ARRAY['Drama']::text[],'published'),
('바람의 나라','The Kingdom of The Winds',ARRAY['바람의 나라','The Kingdom of The Winds','바람의나라']::text[],2008,'Korean Broadcasting System',ARRAY['Drama']::text[],'published'),
('고맙습니다','Thank You',ARRAY['고맙습니다','Thank You']::text[],2007,'Munhwa Broadcasting Corporation',ARRAY['Drama']::text[],'published'),
('슬픈 연가','Sad Love Story',ARRAY['슬픈 연가','Sad Love Story','슬픈연가']::text[],2005,'MBC',ARRAY['Drama']::text[],'published'),
('쾌걸춘향','Sassy Girl Chun-hyang',ARRAY['쾌걸춘향','Sassy Girl Chun-hyang']::text[],2005,'GMA Network',ARRAY['Drama']::text[],'published'),
('러브스토리 인 하버드','Love Story in Harvard',ARRAY['러브스토리 인 하버드','Love Story in Harvard','러브스토리인하버드']::text[],2004,'SBS',ARRAY['Drama']::text[],'published'),
('월간남친','Boyfriend on Demand',ARRAY['월간남친','Boyfriend on Demand']::text[],2026,'Netflix',ARRAY['Drama']::text[],'published'),
('멋진 신세계','My Royal Nemesis',ARRAY['멋진 신세계','My Royal Nemesis','멋진신세계']::text[],2026,'SBS',ARRAY['Drama']::text[],'published'),
('더 원더풀스','The Wonderfools',ARRAY['더 원더풀스','The Wonderfools','더원더풀스']::text[],2026,'Netflix',ARRAY['Drama']::text[],'published'),
('견우와 선녀','Head over Heels',ARRAY['견우와 선녀','Head over Heels','견우와선녀']::text[],2025,'tvN',ARRAY['Drama']::text[],'published'),
('그놈은 흑염룡','My Dearest Nemesis',ARRAY['그놈은 흑염룡','My Dearest Nemesis','그놈은흑염룡']::text[],2025,'tvN',ARRAY['Drama']::text[],'published'),
('뉴토피아','Newtopia',ARRAY['뉴토피아','Newtopia']::text[],2025,'Coupang Play',ARRAY['Drama']::text[],'published'),
('언젠가는 슬기로울 전공의생활','Resident Playbook',ARRAY['언젠가는 슬기로울 전공의생활','Resident Playbook','언젠가는슬기로울전공의생활']::text[],2025,'tvN',ARRAY['Drama']::text[],'published'),
('원경','The Queen Who Crowns',ARRAY['원경','The Queen Who Crowns']::text[],2025,'tvN',ARRAY['Drama']::text[],'published')
) AS v(title_kr, title_en, aliases, year, network, genres, status)
WHERE NOT EXISTS (
  SELECT 1 FROM public.dramas d
  WHERE lower(d.title_en) = lower(v.title_en) OR d.title_kr = v.title_kr
);