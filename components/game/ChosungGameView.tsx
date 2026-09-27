"use client";

import { useMemo, useRef, useState } from "react";
import { matchesAlias, matchesChosung, normalize } from "@/lib/game/normalization";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { localizeClueLabel } from "@/lib/i18n/dictionary";
import {
  IconHangul,
  IconLock,
  IconUnlock,
  IconSkipForward,
  IconShare,
} from "@/components/icons/Icons";
import {
  buildInviteShare,
  buildScoreShare,
  buildChallengeShare,
  shareOrCopy,
} from "@/lib/game/share";
import { seoulToday } from "@/lib/game/dates";
import type { Drama, ChosungPayload } from "@/types/game";

type Props = {
  payload: ChosungPayload;
  dramas?: Drama[];
  gameDate?: string;
  onSolve?: (attemptsCount: number, timeSec: number) => void;
  onFail?: () => void;
};

export function ChosungGameView({ payload, dramas = [], gameDate, onSolve, onFail }: Props) {
  const { locale, t } = useLocale();
  const [guess, setGuess] = useState("");
  const [attempts, setAttempts] = useState<string[]>([]);
  const [solved, setSolved] = useState(false);
  const [usedClues, setUsedClues] = useState<string[]>([]);
  const [notice, setNotice] = useState("");
  const [shareNotice, setShareNotice] = useState("");
  const [suggestIndex, setSuggestIndex] = useState(-1);
  const startTimeRef = useRef<number>(Date.now());

  const exhausted = !solved && attempts.length >= 5;
  const finished = solved || exhausted;
  const activeDate = gameDate || seoulToday();

  const displayTitle = locale === "en" && payload.answerEn ? payload.answerEn : payload.answerKr;
  const subTitle = locale === "en" ? payload.answerKr : payload.answerEn;

  // Search candidate suggestions
  const searchCandidates = useMemo(() => {
    const list: { primary: string; secondary: string; cleanVal: string }[] = [];
    const seen = new Set<string>();

    const add = (p: string, s: string, v: string) => {
      const key = v.toLowerCase().trim();
      if (!key || seen.has(key)) return;
      seen.add(key);
      list.push({ primary: p, secondary: s, cleanVal: v });
    };

    if (payload.answerKr) add(payload.answerKr, payload.answerEn || "Answer", payload.answerKr);
    if (payload.answerEn) add(payload.answerEn, payload.answerKr || "Answer", payload.answerEn);
    payload.aliases.forEach((a) => add(a, "Alias", a));

    dramas.forEach((d) => {
      const p = locale === "en" ? d.titleEn : d.titleKr;
      const s = locale === "en" ? d.titleKr : d.titleEn;
      add(p, s ? `${s} (Drama)` : "Drama", p);
    });

    return list;
  }, [payload, dramas, locale]);

  const suggestions = useMemo(() => {
    const clean = guess.trim();
    if (!clean) return [];
    const q = normalize(clean);

    return searchCandidates
      .filter((item) => normalize(item.cleanVal).includes(q) || normalize(item.secondary).includes(q))
      .slice(0, 6);
  }, [guess, searchCandidates]);

  function submitGuess(value = guess) {
    if (finished) return;
    const clean = value.trim();
    if (!clean) return;

    const isCorrect =
      matchesChosung(clean, payload.chosung, payload.answerKr) ||
      matchesAlias(clean, payload.aliases);

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

  function skipQuiz() {
    if (finished) return;
    const skipLabel = locale === "ko" ? "건너뜀" : "Skipped";
    const nextAttempts = [...attempts, skipLabel];
    setAttempts(nextAttempts);
    setGuess("");
    setSuggestIndex(-1);

    if (nextAttempts.length < 5) {
      setNotice(locale === "ko" ? "건너뛰었습니다! 힌트를 확인해 보세요." : "Skipped! Check the unlocked clues.");
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

  async function handleShareGame() {
    const shareData = buildInviteShare({
      locale,
      brand: t("brandName"),
      gameDate: activeDate,
      todayDate: seoulToday(),
    });
    const outcome = await shareOrCopy(shareData);
    setShareNotice(outcome === "copied" ? t("shareGameCopied") : outcome === "shared" ? "" : t("shareFailed"));
    if (outcome === "copied") setTimeout(() => setShareNotice(""), 2500);
  }

  async function handleShareResult() {
    const score = solved ? Math.max(25 - (attempts.length - 1) * 5, 5) : 0;
    const shareData = buildScoreShare({
      locale,
      brand: t("brandName"),
      gameDate: activeDate,
      todayDate: seoulToday(),
      solved,
      attempts: attempts.length,
      score,
    });
    const outcome = await shareOrCopy(shareData);
    setShareNotice(outcome === "copied" ? t("shareCopied") : outcome === "shared" ? "" : t("shareFailed"));
    if (outcome === "copied") setTimeout(() => setShareNotice(""), 2500);
  }

  async function handleShareChallenge() {
    const shareData = buildChallengeShare({
      locale,
      brand: t("brandName"),
      gameDate: activeDate,
      todayDate: seoulToday(),
      solved,
      attempts: attempts.length,
    });
    const outcome = await shareOrCopy(shareData);
    setShareNotice(outcome === "copied" ? t("challengeCopied") : outcome === "shared" ? "" : t("shareFailed"));
    if (outcome === "copied") setTimeout(() => setShareNotice(""), 2500);
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
          <div className="guess-heading-top" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span className="eyebrow">{t("chosungTitle")}</span>
            <button
              type="button"
              className="scene-share-btn"
              onClick={handleShareGame}
              title={t("shareGame")}
            >
              <IconShare size={13} />
              <span>{t("shareGame")}</span>
            </button>
          </div>
          <h2>{t("whatChosung")}</h2>
        </div>

        <div className="search-wrap">
          <input
            value={guess}
            onChange={(e) => {
              setGuess(e.target.value);
              setSuggestIndex(-1);
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setSuggestIndex((i) => (i >= suggestions.length - 1 ? 0 : i + 1));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setSuggestIndex((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
              } else if (e.key === "Enter") {
                if (suggestIndex >= 0 && suggestions[suggestIndex]) {
                  submitGuess(suggestions[suggestIndex].cleanVal);
                } else {
                  submitGuess();
                }
              }
            }}
            placeholder={t("chosungPlaceholder")}
            disabled={finished}
          />
          <button type="button" onClick={() => submitGuess()} disabled={!guess.trim() || finished}>
            {t("submit")}
          </button>

          {suggestions.length > 0 && !finished && (
            <div className="suggestions" role="listbox">
              {suggestions.map((item, index) => (
                <button
                  key={index}
                  type="button"
                  role="option"
                  aria-selected={index === suggestIndex}
                  className={index === suggestIndex ? "active" : ""}
                  onClick={() => submitGuess(item.cleanVal)}
                >
                  <strong>{item.primary}</strong>
                  <span>{item.secondary}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {!finished && (
          <div className="unified-action-row" style={{ marginTop: 10 }}>
            <button
              type="button"
              className="unified-skip-btn"
              onClick={skipQuiz}
              disabled={attempts.length >= 5}
            >
              <IconSkipForward size={14} />
              <span>{t("skipCut")}</span>
            </button>
          </div>
        )}

        {notice && <div className="game-notice">{notice}</div>}
        {shareNotice && <div className="game-notice" style={{ background: "#FEF3C7", color: "#92400E" }}>{shareNotice}</div>}

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

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 16 }}>
              <button
                type="button"
                className="result-share-btn"
                style={{ background: "var(--ink)", color: "var(--paper)", border: "none", borderRadius: 8, padding: "10px 14px", fontWeight: 600, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6, cursor: "pointer" }}
                onClick={handleShareResult}
              >
                <IconShare size={15} /> {t("shareResult")}
              </button>
              <button
                type="button"
                className="result-share-btn"
                style={{ background: "var(--paper-soft)", color: "var(--ink)", border: "1px solid var(--line)", borderRadius: 8, padding: "10px 14px", fontWeight: 600, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6, cursor: "pointer" }}
                onClick={handleShareChallenge}
              >
                ⚔️ {t("challengeFriend")}
              </button>
            </div>
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
