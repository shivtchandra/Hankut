"use client";

import { useState } from "react";

export default function LeaderboardPage() {
  const [tab, setTab] = useState<"today" | "week" | "month" | "all">("today");

  const mockLeaderboard = [
    { rank: 1, name: "제주감귤", score: 25, streak: 14, category: "전체 덕력 1위" },
    { rank: 2, name: "구씨", score: 24, streak: 9, category: "장면 덕력 1위" },
    { rank: 3, name: "호텔주인", score: 24, streak: 11, category: "OST 덕력 1위" },
    { rank: 4, name: "봉석이", score: 23, streak: 5, category: "초성 덕력 1위" },
    { rank: 5, name: "삼달리해녀", score: 22, streak: 7, category: "연결고리 1위" },
    { rank: 6, name: "익명의덕후", score: 21, streak: 3, category: "인물 덕력" },
    { rank: 7, name: "드라마폐인", score: 20, streak: 6, category: "장면 덕력" },
  ];

  return (
    <main className="leaderboard-page">
      <header className="topbar">
        <a href="/" className="brand">
          <span className="brand-mark">순위</span>
          <span className="brand-name">전국 덕력 순위표</span>
        </a>
        <nav className="topnav">
          <a href="/">오늘의 게임</a>
          <a href="/archive">지난 장면</a>
          <a href="/leaderboard" className="active">덕력 순위</a>
          <a href="/profile">나의 기록</a>
        </nav>
      </header>

      <section className="leaderboard-content">
        <div className="leaderboard-header-meta">
          <span className="eyebrow">덕력 순위표</span>
          <h1>대한민국 최고의 한국 문화 덕후들</h1>
          <p>매일 시도 횟수, 힌트 미사용 여부, 빠른 해결 시간을 계산하여 산출된 공정한 순위입니다.</p>
        </div>

        <div className="tab-bar">
          <button
            type="button"
            className={tab === "today" ? "active" : ""}
            onClick={() => setTab("today")}
          >
            오늘의 덕력
          </button>
          <button
            type="button"
            className={tab === "week" ? "active" : ""}
            onClick={() => setTab("week")}
          >
            이번 주 Top 10
          </button>
          <button
            type="button"
            className={tab === "month" ? "active" : ""}
            onClick={() => setTab("month")}
          >
            이번 달 순위
          </button>
          <button
            type="button"
            className={tab === "all" ? "active" : ""}
            onClick={() => setTab("all")}
          >
            명예의 전당 (All-Time)
          </button>
        </div>

        <div className="leaderboard-table-card">
          <table className="lb-table">
            <thead>
              <tr>
                <th>순위</th>
                <th>플레이어</th>
                <th>덕력 점수</th>
                <th>연속 정답</th>
                <th>주요 분야</th>
              </tr>
            </thead>
            <tbody>
              {mockLeaderboard.map((item) => (
                <tr key={item.rank} className={item.rank <= 3 ? `top-${item.rank}` : ""}>
                  <td className="lb-rank">
                    {item.rank === 1 ? "🥇 1위" : item.rank === 2 ? "🥈 2위" : item.rank === 3 ? "🥉 3위" : `${item.rank}위`}
                  </td>
                  <td className="lb-name">
                    <strong>{item.name}</strong>
                  </td>
                  <td className="lb-score">
                    <strong>{item.score} / 25점</strong>
                  </td>
                  <td className="lb-streak">🔥 {item.streak}일</td>
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
