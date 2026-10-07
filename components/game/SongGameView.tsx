"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { matchesAlias, normalize, rawNormalize } from "@/lib/game/normalization";
import {
  IconCheck,
  IconLock,
  IconMusic,
  IconPlay,
  IconUnlock,
  IconSkipForward,
  IconShare,
  IconFlame,
  IconSearch,
} from "@/components/icons/Icons";
import { getStreak } from "@/lib/game/streak";
import {
  buildInviteShare,
  buildScoreShare,
  buildChallengeShare,
  shareOrCopy,
} from "@/lib/game/share";
import { seoulToday } from "@/lib/game/dates";
import type { Drama, SongPayload } from "@/types/game";

type Props = {
  payload: SongPayload;
  dramas?: Drama[];
  gameDate?: string;
  onSolve?: (attemptsCount: number, timeSec: number) => void;
  onFail?: () => void;
};

export function SongGameView({ payload, dramas = [], gameDate, onSolve, onFail }: Props) {
  const { locale, t } = useLocale();
  const segments = payload.segments || [1, 2, 4, 7, 12];
  const [level, setLevel] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [guess, setGuess] = useState("");
  const [suggestIndex, setSuggestIndex] = useState(-1);
  const [attempts, setAttempts] = useState<string[]>([]);
  const [solved, setSolved] = useState(false);
  const [notice, setNotice] = useState("");
  const [shareNotice, setShareNotice] = useState("");
  const [shake, setShake] = useState(false);
  const [streak, setStreak] = useState(0);

  const [embedKey, setEmbedKey] = useState(0);
  const [activeEmbed, setActiveEmbed] = useState<{ src: string; duration: number } | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  const stopTimerRef = useRef<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setStreak(getStreak());
  }, []);

  const currentDuration = segments[level] || 1;
  const exhausted = !solved && attempts.length >= 5;
  const finished = solved || exhausted;
  const activeDate = gameDate || seoulToday();

  // Display info for result card
  const songDisplayTitle = locale === "en" && payload.titleEn ? payload.titleEn : payload.titleKr;
  const songDisplayArtist = locale === "en" && payload.artistEn ? payload.artistEn : payload.artistKr;

  function primaryTitle(d: Drama) {
    return locale === "en" ? d.titleEn : d.titleKr;
  }
  function secondaryTitle(d: Drama) {
    return locale === "en" ? d.titleKr : d.titleEn;
  }

  // Pre-index normalized drama list for zero-lag instant autocomplete
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

  // Audio playback
  function playSegment(clip = level) {
    if (stopTimerRef.current) window.clearTimeout(stopTimerRef.current);
    const duration = segments[clip] ?? 1;
    const startSec = payload.clipStarts?.[clip] ?? payload.startSeconds ?? 0;

    if (payload.spotifyTrackId) {
      const embedSrc = `https://open.spotify.com/embed/track/${payload.spotifyTrackId}?utm_source=generator&t=${Math.floor(startSec)}`;
      setEmbedKey((k) => k + 1);
      setActiveEmbed({ src: embedSrc, duration });
      setIsPlaying(true);
      stopTimerRef.current = window.setTimeout(() => {
        setActiveEmbed(null);
        setIsPlaying(false);
      }, duration * 1000);
    } else {
      if (!audioRef.current) {
        audioRef.current = new Audio(payload.audioUrl);
      }
      const audio = audioRef.current;
      audio.currentTime = startSec;
      audio.play().catch(() => {});
      setIsPlaying(true);
      stopTimerRef.current = window.setTimeout(() => {
        audio.pause();
        setIsPlaying(false);
      }, duration * 1000);
    }
  }

  function isCorrectDrama(value: string) {
    const targets = [
      payload.dramaTitle,
      ...(payload.aliases || []),
    ].filter(Boolean) as string[];
    return matchesAlias(value, targets);
  }

  function submitGuess(value = guess) {
    if (finished) return;
    const clean = value.trim();
    if (!clean) return;

    const correct = isCorrectDrama(clean);
    const nextAttempts = [...attempts, clean];
    setAttempts(nextAttempts);
    setGuess("");
    setSuggestIndex(-1);

    if (correct) {
      setSolved(true);
      setNotice(t("correct"));
      const timeSec = Math.round((Date.now() - startTimeRef.current) / 1000);
      onSolve?.(nextAttempts.length, timeSec);
      return;
    }

    setShake(true);
    setTimeout(() => setShake(false), 420);

    if (nextAttempts.length < 5) {
      const nextDur = segments[Math.min(level + 1, segments.length - 1)];
      setLevel((l) => Math.min(l + 1, segments.length - 1));
      setNotice(
        locale === "ko"
          ? `오답입니다. 다음 오디오 구간(${nextDur}초)이 해금되었습니다.`
          : `Incorrect. Next clip (${nextDur}s) unlocked.`
      );
    } else {
      setNotice(
        locale === "ko"
          ? `아쉽네요. 정답 드라마는 "${payload.dramaTitle || "드라마"}" 입니다.`
          : `Game over. The drama was "${payload.dramaTitle || "the drama"}".`
      );
      onFail?.();
    }
  }

  function skipClip() {
    if (finished) return;
    const skipLabel = locale === "ko" ? "건너뜀" : "Skipped";
    const nextAttempts = [...attempts, skipLabel];
    setAttempts(nextAttempts);
    setGuess("");
    setSuggestIndex(-1);

    if (nextAttempts.length < 5) {
      const nextDur = segments[Math.min(level + 1, segments.length - 1)];
      setLevel((l) => Math.min(l + 1, segments.length - 1));
      setNotice(
        locale === "ko"
          ? `건너뛰었습니다. 다음 오디오 구간(${nextDur}초)이 해금되었습니다.`
          : `Skipped. Next clip (${nextDur}s) unlocked.`
      );
    } else {
      setNotice(
        locale === "ko"
          ? `아쉽네요. 정답 드라마는 "${payload.dramaTitle || "드라마"}" 입니다.`
          : `Game over. The drama was "${payload.dramaTitle || "the drama"}".`
      );
      onFail?.();
    }
  }

  async function handleShareGame() {
    const shareData = buildInviteShare({ locale, brand: t("brandName"), gameDate: activeDate, todayDate: seoulToday() });
    const outcome = await shareOrCopy(shareData);
    setShareNotice(outcome === "copied" ? t("shareGameCopied") : outcome === "shared" ? "" : t("shareFailed"));
    if (outcome === "copied") setTimeout(() => setShareNotice(""), 2500);
  }

  async function handleShareResult() {
    const score = solved ? Math.max(25 - (attempts.length - 1) * 5, 5) : 0;
    const shareData = buildScoreShare({ locale, brand: t("brandName"), gameDate: activeDate, todayDate: seoulToday(), solved, attempts: attempts.length, score });
    const outcome = await shareOrCopy(shareData);
    setShareNotice(outcome === "copied" ? t("shareCopied") : outcome === "shared" ? "" : t("shareFailed"));
    if (outcome === "copied") setTimeout(() => setShareNotice(""), 2500);
  }

  async function handleShareChallenge() {
    const shareData = buildChallengeShare({ locale, brand: t("brandName"), gameDate: activeDate, todayDate: seoulToday(), solved, attempts: attempts.length });
    const outcome = await shareOrCopy(shareData);
    setShareNotice(outcome === "copied" ? t("challengeCopied") : outcome === "shared" ? "" : t("shareFailed"));
    if (outcome === "copied") setTimeout(() => setShareNotice(""), 2500);
  }

  return (
    <div className="game-shell">
      {/* Audio player */}
      <div className="audio-hero-wrap">
        <div className={`audio-card ${isPlaying ? "playing" : ""}`}>
          <div className="audio-badge">
            <IconMusic size={14} style={{ marginRight: 6, display: "inline-block", verticalAlign: "middle" }} />
            {t("todaySong")}
          </div>

          {activeEmbed && (
            <iframe
              key={embedKey}
              src={activeEmbed.src}
              width="0"
              height="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              style={{ position: "absolute", opacity: 0, pointerEvents: "none" }}
              title="spotify-clip"
            />
          )}

          <div className="waveform-display">
            {[...Array(16)].map((_, i) => (
              <span
                key={i}
                className="wave-bar"
                style={{
                  height: isPlaying ? `${Math.floor(Math.random() * 40) + 20}px` : "12px",
                  transition: "height 0.15s ease",
                }}
              />
            ))}
          </div>

          <div className="audio-controls">
            <button
              type="button"
              className="audio-play-btn"
              onClick={() => playSegment()}
              disabled={isPlaying}
            >
              <IconPlay size={16} style={{ marginRight: 6 }} />
              {isPlaying
                ? t("playing")
                : locale === "ko"
                ? `${currentDuration}초 듣기`
                : `Listen ${currentDuration}s`}
            </button>
          </div>

          <div className="duration-steps">
            {segments.map((dur, idx) => (
              <button
                key={idx}
                type="button"
                className={`dur-chip ${idx <= level ? "active" : ""}`}
                disabled={idx > level}
                onClick={() => playSegment(idx)}
                aria-label={locale === "ko" ? `${idx + 1}번 구간 ${dur}초 듣기` : `Listen segment ${idx + 1} (${dur}s)`}
                style={{ border: "none", font: "inherit", cursor: idx <= level ? "pointer" : "default" }}
              >
                {dur}{locale === "ko" ? "초" : "s"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Guess panel - Matches Image 1 console design & vibe */}
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

        {shareNotice && <div className="game-notice" style={{ background: "#FEF3C7", color: "#92400E", marginBottom: 12 }}>{shareNotice}</div>}

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
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown") {
                    e.preventDefault();
                    setSuggestIndex((i) => (i >= suggestions.length - 1 ? 0 : i + 1));
                  } else if (e.key === "ArrowUp") {
                    e.preventDefault();
                    setSuggestIndex((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
                  } else if (e.key === "Enter") {
                    if (suggestIndex >= 0 && suggestions[suggestIndex]) {
                      const sel = suggestions[suggestIndex];
                      const title = primaryTitle(sel);
                      setGuess(title);
                      submitGuess(title);
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
            </div>

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
                    <span>{secondaryTitle(drama)} {drama.year ? `· ${drama.year}` : ""}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Action Row: Skip Button + Visual Attempt Dots */}
            <div className="unified-action-row">
              <button
                type="button"
                className="unified-skip-btn"
                onClick={skipClip}
                disabled={attempts.length >= 5}
              >
                <IconSkipForward size={14} />
                <span>{locale === "ko" ? "넘기기 (+1 오디오)" : "Skip (+1 clip)"}</span>
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
                      title={att ? `${i + 1}: ${att}` : `Clip ${i + 1}`}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        ) : null}

        {notice && <div className="game-notice" style={{ marginTop: 12 }}>{notice}</div>}

        {finished && (
          <div className="result-card" style={{ marginTop: 16 }}>
            <span className="eyebrow">{solved ? t("answerEyebrow") : t("answerReveal")}</span>
            <h3>{payload.dramaTitle || (locale === "ko" ? "드라마 정보" : "Drama")}</h3>
            <p style={{ marginTop: 4, color: "var(--muted)", fontSize: 14 }}>
              🎵 {songDisplayTitle} — {songDisplayArtist}
            </p>
            {payload.sourceUrl && (
              <a href={payload.sourceUrl} target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", marginTop: 8, fontSize: 13 }}>
                {locale === "ko" ? "Spotify에서 전체 듣기 ↗" : "Listen full track on Spotify ↗"}
              </a>
            )}

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
