INSERT INTO public.dramas (title_kr, title_en, aliases, year, network, genres, status)
SELECT * FROM (VALUES
('패션왕','Fashion King',ARRAY['패션왕','Fashion King']::text[],2012,'SBS',ARRAY['Drama']::text[],'published'),
('유령','Phantom',ARRAY['유령','Phantom']::text[],2012,'SBS',ARRAY['Drama']::text[],'published'),
('닥치고 꽃미남 밴드','Shut Up Flower Boy Band',ARRAY['닥치고 꽃미남 밴드','Shut Up Flower Boy Band','닥치고꽃미남밴드']::text[],2012,'tvN',ARRAY['Drama']::text[],'published'),
('총각네 야채가게','Bachelor''s Vegetable Store',ARRAY['총각네 야채가게','Bachelor''s Vegetable Store','총각네야채가게']::text[],2011,'Channel A',ARRAY['Drama']::text[],'published'),
('뿌리깊은 나무','Deep Rooted Tree',ARRAY['뿌리깊은 나무','Deep Rooted Tree','뿌리깊은나무']::text[],2011,'Seoul Broadcasting System',ARRAY['Drama']::text[],'published'),
('나도','Me Too',ARRAY['나도','Me Too']::text[],2011,'Munhwa Broadcasting Corporation',ARRAY['Drama']::text[],'published'),
('빠담빠담… 그와 그녀의 심장박동소리','Padam Padam... The Sound of His and Her Heartbeats',ARRAY['빠담빠담… 그와 그녀의 심장박동소리','Padam Padam... The Sound of His and Her Heartbeats','빠담빠담…그와그녀의심장박동소리']::text[],2011,'JTBC',ARRAY['Drama']::text[],'published'),
('로맨스 타운','Romance Town',ARRAY['로맨스 타운','Romance Town','로맨스타운']::text[],2011,'Korean Broadcasting System',ARRAY['Drama']::text[],'published'),
('뱀파이어 검사','Vampire Prosecutor',ARRAY['뱀파이어 검사','Vampire Prosecutor','뱀파이어검사']::text[],2011,'OCN',ARRAY['Drama']::text[],'published'),
('커피하우스','Coffee House',ARRAY['커피하우스','Coffee House']::text[],2010,'Seoul Broadcasting System',ARRAY['Drama']::text[],'published'),
('역전의 여왕','Queen of Reversals',ARRAY['역전의 여왕','Queen of Reversals','역전의여왕']::text[],2010,'MBC',ARRAY['Drama']::text[],'published'),
('자명고','Ja Myung Go',ARRAY['자명고','Ja Myung Go']::text[],2009,'Seoul Broadcasting System',ARRAY['Drama']::text[],'published'),
('돌아온 일지매','The Return of Iljimae',ARRAY['돌아온 일지매','The Return of Iljimae','돌아온일지매']::text[],2009,'MBC',ARRAY['Drama']::text[],'published'),
('아내의 유혹','Temptation of Wife',ARRAY['아내의 유혹','Temptation of Wife','아내의유혹']::text[],2008,'Seoul Broadcasting System',ARRAY['Drama']::text[],'published'),
('너는 내 운명','You Are My Destiny',ARRAY['너는 내 운명','You Are My Destiny','너는내운명']::text[],2008,'KBS 1TV',ARRAY['Drama']::text[],'published')
) AS v(title_kr, title_en, aliases, year, network, genres, status)
WHERE NOT EXISTS (
  SELECT 1 FROM public.dramas d
  WHERE lower(d.title_en) = lower(v.title_en) OR d.title_kr = v.title_kr
);