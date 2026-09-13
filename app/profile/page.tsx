"use client";

import { useEffect, useState } from "react";
import { getInitialDNA } from "@/lib/game/dna";
import { getStreak } from "@/lib/game/streak";
import type { KoreanCultureDNA } from "@/types/game";

export default function ProfilePage() {
  const [dna, setDna] = useState<KoreanCultureDNA>(getInitialDNA());
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    setStreak(getStreak());
  }, []);

  const dnaCategories = [
    { key: "drama", label: "🎬 드라마", value: dna.drama, color: "#DC2626" },
    { key: "music", label: "🎵 음악", value: dna.music, color: "#EA580C" },
    { key: "people", label: "👤 인물", value: dna.people, color: "#D97706" },
    { key: "culture", label: "🧩 문화", value: dna.culture, color: "#059669" },
    { key: "hangul", label: "🔤 한글", value: dna.hangul, color: "#2563EB" },
    { key: "place", label: "🏙️ 장소", value: dna.place, color: "#7C3AED" },
    { key: "food", label: "🍜 음식", value: dna.food, color: "#DB2777" },
  ];

  return (
    <main className="profile-page">
      <header className="topbar">
        <a href="/" className="brand">
          <span className="brand-mark">장면</span>
          <span className="brand-name">그 장면 뭐였지?</span>
        </a>
        <nav className="topnav">
          <a href="/">오늘의 게임</a>
          <a href="/archive">지난 장면</a>
          <a href="/leaderboard">덕력 순위</a>
          <a href="/profile" className="active">나의 기록</a>
        </nav>
      </header>

      <section className="profile-hero">
        <div className="profile-header-meta">
          <span className="eyebrow">나의 기록</span>
          <h1>한국 문화 DNA 분석</h1>
          <p className="profile-subtitle">
            내가 풀었던 무수한 드라마, 노래, 인물, 한글 퀴즈 기록이 담긴 나만의 콘텐츠 지수입니다.
          </p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-label">연속 정답</span>
            <strong className="stat-value">{streak}일</strong>
          </div>
          <div className="stat-card">
            <span className="stat-label">맞힌 맞춤 수</span>
            <strong className="stat-value">42개</strong>
          </div>
          <div className="stat-card">
            <span className="stat-label">평균 시도 횟수</span>
            <strong className="stat-value">2.4회</strong>
          </div>
          <div className="stat-card">
            <span className="stat-label">최고 덕력 순위</span>
            <strong className="stat-value">상위 5%</strong>
          </div>
        </div>

        <div className="dna-section">
          <h2>한국 문화 DNA 지수</h2>
          <div className="dna-list">
            {dnaCategories.map((cat) => (
              <div key={cat.key} className="dna-row">
                <div className="dna-row-label">
                  <span>{cat.label}</span>
                  <strong>{cat.value}점</strong>
                </div>
                <div className="dna-bar-track">
                  <div
                    className="dna-bar-fill"
                    style={{
                      width: `${cat.value}%`,
                      backgroundColor: cat.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="collection-section">
          <h2>내가 맞힌 대표 콘텐츠</h2>
          <div className="collection-grid">
            <div className="collection-card">
              <span className="cat-tag">드라마</span>
              <h3>폭싹 속았수다</h3>
              <p>2025 · 넷플릭스</p>
            </div>
            <div className="collection-card">
              <span className="cat-tag">노래</span>
              <h3>그대라는 시</h3>
              <p>태연 · 호텔 델루나 OST</p>
            </div>
            <div className="collection-card">
              <span className="cat-tag">드라마</span>
              <h3>나의 해방일지</h3>
              <p>2022 · JTBC</p>
            </div>
            <div className="collection-card">
              <span className="cat-tag">인물</span>
              <h3>박보검</h3>
              <p>배우 · 관식 역</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
