"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { puzzleTypeLabel, type Locale } from "@/lib/i18n/dictionary";

type Puzzle = {
  id: string;
  date: string;
  titleEn: string;
  titleKo: string;
  category: "scene" | "song" | "chosung" | "connections" | "people";
  difficulty: number;
  solveRate: string;
  solved: boolean;
};

const MOCK: Puzzle[] = [
  {
    id: "247",
    date: "2026-09-11",
    titleEn: "Today's scene #247 (When Life Gives You Tangerines)",
    titleKo: "오늘의 장면 #247 (폭싹 속았수다)",
    category: "scene",
    difficulty: 6.8,
    solveRate: "74%",
    solved: true,
  },
  {
    id: "246",
    date: "2026-09-10",
    titleEn: "Today's song #246 (Taeyeon — All About You)",
    titleKo: "오늘의 노래 #246 (태연 - 그대라는 시)",
    category: "song",
    difficulty: 5.4,
    solveRate: "82%",
    solved: true,
  },
  {
    id: "245",
    date: "2026-09-09",
    titleEn: "Chosung #245 (ㄴㅇ ㅎㅂㅇㅈ)",
    titleKo: "초성 맞히기 #245 (ㄴㅇ ㅎㅂㅇㅈ)",
    category: "chosung",
    difficulty: 7.2,
    solveRate: "61%",
    solved: false,
  },
  {
    id: "244",
    date: "2026-09-08",
    titleEn: "Connections #244 (Jeju-set dramas)",
    titleKo: "오늘의 연결고리 #244 (제주도 배경 드라마)",
    category: "connections",
    difficulty: 8.1,
    solveRate: "49%",
    solved: false,
  },
  {
    id: "243",
    date: "2026-09-07",
    titleEn: "Who is this? #243 (Park Bo-gum)",
    titleKo: "누구지? #243 (배우 박보검)",
    category: "people",
    difficulty: 4.8,
    solveRate: "89%",
    solved: true,
  },
];

function catIcon(category: Puzzle["category"]) {
  return (
    {
      scene: "🎬",
      song: "🎵",
      chosung: "🔤",
      connections: "🧩",
      people: "👤",
    } as const
  )[category];
}

function titleFor(item: Puzzle, locale: Locale) {
  return locale === "en" ? item.titleEn : item.titleKo;
}

export default function ArchivePage() {
  const { locale, setLocale, t } = useLocale();
  const [activeCategory, setActiveCategory] = useState("all");

  const filters = useMemo(
    () => [
      { id: "all", label: t("filterAll") },
      { id: "scene", label: `🎬 ${t("typeScene")}` },
      { id: "song", label: `🎵 ${t("typeSong")}` },
      { id: "chosung", label: `🔤 ${t("typeChosung")}` },
      { id: "connections", label: `🧩 ${t("typeConnections")}` },
      { id: "people", label: `👤 ${t("typePeople")}` },
    ],
    [t, locale],
  );

  const filtered =
    activeCategory === "all"
      ? MOCK
      : MOCK.filter((p) => p.category === activeCategory);

  return (
    <main className="archive-page">
      <header className="topbar">
        <a href="/" className="brand">
          <span className="brand-mark">{t("archiveBrand")}</span>
          <span className="brand-name">{t("archiveTitle")}</span>
        </a>
        <div className="topbar-right">
          <div className="lang-toggle" role="group" aria-label="Language">
            <button
              type="button"
              className={locale === "en" ? "active" : ""}
              onClick={() => setLocale("en")}
            >
              EN
            </button>
            <button
              type="button"
              className={locale === "ko" ? "active" : ""}
              onClick={() => setLocale("ko")}
            >
              한
            </button>
          </div>
          <nav className="topnav">
            <a href="/">{t("navToday")}</a>
            <a href="/archive" className="active">
              {t("navArchive")}
            </a>
            <a href="/leaderboard">{t("navLeaderboard")}</a>
            <a href="/profile">{t("navProfile")}</a>
          </nav>
        </div>
      </header>

      <section className="archive-content">
        <div className="archive-header-meta">
          <span className="eyebrow">{t("archiveEyebrow")}</span>
          <h1>{t("archiveTitle")}</h1>
          <p>{t("archiveCopy")}</p>
        </div>

        <div className="category-filter-bar">
          {filters.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={`filter-chip ${activeCategory === cat.id ? "active" : ""}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="archive-grid">
          {filtered.map((item) => (
            <div key={item.id} className="archive-card">
              <div className="archive-card-header">
                <span className="archive-category">
                  {catIcon(item.category)} {puzzleTypeLabel(item.category, locale)}
                </span>
                <span className="archive-date">{item.date}</span>
              </div>
              <h3 className="archive-title">{titleFor(item, locale)}</h3>
              <div className="archive-card-footer">
                <span>
                  {t("difficulty")} {item.difficulty}
                </span>
                <span>
                  {t("solveRate")} {item.solveRate}
                </span>
                {item.solved ? (
                  <span className="solved-badge">{t("solvedDone")}</span>
                ) : (
                  <Link href={`/?date=${item.date}`} className="play-link">
                    {t("playAgain")}
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
