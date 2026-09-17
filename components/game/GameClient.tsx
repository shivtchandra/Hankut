"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { matchesAlias, normalize } from "@/lib/game/normalization";
import {
  getDailyGameState,
  getStreak,
  recordDailyPlay,
  saveDailyGameState,
} from "@/lib/game/streak";
import {
  buildChallengeShare,
  buildInviteShare,
  buildScoreShare,
  copyToClipboard,
  shareOrCopy,
  type ShareOutcome,
} from "@/lib/game/share";
import {
  IconChevronLeft,
  IconChevronRight,
  IconShare,
  IconFlame,
  IconSearch,
  IconSkipForward,
} from "@/components/icons/Icons";
import type { Drama, TodayGame } from "@/types/game";

type Props = {
  game: TodayGame;
  dramas: Drama[];
  /** Newest released puzzle date, so share links to it stay on the "/" URL. */
  todayDate: string;
};

export function GameClient({ game, dramas, todayDate }: Props) {
  const { locale, t } = useLocale();
  const frames = game.scene.frames;
  const answer = game.scene.drama;

  const [frame, setFrame] = useState(0);
  const [guess, setGuess] = useState("");
  const [attempts, setAttempts] = useState<string[]>([]);
  const [solved, setSolved] = useState(false);
  const [notice, setNotice] = useState("");
  const [shake, setShake] = useState(false);
  const [frameKey, setFrameKey] = useState(0);
  const [imgBroken, setImgBroken] = useState(false);
  const [suggestIndex, setSuggestIndex] = useState(-1);
  const [streak, setStreak] = useState(0);
  const [shareNotice, setShareNotice] = useState("");
  const [shareLink, setShareLink] = useState("");
  const [inviteNotice, setInviteNotice] = useState("");
  const [inviteLink, setInviteLink] = useState("");
  const finishedRef = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const exhausted = !solved && attempts.length >= 5;
  const finished = solved || exhausted;
  const currentSrc = frames[frame];

  const unlockedFrame = useMemo(() => {
    if (solved) return Math.max(frames.length - 1, 0);
    return Math.min(attempts.length, Math.max(frames.length - 1, 0));
  }, [solved, attempts.length, frames.length]);

  const scoreEarned = useMemo(() => {
    if (!solved) return 0;
    return Math.max(30 - attempts.length * 5, 5);
  }, [solved, attempts.length]);

  const suggestions = useMemo(() => {
    if (!guess.trim()) return [];
    const q = normalize(guess);

    return dramas
      .filter((drama) =>
        drama.aliases.some((alias) => normalize(alias).includes(q)),
      )
      .slice(0, 5);
  }, [guess, dramas]);

  useEffect(() => {
    // Always reset before restoring — prevents previous day's state leaking in
    setAttempts([]);
    setSolved(false);
    setFrame(0);
    setGuess("");
    setNotice("");
    finishedRef.current = false;
    setStreak(getStreak());

    const saved = getDailyGameState(game.gameDate);
    if (saved && saved.gameDate === game.gameDate) {
      setAttempts(saved.attempts || []);
      setSolved(saved.solved || false);
      if (typeof saved.frame === "number") setFrame(saved.frame);
      if (saved.completed) finishedRef.current = true;
    }
  }, [game.gameDate]);

  useEffect(() => {
    frames.forEach((src) => {
      if (!src) return;
      const img = new Image();
      img.src = src;
    });
  }, [frames]);

  useEffect(() => {
    setImgBroken(false);
  }, [frame, currentSrc]);

  useEffect(() => {
    if (!finished || finishedRef.current) return;
    finishedRef.current = true;
    const next = recordDailyPlay(game.gameDate);
    setStreak(next);
  }, [finished, game.gameDate]);

  // Save game progress to localStorage whenever attempts, solved, or frame changes
  useEffect(() => {
    if (attempts.length > 0 || solved) {
      saveDailyGameState({
        gameDate: game.gameDate,
        attempts,
        solved,
        frame,
        completed: finished,
      });
    }
  }, [attempts, solved, frame, finished, game.gameDate]);

  function primaryTitle(drama: Drama) {
    return locale === "en" ? drama.titleEn : drama.titleKr;
  }

  function secondaryTitle(drama: Drama) {
    return locale === "en" ? drama.titleKr : drama.titleEn;
  }

  function goToFrame(targetIndex: number) {
    if (targetIndex < 0 || targetIndex > unlockedFrame) return;
    setFrame(targetIndex);
    setFrameKey((k) => k + 1);
  }

  function advanceFrame() {
    goToFrame(Math.min(frame + 1, Math.max(frames.length - 1, 0)));
  }

  function submitGuess(value = guess) {
    if (solved || attempts.length >= 5) return;

    const clean = value.trim();
    if (!clean) {
      setNotice(t("enterTitle"));
      return;
    }

    const correct = matchesAlias(clean, answer.aliases);
    const nextAttempt = attempts.length + 1;

    setAttempts((prev) => [...prev, clean]);
    setGuess("");
    setSuggestIndex(-1);

    if (correct) {
      setSolved(true);
      setNotice(t("correct"));
      return;
    }

    setShake(true);
    window.setTimeout(() => setShake(false), 420);

    if (nextAttempt < 5) {
      advanceFrame();
      setNotice(t("wrongNext"));
    } else {
      setFrame(Math.max(frames.length - 1, 0));
      setFrameKey((k) => k + 1);
      setNotice(t("seeAnswer"));
    }
  }

  function skipCut() {
    if (solved || attempts.length >= 5) return;
    const nextAttempt = attempts.length + 1;
    const skipLabel = locale === "ko" ? "건너뜀" : "Skipped";

    setAttempts((prev) => [...prev, skipLabel]);
    setGuess("");
    setSuggestIndex(-1);
    setNotice("");

    if (nextAttempt < 5) {
      advanceFrame();
    } else {
      setFrame(Math.max(frames.length - 1, 0));
      setFrameKey((k) => k + 1);
      setNotice(t("seeAnswer"));
    }
  }

  function noticeFor(outcome: ShareOutcome, copiedMessage: string): string {
    if (outcome === "copied") return copiedMessage;
    if (outcome === "failed") return t("shareLinkFallback");
    return "";
  }

  function renderShareLink(url: string, setNotice: (value: string) => void) {
    return (
      <div className="share-link-row">
        <a
          className="share-link-url"
          href={url}
          target="_blank"
          rel="noopener noreferrer"
        >
          {url.replace(/^https?:\/\//, "")}
        </a>
        <button
          type="button"
          className="share-link-copy"
          onClick={async () => {
            const ok = await copyToClipboard(url);
            setNotice(ok ? t("linkCopied") : t("shareLinkFallback"));
          }}
        >
          {t("copyLink")}
        </button>
      </div>
    );
  }

  async function inviteFriend() {
    const payload = buildInviteShare({
      locale,
      brand: t("brandName"),
      gameDate: game.gameDate,
      todayDate,
    });
    const outcome = await shareOrCopy(payload);
    setInviteLink(payload.url);
    setInviteNotice(noticeFor(outcome, t("shareGameCopied")));
  }

  async function shareResult() {
    const payload = buildScoreShare({
      locale,
      brand: t("brandName"),
      gameDate: game.gameDate,
      todayDate,
      solved,
      attempts: attempts.length,
      score: scoreEarned,
    });
    const outcome = await shareOrCopy(payload);
    setShareLink(payload.url);
    setShareNotice(noticeFor(outcome, t("shareCopied")));
  }

  async function shareChallenge() {
    const payload = buildChallengeShare({
      locale,
      brand: t("brandName"),
      gameDate: game.gameDate,
      todayDate,
      solved,
      attempts: attempts.length,
    });
    const outcome = await shareOrCopy(payload);
    setShareLink(payload.url);
    setShareNotice(noticeFor(outcome, t("challengeCopied")));
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (!suggestions.length) {
      if (event.key === "Enter") {
        event.preventDefault();
        submitGuess();
      }
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setSuggestIndex((i) => (i >= suggestions.length - 1 ? 0 : i + 1));
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setSuggestIndex((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      if (suggestIndex >= 0 && suggestions[suggestIndex]) {
        const drama = suggestions[suggestIndex];
        const title = primaryTitle(drama);
        setGuess(title);
        submitGuess(title);
      } else {
        submitGuess();
      }
    }
  }

  const showScene = Boolean(currentSrc) && !imgBroken;

  return (
    <div className="game-shell">
      {/* LEFT: Scene Cut Theater */}
      <div className="scene-wrap">
        <div className={`scene ${shake ? "scene-shake" : ""}`}>
          {showScene ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={frameKey}
              className="scene-frame-img"
              src={currentSrc}
              alt={`${t("sceneLabel")} ${frame + 1}`}
              draggable={false}
              fetchPriority={frame === 0 ? "high" : "auto"}
              loading="eager"
              decoding="async"
              onError={() => setImgBroken(true)}
            />
          ) : (
            <div className="scene-empty">{t("emptyScene")}</div>
          )}

          <div className="scene-grain" aria-hidden />
          <div className="scene-vignette" aria-hidden />

          <div className="scene-hud">
            <span>
              {t("sceneLabel")} {String(frame + 1).padStart(2, "0")} / 05
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
            onClick={() => goToFrame(frame - 1)}
            disabled={frame <= 0}
            aria-label={t("prevFrame")}
          >
            <IconChevronLeft size={16} /> {t("prevFrame")}
          </button>

          <div className="frame-dots" role="group" aria-label={t("sceneLabel")}>
            {(frames.length ? frames : [null, null, null, null, null]).map(
              (_, index) => (
                <button
                  key={index}
                  type="button"
                  className={`dot-btn ${index <= frame ? "active" : ""} ${
                    index <= unlockedFrame ? "unlocked" : "locked"
                  }`}
                  onClick={() => goToFrame(index)}
                  disabled={index > unlockedFrame}
                  aria-label={`Frame ${index + 1}`}
                />
              ),
            )}
          </div>

          <button
            type="button"
            className="frame-nav-btn"
            onClick={() => goToFrame(frame + 1)}
            disabled={frame >= unlockedFrame}
            aria-label={t("nextFrame")}
          >
            {t("nextFrame")} <IconChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* RIGHT: Clean Interactive Gameplay Console */}
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
                onClick={() => void inviteFriend()}
                title={t("shareGame")}
              >
                <IconShare size={12} />
                <span>{t("shareGame")}</span>
              </button>
            </div>
          </div>

          <h2 className="console-title">{t("whatDrama")}</h2>
        </div>

        {inviteNotice && (
          <p className="game-notice success">{inviteNotice}</p>
        )}

        {inviteLink && renderShareLink(inviteLink, setInviteNotice)}

        {/* ACTIVE PLAY: Single Unified Search & Guess Box */}
        {!finished ? (
          <div className="unified-play-box">
            {/* The Single Unified Search Input */}
            <div className={`unified-input-wrap ${shake ? "search-shake" : ""}`}>
              <IconSearch size={18} className="unified-search-icon" />
              <input
                ref={inputRef}
                value={guess}
                onChange={(event) => {
                  setGuess(event.target.value);
                  setSuggestIndex(-1);
                }}
                onKeyDown={onKeyDown}
                placeholder={t("guessPlaceholder")}
                autoComplete="off"
                autoFocus
              />
              {guess && (
                <button
                  type="button"
                  className="unified-clear-btn"
                  onClick={() => {
                    setGuess("");
                    setSuggestIndex(-1);
                    inputRef.current?.focus();
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

              {/* Autocomplete Dropdown */}
              {suggestions.length > 0 && (
                <div className="suggestions" role="listbox">
                  {suggestions.map((drama, index) => (
                    <button
                      key={drama.id}
                      type="button"
                      role="option"
                      aria-selected={index === suggestIndex}
                      className={index === suggestIndex ? "active" : ""}
                      onClick={() => {
                        const title = primaryTitle(drama);
                        setGuess(title);
                        submitGuess(title);
                      }}
                    >
                      <strong>{primaryTitle(drama)}</strong>
                      <span>{secondaryTitle(drama)} · {drama.year}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Action Row: Skip Button + Visual Attempt Dots */}
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
                  const isCurrent = i === attempts.length;
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

            {notice && <div className="game-notice">{notice}</div>}

            {/* Previous Attempts History (Only shown once user has made attempts) */}
            {attempts.length > 0 && (
              <div className="guess-history-list">
                <span className="guess-history-label">
                  {locale === "ko" ? "이전 시도 기록" : "Previous guesses"}
                </span>
                {attempts.map((item, index) => {
                  const isSkipped = item === "Skipped" || item === "건너뜀";
                  return (
                    <div key={index} className={`guess-history-item ${isSkipped ? "skipped" : "wrong"}`}>
                      <span className="history-num">{index + 1}</span>
                      <span className="history-text">{item}</span>
                      <span className="history-badge">{isSkipped ? "⏭️" : "❌"}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          /* Finished State: Elegant Result Card */
          <div className="result-card-clean">
            <div className="result-badge-row">
              <span className={`result-status-tag ${solved ? "won" : "lost"}`}>
                {solved ? t("answerEyebrow") : t("answerReveal")}
              </span>
              {solved && (
                <span className="result-pts-tag">
                  +{scoreEarned} {t("ptsEarned")}
                </span>
              )}
            </div>

            <div className="result-drama-titles">
              <h3 className="result-primary-title">{primaryTitle(answer)}</h3>
              <p className="result-secondary-title">
                {secondaryTitle(answer)} · {answer.year}
              </p>
            </div>

            {solved && (
              <p className="result-summary-line">
                🎯 {attempts.length} {t("solvedIn")}
              </p>
            )}

            <div className="result-action-row">
              <button
                type="button"
                className="result-share-btn"
                onClick={() => void shareResult()}
              >
                <IconShare size={15} /> {t("shareResult")}
              </button>
              <button
                type="button"
                className="result-challenge-link"
                onClick={() => void shareChallenge()}
              >
                ⚔️ {t("challengeFriend")}
              </button>
            </div>

            {shareNotice && (
              <p className="game-notice success" style={{ marginTop: 8 }}>
                {shareNotice}
              </p>
            )}

            {shareLink && renderShareLink(shareLink, setShareNotice)}
          </div>
        )}
      </div>
    </div>
  );
}
