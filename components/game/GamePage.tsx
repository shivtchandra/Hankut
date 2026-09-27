"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GameClient } from "@/components/game/GameClient";
import { TodaysFiveView } from "@/components/game/TodaysFiveView";
import { HowItWorksModal } from "@/components/game/HowItWorksModal";
import { SiteNav } from "@/components/layout/SiteNav";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { IconChevronLeft, IconChevronRight, IconInfo } from "@/components/icons/Icons";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { shiftGameDate } from "@/lib/game/dates";
import type { Drama, TodayGame, TodaysFiveGame } from "@/types/game";

type Props = {
  game?: TodayGame | null;
  todaysFive?: TodaysFiveGame;
  dramas: Drama[];
  source?: "supabase" | "demo";
  dateLabel: string;
  todayDate: string;
};

export function GamePage({ game, todaysFive, dramas, dateLabel, todayDate }: Props) {
  const { locale, t } = useLocale();
  const router = useRouter();
  const [showHowItWorks, setShowHowItWorks] = useState(false);

  const displayDate = todaysFive?.gameDate || game?.gameDate || todayDate;
  const prevDate = useMemo(() => shiftGameDate(displayDate, -1), [displayDate]);
  const nextDate = useMemo(() => shiftGameDate(displayDate, 1), [displayDate]);
  const isToday = displayDate >= todayDate;
  const canGoNext = !isToday && nextDate <= todayDate;
  const canGoPrev = displayDate > "2026-09-16";

  const currentDate = useMemo(
    () => new Date(`${displayDate}T12:00:00+09:00`),
    [displayDate],
  );

  const formattedDate = useMemo(() => {
    try {
      if (locale === "ko") {
        return new Intl.DateTimeFormat("ko-KR", {
          year: "numeric", month: "long", day: "numeric",
          weekday: "short", timeZone: "Asia/Seoul",
        }).format(currentDate);
      }
      return new Intl.DateTimeFormat("en-GB", {
        weekday: "short", day: "2-digit", month: "short",
        year: "numeric", timeZone: "Asia/Seoul",
      }).format(currentDate).toUpperCase();
    } catch {
      return dateLabel || displayDate;
    }
  }, [currentDate, locale, dateLabel, displayDate]);

  function navigateTo(targetDate: string) {
    const url = targetDate >= todayDate ? "/" : `/?date=${targetDate}`;
    router.push(url);
  }

  const featuredDramas = useMemo(() => (dramas || []).slice(0, 4), [dramas]);

  return (
    <main className="game-page">
      <SiteNav />

      <section className="play-stage">
        <div className="game-stage-container">
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

            <div className="date-nav-group">
              {canGoPrev ? (
                <button
                  type="button"
                  className="date-arrow-btn"
                  onClick={() => navigateTo(prevDate)}
                  title={t("prevDay")}
                  aria-label={t("prevDay")}
                >
                  <IconChevronLeft size={16} />
                </button>
              ) : (
                <span className="date-arrow-btn disabled" aria-disabled="true">
                  <IconChevronLeft size={16} />
                </span>
              )}

              <div className="date-display">
                <span className="date-text">
                  {formattedDate}
                </span>
                {isToday ? (
                  <span className="date-tag-today">TODAY</span>
                ) : (
                  <button
                    type="button"
                    className="date-tag-back"
                    onClick={() => navigateTo(todayDate)}
                    title={t("returnToday")}
                  >
                    {t("returnToday")}
                  </button>
                )}
              </div>

              {canGoNext ? (
                <button
                  type="button"
                  className="date-arrow-btn"
                  onClick={() => navigateTo(nextDate >= todayDate ? todayDate : nextDate)}
                  title={t("nextDay")}
                  aria-label={t("nextDay")}
                >
                  <IconChevronRight size={16} />
                </button>
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

          {todaysFive && todaysFive.items.length > 0 ? (
            <TodaysFiveView todaysFive={todaysFive} dramas={dramas} />
          ) : game ? (
            <GameClient game={game} dramas={dramas} todayDate={todayDate} />
          ) : (
            <div style={{ minHeight: "40vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, padding: "48px 24px", textAlign: "center" }}>
              <p style={{ fontSize: 13, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--muted)", fontFamily: "var(--font-mono, monospace)" }}>
                {displayDate}
              </p>
              <h2 style={{ fontSize: "clamp(1.2rem, 3vw, 1.6rem)", fontWeight: 700, margin: 0 }}>
                No puzzle for this date
              </h2>
              <p style={{ fontSize: 14, color: "var(--muted)", maxWidth: 300, margin: 0 }}>
                Puzzles start from when Dramacut launched.
              </p>
            </div>
          )}
        </div>

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
                <Link key={drama.id} href={`/dramas/${drama.id}`} className="discovery-card">
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

      <HowItWorksModal isOpen={showHowItWorks} onClose={() => setShowHowItWorks(false)} />
      <SiteFooter />
    </main>
  );
}
