"use client";

import { useRef, useState } from "react";
import { matchesAlias } from "@/lib/game/normalization";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { localizeClueLabel } from "@/lib/i18n/dictionary";
import { IconCheck, IconLock, IconMusic, IconPlay, IconUnlock } from "@/components/icons/Icons";
import type { SongPayload } from "@/types/game";

type Props = {
  payload: SongPayload;
  onSolve?: (attemptsCount: number, timeSec: number) => void;
  onFail?: () => void;
};

export function SongGameView({ payload, onSolve, onFail }: Props) {
  const { locale, t } = useLocale();
  const segments = payload.segments || [1, 2, 4, 7, 12];
  const [level, setLevel] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [guess, setGuess] = useState("");
  const [attempts, setAttempts] = useState<string[]>([]);
  const [solved, setSolved] = useState(false);
  const [usedClues, setUsedClues] = useState<string[]>([]);
  const [notice, setNotice] = useState("");

  // For Spotify embed clips: each play remounts the iframe (key trick) to restart from t=
  const [embedKey, setEmbedKey] = useState(0);
  const [activeEmbed, setActiveEmbed] = useState<{ src: string; duration: number } | null>(null);

  // For plain audio fallback (no Spotify track ID)
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  const stopTimerRef = useRef<number | null>(null);

  const currentDuration = segments[level] || 1;
  const exhausted = !solved && attempts.length >= 5;
  const finished = solved || exhausted;

  const displayTitle = locale === "en" && payload.titleEn ? payload.titleEn : payload.titleKr;
  const displayArtist = locale === "en" && payload.artistEn ? payload.artistEn : payload.artistKr;

  function playSegment(clip = level) {
    if (stopTimerRef.current) window.clearTimeout(stopTimerRef.current);
    const duration = segments[clip] ?? 1;
    const startSec = payload.clipStarts?.[clip] ?? payload.startSeconds ?? 0;

    if (payload.spotifyTrackId) {
      // Play via Spotify embed: ?t=START_SECONDS starts the preview/playback there
      const embedSrc = `https://open.spotify.com/embed/track/${payload.spotifyTrackId}?utm_source=generator&t=${Math.floor(startSec)}`;
      setEmbedKey((k) => k + 1);
      setActiveEmbed({ src: embedSrc, duration });
      setIsPlaying(true);

      // Stop (unmount embed) after the clip duration
      stopTimerRef.current = window.setTimeout(() => {
        setActiveEmbed(null);
        setIsPlaying(false);
      }, duration * 1000);
    } else {
      // Fallback: plain audio element
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

  function submitGuess() {
    if (finished || !guess.trim()) return;

    const clean = guess.trim();
    const isCorrect = matchesAlias(clean, payload.aliases);
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
          ? `오답입니다. 정답은 "${payload.titleKr} - ${payload.artistKr}" 입니다.`
          : `Game over. The answer was "${displayTitle} - ${displayArtist}".`
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
      <div className="audio-hero-wrap">
        <div className={`audio-card ${isPlaying ? "playing" : ""}`}>
          <div className="audio-badge">
            <IconMusic size={14} style={{ marginRight: 6, display: "inline-block", verticalAlign: "middle" }} />
            {t("todaySong")}
          </div>

          {/* Spotify embed (hidden iframe — audio only) */}
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
              {isPlaying ? t("playing") : (locale === "ko" ? `${currentDuration}초 듣기` : `Listen ${currentDuration}s`)}
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

      <div className="guess-panel">
        <div className="guess-heading">
          <span className="eyebrow">{t("todaySong")}</span>
          <h2>{t("whatSong")}</h2>
        </div>

        <div className="search-wrap">
          <input
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submitGuess()}
            placeholder={t("songPlaceholder")}
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
            <p>{displayArtist} {payload.dramaTitle ? `(${payload.dramaTitle})` : ""}</p>
            {payload.sourceUrl && (
              <a href={payload.sourceUrl} target="_blank" rel="noopener noreferrer">
                {locale === "ko" ? "Spotify에서 전체 듣기 ↗" : "Listen full track on Spotify ↗"}
              </a>
            )}
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
