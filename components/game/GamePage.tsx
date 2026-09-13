"use client";

import { useState } from "react";
import { GameClient } from "@/components/game/GameClient";
import { TodaysFiveView } from "@/components/game/TodaysFiveView";
import { useLocale } from "@/components/i18n/LocaleProvider";
import type { Drama, TodayGame } from "@/types/game";

type Props = {
  game: TodayGame;
  dramas: Drama[];
  source: "supabase" | "demo";
  dateLabel: string;
};

export function GamePage({ game, dramas, source, dateLabel }: Props) {
  const { locale, setLocale, t } = useLocale();
  const [activeTab, setActiveTab] = useState<"scene" | "todaysFive">("scene");

  return (
    <main className="game-page">
      <header className="topbar">
        <a href="/" className="brand">
          <span className="brand-mark">{t("brandMark")}</span>
          <span className="brand-name">{t("brandName")}</span>
        </a>

        <div className="topbar-right">
          <div className="lang-toggle" role="group" aria-label="Language">
            <button
              type="button"
              className={locale === "en" ? "active" : ""}
              onClick={() => setLocale("en")}
            >
              EN
            </button>
            <button
              type="button"
              className={locale === "ko" ? "active" : ""}
              onClick={() => setLocale("ko")}
            >
              한
            </button>
          </div>

          <nav className="topnav">
            <a href="/dramas">{t("navDramas")}</a>
            <a href="/archive">{t("navArchive")}</a>
            <a href="/leaderboard">{t("navLeaderboard")}</a>
            <a href="/profile">{t("navProfile")}</a>
          </nav>
        </div>
      </header>

      <section className="play-stage">
        <div className="hero-meta">
          <div className="hero-mode-tabs">
            <button
              type="button"
              className={`mode-tab ${activeTab === "scene" ? "active" : ""}`}
              onClick={() => setActiveTab("scene")}
            >
              🎬 {t("todayScene")}
            </button>
            <button
              type="button"
              className={`mode-tab ${activeTab === "todaysFive" ? "active" : ""}`}
              onClick={() => setActiveTab("todaysFive")}
            >
              🔥 {t("todaysFive")}
            </button>
          </div>
          <span className="date-chip">{dateLabel}</span>
        </div>

        <p className="play-tagline">
          {activeTab === "scene" ? t("taglineScene") : t("taglineFive")}
        </p>

        {process.env.NODE_ENV === "development" && source === "demo" ? (
          <p className="dev-source">source: demo</p>
        ) : null}

        {activeTab === "scene" ? (
          <GameClient game={game} dramas={dramas} />
        ) : (
          game.todaysFive && (
            <TodaysFiveView todaysFive={game.todaysFive} dramas={dramas} />
          )
        )}
      </section>

      <footer className="site-footer">
        <span>{t("everyDay")}</span>
        <span>{t("brandName")} · {t("footerLine")}</span>
      </footer>
    </main>
  );
}
