# Product roadmap

## Launch thesis

Make the game feel Korean-first and fandom-first: scene memory, daily ritual, and friend challenge are the core loop.

## Phase 1 — prove the loop

- Korean-first daily scene mode
- 5 progressive frames
- 3–5 optional clues
- deterministic answer matching
- guest play
- result/share card
- challenge URL
- archive
- admin CMS
- R2 assets + Supabase metadata

## Phase 2 — retention

- Supabase Auth + Kakao/Google/Apple
- streaks
- weekly leaderboard
- personal history
- friend leaderboard
- real Kakao sharing flow

## Phase 3 — expansion

- OST mode
- dialogue mode
- prop mode
- hardcore mode
- private room competitions
- community submissions + moderation
- drama taste profile
- recommendations

## Admin operating model

Drama -> candidate scenes -> 5 frames -> clue ladder -> rights review -> QA preview -> daily schedule -> publish -> analytics review.

## Content quality rule

Frame 1 should be genuinely ambiguous. Frame 5 can be obvious. Clues should remove uncertainty without simply giving away the title.

## Storage rule

Postgres is metadata. R2 is binaries. Never commit scene assets to Git. Every public image has a source and rights status recorded in the CMS.
