"use client";

import { useState } from "react";

type Props = {
  gameDate: string;
  deokryeokResult: {
    totalScore: number;
    maxScore: number;
    percentileText: string;
    streakDays: number;
    categoryBreakdown: { icon: string; label: string; score: number; max: number }[];
  };
};

export function EditorialShareCard({ gameDate, deokryeokResult }: Props) {
  const [notice, setNotice] = useState("");

  const formattedText = `[그 장면 뭐였지?] 오늘의 덕력 (${gameDate})
점수: ${deokryeokResult.totalScore} / ${deokryeokResult.maxScore} (${deokryeokResult.percentileText})
연속 정답: ${deokryeokResult.streakDays}일 연속

${deokryeokResult.categoryBreakdown.map((c) => `${c.icon} ${c.label}: ${'🟩'.repeat(Math.max(1, c.score))}`).join("\n")}

👉 나도 도전하기: https://kdrama-scene-game.vercel.app`;

  async function handleShare() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "오늘의 덕력 측정",
          text: formattedText,
          url: window.location.href,
        });
        return;
      } catch {
        // fallback to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(formattedText);
      setNotice("결과가 클립보드에 복사되었습니다! 📋");
    } catch {
      setNotice("복사에 실패했습니다.");
    }
  }

  return (
    <div className="editorial-share-card">
      <div className="share-card-inner">
        <div className="share-brand-header">
          <span className="brand-mark">오늘의 덕력</span>
          <span className="share-date">{gameDate}</span>
        </div>

        <div className="share-main-score">
          <div className="score-big">{deokryeokResult.totalScore} <span>/ {deokryeokResult.maxScore}</span></div>
          <div className="share-percentile">{deokryeokResult.percentileText}</div>
        </div>

        <div className="share-breakdown-list">
          {deokryeokResult.categoryBreakdown.map((cat, idx) => (
            <div key={idx} className="share-breakdown-row">
              <span className="row-icon">{cat.icon}</span>
              <span className="row-label">{cat.label}</span>
              <div className="row-blocks">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={`score-block ${i < cat.score ? "filled" : "empty"}`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="share-footer-meta">
          <span>🔥 {deokryeokResult.streakDays}일 연속 플레이 중</span>
        </div>
      </div>

      <div className="share-actions">
        <button type="button" className="share-btn-primary" onClick={handleShare}>
          결과 공유하기
        </button>
        <a href={`/challenge/today`} className="share-btn-secondary">
          친구에게 도전하기
        </a>
      </div>

      {notice && <p className="share-notice">{notice}</p>}
    </div>
  );
}
