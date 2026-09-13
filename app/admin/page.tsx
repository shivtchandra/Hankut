import Link from "next/link";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { seoulDate } from "@/lib/game/today";

async function count(table: string) {
  try {
    const db = await createSupabaseAdmin();
    const { count } = await db
      .from(table)
      .select("*", { count: "exact", head: true });
    return count ?? 0;
  } catch {
    return 0;
  }
}

export default async function AdminHome() {
  const [dramas, scenes, clues, assets] = await Promise.all([
    count("dramas"),
    count("scenes"),
    count("clues"),
    count("scene_assets"),
  ]);

  let todayStatus = "No puzzle";
  let tomorrowStatus = "No puzzle";
  let next7 = 0;
  let healthIssues = 0;

  try {
    const db = await createSupabaseAdmin();
    const today = seoulDate();
    const tomorrowDate = new Date(`${today}T12:00:00+09:00`);
    tomorrowDate.setDate(tomorrowDate.getDate() + 1);
    const tomorrow = seoulDate(tomorrowDate);

    const { data: todayRow } = await db
      .from("daily_games")
      .select("status")
      .eq("game_date", today)
      .maybeSingle();
    todayStatus = todayRow?.status ?? "No puzzle";

    const { data: tomorrowRow } = await db
      .from("daily_games")
      .select("status")
      .eq("game_date", tomorrow)
      .maybeSingle();
    tomorrowStatus = tomorrowRow?.status ?? "No puzzle";

    const end = new Date(`${today}T12:00:00+09:00`);
    end.setDate(end.getDate() + 7);
    const { count } = await db
      .from("daily_games")
      .select("*", { count: "exact", head: true })
      .gte("game_date", today)
      .lt("game_date", seoulDate(end));
    next7 = count ?? 0;

    const { data: health } = await db.from("content_health").select("issue");
    healthIssues = health?.filter((row) => row.issue !== "healthy").length ?? 0;
  } catch {
    // demo / unconfigured
  }

  return (
    <>
      <div className="admin-title">
        <div>
          <div className="eyebrow">OVERVIEW</div>
          <h1>Dashboard</h1>
        </div>
        <Link className="primary" href="/admin/scenes">
          Open Scene Studio
        </Link>
      </div>

      <div className="admin-grid" style={{ marginBottom: 28 }}>
        <div className="metric">
          <span className="muted">Today</span>
          <b>{todayStatus}</b>
          <small>Publishing status</small>
        </div>
        <div className="metric">
          <span className="muted">Tomorrow</span>
          <b>{tomorrowStatus}</b>
          <small>Pipeline readiness</small>
        </div>
        <div className="metric">
          <span className="muted">Next 7 days</span>
          <b>
            {next7} / 7
          </b>
          <small>Scheduled or published</small>
        </div>
        <div className="metric">
          <span className="muted">Content health</span>
          <b>{healthIssues}</b>
          <small>
            <Link href="/admin/content-health">Scenes need attention</Link>
          </small>
        </div>
      </div>

      <div className="admin-grid">
        <div className="metric">
          <span className="muted">Dramas</span>
          <b>{dramas}</b>
        </div>
        <div className="metric">
          <span className="muted">Scenes</span>
          <b>{scenes}</b>
        </div>
        <div className="metric">
          <span className="muted">Clues</span>
          <b>{clues}</b>
        </div>
        <div className="metric">
          <span className="muted">Assets</span>
          <b>{assets}</b>
        </div>
      </div>
    </>
  );
}
