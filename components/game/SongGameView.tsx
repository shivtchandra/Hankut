"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import {
  IconCheck,
  IconLock,
  IconMusic,
  IconPlay,
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
import type { SongPayload } from "@/types/game";

type SearchResult = { id: string; titleKr: string; titleEn: string; type: string };

type Props = {
  payload: SongPayload;
  gameDate?: string;
  onSolve?: (attemptsCount: number, timeSec: number) => void;
  onFail?: () => void;
};

export function SongGameView({ payload, gameDate, onSolve, onFail }: Props) {
  const { locale, t } = useLocale();
  const segments = payload.segments || [1, 2, 4, 7, 12];
  const [level, setLevel] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [guess, setGuess] = useState("");
  const [suggestions, setSuggestions] = useState<SearchResult[]>([]);
  const [suggestIndex, setSuggestIndex] = useState(-1);
  const [isSearching, setIsSearching] = useState(false);
  const [attempts, setAttempts] = useState<string[]>([]);
  const [solved, setSolved] = useState(false);
  const [notice, setNotice] = useState("");
  const [shareNotice, setShareNotice] = useState("");

  const [embedKey, setEmbedKey] = useState(0);
  const [activeEmbed, setActiveEmbed] = useState<{ src: string; duration: number } | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  const stopTimerRef = useRef<number | null>(null);
  const searchAbortRef = useRef<AbortController | null>(null);

  const currentDuration = segments[level] || 1;
  const exhausted = !solved && attempts.length >= 5;
  const finished = solved || exhausted;
  const activeDate = gameDate || seoulToday();

  // Display info for result card (only shown after game ends)
  const songDisplayTitle = locale === "en" && payload.titleEn ? payload.titleEn : payload.titleKr;
  const songDisplayArtist = locale === "en" && payload.artistEn ? payload.artistEn : payload.artistKr;

  // --- Drama search via API ---
  const fetchSuggestions = useCallback(async (q: string) => {
    if (!q.trim()) { setSuggestions([]); return; }
    if (searchAbortRef.current) searchAbortRef.current.abort();
    const ctrl = new AbortController();
    searchAbortRef.current = ctrl;
    setIsSearching(true);
    try {
      const res = await fetch(`/api/game/search?q=${encodeURIComponent(q.trim())}&type=drama`, { signal: ctrl.signal });
      if (!res.ok) return;
      const data: SearchResult[] = await res.json();
      setSuggestions(data.slice(0, 8));
    } catch {
      // aborted or network error
    } finally {
      setIsSearching(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => fetchSuggestions(guess), 200);
    return () => clearTimeout(timer);
  }, [guess, fetchSuggestions]);

  // --- Audio playback ---
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

  // --- Guess logic: check against payload.dramaTitle + aliases ---
  function isCorrectDrama(value: string) {
    const norm = (s: string) => s.toLowerCase().replace(/\s+/g, "").replace(/[^\w가-힣]/g, "");
    const v = norm(value);
    const targets = [
      payload.dramaTitle,
      ...(payload.aliases || []),
    ].filter(Boolean) as string[];
    return targets.some((t) => norm(t) === v || norm(t).includes(v) || v.includes(norm(t)));
  }

  function submitGuess(value = guess) {
    if (finished) return;
    const clean = value.trim();
    if (!clean) return;

    const correct = isCorrectDrama(clean);
    const nextAttempts = [...attempts, clean];
    setAttempts(nextAttempts);
    setGuess("");
    setSuggestions([]);
    setSuggestIndex(-1);

    if (correct) {
      setSolved(true);
      setNotice(t("correct"));
      const timeSec = Math.round((Date.now() - startTimeRef.current) / 1000);
      onSolve?.(nextAttempts.length, timeSec);
      return;
    }

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
          ? `아쉽네요. 정답 드라마는 "${payload.dramaTitle}" 입니다.`
          : `Game over. The drama was "${payload.dramaTitle}".`
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
    setSuggestions([]);
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
          ? `아쉽네요. 정답 드라마는 "${payload.dramaTitle}" 입니다.`
          : `Game over. The drama was "${payload.dramaTitle}".`
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

      {/* Guess panel */}
      <div className="guess-panel">
        <div className="guess-heading">
          <div className="guess-heading-top" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span className="eyebrow">{t("todaySong")}</span>
            <button type="button" className="scene-share-btn" onClick={handleShareGame} title={t("shareGame")}>
              <IconShare size={13} />
              <span>{t("shareGame")}</span>
            </button>
          </div>
          <h2>{locale === "ko" ? "이 노래가 나오는 드라마는?" : "Which drama is this song from?"}</h2>
        </div>

        <div className="search-wrap" style={{ position: "relative" }}>
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
                  const s = suggestions[suggestIndex];
                  submitGuess(locale === "en" && s.titleEn ? s.titleEn : s.titleKr);
                } else {
                  submitGuess();
                }
              } else if (e.key === "Escape") {
                setSuggestions([]);
                setSuggestIndex(-1);
              }
            }}
            placeholder={locale === "ko" ? "드라마 제목을 검색하세요..." : "Search drama title..."}
            disabled={finished}
            autoComplete="off"
          />
          <button type="button" onClick={() => submitGuess()} disabled={!guess.trim() || finished}>
            {t("submit")}
          </button>

          {suggestions.length > 0 && !finished && (
            <div className="suggestions" role="listbox">
              {suggestions.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  role="option"
                  aria-selected={index === suggestIndex}
                  className={index === suggestIndex ? "active" : ""}
                  onClick={() => {
                    const val = locale === "en" && item.titleEn ? item.titleEn : item.titleKr;
                    submitGuess(val);
                  }}
                >
                  <strong>{locale === "en" && item.titleEn ? item.titleEn : item.titleKr}</strong>
                  {item.titleKr && item.titleEn && (
                    <span>{locale === "en" ? item.titleKr : item.titleEn}</span>
                  )}
                </button>
              ))}
            </div>
          )}

          {isSearching && guess.trim() && !finished && (
            <div className="suggestions" role="status" style={{ padding: "8px 12px", color: "var(--muted)" }}>
              {locale === "ko" ? "검색 중…" : "Searching…"}
            </div>
          )}
        </div>

        {!finished && (
          <div className="unified-action-row" style={{ marginTop: 10 }}>
            <button
              type="button"
              className="unified-skip-btn"
              onClick={skipClip}
              disabled={attempts.length >= 5}
            >
              <IconSkipForward size={14} />
              <span>{locale === "ko" ? "넘기기 (다음 오디오)" : "Skip (+1 clip)"}</span>
            </button>
          </div>
        )}

        {notice && <div className="game-notice">{notice}</div>}
        {shareNotice && <div className="game-notice" style={{ background: "#FEF3C7", color: "#92400E" }}>{shareNotice}</div>}

        {finished && (
          <div className="result-card">
            <span className="eyebrow">{solved ? t("answerEyebrow") : t("answerReveal")}</span>
            <h3>{payload.dramaTitle || (locale === "ko" ? "드라마 정보 없음" : "Unknown Drama")}</h3>
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
                style={{ background: "var(--ink)", color: "var(--paper)", border: "none", borderRadius: 8, padding: "10px 14px", fontWeight: 600, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6, cursor: "pointer" }}
                onClick={handleShareResult}
              >
                <IconShare size={15} /> {t("shareResult")}
              </button>
              <button
                type="button"
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
