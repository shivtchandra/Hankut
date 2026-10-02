"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { getDeviceId } from "@/lib/game/device";
import {
  IconCalendar,
  IconCheck,
  IconMusic,
  IconScene,
  IconSearch,
} from "@/components/icons/Icons";

export type ArchivePuzzle = {
  id: string;
  date: string;
  type: "scene" | "song" | "chosung" | "people" | "connections";
  titleKr?: string;
  titleEn?: string;
  genres?: string[];
  year?: number | null;
  network?: string | null;
};

type HistoryRow = { game_date: string; solved: boolean; score: number };

const GENRE_CATEGORIES = [
  { id: "all", labelEn: "All Genres", labelKr: "전체 장르", icon: "✨" },
  { id: "romance", labelEn: "Romance", labelKr: "로맨스", icon: "💖" },
  { id: "fantasy", labelEn: "Fantasy", labelKr: "판타지", icon: "🔮" },
  { id: "action", labelEn: "Action & Thriller", labelKr: "액션·스릴러", icon: "🔥" },
  { id: "comedy", labelEn: "Comedy & Life", labelKr: "코미디·일상", icon: "😄" },
  { id: "historical", labelEn: "Historical", labelKr: "사극", icon: "👑" },
  { id: "ost", labelEn: "OST & Music", labelKr: "음악·OST", icon: "🎵" },
];

function matchesGenreGroup(groupId: string, puzzle: ArchivePuzzle): boolean {
  if (groupId === "all") return true;
  if (groupId === "ost") {
    return (
      puzzle.type === "song" ||
      (puzzle.genres || []).some((g) =>
        ["음악", "music", "ost"].includes(g.toLowerCase())
      )
    );
  }

  const raw = (puzzle.genres || []).map((g) => g.toLowerCase());
  if (groupId === "romance") {
    return raw.some((g) =>
      ["romance", "로맨스", "melodrama", "멜로"].includes(g)
    );
  }
  if (groupId === "fantasy") {
    return raw.some((g) =>
      ["fantasy", "판타지", "sci-fi", "sf", "supernatural"].includes(g)
    );
  }
  if (groupId === "action") {
    return raw.some((g) =>
      [
        "action",
        "액션",
        "thriller",
        "스릴러",
        "crime",
        "범죄",
        "mystery",
        "미스터리",
        "복수",
      ].includes(g)
    );
  }
  if (groupId === "comedy") {
    return raw.some((g) =>
      [
        "comedy",
        "코미디",
        "slice of life",
        "일상",
        "청춘",
        "youth",
        "family",
        "가족",
        "drama",
        "드라마",
      ].includes(g)
    );
  }
  if (groupId === "historical") {
    return raw.some((g) =>
      ["historical", "사극", "시대극", "period"].includes(g)
    );
  }

  return false;
}

export function ArchiveGrid({ puzzles }: { puzzles: ArchivePuzzle[] }) {
  const { locale } = useLocale();
  const isKo = locale === "ko";
  const [history, setHistory] = useState<Record<string, HistoryRow>>({});
  const [selectedGenre, setSelectedGenre] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    const deviceId = getDeviceId();
    if (!deviceId) return;
    fetch(`/api/game/history?device_id=${deviceId}`)
      .then((r) => r.json())
      .then((rows: HistoryRow[]) => {
        const map: Record<string, HistoryRow> = {};
        for (const row of rows) map[row.game_date] = row;
        setHistory(map);
      })
      .catch(() => {});
  }, []);

  const filteredPuzzles = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return puzzles.filter((item) => {
      // 1. Game mode filter
      if (selectedType !== "all" && item.type !== selectedType) {
        return false;
      }

      // 2. Genre filter
      if (!matchesGenreGroup(selectedGenre, item)) {
        return false;
      }

      // 3. Search query
      if (q) {
        const matchTitleKr = (item.titleKr || "").toLowerCase().includes(q);
        const matchTitleEn = (item.titleEn || "").toLowerCase().includes(q);
        const matchYear = String(item.year || "").includes(q);
        const matchGenre = (item.genres || []).some((g) =>
          g.toLowerCase().includes(q)
        );
        if (!matchTitleKr && !matchTitleEn && !matchYear && !matchGenre) {
          return false;
        }
      }

      return true;
    });
  }, [puzzles, selectedGenre, selectedType, searchQuery]);

  return (
    <div className="archive-explorer">
      {/* ── Type / Mode Selector ── */}
      <div className="archive-toolbar">
        <div className="archive-type-tabs" role="tablist">
          <button
            type="button"
            className={`archive-type-btn ${selectedType === "all" ? "active" : ""}`}
            onClick={() => setSelectedType("all")}
          >
            {isKo ? "전체 컷" : "All Cuts"} ({puzzles.length})
          </button>
          <button
            type="button"
            className={`archive-type-btn ${selectedType === "scene" ? "active" : ""}`}
            onClick={() => setSelectedType("scene")}
          >
            <IconScene size={14} style={{ marginRight: 6 }} />
            {isKo ? "장면 컷" : "Scene Cuts"}
          </button>
          <button
            type="button"
            className={`archive-type-btn ${selectedType === "song" ? "active" : ""}`}
            onClick={() => setSelectedType("song")}
          >
            <IconMusic size={14} style={{ marginRight: 6 }} />
            {isKo ? "OST 오디오" : "OST Audio Cuts"}
          </button>
        </div>

        {/* ── Search Bar ── */}
        <div className="archive-search-box">
          <IconSearch size={16} className="archive-search-icon" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              isKo
                ? "드라마 제목, 연도, 장르 검색..."
                : "Search drama title, year, or genre..."
            }
          />
          {searchQuery && (
            <button
              type="button"
              className="archive-search-clear"
              onClick={() => setSearchQuery("")}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* ── Genre Pills Filter Bar ── */}
      <div className="category-filter-bar" role="tablist">
        {GENRE_CATEGORIES.map((cat) => {
          const count = puzzles.filter((p) =>
            matchesGenreGroup(cat.id, p)
          ).length;
          return (
            <button
              key={cat.id}
              type="button"
              className={`filter-chip ${selectedGenre === cat.id ? "active" : ""}`}
              onClick={() => setSelectedGenre(cat.id)}
            >
              <span className="filter-chip-icon">{cat.icon}</span>
              <span>{isKo ? cat.labelKr : cat.labelEn}</span>
              <span className="filter-chip-count">{count}</span>
            </button>
          );
        })}
      </div>

      {/* ── Results Info ── */}
      <div className="archive-results-meta">
        <span>
          {isKo
            ? `총 ${filteredPuzzles.length}개의 퍼즐`
            : `Showing ${filteredPuzzles.length} puzzles`}
        </span>
        {(selectedGenre !== "all" || selectedType !== "all" || searchQuery) && (
          <button
            type="button"
            className="archive-reset-filters"
            onClick={() => {
              setSelectedGenre("all");
              setSelectedType("all");
              setSearchQuery("");
            }}
          >
            {isKo ? "필터 초기화" : "Reset filters"}
          </button>
        )}
      </div>

      {/* ── Grid of Puzzle Cards ── */}
      {filteredPuzzles.length === 0 ? (
        <div className="archive-empty-filter">
          <p>
            {isKo
              ? "선택한 조건에 맞는 과거 퀴즈가 없습니다."
              : "No puzzles found matching this filter."}
          </p>
          <button
            type="button"
            className="filter-reset-action"
            onClick={() => {
              setSelectedGenre("all");
              setSelectedType("all");
              setSearchQuery("");
            }}
          >
            {isKo ? "모든 퍼즐 보기" : "Show All Puzzles"}
          </button>
        </div>
      ) : (
        <div className="archive-grid">
          {filteredPuzzles.map((item) => {
            const d = new Date(`${item.date}T12:00:00+09:00`);
            const label = new Intl.DateTimeFormat("en-GB", {
              weekday: "short",
              day: "numeric",
              month: "short",
              year: "numeric",
              timeZone: "Asia/Seoul",
            })
              .format(d)
              .toUpperCase();

            const played = history[item.date];
            const isSong = item.type === "song";
            const primaryTitle = isKo
              ? item.titleKr || item.titleEn
              : item.titleEn || item.titleKr;
            const secondaryTitle = isKo ? item.titleEn : item.titleKr;

            return (
              <Link
                key={item.id}
                href={`/?date=${item.date}`}
                className="archive-card"
              >
                <div className="archive-card-header">
                  <span
                    className={`archive-category ${isSong ? "archive-cat-song" : ""}`}
                  >
                    {isSong ? (
                      <>
                        <IconMusic size={11} style={{ marginRight: 3 }} /> OST CUT
                      </>
                    ) : (
                      <>
                        <IconScene size={11} style={{ marginRight: 3 }} /> SCENE CUT
                      </>
                    )}
                  </span>
                  <span className="archive-date">{label}</span>
                </div>

                <div className="archive-card-body">
                  {played ? (
                    <>
                      <strong className="archive-title">{primaryTitle}</strong>
                      {secondaryTitle && (
                        <span className="archive-sub-title">
                          {secondaryTitle} {item.year ? `· ${item.year}` : ""}
                        </span>
                      )}
                    </>
                  ) : (
                    <div className="archive-hidden-preview">
                      <div className="archive-genres-row">
                        {item.genres?.slice(0, 2).map((g, idx) => (
                          <span key={idx} className="archive-genre-pill">
                            {g}
                          </span>
                        ))}
                        {item.year && (
                          <span className="archive-year-pill">{item.year}</span>
                        )}
                        {item.network && (
                          <span className="archive-network-pill">
                            {item.network}
                          </span>
                        )}
                      </div>
                      <p className="archive-card-hint">
                        {isKo
                          ? "클릭하여 도전하기 (정답 비공개)"
                          : "Tap to play — answer hidden"}
                      </p>
                    </div>
                  )}
                </div>

                <div className="archive-card-footer">
                  {played ? (
                    <div
                      className={`archive-played-badge ${played.solved ? "solved" : "failed"}`}
                    >
                      {played.solved ? (
                        <>
                          <IconCheck size={12} style={{ marginRight: 4 }} />
                          {isKo ? "정답" : "Solved"} · +{played.score} pts
                        </>
                      ) : (
                        <>{isKo ? "아쉬움 (실패)" : "Missed"}</>
                      )}
                    </div>
                  ) : (
                    <span className="archive-play-btn-tag">
                      {isKo ? "플레이 →" : "Play Now →"}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
