"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { GameClient } from "@/components/game/GameClient";
import { HowItWorksModal } from "@/components/game/HowItWorksModal";
import { SiteNav } from "@/components/layout/SiteNav";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { IconChevronLeft, IconChevronRight, IconInfo } from "@/components/icons/Icons";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { shiftGameDate } from "@/lib/game/dates";

import type { Drama, TodayGame } from "@/types/game";

type Props = {
  game: TodayGame;
  dramas: Drama[];
  source: "supabase" | "demo";
  dateLabel: string;
  /** Newest released puzzle date, resolved on the server for the viewer's day. */
  todayDate: string;
};

export function GamePage({ game, dramas, dateLabel, todayDate }: Props) {
  const { locale, t } = useLocale();
  const [showHowItWorks, setShowHowItWorks] = useState(false);

  const currentDate = useMemo(
    () => new Date(`${game.gameDate}T12:00:00+09:00`),
    [game.gameDate]
  );

  const prevDate = useMemo(
    () => shiftGameDate(game.gameDate, -1),
    [game.gameDate],
  );

  const nextDate = useMemo(
    () => shiftGameDate(game.gameDate, 1),
    [game.gameDate],
  );

  const isToday = game.gameDate >= todayDate;
  const canGoNext = nextDate <= todayDate;

  const formattedDate = useMemo(() => {
    try {
      if (locale === "ko") {
        return new Intl.DateTimeFormat("ko-KR", {
          year: "numeric",
          month: "long",
          day: "numeric",
          weekday: "short",
          timeZone: "Asia/Seoul",
        }).format(currentDate);
      }
      return new Intl.DateTimeFormat("en-GB", {
        weekday: "short",
        day: "2-digit",
        month: "short",
        year: "numeric",
        timeZone: "Asia/Seoul",
      }).format(currentDate).toUpperCase();
    } catch {
      return dateLabel || game.gameDate;
    }
  }, [currentDate, locale, dateLabel, game.gameDate]);

  const featuredDramas = useMemo(() => dramas.slice(0, 4), [dramas]);

  return (
    <main className="game-page">
      <SiteNav />

      <section className="play-stage">
        <div className="game-stage-container">
          {/* Concise, Clean Game Header */}
          <div className="daily-game-header">
            <div className="daily-title-block">
              <div className="daily-title-row">
                <h1 className="daily-game-title">{t("dailyGameTitle")}</h1>
                <button
                  type="button"
                  className="how-it-works-btn"
                  onClick={() => setShowHowItWorks(true)}
                  title={t("howItWorksBtn")}
                  aria-label={t("howItWorksBtn")}
                >
                  <IconInfo size={14} />
                  <span>{t("howItWorksBtn")}</span>
                </button>
              </div>
              <p className="daily-game-subtitle">{t("dailyGameSubtitle")}</p>
            </div>

            {/* Simple, Elegant Date Changer */}
            <div className="date-nav-group">
              <Link
                href={`/?date=${prevDate}`}
                className="date-arrow-btn"
                title={t("prevDay")}
                aria-label={t("prevDay")}
              >
                <IconChevronLeft size={16} />
              </Link>

              <div className="date-display">
                <span className="date-text">{formattedDate}</span>
                {isToday ? (
                  <span className="date-tag-today">TODAY</span>
                ) : (
                  <Link href="/" className="date-tag-back" title={t("returnToday")}>
                    {t("returnToday")}
                  </Link>
                )}
              </div>

              {canGoNext ? (
                <Link
                  href={nextDate >= todayDate ? "/" : `/?date=${nextDate}`}
                  className="date-arrow-btn"
                  title={t("nextDay")}
                  aria-label={t("nextDay")}
                >
                  <IconChevronRight size={16} />
                </Link>
              ) : (
                <span
                  className="date-arrow-btn disabled"
                  aria-disabled="true"
                  title={t("noFuturePuzzle")}
                  aria-label={t("noFuturePuzzle")}
                >
                  <IconChevronRight size={16} />
                </span>
              )}
            </div>
          </div>

          {/* Main Focused Game View */}
          <GameClient game={game} dramas={dramas} todayDate={todayDate} />
        </div>

        {/* Discovery Strip Below Game Fold */}
        <div className="discovery-strip-wrapper">
          <div className="discovery-header">
            <div>
              <h2 className="discovery-title">{t("exploreTitle")}</h2>
              <p className="discovery-subtitle">{t("exploreSub")}</p>
            </div>
            <Link href="/dramas" className="discovery-browse-link">
              {locale === "ko" ? "전체 보기" : "Browse all"} <IconChevronRight size={14} />
            </Link>
          </div>

          <div className="discovery-cards-grid">
            {featuredDramas.map((drama) => {
              const primary = locale === "ko" ? drama.titleKr : drama.titleEn;
              const secondary = locale === "ko" ? drama.titleEn : drama.titleKr;
              return (
                <Link
                  key={drama.id}
                  href={`/dramas/${drama.id}`}
                  className="discovery-card"
                >
                  <div className="discovery-card-top">
                    <span className="discovery-year">{drama.year}</span>
                    {drama.genres?.[0] && (
                      <span className="discovery-genre">{drama.genres[0]}</span>
                    )}
                  </div>
                  <strong className="discovery-primary">{primary}</strong>
                  <span className="discovery-secondary">{secondary}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <HowItWorksModal
        isOpen={showHowItWorks}
        onClose={() => setShowHowItWorks(false)}
      />

      <SiteFooter />
    </main>
  );
}
