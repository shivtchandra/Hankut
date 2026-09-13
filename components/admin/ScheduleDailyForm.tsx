"use client";

import { useState, useTransition } from "react";
import { scheduleDailyGame } from "@/app/admin/daily/actions";

export function ScheduleDailyForm({
  scenes,
}: {
  scenes: { id: string; label: string }[];
}) {
  const [pending, startTransition] = useTransition();
  const [gameDate, setGameDate] = useState("");
  const [sceneId, setSceneId] = useState(scenes[0]?.id ?? "");
  const [status, setStatus] = useState<"draft" | "scheduled" | "published">(
    "scheduled",
  );
  const [msg, setMsg] = useState("");

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    startTransition(async () => {
      try {
        await scheduleDailyGame({ gameDate, sceneId, status });
        setMsg("Scheduled.");
      } catch (error) {
        setMsg(error instanceof Error ? error.message : "Failed");
      }
    });
  }

  return (
    <form className="form-grid" onSubmit={onSubmit}>
      <div className="field">
        <label>Date (Seoul)</label>
        <input
          type="date"
          value={gameDate}
          onChange={(e) => setGameDate(e.target.value)}
          required
        />
      </div>
      <div className="field">
        <label>Scene</label>
        <select
          value={sceneId}
          onChange={(e) => setSceneId(e.target.value)}
          required
        >
          {scenes.map((scene) => (
            <option key={scene.id} value={scene.id}>
              {scene.label}
            </option>
          ))}
        </select>
      </div>
      <div className="field">
        <label>Status</label>
        <select
          value={status}
          onChange={(e) =>
            setStatus(e.target.value as "draft" | "scheduled" | "published")
          }
        >
          <option value="draft">draft</option>
          <option value="scheduled">scheduled</option>
          <option value="published">published</option>
        </select>
      </div>
      <div className="full">
        <button className="primary" type="submit" disabled={pending || !sceneId}>
          {pending ? "Saving…" : "Schedule puzzle"}
        </button>
        {msg && <p className="game-notice">{msg}</p>}
      </div>
    </form>
  );
}
