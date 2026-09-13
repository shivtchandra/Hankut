"use client";

import { useRef, useState } from "react";
import { matchesAlias, matchesChosung } from "@/lib/game/normalization";
import type { ChosungPayload } from "@/types/game";

type Props = {
  payload: ChosungPayload;
  onSolve?: (attemptsCount: number, timeSec: number) => void;
  onFail?: () => void;
};

export function ChosungGameView({ payload, onSolve, onFail }: Props) {
  const [guess, setGuess] = useState("");
  const [attempts, setAttempts] = useState<string[]>([]);
  const [solved, setSolved] = useState(false);
  const [usedClues, setUsedClues] = useState<string[]>([]);
  const [notice, setNotice] = useState("");
  const startTimeRef = useRef<number>(Date.now());

  const exhausted = !solved && attempts.length >= 5;
  const finished = solved || exhausted;

  function submitGuess() {
    if (finished || !guess.trim()) return;

    const clean = guess.trim();
    const isCorrect =
      matchesChosung(clean, payload.chosung, payload.answerKr) ||
      matchesAlias(clean, payload.aliases);

    const nextAttempts = [...attempts, clean];
    setAttempts(nextAttempts);
    setGuess("");

    if (isCorrect) {
      setSolved(true);
      setNotice("정답입니다! 🔤");
      const timeSec = Math.round((Date.now() - startTimeRef.current) / 1000);
      onSolve?.(nextAttempts.length, timeSec);
      return;
    }

    if (nextAttempts.length < 5) {
      setNotice("틀렸습니다! 초성과 힌트를 확인해 보세요.");
    } else {
      setNotice(`아쉽네요. 정답은 "${payload.answerKr}" 입니다.`);
      onFail?.();
    }
  }

  function useClue(clueId: string) {
    if (!usedClues.includes(clueId)) {
      setUsedClues((prev) => [...prev, clueId]);
    }
  }

  return (
    <div className="game-shell">
      <div className="chosung-hero-wrap">
        <div className="chosung-card">
          <div className="audio-badge">초성 맞히기</div>
          <div className="chosung-display">{payload.chosung}</div>
          <div className="chosung-meta">
            <span>{payload.category}</span>
            <span>·</span>
            <span>{payload.syllableCount}글자</span>
          </div>
        </div>
      </div>

      <div className="guess-panel">
        <div className="guess-heading">
          <span className="eyebrow">초성 맞히기</span>
          <h2>초성을 보고 원래 제목을 맞혀보세요</h2>
        </div>

        <div className="search-wrap">
          <input
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submitGuess()}
            placeholder="전체 제목을 한글로 입력하세요"
            disabled={finished}
          />
          <button type="button" onClick={submitGuess} disabled={!guess.trim() || finished}>
            제출
          </button>
        </div>

        {notice && <div className="game-notice">{notice}</div>}

        <div className="clue-row">
          {payload.clues.map((clue) => {
            const unlocked = attempts.length >= clue.unlockAfterAttempt;
            const used = usedClues.includes(clue.id);
            return (
              <button
                key={clue.id}
                type="button"
                className={`clue ${used ? "revealed" : ""} ${unlocked ? "unlocked" : ""}`}
                disabled={!unlocked || used}
                onClick={() => useClue(clue.id)}
              >
                <span>{clue.label}</span>
                <strong>{used ? clue.value : unlocked ? "힌트 열기" : "잠김"}</strong>
              </button>
            );
          })}
        </div>

        {finished && (
          <div className="result-card">
            <span className="eyebrow">{solved ? "정답 성공" : "정답 공개"}</span>
            <h3>{payload.answerKr}</h3>
            <p>{payload.answerEn}</p>
          </div>
        )}

        <div className="attempts">
          {attempts.map((item, idx) => (
            <div className="attempt" key={idx}>
              <span>{String(idx + 1).padStart(2, "0")}</span>
              <strong>{item}</strong>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
