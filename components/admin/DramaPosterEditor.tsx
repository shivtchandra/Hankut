"use client";

import { useState, useTransition } from "react";
import { updateDramaPoster } from "@/app/admin/dramas/actions";
import { compressImageFile } from "@/lib/client/image-optimizer";

export function DramaPosterEditor({
  dramaId,
  initialUrl,
}: {
  dramaId: string;
  initialUrl?: string | null;
}) {
  const [pending, startTransition] = useTransition();
  const [url, setUrl] = useState(initialUrl ?? "");
  const [uploading, setUploading] = useState(false);
  const [notice, setNotice] = useState("");

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const rawFile = e.target.files?.[0];
    if (!rawFile) return;
    setUploading(true);
    setNotice("Compressing image…");

    try {
      // 1. Fast client-side WebP compression (10MB -> ~120KB in < 50ms)
      const file = await compressImageFile(rawFile, { maxDimension: 1200, quality: 0.82 });
      setNotice("Uploading optimized image…");

      const res = await fetch("/api/uploads/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileName: file.name, contentType: file.type || "image/webp", folder: "images" }),
      });
      if (!res.ok) { setNotice("Upload failed: " + (await res.text())); return; }
      const { signedUrl, publicUrl } = await res.json();

      const put = await fetch(signedUrl, { method: "PUT", headers: { "Content-Type": file.type || "image/webp" }, body: file });
      if (!put.ok) { setNotice("Upload failed"); return; }

      setUrl(publicUrl);
      setNotice("Uploaded! Click Save to confirm.");
    } catch (err) {
      setNotice("Upload error: " + (err instanceof Error ? err.message : "Failed"));
    } finally {
      setUploading(false);
    }
  }

  function save() {
    startTransition(async () => {
      await updateDramaPoster(dramaId, url);
      setNotice("Saved.");
    });
  }

  return (
    <div style={{ marginBottom: 28 }}>
      <div className="eyebrow" style={{ marginBottom: 10 }}>POSTER IMAGE</div>

      {url && (
        <img
          src={url}
          alt="Drama poster"
          style={{
            display: "block",
            width: 140,
            height: 200,
            objectFit: "cover",
            borderRadius: 6,
            marginBottom: 12,
            border: "1px solid var(--border)",
          }}
        />
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 8, maxWidth: 420 }}>
        <input
          type="text"
          placeholder="Paste image URL…"
          value={url}
          onChange={(e) => { setUrl(e.target.value); setNotice(""); }}
          style={{ width: "100%", padding: "6px 10px", background: "var(--paper)", color: "var(--ink)", border: "1px solid var(--border)", borderRadius: 4 }}
        />

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <label style={{ cursor: uploading ? "default" : "pointer", opacity: uploading ? 0.5 : 1 }}>
            <span className="secondary" style={{ display: "inline-block", padding: "6px 14px", cursor: "inherit" }}>
              {uploading ? "Uploading…" : "Upload file"}
            </span>
            <input type="file" accept="image/*" hidden disabled={uploading} onChange={handleFile} />
          </label>

          <button
            className="primary"
            onClick={save}
            disabled={pending || !url}
            style={{ padding: "6px 16px" }}
          >
            {pending ? "Saving…" : "Save"}
          </button>

          {url && (
            <button
              className="secondary"
              onClick={() => { setUrl(""); setNotice(""); }}
              style={{ padding: "6px 14px" }}
            >
              Clear
            </button>
          )}
        </div>

        {notice && <p className="muted" style={{ margin: 0 }}>{notice}</p>}
      </div>
    </div>
  );
}
