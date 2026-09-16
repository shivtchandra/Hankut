import Link from "next/link";
import { notFound } from "next/navigation";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { DramaPosterEditor } from "@/components/admin/DramaPosterEditor";

export default async function DramaDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const db = await createSupabaseAdmin();

  // 1. Fetch Drama Details
  const { data: drama } = await db
    .from("dramas")
    .select("id, title_kr, title_en, year, network, status, genres, aliases, poster_url")
    .eq("id", id)
    .maybeSingle();

  if (!drama) notFound();

  // 2. Fetch Matching Canonical Entity
  const { data: entity } = await db
    .from("entities")
    .select("id, slug, type, metadata, poster_url")
    .eq("title_kr", drama.title_kr)
    .maybeSingle();

  // 3. Fetch Scenes with frame count
  const { data: scenes } = await db
    .from("scenes")
    .select("id, scene_code, episode, status, scene_assets(id, frame_order)")
    .eq("drama_id", id)
    .order("created_at", { ascending: false });

  // 4. Fetch Connected Entity Graph (Cast, Soundtracks, Directors)
  let relations: Array<{
    id: string;
    relation_type: string;
    related_title: string;
    related_type: string;
    related_id: string;
  }> = [];

  if (entity?.id) {
    const { data: rels } = await db
      .from("entity_relations")
      .select("id, relation_type, source:source_entity_id(id, title_kr, type), target:target_entity_id(id, title_kr, type)")
      .or(`source_entity_id.eq.${entity.id},target_entity_id.eq.${entity.id}`);

    if (rels) {
      relations = rels.map((r: any) => {
        const isSource = r.source?.id === entity.id;
        const target = isSource ? r.target : r.source;
        return {
          id: r.id,
          relation_type: r.relation_type,
          related_title: target?.title_kr ?? "Unknown Entity",
          related_type: target?.type ?? "entity",
          related_id: target?.id ?? "",
        };
      });
    }
  }

  // 5. Fetch Related Puzzles (Audio, Chosung, Connections, People)
  let puzzles: Array<{
    id: string;
    type: string;
    title: string;
    status: string;
  }> = [];

  if (entity?.id) {
    const { data: puzzleRows } = await db
      .from("puzzles")
      .select("id, type, title, status")
      .eq("entity_id", entity.id);
    if (puzzleRows) puzzles = puzzleRows;
  }

  return (
    <>
      <div className="admin-title">
        <div>
          <div className="eyebrow" style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span>DRAMA CONTENT HUB</span>
            {entity ? (
              <span className="tag" style={{ background: "var(--paper-soft)", color: "var(--green)" }}>
                ✓ Linked to Entity Graph
              </span>
            ) : (
              <span className="tag" style={{ background: "#fef2f2", color: "#dc2626" }}>
                Unlinked Entity
              </span>
            )}
          </div>
          <h1>{drama.title_kr}</h1>
          <p className="muted">
            {drama.title_en} {drama.year ? `(${drama.year})` : ""} · Network: {drama.network ?? "—"}
          </p>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <Link className="secondary" href={`/admin/entities${entity ? `?id=${entity.id}` : ""}`}>
            Entity Graph
          </Link>
          <Link className="primary" href={`/admin/scenes`}>
            + Create Scene
          </Link>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: 24, marginBottom: 32 }}>
        {/* Left: Poster & Quick Info */}
        <div className="admin-card" style={{ padding: 16 }}>
          <DramaPosterEditor dramaId={drama.id} initialUrl={drama.poster_url} />

          <div style={{ fontSize: 13, borderTop: "1px solid var(--line)", paddingTop: 12, marginTop: 12 }}>
            <div style={{ marginBottom: 6 }}>
              <span className="muted">Status: </span>
              <strong className="tag">{drama.status}</strong>
            </div>
            {drama.genres && drama.genres.length > 0 && (
              <div style={{ marginBottom: 6 }}>
                <span className="muted">Genres: </span>
                <span>{drama.genres.join(", ")}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right: Correlated Hub Tabs & Matrices */}
        <div>
          {/* Key Metrics */}
          <div className="admin-grid" style={{ marginBottom: 24, gridTemplateColumns: "repeat(4, 1fr)" }}>
            <div className="metric">
              <span className="muted">Scenes</span>
              <b>{scenes?.length ?? 0}</b>
            </div>
            <div className="metric">
              <span className="muted">Graph Relations</span>
              <b>{relations.length}</b>
            </div>
            <div className="metric">
              <span className="muted">Puzzles</span>
              <b>{puzzles.length}</b>
            </div>
            <div className="metric">
              <span className="muted">Ready Frames</span>
              <b>
                {(scenes ?? []).filter((s: any) => (s.scene_assets?.length ?? 0) >= 5).length} / {scenes?.length ?? 0}
              </b>
            </div>
          </div>

          {/* Scenes Correlation Table */}
          <div className="admin-card" style={{ padding: 20, marginBottom: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <h3 style={{ margin: 0, fontSize: 16 }}>Associated Scenes &amp; Frames</h3>
              <Link className="secondary" href="/admin/scenes" style={{ padding: "4px 10px", fontSize: 12 }}>
                Manage All Scenes
              </Link>
            </div>

            {(!scenes || scenes.length === 0) ? (
              <p className="muted" style={{ fontSize: 13 }}>
                No scenes added yet. Click &quot;Create Scene&quot; to add screenshots for this drama.
              </p>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Scene Code</th>
                    <th>Episode</th>
                    <th>Frame Progress</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {scenes.map((scene: any) => {
                    const frameCount = scene.scene_assets?.length ?? 0;
                    const isComplete = frameCount >= 5;

                    return (
                      <tr key={scene.id}>
                        <td>
                          <strong>{scene.scene_code}</strong>
                        </td>
                        <td>Ep {scene.episode ?? "1"}</td>
                        <td>
                          <span
                            className="tag"
                            style={{
                              background: isComplete ? "#f0fdf4" : "#fffbebe",
                              color: isComplete ? "#166534" : "#b45309",
                              fontWeight: 600,
                            }}
                          >
                            {frameCount} / 5 frames {isComplete ? "✓ Ready" : "⚠️ Incomplete"}
                          </span>
                        </td>
                        <td>
                          <span className="tag">{scene.status}</span>
                        </td>
                        <td>
                          <Link href={`/admin/scenes/${scene.id}`} style={{ fontWeight: 600 }}>
                            Open Studio →
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          {/* Entity Graph Relations */}
          <div className="admin-card" style={{ padding: 20, marginBottom: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <h3 style={{ margin: 0, fontSize: 16 }}>Graph Relations (Cast, OST, Universe)</h3>
              <Link className="secondary" href="/admin/entities" style={{ padding: "4px 10px", fontSize: 12 }}>
                Edit Graph
              </Link>
            </div>

            {relations.length === 0 ? (
              <p className="muted" style={{ fontSize: 13 }}>
                No graph relations mapped. Connect actors, soundtrack songs, or filming locations in Entity Studio.
              </p>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
                {relations.map((rel) => (
                  <div
                    key={rel.id}
                    style={{
                      padding: "10px 14px",
                      background: "var(--paper-soft)",
                      borderRadius: "var(--radius-sm)",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontSize: 13,
                    }}
                  >
                    <div>
                      <strong>{rel.related_title}</strong>
                      <div className="muted" style={{ fontSize: 11 }}>
                        {rel.relation_type} ({rel.related_type})
                      </div>
                    </div>
                    <span className="tag">{rel.related_type}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
