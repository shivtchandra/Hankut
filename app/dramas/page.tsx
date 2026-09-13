import Link from "next/link";
import { DEMO_DRAMAS } from "@/lib/demo-data";

export default function DramasDirectoryPage() {
  return (
    <main className="dramas-directory-page">
      <header className="topbar">
        <a href="/" className="brand">
          <span className="brand-mark">탐색</span>
          <span className="brand-name">한국 엔터테인먼트 아카이브</span>
        </a>
        <nav className="topnav">
          <a href="/">오늘의 게임</a>
          <a href="/dramas" className="active">드라마 탐색</a>
          <a href="/archive">지난 장면</a>
          <a href="/profile">나의 기록</a>
        </nav>
      </header>

      <section className="directory-content">
        <div className="directory-header">
          <span className="eyebrow">엔티티 아카이브</span>
          <h1>드라마 디렉토리</h1>
          <p>퀴즈에 등장한 주요 K-드라마 명작들의 장면, 출연진, OST 및 연관 콘텐츠를 확인하세요.</p>
        </div>

        <div className="dramas-grid">
          {DEMO_DRAMAS.map((drama) => (
            <Link key={drama.id} href={`/dramas/${drama.id}`} className="drama-entity-card">
              <div className="drama-card-body">
                <span className="drama-year">{drama.year} · {drama.network}</span>
                <h2>{drama.titleKr}</h2>
                <p>{drama.titleEn}</p>
                <div className="genres-list">
                  {drama.genres.map((g) => (
                    <span key={g} className="genre-pill">{g}</span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
