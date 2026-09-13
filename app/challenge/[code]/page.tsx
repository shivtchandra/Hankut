"use client";

import { use, useState } from "react";
import { DEMO_TODAY_GAME } from "@/lib/demo-data";
import { TodaysFiveView } from "@/components/game/TodaysFiveView";

type Props = {
  params: Promise<{ code: string }>;
};

export default function ChallengePage({ params }: Props) {
  const { code } = use(params);
  const [guestName, setGuestName] = useState("");
  const [joined, setJoined] = useState(false);

  const mockLeaderboard = [
    { rank: 1, name: "민지", score: 23, attempts: 1 },
    { rank: 2, name: "준호", score: 21, attempts: 2 },
    { rank: 3, name: "서연", score: 19, attempts: 3 },
  ];

  if (!joined) {
    return (
      <main className="challenge-landing-page">
        <div className="challenge-modal-card">
          <span className="eyebrow">친구의 덕력 대결 초대</span>
          <h1>오늘의 한국 문화 대결</h1>
          <p className="challenge-desc">
            초대 코드: <strong>#{code}</strong>
            <br />
            친구들이 기록한 점수를 깨고 1위를 차지해보세요!
          </p>

          <div className="challenge-room-leaderboard">
            <h3>현재 대결 순위표</h3>
            <ul>
              {mockLeaderboard.map((item) => (
                <li key={item.rank}>
                  <span className="rank">{item.rank}위</span>
                  <strong className="name">{item.name}</strong>
                  <span className="score">{item.score}점</span>
                </li>
              ))}
            </ul>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (guestName.trim()) setJoined(true);
            }}
            className="guest-join-form"
          >
            <input
              type="text"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              placeholder="대결에서 사용할 닉네임 입력"
              required
            />
            <button type="submit" className="primary-btn">
              대결 시작하기
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
