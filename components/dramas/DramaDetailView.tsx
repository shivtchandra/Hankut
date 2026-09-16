"use client";

import Link from "next/link";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { SiteNav } from "@/components/layout/SiteNav";
import { SiteFooter } from "@/components/layout/SiteFooter";
import {
  IconConnections,
  IconHangul,
  IconMusic,
  IconPeople,
  IconPlace,
  IconScene,
} from "@/components/icons/Icons";

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

          <div className="entity-relations-section">
            <h3>{t("relatedEntities")}</h3>
            <ul className="relations-list">
              <li>
                <IconPeople size={16} />
                <span>
                  <strong>{t("leadCast")}:</strong>{" "}
                  {locale === "en"
                    ? "IU (Lee Ji-eun), Park Bo-gum"
                    : "아이유 (이지은), 박보검"}
                </span>
              </li>
              <li>
                <IconPlace size={16} />
                <span>
                  <strong>{t("filmingLocation")}:</strong>{" "}
                  {locale === "en"
                    ? "Seogwipo, Jeju Island"
                    : "제주도 서귀포시"}
                </span>
              </li>
              <li>
                <IconMusic size={16} />
                <span>
                  <strong>{t("featuredOst")}:</strong>{" "}
                  {locale === "en"
                    ? "Taeyeon - All About You"
                    : "태연 - 그대라는 시"}
                </span>
              </li>
              <li>
                <IconConnections size={16} />
                <span>
                  <strong>{t("keywords")}:</strong> #Jeju #SliceOfLife
                  #NetflixOriginal
                </span>
              </li>
            </ul>
          </div>

          <div className="related-puzzles-section">
            <h3>{t("relatedPuzzles")}</h3>
            <div className="related-puzzles-grid">
              <div className="rel-puzzle-chip">
                <IconScene size={16} />
                <div>
                  <span>{t("typeScene")}</span>
                  <strong>
                    {locale === "en"
                      ? "Today's Cut #247 (Episode 3 Iconic Cut)"
                      : "오늘의 장면 #247 (3회 명장면)"}
                  </strong>
                </div>
              </div>
              <div className="rel-puzzle-chip">
                <IconHangul size={16} />
                <div>
                  <span>{t("typeChosung")}</span>
                  <strong>
                    {locale === "en"
                      ? "Chosung Guess #245 (ㅍㅆ ㅅㅇㅅㄷ)"
                      : "초성 맞히기 #245 (ㅍㅆ ㅅㅇㅅㄷ)"}
                  </strong>
                </div>
              </div>
            </div>
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
