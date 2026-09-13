# Drama catalog seed

Source: Wikidata (South Korean TV series with EN+KO labels, ranked by sitelinks) + curated classics.

- `dramas-520.json` — normalized catalog used for insert
- `payloads/p*.sql` — idempotent INSERT batches (`WHERE NOT EXISTS`)

Already applied to the linked Supabase project (target ≥ 500).

Re-run safely via Supabase SQL editor or MCP `execute_sql` on each `payloads/p*.sql`.
