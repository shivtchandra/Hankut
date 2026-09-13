"use client";

import { useMemo, useState, useTransition } from "react";
import {
  attachSceneAsset,
  saveClues,
  updateSceneMeta,
} from "@/app/admin/scenes/actions";

type Asset = {
  id: string;
  public_url: string | null;
  frame_order: number;
  asset_key: string;
};

type ClueRow = {
  id?: string;
  type: string;
  value: string;
  unlock_after: number;
  clue_order: number;
};

type Props = {
  scene: {
    id: string;
    episode: number | null;
    difficulty: number | null;
    recognition_score: number | null;
    description: string | null;
    status: string;
    rights_status: string;
    scene_code: string;
    drama: { id: string; title_kr: string; title_en: string } | null;
    assets: Asset[] | null;
    clues: ClueRow[] | null;
  };
};

export function SceneStudio({ scene }: Props) {
  const [pending, startTransition] = useTransition();
  const [activeFrame, setActiveFrame] = useState(1);
  const [episode, setEpisode] = useState(scene.episode ?? 1);
  const [difficulty, setDifficulty] = useState(scene.difficulty ?? 5);
  const [recognition, setRecognition] = useState(
    Math.round((scene.recognition_score ?? 0.5) * 10),
  );
  const [description, setDescription] = useState(scene.description ?? "");
  const [notice, setNotice] = useState("");
  const [assets, setAssets] = useState<Asset[]>(scene.assets ?? []);
  const [clues, setClues] = useState<ClueRow[]>(
    scene.clues?.length
      ? [...scene.clues].sort((a, b) => a.clue_order - b.clue_order)
      : [
          { type: "year", value: "", unlock_after: 1, clue_order: 1 },
          { type: "platform", value: "", unlock_after: 2, clue_order: 2 },
          { type: "location", value: "", unlock_after: 3, clue_order: 3 },
        ],
  );

  const frameMap = useMemo(() => {
    const map = new Map<number, Asset>();
    for (const asset of assets) map.set(asset.frame_order, asset);
    return map;
  }, [assets]);

  const current = frameMap.get(activeFrame);

  async function onUpload(file: File) {
    setNotice("Uploading…");
    const presign = await fetch("/api/uploads/presign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contentType: file.type,
        fileName: file.name,
      }),
    });

    if (!presign.ok) {
      setNotice("Upload authorization failed.");
      return;
    }

    const { uploadUrl, publicUrl, objectKey } = await presign.json();

    const put = await fetch(uploadUrl, {
      method: "PUT",
      headers: { "Content-Type": file.type },
      body: file,
    });

    if (!put.ok) {
      setNotice("R2 upload failed.");
      return;
    }

    startTransition(async () => {
      const row = await attachSceneAsset({
        sceneId: scene.id,
        publicUrl: publicUrl ?? "",
        storageKey: objectKey,
        position: activeFrame,
        mimeType: file.type,
      });

      setAssets((prev) => {
        const next = prev.filter((item) => item.frame_order !== activeFrame);
        return [
          ...next,
          {
            id: row.id,
            public_url: row.public_url,
            frame_order: row.frame_order,
            asset_key: row.asset_key,
          },
        ];
      });
      setNotice(`Frame ${activeFrame} saved.`);
    });
  }

  function saveDraft() {
    startTransition(async () => {
      await updateSceneMeta({
        sceneId: scene.id,
        episode,
        difficulty,
        recognitionScore: recognition,
        description,
        status: "draft",
      });
      await saveClues({
        sceneId: scene.id,
        clues: clues
          .filter((clue) => clue.type.trim() && clue.value.trim())
          .map((clue, index) => ({
            type: clue.type,
            value: clue.value,
            unlockAfter: clue.unlock_after,
            order: index + 1,
          })),
      });
      setNotice("Draft saved.");
    });
  }

  return (
    <div>
      <div className="admin-title">
        <div>
          <div className="eyebrow">SCENE STUDIO</div>
          <h1>{scene.drama?.title_kr ?? "Untitled drama"}</h1>
          <p className="muted">
            {scene.scene_code} · {scene.status} · rights {scene.rights_status}
          </p>
        </div>
        <button className="primary" type="button" onClick={saveDraft} disabled={pending}>
          Save draft
        </button>
      </div>

      {notice && <p className="game-notice">{notice}</p>}

      <div className="studio">
        <div>
          <div className={current?.public_url ? "studio-frame" : "studio-frame empty"}>
            {current?.public_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={current.public_url} alt={`Frame ${activeFrame}`} />
            ) : (
              <span>FRAME {String(activeFrame).padStart(2, "0")}</span>
            )}
          </div>

          <div className="studio-dots">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                className={[
                  "studio-dot",
                  n === activeFrame ? "active" : "",
                  frameMap.has(n) ? "filled" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() => setActiveFrame(n)}
                aria-label={`Frame ${n}`}
              />
            ))}
          </div>

          <label className="upload-zone">
            Drop frame here or click to upload
            <input
              type="file"
              accept="image/webp,image/jpeg,image/png"
              hidden
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) void onUpload(file);
              }}
            />
          </label>

          <div className="clue-ladder">
            <h3>CLUE LADDER</h3>
            {clues.map((clue, index) => (
              <div className="clue-item" key={index}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <input
                  value={clue.type}
                  onChange={(event) => {
                    const next = [...clues];
                    next[index] = { ...clue, type: event.target.value };
                    setClues(next);
                  }}
                  placeholder="type"
                />
                <input
                  value={clue.value}
                  onChange={(event) => {
                    const next = [...clues];
                    next[index] = { ...clue, value: event.target.value };
                    setClues(next);
                  }}
                  placeholder="value"
                />
                <input
                  type="number"
                  min={1}
                  max={5}
                  value={clue.unlock_after}
                  onChange={(event) => {
                    const next = [...clues];
                    next[index] = {
                      ...clue,
                      unlock_after: Number(event.target.value),
                    };
                    setClues(next);
                  }}
                  style={{ width: 64 }}
                />
              </div>
            ))}
            <button
              type="button"
              className="secondary"
              style={{
                marginTop: 14,
                borderColor: "var(--line)",
                color: "var(--ink)",
              }}
              onClick={() =>
                setClues((prev) => [
                  ...prev,
                  {
                    type: "",
                    value: "",
                    unlock_after: Math.min(prev.length + 1, 5),
                    clue_order: prev.length + 1,
                  },
                ])
              }
            >
              + Add clue
            </button>
          </div>
        </div>

        <aside className="studio-panel">
          <h3>SCENE</h3>

          <div className="field" style={{ marginBottom: 16 }}>
            <label>Episode</label>
            <input
              type="number"
              min={1}
              value={episode}
              onChange={(event) => setEpisode(Number(event.target.value))}
            />
          </div>

          <div className="range-field">
            <label className="eyebrow">Difficulty · {difficulty.toFixed(1)}</label>
            <input
              type="range"
              min={0}
              max={10}
              step={0.1}
              value={difficulty}
              onChange={(event) => setDifficulty(Number(event.target.value))}
            />
          </div>

          <div className="range-field">
            <label className="eyebrow">Recognition · {recognition}</label>
            <input
              type="range"
              min={0}
              max={10}
              step={1}
              value={recognition}
              onChange={(event) => setRecognition(Number(event.target.value))}
            />
          </div>

          <div className="field">
            <label>Notes</label>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </div>
        </aside>
      </div>
    </div>
  );
}
