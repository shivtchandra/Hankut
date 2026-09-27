"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { createSceneAndSchedule } from "@/app/admin/daily/actions";
import { quickCreateDrama } from "@/app/admin/dramas/actions";
import { saveSongPuzzle } from "@/app/admin/audio/actions";
import { normalize } from "@/lib/game/normalization";
import { extractChosung } from "@/lib/game/normalization";
import { compressImageFile } from "@/lib/client/image-optimizer";

import {
  IconScene,
  IconMusic,
  IconHangul,
  IconConnections,
  IconPeople,
} from "@/components/icons/Icons";

type Drama = { id: string; title_en: string; title_kr: string; aliases?: string[] | null };

type SpotifyLookup = {
  spotifyUrl: string;
  title: string;
  artist: string;
  cover: string | null;
  previews: { trackName: string; artistName: string; previewUrl: string; storeUrl: string }[];
};

type SongClip = { start: number; length: number };

/** Default bit lengths (seconds) for the 5 song clips; each clip has its own start. */
const DEFAULT_SONG_CLIPS: SongClip[] = [1, 2, 4, 7, 12].map((length) => ({ start: 0, length }));
const SONG_CLIP_POINTS = [25, 20, 15, 10, 5];
const SONG_CLIP_COLORS = ["#e11d48", "#f97316", "#eab308", "#22c55e", "#3b82f6"];

function formatClock(seconds: number) {
  const s = Math.max(seconds, 0);
  return `${Math.floor(s / 60)}:${(s % 60).toFixed(1).padStart(4, "0")}`;
}
type GameMode = "scene" | "song" | "chosung" | "connections" | "people";

function diffColor(d: number) {
  if (d >= 8) return "#dc2626";
  if (d >= 6) return "#f59e0b";
  return "#22c55e";
}

const SCENE_FRAME_LABELS = [
  "01 — tightest crop (Hardest)",
  "02 — closer crop",
  "03 — mid shot",
  "04 — wider shot",
  "05 — full scene (Easiest)",
];

const PEOPLE_FRAME_LABELS = [
  "01 — Silhouette / Shadow",
  "02 — Partial / Eye crop",
  "03 — Profile / Half face",
  "04 — Scene context photo",
  "05 — Full high-res photo",
];

const MODE_OPTIONS = [
  { id: "scene", label: "Scene (장면)", desc: "5 Screenshot Reveals", Icon: IconScene },
  { id: "song", label: "Song / OST (노래)", desc: "5 Audio Clips (1s–12s)", Icon: IconMusic },
  { id: "chosung", label: "Chosung (초성)", desc: "Consonants + 5 Clues", Icon: IconHangul },
  { id: "connections", label: "Connections (연결고리)", desc: "4 Groups of 4 Items", Icon: IconConnections },
  { id: "people", label: "People (누구지)", desc: "5 Silhouette Reveals", Icon: IconPeople },
];

export function TodaysFiveBuilder({ dramas, today }: { dramas: Drama[]; today?: string }) {
  const params = useSearchParams();
  const todayDefault = today ?? new Date().toLocaleString("sv-SE", { timeZone: "Asia/Seoul" }).slice(0, 10);
  const [targetDate, setTargetDate] = useState(params.get("date") ?? todayDefault);
  const [gameMode, setGameMode] = useState<GameMode>("scene");
  const [difficulty, setDifficulty] = useState(5);

  // Common metadata
  const [dramaQuery, setDramaQuery] = useState("");
  const [selectedDrama, setSelectedDrama] = useState<Drama | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [creatingDrama, setCreatingDrama] = useState(false);
  const [newDrama, setNewDrama] = useState<{
    titleEn: string;
    titleKr: string;
    altTitles: string;
    year: string;
  } | null>(null);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<{ type: "ok" | "err"; msg: string } | null>(null);

  // 1. Scene & People frames (5 image URLs)
  const [frames, setFrames] = useState<(string | null)[]>([null, null, null, null, null]);
  const [uploadingIdx, setUploadingIdx] = useState<number | null>(null);
  const bulkInputRef = useRef<HTMLInputElement | null>(null);

  // 2. Song state
  const [songTitle, setSongTitle] = useState("");
  const [artistName, setArtistName] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [spotifyInput, setSpotifyInput] = useState("");
  const [spotifyLookup, setSpotifyLookup] = useState<SpotifyLookup | null>(null);
  const [lookingUpSpotify, setLookingUpSpotify] = useState(false);
  const [songClips, setSongClips] = useState<SongClip[]>(DEFAULT_SONG_CLIPS);
  const [songTime, setSongTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const songAudioRef = useRef<HTMLAudioElement | null>(null);
  const songStopTimer = useRef<number | null>(null);
  const [uploadingAudio, setUploadingAudio] = useState(false);

  // 3. Chosung state
  const [chosungAnswer, setChosungAnswer] = useState("");
  const [chosungClues, setChosungClues] = useState<string[]>([
    "Category: Netflix Drama",
    "Year: 2021",
    "Director / Lead: Lee Jung-jae",
    "Key Quote: Red Light Green Light",
    "English Title Hint: Squid Game",
  ]);

  // 4. Connections state (4 groups of 4 items)
  const [connectionGroups, setConnectionGroups] = useState<
    Array<{ category: string; items: string[] }>
  >([
    { category: "K-Drama Hits", items: ["Goblin", "Crash Landing", "Itaewon", "Vincenzo"] },
    { category: "Cast Members", items: ["Gong Yoo", "Son Ye-jin", "Park Seo-joon", "Song Joong-ki"] },
    { category: "Filming Locations", items: ["Jeju", "Namsan Tower", "Han River", "Incheon"] },
    { category: "Iconic Foods", items: ["Ramyeon", "Soju", "Tteokbokki", "Fried Chicken"] },
  ]);

  useEffect(() => {
    const d = params.get("date");
    if (d) setTargetDate(d);
  }, [params]);

  const suggestions =
    dramaQuery.trim().length < 1
      ? []
      : dramas
          .filter((d) => {
            const q = normalize(dramaQuery);
            if (!q) return false;
            return [d.title_en, d.title_kr, ...(d.aliases ?? [])].some((t) => normalize(t).includes(q));
          })
          .slice(0, 8);

  function openNewDramaForm() {
    const name = dramaQuery.trim();
    if (!name) return;
    const isKorean = /[가-힣]/.test(name);
    setNewDrama({ titleEn: isKorean ? "" : name, titleKr: isKorean ? name : "", altTitles: "", year: "" });
    setShowSuggestions(false);
  }

  async function handleCreateDrama() {
    if (!newDrama) return;
    if (!newDrama.titleEn.trim() || !newDrama.titleKr.trim()) {
      setNotice({ type: "err", msg: "English and Korean titles are both required" });
      return;
    }
    setCreatingDrama(true);
    try {
      const year = Number(newDrama.year);
      const drama = await quickCreateDrama({
        titleEn: newDrama.titleEn,
        titleKr: newDrama.titleKr,
        altTitles: newDrama.altTitles.split(","),
        year: Number.isInteger(year) && year > 1900 ? year : null,
      });
      setSelectedDrama(drama);
      setNewDrama(null);
      setDramaQuery("");
      setShowSuggestions(false);
    } catch (e) {
      setNotice({ type: "err", msg: e instanceof Error ? e.message : "Failed to create drama" });
    } finally {
      setCreatingDrama(false);
    }
  }

  // Upload Image with instant client compression
  async function uploadImageFile(rawFile: File): Promise<string> {
    const file = await compressImageFile(rawFile, { maxDimension: 1400, quality: 0.85 });
    const res = await fetch("/api/uploads/media", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fileName: file.name, contentType: file.type || "image/webp", folder: "images" }),
    });
    if (!res.ok) throw new Error("Upload URL failed");
    const { signedUrl, publicUrl } = await res.json();
    const put = await fetch(signedUrl, {
      method: "PUT",
      headers: { "Content-Type": file.type || "image/webp" },
      body: file,
    });
    if (!put.ok) throw new Error("Upload failed");
    return publicUrl;
  }

  // Upload Audio
  async function handleAudioUpload(file: File) {
    setUploadingAudio(true);
    setNotice(null);
    try {
      const res = await fetch("/api/uploads/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileName: file.name, contentType: file.type || "audio/mpeg", folder: "audio" }),
      });
      if (!res.ok) throw new Error("Audio upload failed");
      const { signedUrl, publicUrl } = await res.json();
      const put = await fetch(signedUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type || "audio/mpeg" },
        body: file,
      });
      if (!put.ok) throw new Error("Audio file upload failed");
      setAudioUrl(publicUrl);
      setNotice({ type: "ok", msg: "Audio file uploaded successfully!" });
    } catch (e) {
      setNotice({ type: "err", msg: e instanceof Error ? e.message : "Audio upload failed" });
    } finally {
      setUploadingAudio(false);
    }
  }

  async function handleSpotifyLookup() {
    const url = spotifyInput.trim();
    if (!url) return;
    setLookingUpSpotify(true);
    setNotice(null);
    try {
      const res = await fetch(`/api/admin/spotify-lookup?url=${encodeURIComponent(url)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Spotify lookup failed");
      const lookup = data as SpotifyLookup;
      setSpotifyLookup(lookup);
      setSongTitle(lookup.title);
      setArtistName(lookup.artist);
      setSongClips(DEFAULT_SONG_CLIPS);
      if (lookup.previews[0]) {
        setAudioUrl(lookup.previews[0].previewUrl);
        setNotice({ type: "ok", msg: "Imported from Spotify — 30s preview loaded. Pick a start point." });
      } else {
        setNotice({ type: "err", msg: "Found the track, but no preview audio exists for it. Upload the file instead." });
      }
    } catch (e) {
      setNotice({ type: "err", msg: e instanceof Error ? e.message : "Spotify lookup failed" });
    } finally {
      setLookingUpSpotify(false);
    }
  }

  function playSongClip(index: number) {
    const audio = songAudioRef.current;
    const clip = songClips[index];
    if (!audio || !clip) return;
    if (songStopTimer.current) window.clearTimeout(songStopTimer.current);
    audio.currentTime = clip.start;
    void audio.play();
    songStopTimer.current = window.setTimeout(() => audio.pause(), clip.length * 1000);
  }

  function updateSongClip(index: number, patch: Partial<SongClip>) {
    setSongClips((prev) => prev.map((c, i) => (i === index ? { ...c, ...patch } : c)));
  }

  async function handleBulkFiles(files: FileList) {
    const arr = Array.from(files).slice(0, 5);
    setUploadingIdx(0);
    setNotice(null);
    try {
      const urls = await Promise.all(arr.map((f) => uploadImageFile(f)));
      setFrames((prev) => {
        const next = [...prev];
        urls.forEach((url, i) => {
          next[i] = url;
        });
        return next;
      });
      setNotice({ type: "ok", msg: `Uploaded ${urls.length} images!` });
    } catch (e) {
      setNotice({ type: "err", msg: e instanceof Error ? e.message : "Upload failed" });
    } finally {
      setUploadingIdx(null);
    }
  }

  async function handleSingleFile(idx: number, file: File) {
    setUploadingIdx(idx);
    setNotice(null);
    try {
      const url = await uploadImageFile(file);
      setFrames((prev) => prev.map((f, i) => (i === idx ? url : f)));
      setNotice({ type: "ok", msg: `Frame ${idx + 1} uploaded!` });
    } catch (e) {
      setNotice({ type: "err", msg: e instanceof Error ? e.message : "Upload failed" });
    } finally {
      setUploadingIdx(null);
    }
  }

  function moveFrame(idx: number, dir: -1 | 1) {
    const next = idx + dir;
    if (next < 0 || next > 4) return;
    setFrames((prev) => {
      const arr = [...prev];
      [arr[idx], arr[next]] = [arr[next], arr[idx]];
      return arr;
    });
  }

  async function handleSave(publish: boolean) {
    setSaving(true);
    setNotice(null);

    try {
      if (gameMode === "scene" || gameMode === "people") {
        if (!selectedDrama) {
          setNotice({ type: "err", msg: "Please select or create a drama first." });
          setSaving(false);
          return;
        }
        const imageUrls = frames.filter(Boolean) as string[];
        if (imageUrls.length === 0) {
          setNotice({ type: "err", msg: "Upload at least 1 image frame." });
          setSaving(false);
          return;
        }

        await createSceneAndSchedule({
          gameDate: targetDate,
          dramaId: selectedDrama.id,
          imageUrls,
          difficulty,
          publish,
        });
      }

      if (gameMode === "song") {
        const result = await saveSongPuzzle({
          titleKr: songTitle,
          artistKr: artistName,
          dramaTitle: selectedDrama?.title_kr,
          audioUrl,
          startSeconds: songClips[0].start,
          segments: songClips.map((c) => c.length),
          clipStarts: songClips.map((c) => c.start),
          aliases: [],
          gameDate: targetDate,
          publish,
          sourceUrl: spotifyLookup?.spotifyUrl,
        });
        if (!result.ok) {
          setNotice({ type: "err", msg: result.errors.join(" ") });
          setSaving(false);
          return;
        }
      }

      setNotice({
        type: "ok",
        msg: publish
          ? `✓ Featured ${gameMode.toUpperCase()} puzzle scheduled & published for ${targetDate}!`
          : `Draft saved for ${targetDate}`,
      });
    } catch (e) {
      setNotice({ type: "err", msg: e instanceof Error ? e.message : "Failed to publish" });
    } finally {
      setSaving(false);
    }
  }

  const isUploading = uploadingIdx !== null || uploadingAudio;

  return (
    <div>
      {/* Header */}
      <div className="admin-title">
        <div>
          <div className="eyebrow">DAILY GAME BUILDER</div>
          <h1>Schedule Featured Daily Game</h1>
          <p className="muted">
            Select game mode for <strong>{targetDate}</strong> and upload/configure the 5 progressive clues.
          </p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button type="button" className="secondary" onClick={() => handleSave(false)} disabled={saving}>
            Save Draft
          </button>
          <button type="button" className="primary" onClick={() => handleSave(true)} disabled={saving}>
            {saving ? "Publishing…" : `Publish ${targetDate}`}
          </button>
        </div>
      </div>

      {/* Featured Game Mode Switcher Bar */}
      <div
        style={{
          background: "var(--paper-soft)",
          padding: "20px",
          borderRadius: "var(--radius-md)",
          marginBottom: 20,
          border: "1px solid var(--line)",
        }}
      >
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--muted)",
            marginBottom: 12,
          }}
        >
          SELECT FEATURED GAME MODE FOR {targetDate}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10 }}>
          {MODE_OPTIONS.map((m) => {
            const isActive = gameMode === m.id;
            const Icon = m.Icon;

            return (
              <button
                key={m.id}
                type="button"
                onClick={() => setGameMode(m.id as GameMode)}
                style={{
                  padding: "12px 16px",
                  borderRadius: "var(--radius-md)",
                  fontSize: 13,
                  textAlign: "left",
                  cursor: "pointer",
                  border: isActive ? "2px solid var(--accent)" : "1px solid var(--line)",
                  background: isActive ? "#fff" : "var(--paper)",
                  color: isActive ? "var(--ink)" : "var(--muted)",
                  boxShadow: isActive ? "0 4px 12px rgba(220, 38, 38, 0.08)" : "none",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  transition: "all 0.15s ease",
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "var(--radius-sm)",
                    background: isActive ? "var(--accent)" : "var(--paper-soft)",
                    color: isActive ? "#fff" : "var(--ink)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Icon size={18} />
                </div>

                <div>
                  <strong style={{ display: "block", fontSize: 13, color: isActive ? "var(--ink)" : "inherit" }}>
                    {m.label}
                  </strong>
                  <span style={{ fontSize: 11, color: "var(--muted)" }}>{m.desc}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Points Scoring Ladder Legend */}
      <div
        style={{
          display: "flex",
          gap: 12,
          marginBottom: 20,
          padding: "12px 18px",
          background: "var(--paper)",
          border: "1px solid var(--line)",
          borderRadius: "var(--radius-md)",
          fontSize: 13,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <span style={{ fontWeight: 600, color: "var(--muted)" }}>5 Progressive Clues Scoring:</span>
        <span className="tag" style={{ background: "#dcfce7", color: "#166534" }}>Clue 1 = 25 pts</span>
        <span className="tag">Clue 2 = 20 pts</span>
        <span className="tag">Clue 3 = 15 pts</span>
        <span className="tag">Clue 4 = 10 pts</span>
        <span className="tag">Clue 5 = 5 pts</span>
      </div>

      {notice && (
        <div
          style={{
            padding: "12px 16px",
            borderRadius: "var(--radius-md)",
            marginBottom: 20,
            background: notice.type === "ok" ? "#f0fdf4" : "#fef2f2",
            border: `1px solid ${notice.type === "ok" ? "#bbf7d0" : "#fecaca"}`,
            color: notice.type === "ok" ? "#15803d" : "#dc2626",
            fontSize: 13,
          }}
        >
          {notice.msg}
        </div>
      )}

      {/* Date & Drama / Target Info Row */}
      <div className="admin-card" style={{ marginBottom: 24, padding: "20px" }}>
        <div style={{ display: "flex", gap: 24, alignItems: "flex-start", flexWrap: "wrap" }}>
          {/* Target Date */}
          <div>
            <label style={{ fontWeight: 600, fontSize: 13, display: "block", marginBottom: 6 }}>
              Target Game Date
            </label>
            <input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              style={{
                padding: "8px 12px",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--line)",
                fontSize: 14,
                fontFamily: "'DM Mono', monospace",
              }}
            />
          </div>

          {/* Drama Search (For Scene, Song, Chosung, People) */}
          <div style={{ flex: 1, minWidth: 260, position: "relative" }}>
            <label style={{ fontWeight: 600, fontSize: 13, display: "block", marginBottom: 6 }}>
              Drama / Media Title
            </label>
            {selectedDrama ? (
              <div
                style={{
                  display: "flex",
                  gap: 10,
                  alignItems: "center",
                  padding: "8px 12px",
                  border: "1px solid var(--line)",
                  borderRadius: "var(--radius-sm)",
                  background: "var(--paper)",
                }}
              >
                <span style={{ flex: 1, fontSize: 14, fontWeight: 600 }}>{selectedDrama.title_en}</span>
                <span style={{ fontSize: 12, color: "var(--muted)" }}>{selectedDrama.title_kr}</span>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedDrama(null);
                    setDramaQuery("");
                  }}
                  style={{
                    marginLeft: 8,
                    fontSize: 12,
                    color: "var(--muted)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  ✕
                </button>
              </div>
            ) : (
              <>
                <input
                  value={dramaQuery}
                  onChange={(e) => {
                    setDramaQuery(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                  placeholder="Search drama title (e.g. Goblin, Crash Landing)…"
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    borderRadius: "var(--radius-sm)",
                    border: "1px solid var(--line)",
                    fontSize: 14,
                  }}
                />
                {showSuggestions && (suggestions.length > 0 || dramaQuery.trim().length > 0) && (
                  <div
                    style={{
                      position: "absolute",
                      top: "100%",
                      left: 0,
                      right: 0,
                      zIndex: 50,
                      background: "var(--paper)",
                      border: "1px solid var(--line)",
                      borderRadius: "var(--radius-sm)",
                      boxShadow: "0 4px 16px rgba(0,0,0,.12)",
                      marginTop: 2,
                    }}
                  >
                    {suggestions.map((d) => (
                      <button
                        key={d.id}
                        type="button"
                        onClick={() => {
                          setSelectedDrama(d);
                          setDramaQuery("");
                          setShowSuggestions(false);
                        }}
                        style={{
                          display: "block",
                          width: "100%",
                          textAlign: "left",
                          padding: "8px 12px",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          fontSize: 13,
                          borderBottom: "1px solid var(--line)",
                        }}
                      >
                        <strong>{d.title_en}</strong>
                        <span style={{ marginLeft: 8, color: "var(--muted)", fontSize: 12 }}>
                          {d.title_kr}
                        </span>
                      </button>
                    ))}
                    {dramaQuery.trim().length > 0 && (
                      <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={openNewDramaForm}
                        style={{
                          display: "block",
                          width: "100%",
                          textAlign: "left",
                          padding: "8px 12px",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          fontSize: 13,
                          color: "var(--accent)",
                          fontStyle: "italic",
                        }}
                      >
                        {suggestions.length === 0 ? "Not in database — " : ""}+ Add &quot;{dramaQuery.trim()}&quot; as new drama
                      </button>
                    )}
                  </div>
                )}
                {newDrama && (
                  <div
                    style={{
                      marginTop: 8,
                      padding: 12,
                      border: "1px solid var(--line)",
                      borderRadius: "var(--radius-sm)",
                      display: "grid",
                      gap: 8,
                      gridTemplateColumns: "1fr 1fr",
                    }}
                  >
                    {(
                      [
                        ["titleEn", "English title *", "Strong Woman Do Bong-soon"],
                        ["titleKr", "Korean title *", "힘쎈여자 도봉순"],
                        ["altTitles", "Other titles (comma separated)", "Strong Girl Bong-soon"],
                        ["year", "Year", "2017"],
                      ] as const
                    ).map(([key, label, placeholder]) => (
                      <label key={key} style={{ fontSize: 12, display: "grid", gap: 4 }}>
                        {label}
                        <input
                          value={newDrama[key]}
                          inputMode={key === "year" ? "numeric" : undefined}
                          placeholder={placeholder}
                          onChange={(e) => setNewDrama({ ...newDrama, [key]: e.target.value })}
                          style={{
                            padding: "6px 10px",
                            borderRadius: "var(--radius-sm)",
                            border: "1px solid var(--line)",
                            fontSize: 13,
                          }}
                        />
                      </label>
                    ))}
                    <div style={{ gridColumn: "1 / -1", display: "flex", gap: 8, justifyContent: "flex-end" }}>
                      <button
                        type="button"
                        onClick={() => setNewDrama(null)}
                        style={{
                          fontSize: 13,
                          padding: "6px 12px",
                          borderRadius: "var(--radius-sm)",
                          border: "1px solid var(--line)",
                          background: "none",
                          cursor: "pointer",
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleCreateDrama}
                        disabled={creatingDrama}
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          padding: "6px 12px",
                          borderRadius: "var(--radius-sm)",
                          border: "none",
                          background: "var(--accent)",
                          color: "#fff",
                          cursor: creatingDrama ? "default" : "pointer",
                          opacity: creatingDrama ? 0.6 : 1,
                        }}
                      >
                        {creatingDrama ? "Adding…" : "Add drama & select"}
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Difficulty Slider */}
          <div>
            <label style={{ fontWeight: 600, fontSize: 13, display: "block", marginBottom: 6 }}>
              Difficulty (1–10)
            </label>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <input
                type="range"
                min={1}
                max={10}
                step={0.5}
                value={difficulty}
                onChange={(e) => setDifficulty(Number(e.target.value))}
                style={{ width: 100 }}
              />
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: diffColor(difficulty),
                  minWidth: 28,
                  fontFamily: "'DM Mono', monospace",
                }}
              >
                {difficulty}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* DYNAMIC FORM ACCORDING TO SELECTED GAME MODE */}

      {/* MODE 1 & MODE 5: SCENE or PEOPLE IMAGE FRAME UPLOADER */}
      {(gameMode === "scene" || gameMode === "people") && (
        <div className="admin-card" style={{ padding: "20px" }}>
          <div style={{ marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <h3 style={{ margin: 0, fontSize: 16 }}>
                {gameMode === "scene" ? "Upload 5 Scene Screenshots" : "Upload 5 Silhouette to Face Frames"}
              </h3>
              <p className="muted" style={{ margin: "4px 0 0", fontSize: 12 }}>
                {gameMode === "scene"
                  ? "Select up to 5 screenshots at once — tightest crop first (01), widest last (05)"
                  : "Select up to 5 photos — silhouette first (01), full face last (05)"}
              </p>
            </div>

            <label style={{ cursor: isUploading ? "default" : "pointer" }}>
              <span className="primary" style={{ padding: "8px 18px", opacity: isUploading ? 0.5 : 1 }}>
                {isUploading ? "Uploading…" : "Bulk Upload Images"}
              </span>
              <input
                ref={bulkInputRef}
                type="file"
                accept="image/*"
                multiple
                hidden
                disabled={isUploading}
                onChange={(e) => {
                  if (e.target.files?.length) handleBulkFiles(e.target.files);
                  e.target.value = "";
                }}
              />
            </label>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12 }}>
            {frames.map((url, idx) => {
              const labelText = gameMode === "scene" ? SCENE_FRAME_LABELS[idx] : PEOPLE_FRAME_LABELS[idx];

              return (
                <div key={idx} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <span style={{ fontSize: 11, color: "var(--muted)", fontFamily: "'DM Mono', monospace" }}>
                    {labelText}
                  </span>

                  <div
                    style={{
                      position: "relative",
                      aspectRatio: "16/9",
                      border: `2px dashed ${url ? "var(--accent)" : "var(--line)"}`,
                      borderRadius: "var(--radius-md)",
                      background: url ? "transparent" : "var(--paper-soft)",
                      overflow: "hidden",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {url ? (
                      <>
                        <img
                          src={url}
                          alt={`Frame ${idx + 1}`}
                          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                        />
                        <button
                          type="button"
                          onClick={() => setFrames((prev) => prev.map((f, i) => (i === idx ? null : f)))}
                          style={{
                            position: "absolute",
                            top: 4,
                            right: 4,
                            background: "rgba(0,0,0,.6)",
                            color: "#fff",
                            border: "none",
                            borderRadius: 4,
                            padding: "2px 6px",
                            fontSize: 11,
                            cursor: "pointer",
                          }}
                        >
                          ✕
                        </button>
                      </>
                    ) : uploadingIdx === idx ? (
                      <span style={{ fontSize: 11, color: "var(--muted)" }}>Uploading…</span>
                    ) : (
                      <label
                        style={{
                          cursor: "pointer",
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <span style={{ fontSize: 22, opacity: 0.3 }}>+</span>
                        <input
                          type="file"
                          accept="image/*"
                          hidden
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) handleSingleFile(idx, f);
                            e.target.value = "";
                          }}
                        />
                      </label>
                    )}
                  </div>

                  <div style={{ display: "flex", gap: 4, justifyContent: "center" }}>
                    <button
                      type="button"
                      onClick={() => moveFrame(idx, -1)}
                      disabled={idx === 0 || !url}
                      style={{
                        flex: 1,
                        padding: "3px 0",
                        fontSize: 12,
                        background: "var(--paper-soft)",
                        border: "1px solid var(--line)",
                        borderRadius: 4,
                        cursor: idx === 0 || !url ? "default" : "pointer",
                        opacity: idx === 0 || !url ? 0.3 : 1,
                      }}
                    >
                      ←
                    </button>
                    <button
                      type="button"
                      onClick={() => moveFrame(idx, 1)}
                      disabled={idx === 4 || !url}
                      style={{
                        flex: 1,
                        padding: "3px 0",
                        fontSize: 12,
                        background: "var(--paper-soft)",
                        border: "1px solid var(--line)",
                        borderRadius: 4,
                        cursor: idx === 4 || !url ? "default" : "pointer",
                        opacity: idx === 4 || !url ? 0.3 : 1,
                      }}
                    >
                      →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MODE 2: SONG / OST AUDIO UPLOADER */}
      {gameMode === "song" && (
        <div className="admin-card" style={{ padding: "20px" }}>
          <h3 style={{ margin: "0 0 16px", fontSize: 16 }}>Upload Song / OST Audio File</h3>

          <div style={{ marginBottom: 16 }}>
            <label style={{ fontWeight: 600, fontSize: 13, display: "block", marginBottom: 6 }}>
              Import from Spotify link
            </label>
            <div style={{ display: "flex", gap: 8 }}>
              <input
                type="url"
                placeholder="https://open.spotify.com/track/…"
                value={spotifyInput}
                onChange={(e) => setSpotifyInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    void handleSpotifyLookup();
                  }
                }}
                style={{
                  flex: 1,
                  padding: "8px 12px",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--line)",
                }}
              />
              <button
                type="button"
                onClick={() => void handleSpotifyLookup()}
                disabled={lookingUpSpotify || !spotifyInput.trim()}
                style={{
                  padding: "8px 16px",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--line)",
                  background: "var(--paper)",
                  fontSize: 13,
                  cursor: lookingUpSpotify ? "default" : "pointer",
                }}
              >
                {lookingUpSpotify ? "Looking up…" : "Import"}
              </button>
            </div>
            <p style={{ margin: "6px 0 0", fontSize: 12, color: "var(--muted)" }}>
              Fills title &amp; artist and loads Apple&apos;s official 30s preview. Players get a
              &quot;listen on Spotify&quot; link after the reveal.
            </p>

            {spotifyLookup && (
              <div
                style={{
                  display: "flex",
                  gap: 12,
                  alignItems: "center",
                  marginTop: 10,
                  padding: 10,
                  border: "1px solid var(--line)",
                  borderRadius: "var(--radius-sm)",
                }}
              >
                {spotifyLookup.cover && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={spotifyLookup.cover} alt="" width={48} height={48} style={{ borderRadius: 4 }} />
                )}
                <div style={{ flex: 1, minWidth: 0, fontSize: 13 }}>
                  <strong>{spotifyLookup.title}</strong>
                  <span style={{ color: "var(--muted)", marginLeft: 6 }}>{spotifyLookup.artist}</span>
                  {spotifyLookup.previews.length > 1 && (
                    <select
                      value={audioUrl}
                      onChange={(e) => setAudioUrl(e.target.value)}
                      style={{ display: "block", marginTop: 6, fontSize: 12, maxWidth: "100%" }}
                    >
                      {spotifyLookup.previews.map((p) => (
                        <option key={p.previewUrl} value={p.previewUrl}>
                          Preview: {p.trackName} — {p.artistName}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>
            )}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
            <div>
              <label style={{ fontWeight: 600, fontSize: 13, display: "block", marginBottom: 6 }}>
                Song Title (OST)
              </label>
              <input
                type="text"
                placeholder="e.g. All About You (그대라는 시)"
                value={songTitle}
                onChange={(e) => setSongTitle(e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--line)",
                }}
              />
            </div>
            <div>
              <label style={{ fontWeight: 600, fontSize: 13, display: "block", marginBottom: 6 }}>
                Artist / Singer Name
              </label>
              <input
                type="text"
                placeholder="e.g. Taeyeon (태연)"
                value={artistName}
                onChange={(e) => setArtistName(e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--line)",
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ fontWeight: 600, fontSize: 13, display: "block", marginBottom: 8 }}>
              Audio Track File (.mp3, .wav, .ogg, .aac)
            </label>
            <label
              style={{
                display: "inline-block",
                padding: "8px 16px",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--line)",
                fontSize: 13,
                cursor: "pointer",
                background: uploadingAudio ? "var(--paper-soft)" : "var(--paper)",
              }}
            >
              {uploadingAudio ? "Uploading Audio…" : audioUrl ? "Replace Audio Track" : "Upload Audio File"}
              <input
                type="file"
                accept="audio/*"
                hidden
                disabled={uploadingAudio}
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) void handleAudioUpload(f);
                }}
              />
            </label>

            {audioUrl && (
              <div style={{ marginTop: 12 }}>
                <span style={{ fontSize: 12, color: "var(--green)", fontWeight: 600 }}>
                  ✓ Audio track ready
                </span>
                <audio
                  ref={songAudioRef}
                  src={audioUrl}
                  controls
                  onLoadedMetadata={(e) => setAudioDuration(e.currentTarget.duration || 0)}
                  onTimeUpdate={(e) => setSongTime(e.currentTarget.currentTime)}
                  style={{ display: "block", marginTop: 8, width: "100%" }}
                />
              </div>
            )}
          </div>

          <div>
            <label style={{ fontWeight: 600, fontSize: 13, display: "block", marginBottom: 4 }}>
              5 Audio Clips — pick any bit of the song for each
            </label>
            <p style={{ margin: "0 0 10px", fontSize: 12, color: "var(--muted)" }}>
              Play the track above, pause where a clip should begin, then hit &quot;Use playhead&quot;.
              Click the timeline to jump around.
            </p>

            {audioUrl && audioDuration > 0 && (
              <div
                role="presentation"
                onClick={(e) => {
                  const audio = songAudioRef.current;
                  if (!audio) return;
                  const rect = e.currentTarget.getBoundingClientRect();
                  audio.currentTime = ((e.clientX - rect.left) / rect.width) * audioDuration;
                }}
                style={{
                  position: "relative",
                  height: 44,
                  marginBottom: 12,
                  background: "var(--paper-soft)",
                  border: "1px solid var(--line)",
                  borderRadius: "var(--radius-sm)",
                  cursor: "pointer",
                  overflow: "hidden",
                }}
              >
                {songClips.map((clip, i) => (
                  <div
                    key={i}
                    title={`Clip ${i + 1}: ${formatClock(clip.start)} – ${formatClock(clip.start + clip.length)}`}
                    style={{
                      position: "absolute",
                      top: 4 + i * 7,
                      height: 6,
                      left: `${(clip.start / audioDuration) * 100}%`,
                      width: `${Math.max((clip.length / audioDuration) * 100, 0.5)}%`,
                      background: SONG_CLIP_COLORS[i],
                      borderRadius: 3,
                    }}
                  />
                ))}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    left: `${(songTime / audioDuration) * 100}%`,
                    width: 2,
                    background: "var(--ink)",
                  }}
                />
              </div>
            )}

            <div style={{ display: "grid", gap: 8 }}>
              {songClips.map((clip, i) => {
                const overflows = audioDuration > 0 && clip.start + clip.length > audioDuration + 0.05;
                const numberInput = {
                  width: 76,
                  padding: "6px 8px",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--line)",
                  fontSize: 13,
                };
                return (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      alignItems: "center",
                      gap: 10,
                      padding: "8px 10px",
                      background: "var(--paper-soft)",
                      border: `1px solid ${overflows ? "var(--accent)" : "var(--line)"}`,
                      borderRadius: "var(--radius-sm)",
                      fontSize: 13,
                    }}
                  >
                    <span style={{ width: 8, height: 8, borderRadius: 4, background: SONG_CLIP_COLORS[i] }} />
                    <strong style={{ minWidth: 48 }}>Clip {i + 1}</strong>
                    <span style={{ fontSize: 11, color: "var(--green)", minWidth: 44 }}>
                      {SONG_CLIP_POINTS[i]} pts
                    </span>
                    <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      Start (s)
                      <input
                        type="number"
                        min={0}
                        step={0.1}
                        value={clip.start}
                        onChange={(e) => updateSongClip(i, { start: Math.max(Number(e.target.value) || 0, 0) })}
                        style={numberInput}
                      />
                    </label>
                    <button
                      type="button"
                      disabled={!audioUrl}
                      onClick={() => updateSongClip(i, { start: Math.round(songTime * 10) / 10 })}
                      style={{
                        padding: "6px 10px",
                        borderRadius: "var(--radius-sm)",
                        border: "1px solid var(--line)",
                        background: "var(--paper)",
                        fontSize: 12,
                        cursor: audioUrl ? "pointer" : "default",
                      }}
                    >
                      Use playhead ({formatClock(songTime)})
                    </button>
                    <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      Length (s)
                      <input
                        type="number"
                        min={0.5}
                        step={0.5}
                        value={clip.length}
                        onChange={(e) => updateSongClip(i, { length: Math.max(Number(e.target.value) || 0.5, 0.5) })}
                        style={numberInput}
                      />
                    </label>
                    <button
                      type="button"
                      disabled={!audioUrl}
                      onClick={() => playSongClip(i)}
                      style={{
                        marginLeft: "auto",
                        padding: "6px 12px",
                        borderRadius: "var(--radius-sm)",
                        border: "none",
                        background: audioUrl ? "var(--ink)" : "var(--line)",
                        color: "var(--paper)",
                        fontSize: 12,
                        cursor: audioUrl ? "pointer" : "default",
                      }}
                    >
                      ▶ {formatClock(clip.start)}–{formatClock(clip.start + clip.length)}
                    </button>
                    {overflows && (
                      <span style={{ width: "100%", fontSize: 11, color: "var(--accent)" }}>
                        Runs past the end of the track ({formatClock(audioDuration)}).
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* MODE 3: CHOSUNG CONSONANTS & 5 CLUE LADDER */}
      {gameMode === "chosung" && (
        <div className="admin-card" style={{ padding: "20px" }}>
          <h3 style={{ margin: "0 0 16px", fontSize: 16 }}>Schedule Chosung (Consonant) Quiz</h3>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
            <div>
              <label style={{ fontWeight: 600, fontSize: 13, display: "block", marginBottom: 6 }}>
                Primary Korean Answer
              </label>
              <input
                type="text"
                placeholder="e.g. 호텔 델루나"
                value={chosungAnswer}
                onChange={(e) => setChosungAnswer(e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--line)",
                  fontSize: 14,
                }}
              />
            </div>

            <div>
              <label style={{ fontWeight: 600, fontSize: 13, display: "block", marginBottom: 6 }}>
                Auto-Extracted Consonants (초성)
              </label>
              <div
                style={{
                  padding: "8px 12px",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--line)",
                  background: "var(--paper-soft)",
                  fontSize: 18,
                  fontWeight: 700,
                  letterSpacing: "0.2em",
                  color: "var(--accent)",
                  fontFamily: "'DM Mono', monospace",
                }}
              >
                {chosungAnswer ? extractChosung(chosungAnswer) : "ㅎㅌ ㄷㄹㄴ"}
              </div>
            </div>
          </div>

          <div>
            <label style={{ fontWeight: 600, fontSize: 13, display: "block", marginBottom: 8 }}>
              5 Progressive Clues Ladder (Unlocked per attempt)
            </label>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {chosungClues.map((clue, idx) => (
                <div key={idx} style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      minWidth: 80,
                      color: "var(--muted)",
                      fontFamily: "'DM Mono', monospace",
                    }}
                  >
                    Clue 0{idx + 1} ({25 - idx * 5} pts)
                  </span>
                  <input
                    type="text"
                    value={clue}
                    onChange={(e) => {
                      const next = [...chosungClues];
                      next[idx] = e.target.value;
                      setChosungClues(next);
                    }}
                    style={{
                      flex: 1,
                      padding: "8px 12px",
                      borderRadius: "var(--radius-sm)",
                      border: "1px solid var(--line)",
                      fontSize: 13,
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODE 4: CONNECTIONS (4 GROUPS OF 4) */}
      {gameMode === "connections" && (
        <div className="admin-card" style={{ padding: "20px" }}>
          <h3 style={{ margin: "0 0 16px", fontSize: 16 }}>Schedule Connections (4x4 Grouping)</h3>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {connectionGroups.map((group, groupIdx) => (
              <div
                key={groupIdx}
                style={{
                  padding: "14px",
                  background: "var(--paper-soft)",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--line)",
                }}
              >
                <label style={{ fontWeight: 600, fontSize: 12, display: "block", marginBottom: 6 }}>
                  Group {groupIdx + 1} Category Name
                </label>
                <input
                  type="text"
                  value={group.category}
                  onChange={(e) => {
                    const next = [...connectionGroups];
                    next[groupIdx].category = e.target.value;
                    setConnectionGroups(next);
                  }}
                  style={{
                    width: "100%",
                    padding: "6px 10px",
                    borderRadius: "var(--radius-sm)",
                    border: "1px solid var(--line)",
                    fontSize: 13,
                    fontWeight: 600,
                    marginBottom: 10,
                  }}
                />

                <label style={{ fontWeight: 600, fontSize: 11, color: "var(--muted)", display: "block", marginBottom: 4 }}>
                  4 Group Items
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                  {group.items.map((item, itemIdx) => (
                    <input
                      key={itemIdx}
                      type="text"
                      value={item}
                      onChange={(e) => {
                        const next = [...connectionGroups];
                        next[groupIdx].items[itemIdx] = e.target.value;
                        setConnectionGroups(next);
                      }}
                      style={{
                        padding: "6px 8px",
                        borderRadius: "var(--radius-sm)",
                        border: "1px solid var(--line)",
                        fontSize: 12,
                      }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer Info */}
      <div
        style={{
          marginTop: 20,
          padding: "14px 18px",
          background: "var(--paper-soft)",
          borderRadius: "var(--radius-md)",
          fontSize: 12,
          fontFamily: "'DM Mono', monospace",
          color: "var(--muted)",
        }}
      >
        ← View all scheduled days on the{" "}
        <a href="/admin/calendar" style={{ color: "var(--accent)" }}>
          Schedule Calendar
        </a>
      </div>
    </div>
  );
}
