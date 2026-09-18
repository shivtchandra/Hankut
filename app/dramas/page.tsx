"use client";

import Link from "next/link";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { SiteNav } from "@/components/layout/SiteNav";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { DRAMA_CATALOG } from "@/lib/drama-catalog";

export default function DramasDirectoryPage() {
  const { locale, t } = useLocale();

  return (
    <main className="dramas-directory-page">
      <SiteNav />

      <section className="directory-content">
        <div className="directory-header">
          <span className="eyebrow">{locale === "ko" ? "드라마 아카이브" : "Drama Archive"}</span>
          <h1>{t("dramasTitle")}</h1>
          <p className="dir-sub">{t("dramasSubtitle")}</p>
        </div>

        <div className="dramas-grid">
          {DRAMA_CATALOG.map((drama) => {
            const primaryTitle = locale === "en" ? drama.titleEn : drama.titleKr;
            const secondaryTitle = locale === "en" ? drama.titleKr : drama.titleEn;
            const desc = locale === "en" ? drama.descriptionEn : drama.descriptionKr;
            const genres = locale === "en" ? drama.genresEn : drama.genresKr;
            return (
              <Link key={drama.id} href={`/dramas/${drama.id}`} className="drama-entity-card">
                <div className="drama-poster">
                  <span className="drama-poster-placeholder">{drama.emoji}</span>
                  <div className="drama-poster-overlay" />
                  <span className="drama-poster-badge">{drama.network}</span>
                </div>
                <div className="drama-card-body">
                  <span className="drama-year">{drama.year} · {drama.network}</span>
                  <h2>{primaryTitle}</h2>
                  <p style={{ fontSize: "13px", color: "var(--muted)", marginTop: "-4px", marginBottom: "8px" }}>
                    {secondaryTitle}
                  </p>
                  <p style={{ fontSize: "12px", color: "var(--muted)", lineHeight: 1.45, marginBottom: "12px" }}>
                    {desc}
                  </p>
                  <div className="genres-list">
                    {genres.map((g) => (
                      <span key={g} className="genre-pill">{g}</span>
                    ))}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
