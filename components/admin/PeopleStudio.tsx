"use client";

import { useState, useTransition } from "react";
import { compressImageFile } from "@/lib/client/image-optimizer";
import {
  savePuzzleSteps,
  savePuzzleClues,
  savePuzzleAnswers,
  publishPuzzle,
} from "@/app/admin/puzzles/actions";

type FrameSlot = {
  stepNumber: number;
  label: string;
  stepType: string;
  assetUrl: string;
};

const DEFAULT_FRAMES: FrameSlot[] = [
  { stepNumber: 1, label: "01 Silhouette", stepType: "silhouette", assetUrl: "" },
  { stepNumber: 2, label: "02 Partial crop", stepType: "crop", assetUrl: "" },
  { stepNumber: 3, label: "03 Wider shot", stepType: "image", assetUrl: "" },
  { stepNumber: 4, label: "04 With clue", stepType: "image", assetUrl: "" },
  { stepNumber: 5, label: "05 Full photo", stepType: "image", assetUrl: "" },
];

type ClueRow = {
  clueOrder: number;
  type: string;
  label: string;
  value: string;
  unlockAfterAttempt: number;
};

type Props = {
  puzzleId: string;
  entityId?: string;
  initialFrames?: FrameSlot[];
  initialAnswers?: string[];
  initialClues?: ClueRow[];
  guestPresignUrl?: string;
};

export function PeopleStudio({
  puzzleId,
  initialFrames,
  initialAnswers = [],
  initialClues = [],
  guestPresignUrl,
}: Props) {
  const [pending, startTransition] = useTransition();
  const [frames, setFrames] = useState<FrameSlot[]>(
    initialFrames ?? DEFAULT_FRAMES,
  );
  const [answers, setAnswers] = useState<string[]>(
    initialAnswers.length > 0 ? initialAnswers : [""],
  );
  const [clues, setClues] = useState<ClueRow[]>(
    initialClues.length > 0
      ? initialClues
      : [
          { clueOrder: 1, type: "category", label: "Profession", value: "", unlockAfterAttempt: 1 },
          { clueOrder: 2, type: "debut", label: "Debut", value: "", unlockAfterAttempt: 2 },
          { clueOrder: 3, type: "agency", label: "Agency", value: "", unlockAfterAttempt: 3 },
        ],
  );
  const [activeFrame, setActiveFrame] = useState(1);
  const [notice, setNotice] = useState("");

  function setFrameUrl(stepNumber: number, url: string) {
    setFrames((prev) =>
      prev.map((f) => (f.stepNumber === stepNumber ? { ...f, assetUrl: url } : f)),
    );
  }

  async function handleUpload(stepNumber: number, rawFile: File) {
    setNotice("Compressing image…");
    try {
      const file = await compressImageFile(rawFile, { maxDimension: 1200, quality: 0.82 });
      setNotice("Uploading optimized frame…");

      const res = await fetch("/api/uploads/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: `frame-0${stepNumber}.webp`,
          contentType: file.type || "image/webp",
          folder: "images",
        }),
      });
      if (!res.ok) { setNotice("Upload failed"); return; }
      const { signedUrl, publicUrl } = await res.json();
      await fetch(signedUrl, { method: "PUT", body: file, headers: { "Content-Type": file.type || "image/webp" } });
      setFrameUrl(stepNumber, publicUrl);
      setNotice(`Frame ${stepNumber} uploaded`);
    } catch (err) {
      setNotice("Upload error: " + (err instanceof Error ? err.message : "Failed"));
    }
  }

  function save() {
    startTransition(async () => {
      const stepsResult = await savePuzzleSteps(
        puzzleId,
        frames
          .filter((f) => f.assetUrl)
          .map((f) => ({
            stepNumber: f.stepNumber,
            stepType: f.stepType,
            assetUrl: f.assetUrl,
          })),
      );
      if ("error" in stepsResult) { setNotice(stepsResult.error); return; }

      const cluesResult = await savePuzzleClues(puzzleId, clues.filter((c) => c.value));
      if ("error" in cluesResult) { setNotice(cluesResult.error); return; }

      const answersResult = await savePuzzleAnswers(
        puzzleId,
        answers
          .filter(Boolean)
          .map((text, i) => ({ answerText: text, isPrimary: i === 0 })),
      );
      if ("error" in answersResult) { setNotice(answersResult.error); return; }

      setNotice("Saved.");
    });
  }

  function publish() {
    startTransition(async () => {
      const result = await publishPuzzle(puzzleId);
      if ("error" in result) { setNotice(result.error); return; }
      setNotice("Puzzle published!");
    });
  }

  return (
    <div className="scene-studio">
      <div className="studio-layout">
        {/* Left: frame preview */}
        <div className="studio-left">
          <div className="studio-frame-preview">
            {frames[activeFrame - 1]?.assetUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={frames[activeFrame - 1].assetUrl}
                alt={frames[activeFrame - 1].label}
                style={{ width: "100%", borderRadius: "8px" }}
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  aspectRatio: "3/4",
                  background: "#f1f5f9",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#888",
                }}
              >
                No image
              </div>
            )}
          </div>

          {/* Frame tabs */}
          <div className="studio-frames" style={{ marginTop: "12px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {frames.map((f) => (
              <button
                key={f.stepNumber}
                type="button"
                onClick={() => setActiveFrame(f.stepNumber)}
                className={`secondary${activeFrame === f.stepNumber ? " active" : ""}`}
                style={{ padding: "4px 8px", fontSize: "12px" }}
              >
                {f.label} {f.assetUrl ? "✓" : ""}
              </button>
            ))}
          </div>
        </div>

        {/* Center: frame upload + metadata */}
        <div className="studio-center">
          <div style={{ background: "#fff", padding: "16px", borderRadius: "8px", border: "1px solid #e7e5e4" }}>
            <h3 style={{ margin: "0 0 12px" }}>
              Frame — {frames[activeFrame - 1]?.label}
            </h3>
            <input
              type="text"
              placeholder="Paste image URL"
              value={frames[activeFrame - 1]?.assetUrl ?? ""}
              onChange={(e) => setFrameUrl(activeFrame, e.target.value)}
              style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #ccc", marginBottom: "8px", boxSizing: "border-box" }}
            />
            <label
              htmlFor={`file-frame-${activeFrame}`}
              style={{
                display: "block",
                padding: "8px 12px",
                background: "#f8f8f7",
                borderRadius: "6px",
                border: "1px dashed #ccc",
                textAlign: "center",
                cursor: "pointer",
                fontSize: "13px",
              }}
            >
              Upload file (drag &amp; drop)
            </label>
            <input
              id={`file-frame-${activeFrame}`}
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleUpload(activeFrame, file);
              }}
            />
          </div>

          {/* Answers */}
          <div style={{ background: "#fff", padding: "16px", borderRadius: "8px", border: "1px solid #e7e5e4", marginTop: "16px" }}>
            <h3 style={{ margin: "0 0 12px" }}>Answer &amp; aliases</h3>
            {answers.map((answer, i) => (
              <div key={i} style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
                <input
                  type="text"
                  placeholder={i === 0 ? "Primary answer (Korean)" : "Alias (English, romanization…)"}
                  value={answer}
                  onChange={(e) => {
                    const next = [...answers];
                    next[i] = e.target.value;
                    setAnswers(next);
                  }}
                  style={{ flex: 1, padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
                />
                {i > 0 && (
                  <button
                    type="button"
                    onClick={() => setAnswers(answers.filter((_, j) => j !== i))}
                    style={{ padding: "4px 8px", fontSize: "12px", color: "#dc2626", background: "none", border: "1px solid #dc2626", borderRadius: "4px", cursor: "pointer" }}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              className="secondary"
              onClick={() => setAnswers([...answers, ""])}
              style={{ fontSize: "12px" }}
            >
              + Add alias
            </button>
          </div>
        </div>

        {/* Right: clue ladder */}
        <div className="studio-right">
          <div style={{ background: "#fff", padding: "16px", borderRadius: "8px", border: "1px solid #e7e5e4" }}>
            <h3 style={{ margin: "0 0 12px" }}>Clue ladder</h3>
            {clues.map((clue, i) => (
              <div key={i} style={{ marginBottom: "12px", padding: "10px", background: "#f8f8f7", borderRadius: "6px" }}>
                <div style={{ display: "flex", gap: "6px", marginBottom: "6px" }}>
                  <select
                    value={clue.type}
                    onChange={(e) => {
                      const next = [...clues];
                      next[i] = { ...next[i], type: e.target.value };
                      setClues(next);
                    }}
                    style={{ padding: "4px 6px", borderRadius: "4px", border: "1px solid #ccc", fontSize: "12px" }}
                  >
                    <option value="category">Profession</option>
                    <option value="debut">Debut</option>
                    <option value="agency">Agency</option>
                    <option value="drama">Notable work</option>
                    <option value="nationality">Nationality</option>
                    <option value="year">Year</option>
                    <option value="genre">Genre</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Clue label"
                    value={clue.label}
                    onChange={(e) => {
                      const next = [...clues];
                      next[i] = { ...next[i], label: e.target.value };
                      setClues(next);
                    }}
                    style={{ flex: 1, padding: "4px 6px", borderRadius: "4px", border: "1px solid #ccc", fontSize: "12px" }}
                  />
                </div>
                <input
                  type="text"
                  placeholder="Clue value"
                  value={clue.value}
                  onChange={(e) => {
                    const next = [...clues];
                    next[i] = { ...next[i], value: e.target.value };
                    setClues(next);
                  }}
                  style={{ width: "100%", padding: "4px 6px", borderRadius: "4px", border: "1px solid #ccc", fontSize: "12px", boxSizing: "border-box" }}
                />
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "6px" }}>
                  <label style={{ fontSize: "11px", color: "#666" }}>
                    Reveal after attempt {clue.unlockAfterAttempt}
                  </label>
                  <input
                    type="range"
                    min={1}
                    max={5}
                    value={clue.unlockAfterAttempt}
                    onChange={(e) => {
                      const next = [...clues];
                      next[i] = { ...next[i], unlockAfterAttempt: parseInt(e.target.value) };
                      setClues(next);
                    }}
                    style={{ flex: 1 }}
                  />
                </div>
              </div>
            ))}
            <button
              type="button"
              className="secondary"
              onClick={() =>
                setClues([
                  ...clues,
                  { clueOrder: clues.length + 1, type: "drama", label: "Notable work", value: "", unlockAfterAttempt: clues.length + 1 },
                ])
              }
              style={{ fontSize: "12px" }}
            >
              + Add clue
            </button>
          </div>
        </div>
      </div>

      {/* Action bar */}
      <div style={{ display: "flex", gap: "12px", alignItems: "center", marginTop: "20px", padding: "16px", background: "#fff", borderRadius: "8px", border: "1px solid #e7e5e4" }}>
        {notice && <span style={{ flex: 1, fontSize: "13px", color: "#166534" }}>{notice}</span>}
        <button type="button" className="secondary" onClick={save} disabled={pending}>
          {pending ? "Saving…" : "Save draft"}
        </button>
        <button type="button" className="primary" onClick={publish} disabled={pending}>
          Publish puzzle
        </button>
      </div>
    </div>
  );
}
