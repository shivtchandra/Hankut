"use client";

import { useState } from "react";
import { SceneGameView } from "./SceneGameView";
import { SongGameView } from "./SongGameView";
import { ChosungGameView } from "./ChosungGameView";
import { ConnectionsGameView } from "./ConnectionsGameView";
import { PeopleGameView } from "./PeopleGameView";
import { EditorialShareCard } from "@/components/sharing/EditorialShareCard";
import { calculateTodaysDeokryeok } from "@/lib/game/scoring";
import { getStreak, recordDailyPlay } from "@/lib/game/streak";
import type { Drama, TodaysFiveGame } from "@/types/game";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { puzzleTypeLabel } from "@/lib/i18n/dictionary";

type Props = {
  todaysFive: TodaysFiveGame;
  dramas: Drama[];
};

export function TodaysFiveView({ todaysFive, dramas }: Props) {
  const { locale, t } = useLocale();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scores, setScores] = useState<{ type: string; score: number }[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [finalResult, setFinalResult] = useState<any>(null);

  const totalGames = todaysFive.items.length;
  const currentItem = todaysFive.items[currentIndex];

  function handleGameComplete(type: string, attemptsUsed: number) {
    const gameScore = Math.max(1, 6 - attemptsUsed);
    const nextScores = [...scores, { type, score: gameScore }];
    setScores(nextScores);

    if (currentIndex + 1 < totalGames) {
      setCurrentIndex((i) => i + 1);
    } else {
      finishAllGames(nextScores);
    }
  }

  function handleGameFail(type: string) {
    const nextScores = [...scores, { type, score: 0 }];
    setScores(nextScores);

    if (currentIndex + 1 < totalGames) {
      setCurrentIndex((i) => i + 1);
    } else {
      finishAllGames(nextScores);
    }
  }

  function finishAllGames(finalScores: { type: string; score: number }[]) {
    const streak = recordDailyPlay(todaysFive.gameDate);
    const deokryeok = calculateTodaysDeokryeok({
      gameScores: finalScores,
      streakDays: streak,
      locale,
    });
    setFinalResult(deokryeok);
    setIsCompleted(true);
  }

  if (isCompleted && finalResult) {
    return (
      <div className="todays-five-complete">
        <div className="deokryeok-hero-header">
          <span className="eyebrow">{t("deokryeokResult")}</span>
          <h2>{finalResult.totalScore} / {finalResult.maxScore}</h2>
          <div className="percentile-badge">{finalResult.percentileText}</div>
        </div>

        <div className="category-breakdown-grid">
          {finalResult.categoryBreakdown.map((cat: any, idx: number) => (
            <div key={idx} className="cat-breakdown-chip">
              <span className="cat-icon">{cat.icon}</span>
              <span className="cat-label">{cat.label}</span>
              <strong className="cat-score">{cat.score} / {cat.max}</strong>
            </div>
          ))}
        </div>

        <EditorialShareCard
          gameDate={todaysFive.gameDate}
          deokryeokResult={finalResult}
        />
      </div>
    );
  }

  return (
    <div className="todays-five-runner">
      <div className="todays-five-nav">
        <div className="t5-step-bar">
          {todaysFive.items.map((item, idx) => {
            const active = idx === currentIndex;
            const done = idx < currentIndex;
            return (
              <div
                key={idx}
                className={`t5-step ${active ? "active" : ""} ${done ? "done" : ""}`}
              >
                <span>0{idx + 1}</span>
                <small>{puzzleTypeLabel(item.type, locale)}</small>
              </div>
            );
          })}
        </div>
      </div>

      <div className="t5-active-game">
        {currentItem.type === "scene" && (
          <SceneGameView
            payload={currentItem.payload}
            dramas={dramas}
            onSolve={(attempts) => handleGameComplete("scene", attempts)}
            onFail={() => handleGameFail("scene")}
          />
        )}
        {currentItem.type === "song" && (
          <SongGameView
            payload={currentItem.payload}
            onSolve={(attempts) => handleGameComplete("song", attempts)}
            onFail={() => handleGameFail("song")}
          />
        )}
        {currentItem.type === "chosung" && (
          <ChosungGameView
            payload={currentItem.payload}
            onSolve={(attempts) => handleGameComplete("chosung", attempts)}
            onFail={() => handleGameFail("chosung")}
          />
        )}
        {currentItem.type === "connections" && (
          <ConnectionsGameView
            payload={currentItem.payload}
            onSolve={(attempts) => handleGameComplete("connections", attempts)}
            onFail={() => handleGameFail("connections")}
          />
        )}
        {currentItem.type === "people" && (
          <PeopleGameView
            payload={currentItem.payload}
            onSolve={(attempts) => handleGameComplete("people", attempts)}
            onFail={() => handleGameFail("people")}
          />
        )}
      </div>
    </div>
  );
}
