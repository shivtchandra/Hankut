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

export function GamePage({ game, todaysFive, dramas, source, dateLabel, todayDate }: Props) {
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

  const pageTitle = useMemo(() => {
    if (todaysFive && todaysFive.items.length > 1) {
      return locale === "ko" ? "오늘의 5컷" : "Today's 5";
    }
    if (todaysFive && todaysFive.items.length === 1) {
      const type = todaysFive.items[0].type;
      if (type === "song") return locale === "ko" ? "데일리 오디오 컷" : "Daily Audio Cut";
      if (type === "chosung") return locale === "ko" ? "데일리 초성 컷" : "Daily Chosung Cut";
      if (type === "people") return locale === "ko" ? "데일리 인물 컷" : "Daily Face Cut";
      if (type === "connections") return locale === "ko" ? "데일리 커넥션" : "Daily Connections";
      return locale === "ko" ? "데일리 장면 컷" : "Daily Scene Cut";
    }
    return t("dailyGameTitle");
  }, [todaysFive, locale, t]);

  const pageSubtitle = useMemo(() => {
    if (todaysFive && todaysFive.items.length > 1) {
      return locale === "ko"
        ? "매일 새롭게 열리는 5가지 K-컬처 퍼즐에 도전하세요."
        : "5 daily K-culture puzzles. Solve earlier for more points.";
    }
    if (todaysFive && todaysFive.items.length === 1) {
      const type = todaysFive.items[0].type;
      if (type === "song") {
        return locale === "ko"
          ? "5개 구간으로 듣는 OST. 드라마 제목을 맞혀보세요."
          : "5 audio clips from one song. Guess the drama — solve earlier for more points.";
      }
      if (type === "chosung") {
        return locale === "ko"
          ? "초성 힌트를 보고 정답을 맞혀보세요."
          : "Guess the drama title from Korean initial consonants.";
      }
      if (type === "people") {
        return locale === "ko"
          ? "5단계로 밝혀지는 인물. 누구인지 맞혀보세요."
          : "5 reveal steps. Guess the actor or character.";
      }
      if (type === "connections") {
        return locale === "ko"
          ? "연관된 단어 4개씩 그룹을 완성하세요."
          : "Find groups of four related items.";
      }
    }
    return t("dailyGameSubtitle");
  }, [todaysFive, locale, t]);

  return (
    <main className="game-page">
      <SiteNav />

      <section className="play-stage">
        <div className="game-stage-container">
          <div className="daily-game-header">
            <div className="daily-title-block">
              <div className="daily-title-row">
                <h1 className="daily-game-title">{pageTitle}</h1>
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
              <p className="daily-game-subtitle">{pageSubtitle}</p>
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
          ) : game && source !== "demo" ? (
            <GameClient game={game} dramas={dramas} todayDate={todayDate} />
          ) : (
            <div style={{ minHeight: "40vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, padding: "48px 24px", textAlign: "center" }}>
              <p style={{ fontSize: 13, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--muted)", fontFamily: "var(--font-mono, monospace)" }}>
                {displayDate}
              </p>
              <h2 style={{ fontSize: "clamp(1.2rem, 3vw, 1.6rem)", fontWeight: 700, margin: 0 }}>
                {displayDate === todayDate
                  ? locale === "ko" ? "오늘의 퍼즐이 아직 올라오지 않았어요" : "Today's puzzle isn't up yet"
                  : locale === "ko" ? "이 날짜의 퍼즐이 없어요" : "No puzzle for this date"}
              </h2>
              <p style={{ fontSize: 14, color: "var(--muted)", maxWidth: 300, margin: 0 }}>
                {displayDate === todayDate
                  ? locale === "ko" ? "곧 업로드될 예정이에요. 그동안 지난 퍼즐을 풀어보세요." : "Check back soon. Meanwhile, catch up on past puzzles."
                  : locale === "ko" ? "아직 업로드되지 않은 날짜예요." : "Nothing was uploaded for this day."}
              </p>
              <Link href="/archive" className="lb-identity-btn primary" style={{ marginTop: 8, textDecoration: "none" }}>
                {locale === "ko" ? "아카이브 보기" : "Browse archive"}
              </Link>
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
