"use client";

import { useState } from "react";
import { validateConnectionsPuzzle } from "@/lib/game/connections";
import { DEMO_CONNECTIONS_PAYLOAD } from "@/lib/demo-data";
import type { ConnectionGroup } from "@/types/game";

export function ConnectionStudio() {
  const [title, setTitle] = useState(DEMO_CONNECTIONS_PAYLOAD.title);
  const [groups, setGroups] = useState<ConnectionGroup[]>(DEMO_CONNECTIONS_PAYLOAD.groups);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [notice, setNotice] = useState("");

  function validate() {
    const res = validateConnectionsPuzzle({ title, groups });
    if (res.isValid) {
      setValidationErrors([]);
      setNotice("✅ 퍼즐 구조 검증 성공! (16개 카드, 4개 그룹, 중복 없음)");
    } else {
      setValidationErrors(res.errors);
      setNotice("");
    }
  }

  return (
    <div className="admin-studio-wrap">
      <div className="admin-title">
        <div>
          <span className="eyebrow">CONNECTION STUDIO</span>
          <h1>연결고리 16카드 편집기</h1>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <button type="button" className="secondary" onClick={validate}>
            퍼즐 검증하기 (Validate)
          </button>
          <button type="button" className="primary" onClick={() => setNotice("저장 및 발행되었습니다.")}>
            저장 및 발행
          </button>
        </div>
      </div>

      {notice && <p className="game-notice" style={{ color: "#059669" }}>{notice}</p>}

      {validationErrors.length > 0 && (
        <div style={{ background: "#fef2f2", border: "1px solid #fca5a5", padding: "16px", borderRadius: "8px", marginBottom: "20px" }}>
          <h4 style={{ color: "#dc2626", margin: "0 0 8px 0" }}>⚠️ 검증 오류 목록</h4>
          <ul style={{ margin: 0, paddingLeft: "20px", color: "#b91c1c" }}>
            {validationErrors.map((err, idx) => (
              <li key={idx}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
        {groups.map((group, groupIdx) => (
          <div key={group.id} style={{ background: "#fff", padding: "20px", borderRadius: "10px", border: "1px solid #e7e5e4" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
              <strong style={{ fontSize: "16px" }}>그룹 {groupIdx + 1} ({group.difficulty.toUpperCase()})</strong>
            </div>

            <div style={{ marginBottom: "12px" }}>
              <label style={{ display: "block", fontSize: "12px", marginBottom: "4px" }}>그룹 제목 (정답 공통점)</label>
              <input
                type="text"
                value={group.label}
                onChange={(e) => {
                  const next = [...groups];
                  next[groupIdx].label = e.target.value;
                  setGroups(next);
                }}
                style={{ width: "100%", padding: "8px" }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "12px", marginBottom: "4px" }}>포함 단어 카드 (4개)</label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                {group.items.map((item, itemIdx) => (
                  <input
                    key={item.id}
                    type="text"
                    value={item.text}
                    onChange={(e) => {
                      const next = [...groups];
                      next[groupIdx].items[itemIdx].text = e.target.value;
                      setGroups(next);
                    }}
                    style={{ padding: "8px" }}
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
