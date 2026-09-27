"use client";

import { useRef, useState } from "react";
import { matchesAlias, matchesChosung } from "@/lib/game/normalization";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { localizeClueLabel } from "@/lib/i18n/dictionary";
import { IconHangul, IconLock, IconUnlock } from "@/components/icons/Icons";
import type { ChosungPayload } from "@/types/game";

type Props = {
  payload: ChosungPayload;
  onSolve?: (attemptsCount: number, timeSec: number) => void;
  onFail?: () => void;
};

export function ChosungGameView({ payload, onSolve, onFail }: Props) {
  const { locale, t } = useLocale();
  const [guess, setGuess] = useState("");
  const [attempts, setAttempts] = useState<string[]>([]);
  const [solved, setSolved] = useState(false);
  const [usedClues, setUsedClues] = useState<string[]>([]);
  const [notice, setNotice] = useState("");
  const startTimeRef = useRef<number>(Date.now());

  const exhausted = !solved && attempts.length >= 5;
  const finished = solved || exhausted;

  const displayTitle = locale === "en" && payload.answerEn ? payload.answerEn : payload.answerKr;
  const subTitle = locale === "en" ? payload.answerKr : payload.answerEn;

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
      setNotice(t("correct"));
      const timeSec = Math.round((Date.now() - startTimeRef.current) / 1000);
      onSolve?.(nextAttempts.length, timeSec);
      return;
    }

    if (nextAttempts.length < 5) {
      setNotice(locale === "ko" ? "틀렸습니다! 초성과 힌트를 확인해 보세요." : "Incorrect! Check the initials and clues.");
    } else {
      setNotice(
        locale === "ko"
          ? `아쉽네요. 정답은 "${payload.answerKr}" 입니다.`
          : `Game over. The answer was "${displayTitle}".`
      );
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
          <div className="audio-badge">
            <IconHangul size={14} style={{ marginRight: 6, display: "inline-block", verticalAlign: "middle" }} />
            {t("chosungTitle")}
          </div>
          <div className="chosung-display">{payload.chosung}</div>
          <div className="chosung-meta">
            <span>{payload.category}</span>
            <span>·</span>
            <span>{payload.syllableCount}{locale === "ko" ? "글자" : " chars"}</span>
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
                <div className="clue-header">
                  <span>{localizeClueLabel(clue.label, locale)}</span>
                  {used ? <IconUnlock size={14} /> : <IconLock size={14} />}
                </div>
                <strong>
                  {used
                    ? clue.value
                    : unlocked
                    ? (locale === "ko" ? "힌트 열기" : "Reveal hint")
                    : (locale === "ko" ? "잠김" : "Locked")}
                </strong>
              </button>
            );
          })}
        </div>

        {finished && (
          <div className="result-card">
            <span className="eyebrow">{solved ? t("answerEyebrow") : t("answerReveal")}</span>
            <h3>{displayTitle}</h3>
            {subTitle && <p>{subTitle}</p>}
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
