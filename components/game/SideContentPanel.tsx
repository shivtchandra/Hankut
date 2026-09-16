"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { IconFlame, IconChevronRight } from "@/components/icons/Icons";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { getStreak } from "@/lib/game/streak";
import type { Drama } from "@/types/game";

type Props = {
  dramas: Drama[];
};

export function SideContentPanel({ dramas }: Props) {
  const { locale } = useLocale();
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    setStreak(getStreak());
  }, []);

  const featuredDramas = dramas.slice(0, 4);

  return (
    <aside className="desktop-side-panel">
      {/* Widget 1: Player Stats & Daily Streak */}
      <div className="side-widget stats-widget">
        <div className="widget-header">
          <span className="widget-tag">
            {locale === "ko" ? "나의 진행 상황" : "YOUR PROGRESS"}
          </span>
          <h3>{locale === "ko" ? "일일 상태" : "Daily Status"}</h3>
        </div>
        <div className="side-stats-grid">
          <div className="side-stat-card highlight">
            <div className="stat-label">
              <IconFlame size={14} style={{ color: "#DC2626" }} />{" "}
              {locale === "ko" ? "연속 정답" : "Streak"}
            </div>
            <div className="stat-value">
              {streak}{" "}
              <span className="stat-unit">{locale === "ko" ? "일" : "days"}</span>
            </div>
          </div>
          <div className="side-stat-card">
            <div className="stat-label">
              {locale === "ko" ? "최대 점수" : "Max Score"}
            </div>
            <div className="stat-value">
              25 <span className="stat-unit">{locale === "ko" ? "점" : "pts"}</span>
            </div>
          </div>
        </div>
        <p className="side-widget-tip">
          {locale === "ko"
            ? "💡 1번째 시도에 맞히면 최대 25점을 획득합니다!"
            : "💡 Solve today's cut on 1st try for maximum 25 points!"}
        </p>
      </div>

      {/* Widget 2: Featured Dramas */}
      <div className="side-widget dramas-side-card">
        <div className="widget-header">
          <span className="widget-tag">
            {locale === "ko" ? "인기 드라마 아카이브" : "FEATURED ARCHIVE"}
          </span>
          <h3>{locale === "ko" ? "주요 K-드라마" : "Popular K-Dramas"}</h3>
        </div>
        <div className="mini-dramas-list">
          {featuredDramas.map((drama) => {
            const primary = locale === "ko" ? drama.titleKr : drama.titleEn;
            const secondary = locale === "ko" ? drama.titleEn : drama.titleKr;
            return (
              <Link
                key={drama.id}
                href={`/dramas/${drama.id}`}
                className="mini-drama-item"
              >
                <div className="mini-drama-info">
                  <strong>{primary}</strong>
                  <span>
                    {secondary} · {drama.year}
                  </span>
                </div>
                <IconChevronRight size={14} className="mini-arrow" />
              </Link>
            );
          })}
        </div>
        <Link href="/dramas" className="side-widget-link">
          {locale === "ko" ? "전체 드라마 둘러보기" : "Browse All Dramas"}{" "}
          <IconChevronRight size={14} />
        </Link>
      </div>
    </aside>
  );
}
