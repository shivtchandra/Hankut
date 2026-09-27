import { listEntities } from "@/app/admin/entities/actions";
import { listSongPuzzles } from "@/app/admin/audio/actions";
import { MusicClient } from "./MusicClient";

export default async function AdminMusicPage() {
  let rows: Awaited<ReturnType<typeof listEntities>>["entities"] = [];
  let total = 0;
  let songPuzzles: Awaited<ReturnType<typeof listSongPuzzles>> = [];

  try {
    const [entityResult, puzzles] = await Promise.all([
      listEntities({ type: "song", limit: 100 }).catch(() => ({ entities: [], total: 0 })),
      listSongPuzzles().catch(() => []),
    ]);
    rows = entityResult.entities;
    total = entityResult.total;
    songPuzzles = puzzles;
  } catch {
    rows = [];
    songPuzzles = [];
  }

  const entityClientRows = rows.map((r) => ({
    id: r.id,
    titleKr: r.titleKr,
    titleEn: r.titleEn,
    status: r.status,
    metadata: r.metadata as Record<string, unknown>,
  }));

  const existingIds = new Set(entityClientRows.map((r) => r.id));
  const puzzleClientRows = songPuzzles
    .filter((p) => !existingIds.has(p.puzzleId))
    .map((p) => ({
      id: p.puzzleId,
      titleKr: p.titleKr,
      titleEn: p.titleEn,
      status: p.status,
      metadata: {
        artist: p.artistKr + (p.artistEn ? ` (${p.artistEn})` : ""),
        dramaTitle: p.dramaTitle,
        audioUrl: p.audioUrl,
        gameDate: p.gameDate,
        isPuzzle: true,
      },
    }));

  const allClientRows = [...puzzleClientRows, ...entityClientRows];
  const catalogCount = total + puzzleClientRows.length;

  return (
    <>
      <div className="admin-title">
        <div>
          <div className="eyebrow">CONTENT</div>
          <h1>Music / OST</h1>
          <p className="muted">{catalogCount} songs in the catalog.</p>
        </div>
      </div>

      <MusicClient initial={allClientRows} />
    </>
  );
}
