"use client";

import { useCallback, useEffect, useState } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { SiteNav } from "@/components/layout/SiteNav";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { IconFlame, IconTrophy } from "@/components/icons/Icons";
import { NicknameModal } from "@/components/leaderboard/NicknameModal";
import { getDeviceId } from "@/lib/game/device";
import { fetchNickname } from "@/lib/game/nickname";

type Period = "today" | "week" | "month" | "all";

type Row = {
  rank: number;
  display_name: string;
  total_score: number;
  solves: number;
  games: number;
  current_streak: number;
  is_me: boolean;
};

async function fetchRows(period: Period): Promise<Row[]> {
  try {
    const guestId = getDeviceId();
    const res = await fetch(
      `/api/leaderboard?period=${period}&guestId=${encodeURIComponent(guestId)}`,
      { cache: "no-store" },
    );
    const data = (await res.json()) as { rows?: Row[] };
    return data.rows ?? [];
  } catch {
    return [];
  }
}

export default function LeaderboardPage() {
  const { locale, t } = useLocale();
  const [tab, setTab] = useState<Period>("all");
  const [rows, setRows] = useState<Row[] | null>(null);
  const [nickname, setNickname] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchNickname().then(setNickname);
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetchRows(tab).then((next) => {
      if (!cancelled) setRows(next);
    });
    return () => {
      cancelled = true;
    };
  }, [tab]);

  const closeModal = useCallback(() => setModalOpen(false), []);

  const tabs: { key: Period; label: string }[] = [
    { key: "today", label: t("tabToday") },
    { key: "week", label: t("tabWeek") },
    { key: "month", label: t("tabMonth") },
    { key: "all", label: t("tabAll") },
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

        <div className="lb-identity">
          {nickname ? (
            <>
              <span>
                {t("lbPlayingAs")} <strong>{nickname}</strong>
              </span>
              <button type="button" className="lb-identity-btn" onClick={() => setModalOpen(true)}>
                {t("lbEditName")}
              </button>
            </>
          ) : (
            <button type="button" className="lb-identity-btn primary" onClick={() => setModalOpen(true)}>
              {t("lbSetName")}
            </button>
          )}
        </div>

        <div className="tab-bar">
          {tabs.map((item) => (
            <button
              key={item.key}
              type="button"
              className={tab === item.key ? "active" : ""}
              onClick={() => {
                if (item.key === tab) return;
                setRows(null);
                setTab(item.key);
              }}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="leaderboard-table-card">
          {rows === null ? (
            <p className="lb-status">{t("lbLoading")}</p>
          ) : rows.length === 0 ? (
            <p className="lb-status">{t("lbEmpty")}</p>
          ) : (
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
                {rows.map((item, i) => {
                  // Your own row, appended after the top 50
                  const detached = item.is_me && i >= 50;
                  const classes = [
                    item.rank <= 3 ? `top-${item.rank}` : "",
                    item.is_me ? "lb-me" : "",
                    detached ? "lb-detached" : "",
                  ].filter(Boolean).join(" ");

                  return (
                    <tr key={`${item.rank}-${item.display_name}`} className={classes}>
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
                        <strong>{item.display_name}</strong>
                        {item.is_me && <span className="lb-you-tag">{t("lbYou")}</span>}
                      </td>
                      <td className="lb-score">
                        <strong>{item.total_score} pts</strong>
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
                        {item.current_streak}{" "}
                        {locale === "en" ? "days" : "일"}
                      </td>
                      <td className="lb-cat">
                        {item.solves} / {item.games}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </section>

      <NicknameModal
        key={String(modalOpen)}
        isOpen={modalOpen}
        initialName={nickname}
        onClose={closeModal}
        onSaved={(name) => {
          setNickname(name);
          fetchRows(tab).then(setRows);
        }}
      />

      <SiteFooter />
    </main>
  );
}
