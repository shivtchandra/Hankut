"use client";

import Link from "next/link";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { SiteNav } from "@/components/layout/SiteNav";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { IconCalendar, IconChevronRight } from "@/components/icons/Icons";

export default function ArchivePage() {
  const { t } = useLocale();

  // As today is Day 1 of Dramacut, the past puzzle archive is currently empty
  const puzzles: Array<{
    id: string;
    date: string;
    titleEn: string;
    titleKr: string;
    difficulty?: number;
    solveRate?: string;
  }> = [];

  return (
    <main className="archive-page">
      <SiteNav />

      <section className="archive-content">
        <div className="archive-header-meta">
          <span className="eyebrow">{t("archiveEyebrow")}</span>
          <h1>{t("archiveTitle")}</h1>
          <p>{t("archiveCopy")}</p>
        </div>

        {puzzles.length === 0 ? (
          <div className="archive-empty-state">
            <div className="archive-empty-icon-wrap">
              <IconCalendar size={36} />
            </div>
            <h2 className="archive-empty-title">{t("archiveEmptyTitle")}</h2>
            <p className="archive-empty-desc">{t("archiveEmptyDesc")}</p>
            <Link href="/" className="archive-empty-action">
              {t("playTodayScene")}
            </Link>
          </div>
        ) : (
          <div className="archive-grid">
            {puzzles.map((item) => (
              <div key={item.id} className="archive-card">
                <div className="archive-card-header">
                  <span className="archive-category">{t("typeScene")}</span>
                  <span className="archive-date">{item.date}</span>
                </div>
                <h3 className="archive-title">{item.titleEn}</h3>
                <div className="archive-card-footer">
                  <Link href={`/?date=${item.date}`} className="play-link">
                    {t("playAgain")}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <SiteFooter />
    </main>
  );
}
