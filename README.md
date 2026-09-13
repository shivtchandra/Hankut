# Dramacut / 드라마컷

## Brand

**Dramacut** (EN) / **드라마컷** (KO)

Named for global K-drama fans who already play daily Wordle-likes (*KDramadle*, *Framed*) and Korean players who search for 명장면 / 컷 퀴즈. “Cut” is film-set language in both English and Korean (컷), so shares read cleanly in Reddit threads and Kakao chats:

```
Dramacut 2026-09-11
3/5
⬛⬛🟩⬜⬜
```

Daily K-drama scene guessing game.

**Architecture:** Admin content studio → Supabase → (R2 assets) → public game.

## Connected project

- Supabase URL is set in `.env.local`
- Schema + RLS applied (`dramas`, `scenes`, `scene_assets`, `clues`, `daily_games`, …)
- Seeded: 5 dramas, 1 scene (5 frames + 3 clues), today’s published daily game
- Admin allowlist: `shivachandra9490@gmail.com` (also `ADMIN_EMAILS`)

## Local

```bash
npm install
npm run dev
```

Open http://localhost:3000 — home reads today’s published puzzle from Supabase.

### Admin login

1. In Supabase Dashboard → **Authentication → Providers** → enable **Google**
2. Add redirect URL: `http://localhost:3000/auth/callback`
3. Visit `/login` and sign in with the allowlisted Google account
4. `/admin` opens the content studio

Admin mutations use your session + `is_admin()` RLS (service role key optional).

### R2 uploads

Fill `R2_*` in `.env.local` to enable Scene Studio frame uploads. Until then, seeded `/demo/frame-*.svg` assets work for the public game.

## Routes

| Route | Source |
|-------|--------|
| `/` | `daily_games` for Seoul today |
| `/archive` | past published dailies |
| `/profile` | auth + `plays` |
| `/challenge/[code]` | `challenges` |
| `/admin/*` | allowlisted session |
