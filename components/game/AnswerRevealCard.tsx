"use client";

import { useState } from "react";

type Props = {
  titleKr: string;
  titleEn?: string;
  posterUrl?: string;
  year?: number;
  network?: string;
  attemptsUsed: number;
  puzzleType: "scene" | "song" | "chosung" | "connections" | "people";
  onNext?: () => void;
};

const TYPE_LABELS: Record<string, string> = {
  scene: "Scene",
  song: "Song",
  chosung: "Chosung",
  connections: "Connections",
  people: "People",
};

function ScoreBoxes({ wrong, total = 5 }: { wrong: number; total?: number }) {
  return (
    <div style={{ display: "flex", gap: 5 }}>
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          style={{
            display: "inline-block",
            width: 22,
            height: 22,
            borderRadius: 4,
            background: i < wrong ? "#ef4444" : "var(--line)",
          }}
        />
      ))}
    </div>
  );
}

function IconShare() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
      <polyline points="16 6 12 2 8 6"/>
      <line x1="12" y1="2" x2="12" y2="15"/>
    </svg>
  );
}

export function AnswerRevealCard({
  titleKr,
  titleEn,
  posterUrl,
  year,
  network,
  attemptsUsed,
  puzzleType,
  onNext,
}: Props) {
  const [copied, setCopied] = useState(false);

  const siteUrl = typeof window !== "undefined" ? window.location.origin : "https://dramacut.com";
  const shareText = `Dramacut — ${TYPE_LABELS[puzzleType] ?? "Scene"}\n${"✕ ".repeat(attemptsUsed).trim()}\nAnswer: ${titleEn ?? titleKr}\n${siteUrl}`;

  async function handleShare() {
    if (navigator.share) {
      try { await navigator.share({ text: shareText }); return; } catch { /* fall through */ }
    }
    await navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="answer-reveal-card">
      <div className="reveal-header">
        <span className="reveal-eyebrow">Answer</span>
        <p className="reveal-sub">You&apos;ll get it next time!</p>
      </div>

      <div className="reveal-body">
        {posterUrl && (
          <img src={posterUrl} alt={titleKr} className="reveal-poster" loading="lazy" />
        )}
        <div className="reveal-info">
          <h3 className="reveal-title-kr">{titleKr}</h3>
          {titleEn && <p className="reveal-title-en">{titleEn}</p>}
          {(year || network) && (
            <p className="reveal-meta">{[year, network].filter(Boolean).join(" · ")}</p>
          )}
        </div>
      </div>

      <div className="reveal-emoji">
        <ScoreBoxes wrong={attemptsUsed} />
      </div>

      <div className="reveal-actions">
        <button type="button" className="secondary" onClick={handleShare} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <IconShare />
          {copied ? "Copied!" : "Share"}
        </button>
        {onNext && (
          <button type="button" className="primary" onClick={onNext}>
            Next Puzzle
          </button>
        )}
      </div>
    </div>
  );
}
