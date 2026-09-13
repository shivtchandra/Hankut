import Link from "next/link";
import { notFound } from "next/navigation";
import { createSupabaseAdmin } from "@/lib/supabase/admin";

export default async function DramaDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const db = await createSupabaseAdmin();

  const { data: drama } = await db
    .from("dramas")
    .select("id, title_kr, title_en, year, network, status, genres, aliases")
    .eq("id", id)
    .maybeSingle();

  if (!drama) notFound();

  const { data: scenes } = await db
    .from("scenes")
    .select("id, scene_code, episode, status")
    .eq("drama_id", id)
    .order("created_at", { ascending: false });

  return (
    <>
      <div className="admin-title">
        <div>
          <div className="eyebrow">DRAMA</div>
          <h1>{drama.title_kr}</h1>
          <p className="muted">{drama.title_en}</p>
        </div>
        <Link className="primary" href="/admin/scenes">
          + Add scene
        </Link>
      </div>

      <div className="admin-grid" style={{ marginBottom: 28 }}>
        <div className="metric">
          <span className="muted">Year</span>
          <b>{drama.year ?? "—"}</b>
        </div>
        <div className="metric">
          <span className="muted">Network</span>
          <b>{drama.network ?? "—"}</b>
        </div>
        <div className="metric">
          <span className="muted">Status</span>
          <b>{drama.status}</b>
        </div>
        <div className="metric">
          <span className="muted">Scenes</span>
          <b>{scenes?.length ?? 0}</b>
        </div>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Scene</th>
            <th>Episode</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {(scenes ?? []).map((scene) => (
            <tr key={scene.id}>
              <td>{scene.scene_code}</td>
              <td>{scene.episode ?? "—"}</td>
              <td>
                <span className="tag">{scene.status}</span>
              </td>
              <td>
                <Link href={`/admin/scenes/${scene.id}`}>Studio</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
