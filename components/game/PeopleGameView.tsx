"use client";

import { useLocale } from "@/components/i18n/LocaleProvider";
import { useRef, useState } from "react";
import { matchesAlias } from "@/lib/game/normalization";
import type { PeoplePayload } from "@/types/game";

type Props = {
  payload: PeoplePayload;
  onSolve?: (attemptsCount: number, timeSec: number) => void;
  onFail?: () => void;
};

export function PeopleGameView({ payload, onSolve, onFail }: Props) {
  const { t } = useLocale();
  const frames = payload.frames;
  const [frame, setFrame] = useState(0);
  const [guess, setGuess] = useState("");
  const [attempts, setAttempts] = useState<string[]>([]);
  const [solved, setSolved] = useState(false);
  const [usedClues, setUsedClues] = useState<string[]>([]);
  const [notice, setNotice] = useState("");
  const startTimeRef = useRef<number>(Date.now());

  const currentSrc = frames[frame] || frames[0];
  const exhausted = !solved && attempts.length >= 5;
  const finished = solved || exhausted;

  function submitGuess() {
    if (finished || !guess.trim()) return;

    const clean = guess.trim();
    const isCorrect = matchesAlias(clean, payload.aliases);
    const nextAttempts = [...attempts, clean];
    setAttempts(nextAttempts);
    setGuess("");

    if (isCorrect) {
      setSolved(true);
      setNotice(`${t("correct")} 👤`);
      const timeSec = Math.round((Date.now() - startTimeRef.current) / 1000);
      onSolve?.(nextAttempts.length, timeSec);
      return;
    }

    if (nextAttempts.length < 5) {
      setFrame((f) => Math.min(f + 1, frames.length - 1));
      setNotice("틀렸습니다! 이미지가 조금 더 밝혀집니다.");
    } else {
      setNotice(`아쉽네요. 정답은 "${payload.nameKr}" 입니다.`);
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
      <div className="people-wrap">
        <div className="scene">
          <img
            key={frame}
            className="scene-frame-img"
            src={currentSrc}
            alt="Person reveal frame"
            style={{
              filter: frame === 0 ? "brightness(0) blur(2px)" : frame === 1 ? "contrast(1.5) blur(1px)" : "none",
              transition: "filter 0.3s ease",
            }}
          />
          <div className="scene-grain" aria-hidden />
          <div className="scene-vignette" aria-hidden />
          <div className="scene-hud">
            <span>{t("peopleStep").replace("{n}", String(frame + 1))}</span>
            <span>{payload.category}</span>
          </div>
        </div>
      </div>

      <div className="guess-panel">
        <div className="guess-heading">
          <span className="eyebrow">{t("peopleTitle")}</span>
          <h2>{t("whatPeople")}</h2>
        </div>

        <div className="search-wrap">
          <input
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submitGuess()}
            placeholder={t("peoplePlaceholder")}
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
            <h3>{payload.nameKr}</h3>
            <p>{payload.nameEn} ({payload.category})</p>
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
