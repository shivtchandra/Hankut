"use client";

import Link from "next/link";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { SiteNav } from "@/components/layout/SiteNav";
import { SiteFooter } from "@/components/layout/SiteFooter";

export default function DramasDirectoryPage() {
  const { locale } = useLocale();
  const isKo = locale === "ko";

  return (
    <main className="dramas-directory-page">
      <SiteNav />

      <section className="directory-content">
        <div className="coming-soon-card">
          <div className="coming-soon-badge">
            <span className="badge-pulse" />
            <span className="badge-text">
              {isKo ? "🎬 촬영 및 편집 중 · IN PRODUCTION" : "🎬 IN PRODUCTION · COMING SOON"}
            </span>
          </div>

          <h1 className="coming-soon-title">
            {isKo
              ? "더 많은 드라마 컷을 열심히 준비하고 있어요"
              : "We're Curating the Next Iconic Cuts"}
          </h1>

          <p className="coming-soon-sub">
            {isKo
              ? "명대사, 숨겨진 복선, OST부터 인생 드라마 백과사전까지 — 더욱 풍성하고 몰입감 넘치는 K-드라마 도감으로 찾아올게요. 조금만 기다려주세요!"
              : "From iconic scene cuts and soundtrack trivia to hidden easter eggs — we're crafting a rich K-drama encyclopedia. The directory will premiere soon!"}
          </p>

          <div className="coming-soon-features">
            <div className="coming-soon-feature-item">
              <span className="feature-icon">🎞️</span>
              <div className="feature-text">
                <strong>{isKo ? "명장면 아카이브" : "Iconic Scene Vault"}</strong>
                <span>{isKo ? "드라마별 명장면 컷 모아보기" : "Browse cuts by drama"}</span>
              </div>
            </div>

            <div className="coming-soon-feature-item">
              <span className="feature-icon">🎧</span>
              <div className="feature-text">
                <strong>{isKo ? "OST & 클루 사전" : "OST & Clues"}</strong>
                <span>{isKo ? "명곡과 촬영지 비하인드" : "Soundtracks & filming lore"}</span>
              </div>
            </div>

            <div className="coming-soon-feature-item">
              <span className="feature-icon">🏆</span>
              <div className="feature-text">
                <strong>{isKo ? "덕력 챌린지" : "Fan Challenges"}</strong>
                <span>{isKo ? "장르별/배우별 맞춤 퀴즈" : "Themed actor & genre quizzes"}</span>
              </div>
            </div>
          </div>

          <div className="coming-soon-actions">
            <Link href="/" className="coming-soon-primary-btn">
              {isKo ? "오늘의 드라마 맞히러 가기 →" : "Play Today's Game →"}
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}

