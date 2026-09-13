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

  return (
    <>
      <div className="admin-title">
        <div>
          <div className="eyebrow">CONTENT</div>
          <h1>Scenes</h1>
          <p className="muted">Create a scene, then open Scene Studio to attach frames and clues.</p>
        </div>
      </div>

      <CreateSceneForm
        dramas={dramas.map((d) => ({
          id: d.id,
          titleKr: d.title_kr,
        }))}
      />

      <table className="admin-table" style={{ marginTop: 28 }}>
        <thead>
          <tr>
            <th>Scene</th>
            <th>Drama</th>
            <th>Episode</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {scenes.length === 0 ? (
            <tr>
              <td colSpan={5} className="muted">
                No scenes yet. Create one above after saving a drama.
              </td>
            </tr>
          ) : (
            scenes.map((scene) => {
              const drama = Array.isArray(scene.drama)
                ? scene.drama[0]
                : scene.drama;
              return (
                <tr key={scene.id}>
                  <td>
                    <b>{scene.scene_code}</b>
                  </td>
                  <td>{drama?.title_kr ?? "—"}</td>
                  <td>{scene.episode ?? "—"}</td>
                  <td>
                    <span className="tag">{scene.status}</span>
                  </td>
                  <td>
                    <Link href={`/admin/scenes/${scene.id}`}>Studio</Link>
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
