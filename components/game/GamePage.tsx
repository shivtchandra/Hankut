"use client";

import { useState } from "react";
import { GameClient } from "@/components/game/GameClient";
import { TodaysFiveView } from "@/components/game/TodaysFiveView";
import { SiteNav } from "@/components/layout/SiteNav";
import { SiteFooter } from "@/components/layout/SiteFooter";

import type { Drama, TodayGame, TodaysFiveGame } from "@/types/game";

type Props = {
  game: TodayGame;
  dramas: Drama[];
  source: "supabase" | "demo";
  dateLabel: string;
  todaysFive?: TodaysFiveGame;
};

export function GamePage({ game, dramas, source, dateLabel, todaysFive }: Props) {
  const [activeTab, setActiveTab] = useState<"scene" | "todaysFive">("scene");

  return (
    <main className="game-page">
      <SiteNav />

      <section className="play-stage">
        <div className="game-intro">
          <div className="daily-meta-line">
            <span className="daily-date">{dateLabel}</span>
            <div className="mode-switch">
              <button
                type="button"
                className={`mode-switch-btn ${activeTab === "scene" ? "active" : ""}`}
                onClick={() => setActiveTab("scene")}
              >
                Today&apos;s Scene
              </button>
              <span className="mode-switch-sep">·</span>
              <button
                type="button"
                className={`mode-switch-btn ${activeTab === "todaysFive" ? "active" : ""}`}
                onClick={() => setActiveTab("todaysFive")}
              >
                Today&apos;s 5
              </button>
            </div>
          </div>

          {activeTab === "scene" && (
            <>
              <h1 className="game-headline-kr">This scene—<br />where&apos;s it from?</h1>
              <p className="game-headline-sub">One cut. Guess the K-drama.</p>
            </>
          )}
        </div>

        {activeTab === "scene" ? (
          <GameClient game={game} dramas={dramas} />
        ) : (
          (todaysFive ?? game.todaysFive) && (
            <TodaysFiveView todaysFive={(todaysFive ?? game.todaysFive)!} dramas={dramas} />
          )
        )}
      </section>

      <SiteFooter />
    </main>
  );
}
