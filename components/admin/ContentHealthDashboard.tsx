"use client";

import { useState } from "react";

export function ContentHealthDashboard() {
  const [issues, setIssues] = useState([
    { id: "1", type: "missing_frames", severity: "high", entity: "When Life Gives You Tangerines #scene-002", description: "Only 3 of 5 frames uploaded" },
    { id: "2", type: "missing_clues", severity: "medium", entity: "Taeyeon - That's The Way #song-001", description: "Only 1 hint configured" },
    { id: "3", type: "rights_review", severity: "high", entity: "My Liberation Notes #scene-004", description: "Rights review required" },
    { id: "4", type: "missing_alias", severity: "low", entity: "Our Blues #chosung-003", description: "English alias missing" },
  ]);

  const healthScore = Math.max(0, 100 - issues.length * 8);

  function resolveIssue(id: string) {
    setIssues(issues.filter((i) => i.id !== id));
  }

  return (
    <div className="admin-health-dashboard">
      <div className="admin-title">
        <div>
          <span className="eyebrow">QUALITY ASSURANCE</span>
          <h1>Content Health &amp; Rights Review</h1>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: "24px", marginTop: "20px" }}>
        <div className="health-score-card" style={{ background: "#fff", padding: "24px", borderRadius: "12px", border: "1px solid #e7e5e4", textAlign: "center" }}>
          <span style={{ fontSize: "14px", color: "#666" }}>CONTENT HEALTH SCORE</span>
          <div style={{ fontSize: "56px", fontWeight: "bold", color: healthScore >= 80 ? "#059669" : "#dc2626", margin: "12px 0" }}>
            {healthScore} <span style={{ fontSize: "20px", color: "#999" }}>/ 100</span>
          </div>
          <p style={{ fontSize: "13px", color: "#666" }}>
            {healthScore >= 80 ? "All puzzles and entities are in good shape." : "Issues detected — review below."}
          </p>
        </div>

        <div className="issues-list-card" style={{ background: "#fff", padding: "24px", borderRadius: "12px", border: "1px solid #e7e5e4" }}>
          <h3>Detected Issues ({issues.length})</h3>
          {issues.length === 0 ? (
            <p style={{ color: "#059669", fontWeight: "bold" }}>🎉 No issues detected — all content looks good!</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "16px" }}>
              {issues.map((issue) => (
                <div
                  key={issue.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "14px 18px",
                    borderRadius: "8px",
                    background: issue.severity === "high" ? "#fff5f5" : "#fffbe6",
                    border: `1px solid ${issue.severity === "high" ? "#fca5a5" : "#ffe58f"}`,
                  }}
                >
                  <div>
                    <strong style={{ display: "block", fontSize: "15px" }}>{issue.entity}</strong>
                    <span style={{ fontSize: "13px", color: "#666" }}>{issue.description}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => resolveIssue(issue.id)}
                    style={{
                      padding: "6px 14px",
                      background: "#1c1917",
                      color: "#fff",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                    }}
                  >
                    Resolve
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
