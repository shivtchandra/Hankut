"use client";

import { useLocale } from "@/components/i18n/LocaleProvider";
import { useRef, useState } from "react";
import type { ConnectionGroup, ConnectionItem, ConnectionsPayload } from "@/types/game";

type Props = {
  payload: ConnectionsPayload;
  onSolve?: (attemptsCount: number, timeSec: number) => void;
  onFail?: () => void;
};

export function ConnectionsGameView({ payload, onSolve, onFail }: Props) {
  const { locale, t } = useLocale();
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
        setNotice(
          locale === "ko"
            ? `정답! "${matchedGroup.label}" 연결고리를 찾았습니다.`
            : `Correct! Group "${matchedGroup.label}" found.`
        );

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
        setNotice(
          locale === "ko"
            ? "아쉽습니다! 1개만 다른 그룹입니다."
            : "One away! Only 1 item is from a different group."
        );
      } else {
        setNotice(
          locale === "ko"
            ? "틀렸습니다! 다시 시도해보세요."
            : "Incorrect! Try again."
        );
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
        <span className="eyebrow">{t("connectionsTitle")}</span>
        <h2>{t("connectionsPrompt")}</h2>
        <div className="mistakes-dots">
          <span>{t("chances")}: </span>
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
        {solvedGroups.map((group) => {
          const groupTitle = locale === "en" ? (group.labelEn || group.label) : group.label;
          const groupSub = locale === "en" ? (group.labelEn ? group.label : "") : (group.labelEn || "");
          return (
            <div key={group.id} className={`solved-group-card ${group.difficulty}`}>
              <h3>
                {groupTitle}
                {groupSub && (
                  <span style={{ fontSize: "12px", opacity: 0.8, marginLeft: "8px", fontWeight: 400 }}>
                    ({groupSub})
                  </span>
                )}
              </h3>
              <p>
                {group.items
                  .map((i) => (locale === "en" ? (i.textEn || i.text) : `${i.text}${i.textEn ? ` (${i.textEn})` : ""}`))
                  .join(", ")}
              </p>
            </div>
          );
        })}

        {/* Render Remaining Grid Items */}
        {availableItems.map((item) => {
          const isSelected = selectedIds.includes(item.id);
          const primaryText = locale === "en" ? (item.textEn || item.text) : item.text;
          const secondaryText = locale === "en" ? (item.textEn ? item.text : "") : (item.textEn || "");

          return (
            <button
              key={item.id}
              type="button"
              className={`conn-card ${isSelected ? "selected" : ""}`}
              onClick={() => toggleSelect(item.id)}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                padding: "10px 8px",
                gap: "3px",
              }}
            >
              <span style={{ fontSize: "14px", fontWeight: 700, lineHeight: 1.25 }}>
                {primaryText}
              </span>
              {secondaryText && (
                <span style={{ fontSize: "11px", fontWeight: 500, opacity: isSelected ? 0.85 : 0.65, lineHeight: 1.2 }}>
                  {secondaryText}
                </span>
              )}
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
          {t("shuffle")}
        </button>
        <button
          type="button"
          className="secondary-btn"
          onClick={() => setSelectedIds([])}
          disabled={selectedIds.length === 0 || isFinished}
        >
          {t("deselect")}
        </button>
        <button
          type="button"
          className="primary-btn"
          onClick={submitSelection}
          disabled={selectedIds.length !== 4 || isFinished}
        >
          {t("submit")} ({selectedIds.length}/4)
        </button>
      </div>

      {isFinished && solvedGroups.length < 4 && (
        <div className="result-card">
          <span className="eyebrow">{t("answerReveal")}</span>
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
