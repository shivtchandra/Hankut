"use client";

import { useRef, useState } from "react";
import type { ConnectionGroup, ConnectionItem, ConnectionsPayload } from "@/types/game";

type Props = {
  payload: ConnectionsPayload;
  onSolve?: (attemptsCount: number, timeSec: number) => void;
  onFail?: () => void;
};

export function ConnectionsGameView({ payload, onSolve, onFail }: Props) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [solvedGroups, setSolvedGroups] = useState<ConnectionGroup[]>([]);
  const [mistakesRemaining, setMistakesRemaining] = useState<number>(4);
  const [notice, setNotice] = useState("");
  const startTimeRef = useRef<number>(Date.now());

  const solvedItemIds = new Set(
    solvedGroups.flatMap((g) => g.items.map((i) => i.id))
  );

  const availableItems = payload.shuffledItems.filter(
    (item) => !solvedItemIds.has(item.id)
  );

  const isFinished = solvedGroups.length === 4 || mistakesRemaining <= 0;

  function toggleSelect(id: string) {
    if (isFinished || solvedItemIds.has(id)) return;
    if (selectedIds.includes(id)) {
      setSelectedIds((prev) => prev.filter((i) => i !== id));
    } else {
      if (selectedIds.length < 4) {
        setSelectedIds((prev) => [...prev, id]);
      }
    }
  }

  function submitSelection() {
    if (selectedIds.length !== 4 || isFinished) return;

    // Check if selected 4 items belong to the same group
    const selectedItems = payload.shuffledItems.filter((i) =>
      selectedIds.includes(i.id)
    );
    const groupIds = new Set(selectedItems.map((i) => i.groupId));

    if (groupIds.size === 1) {
      const matchedGroupId = Array.from(groupIds)[0];
      const matchedGroup = payload.groups.find((g) => g.id === matchedGroupId);
      if (matchedGroup) {
        const nextSolved = [...solvedGroups, matchedGroup];
        setSolvedGroups(nextSolved);
        setSelectedIds([]);
        setNotice(`정답! "${matchedGroup.label}" 연결고리를 찾았습니다.`);

        if (nextSolved.length === 4) {
          const timeSec = Math.round((Date.now() - startTimeRef.current) / 1000);
          onSolve?.(5 - mistakesRemaining, timeSec);
        }
      }
    } else {
      const nextMistakes = mistakesRemaining - 1;
      setMistakesRemaining(nextMistakes);
      setSelectedIds([]);

      // Check if 3 out of 4 belong to same group for "One away!" hint
      const groupCounts: Record<string, number> = {};
      selectedItems.forEach((i) => {
        groupCounts[i.groupId] = (groupCounts[i.groupId] || 0) + 1;
      });
      const hasThreeMatch = Object.values(groupCounts).includes(3);

      if (hasThreeMatch) {
        setNotice("아쉽습니다! 1개만 다른 그룹입니다.");
      } else {
        setNotice("틀렸습니다! 다시 시도해보세요.");
      }

      if (nextMistakes <= 0) {
        onFail?.();
      }
    }
  }

  function shuffleCurrent() {
    // visual shuffle handled locally
    setSelectedIds([]);
  }

  return (
    <div className="game-shell connections-shell">
      <div className="connections-header">
        <span className="eyebrow">오늘의 연결고리</span>
        <h2>16개의 단어를 4개씩 4그룹으로 묶어보세요</h2>
        <div className="mistakes-dots">
          <span>기회: </span>
          {[...Array(4)].map((_, i) => (
            <span
              key={i}
              className={`mistake-dot ${i < mistakesRemaining ? "active" : "used"}`}
            />
          ))}
        </div>
      </div>

      <div className="connections-grid">
        {/* Render Solved Groups */}
        {solvedGroups.map((group) => (
          <div key={group.id} className={`solved-group-card ${group.difficulty}`}>
            <h3>{group.label}</h3>
            <p>{group.items.map((i) => i.text).join(", ")}</p>
          </div>
        ))}

        {/* Render Remaining Grid Items */}
        {availableItems.map((item) => {
          const isSelected = selectedIds.includes(item.id);
          return (
            <button
              key={item.id}
              type="button"
              className={`conn-card ${isSelected ? "selected" : ""}`}
              onClick={() => toggleSelect(item.id)}
            >
              {item.text}
            </button>
          );
        })}
      </div>

      {notice && <div className="game-notice">{notice}</div>}

      <div className="conn-controls">
        <button
          type="button"
          className="secondary-btn"
          onClick={shuffleCurrent}
          disabled={isFinished}
        >
          섞기
        </button>
        <button
          type="button"
          className="secondary-btn"
          onClick={() => setSelectedIds([])}
          disabled={selectedIds.length === 0 || isFinished}
        >
          선택 해제
        </button>
        <button
          type="button"
          className="primary-btn"
          onClick={submitSelection}
          disabled={selectedIds.length !== 4 || isFinished}
        >
          제출 ({selectedIds.length}/4)
        </button>
      </div>

      {isFinished && solvedGroups.length < 4 && (
        <div className="result-card">
          <span className="eyebrow">정답 공개</span>
          {payload.groups.map((g) => (
            <div key={g.id} style={{ marginBottom: "12px" }}>
              <strong style={{ display: "block", color: "var(--accent-red)" }}>{g.label}</strong>
              <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.7)" }}>
                {g.items.map((i) => i.text).join(", ")}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
