import Link from "next/link";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { seoulDate } from "@/lib/game/today";

type GameRow = {
  id: string;
  game_date: string;
  title_en: string;
  plays: number;
  completions: number;
  solves: number;
  avg_score: number | null;
  avg_frames: number | null;
  unique_players: number;
};

type TrendRow = { day: string; plays: number };

async function getAnalytics() {
  const db = await createSupabaseAdmin();
  const today = seoulDate();

  // Per-game breakdown
  const { data: gameRows } = await db.rpc("analytics_per_game" as never) as { data: GameRow[] | null };

  // Fallback: direct query if RPC not available
  let games: GameRow[] = gameRows ?? [];
  if (!games.length) {
    const { data } = await db
      .from("daily_games")
      .select(`
        id, game_date,
        scenes ( dramas ( title_en ) ),
        plays ( id, completed_at, solved, score, steps_revealed, guest_id )
      `)
      .in("status", ["published", "scheduled"])
      .order("game_date", { ascending: false })
      .limit(60);

    games = (data ?? []).map((row: any) => {
      const drama = Array.isArray(row.scenes?.dramas) ? row.scenes.dramas[0] : row.scenes?.dramas;
      const allPlays: any[] = Array.isArray(row.plays) ? row.plays : [];
      const completedPlays = allPlays.filter((p: any) => p.completed_at);
      const solvedPlays = allPlays.filter((p: any) => p.solved);
      const scores = completedPlays.map((p: any) => p.score).filter(Boolean);
      const frames = completedPlays.map((p: any) => p.steps_revealed).filter((v: any) => v != null);
      const guestIds = new Set(allPlays.map((p: any) => p.guest_id).filter(Boolean));
      return {
        id: row.id,
        game_date: row.game_date,
        title_en: drama?.title_en ?? "—",
        plays: allPlays.length,
        completions: completedPlays.length,
        solves: solvedPlays.length,
        avg_score: scores.length ? Math.round(scores.reduce((a: number, b: number) => a + b, 0) / scores.length) : null,
        avg_frames: frames.length ? Math.round((frames.reduce((a: number, b: number) => a + b, 0) / frames.length) * 10) / 10 : null,
        unique_players: guestIds.size,
      };
    });
  }

  // Daily trend: last 14 days
  const { data: trendRaw } = await db
    .from("plays")
    .select("created_at")
    .gte("created_at", new Date(Date.now() - 14 * 86400000).toISOString());

  const trendMap: Record<string, number> = {};
  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    trendMap[key] = 0;
  }
  for (const row of trendRaw ?? []) {
    const key = (row as any).created_at?.slice(0, 10);
    if (key && key in trendMap) trendMap[key]++;
  }
  const trend: TrendRow[] = Object.entries(trendMap).map(([day, plays]) => ({ day, plays }));

  // Totals
  const totalPlays = games.reduce((s, g) => s + g.plays, 0);
  const totalCompletions = games.reduce((s, g) => s + g.completions, 0);
  const totalSolves = games.reduce((s, g) => s + g.solves, 0);
  const allScores = games.filter((g) => g.avg_score != null);
  const globalAvgScore = allScores.length
    ? Math.round(allScores.reduce((s, g) => s + (g.avg_score ?? 0), 0) / allScores.length)
    : null;

  const sevenDaysAgo = new Date(`${today}T00:00:00+09:00`);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const sevenKey = sevenDaysAgo.toISOString().slice(0, 10);
  const recentGames = games.filter((g) => g.game_date >= sevenKey);
  const recentPlays = recentGames.reduce((s, g) => s + g.plays, 0);

  return { games, trend, totalPlays, totalCompletions, totalSolves, globalAvgScore, recentPlays };
}

function pct(num: number, denom: number) {
  if (!denom) return "—";
  return `${Math.round((num / denom) * 100)}%`;
}

function shortDate(dateStr: string) {
  try {
    return new Intl.DateTimeFormat("en-GB", {
      weekday: "short", day: "2-digit", month: "short", timeZone: "Asia/Seoul",
    }).format(new Date(`${dateStr}T12:00:00+09:00`)).toUpperCase();
  } catch { return dateStr; }
}

export default async function AnalyticsPage() {
  const { games, trend, totalPlays, totalCompletions, totalSolves, globalAvgScore, recentPlays } =
    await getAnalytics();

  const maxTrend = Math.max(...trend.map((t) => t.plays), 1);

  // Hardest: lowest solve rate among games with ≥1 play
  const withPlays = games.filter((g) => g.plays > 0);
  const hardest = [...withPlays]
    .sort((a, b) => (a.solves / Math.max(a.completions, 1)) - (b.solves / Math.max(b.completions, 1)))
    .slice(0, 3);

  return (
    <>
      <div className="admin-title">
        <div>
          <div className="eyebrow">INSIGHT</div>
          <h1>Analytics</h1>
          <p className="muted">Play counts, solve rates, and per-puzzle breakdown.</p>
        </div>
      </div>

      {/* ── Overview ── */}
      <div className="admin-grid" style={{ marginBottom: 40 }}>
        <div className="metric">
          <span className="muted">Total Plays</span>
          <b>{totalPlays}</b>
          <small>{recentPlays} in last 7 days</small>
        </div>
        <div className="metric">
          <span className="muted">Completion Rate</span>
          <b>{pct(totalCompletions, totalPlays)}</b>
          <small>{totalCompletions} of {totalPlays} completed</small>
        </div>
        <div className="metric">
          <span className="muted">Solve Rate</span>
          <b>{pct(totalSolves, totalCompletions)}</b>
          <small>{totalSolves} correct of {totalCompletions}</small>
        </div>
        <div className="metric">
          <span className="muted">Avg Score</span>
          <b>{globalAvgScore ?? "—"}</b>
          <small>across solved games</small>
        </div>
      </div>

      {/* ── Daily trend ── */}
      <h2 className="analytics-section-label">Play trend — last 14 days</h2>
      <div className="analytics-trend-chart">
        {trend.map(({ day, plays }) => (
          <div key={day} className="trend-bar-col">
            <span className="trend-bar-count">{plays > 0 ? plays : ""}</span>
            <div
              className="trend-bar"
              style={{ height: `${Math.round((plays / maxTrend) * 100)}%` }}
              title={`${day}: ${plays} plays`}
            />
            <span className="trend-bar-label">{day.slice(8)}</span>
          </div>
        ))}
      </div>

      {/* ── Hardest puzzles ── */}
      {hardest.length > 0 && (
        <>
          <h2 className="analytics-section-label" style={{ marginTop: 40 }}>Hardest puzzles</h2>
          <div className="admin-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)", marginBottom: 40 }}>
            {hardest.map((g) => (
              <div key={g.id} className="metric">
                <span className="muted">{shortDate(g.game_date)}</span>
                <b style={{ fontSize: "20px" }}>{g.title_en}</b>
                <small>
                  {pct(g.solves, g.completions)} solved · {g.plays} plays
                </small>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── Per-game table ── */}
      <h2 className="analytics-section-label" style={{ marginTop: hardest.length ? 0 : 40 }}>
        Per-puzzle breakdown
      </h2>
      <div style={{ overflowX: "auto" }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Drama</th>
              <th>Plays</th>
              <th>Unique players</th>
              <th>Completion</th>
              <th>Solve rate</th>
              <th>Avg score</th>
              <th>Avg frames</th>
            </tr>
          </thead>
          <tbody>
            {games.length === 0 && (
              <tr>
                <td colSpan={8} style={{ textAlign: "center", color: "var(--muted)", padding: "32px" }}>
                  No published puzzles yet.
                </td>
              </tr>
            )}
            {games.map((g) => (
              <tr key={g.id}>
                <td style={{ whiteSpace: "nowrap" }}>
                  <Link
                    href={`/?date=${g.game_date}`}
                    target="_blank"
                    style={{ color: "var(--ink)", fontWeight: 600, textDecoration: "none", fontSize: "13px" }}
                  >
                    {shortDate(g.game_date)}
                  </Link>
                </td>
                <td style={{ maxWidth: 200 }}>{g.title_en}</td>
                <td>
                  <strong>{g.plays}</strong>
                </td>
                <td>{g.unique_players || "—"}</td>
                <td>
                  <span style={{ color: g.plays ? "var(--ink)" : "var(--muted)" }}>
                    {pct(g.completions, g.plays)}
                  </span>
                </td>
                <td>
                  <span
                    style={{
                      color:
                        g.completions === 0 ? "var(--muted)"
                        : g.solves / g.completions >= 0.6 ? "var(--green)"
                        : g.solves / g.completions < 0.3 ? "#DC2626"
                        : "var(--ink)",
                    }}
                  >
                    {pct(g.solves, g.completions)}
                  </span>
                </td>
                <td>{g.avg_score ?? "—"}</td>
                <td>{g.avg_frames != null ? `${g.avg_frames} / 5` : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
