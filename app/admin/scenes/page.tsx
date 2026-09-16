import Link from "next/link";
import { listScenes } from "./actions";
import { CreateSceneForm } from "@/components/admin/CreateSceneForm";
import { listDramas } from "../dramas/actions";

export default async function ScenesPage() {
  let scenes: Awaited<ReturnType<typeof listScenes>> = [];
  let dramas: Awaited<ReturnType<typeof listDramas>> = [];

  try {
    [scenes, dramas] = await Promise.all([listScenes(), listDramas()]);
  } catch {
    scenes = [];
    dramas = [];
  }

  const readyScenes = scenes.filter((s: any) => (s.assets?.length ?? 0) >= 5);

  return (
    <>
      <div className="admin-title">
        <div>
          <div className="eyebrow">SCENE PUZZLES</div>
          <h1>Scenes Studio</h1>
          <p className="muted">
            {scenes.length} scene puzzles registered · {readyScenes.length} ready for publish (5/5 frames).
          </p>
        </div>
      </div>

      <CreateSceneForm
        dramas={dramas.map((d) => ({
          id: d.id,
          titleKr: d.title_kr,
        }))}
      />

      <div className="admin-grid" style={{ marginTop: 24, marginBottom: 24, gridTemplateColumns: "repeat(3, 1fr)" }}>
        <div className="metric">
          <span className="muted">Total Scenes</span>
          <b>{scenes.length}</b>
        </div>
        <div className="metric">
          <span className="muted">Ready for Daily (5/5 frames)</span>
          <b style={{ color: "var(--green)" }}>{readyScenes.length}</b>
        </div>
        <div className="metric">
          <span className="muted">Incomplete Frame Uploads</span>
          <b style={{ color: scenes.length - readyScenes.length > 0 ? "#b45309" : "inherit" }}>
            {scenes.length - readyScenes.length}
          </b>
        </div>
      </div>

      <table className="admin-table" style={{ marginTop: 16 }}>
        <thead>
          <tr>
            <th>Scene Code</th>
            <th>Drama</th>
            <th>Episode</th>
            <th>Frame Progress</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {scenes.length === 0 ? (
            <tr>
              <td colSpan={6} className="muted">
                No scenes yet. Create one above after saving a drama.
              </td>
            </tr>
          ) : (
            scenes.map((scene: any) => {
              const drama = Array.isArray(scene.drama)
                ? scene.drama[0]
                : scene.drama;
              const frameCount = scene.assets?.length ?? 0;
              const isReady = frameCount >= 5;

              return (
                <tr key={scene.id}>
                  <td>
                    <b>{scene.scene_code}</b>
                  </td>
                  <td>
                    <strong>{drama?.title_kr ?? "—"}</strong>
                    <div className="muted" style={{ fontSize: 11 }}>{drama?.title_en}</div>
                  </td>
                  <td>Ep {scene.episode ?? "—"}</td>
                  <td>
                    <span
                      className="tag"
                      style={{
                        background: isReady ? "#f0fdf4" : "#fffbebe",
                        color: isReady ? "#166534" : "#b45309",
                        fontWeight: 600,
                      }}
                    >
                      {frameCount} / 5 frames {isReady ? "✓ Ready" : "⚠️ Incomplete"}
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
            })
          )}
        </tbody>
      </table>
    </>
  );
}
