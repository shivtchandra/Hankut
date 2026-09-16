"use client";

import { useState } from "react";
import { extractChosung } from "@/lib/game/normalization";

export function ChosungStudio() {
  const [answerKr, setAnswerKr] = useState("");
  const [answerEn, setAnswerEn] = useState("");
  const [chosung, setChosung] = useState("");
  const [category, setCategory] = useState("2025 Drama");
  const [aliases, setAliases] = useState<string[]>([]);
  const [newAlias, setNewAlias] = useState("");
  const [notice, setNotice] = useState("");

  function handleAutoChosung() {
    if (answerKr) {
      setChosung(extractChosung(answerKr));
      setNotice("Consonants extracted.");
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
    <div>
      <div className="admin-title">
        <div>
          <span className="eyebrow">CHOSUNG STUDIO</span>
          <h1>Chosung Puzzle</h1>
          <p className="muted">Korean consonant guessing puzzle</p>
        </div>
        <button type="button" className="primary" onClick={() => setNotice("Saved.")}>
          Save
        </button>
      </div>

      {notice && (
        <div style={{ padding: "10px 14px", borderRadius: "var(--radius-md)", marginBottom: 16, background: "var(--paper-soft)", fontSize: 13, color: "var(--muted)" }}>
          {notice}
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 600 }}>

        <div className="admin-card" style={{ padding: "16px 20px" }}>
          <label style={{ display: "block", marginBottom: 6, fontWeight: 600, fontSize: 13 }}>Answer (Korean)</label>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              value={answerKr}
              onChange={(e) => setAnswerKr(e.target.value)}
              placeholder="e.g. 폭싹 속았수다"
              style={{ flex: 1, padding: "8px 12px", borderRadius: "var(--radius-sm)", border: "1px solid var(--line)", fontSize: 14 }}
            />
            <button type="button" className="secondary" onClick={handleAutoChosung}>
              Auto-extract
            </button>
          </div>
        </div>

        <div className="admin-card" style={{ padding: "16px 20px" }}>
          <label style={{ display: "block", marginBottom: 6, fontWeight: 600, fontSize: 13 }}>Consonants shown to player</label>
          <input
            value={chosung}
            onChange={(e) => setChosung(e.target.value)}
            placeholder="e.g. ㅍㅆ ㅅㅇㅅㄷ"
            style={{ width: "100%", padding: "12px", fontSize: 22, fontWeight: 700, textAlign: "center", borderRadius: "var(--radius-sm)", border: "1px solid var(--line)", fontFamily: "'DM Mono', monospace", boxSizing: "border-box" }}
          />
        </div>

        <div className="admin-card" style={{ padding: "16px 20px" }}>
          <label style={{ display: "block", marginBottom: 6, fontWeight: 600, fontSize: 13 }}>English title</label>
          <input
            value={answerEn}
            onChange={(e) => setAnswerEn(e.target.value)}
            placeholder="e.g. When Life Gives You Tangerines"
            style={{ width: "100%", padding: "8px 12px", borderRadius: "var(--radius-sm)", border: "1px solid var(--line)", fontSize: 14 }}
          />
        </div>

        <div className="admin-card" style={{ padding: "16px 20px" }}>
          <label style={{ display: "block", marginBottom: 6, fontWeight: 600, fontSize: 13 }}>Category</label>
          <input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{ width: "100%", padding: "8px 12px", borderRadius: "var(--radius-sm)", border: "1px solid var(--line)", fontSize: 14 }}
          />
        </div>

        <div className="admin-card" style={{ padding: "16px 20px" }}>
          <label style={{ display: "block", marginBottom: 10, fontWeight: 600, fontSize: 13 }}>Accepted aliases</label>
          <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
            <input
              value={newAlias}
              onChange={(e) => setNewAlias(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addAlias()}
              placeholder="Add alias…"
              style={{ flex: 1, padding: "8px 12px", borderRadius: "var(--radius-sm)", border: "1px solid var(--line)", fontSize: 13 }}
            />
            <button type="button" className="secondary" onClick={addAlias}>Add</button>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {aliases.map((a) => (
              <span key={a} style={{ background: "var(--paper-soft)", padding: "4px 10px", borderRadius: 20, fontSize: 13, display: "inline-flex", alignItems: "center", gap: 6 }}>
                {a}
                <button type="button" onClick={() => removeAlias(a)} style={{ border: "none", background: "none", cursor: "pointer", color: "var(--muted)", fontSize: 14 }}>×</button>
              </span>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
