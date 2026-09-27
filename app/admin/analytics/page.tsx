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

  // Query daily_games with plays
  const { data: dailyGamesData } = await db
    .from("daily_games")
    .select(`
      id, game_date,
      scenes ( dramas ( title_en, title_kr ) ),
      plays ( id, completed_at, solved, score, attempts, steps_revealed, guest_id, created_at, started_at )
    `)
    .in("status", ["published", "scheduled"])
    .order("game_date", { ascending: false })
    .limit(60);

  // Also query daily_sets with plays
  const { data: dailySetsData } = await db
    .from("daily_sets")
    .select(`
      id, game_date, title,
      items:daily_set_items (
        id, position,
        puzzle:puzzles ( id, type, title, metadata ),
        plays:plays ( id, completed_at, solved, score, attempts, steps_revealed, guest_id, created_at, started_at )
      )
    `)
    .in("status", ["published", "scheduled"])
    .order("game_date", { ascending: false })
    .limit(60);

  const gameMap = new Map<string, GameRow>();

  for (const row of dailyGamesData ?? []) {
    const rawScene: any = (row as any).scenes;
    const scene = Array.isArray(rawScene) ? rawScene[0] : rawScene;
    const drama = Array.isArray(scene?.dramas) ? scene.dramas[0] : scene?.dramas;
    const allPlays: any[] = Array.isArray(row.plays) ? row.plays : [];
    const completedPlays = allPlays.filter((p: any) => p.completed_at || p.solved || (p.attempts && p.attempts >= 5));
    const solvedPlays = allPlays.filter((p: any) => Boolean(p.solved));
    const scores = solvedPlays.map((p: any) => p.score).filter((s: any) => typeof s === "number" && s > 0);
    const frames = completedPlays.map((p: any) => p.steps_revealed).filter((v: any) => v != null).map((v: number) => Math.max(v, 1));
    const guestIds = new Set(allPlays.map((p: any) => p.guest_id).filter(Boolean));

    gameMap.set(row.game_date, {
      id: row.id,
      game_date: row.game_date,
      title_en: drama?.title_en || drama?.title_kr || "Scene Puzzle",
      plays: allPlays.length,
      completions: completedPlays.length,
      solves: solvedPlays.length,
      avg_score: scores.length ? Math.round(scores.reduce((a: number, b: number) => a + b, 0) / scores.length) : null,
      avg_frames: frames.length ? Math.round((frames.reduce((a: number, b: number) => a + b, 0) / frames.length) * 10) / 10 : null,
      unique_players: guestIds.size,
    });
  }

  // Merge daily sets if not already in gameMap or if daily set has more plays
  for (const st of dailySetsData ?? []) {
    const items = (st.items ?? []) as Array<{
      plays?: any[];
      puzzle?: { id: string; type: string; title: string; metadata?: Record<string, unknown> } | Array<{ id: string; type: string; title: string; metadata?: Record<string, unknown> }>;
    }>;

    const allPlays: any[] = items.flatMap((it) => (Array.isArray(it.plays) ? it.plays : []));
    if (allPlays.length === 0 && gameMap.has(st.game_date)) continue;

    const songItem = items.find((it) => {
      const p = Array.isArray(it.puzzle) ? it.puzzle[0] : it.puzzle;
      return p?.type === "song";
    });
    const chosen = songItem || items[0];
    const p = Array.isArray(chosen?.puzzle) ? chosen.puzzle[0] : chosen?.puzzle;
    const meta = (p?.metadata ?? {}) as Record<string, unknown>;
    const title = p?.title ? `${p.title}${meta.artist_en ? ` (${meta.artist_en})` : ""}` : st.title || "Daily Set";

    const completedPlays = allPlays.filter((pl: any) => pl.completed_at || pl.solved || (pl.attempts && pl.attempts >= 5));
    const solvedPlays = allPlays.filter((pl: any) => Boolean(pl.solved));
    const scores = solvedPlays.map((pl: any) => pl.score).filter((s: any) => typeof s === "number" && s > 0);
    const frames = completedPlays.map((pl: any) => pl.steps_revealed).filter((v: any) => v != null).map((v: number) => Math.max(v, 1));
    const guestIds = new Set(allPlays.map((pl: any) => pl.guest_id).filter(Boolean));

    const existing = gameMap.get(st.game_date);
    if (!existing) {
      gameMap.set(st.game_date, {
        id: st.id,
        game_date: st.game_date,
        title_en: title,
        plays: allPlays.length,
        completions: completedPlays.length,
        solves: solvedPlays.length,
        avg_score: scores.length ? Math.round(scores.reduce((a: number, b: number) => a + b, 0) / scores.length) : null,
        avg_frames: frames.length ? Math.round((frames.reduce((a: number, b: number) => a + b, 0) / frames.length) * 10) / 10 : null,
        unique_players: guestIds.size,
      });
    } else if (allPlays.length > 0) {
      existing.plays += allPlays.length;
      existing.completions += completedPlays.length;
      existing.solves += solvedPlays.length;
      existing.unique_players = Math.max(existing.unique_players, guestIds.size);
    }
  }

  const games: GameRow[] = Array.from(gameMap.values()).sort((a, b) => b.game_date.localeCompare(a.game_date));

  // Daily trend: last 14 days
  const fourteenDaysAgoIso = new Date(Date.now() - 14 * 86400000).toISOString();
  const { data: trendRaw } = await db
    .from("plays")
    .select("created_at, started_at")
    .or(`created_at.gte.${fourteenDaysAgoIso},started_at.gte.${fourteenDaysAgoIso}`);

  const trendMap: Record<string, number> = {};
  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    trendMap[key] = 0;
  }
  for (const row of trendRaw ?? []) {
    const dateStr = (row as any).started_at || (row as any).created_at;
    const key = dateStr?.slice(0, 10);
    if (key && key in trendMap) trendMap[key]++;
  }
  const trend: TrendRow[] = Object.entries(trendMap).map(([day, plays]) => ({ day, plays }));

  // Totals
  const totalPlays = games.reduce((s, g) => s + g.plays, 0);
  const totalCompletions = games.reduce((s, g) => s + g.completions, 0);
  const totalSolves = games.reduce((s, g) => s + g.solves, 0);
  const solvedGames = games.filter((g) => g.solves > 0 && g.avg_score != null);
  const globalAvgScore = solvedGames.length
    ? Math.round(solvedGames.reduce((s, g) => s + (g.avg_score ?? 0), 0) / solvedGames.length)
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
