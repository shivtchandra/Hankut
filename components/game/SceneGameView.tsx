"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { localizeClueLabel } from "@/lib/i18n/dictionary";
import { matchesAlias, normalize } from "@/lib/game/normalization";
import type { Drama, ScenePayload } from "@/types/game";

type Props = {
  payload: ScenePayload;
  dramas: Drama[];
  onSolve?: (attemptsCount: number, timeSec: number) => void;
  onFail?: () => void;
};

export function SceneGameView({ payload, dramas, onSolve, onFail }: Props) {
  const { locale, t } = useLocale();
  const frames = payload.frames;
  const clues = payload.clues;
  const answer = payload.drama;

  const [frame, setFrame] = useState(0);
  const [guess, setGuess] = useState("");
  const [attempts, setAttempts] = useState<string[]>([]);
  const [solved, setSolved] = useState(false);
  const [usedClues, setUsedClues] = useState<string[]>([]);
  const [notice, setNotice] = useState("");
  const [shake, setShake] = useState(false);
  const [suggestIndex, setSuggestIndex] = useState(-1);
  const startTimeRef = useRef<number>(Date.now());

  const exhausted = !solved && attempts.length >= 5;
  const finished = solved || exhausted;
  const currentSrc = frames[frame] || frames[0];

  const suggestions = useMemo(() => {
    if (!guess.trim()) return [];
    const q = normalize(guess);
    return dramas
      .filter((d) => d.aliases.some((alias) => normalize(alias).includes(q)))
      .slice(0, 5);
  }, [guess, dramas]);

  function primaryTitle(d: Drama) {
    return locale === "en" ? d.titleEn : d.titleKr;
  }
  function secondaryTitle(d: Drama) {
    return locale === "en" ? d.titleKr : d.titleEn;
  }

  function submitGuess(value = guess) {
    if (finished) return;
    const clean = value.trim();
    if (!clean) {
      setNotice(t("enterTitle"));
      return;
    }

    const isCorrect = matchesAlias(clean, answer.aliases);
    const nextAttempts = [...attempts, clean];
    setAttempts(nextAttempts);
    setGuess("");
    setSuggestIndex(-1);

    if (isCorrect) {
      setSolved(true);
      setNotice(t("correct"));
      const timeSec = Math.round((Date.now() - startTimeRef.current) / 1000);
      onSolve?.(nextAttempts.length, timeSec);
      return;
    }

    setShake(true);
    setTimeout(() => setShake(false), 420);

    if (nextAttempts.length < 5) {
      setFrame((f) => Math.min(f + 1, frames.length - 1));
      setNotice(t("wrongNext"));
    } else {
      setFrame(frames.length - 1);
      setNotice(t("seeAnswer"));
      onFail?.();
    }
  }

  function useClue(clueId: string, unlockAfter: number) {
    if (attempts.length < unlockAfter || usedClues.includes(clueId)) return;
    setUsedClues((prev) => [...prev, clueId]);
  }

  return (
    <div className="game-shell">
      <div className="scene-wrap">
        <div className={`scene ${shake ? "scene-shake" : ""}`}>
          <img
            key={frame}
            className="scene-frame-img"
            src={currentSrc}
            alt="Kdrama scene frame"
          />
          <div className="scene-grain" aria-hidden />
          <div className="scene-vignette" aria-hidden />
          <div className="scene-hud">
            <span>
              {t("sceneLabel")} {String(frame + 1).padStart(2, "0")}
            </span>
            <span>
              {attempts.length} {t("attemptsOf")}
            </span>
          </div>
        </div>

        <div className="frame-dots">
          {frames.map((_, idx) => (
            <span key={idx} className={idx <= frame ? "dot active" : "dot"} />
          ))}
        </div>
      </div>

      <div className="guess-panel">
        <div className="guess-heading">
          <span className="eyebrow">{t("yourGuess")}</span>
          <h2>{t("whatDrama")}</h2>
        </div>

        <div className={`search-wrap ${shake ? "search-shake" : ""}`}>
          <input
            value={guess}
            onChange={(e) => {
              setGuess(e.target.value);
              setSuggestIndex(-1);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                if (suggestIndex >= 0 && suggestions[suggestIndex]) {
                  submitGuess(primaryTitle(suggestions[suggestIndex]));
                } else {
                  submitGuess();
                }
              }
            }}
            placeholder={t("guessPlaceholder")}
            disabled={finished}
          />
          <button
            type="button"
            onClick={() => submitGuess()}
            disabled={!guess.trim() || finished}
          >
            {t("guess")}
          </button>

          {suggestions.length > 0 && !finished && (
            <div className="suggestions" role="listbox">
              {suggestions.map((d, i) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => submitGuess(primaryTitle(d))}
                >
                  <strong>{primaryTitle(d)}</strong>
                  <span>{secondaryTitle(d)}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {notice && <div className="game-notice">{notice}</div>}

        <div className="clue-row">
          {clues.map((clue) => {
            const unlocked = attempts.length >= clue.unlockAfterAttempt;
            const used = usedClues.includes(clue.id);
            return (
              <button
                key={clue.id}
                type="button"
                className={`clue ${used ? "revealed" : ""} ${unlocked ? "unlocked" : ""}`}
                disabled={!unlocked || used}
                onClick={() => useClue(clue.id, clue.unlockAfterAttempt)}
              >
                <span>{localizeClueLabel(clue.label, locale)}</span>
                <strong>{used ? clue.value : unlocked ? t("reveal") : t("locked")}</strong>
              </button>
            );
          })}
        </div>

        {finished && (
          <div className="result-card">
            <span className="eyebrow">{solved ? t("answerEyebrow") : t("answerReveal")}</span>
            <h3>{primaryTitle(answer)}</h3>
            <p>{secondaryTitle(answer)}</p>
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
