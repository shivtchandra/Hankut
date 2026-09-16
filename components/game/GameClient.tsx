"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { useLocale } from "@/components/i18n/LocaleProvider";
import { localizeClueLabel } from "@/lib/i18n/dictionary";
import { matchesAlias, normalize } from "@/lib/game/normalization";
import {
  buildShareText,
  getStreak,
  recordDailyPlay,
} from "@/lib/game/streak";
import { IconChevronLeft, IconChevronRight, IconLock, IconShare, IconUnlock, IconFlame } from "@/components/icons/Icons";
import type { Drama, TodayGame } from "@/types/game";

type Props = {
  game: TodayGame;
  dramas: Drama[];
};

export function GameClient({ game, dramas }: Props) {
  const { locale, t } = useLocale();
  const frames = game.scene.frames;
  const clues = game.scene.clues;
  const answer = game.scene.drama;

  const [frame, setFrame] = useState(0);
  const [guess, setGuess] = useState("");
  const [attempts, setAttempts] = useState<string[]>([]);
  const [solved, setSolved] = useState(false);
  const [usedClues, setUsedClues] = useState<string[]>([]);
  const [notice, setNotice] = useState("");
  const [shake, setShake] = useState(false);
  const [frameKey, setFrameKey] = useState(0);
  const [imgBroken, setImgBroken] = useState(false);
  const [suggestIndex, setSuggestIndex] = useState(-1);
  const [streak, setStreak] = useState(0);
  const [shareNotice, setShareNotice] = useState("");
  const [inviteNotice, setInviteNotice] = useState("");
  const finishedRef = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const exhausted = !solved && attempts.length >= 5;
  const finished = solved || exhausted;
  const currentSrc = frames[frame];

  const unlockedFrame = useMemo(() => {
    if (solved) return Math.max(frames.length - 1, 0);
    return Math.min(attempts.length, Math.max(frames.length - 1, 0));
  }, [solved, attempts.length, frames.length]);

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
    setStreak(getStreak());
  }, []);

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

  function useClue(clueId: string, unlockAfter: number) {
    if (attempts.length < unlockAfter) return;
    if (usedClues.includes(clueId)) return;
    setUsedClues((prev) => [...prev, clueId]);
  }

  async function inviteFriend() {
    const shareUrl = typeof window !== "undefined" ? window.location.origin : "https://dramacut.com";
    const text = `${t("brandName")} — Can you guess today's K-drama cut?\n${shareUrl}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: t("brandName"),
          text: `${t("brandName")} — Can you guess today's K-drama cut?`,
          url: shareUrl,
        });
        return;
      } catch {
        // Fallback to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      setInviteNotice("Game link copied! Send it to your friends to play.");
    } catch {
      setInviteNotice(t("shareFailed"));
    }
  }

  async function shareResult() {
    const text = buildShareText({
      brand: t("brandName"),
      gameDate: game.gameDate,
      solved,
      attempts: attempts.length,
      framesUsed: frame + 1,
    });

    try {
      await navigator.clipboard.writeText(text);
      setShareNotice(t("shareCopied"));
    } catch {
      setShareNotice(t("shareFailed"));
    }
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      setGuess("");
      setSuggestIndex(-1);
      return;
    }

    if (event.key === "ArrowDown" && suggestions.length) {
      event.preventDefault();
      setSuggestIndex((i) => (i + 1) % suggestions.length);
      return;
    }

    if (event.key === "ArrowUp" && suggestions.length) {
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
      <div className="scene-wrap">
        <div className={`scene ${shake ? "scene-shake" : ""}`}>
          {showScene ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={frameKey}
              className="scene-frame-img"
              src={currentSrc}
              alt=""
              draggable={false}
              onError={() => setImgBroken(true)}
            />
          ) : (
            <div className="scene-empty">{t("emptyScene")}</div>
          )}

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
            onClick={() => goToFrame(frame - 1)}
            disabled={frame <= 0}
            aria-label={t("prevFrame")}
          >
            <IconChevronLeft size={16} /> {t("prevFrame")}
          </button>

          <div className="frame-dots" aria-hidden>
            {(frames.length ? frames : [null, null, null, null, null]).map(
              (_, index) => (
                <span
                  key={index}
                  className={index <= frame ? "dot active" : "dot"}
                  onClick={() => goToFrame(index)}
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

      <div className="guess-panel">
        <div className="guess-heading">
          <div className="guess-heading-top">
            <span className="eyebrow">{t("yourGuess")}</span>
            <button type="button" className="scene-share-btn" onClick={() => void inviteFriend()}>
              <IconShare size={14} /> {t("shareGame")}
            </button>
          </div>
          <h2>{t("whatDrama")}</h2>
          {inviteNotice && (
            <p className="game-notice" style={{ marginTop: 6 }}>{inviteNotice}</p>
          )}
        </div>

        <div className={`search-wrap ${shake ? "search-shake" : ""}`}>
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
                  <span>{secondaryTitle(drama)}</span>
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
                <div className="clue-header">
                  <span>{localizeClueLabel(clue.label, locale)}</span>
                  {used ? <IconUnlock size={14} /> : <IconLock size={14} />}
                </div>
                <strong>
                  {used ? clue.value : unlocked ? t("reveal") : t("locked")}
                </strong>
              </button>
            );
          })}
        </div>

        {streak > 0 && (
          <div className="streak-chip">
            <IconFlame size={15} style={{ color: "#DC2626" }} />
            <strong>{streak}</strong>
            <span>{t("streak")}</span>
          </div>
        )}

        {finished && (
          <div className="result-card">
            <span className="eyebrow">
              {solved ? t("answerEyebrow") : t("answerReveal")}
            </span>
            <h3>{primaryTitle(answer)}</h3>
            <p>{secondaryTitle(answer)}</p>

            {solved && (
              <div className="result-stat">
                <strong>{attempts.length}</strong>
                <span>{t("solvedIn")}</span>
              </div>
            )}

            <div className="result-actions">
              <a className="primary-action" href={`/challenge/${game.id.slice(0, 8)}`}>
                {t("challengeFriend")}
              </a>
              <button
                type="button"
                className="secondary-action"
                onClick={() => void shareResult()}
              >
                {t("shareResult")}
              </button>
            </div>
            {shareNotice && (
              <p className="game-notice" style={{ color: "rgba(255,255,255,.65)" }}>
                {shareNotice}
              </p>
            )}
          </div>
        )}

        <div className="attempts">
          {attempts.map((item, index) => (
            <div className="attempt" key={`${item}-${index}`}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{item}</strong>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
