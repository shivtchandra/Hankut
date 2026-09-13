"use client";

import { useLocale } from "@/components/i18n/LocaleProvider";
import { useEffect, useRef, useState } from "react";
import { matchesAlias } from "@/lib/game/normalization";
import type { SongPayload } from "@/types/game";

type Props = {
  payload: SongPayload;
  onSolve?: (attemptsCount: number, timeSec: number) => void;
  onFail?: () => void;
};

export function SongGameView({
  const { locale, t } = useLocale();
 payload, onSolve, onFail }: Props) {
  const segments = payload.segments || [1, 2, 4, 7, 12];
  const [level, setLevel] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [guess, setGuess] = useState("");
  const [attempts, setAttempts] = useState<string[]>([]);
  const [solved, setSolved] = useState(false);
  const [usedClues, setUsedClues] = useState<string[]>([]);
  const [notice, setNotice] = useState("");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  const currentDuration = segments[level] || 1;
  const exhausted = !solved && attempts.length >= 5;
  const finished = solved || exhausted;

  function playSegment() {
    if (!audioRef.current) {
      audioRef.current = new Audio(payload.audioUrl);
    }
    const audio = audioRef.current;
    audio.currentTime = 0;
    audio.play().catch(() => {});
    setIsPlaying(true);

    setTimeout(() => {
      audio.pause();
      setIsPlaying(false);
    }, currentDuration * 1000);
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
      setNotice(`${t("correct")} 🎵`);
      const timeSec = Math.round((Date.now() - startTimeRef.current) / 1000);
      onSolve?.(nextAttempts.length, timeSec);
      return;
    }

    if (nextAttempts.length < 5) {
      setLevel((l) => Math.min(l + 1, segments.length - 1));
      setNotice(`아쉽네요! 다음 오디오 구간(${segments[Math.min(level + 1, segments.length - 1)]}초)이 해금되었습니다.`);
    } else {
      setNotice(`오답입니다. 정답은 "${payload.titleKr} - ${payload.artistKr}" 입니다.`);
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
          <div className="audio-badge">{t("todaySong")}</div>

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
              onClick={playSegment}
              disabled={isPlaying}
            >
              {isPlaying ? t("playing") : `▶ ${t("listenSeconds").replace("{n}", String(currentDuration))}`}
            </button>
          </div>

          <div className="duration-steps">
            {segments.map((dur, idx) => (
              <span
                key={idx}
                className={`dur-chip ${idx <= level ? "active" : ""}`}
              >
                {dur}초
              </span>
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
                <span>{clue.label}</span>
                <strong>{used ? clue.value : unlocked ? t("reveal") : t("locked")}</strong>
              </button>
            );
          })}
        </div>

        {finished && (
          <div className="result-card">
            <span className="eyebrow">{solved ? t("answerEyebrow") : t("answerReveal")}</span>
            <h3>{payload.titleKr}</h3>
            <p>{payload.artistKr} {payload.dramaTitle ? `(${payload.dramaTitle})` : ""}</p>
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
