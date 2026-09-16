import { listEntities } from "@/app/admin/entities/actions";
import { MusicClient } from "./MusicClient";

export default async function AdminMusicPage() {
  let rows: Awaited<ReturnType<typeof listEntities>>["entities"] = [];
  let total = 0;
  try {
    const result = await listEntities({ type: "song", limit: 100 });
    rows = result.entities;
    total = result.total;
  } catch {
    rows = [];
  }

  const clientRows = rows.map((r) => ({
    id: r.id,
    titleKr: r.titleKr,
    titleEn: r.titleEn,
    status: r.status,
    metadata: r.metadata as Record<string, unknown>,
  }));

  return (
    <>
      <div className="admin-title">
        <div>
          <div className="eyebrow">CONTENT</div>
          <h1>Music / OST</h1>
          <p className="muted">{total} songs in the catalog.</p>
        </div>
      </div>

      <MusicClient initial={clientRows} />
    </>
  );
}
