import Link from "next/link";
import { SiteNav } from "@/components/layout/SiteNav";
import { SiteFooter } from "@/components/layout/SiteFooter";

const DRAMAS = [
  {
    id: "tangerines",
    titleKr: "폭싹 속았수다",
    titleEn: "When Life Gives You Tangerines",
    year: 2025,
    network: "Netflix",
    genres: ["드라마", "로맨스", "가족"],
    genresEn: ["Drama", "Romance", "Family"],
    emoji: "🍊",
    puzzleCount: 3,
    description: "제주를 배경으로 한 70년 이야기. 아이유, 박보검 주연.",
  },
  {
    id: "my-liberation-notes",
    titleKr: "나의 해방일지",
    titleEn: "My Liberation Notes",
    year: 2022,
    network: "JTBC",
    genres: ["드라마", "일상"],
    genresEn: ["Drama", "Slice of Life"],
    emoji: "🌾",
    puzzleCount: 5,
    description: "경기도 산포에서 서울로 출퇴근하는 세 남매의 일상과 해방을 향한 여정.",
  },
  {
    id: "our-blues",
    titleKr: "우리들의 블루스",
    titleEn: "Our Blues",
    year: 2022,
    network: "tvN",
    genres: ["드라마", "휴먼"],
    genresEn: ["Drama", "Human"],
    emoji: "🌊",
    puzzleCount: 4,
    description: "제주 바다를 배경으로 한 열여섯 명의 이야기 — 이병헌, 신민아, 차승원.",
  },
  {
    id: "moving",
    titleKr: "무빙",
    titleEn: "Moving",
    year: 2023,
    network: "Disney+",
    genres: ["액션", "판타지", "드라마"],
    genresEn: ["Action", "Fantasy", "Drama"],
    emoji: "⚡",
    puzzleCount: 6,
    description: "초능력을 가진 아이들과 그들의 부모 세대의 이야기. 조인성, 한효주 주연.",
  },
  {
    id: "hotel-del-luna",
    titleKr: "호텔 델루나",
    titleEn: "Hotel del Luna",
    year: 2019,
    network: "tvN",
    genres: ["판타지", "로맨스"],
    genresEn: ["Fantasy", "Romance"],
    emoji: "🌙",
    puzzleCount: 7,
    description: "귀신들을 위한 호텔 사장 만월 — 아이유의 압도적 존재감.",
  },
  {
    id: "crash-landing",
    titleKr: "사랑의 불시착",
    titleEn: "Crash Landing on You",
    year: 2019,
    network: "tvN",
    genres: ["로맨스", "드라마"],
    genresEn: ["Romance", "Drama"],
    emoji: "🪂",
    puzzleCount: 8,
    description: "북한에 불시착한 재벌 상속녀와 북한 장교의 로맨스.",
  },
  {
    id: "extraordinary-attorney-woo",
    titleKr: "이상한 변호사 우영우",
    titleEn: "Extraordinary Attorney Woo",
    year: 2022,
    network: "ENA",
    genres: ["법정", "드라마"],
    genresEn: ["Legal", "Drama"],
    emoji: "🐋",
    puzzleCount: 5,
    description: "자폐 스펙트럼 장애를 가진 천재 신입 변호사 우영우의 성장기.",
  },
  {
    id: "goblin",
    titleKr: "도깨비",
    titleEn: "Guardian: The Lonely and Great God",
    year: 2016,
    network: "tvN",
    genres: ["판타지", "로맨스"],
    genresEn: ["Fantasy", "Romance"],
    emoji: "🕯️",
    puzzleCount: 9,
    description: "불멸의 삶을 사는 도깨비와 그의 신부를 찾는 운명적 이야기.",
  },
  {
    id: "reply-1988",
    titleKr: "응답하라 1988",
    titleEn: "Reply 1988",
    year: 2015,
    network: "tvN",
    genres: ["드라마", "코미디"],
    genresEn: ["Drama", "Comedy"],
    emoji: "📻",
    puzzleCount: 6,
    description: "1988년 쌍문동 골목의 다섯 가족과 청춘 이야기.",
  },
  {
    id: "alchemy-of-souls",
    titleKr: "환혼",
    titleEn: "Alchemy of Souls",
    year: 2022,
    network: "tvN",
    genres: ["판타지", "무협"],
    genresEn: ["Fantasy", "Martial Arts"],
    emoji: "🌀",
    puzzleCount: 4,
    description: "영혼이 뒤바뀐 두 남녀의 이야기를 그린 무협 판타지.",
  },
];

export default function DramasDirectoryPage() {
  return (
    <main className="dramas-directory-page">
      <SiteNav />

      <section className="directory-content">
        <div className="directory-header">
          <span className="eyebrow">엔티티 아카이브 · Entity Archive</span>
          <h1>드라마 디렉토리</h1>
          <p className="dir-sub">
            퀴즈에 등장한 주요 K-드라마 명작들의 장면, 출연진, OST 및 연관 콘텐츠를 확인하세요.
            <br />
            <span style={{ fontSize: "13px", fontFamily: "var(--font-mono, 'DM Mono', monospace)", color: "var(--muted)" }}>
              Explore K-dramas featured in daily puzzles — scenes, cast, OSTs, and more.
            </span>
          </p>
        </div>

        <div className="dramas-grid">
          {DRAMAS.map((drama) => (
            <Link key={drama.id} href={`/dramas/${drama.id}`} className="drama-entity-card">
              <div className="drama-poster">
                <span className="drama-poster-placeholder">{drama.emoji}</span>
                <div className="drama-poster-overlay" />
                <span className="drama-poster-badge">
                  {drama.puzzleCount} 퍼즐 · {drama.network}
                </span>
              </div>
              <div className="drama-card-body">
                <span className="drama-year">{drama.year} · {drama.network}</span>
                <h2>{drama.titleKr}</h2>
                <p>{drama.titleEn}</p>
                <p style={{ fontSize: "12px", color: "var(--muted)", marginBottom: "14px", marginTop: "-8px" }}>
                  {drama.description}
                </p>
                <div className="genres-list">
                  {drama.genresEn.map((g) => (
                    <span key={g} className="genre-pill">{g}</span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
