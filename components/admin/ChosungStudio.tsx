"use client";

import { useState } from "react";
import { extractChosung } from "@/lib/game/normalization";

export function ChosungStudio() {
  const [answerKr, setAnswerKr] = useState("폭싹 속았수다");
  const [answerEn, setAnswerEn] = useState("When Life Gives You Tangerines");
  const [chosung, setChosung] = useState("ㅍㅆ ㅅㅇㅅㄷ");
  const [category, setCategory] = useState("2025 드라마");
  const [aliases, setAliases] = useState(["폭싹 속았수다", "When Life Gives You Tangerines", "폭싹속았수다"]);
  const [newAlias, setNewAlias] = useState("");
  const [notice, setNotice] = useState("");

  function handleAutoChosung() {
    if (answerKr) {
      setChosung(extractChosung(answerKr));
      setNotice("초성이 자동으로 추출되었습니다.");
    }
  }

  function addAlias() {
    if (newAlias.trim() && !aliases.includes(newAlias.trim())) {
      setAliases([...aliases, newAlias.trim()]);
      setNewAlias("");
    }
  }

  function removeAlias(target: string) {
    setAliases(aliases.filter((a) => a !== target));
  }

  return (
    <div className="admin-studio-wrap">
      <div className="admin-title">
        <div>
          <span className="eyebrow">CHOSUNG STUDIO</span>
          <h1>초성 맞히기 퍼즐 편집기</h1>
        </div>
        <button type="button" className="primary" onClick={() => setNotice("초성 퍼즐이 저장되었습니다.")}>
          저장하기
        </button>
      </div>

      {notice && <p className="game-notice">{notice}</p>}

      <div className="studio-grid" style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "24px" }}>
        <div className="main-editor-card" style={{ background: "#fff", padding: "24px", borderRadius: "12px", border: "1px solid #e7e5e4" }}>
          <h3>원본 제목 및 초성 입력</h3>

          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "4px", fontWeight: 600 }}>정답 제목 (한글)</label>
            <div style={{ display: "flex", gap: "8px" }}>
              <input
                type="text"
                value={answerKr}
                onChange={(e) => setAnswerKr(e.target.value)}
                style={{ flex: 1, padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }}
              />
              <button type="button" className="secondary" onClick={handleAutoChosung} style={{ padding: "0 16px" }}>
                자동 초성 추출
              </button>
            </div>
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "4px", fontWeight: 600 }}>초성 (Initial Consonants)</label>
            <input
              type="text"
              value={chosung}
              onChange={(e) => setChosung(e.target.value)}
              style={{ width: "100%", padding: "12px", fontSize: "20px", fontWeight: "bold", textAlign: "center", borderRadius: "6px", border: "1px solid #ccc" }}
            />
          </div>

          <div style={{ marginTop: "24px" }}>
            <h4>허용 정답 별칭 (Aliases)</h4>
            <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
              <input
                type="text"
                value={newAlias}
                onChange={(e) => setNewAlias(e.target.value)}
                placeholder="추가할 별칭 입력"
                style={{ flex: 1, padding: "8px" }}
              />
              <button type="button" onClick={addAlias} style={{ padding: "0 16px" }}>추가</button>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {aliases.map((a) => (
                <span key={a} style={{ background: "#f1f5f9", padding: "4px 10px", borderRadius: "20px", fontSize: "14px", display: "inline-flex", alignItems: "center", gap: "6px" }}>
                  {a}
                  <button type="button" onClick={() => removeAlias(a)} style={{ border: "none", background: "none", cursor: "pointer", color: "#94a3b8" }}>×</button>
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="sidebar-card" style={{ background: "#fff", padding: "24px", borderRadius: "12px", border: "1px solid #e7e5e4" }}>
          <h3>카테고리 및 힌트</h3>
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "4px" }}>카테고리</label>
            <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} style={{ width: "100%", padding: "8px" }} />
          </div>
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "4px" }}>영문 제목</label>
            <input type="text" value={answerEn} onChange={(e) => setAnswerEn(e.target.value)} style={{ width: "100%", padding: "8px" }} />
          </div>
        </div>
      </div>
    </div>
  );
}
