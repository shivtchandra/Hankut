"use client";

import { useState } from "react";

export function AudioStudio() {
  const [title, setTitle] = useState("그대라는 시");
  const [artist, setArtist] = useState("태연");
  const [dramaTitle, setDramaTitle] = useState("호텔 델루나");
  const [segments, setSegments] = useState<number[]>([1, 2, 4, 7, 12]);
  const [audioUrl, setAudioUrl] = useState("https://actions.google.com/sounds/v1/ambiences/outdoor_park.ogg");
  const [rightsStatus, setRightsStatus] = useState("approved");
  const [notice, setNotice] = useState("");

  function saveAudioPuzzle() {
    setNotice("오디오 퍼즐이 저장 및 발행되었습니다.");
  }

  return (
    <div className="admin-studio-wrap">
      <div className="admin-title">
        <div>
          <span className="eyebrow">AUDIO STUDIO</span>
          <h1>오늘의 노래 (오디오 퍼즐) 편집기</h1>
        </div>
        <button type="button" className="primary" onClick={saveAudioPuzzle}>
          저장 및 발행
        </button>
      </div>

      {notice && <p className="game-notice">{notice}</p>}

      <div className="studio-grid" style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "24px" }}>
        <div className="main-editor-card" style={{ background: "var(--card-bg, #fff)", padding: "24px", borderRadius: "12px", border: "1px solid var(--border-stone-200, #e7e5e4)" }}>
          <h3>오디오 음원 및 구간 설정</h3>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: 600 }}>오디오 파일 URL</label>
            <input
              type="text"
              value={audioUrl}
              onChange={(e) => setAudioUrl(e.target.value)}
              style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: 600 }}>단계별 오디오 재생 구간 (초 단위)</label>
            <div style={{ display: "flex", gap: "12px" }}>
              {segments.map((sec, idx) => (
                <div key={idx} style={{ textAlign: "center" }}>
                  <span style={{ fontSize: "12px", display: "block", color: "#666" }}>단계 {idx + 1}</span>
                  <input
                    type="number"
                    value={sec}
                    onChange={(e) => {
                      const next = [...segments];
                      next[idx] = Number(e.target.value);
                      setSegments(next);
                    }}
                    style={{ width: "60px", padding: "8px", textAlign: "center", borderRadius: "6px", border: "1px solid #ccc" }}
                  />
                </div>
              ))}
            </div>
          </div>

          <div style={{ padding: "16px", background: "#f8fafc", borderRadius: "8px", marginTop: "24px" }}>
            <h4 style={{ margin: "0 0 12px 0" }}>오디오 바로 듣기 테스트</h4>
            <audio controls src={audioUrl} style={{ width: "100%" }} />
          </div>
        </div>

        <div className="sidebar-card" style={{ background: "var(--card-bg, #fff)", padding: "24px", borderRadius: "12px", border: "1px solid var(--border-stone-200, #e7e5e4)" }}>
          <h3>메타데이터 및 저작권</h3>
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "4px" }}>곡 제목 (한글)</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} style={{ width: "100%", padding: "8px" }} />
          </div>
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "4px" }}>가수 이름</label>
            <input type="text" value={artist} onChange={(e) => setArtist(e.target.value)} style={{ width: "100%", padding: "8px" }} />
          </div>
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "4px" }}>삽입 드라마 / 영화</label>
            <input type="text" value={dramaTitle} onChange={(e) => setDramaTitle(e.target.value)} style={{ width: "100%", padding: "8px" }} />
          </div>
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "4px" }}>저작권 권리 상태</label>
            <select value={rightsStatus} onChange={(e) => setRightsStatus(e.target.value)} style={{ width: "100%", padding: "8px" }}>
              <option value="review_required">검토 필요 (Review Required)</option>
              <option value="approved">승인 완료 (Approved)</option>
              <option value="restricted">제한됨 (Restricted)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
