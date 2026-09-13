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
  const [pending, startTransition] = useTransition();
  const [dramaId, setDramaId] = useState(dramas[0]?.id ?? "");
  const [episode, setEpisode] = useState(1);
  const [msg, setMsg] = useState("");

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!dramaId) {
      setMsg("Save a drama first.");
      return;
    }

    startTransition(async () => {
      try {
        const scene = await createScene({
          dramaId,
          episode,
          difficulty: 5,
          recognitionScore: 5,
        });
        router.push(`/admin/scenes/${scene.id}`);
      } catch (error) {
        setMsg(error instanceof Error ? error.message : "Create failed");
      }
    });
  }

  return (
    <form className="form-grid" onSubmit={onSubmit}>
      <div className="field">
        <label>Drama</label>
        <select value={dramaId} onChange={(e) => setDramaId(e.target.value)}>
          {dramas.length === 0 ? (
            <option value="">No dramas</option>
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
      <div className="full">
        <button className="primary" type="submit" disabled={pending || !dramaId}>
          {pending ? "Creating…" : "Create scene → Studio"}
        </button>
        {msg && <p className="game-notice">{msg}</p>}
      </div>
    </form>
  );
}
