"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { attachSceneAsset, updateSceneMeta } from "@/app/admin/scenes/actions";
import { compressImageFile } from "@/lib/client/image-optimizer";

type Asset = {
  id: string;
  public_url: string | null;
  frame_order: number;
  asset_key: string;
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
    clues: unknown[] | null;
  };
};

const FRAME_HINTS = [
  "Tightest crop — hardest to guess",
  "Slightly wider",
  "Mid reveal",
  "Wide shot",
  "Clearest — easiest clue",
];

export function SceneStudio({ scene }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [notice, setNotice] = useState("");
  const [assets, setAssets] = useState<Asset[]>(scene.assets ?? []);
  const [uploading, setUploading] = useState<number | null>(null);

  const frameMap = useMemo(() => {
    const map = new Map<number, Asset>();
    for (const asset of assets) map.set(asset.frame_order, asset);
    return map;
  }, [assets]);

  async function onUpload(frameNum: number, rawFile: File) {
    setUploading(frameNum);
    setNotice("Compressing frame image…");

    try {
      const file = await compressImageFile(rawFile, { maxDimension: 1400, quality: 0.85 });
      setNotice("Uploading optimized frame…");

      const presign = await fetch("/api/uploads/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contentType: file.type || "image/webp", fileName: file.name, folder: "images" }),
      });

      if (!presign.ok) { setNotice("Upload auth failed."); setUploading(null); return; }

      const { signedUrl, path, publicUrl } = await presign.json();

      const put = await fetch(signedUrl, { method: "PUT", headers: { "Content-Type": file.type || "image/webp" }, body: file });
      if (!put.ok) { setNotice("Upload failed."); setUploading(null); return; }

      startTransition(async () => {
        const row = await attachSceneAsset({
          sceneId: scene.id,
          publicUrl: publicUrl ?? "",
          storageKey: path,
          position: frameNum,
          mimeType: file.type || "image/webp",
        });

        setAssets((prev) => {
          const next = prev.filter((a) => a.frame_order !== frameNum);
          return [...next, { id: row.id, public_url: row.public_url, frame_order: row.frame_order, asset_key: row.asset_key }];
        });
        setNotice(`Frame ${frameNum} saved.`);
        setUploading(null);
      });
    } catch (err) {
      setNotice("Frame upload error: " + (err instanceof Error ? err.message : "Failed"));
      setUploading(null);
    }
  }

  function saveDraft() {
    startTransition(async () => {
      await updateSceneMeta({ sceneId: scene.id, episode: scene.episode ?? 1, difficulty: 5, recognitionScore: 5, description: scene.description ?? "", status: "draft" });
      setNotice("Saved.");
    });
  }

  function publishScene() {
    router.push(`/admin/calendar?publishSceneId=${scene.id}`);
  }

  const filled = [1, 2, 3, 4, 5].filter((n) => frameMap.has(n)).length;

  return (
    <div>
      <div className="admin-title">
        <div>
          <div className="eyebrow">SCENE STUDIO</div>
          <h1>{scene.drama?.title_kr ?? "Untitled drama"}</h1>
          <p className="muted">
            {scene.scene_code} · {scene.status} · {filled}/5 frames uploaded
          </p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="secondary" type="button" onClick={saveDraft} disabled={pending}>
            Save draft
          </button>
          <button className="primary" type="button" onClick={publishScene} disabled={pending || filled < 5}>
            Publish to Calendar →
          </button>
        </div>
      </div>

      {notice && (
        <div style={{ padding: "10px 14px", borderRadius: "var(--radius-md)", marginBottom: 16, background: "var(--paper-soft)", fontSize: 13, color: "var(--muted)" }}>
          {notice}
        </div>
      )}

      <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 20 }}>
        Upload 5 screenshots of the same drama in order — tightest crop first, widest last. Players see one at a time and guess after each.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {[1, 2, 3, 4, 5].map((n) => {
          const asset = frameMap.get(n);
          const isUploading = uploading === n;
          return (
            <div key={n} className="admin-card" style={{ padding: "16px 20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <span style={{ fontSize: 20, fontWeight: 700, color: "var(--muted)", minWidth: 28, fontFamily: "'DM Mono', monospace" }}>
                  {String(n).padStart(2, "0")}
                </span>

                {asset?.public_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={asset.public_url}
                    alt={`Frame ${n}`}
                    style={{ width: 120, height: 68, objectFit: "cover", borderRadius: "var(--radius-sm)", flexShrink: 0 }}
                  />
                ) : (
                  <div style={{ width: 120, height: 68, background: "var(--paper-soft)", border: "1px dashed var(--line)", borderRadius: "var(--radius-sm)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ fontSize: 11, color: "var(--muted)" }}>No image</span>
                  </div>
                )}

                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 12, color: "var(--muted)", margin: "0 0 8px" }}>{FRAME_HINTS[n - 1]}</p>
                  <label style={{
                    display: "inline-block", padding: "7px 14px", borderRadius: "var(--radius-sm)",
                    border: "1px solid var(--line)", fontSize: 12, cursor: "pointer",
                    background: isUploading ? "var(--paper-soft)" : "var(--paper)",
                    color: isUploading ? "var(--muted)" : "var(--ink)",
                  }}>
                    {isUploading ? "Uploading…" : asset ? "Replace" : "Upload image"}
                    <input
                      type="file"
                      accept="image/webp,image/jpeg,image/png"
                      hidden
                      disabled={isUploading}
                      onChange={(e) => { const f = e.target.files?.[0]; if (f) void onUpload(n, f); }}
                    />
                  </label>
                  {asset && (
                    <span style={{ marginLeft: 10, fontSize: 11, color: "var(--green)" }}>✓ Uploaded</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filled < 5 && (
        <p style={{ marginTop: 16, fontSize: 12, color: "var(--muted)", fontStyle: "italic" }}>
          Upload all 5 frames to enable Publish.
        </p>
      )}
    </div>
  );
}
