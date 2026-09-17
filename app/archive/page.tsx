import Link from "next/link";
import { SiteNav } from "@/components/layout/SiteNav";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { IconCalendar } from "@/components/icons/Icons";
import { createSupabaseServer } from "@/lib/supabase/server";
import { seoulToday } from "@/lib/game/dates";

export const dynamic = "force-dynamic";

async function getPastPuzzles() {
  const today = seoulToday();
  const supabase = await createSupabaseServer();

  const { data } = await supabase
    .from("daily_games")
    .select(`
      id,
      game_date,
      difficulty,
      scene:scenes (
        drama:dramas ( title_en, title_kr )
      )
    `)
    .lt("game_date", today)
    .in("status", ["published", "scheduled"])
    .order("game_date", { ascending: false })
    .limit(90);

  return (data ?? []).map((row) => {
    const scene = Array.isArray(row.scene) ? row.scene[0] : row.scene;
    const drama = scene
      ? Array.isArray(scene.drama) ? scene.drama[0] : scene.drama
      : null;
    return {
      id: row.id,
      date: row.game_date,
      titleEn: drama?.title_en ?? "Unknown",
      titleKr: drama?.title_kr ?? "",
      difficulty: row.difficulty,
    };
  });
}

export default async function ArchivePage() {
  const puzzles = await getPastPuzzles();

  return (
    <main className="archive-page">
      <SiteNav />

      <section className="archive-content">
        <div className="archive-header-meta">
          <span className="eyebrow">Past puzzles</span>
          <h1>Puzzle archive</h1>
          <p>Replay past scene cuts with no limits.</p>
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
          <div className="archive-grid">
            {puzzles.map((item) => (
              <div key={item.id} className="archive-card">
                <div className="archive-card-header">
                  <span className="archive-category">Scene</span>
                  <span className="archive-date">{item.date}</span>
                </div>
                <h3 className="archive-title">{item.titleEn}</h3>
                {item.titleKr && (
                  <p style={{ fontSize: 13, color: "var(--muted)", margin: "4px 0 0" }}>{item.titleKr}</p>
                )}
                <div className="archive-card-footer">
                  <Link href={`/?date=${item.date}`} className="play-link">
                    Play again
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <SiteFooter />
    </main>
  );
}
