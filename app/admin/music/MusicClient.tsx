"use client";

import { useState, useRef } from "react";

type MusicRow = {
  id: string;
  titleKr: string;
  titleEn: string;
  status: string;
  metadata: Record<string, unknown>;
};

async function uploadAudio(file: File): Promise<string | null> {
  const res = await fetch("/api/uploads/media", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contentType: file.type || "audio/mpeg", fileName: file.name, folder: "audio" }),
  });
  if (!res.ok) {
    alert("Upload URL failed: " + (await res.text()));
    return null;
  }
  const { signedUrl, publicUrl } = await res.json();
  const put = await fetch(signedUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type || "audio/mpeg", "Content-Length": String(file.size) },
    body: file,
  });
  if (!put.ok) { alert("Upload failed"); return null; }
  return publicUrl;
}

export function MusicClient({ initial }: { initial: MusicRow[] }) {
  const [rows, setRows] = useState<MusicRow[]>(initial);
  const [saving, setSaving] = useState(false);
  const [audioUrl, setAudioUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const audioRef = useRef<HTMLInputElement>(null);

  const form = {
    titleKr: useRef<HTMLInputElement>(null),
    titleEn: useRef<HTMLInputElement>(null),
    artist: useRef<HTMLInputElement>(null),
    album: useRef<HTMLInputElement>(null),
    year: useRef<HTMLInputElement>(null),
    drama: useRef<HTMLInputElement>(null),
  };

  async function handleAudio(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const url = await uploadAudio(file);
    if (url) setAudioUrl(url);
    setUploading(false);
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const titleKr = form.titleKr.current?.value.trim() ?? "";
    if (!titleKr) return;
    setSaving(true);
    const res = await fetch("/api/admin/entities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "song",
        titleKr,
        titleEn: form.titleEn.current?.value.trim() || titleKr,
        aliases: [],
        metadata: {
          artist: form.artist.current?.value.trim(),
          album: form.album.current?.value.trim(),
          year: Number(form.year.current?.value),
          dramaTitle: form.drama.current?.value.trim(),
          audioUrl,
        },
      }),
    });
    setSaving(false);
    if (!res.ok) { alert("Save failed"); return; }
    const { entity } = await res.json();
    setRows((prev) => [entity, ...prev]);
    setAudioUrl("");
    (e.target as HTMLFormElement).reset();
  }

  return (
    <>
      <div className="admin-card" style={{ marginBottom: 28 }}>
        <h3 style={{ margin: "0 0 16px", fontSize: 13, fontFamily: "'DM Mono', monospace", letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--muted)" }}>
          Add Song / OST
        </h3>
        <form onSubmit={handleAdd} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <label style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 12, color: "var(--muted)" }}>
              Song Title (Korean) *
              <input ref={form.titleKr} required placeholder="그대라는 시" style={{ padding: "8px 10px", border: "1px solid var(--line)", borderRadius: "var(--radius-sm)", fontSize: 14 }} />
            </label>
            <label style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 12, color: "var(--muted)" }}>
              Song Title (English)
              <input ref={form.titleEn} placeholder="A Poem Called You" style={{ padding: "8px 10px", border: "1px solid var(--line)", borderRadius: "var(--radius-sm)", fontSize: 14 }} />
            </label>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 120px", gap: 10 }}>
            <label style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 12, color: "var(--muted)" }}>
              Artist
              <input ref={form.artist} placeholder="Taeyeon / 태연" style={{ padding: "8px 10px", border: "1px solid var(--line)", borderRadius: "var(--radius-sm)", fontSize: 14 }} />
            </label>
            <label style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 12, color: "var(--muted)" }}>
              Drama / Show (OST from)
              <input ref={form.drama} placeholder="Hotel Del Luna" style={{ padding: "8px 10px", border: "1px solid var(--line)", borderRadius: "var(--radius-sm)", fontSize: 14 }} />
            </label>
            <label style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 12, color: "var(--muted)" }}>
              Year
              <input ref={form.year} type="number" placeholder="2019" style={{ padding: "8px 10px", border: "1px solid var(--line)", borderRadius: "var(--radius-sm)", fontSize: 14 }} />
            </label>
          </div>

          {/* Audio upload */}
          <div style={{ padding: "16px", background: "var(--paper-soft)", borderRadius: "var(--radius-md)", border: "1px dashed var(--line-med)" }}>
            <p style={{ margin: "0 0 10px", fontSize: 12, color: "var(--muted)", fontFamily: "'DM Mono', monospace" }}>
              AUDIO FILE — Stored in Supabase Storage · Accepts MP3, OGG, AAC
            </p>
            <input ref={audioRef} type="file" accept="audio/*" onChange={handleAudio} style={{ fontSize: 13 }} />
            {uploading && <p style={{ marginTop: 8, fontSize: 12, color: "var(--muted)" }}>Uploading…</p>}
            {audioUrl && (
              <div style={{ marginTop: 10 }}>
                <p style={{ fontSize: 12, color: "var(--green)", marginBottom: 6 }}>✓ Audio uploaded</p>
                <audio controls src={audioUrl} style={{ width: "100%", height: 36 }} />
              </div>
            )}
          </div>

          <button type="submit" className="primary" disabled={saving} style={{ alignSelf: "flex-start" }}>
            {saving ? "Saving…" : "Save Song"}
          </button>
        </form>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Song</th>
            <th>Artist</th>
            <th>From Drama</th>
            <th>Audio</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr><td colSpan={5} style={{ textAlign: "center", color: "var(--muted)", padding: 28 }}>No songs yet — add one above.</td></tr>
          ) : rows.map((m) => (
            <tr key={m.id}>
              <td>
                <strong style={{ display: "block" }}>{m.titleKr}</strong>
                <span style={{ fontSize: 12, color: "var(--muted)", fontFamily: "'DM Mono', monospace" }}>{m.titleEn}</span>
              </td>
              <td style={{ fontSize: 13 }}>{m.metadata?.artist as string ?? "—"}</td>
              <td style={{ fontSize: 13 }}>{m.metadata?.dramaTitle as string ?? "—"}</td>
              <td>
                {m.metadata?.audioUrl
                  ? <audio controls src={m.metadata.audioUrl as string} style={{ height: 28, width: 160 }} />
                  : <span style={{ fontSize: 12, color: "var(--muted)" }}>No audio</span>}
              </td>
              <td><span className="tag">{m.status}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
