"use client";

import { useState } from "react";
import Link from "next/link";
import { IconChevronRight, IconFlame, IconLock, IconScene, IconUnlock } from "@/components/icons/Icons";

export function LandingGuideSection() {
  const [open, setOpen] = useState(false);

  return (
    <div className="landing-guide-wrapper">
      <div className="landing-guide-toggle-bar">
        <button
          type="button"
          className="guide-toggle-btn"
          onClick={() => setOpen((prev) => !prev)}
        >
          <span className="guide-icon-badge">❓</span>
          <span>How to Play · 게임 방법</span>
          <span className="guide-toggle-arrow">{open ? "▲ Hide" : "▼ Show"}</span>
        </button>
      </div>

      {open && (
        <div className="landing-guide-cards">
          <div className="guide-card">
            <div className="guide-card-num">01</div>
            <div className="guide-card-content">
              <h4>Watch the Cut · 장면 감상</h4>
              <p>
                Start with 1 cinematic frame. Each incorrect guess unlocks the next frame (up to 5 frames).
              </p>
            </div>
          </div>

          <div className="guide-card">
            <div className="guide-card-num">02</div>
            <div className="guide-card-content">
              <h4>Unlock Hints · 힌트 활용</h4>
              <p>
                Stuck? Reveal actor names, air year, OST songs, and quotes after each attempt.
              </p>
            </div>
          </div>

          <div className="guide-card">
            <div className="guide-card-num">03</div>
            <div className="guide-card-content">
              <h4>Score & Streak · 연속 정답</h4>
              <p>
                Solve on 1st try for max 25 pts. Keep your streak alive with daily plays!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function ArchiveTeaserSection() {
  const recentCuts = [
    {
      date: "2026.09.15",
      titleEn: "My Liberation Notes",
      titleKr: "나의 해방일지",
      cutNum: "#247",
      solvedPct: "78%",
    },
    {
      date: "2026.09.14",
      titleEn: "Our Blues",
      titleKr: "우리들의 블루스",
      cutNum: "#246",
      solvedPct: "82%",
    },
    {
      date: "2026.09.13",
      titleEn: "Moving",
      titleKr: "무빙",
      cutNum: "#245",
      solvedPct: "65%",
    },
  ];

  return (
    <section className="archive-teaser-wrapper">
      <div className="section-title-row">
        <div>
          <span className="eyebrow">PAST PUZZLES · 지나간 퍼즐</span>
          <h2>Play Recent Cuts · 최근 장면 다시보기</h2>
        </div>
        <Link href="/archive" className="view-all-link">
          View All Archive <IconChevronRight size={14} />
        </Link>
      </div>

      <div className="recent-cuts-grid">
        {recentCuts.map((cut) => (
          <div key={cut.cutNum} className="recent-cut-card">
            <div className="recent-cut-meta">
              <span className="cut-badge">{cut.cutNum}</span>
              <span className="cut-date">{cut.date}</span>
            </div>
            <h4 className="cut-title-en">{cut.titleEn}</h4>
            <p className="cut-title-kr">{cut.titleKr}</p>
            <div className="recent-cut-footer">
              <span className="solved-rate">Success: {cut.solvedPct}</span>
              <Link href={`/?date=${cut.date}`} className="play-cut-btn">
                Play Cut →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
