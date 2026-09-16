"use client";

import { useRef, useState } from "react";
import { saveSongPuzzle, type SavedSongPuzzle } from "@/app/admin/audio/actions";

const DEFAULT_SEGMENTS = [3, 6, 12, 20, 30];

type Props = {
  initial: SavedSongPuzzle | null;
  defaultGameDate: string;
};

const cardStyle = { padding: "16px 20px" } as const;
const labelStyle = {
  fontWeight: 600,
  fontSize: 13,
  display: "block",
  marginBottom: 8,
} as const;
const inputStyle = {
  width: "100%",
  padding: "8px 12px",
  borderRadius: "var(--radius-sm)",
  border: "1px solid var(--line)",
  fontSize: 14,
} as const;

function formatSeconds(value: number): string {
  const minutes = Math.floor(value / 60);
  const seconds = (value % 60).toFixed(1).padStart(4, "0");
  return `${minutes}:${seconds}`;
}

export function AudioStudio({ initial, defaultGameDate }: Props) {
  const [puzzleId, setPuzzleId] = useState(initial?.puzzleId ?? "");
  const [titleKr, setTitleKr] = useState(initial?.titleKr ?? "");
  const [titleEn, setTitleEn] = useState(initial?.titleEn ?? "");
  const [artistKr, setArtistKr] = useState(initial?.artistKr ?? "");
  const [artistEn, setArtistEn] = useState(initial?.artistEn ?? "");
  const [drama, setDrama] = useState(initial?.dramaTitle ?? "");
  const [aliases, setAliases] = useState((initial?.aliases ?? []).join(", "));
  const [gameDate, setGameDate] = useState(initial?.gameDate ?? defaultGameDate);
  const [audioUrl, setAudioUrl] = useState(initial?.audioUrl ?? "");
  const [startSeconds, setStartSeconds] = useState(initial?.startSeconds ?? 0);
  const [segments, setSegments] = useState<number[]>(
    initial?.segments ?? DEFAULT_SEGMENTS,
  );

  const [duration, setDuration] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const audioRef = useRef<HTMLAudioElement>(null);
  const previewTimer = useRef<number | null>(null);

  async function handleFile(file: File) {
    setUploading(true);
    setNotice("Uploading…");
    setErrors([]);
    try {
      const res = await fetch("/api/uploads/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contentType: file.type,
          fileName: file.name,
          folder: "audio",
        }),
      });
      if (!res.ok) {
        setErrors(["Upload authorisation failed."]);
        setNotice("");
        return;
      }
      const { signedUrl, publicUrl } = await res.json();
      const put = await fetch(signedUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });
      if (!put.ok) {
        setErrors(["Upload failed."]);
        setNotice("");
        return;
      }
      setAudioUrl(publicUrl);
      setStartSeconds(0);
      setNotice("Audio uploaded. Set the start point, then save.");
    } finally {
      setUploading(false);
    }
  }

  /** Plays exactly what clip 1 will sound like to the player. */
  function previewFromStart(seconds = segments[0]) {
    const audio = audioRef.current;
    if (!audio) return;
    if (previewTimer.current) window.clearTimeout(previewTimer.current);
    audio.currentTime = startSeconds;
    void audio.play().catch(() => {});
    previewTimer.current = window.setTimeout(() => audio.pause(), seconds * 1000);
  }

  async function save(publish: boolean) {
    setSaving(true);
    setErrors([]);
    setNotice("");

    const result = await saveSongPuzzle({
      puzzleId: puzzleId || null,
      titleKr,
      titleEn,
      artistKr,
      artistEn,
      dramaTitle: drama,
      audioUrl,
      startSeconds,
      segments,
      aliases: aliases
        .split(",")
        .map((a) => a.trim())
        .filter(Boolean),
      gameDate: gameDate || null,
      publish,
    });

    setSaving(false);

    if (!result.ok) {
      setErrors(result.errors);
      return;
    }

    setPuzzleId(result.puzzle.puzzleId);
    setNotice(
      publish
        ? result.scheduled
          ? `Published and scheduled for ${result.puzzle.gameDate}.`
          : "Published. Add a game date to schedule it."
        : "Draft saved.",
    );
  }

  const maxStart = duration > 0 ? Math.max(duration - segments[0], 0) : 0;

  return (
    <div>
      <div className="admin-title">
        <div>
          <div className="eyebrow">AUDIO STUDIO</div>
          <h1>Song Puzzle</h1>
          <p className="muted">
            Upload one clip, pick where it starts — players hear{" "}
            {segments.join(" / ")}s as they miss.
          </p>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <button
            className="secondary"
            type="button"
            onClick={() => void save(false)}
            disabled={saving || uploading}
          >
            Save draft
          </button>
          <button
            className="primary"
            type="button"
            onClick={() => void save(true)}
            disabled={saving || uploading}
          >
            {saving ? "Saving…" : "Save & Publish"}
          </button>
        </div>
      </div>

      {notice && (
        <div
          style={{
            padding: "10px 14px",
            borderRadius: "var(--radius-md)",
            marginBottom: 16,
            background: "var(--paper-soft)",
            fontSize: 13,
            color: "var(--muted)",
          }}
        >
          {notice}
        </div>
      )}

      {errors.length > 0 && (
        <div
          style={{
            background: "#fef2f2",
            border: "1px solid #fca5a5",
            padding: "14px 16px",
            borderRadius: "var(--radius-md)",
            marginBottom: 16,
          }}
        >
          <strong style={{ color: "#dc2626", fontSize: 13 }}>
            Fix these first
          </strong>
          <ul style={{ margin: "8px 0 0", paddingLeft: 20, color: "#b91c1c", fontSize: 13 }}>
            {errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 640 }}>
        <div className="admin-card" style={cardStyle}>
          <label style={labelStyle}>The answer</label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <input
              value={titleKr}
              onChange={(e) => setTitleKr(e.target.value)}
              placeholder="Song title (KR) — e.g. 그대라는 시"
              style={inputStyle}
            />
            <input
              value={titleEn}
              onChange={(e) => setTitleEn(e.target.value)}
              placeholder="Song title (EN, optional)"
              style={inputStyle}
            />
            <input
              value={artistKr}
              onChange={(e) => setArtistKr(e.target.value)}
              placeholder="Artist (KR) — e.g. 태연"
              style={inputStyle}
            />
            <input
              value={artistEn}
              onChange={(e) => setArtistEn(e.target.value)}
              placeholder="Artist (EN, optional)"
              style={inputStyle}
            />
          </div>
          <p style={{ fontSize: 11, color: "var(--muted)", margin: "8px 0 0" }}>
            Title and artist are both accepted as correct guesses.
          </p>
        </div>

        <div className="admin-card" style={cardStyle}>
          <label style={labelStyle}>Drama / Movie</label>
          <input
            value={drama}
            onChange={(e) => setDrama(e.target.value)}
            placeholder="e.g. 호텔 델루나"
            style={inputStyle}
          />
          <label style={{ ...labelStyle, marginTop: 14 }}>
            Extra accepted spellings
          </label>
          <input
            value={aliases}
            onChange={(e) => setAliases(e.target.value)}
            placeholder="Comma separated — 그대라는시, 호텔 델루나 ost"
            style={inputStyle}
          />
        </div>

        <div className="admin-card" style={cardStyle}>
          <label style={labelStyle}>Audio File</label>
          <label
            style={{
              display: "inline-block",
              padding: "8px 16px",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--line)",
              fontSize: 13,
              cursor: uploading ? "default" : "pointer",
              background: uploading ? "var(--paper-soft)" : "var(--paper)",
              color: uploading ? "var(--muted)" : "var(--ink)",
            }}
          >
            {uploading ? "Uploading…" : audioUrl ? "Replace audio" : "Upload audio"}
            <input
              type="file"
              accept="audio/*"
              hidden
              disabled={uploading}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void handleFile(file);
              }}
            />
          </label>

          {audioUrl && (
            <>
              <span style={{ marginLeft: 10, fontSize: 11, color: "var(--green)" }}>
                ✓ Uploaded
              </span>
              <audio
                ref={audioRef}
                src={audioUrl}
                controls
                preload="metadata"
                onLoadedMetadata={(e) =>
                  setDuration(e.currentTarget.duration || 0)
                }
                style={{ display: "block", marginTop: 12, width: "100%" }}
              />

              <div style={{ marginTop: 16 }}>
                <label style={labelStyle}>
                  Start point — {formatSeconds(startSeconds)}
                </label>
                <input
                  type="range"
                  min={0}
                  max={maxStart || 0}
                  step={0.5}
                  value={Math.min(startSeconds, maxStart || 0)}
                  onChange={(e) => setStartSeconds(Number(e.target.value))}
                  disabled={duration === 0}
                  style={{ width: "100%" }}
                />
                <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 8 }}>
                  <button
                    type="button"
                    className="secondary"
                    onClick={() => previewFromStart()}
                    disabled={duration === 0}
                  >
                    ▶ Hear clip 1 ({segments[0]}s)
                  </button>
                  <button
                    type="button"
                    className="secondary"
                    onClick={() => {
                      const audio = audioRef.current;
                      if (audio) setStartSeconds(Math.round(audio.currentTime * 10) / 10);
                    }}
                    disabled={duration === 0}
                  >
                    Use current playhead
                  </button>
                  <span style={{ fontSize: 11, color: "var(--muted)" }}>
                    {duration > 0
                      ? `Clip length ${formatSeconds(duration)}`
                      : "Reading clip length…"}
                  </span>
                </div>
                <p style={{ fontSize: 11, color: "var(--muted)", margin: "8px 0 0" }}>
                  Every reveal plays from here — land it on the hook, not the intro.
                </p>
              </div>
            </>
          )}
        </div>

        <div className="admin-card" style={cardStyle}>
          <p style={{ fontWeight: 600, fontSize: 13, margin: "0 0 12px" }}>
            5 Reveal Clips
          </p>
          <div style={{ display: "flex", gap: 8 }}>
            {segments.map((seconds, index) => (
              <div
                key={index}
                style={{
                  flex: 1,
                  textAlign: "center",
                  padding: "10px 6px",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--line)",
                  background: "var(--paper-soft)",
                }}
              >
                <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 4 }}>
                  Clue {index + 1}
                </div>
                <input
                  type="number"
                  min={1}
                  value={seconds}
                  onChange={(e) => {
                    const next = [...segments];
                    next[index] = Number(e.target.value);
                    setSegments(next);
                  }}
                  style={{
                    width: "100%",
                    textAlign: "center",
                    border: "none",
                    background: "transparent",
                    fontSize: 16,
                    fontWeight: 700,
                    fontFamily: "'DM Mono', monospace",
                  }}
                />
              </div>
            ))}
          </div>
          <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 10 }}>
            Player hears {segments[0]}s first. Each wrong guess reveals the next
            clip.
          </p>
        </div>

        <div className="admin-card" style={cardStyle}>
          <label style={labelStyle}>Game date</label>
          <input
            type="date"
            value={gameDate}
            onChange={(e) => setGameDate(e.target.value)}
            style={{ ...inputStyle, maxWidth: 200 }}
          />
          <p style={{ fontSize: 11, color: "var(--muted)", margin: "8px 0 0" }}>
            Publishing puts this song in that date&apos;s Today&apos;s 5, replacing
            any song already scheduled then.
          </p>
        </div>
      </div>
    </div>
  );
}
