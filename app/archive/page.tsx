import type { Metadata } from "next";
import Link from "next/link";
import { SiteNav } from "@/components/layout/SiteNav";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { IconCalendar } from "@/components/icons/Icons";
import { ArchiveGrid, type ArchivePuzzle } from "@/components/game/ArchiveHistory";
import { createSupabaseServer } from "@/lib/supabase/server";
import { seoulToday } from "@/lib/game/dates";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "K-Drama Quiz Archive — Past Scene & OST Puzzles",
  description:
    "Play past K-drama quizzes by genre: Romance, Fantasy, Thriller, Comedy, and OST audio cuts. Over 90+ past cuts to test your drama knowledge with no limits.",
  keywords: [
    "kdrama quiz archive",
    "past kdrama game",
    "romance kdrama quiz",
    "fantasy kdrama quiz",
    "드라마 OST 퀴즈",
    "드라마 퀴즈 모음",
    "korean drama trivia archive",
    "guess the kdrama archive",
  ],
  openGraph: {
    title: "K-Drama Quiz Archive — Past Scene & OST Puzzles | Dramacut",
    description: "Replay past K-drama scene cuts and OST audio quizzes by genre.",
  },
};

async function getPastPuzzles(): Promise<ArchivePuzzle[]> {
  const today = seoulToday();
  const supabase = await createSupabaseServer();

  // 1. Fetch past scene games from daily_games
  const { data: dailyGames } = await supabase
    .from("daily_games")
    .select(`
      id,
      game_date,
      scene:scenes (
        id,
        drama:dramas (
          id,
          title_kr,
          title_en,
          genres,
          year,
          network
        )
      )
    `)
    .lt("game_date", today)
    .in("status", ["published", "scheduled"])
    .order("game_date", { ascending: false })
    .limit(90);

  // 2. Fetch past sets (e.g. OST cuts) from daily_sets
  const { data: dailySets } = await supabase
    .from("daily_sets")
    .select(`
      id,
      game_date,
      daily_set_items (
        id,
        position,
        puzzle:puzzles (
          id,
          type,
          title,
          metadata
        )
      )
    `)
    .lt("game_date", today)
    .eq("status", "published")
    .order("game_date", { ascending: false })
    .limit(90);

  const seenDates = new Set<string>();
  const puzzles: ArchivePuzzle[] = [];

  // Add scene games
  for (const row of dailyGames ?? []) {
    seenDates.add(row.game_date);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sceneObj = Array.isArray(row.scene) ? row.scene[0] : (row.scene as any);
    const drama = sceneObj?.drama;

    puzzles.push({
      id: row.id,
      date: row.game_date,
      type: "scene",
      titleKr: drama?.title_kr,
      titleEn: drama?.title_en,
      genres: drama?.genres || [],
      year: drama?.year,
      network: drama?.network,
    });
  }

  // Add set items if date wasn't already covered or if set has distinct song items
  for (const setRow of dailySets ?? []) {
    const items = setRow.daily_set_items || [];
    for (const item of items) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const p = item.puzzle as any;
      if (!p) continue;
      const key = `${setRow.game_date}-${p.type}`;
      if (seenDates.has(key)) continue;
      seenDates.add(key);

      puzzles.push({
        id: p.id,
        date: setRow.game_date,
        type: p.type || "song",
        titleKr: p.title,
        titleEn: p.metadata?.title_en || p.metadata?.drama_title,
        genres: p.metadata?.genres || ["OST", "Music"],
        year: p.metadata?.year,
        network: p.metadata?.network,
      });
    }
  }

  // Sort descending by date
  return puzzles.sort((a, b) => (b.date > a.date ? 1 : b.date < a.date ? -1 : 0));
}

export default async function ArchivePage() {
  const puzzles = await getPastPuzzles();

  return (
    <main className="archive-page">
      <SiteNav />

      <section className="archive-content">
        <div className="archive-header-meta">
          <span className="eyebrow">PAST PUZZLES & QUIZ VAULT</span>
          <h1>K-Drama Quiz Archive</h1>
          <p>
            Replay past cuts by genre — Romance, Fantasy, Action & Thriller, Comedy, and OST audio puzzles.
          </p>
        </div>

        {puzzles.length === 0 ? (
          <div className="archive-empty-state">
            <div className="archive-empty-icon-wrap">
              <IconCalendar size={36} />
            </div>
            <h2 className="archive-empty-title">No past cuts yet</h2>
            <p className="archive-empty-desc">
              Previous daily cuts will appear here starting tomorrow.
            </p>
            <Link href="/" className="archive-empty-action">
              Play Today&apos;s Cut →
            </Link>
          </div>
        ) : (
          <ArchiveGrid puzzles={puzzles} />
        )}
      </section>

      <SiteFooter />
    </main>
  );
}
