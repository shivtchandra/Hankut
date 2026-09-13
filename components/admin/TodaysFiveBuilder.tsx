"use client";

import { useState } from "react";

export function TodaysFiveBuilder() {
  const [targetDate, setTargetDate] = useState("2026-09-12");
  const [slots, setSlots] = useState([
    { slot: 1, type: "scene", title: "폭싹 속았수다 명장면", difficulty: 6.8 },
    { slot: 2, type: "song", title: "태연 - 그대라는 시 (호텔 델루나 OST)", difficulty: 5.4 },
    { slot: 3, type: "chosung", title: "나의 해방일지 (ㄴㅇ ㅎㅂㅇㅈ)", difficulty: 7.2 },
    { slot: 4, type: "connections", title: "제주도 배경 K-드라마 16카드", difficulty: 8.1 },
    { slot: 5, type: "people", title: "배우 박보검 인물 퍼즐", difficulty: 4.8 },
  ]);
  const [notice, setNotice] = useState("");

  const hasHighDiffStreak = slots.filter((s) => s.difficulty >= 7.0).length >= 3;
  const duplicateWarning = false;

  function publishDailyFive() {
    setNotice(`[${targetDate}] 오늘의 5 세트가 성공적으로 조합되어 발행되었습니다.`);
  }

  return (
    <div className="todays-five-builder">
      <div className="admin-title">
        <div>
          <span className="eyebrow">DAILY GAME BUILDER</span>
          <h1>오늘의 5 세트 구성기 (Today's 5)</h1>
        </div>
        <button type="button" className="primary" onClick={publishDailyFive}>
          {targetDate} 발행 확정
        </button>
      </div>

      {notice && <p className="game-notice">{notice}</p>}

      {hasHighDiffStreak && (
        <div style={{ background: "#fffbe6", border: "1px solid #ffe58f", padding: "12px 16px", borderRadius: "8px", marginBottom: "16px", color: "#d97706" }}>
          ⚠️ <strong>난이도 경고:</strong> 고난이도 퍼즐(7.0 이상)이 3개 이상 연속 배치되어 유저 이탈 위험이 있습니다.
        </div>
      )}

      <div style={{ background: "#fff", padding: "20px", borderRadius: "12px", border: "1px solid #e7e5e4", marginBottom: "20px" }}>
        <div style={{ display: "flex", gap: "16px", alignItems: "center", marginBottom: "20px" }}>
          <label style={{ fontWeight: 600 }}>발행 대상 날짜:</label>
          <input
            type="date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
            style={{ padding: "8px 12px", borderRadius: "6px", border: "1px solid #ccc" }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {slots.map((item, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "16px",
                background: "#f8fafc",
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <span style={{ fontSize: "18px", fontWeight: "bold", color: "#64748b" }}>0{item.slot}</span>
                <span style={{ background: "#1c1917", color: "#fff", padding: "4px 8px", borderRadius: "4px", fontSize: "12px" }}>
                  {item.type.toUpperCase()}
                </span>
                <strong style={{ fontSize: "16px" }}>{item.title}</strong>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ fontSize: "13px", color: "#64748b" }}>난이도: {item.difficulty}</span>
                <button type="button" className="secondary" style={{ padding: "4px 10px", fontSize: "12px" }}>
                  퍼즐 교체
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
