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
      title: "오늘의 장면 #247 (폭싹 속았수다)",
      category: "scene",
      categoryName: "장면",
      icon: IconScene,
      difficulty: 6.8,
      solveRate: "74%",
      solved: true,
    },
    {
      id: "246",
      date: "2026-09-10",
      title: "오늘의 노래 #246 (태연 - 그대라는 시)",
      category: "song",
      categoryName: "노래",
      icon: IconMusic,
      difficulty: 5.4,
      solveRate: "82%",
      solved: true,
    },
    {
      id: "245",
      date: "2026-09-09",
      title: "초성 맞히기 #245 (ㄴㅇ ㅎㅂㅇㅈ)",
      category: "chosung",
      categoryName: "초성",
      icon: IconHangul,
      difficulty: 7.2,
      solveRate: "61%",
      solved: false,
    },
    {
      id: "244",
      date: "2026-09-08",
      title: "오늘의 연결고리 #244 (제주도 배경 드라마)",
      category: "connections",
      categoryName: "연결고리",
      icon: IconConnections,
      difficulty: 8.1,
      solveRate: "49%",
      solved: false,
    },
    {
      id: "243",
      date: "2026-09-07",
      title: "누구지? #243 (배우 박보검)",
      category: "people",
      categoryName: "인물",
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
          <span className="brand-mark">아카이브</span>
          <span className="brand-name">지난 장면 및 퀴즈 모음</span>
        </a>
        <nav className="topnav">
          <a href="/">오늘의 게임</a>
          <a href="/archive" className="active">지난 장면</a>
          <a href="/leaderboard">덕력 순위</a>
          <a href="/profile">나의 기록</a>
        </nav>
      </header>

      <section className="archive-content">
        <div className="archive-header-meta">
          <span className="eyebrow">지난 퍼즐</span>
          <h1>퍼즐 아카이브</h1>
          <p>지나간 날짜의 장면, 노래, 초성, 연결고리, 인물 퍼즐을 제한 없이 무제한으로 플레이할 수 있습니다.</p>
        </div>

        <div className="category-filter-bar">
          {[
            { id: "all", label: "전체 퍼즐", icon: null },
            { id: "scene", label: "장면", icon: IconScene },
            { id: "song", label: "노래", icon: IconMusic },
            { id: "chosung", label: "초성", icon: IconHangul },
            { id: "connections", label: "연결고리", icon: IconConnections },
            { id: "people", label: "인물", icon: IconPeople },
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
                    {item.categoryName}
                  </span>
                  <span className="archive-date">{item.date}</span>
                </div>
                <h3 className="archive-title">{item.title}</h3>
                <div className="archive-card-footer">
                  <span>난이도 {item.difficulty}</span>
                  <span>정답률 {item.solveRate}</span>
                  {item.solved ? (
                    <span className="solved-badge">정답 완료</span>
                  ) : (
                    <Link href={`/?date=${item.date}`} className="play-link">
                      다시 풀기 →
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
