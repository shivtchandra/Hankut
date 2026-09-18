"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { SiteNav } from "@/components/layout/SiteNav";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { getDeviceId } from "@/lib/game/device";
import type { CatalogDrama } from "@/lib/drama-catalog";

type PuzzleRow = {
  id: string;
  game_date: string;
  play_count: number;
  solved_count: number;
  avg_score: number | null;
  solve_rate: number | null;
};

type HistoryRow = {
  game_date: string;
  solved: boolean;
  score: number;
  attempts: number;
};

type Tier = { label: string; emoji: string; color: string };

function getTier(avgScore: number | null, playsCount: number): Tier {
  if (playsCount === 0) return { label: "Not ranked yet", emoji: "—", color: "var(--muted)" };
  if (avgScore === null || avgScore < 100) return { label: "Rookie", emoji: "🎬", color: "#6B7280" };
  if (avgScore < 250) return { label: "Fan", emoji: "⭐", color: "#D97706" };
  if (avgScore < 400) return { label: "Devotee", emoji: "🔥", color: "#DC2626" };
  return { label: "Superfan", emoji: "👑", color: "#7C3AED" };
}

function formatDate(dateStr: string, locale: string) {
  try {
    const d = new Date(`${dateStr}T12:00:00+09:00`);
    if (locale === "ko") {
      return new Intl.DateTimeFormat("ko-KR", { month: "long", day: "numeric", weekday: "short", timeZone: "Asia/Seoul" }).format(d);
    }
    return new Intl.DateTimeFormat("en-GB", { weekday: "short", day: "2-digit", month: "short", timeZone: "Asia/Seoul" }).format(d).toUpperCase();
  } catch {
    return dateStr;
  }
}

export function DramaDetailView({ drama }: { drama: CatalogDrama }) {
  const { locale } = useLocale();
  const [puzzles, setPuzzles] = useState<PuzzleRow[]>([]);
  const [history, setHistory] = useState<Map<string, HistoryRow>>(new Map());
  const [loading, setLoading] = useState(true);

  const primaryTitle = locale === "en" ? drama.titleEn : drama.titleKr;
  const secondaryTitle = locale === "en" ? drama.titleKr : drama.titleEn;
  const desc = locale === "en" ? drama.descriptionEn : drama.descriptionKr;
  const genres = locale === "en" ? drama.genresEn : drama.genresKr;

  useEffect(() => {
    async function load() {
      const deviceId = getDeviceId();
      const [dramaRes, histRes] = await Promise.all([
        fetch(`/api/drama/${drama.dbId}`),
        deviceId ? fetch(`/api/game/history?device_id=${deviceId}`) : Promise.resolve(null),
      ]);

      if (dramaRes.ok) {
        const data = await dramaRes.json() as { puzzles: PuzzleRow[] };
        setPuzzles(data.puzzles ?? []);
      }
      if (histRes?.ok) {
        const rows = await histRes.json() as HistoryRow[];
        setHistory(new Map(rows.map((r) => [r.game_date, r])));
      }
      setLoading(false);
    }
    load();
  }, [drama.dbId]);

  // Personal score card
  const myPlays = puzzles
    .map((p) => history.get(p.game_date))
    .filter((h): h is HistoryRow => !!h);
  const myAvgScore = myPlays.length > 0
    ? Math.round(myPlays.reduce((s, h) => s + (h.score ?? 0), 0) / myPlays.length)
    : null;
  const tier = getTier(myAvgScore, myPlays.length);

  // Community aggregate
  const totalPlays = puzzles.reduce((s, p) => s + p.play_count, 0);
  const totalSolved = puzzles.reduce((s, p) => s + p.solved_count, 0);
  const communityRate = totalPlays > 0 ? Math.round((totalSolved / totalPlays) * 100) : null;

  return (
    <main className="drama-detail-page">
      <SiteNav />

      {/* ── Hero ── */}
      <section className="drama-detail-hero">
        <div className="drama-detail-poster">
          <span className="drama-detail-emoji">{drama.emoji}</span>
          <span className="drama-detail-network-badge">{drama.network}</span>
        </div>

        <div className="drama-hero-info">
          <Link href="/dramas" className="drama-back-link">
            ← {locale === "ko" ? "드라마 목록" : "Browse dramas"}
          </Link>

          <span className="eyebrow">{drama.year} · {drama.network}</span>
          <h1 className="drama-detail-title">{primaryTitle}</h1>
          <p className="drama-detail-secondary">{secondaryTitle}</p>
          <p className="drama-detail-desc">{desc}</p>

          <div className="genres-list">
            {genres.map((g) => <span key={g} className="genre-pill">{g}</span>)}
          </div>
        </div>
      </section>

      <div className="drama-detail-body">

        {/* ── Score Card ── */}
        <div className="drama-score-card">
          <div className="score-card-left">
            <span className="score-tier-emoji">{tier.emoji}</span>
            <div>
              <p className="score-tier-label" style={{ color: tier.color }}>{tier.label}</p>
              <p className="score-tier-sub">
                {myPlays.length === 0
                  ? (locale === "ko" ? "이 드라마 퍼즐을 풀어 랭크를 얻으세요" : "Play a scene from this drama to earn your rank")
                  : (locale === "ko"
                    ? `${myPlays.length}개 퍼즐 · 평균 ${myAvgScore}점`
                    : `${myPlays.length} puzzle${myPlays.length !== 1 ? "s" : ""} · avg ${myAvgScore} pts`)}
              </p>
            </div>
          </div>

          {communityRate !== null && (
            <div className="score-card-right">
              <p className="score-community-pct">{communityRate}%</p>
              <p className="score-community-label">
                {locale === "ko" ? "정답률" : "community solve rate"}
              </p>
            </div>
          )}
        </div>

        {/* ── Past Puzzles ── */}
        <div className="drama-puzzles-section">
          <h2 className="drama-section-title">
            {locale === "ko" ? "이 드라마의 퍼즐" : "Puzzles from this drama"}
          </h2>

          {loading ? (
            <div className="drama-puzzles-loading">
              {[0,1,2].map(i => <div key={i} className="puzzle-card-skeleton" />)}
            </div>
          ) : puzzles.length === 0 ? (
            <div className="drama-no-puzzles">
              <p>{locale === "ko" ? "아직 이 드라마의 퍼즐이 없습니다." : "No puzzles from this drama yet."}</p>
              <Link href="/" className="primary-btn" style={{ marginTop: 16, display: "inline-block" }}>
                {locale === "ko" ? "오늘 퍼즐 풀기 →" : "Play today's puzzle →"}
              </Link>
            </div>
          ) : (
            <div className="drama-puzzles-grid">
              {puzzles.map((puzzle) => {
                const played = history.get(puzzle.game_date);
                const solved = played?.solved;

                return (
                  <Link
                    key={puzzle.id}
                    href={`/?date=${puzzle.game_date}`}
                    className={`puzzle-history-card${played ? (solved ? " solved" : " failed") : ""}`}
                  >
                    <div className="puzzle-card-date">{formatDate(puzzle.game_date, locale)}</div>

                    <div className="puzzle-card-status">
                      {played ? (
                        solved ? (
                          <span className="puzzle-status-badge solved">
                            ✓ {locale === "ko" ? `${played.score}점` : `${played.score} pts`}
                          </span>
                        ) : (
                          <span className="puzzle-status-badge failed">
                            ✗ {locale === "ko" ? "실패" : "Not solved"}
                          </span>
                        )
                      ) : (
                        <span className="puzzle-status-badge unplayed">
                          {locale === "ko" ? "미플레이" : "Play →"}
                        </span>
                      )}
                    </div>

                    {puzzle.play_count > 0 && (
                      <div className="puzzle-card-community">
                        {puzzle.solve_rate !== null
                          ? `${puzzle.solve_rate}% solved`
                          : `${puzzle.play_count} plays`}
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          )}
        </div>

      </div>

      <SiteFooter />
    </main>
  );
}
