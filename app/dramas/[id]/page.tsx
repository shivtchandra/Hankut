import { use } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { DEMO_DRAMAS } from "@/lib/demo-data";
import { DramaSeriesJsonLd } from "@/components/seo/JsonLd";
import {
  IconConnections,
  IconHangul,
  IconMusic,
  IconPeople,
  IconPlace,
  IconScene,
} from "@/components/icons/Icons";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const drama = DEMO_DRAMAS.find((d) => d.id === id) || DEMO_DRAMAS[0];

  const title = `${drama.titleEn} (${drama.titleKr}) — K-Drama Details & Puzzles`;
  const description = `Explore K-drama scene cuts, OSTs, cast info, and daily trivia for ${drama.titleEn} (${drama.titleKr}, ${drama.year}). Test your knowledge on Dramacut!`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "video.tv_show",
      images: [
        {
          url: `/api/og?title=${encodeURIComponent(
            drama.titleEn
          )}&drama=${encodeURIComponent(drama.titleKr)}&date=${drama.year}`,
          width: 1200,
          height: 630,
          alt: `${drama.titleEn} on Dramacut`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [
        `/api/og?title=${encodeURIComponent(
          drama.titleEn
        )}&drama=${encodeURIComponent(drama.titleKr)}&date=${drama.year}`,
      ],
    },
  };
}

export default function DramaDetailPage({ params }: Props) {
  const { id } = use(params);
  const drama = DEMO_DRAMAS.find((d) => d.id === id) || DEMO_DRAMAS[0];

  return (
    <main className="drama-detail-page">
      <DramaSeriesJsonLd
        titleEn={drama.titleEn}
        titleKr={drama.titleKr}
        year={drama.year}
        network={drama.network}
        slug={drama.id}
      />

      <header className="topbar">
        <a href="/dramas" className="brand">
          <span className="brand-mark">←</span>
          <span className="brand-name">Back to Dramas · 드라마 목록으로 돌아가기</span>
        </a>
      </header>

      <section className="drama-detail-hero">
        <div className="drama-hero-info">
          <span className="eyebrow">
            {drama.year} · {drama.network}
          </span>
          <h1>{drama.titleKr}</h1>
          <p className="subtitle-en" style={{ fontSize: "20px", fontWeight: 600, color: "var(--ink)", marginBottom: "16px" }}>
            {drama.titleEn}
          </p>

          <div className="genres-list">
            {drama.genres.map((g) => (
              <span key={g} className="genre-pill">
                {g}
              </span>
            ))}
          </div>

          <div className="entity-relations-section">
            <h3>Related Entity Graph · 연관 엔티티 그래프</h3>
            <ul className="relations-list">
              <li>
                <IconPeople size={16} />
                <span>Cast / 출연진: IU (Lee Ji-eun), Park Bo-gum (아이유, 박보검)</span>
              </li>
              <li>
                <IconPlace size={16} />
                <span>Filming Location / 촬영지: Jeju Island (제주도 서귀포시)</span>
              </li>
              <li>
                <IconMusic size={16} />
                <span>Featured OST / 노래: Taeyeon - All About You (태연 - 그대라는 시)</span>
              </li>
              <li>
                <IconConnections size={16} />
                <span>Keywords / 키워드: #Jeju #SliceOfLife #NetflixOriginal</span>
              </li>
            </ul>
          </div>

          <div className="related-puzzles-section">
            <h3>Featured Puzzles · 관련 등장 퍼즐</h3>
            <div className="related-puzzles-grid">
              <div className="rel-puzzle-chip">
                <IconScene size={16} />
                <div>
                  <span>Scene Cut · 장면 퍼즐</span>
                  <strong>Today&apos;s Cut #247 (Episode 3 Iconic Cut)</strong>
                </div>
              </div>
              <div className="rel-puzzle-chip">
                <IconHangul size={16} />
                <div>
                  <span>Chosung · 초성 퍼즐</span>
                  <strong>Chosung Guess #245 (ㅍㅆ ㅅㅇㅅㄷ)</strong>
                </div>
              </div>
            </div>
          </div>

          <div className="action-row" style={{ marginTop: 28 }}>
            <Link href="/" className="primary-btn">
              Play Today&apos;s Game · 오늘의 게임에서 맞춰보기 →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
