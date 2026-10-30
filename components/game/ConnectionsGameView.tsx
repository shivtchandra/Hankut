"use client";

import { useLocale } from "@/components/i18n/LocaleProvider";
import { useEffect, useRef, useState } from "react";
import { IconShare } from "@/components/icons/Icons";
import { shareOrCopy } from "@/lib/game/share";
import { seoulToday } from "@/lib/game/dates";
import type { ConnectionGroup, ConnectionItem, ConnectionsPayload } from "@/types/game";

type Props = {
  payload: ConnectionsPayload;
  gameDate?: string;
  onSolve?: (attemptsCount: number, timeSec: number) => void;
  onFail?: () => void;
};

export function ConnectionsGameView({ payload, gameDate, onSolve, onFail }: Props) {
  const { locale, t } = useLocale();
  const [items, setItems] = useState<ConnectionItem[]>(payload.shuffledItems);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [solvedGroups, setSolvedGroups] = useState<ConnectionGroup[]>([]);
  const [mistakesRemaining, setMistakesRemaining] = useState<number>(4);
  const [history, setHistory] = useState<string[][]>([]);
  const [notice, setNotice] = useState("");
  const [shareNotice, setShareNotice] = useState("");
  const startTimeRef = useRef<number>(Date.now());

  // Reset when payload changes
  useEffect(() => {
    setItems([...payload.shuffledItems].sort(() => Math.random() - 0.5));
    setSelectedIds([]);
    setSolvedGroups([]);
    setMistakesRemaining(4);
    setHistory([]);
    setNotice("");
    setShareNotice("");
    startTimeRef.current = Date.now();
  }, [payload.id, payload.shuffledItems]);

  const solvedItemIds = new Set(
    solvedGroups.flatMap((g) => g.items.map((i) => i.id))
  );

  const availableItems = items.filter(
    (item) => !solvedItemIds.has(item.id)
  );

  const isWon = solvedGroups.length === 4;
  const isLost = mistakesRemaining <= 0;
  const isFinished = isWon || isLost;

  // Calculate Points:
  // 0 mistakes = 25 pts (Perfect)
  // 1 mistake  = 20 pts
  // 2 mistakes = 15 pts
  // 3 mistakes = 10 pts
  // 4 mistakes (Lost) = 0 pts
  const mistakesUsed = 4 - mistakesRemaining;
  const pointsEarned = isWon
    ? mistakesUsed === 0
      ? 25
      : mistakesUsed === 1
      ? 20
      : mistakesUsed === 2
      ? 15
      : 10
    : 0;

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

    const selectedItems = payload.shuffledItems.filter((i) =>
      selectedIds.includes(i.id)
    );

    // Record emoji row for share grid
    const emojiRow = selectedItems.map((i) => {
      const g = payload.groups.find((grp) => grp.id === i.groupId);
      if (g?.difficulty === "easy") return "🟨";
      if (g?.difficulty === "medium") return "🟩";
      if (g?.difficulty === "hard") return "🟦";
      return "🟪";
    });
    setHistory((prev) => [...prev, emojiRow]);

    const groupIds = new Set(selectedItems.map((i) => i.groupId));

    if (groupIds.size === 1) {
      const matchedGroupId = Array.from(groupIds)[0];
      const matchedGroup = payload.groups.find((g) => g.id === matchedGroupId);
      if (matchedGroup) {
        const nextSolved = [...solvedGroups, matchedGroup];
        setSolvedGroups(nextSolved);
        setSelectedIds([]);
        const groupLabel = locale === "en" ? (matchedGroup.labelEn || matchedGroup.label) : matchedGroup.label;
        setNotice(
          locale === "ko"
            ? `정답! "${groupLabel}" 연결고리를 찾았습니다.`
            : `Correct! Group "${groupLabel}" found.`
        );

        if (nextSolved.length === 4) {
          const timeSec = Math.round((Date.now() - startTimeRef.current) / 1000);
          onSolve?.(mistakesUsed + 1, timeSec);
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
            ? "아쉽습니다! 1개 드라마만 다른 그룹입니다."
            : "One away! 3 are correct, only 1 is from a different group."
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
    if (isFinished) return;
    setItems((prev) => {
      const solved = prev.filter((item) => solvedItemIds.has(item.id));
      const unsolved = prev.filter((item) => !solvedItemIds.has(item.id));
      const shuffled = [...unsolved].sort(() => Math.random() - 0.5);
      return [...solved, ...shuffled];
    });
    setSelectedIds([]);
  }

  // Handle Share result
  async function handleShare() {
    const activeDate = gameDate || seoulToday();
    const gridText = history.map((row) => row.join("")).join("\n");
    const title = locale === "ko" ? "Dramacut 데일리 커넥션" : "Dramacut Daily Connections";
    const statusText = isWon
      ? locale === "ko"
        ? `성공! ${pointsEarned}/25점 (실수 ${mistakesUsed}회)`
        : `Solved! ${pointsEarned}/25 pts (${mistakesUsed} mistake${mistakesUsed === 1 ? "" : "s"})`
      : locale === "ko"
      ? "실패! 4번의 기회 소진"
      : "X/4 (Game Over)";

    const shareBody = `${title} (${activeDate})\n${statusText}\n\n${gridText}\n\nhttps://hankut.shivachandra.work/`;

    const outcome = await shareOrCopy({
      title,
      text: shareBody,
      url: "https://hankut.shivachandra.work/",
    });

    setShareNotice(outcome === "copied" ? (locale === "ko" ? "결과가 클립보드에 복사되었습니다!" : "Result copied to clipboard!") : "");
    if (outcome === "copied") setTimeout(() => setShareNotice(""), 3000);
  }

  // Find remaining unsolved groups for reveal on loss
  const unsolvedGroups = payload.groups.filter(
    (g) => !solvedGroups.some((sg) => sg.id === g.id)
  );

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
                  <span style={{ fontSize: "12px", opacity: 0.85, marginLeft: "8px", fontWeight: 400 }}>
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

        {/* If Lost: Show remaining groups */}
        {isLost &&
          unsolvedGroups.map((group) => {
            const groupTitle = locale === "en" ? (group.labelEn || group.label) : group.label;
            return (
              <div key={group.id} className={`solved-group-card ${group.difficulty}`} style={{ opacity: 0.9 }}>
                <h3>{groupTitle} (Answer)</h3>
                <p>
                  {group.items
                    .map((i) => (locale === "en" ? (i.textEn || i.text) : `${i.text}${i.textEn ? ` (${i.textEn})` : ""}`))
                    .join(", ")}
                </p>
              </div>
            );
          })}

        {/* Render Remaining Grid Items (if not finished) */}
        {!isLost &&
          availableItems.map((item) => {
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
                  cursor: isFinished ? "default" : "pointer",
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
      {shareNotice && (
        <div className="game-notice" style={{ background: "#FEF3C7", color: "#92400E" }}>
          {shareNotice}
        </div>
      )}

      {/* Control Buttons */}
      {!isFinished && (
        <div className="conn-controls">
          <button
            type="button"
            className="secondary-btn"
            onClick={shuffleCurrent}
            disabled={isFinished}
          >
            🔀 {t("shuffle")}
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
      )}

      {/* Victory / Result Card */}
      {isFinished && (
        <div className="result-card" style={{ marginTop: "20px", padding: "20px", borderRadius: "14px", border: "1px solid var(--line)", background: "#fff", textAlign: "center" }}>
          <span className="eyebrow" style={{ color: isWon ? "#16A34A" : "#DC2626", fontWeight: 700 }}>
            {isWon
              ? locale === "ko"
                ? "🎉 축하합니다! 모든 연결고리 완성"
                : "🎉 CONGRATULATIONS! ALL 4 GROUPS SOLVED"
              : locale === "ko"
              ? "아쉽네요! 기회를 모두 소진했습니다"
              : "GAME OVER · ALL CHANCES USED"}
          </span>

          <div style={{ margin: "14px 0" }}>
            <div style={{ fontSize: "32px", fontWeight: 800, color: "var(--ink)", fontFamily: "var(--font-mono, monospace)" }}>
              {pointsEarned} <span style={{ fontSize: "18px", color: "var(--muted)", fontWeight: 600 }}>/ 25 PTS</span>
            </div>
            <p style={{ margin: "4px 0 0 0", fontSize: "14px", color: "var(--muted)" }}>
              {isWon
                ? mistakesUsed === 0
                  ? locale === "ko"
                    ? "완벽한 플레이! 실수 0회 (만점 25점)"
                    : "Perfect Solve! 0 mistakes (Max 25 pts)"
                  : locale === "ko"
                  ? `${mistakesUsed}회 오답 후 성공`
                  : `Solved with ${mistakesUsed} mistake${mistakesUsed === 1 ? "" : "s"}`
                : locale === "ko"
                ? "정답이 위에 공개되었습니다."
                : "The correct groups are revealed above."}
            </p>
          </div>

          {/* Emoji Grid Preview */}
          {history.length > 0 && (
            <div style={{ margin: "12px auto", padding: "8px 12px", background: "var(--paper-soft)", borderRadius: "8px", display: "inline-block", fontSize: "18px", letterSpacing: "2px", lineHeight: 1.4 }}>
              {history.map((row, idx) => (
                <div key={idx}>{row.join("")}</div>
              ))}
            </div>
          )}

          <div style={{ marginTop: "16px" }}>
            <button
              type="button"
              className="primary-btn"
              onClick={handleShare}
              style={{ padding: "12px 24px", fontWeight: 700, gap: "8px", display: "inline-flex", alignItems: "center", cursor: "pointer" }}
            >
              <IconShare size={16} />
              <span>{locale === "ko" ? "결과 공유하기" : "Share Score"}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
