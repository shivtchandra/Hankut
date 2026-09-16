"use client";

import { useState } from "react";
import { IconFlame, IconTrophy } from "@/components/icons/Icons";

export default function LeaderboardPage() {
  const [tab, setTab] = useState<"today" | "week" | "month" | "all">("today");

  const mockLeaderboard = [
    { rank: 1, name: "JejuTangerine (제주감귤)", score: 25, streak: 14, category: "Overall #1 · 전체 1위" },
    { rank: 2, name: "GuMr (구씨)", score: 24, streak: 9, category: "Scene Master · 장면 1위" },
    { rank: 3, name: "HotelOwner (호텔주인)", score: 24, streak: 11, category: "OST Master · 노래 1위" },
    { rank: 4, name: "Bongseok (봉석이)", score: 23, streak: 5, category: "Chosung Master · 초성 1위" },
    { rank: 5, name: "SamdalriDiver (삼달리해녀)", score: 22, streak: 7, category: "Connections · 연결고리 1위" },
    { rank: 6, name: "AnonKDramaFan (익명)", score: 21, streak: 3, category: "People Trivia · 인물 분야" },
    { rank: 7, name: "DramaFanatic (드라마폐인)", score: 20, streak: 6, category: "Scene Cut · 장면 분야" },
  ];

  return (
    <main className="leaderboard-page">
      <header className="topbar">
        <a href="/" className="brand">
          <span className="brand-mark">컷</span>
          <span className="brand-name">Leaderboard · 덕력 순위표</span>
        </a>
        <nav className="topnav">
          <a href="/">Today (오늘의 게임)</a>
          <a href="/archive">Archive (지난 장면)</a>
          <a href="/leaderboard" className="active">Leaderboard (덕력 순위)</a>
          <a href="/profile">Profile (나의 기록)</a>
        </nav>
      </header>

      <section className="leaderboard-content">
        <div className="leaderboard-header-meta">
          <span className="eyebrow">LEADERBOARD · 덕력 순위표</span>
          <h1>K-Culture Top Players <span style={{ fontSize: "24px", color: "var(--muted)", fontWeight: 400 }}>· 최고 덕후 순위</span></h1>
          <p>
            Rankings calculated daily based on speed, attempts, and zero-hint bonus points.
            <br />
            <span style={{ fontSize: "13px", color: "var(--muted)" }}>
              매일 시도 횟수, 힌트 미사용 여부, 빠른 해결 시간을 계산하여 산출된 공정한 순위입니다.
            </span>
          </p>
        </div>

        <div className="tab-bar">
          <button
            type="button"
            className={tab === "today" ? "active" : ""}
            onClick={() => setTab("today")}
          >
            Today (오늘)
          </button>
          <button
            type="button"
            className={tab === "week" ? "active" : ""}
            onClick={() => setTab("week")}
          >
            This Week (이번 주)
          </button>
          <button
            type="button"
            className={tab === "month" ? "active" : ""}
            onClick={() => setTab("month")}
          >
            This Month (이번 달)
          </button>
          <button
            type="button"
            className={tab === "all" ? "active" : ""}
            onClick={() => setTab("all")}
          >
            All-Time (명예의 전당)
          </button>
        </div>

        <div className="leaderboard-table-card">
          <table className="lb-table">
            <thead>
              <tr>
                <th>Rank (순위)</th>
                <th>Player (플레이어)</th>
                <th>Score (점수)</th>
                <th>Streak (연속)</th>
                <th>Specialty (주요 분야)</th>
              </tr>
            </thead>
            <tbody>
              {mockLeaderboard.map((item) => (
                <tr key={item.rank} className={item.rank <= 3 ? `top-${item.rank}` : ""}>
                  <td className="lb-rank">
                    {item.rank <= 3 ? (
                      <span className={`rank-badge rank-${item.rank}`}>
                        <IconTrophy size={14} style={{ marginRight: 4 }} />
                        #{item.rank}
                      </span>
                    ) : (
                      `#${item.rank}`
                    )}
                  </td>
                  <td className="lb-name">
                    <strong>{item.name}</strong>
                  </td>
                  <td className="lb-score">
                    <strong>{item.score} / 25 pts</strong>
                  </td>
                  <td className="lb-streak">
                    <IconFlame size={14} style={{ marginRight: 4, display: "inline-block", verticalAlign: "middle" }} />
                    {item.streak} days
                  </td>
                  <td className="lb-cat">{item.category}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
