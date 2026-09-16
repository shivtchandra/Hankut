"use client";

import Link from "next/link";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { SiteNav } from "@/components/layout/SiteNav";
import { SiteFooter } from "@/components/layout/SiteFooter";

const DRAMAS = [
  {
    id: "tangerines",
    titleKr: "폭싹 속았수다",
    titleEn: "When Life Gives You Tangerines",
    year: 2025,
    network: "Netflix",
    genresEn: ["Drama", "Romance", "Family"],
    genresKr: ["드라마", "로맨스", "가족"],
    emoji: "🍊",
    puzzleCount: 3,
    descriptionKr: "제주를 배경으로 한 70년 이야기. 아이유, 박보검 주연.",
    descriptionEn: "A 70-year tale set in Jeju. Starring IU & Park Bo-gum.",
  },
  {
    id: "my-liberation-notes",
    titleKr: "나의 해방일지",
    titleEn: "My Liberation Notes",
    year: 2022,
    network: "JTBC",
    genresEn: ["Drama", "Slice of Life"],
    genresKr: ["드라마", "일상"],
    emoji: "🌾",
    puzzleCount: 5,
    descriptionKr: "경기도 산포에서 서울로 출퇴근하는 세 남매의 일상과 해방.",
    descriptionEn: "Three siblings seek liberation from mundane daily commutes.",
  },
  {
    id: "our-blues",
    titleKr: "우리들의 블루스",
    titleEn: "Our Blues",
    year: 2022,
    network: "tvN",
    genresEn: ["Drama", "Human"],
    genresKr: ["드라마", "휴먼"],
    emoji: "🌊",
    puzzleCount: 4,
    descriptionKr: "제주 바다를 배경으로 한 열여섯 명의 옴니버스 이야기.",
    descriptionEn: "Omnibus stories of 16 sweet and bitter lives in Jeju.",
  },
  {
    id: "moving",
    titleKr: "무빙",
    titleEn: "Moving",
    year: 2023,
    network: "Disney+",
    genresEn: ["Action", "Fantasy", "Drama"],
    genresKr: ["액션", "판타지", "드라마"],
    emoji: "⚡",
    puzzleCount: 6,
    descriptionKr: "초능력을 가진 아이들과 그들의 부모 세대의 판타지 액션.",
    descriptionEn: "Children with hidden superpowers & their protective parents.",
  },
  {
    id: "hotel-del-luna",
    titleKr: "호텔 델루나",
    titleEn: "Hotel del Luna",
    year: 2019,
    network: "tvN",
    genresEn: ["Fantasy", "Romance"],
    genresKr: ["판타지", "로맨스"],
    emoji: "🌙",
    puzzleCount: 7,
    descriptionKr: "떠돌이 영혼들을 치료하는 신비로운 호텔 사장의 이야기.",
    descriptionEn: "A mysterious hotel serving souls of the dead in Seoul.",
  },
  {
    id: "crash-landing",
    titleKr: "사랑의 불시착",
    titleEn: "Crash Landing on You",
    year: 2019,
    network: "tvN",
    genresEn: ["Romance", "Drama"],
    genresKr: ["로맨스", "드라마"],
    emoji: "🪂",
    puzzleCount: 8,
    descriptionKr: "북한에 불시착한 재벌 상속녀와 북한 장교의 로맨스.",
    descriptionEn: "A South Korean heiress accidentally paraglides into North Korea.",
  },
  {
    id: "extraordinary-attorney-woo",
    titleKr: "이상한 변호사 우영우",
    titleEn: "Extraordinary Attorney Woo",
    year: 2022,
    network: "ENA",
    genresEn: ["Legal", "Drama"],
    genresKr: ["법정", "드라마"],
    emoji: "🐋",
    puzzleCount: 5,
    descriptionKr: "자폐 스펙트럼 장애를 가진 천재 신입 변호사의 성장기.",
    descriptionEn: "A brilliant attorney on the autism spectrum tackles legal cases.",
  },
  {
    id: "goblin",
    titleKr: "도깨비",
    titleEn: "Guardian: The Lonely and Great God",
    year: 2016,
    network: "tvN",
    genresEn: ["Fantasy", "Romance"],
    genresKr: ["판타지", "로맨스"],
    emoji: "🕯️",
    puzzleCount: 9,
    descriptionKr: "불멸의 삶을 끝내려는 도깨비와 그 신부의 운명적 이야기.",
    descriptionEn: "An immortal goblin searches for his human bride to end his curse.",
  },
  {
    id: "reply-1988",
    titleKr: "응답하라 1988",
    titleEn: "Reply 1988",
    year: 2015,
    network: "tvN",
    genresEn: ["Drama", "Comedy"],
    genresKr: ["드라마", "코미디"],
    emoji: "📻",
    puzzleCount: 6,
    descriptionKr: "1988년 쌍문동 골목 다섯 가족과 친구들의 따뜻한 청춘.",
    descriptionEn: "Five childhood friends & their families living in 1988 Seoul.",
  },
  {
    id: "alchemy-of-souls",
    titleKr: "환혼",
    titleEn: "Alchemy of Souls",
    year: 2022,
    network: "tvN",
    genresEn: ["Fantasy", "Martial Arts"],
    genresKr: ["판타지", "무협"],
    emoji: "🌀",
    puzzleCount: 4,
    descriptionKr: "영혼이 뒤바뀐 두 남녀의 이야기를 그린 판타지 무협.",
    descriptionEn: "A powerful sorceress trapped in a blind woman's body meets a noble master.",
  },
];

export default function DramasDirectoryPage() {
  const { locale, t } = useLocale();

  return (
    <main className="dramas-directory-page">
      <SiteNav />

      <section className="directory-content">
        <div className="directory-header">
          <span className="eyebrow">{locale === "ko" ? "엔티티 아카이브" : "Entity Archive"}</span>
          <h1>{t("dramasTitle")}</h1>
          <p className="dir-sub">{t("dramasSubtitle")}</p>
        </div>

        <div className="dramas-grid">
          {DRAMAS.map((drama) => {
            const primaryTitle = locale === "en" ? drama.titleEn : drama.titleKr;
            const secondaryTitle = locale === "en" ? drama.titleKr : drama.titleEn;
            const desc = locale === "en" ? drama.descriptionEn : drama.descriptionKr;
            const genres = locale === "en" ? drama.genresEn : drama.genresKr;
            const badgeCountText = `${drama.puzzleCount} ${t("puzzlesCount")}`;

            return (
              <Link key={drama.id} href={`/dramas/${drama.id}`} className="drama-entity-card">
                <div className="drama-poster">
                  <span className="drama-poster-placeholder">{drama.emoji}</span>
                  <div className="drama-poster-overlay" />
                  <span className="drama-poster-badge">
                    {badgeCountText} · {drama.network}
                  </span>
                </div>
                <div className="drama-card-body">
                  <span className="drama-year">
                    {drama.year} · {drama.network}
                  </span>
                  <h2>{primaryTitle}</h2>
                  <p style={{ fontSize: "13px", color: "var(--muted)", marginTop: "-4px", marginBottom: "8px" }}>
                    {secondaryTitle}
                  </p>
                  <p style={{ fontSize: "12px", color: "var(--muted)", lineHeight: 1.45, marginBottom: "12px" }}>
                    {desc}
                  </p>
                  <div className="genres-list">
                    {genres.map((g) => (
                      <span key={g} className="genre-pill">
                        {g}
                      </span>
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
