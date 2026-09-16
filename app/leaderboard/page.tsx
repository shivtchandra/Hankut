"use client";

import { useState } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { SiteNav } from "@/components/layout/SiteNav";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { IconFlame, IconTrophy } from "@/components/icons/Icons";

export default function LeaderboardPage() {
  const { locale, t } = useLocale();
  const [tab, setTab] = useState<"today" | "week" | "month" | "all">("today");

  const mockLeaderboard = [
    {
      rank: 1,
      nameEn: "JejuTangerine",
      nameKr: "제주감귤",
      score: 25,
      streak: 14,
      categoryEn: "Overall #1",
      categoryKr: "전체 덕력 1위",
    },
    {
      rank: 2,
      nameEn: "GuMr",
      nameKr: "구씨",
      score: 24,
      streak: 9,
      categoryEn: "Scene Master",
      categoryKr: "장면 덕력 1위",
    },
    {
      rank: 3,
      nameEn: "HotelOwner",
      nameKr: "호텔주인",
      score: 24,
      streak: 11,
      categoryEn: "OST Master",
      categoryKr: "노래 덕력 1위",
    },
    {
      rank: 4,
      nameEn: "Bongseok",
      nameKr: "봉석이",
      score: 23,
      streak: 5,
      categoryEn: "Chosung Master",
      categoryKr: "초성 덕력 1위",
    },
    {
      rank: 5,
      nameEn: "SamdalriDiver",
      nameKr: "삼달리해녀",
      score: 22,
      streak: 7,
      categoryEn: "Connections",
      categoryKr: "연결고리 1위",
    },
    {
      rank: 6,
      nameEn: "KDramaFan99",
      nameKr: "익명의덕후",
      score: 21,
      streak: 3,
      categoryEn: "Cast Trivia",
      categoryKr: "인물 덕력",
    },
    {
      rank: 7,
      nameEn: "DramaAddict",
      nameKr: "드라마폐인",
      score: 20,
      streak: 6,
      categoryEn: "Scene Cut",
      categoryKr: "장면 덕력",
    },
  ];

  return (
    <main className="leaderboard-page">
      <SiteNav />

      <section className="leaderboard-content">
        <div className="leaderboard-header-meta">
          <span className="eyebrow">{t("navLeaderboard")}</span>
          <h1>{t("leaderboardTitle")}</h1>
          <p>{t("leaderboardSubtitle")}</p>
        </div>

        <div className="tab-bar">
          <button
            type="button"
            className={tab === "today" ? "active" : ""}
            onClick={() => setTab("today")}
          >
            {t("tabToday")}
          </button>
          <button
            type="button"
            className={tab === "week" ? "active" : ""}
            onClick={() => setTab("week")}
          >
            {t("tabWeek")}
          </button>
          <button
            type="button"
            className={tab === "month" ? "active" : ""}
            onClick={() => setTab("month")}
          >
            {t("tabMonth")}
          </button>
          <button
            type="button"
            className={tab === "all" ? "active" : ""}
            onClick={() => setTab("all")}
          >
            {t("tabAll")}
          </button>
        </div>

        <div className="leaderboard-table-card">
          <table className="lb-table">
            <thead>
              <tr>
                <th>{t("colRank")}</th>
                <th>{t("colPlayer")}</th>
                <th>{t("colScore")}</th>
                <th>{t("colStreak")}</th>
                <th>{t("colSpecialty")}</th>
              </tr>
            </thead>
            <tbody>
              {mockLeaderboard.map((item) => {
                const playerName = locale === "en" ? item.nameEn : item.nameKr;
                const category =
                  locale === "en" ? item.categoryEn : item.categoryKr;

                return (
                  <tr
                    key={item.rank}
                    className={item.rank <= 3 ? `top-${item.rank}` : ""}
                  >
                    <td className="lb-rank">
                      {item.rank <= 3 ? (
                        <span className={`rank-badge rank-${item.rank}`}>
                          <IconTrophy size={14} style={{ marginRight: 4 }} />
                          #{item.rank}
                        </span>
                      ) : (
                        `#${item.rank}`
                      )}
                    </td>
                    <td className="lb-name">
                      <strong>{playerName}</strong>
                    </td>
                    <td className="lb-score">
                      <strong>{item.score} / 25 pts</strong>
                    </td>
                    <td className="lb-streak">
                      <IconFlame
                        size={14}
                        style={{
                          marginRight: 4,
                          display: "inline-block",
                          verticalAlign: "middle",
                        }}
                      />
                      {item.streak}{" "}
                      {locale === "en" ? "days" : "일"}
                    </td>
                    <td className="lb-cat">{category}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
