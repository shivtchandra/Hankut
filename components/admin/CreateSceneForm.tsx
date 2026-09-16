"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { createScene } from "@/app/admin/scenes/actions";

export function CreateSceneForm({
  dramas,
}: {
  dramas: { id: string; titleKr: string }[];
}) {
  const router = useRouter();
  const todayDefault = new Date().toISOString().slice(0, 10);
  const [pending, startTransition] = useTransition();
  const [dramaId, setDramaId] = useState(dramas[0]?.id ?? "");
  const [episode, setEpisode] = useState(1);
  const [gameDate, setGameDate] = useState(todayDefault);
  const [msg, setMsg] = useState("");

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!dramaId) {
      setMsg("Save a drama first.");
      return;
    }

    startTransition(async () => {
      try {
        const sceneCode = `DC-${gameDate.replace(/-/g, "")}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
        const scene = await createScene({
          dramaId,
          episode,
          difficulty: 5,
          recognitionScore: 5,
          sceneCode,
        });
        router.push(`/admin/scenes/${scene.id}`);
      } catch (error) {
        setMsg(error instanceof Error ? error.message : "Create failed");
      }
    });
  }

  return (
    <div className="admin-card" style={{ marginBottom: 28, padding: 24 }}>
      <h3 style={{ margin: "0 0 16px", fontSize: 16 }}>Create New Scene Puzzle</h3>
      <form className="form-grid" onSubmit={onSubmit} style={{ boxShadow: "none", padding: 0, border: "none", marginBottom: 0 }}>
        <div className="field">
          <label>Drama</label>
          <select value={dramaId} onChange={(e) => setDramaId(e.target.value)}>
            {dramas.length === 0 ? (
              <option value="">No dramas added yet</option>
            ) : (
              dramas.map((drama) => (
                <option key={drama.id} value={drama.id}>
                  {drama.titleKr}
                </option>
              ))
            )}
          </select>
        </div>

        <div className="field">
          <label>Episode</label>
          <input
            type="number"
            min={1}
            value={episode}
            onChange={(e) => setEpisode(Number(e.target.value))}
          />
        </div>

        <div className="field">
          <label>Target Game Date</label>
          <input
            type="date"
            value={gameDate}
            onChange={(e) => setGameDate(e.target.value)}
          />
        </div>

        <div className="full" style={{ marginTop: 8 }}>
          <button className="primary" type="submit" disabled={pending || !dramaId}>
            {pending ? "Creating…" : "Create Scene → Open Studio"}
          </button>
          {msg && <p className="game-notice">{msg}</p>}
        </div>
      </form>
    </div>
  );
}
