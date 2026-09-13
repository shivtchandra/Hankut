"use client";

import { useLocale } from "@/components/i18n/LocaleProvider";
import { useRef, useState } from "react";
import { matchesAlias, matchesChosung } from "@/lib/game/normalization";
import type { ChosungPayload } from "@/types/game";

type Props = {
  payload: ChosungPayload;
  onSolve?: (attemptsCount: number, timeSec: number) => void;
  onFail?: () => void;
};

export function ChosungGameView({ payload, onSolve, onFail }: Props) {
  const { t } = useLocale();
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
      setNotice(`${t("correct")} 🔤`);
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
          <div className="audio-badge">{t("chosungTitle")}</div>
          <div className="chosung-display">{payload.chosung}</div>
          <div className="chosung-meta">
            <span>{payload.category}</span>
            <span>·</span>
            <span>{t("syllableCount").replace("{n}", String(payload.syllableCount))}</span>
          </div>
        </div>
      </div>

      <div className="guess-panel">
        <div className="guess-heading">
          <span className="eyebrow">{t("chosungTitle")}</span>
          <h2>{t("whatChosung")}</h2>
        </div>

        <div className="search-wrap">
          <input
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submitGuess()}
            placeholder={t("chosungPlaceholder")}
            disabled={finished}
          />
          <button type="button" onClick={submitGuess} disabled={!guess.trim() || finished}>
            {t("submit")}
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
                <strong>{used ? clue.value : unlocked ? t("reveal") : t("locked")}</strong>
              </button>
            );
          })}
        </div>

        {finished && (
          <div className="result-card">
            <span className="eyebrow">{solved ? t("answerEyebrow") : t("answerReveal")}</span>
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
