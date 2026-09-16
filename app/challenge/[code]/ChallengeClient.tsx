"use client";

import { useState } from "react";
import { TodaysFiveView } from "@/components/game/TodaysFiveView";
import { DEMO_TODAY_GAME } from "@/lib/demo-data";

type Player = {
  id: string;
  display_name: string | null;
  score: number | null;
  completed_at: string | null;
};

type Challenge = {
  id: string;
  invite_code: string;
  title: string | null;
  expires_at: string | null;
  status: string;
};

type Props = {
  code: string;
  challenge: Challenge;
  players: Player[];
};

export function ChallengeClient({ code, challenge, players }: Props) {
  const [guestName, setGuestName] = useState("");
  const [joined, setJoined] = useState(false);
  const [joining, setJoining] = useState(false);

  const ranked = [...players]
    .filter((p) => p.score !== null)
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
    .map((p, i) => ({ ...p, rank: i + 1 }));

  async function handleJoin(e: React.FormEvent) {
    e.preventDefault();
    if (!guestName.trim()) return;
    setJoining(true);
    try {
      await fetch(`/api/challenges/${code}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ displayName: guestName }),
      });
    } catch {
      // join failure is non-blocking
    }
    setJoining(false);
    setJoined(true);
  }

  if (!joined) {
    return (
      <main className="challenge-landing-page">
        <div className="challenge-modal-card">
          <span className="eyebrow">친구의 덕력 대결 초대</span>
          <h1>{challenge.title ?? "오늘의 한국 문화 대결"}</h1>
          <p className="challenge-desc">
            초대 코드: <strong>#{code}</strong>
            {challenge.expires_at && (
              <>
                <br />
                <span style={{ fontSize: "12px", color: "#999" }}>
                  만료:{" "}
                  {new Date(challenge.expires_at).toLocaleDateString("ko-KR")}
                </span>
              </>
            )}
          </p>

          {ranked.length > 0 && (
            <div className="challenge-room-leaderboard">
              <h3>현재 대결 순위표</h3>
              <ul>
                {ranked.slice(0, 5).map((item) => (
                  <li key={item.id}>
                    <span className="rank">{item.rank}위</span>
                    <strong className="name">
                      {item.display_name ?? "익명"}
                    </strong>
                    <span className="score">{item.score}점</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <form onSubmit={handleJoin} className="guest-join-form">
            <input
              type="text"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              placeholder="대결에서 사용할 닉네임 입력"
              required
            />
            <button type="submit" className="primary-btn" disabled={joining}>
              {joining ? "참가 중..." : "대결 시작하기"}
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="game-page">
      <header className="topbar">
        <a href="/" className="brand">
          <span className="brand-mark">대결</span>
          <span className="brand-name">친구 대결 중 ({guestName})</span>
        </a>
      </header>
      <section className="play-stage">
        <TodaysFiveView todaysFive={DEMO_TODAY_GAME.todaysFive!} dramas={[]} />
      </section>
    </main>
  );
}
