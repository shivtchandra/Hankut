"use client";

import { useState } from "react";
import Link from "next/link";
import { IconConnections, IconHangul, IconMusic, IconPeople, IconScene } from "@/components/icons/Icons";

export default function ArchivePage() {
  const [activeCategory, setActiveCategory] = useState("all");

  const mockPuzzles = [
    {
      id: "247",
      date: "2026-09-11",
      titleKr: "오늘의 장면 #247 (폭싹 속았수다)",
      titleEn: "Today's Cut #247 (When Life Gives You Tangerines)",
      category: "scene",
      categoryNameKr: "장면",
      categoryNameEn: "Scene",
      icon: IconScene,
      difficulty: 6.8,
      solveRate: "74%",
      solved: true,
    },
    {
      id: "246",
      date: "2026-09-10",
      titleKr: "오늘의 노래 #246 (태연 - 그대라는 시)",
      titleEn: "Today's Song #246 (Taeyeon - All About You)",
      category: "song",
      categoryNameKr: "노래",
      categoryNameEn: "Song",
      icon: IconMusic,
      difficulty: 5.4,
      solveRate: "82%",
      solved: true,
    },
    {
      id: "245",
      date: "2026-09-09",
      titleKr: "초성 맞히기 #245 (ㄴㅇ ㅎㅂㅇㅈ)",
      titleEn: "Chosung Guess #245 (My Liberation Notes)",
      category: "chosung",
      categoryNameKr: "초성",
      categoryNameEn: "Chosung",
      icon: IconHangul,
      difficulty: 7.2,
      solveRate: "61%",
      solved: false,
    },
    {
      id: "244",
      date: "2026-09-08",
      titleKr: "오늘의 연결고리 #244 (제주도 배경 드라마)",
      titleEn: "Connections #244 (Jeju Island Dramas)",
      category: "connections",
      categoryNameKr: "연결고리",
      categoryNameEn: "Connections",
      icon: IconConnections,
      difficulty: 8.1,
      solveRate: "49%",
      solved: false,
    },
    {
      id: "243",
      date: "2026-09-07",
      titleKr: "누구지? #243 (배우 박보검)",
      titleEn: "Who Is This? #243 (Park Bo-gum)",
      category: "people",
      categoryNameKr: "인물",
      categoryNameEn: "People",
      icon: IconPeople,
      difficulty: 4.8,
      solveRate: "89%",
      solved: true,
    },
  ];

  const filtered = activeCategory === "all"
    ? mockPuzzles
    : mockPuzzles.filter((p) => p.category === activeCategory);

  return (
    <main className="archive-page">
      <header className="topbar">
        <a href="/" className="brand">
          <span className="brand-mark">컷</span>
          <span className="brand-name">Archive · 지난 장면 및 퀴즈 모음</span>
        </a>
        <nav className="topnav">
          <a href="/">Today (오늘의 게임)</a>
          <a href="/archive" className="active">Archive (지난 장면)</a>
          <a href="/leaderboard">Leaderboard (덕력 순위)</a>
          <a href="/profile">Profile (나의 기록)</a>
        </nav>
      </header>

      <section className="archive-content">
        <div className="archive-header-meta">
          <span className="eyebrow">PAST PUZZLES · 지난 퍼즐</span>
          <h1>Puzzle Archive <span style={{ fontSize: "24px", color: "var(--muted)", fontWeight: 400 }}>· 퍼즐 아카이브</span></h1>
          <p>
            Play past scene cuts, OST songs, chosung, and trivia puzzles anytime.
            <br />
            <span style={{ fontSize: "13px", color: "var(--muted)" }}>
              지나간 날짜의 장면, 노래, 초성, 연결고리, 인물 퍼즐을 무제한으로 플레이할 수 있습니다.
            </span>
          </p>
        </div>

        <div className="category-filter-bar">
          {[
            { id: "all", label: "All (전체)", icon: null },
            { id: "scene", label: "Scene (장면)", icon: IconScene },
            { id: "song", label: "Song (노래)", icon: IconMusic },
            { id: "chosung", label: "Chosung (초성)", icon: IconHangul },
            { id: "connections", label: "Connections (연결고리)", icon: IconConnections },
            { id: "people", label: "People (인물)", icon: IconPeople },
          ].map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                type="button"
                className={`filter-chip ${activeCategory === cat.id ? "active" : ""}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                {Icon && <Icon size={14} style={{ marginRight: 6 }} />}
                {cat.label}
              </button>
            );
          })}
        </div>

        <div className="archive-grid">
          {filtered.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.id} className="archive-card">
                <div className="archive-card-header">
                  <span className="archive-category">
                    <Icon size={14} style={{ marginRight: 4, display: "inline-block", verticalAlign: "middle" }} />
                    {item.categoryNameEn} · {item.categoryNameKr}
                  </span>
                  <span className="archive-date">{item.date}</span>
                </div>
                <h3 className="archive-title">{item.titleEn}</h3>
                <p style={{ fontSize: "12px", color: "var(--muted)", marginTop: "-6px", marginBottom: "12px" }}>{item.titleKr}</p>
                <div className="archive-card-footer">
                  <span>Diff: {item.difficulty}</span>
                  <span>Pass: {item.solveRate}</span>
                  {item.solved ? (
                    <span className="solved-badge">Solved (완료)</span>
                  ) : (
                    <Link href={`/?date=${item.date}`} className="play-link">
                      Replay →
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
