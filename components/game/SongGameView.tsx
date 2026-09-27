"use client";

import { useMemo, useRef, useState } from "react";
import { matchesAlias, normalize } from "@/lib/game/normalization";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { localizeClueLabel } from "@/lib/i18n/dictionary";
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
  const [attempts, setAttempts] = useState<string[]>([]);
  const [solved, setSolved] = useState(false);
  const [usedClues, setUsedClues] = useState<string[]>([]);
  const [notice, setNotice] = useState("");
  const [shareNotice, setShareNotice] = useState("");
  const [suggestIndex, setSuggestIndex] = useState(-1);

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
  const activeDate = gameDate || seoulToday();

  const displayTitle = locale === "en" && payload.titleEn ? payload.titleEn : payload.titleKr;
  const displayArtist = locale === "en" && payload.artistEn ? payload.artistEn : payload.artistKr;

  // Build searchable options list from payload and dramas
  const searchCandidates = useMemo(() => {
    const list: { primary: string; secondary: string; cleanVal: string }[] = [];
    const seen = new Set<string>();

    // Add current song metadata
    const addCandidate = (primary: string, secondary: string, cleanVal: string) => {
      const key = cleanVal.toLowerCase().trim();
      if (!key || seen.has(key)) return;
      seen.add(key);
      list.push({ primary, secondary, cleanVal });
    };

    if (payload.titleKr) addCandidate(payload.titleKr, payload.artistKr || "Song", payload.titleKr);
    if (payload.titleEn) addCandidate(payload.titleEn, payload.artistEn || "Song", payload.titleEn);
    if (payload.artistKr) addCandidate(payload.artistKr, "Artist", payload.artistKr);
    if (payload.artistEn) addCandidate(payload.artistEn, "Artist", payload.artistEn);
    if (payload.dramaTitle) addCandidate(payload.dramaTitle, "Drama OST", payload.dramaTitle);

    payload.aliases.forEach((a) => addCandidate(a, "Title / Alias", a));

    // Add dramas from catalog for OST / drama matching
    dramas.forEach((d) => {
      const p = locale === "en" ? d.titleEn : d.titleKr;
      const s = locale === "en" ? d.titleKr : d.titleEn;
      addCandidate(p, s ? `${s} (Drama)` : "Drama", p);
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

  function submitGuess(value = guess) {
    if (finished) return;
    const clean = value.trim();
    if (!clean) return;

    const isCorrect = matchesAlias(clean, payload.aliases);
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
          <div className="guess-heading-top" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span className="eyebrow">{t("todaySong")}</span>
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
          <h2>{t("whatSong")}</h2>
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
            placeholder={t("songPlaceholder")}
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
              <a href={payload.sourceUrl} target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", marginTop: 8 }}>
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
