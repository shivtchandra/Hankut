"use client";

import { useState } from "react";

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
        <div className="landing-guide-cards two-cards">
          <div className="guide-card">
            <div className="guide-card-num">01</div>
            <div className="guide-card-content">
              <h4>Watch the Cut · 장면 감상</h4>
              <p>
                Start with 1 cinematic frame. Each incorrect guess reveals the next frame (up to 5 frames).
              </p>
            </div>
          </div>

          <div className="guide-card">
            <div className="guide-card-num">02</div>
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
