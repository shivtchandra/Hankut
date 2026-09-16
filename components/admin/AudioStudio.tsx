"use client";

import { useRef, useState } from "react";

const CLIP_DURATIONS = [3, 6, 12, 20, 30];

export function AudioStudio() {
  const [audioUrl, setAudioUrl] = useState("");
  const [drama, setDrama] = useState("");
  const [uploading, setUploading] = useState(false);
  const [notice, setNotice] = useState("");
  const audioRef = useRef<HTMLAudioElement>(null);

  async function handleFile(file: File) {
    setUploading(true);
    setNotice("Uploading…");
    const res = await fetch("/api/uploads/media", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contentType: file.type, fileName: file.name, folder: "audio" }),
    });
    if (!res.ok) { setNotice("Upload auth failed."); setUploading(false); return; }
    const { signedUrl, publicUrl } = await res.json();
    const put = await fetch(signedUrl, { method: "PUT", headers: { "Content-Type": file.type }, body: file });
    if (!put.ok) { setNotice("Upload failed."); setUploading(false); return; }
    setAudioUrl(publicUrl);
    setNotice("Audio uploaded.");
    setUploading(false);
  }

  async function handleSave() {
    if (!audioUrl || !drama.trim()) { setNotice("Add audio and drama name first."); return; }
    setNotice("Saved.");
  }

  return (
    <div>
      <div className="admin-title">
        <div>
          <div className="eyebrow">AUDIO STUDIO</div>
          <h1>Song Puzzle</h1>
          <p className="muted">Upload one audio file — 5 clips auto-cut at 3 / 6 / 12 / 20 / 30s</p>
        </div>
        <button className="primary" type="button" onClick={handleSave} disabled={!audioUrl || !drama.trim()}>
          Save &amp; Publish
        </button>
      </div>

      {notice && (
        <div style={{ padding: "10px 14px", borderRadius: "var(--radius-md)", marginBottom: 16, background: "var(--paper-soft)", fontSize: 13, color: "var(--muted)" }}>
          {notice}
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 600 }}>

        {/* Drama name */}
        <div className="admin-card" style={{ padding: "16px 20px" }}>
          <label style={{ fontWeight: 600, fontSize: 13, display: "block", marginBottom: 8 }}>Drama / Movie</label>
          <input
            value={drama}
            onChange={(e) => setDrama(e.target.value)}
            placeholder="e.g. 호텔 델루나"
            style={{ width: "100%", padding: "8px 12px", borderRadius: "var(--radius-sm)", border: "1px solid var(--line)", fontSize: 14 }}
          />
        </div>

        {/* Audio upload */}
        <div className="admin-card" style={{ padding: "16px 20px" }}>
          <label style={{ fontWeight: 600, fontSize: 13, display: "block", marginBottom: 8 }}>Audio File</label>
          <label style={{
            display: "inline-block", padding: "8px 16px", borderRadius: "var(--radius-sm)",
            border: "1px solid var(--line)", fontSize: 13, cursor: "pointer",
            background: uploading ? "var(--paper-soft)" : "var(--paper)",
            color: uploading ? "var(--muted)" : "var(--ink)",
          }}>
            {uploading ? "Uploading…" : audioUrl ? "Replace audio" : "Upload audio"}
            <input
              type="file" accept="audio/*" hidden disabled={uploading}
              onChange={(e) => { const f = e.target.files?.[0]; if (f) void handleFile(f); }}
            />
          </label>

          {audioUrl && (
            <>
              <span style={{ marginLeft: 10, fontSize: 11, color: "var(--green)" }}>✓ Uploaded</span>
              {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
              <audio ref={audioRef} src={audioUrl} controls style={{ display: "block", marginTop: 12, width: "100%" }} />
            </>
          )}
        </div>

        {/* Clip preview */}
        <div className="admin-card" style={{ padding: "16px 20px" }}>
          <p style={{ fontWeight: 600, fontSize: 13, margin: "0 0 12px" }}>5 Reveal Clips</p>
          <div style={{ display: "flex", gap: 8 }}>
            {CLIP_DURATIONS.map((sec, i) => (
              <div key={sec} style={{ flex: 1, textAlign: "center", padding: "10px 6px", borderRadius: "var(--radius-sm)", border: "1px solid var(--line)", background: "var(--paper-soft)" }}>
                <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 4 }}>Clue {i + 1}</div>
                <div style={{ fontSize: 16, fontWeight: 700, fontFamily: "'DM Mono', monospace" }}>{sec}s</div>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 10 }}>
            Player hears 3s first. Each wrong guess reveals the next clip.
          </p>
        </div>

      </div>
    </div>
  );
}
