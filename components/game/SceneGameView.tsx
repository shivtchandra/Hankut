"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { localizeClueLabel } from "@/lib/i18n/dictionary";
import { matchesAlias, normalize, rawNormalize } from "@/lib/game/normalization";
import {
  IconChevronLeft,
  IconChevronRight,
  IconLock,
  IconUnlock,
  IconFlame,
  IconSkipForward,
  IconShare,
  IconSearch,
} from "@/components/icons/Icons";
import { getAttemptPoints } from "@/lib/game/scoring";
import { recordPlay, getStreak } from "@/lib/game/streak";
import {
  buildInviteShare,
  buildScoreShare,
  buildChallengeShare,
  shareOrCopy,
} from "@/lib/game/share";
import { seoulToday } from "@/lib/game/dates";
import type { Drama, ScenePayload } from "@/types/game";

type Props = {
  payload: ScenePayload;
  dramas: Drama[];
  gameDate?: string;
  onSolve?: (attemptsCount: number, timeSec: number) => void;
  onFail?: () => void;
};

export function SceneGameView({ payload, dramas = [], gameDate, onSolve, onFail }: Props) {
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
  const [shareNotice, setShareNotice] = useState("");
  const [shake, setShake] = useState(false);
  const [suggestIndex, setSuggestIndex] = useState(-1);
  const [streak, setStreak] = useState(0);
  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    setStreak(getStreak());
  }, []);

  const exhausted = !solved && attempts.length >= 5;
  const finished = solved || exhausted;
  const currentSrc = frames[frame] || frames[0];
  const activeDate = gameDate || seoulToday();

  const indexedDramas = useMemo(() => {
    return (dramas || []).map((drama) => {
      const allAliases = [
        drama.titleEn,
        drama.titleKr,
        ...(drama.aliases || []),
      ].filter((a): a is string => Boolean(a));

      const normVariants = Array.from(
        new Set(
          allAliases.flatMap((a) => [normalize(a), rawNormalize(a)]).filter(Boolean),
        ),
      );

      return {
        drama,
        rawAliases: allAliases,
        normVariants,
        normTitleEn: normalize(drama.titleEn || ""),
        normTitleKr: normalize(drama.titleKr || ""),
      };
    });
  }, [dramas]);

  const suggestions = useMemo(() => {
    const clean = guess.trim();
    if (!clean) return [];
    const qNorm = normalize(clean);
    const qRaw = rawNormalize(clean);
    const queries = Array.from(new Set([qNorm, qRaw].filter(Boolean)));
    if (queries.length === 0) return [];

    const tier1: Drama[] = [];
    const tier2: Drama[] = [];
    const tier3: Drama[] = [];
    const seen = new Set<string>();

    for (const item of indexedDramas) {
      const { normVariants, rawAliases, drama } = item;
      let matchedTier = 0;

      for (const q of queries) {
        if (normVariants.some((v) => v.startsWith(q))) {
          matchedTier = 1;
          break;
        }

        const wordRe = new RegExp(`(^|[\\s_\\-·])${q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`);
        if (rawAliases.some((a) => wordRe.test(normalize(a)) || wordRe.test(a))) {
          matchedTier = matchedTier === 0 ? 2 : matchedTier;
        }

        if (matchedTier === 0 && normVariants.some((v) => v.includes(q))) {
          matchedTier = 3;
        }
      }

      if (matchedTier === 1 && !seen.has(drama.id)) {
        tier1.push(drama);
        seen.add(drama.id);
      } else if (matchedTier === 2 && !seen.has(drama.id)) {
        tier2.push(drama);
        seen.add(drama.id);
      } else if (matchedTier === 3 && !seen.has(drama.id)) {
        tier3.push(drama);
        seen.add(drama.id);
      }
    }
    return [...tier1, ...tier2, ...tier3].slice(0, 6);
  }, [guess, indexedDramas]);

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

    const isCorrect = matchesAlias(
      clean,
      [answer.titleEn, answer.titleKr, ...(answer.aliases || [])].filter((a): a is string => Boolean(a)),
    );
    const nextAttempts = [...attempts, clean];
    setAttempts(nextAttempts);
    setGuess("");
    setSuggestIndex(-1);

    if (isCorrect) {
      setSolved(true);
      setNotice(t("correct"));
      const newStreak = recordPlay();
      setStreak(newStreak);
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

  function skipCut() {
    if (finished) return;
    const skipLabel = locale === "ko" ? "건너뜀" : "Skipped";
    const nextAttempts = [...attempts, skipLabel];
    setAttempts(nextAttempts);
    setGuess("");
    setSuggestIndex(-1);

    if (nextAttempts.length < 5) {
      setFrame((f) => Math.min(f + 1, frames.length - 1));
      setNotice(t("wrongNext"));
    } else {
      setFrame(frames.length - 1);
      setNotice(t("seeAnswer"));
      onFail?.();
    }
  }

  function revealClue(clueId: string, unlockAfter: number) {
    if (attempts.length < unlockAfter || usedClues.includes(clueId)) return;
    setUsedClues((prev) => [...prev, clueId]);
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
    const score = solved ? getAttemptPoints(attempts.length) : 0;
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
      <div className="scene-wrap">
        <div className={`scene ${shake ? "scene-shake" : ""}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={frame}
            className="scene-frame-img"
            src={currentSrc}
            alt={`${t("sceneLabel")} ${frame + 1}`}
            fetchPriority={frame === 0 ? "high" : "auto"}
            loading="eager"
            decoding="async"
          />
          <div className="scene-grain" aria-hidden />
          <div className="scene-vignette" aria-hidden />
          <div className="scene-hud">
            <span>
              {t("sceneLabel")} {String(frame + 1).padStart(2, "0")}
            </span>
            <span>
              {attempts.length} / 5
            </span>
          </div>
        </div>

        <div className="frame-nav-controls">
          <button
            type="button"
            className="frame-nav-btn"
            disabled={frame === 0}
            onClick={() => setFrame((f) => Math.max(0, f - 1))}
            aria-label="Prev cut"
          >
            <IconChevronLeft size={16} /> Prev cut
          </button>

          <div className="frame-dots" role="group" aria-label={t("sceneLabel")}>
            {frames.map((_, idx) => (
              <button
                key={idx}
                type="button"
                className={idx <= frame ? "dot active" : "dot"}
                onClick={() => setFrame(idx)}
                aria-label={`Frame ${idx + 1}`}
              />
            ))}
          </div>

          <button
            type="button"
            className="frame-nav-btn"
            disabled={frame >= Math.min(attempts.length, frames.length - 1)}
            onClick={() => setFrame((f) => Math.min(frames.length - 1, f + 1))}
          >
            Next cut <IconChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="guess-panel">
        <div className="console-topbar">
          <div className="console-header-row">
            <span className="console-eyebrow">{t("yourGuess")}</span>

            <div className="console-meta-actions">
              {streak > 0 && (
                <div className="console-streak-chip">
                  <IconFlame size={12} style={{ color: "#DC2626" }} />
                  <span>{streak} {t("streak")}</span>
                </div>
              )}
              <button
                type="button"
                className="scene-share-btn"
                onClick={handleShareGame}
                title={t("shareGame")}
              >
                <IconShare size={12} />
                <span>{t("shareGame")}</span>
              </button>
            </div>
          </div>

          <h2 className="console-title">{t("whatDrama")}</h2>
        </div>

        {!finished && (
          <div className="unified-play-box">
            <div className={`unified-input-wrap ${shake ? "search-shake" : ""}`}>
              <IconSearch size={18} className="unified-search-icon" />
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
                      submitGuess(primaryTitle(suggestions[suggestIndex]));
                    } else {
                      submitGuess();
                    }
                  } else if (e.key === "Escape") {
                    setSuggestIndex(-1);
                  }
                }}
                placeholder={t("guessPlaceholder")}
                autoComplete="off"
              />
              {guess && (
                <button
                  type="button"
                  className="unified-clear-btn"
                  onClick={() => {
                    setGuess("");
                    setSuggestIndex(-1);
                  }}
                  aria-label="Clear input"
                >
                  ✕
                </button>
              )}
              <button
                type="button"
                className="unified-submit-btn"
                onClick={() => submitGuess()}
                disabled={!guess.trim()}
              >
                {t("guess")}
              </button>
            </div>

            {suggestions.length > 0 && (
              <div className="suggestions" role="listbox">
                {suggestions.map((d, index) => (
                  <button
                    key={d.id}
                    type="button"
                    role="option"
                    aria-selected={index === suggestIndex}
                    className={index === suggestIndex ? "active" : ""}
                    onClick={() => {
                      const title = primaryTitle(d);
                      setGuess(title);
                      submitGuess(title);
                    }}
                  >
                    <strong>{primaryTitle(d)}</strong>
                    <span>{secondaryTitle(d)} {d.year ? `· ${d.year}` : ""}</span>
                  </button>
                ))}
              </div>
            )}

            <div className="unified-action-row">
              <button
                type="button"
                className="unified-skip-btn"
                onClick={skipCut}
                disabled={attempts.length >= 5}
              >
                <IconSkipForward size={14} />
                <span>{t("skipCut")}</span>
              </button>

              <div
                className="attempt-dots-track"
                role="status"
                aria-label={`Attempt ${attempts.length + 1} of 5`}
              >
                {Array.from({ length: 5 }, (_, i) => {
                  const att = attempts[i];
                  const isCurrent = i === attempts.length && !finished;
                  const isCorrect = att && solved && i === attempts.length - 1;
                  const isSkipped = att === "Skipped" || att === "건너뜀";
                  return (
                    <span
                      key={i}
                      className={`attempt-dot ${
                        att
                          ? isCorrect
                            ? "correct"
                            : isSkipped
                              ? "skipped"
                              : "wrong"
                          : isCurrent
                            ? "current"
                            : "empty"
                      }`}
                      title={att ? `${i + 1}: ${att}` : `Cut ${i + 1}`}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {notice && <div className="game-notice">{notice}</div>}
        {shareNotice && <div className="game-notice" style={{ background: "#FEF3C7", color: "#92400E" }}>{shareNotice}</div>}

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
                onClick={() => revealClue(clue.id, clue.unlockAfterAttempt)}
              >
                <div className="clue-header">
                  <span>{localizeClueLabel(clue.label, locale)}</span>
                  {used ? (
                    <IconUnlock size={14} />
                  ) : (
                    <IconLock size={14} />
                  )}
                </div>
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

            <div style={{ display: "flex", gap: 12, marginTop: 16, paddingTop: 12, borderTop: "1px solid var(--line)", alignItems: "center" }}>
              <div style={{ background: solved ? "var(--paper-soft)" : "#fef2f2", padding: "8px 14px", borderRadius: "var(--radius-sm)" }}>
                <span className="muted" style={{ fontSize: 11, display: "block" }}>SCORE</span>
                <strong style={{ fontSize: 18, color: solved ? "var(--green)" : "#dc2626" }}>
                  {solved ? `+${getAttemptPoints(attempts.length)} pts` : "0 pts"}
                </strong>
              </div>

              <div style={{ background: "var(--paper-soft)", padding: "8px 14px", borderRadius: "var(--radius-sm)", display: "flex", alignItems: "center", gap: 8 }}>
                <IconFlame size={20} style={{ color: "var(--accent)" }} />
                <div>
                  <span className="muted" style={{ fontSize: 11, display: "block" }}>DAILY STREAK</span>
                  <strong style={{ fontSize: 18 }}>{streak} Days</strong>
                </div>
              </div>
            </div>

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
