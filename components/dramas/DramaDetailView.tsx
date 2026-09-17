"use client";

import Link from "next/link";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { SiteNav } from "@/components/layout/SiteNav";
import { SiteFooter } from "@/components/layout/SiteFooter";

type Drama = {
  id: string;
  titleKr: string;
  titleEn: string;
  year: number | null;
  network: string | null;
  genres: string[];
};

type Props = {
  drama: Drama;
};

export function DramaDetailView({ drama }: Props) {
  const { locale, t } = useLocale();

  const primaryTitle = locale === "en" ? drama.titleEn : drama.titleKr;
  const secondaryTitle = locale === "en" ? drama.titleKr : drama.titleEn;

  return (
    <main className="drama-detail-page">
      <SiteNav />

      <section className="drama-detail-hero">
        <div className="drama-hero-info">
          <div style={{ marginBottom: "16px" }}>
            <Link href="/dramas" className="brand-name" style={{ fontSize: "14px", color: "var(--muted)" }}>
              ← {t("backToDramas")}
            </Link>
          </div>

          <span className="eyebrow">
            {drama.year} · {drama.network}
          </span>
          <h1>{primaryTitle}</h1>
          <p
            className="subtitle-en"
            style={{
              fontSize: "18px",
              fontWeight: 600,
              color: "var(--muted)",
              marginBottom: "16px",
            }}
          >
            {secondaryTitle}
          </p>

          <div className="genres-list">
            {drama.genres.map((g) => (
              <span key={g} className="genre-pill">
                {g}
              </span>
            ))}
          </div>


          <div className="action-row" style={{ marginTop: 28 }}>
            <Link href="/" className="primary-btn">
              {t("playTodayBtn")}
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
