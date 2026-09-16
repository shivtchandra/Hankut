"use client";

import { useRef, useState } from "react";
import { matchesAlias } from "@/lib/game/normalization";
import { IconCheck, IconLock, IconMusic, IconPlay, IconUnlock } from "@/components/icons/Icons";
import type { SongPayload } from "@/types/game";

type Props = {
  payload: SongPayload;
  onSolve?: (attemptsCount: number, timeSec: number) => void;
  onFail?: () => void;
};

export function SongGameView({ payload, onSolve, onFail }: Props) {
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
    audio.currentTime = payload.startSeconds ?? 0;
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
      setNotice("정답입니다!");
      const timeSec = Math.round((Date.now() - startTimeRef.current) / 1000);
      onSolve?.(nextAttempts.length, timeSec);
      return;
    }

    if (nextAttempts.length < 5) {
      setLevel((l) => Math.min(l + 1, segments.length - 1));
      setNotice(`오답입니다. 다음 오디오 구간(${segments[Math.min(level + 1, segments.length - 1)]}초)이 해금되었습니다.`);
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
          <div className="audio-badge">
            <IconMusic size={14} style={{ marginRight: 6, display: "inline-block", verticalAlign: "middle" }} />
            오늘의 노래
          </div>

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
              <IconPlay size={16} style={{ marginRight: 6 }} />
              {isPlaying ? "재생 중..." : `${currentDuration}초 듣기`}
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
          <span className="eyebrow">오늘의 노래</span>
          <h2>이 노래의 제목이나 가수를 맞혀보세요</h2>
        </div>

        <div className="search-wrap">
          <input
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submitGuess()}
            placeholder="노래 제목 또는 가수 이름을 입력하세요"
            disabled={finished}
          />
          <button type="button" onClick={submitGuess} disabled={!guess.trim() || finished}>
            제출
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
                  <span>{clue.label}</span>
                  {used ? <IconUnlock size={14} /> : <IconLock size={14} />}
                </div>
                <strong>{used ? clue.value : unlocked ? "힌트 열기" : "잠김"}</strong>
              </button>
            );
          })}
        </div>

        {finished && (
          <div className="result-card">
            <span className="eyebrow">{solved ? "정답 성공" : "정답 공개"}</span>
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
