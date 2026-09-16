"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { IconFlame, IconChevronRight } from "@/components/icons/Icons";
import { getStreak } from "@/lib/game/streak";
import type { Drama } from "@/types/game";

type Props = {
  dramas: Drama[];
};

export function SideContentPanel({ dramas }: Props) {
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
          <span className="widget-tag">YOUR PROGRESS</span>
          <h3>Daily Status</h3>
        </div>
        <div className="side-stats-grid">
          <div className="side-stat-card highlight">
            <div className="stat-label">
              <IconFlame size={14} style={{ color: "#DC2626" }} /> Streak
            </div>
            <div className="stat-value">{streak} <span className="stat-unit">days</span></div>
          </div>
          <div className="side-stat-card">
            <div className="stat-label">Max Score</div>
            <div className="stat-value">25 <span className="stat-unit">pts</span></div>
          </div>
        </div>
        <p className="side-widget-tip">
          💡 Solve today&apos;s cut on 1st try for maximum 25 points!
        </p>
      </div>

      {/* Widget 2: Featured Dramas */}
      <div className="side-widget dramas-side-card">
        <div className="widget-header">
          <span className="widget-tag">FEATURED ARCHIVE</span>
          <h3>Popular K-Dramas</h3>
        </div>
        <div className="mini-dramas-list">
          {featuredDramas.map((drama) => (
            <Link
              key={drama.id}
              href={`/dramas/${drama.id}`}
              className="mini-drama-item"
            >
              <div className="mini-drama-info">
                <strong>{drama.titleEn}</strong>
                <span>{drama.titleKr} · {drama.year}</span>
              </div>
              <IconChevronRight size={14} className="mini-arrow" />
            </Link>
          ))}
        </div>
        <Link href="/dramas" className="side-widget-link">
          Browse All Dramas <IconChevronRight size={14} />
        </Link>
      </div>
    </aside>
  );
}
