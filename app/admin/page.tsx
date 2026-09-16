import Link from "next/link";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { seoulDate } from "@/lib/game/today";
import {
  IconScene,
  IconMusic,
  IconCalendar,
  IconPeople,
  IconLock,
  IconTrophy,
} from "@/components/icons/Icons";

async function count(table: string) {
  try {
    const db = await createSupabaseAdmin();
    const { count: n } = await db.from(table).select("*", { count: "exact", head: true });
    return n ?? 0;
  } catch {
    return 0;
  }
}

export default async function AdminHome() {
  const [entities, dramas, scenes, assets] = await Promise.all([
    count("entities"),
    count("dramas"),
    count("scenes"),
    count("scene_assets"),
  ]);

  let todayStatus = "No puzzle";
  let tomorrowStatus = "No puzzle";
  let next7 = 0;
  let healthIssues = 0;
  let readyScenes = 0;

  try {
    const db = await createSupabaseAdmin();
    const today = seoulDate();
    const tomorrowDate = new Date(`${today}T12:00:00+09:00`);
    tomorrowDate.setDate(tomorrowDate.getDate() + 1);
    const tomorrow = seoulDate(tomorrowDate);
    const end = new Date(`${today}T12:00:00+09:00`);
    end.setDate(end.getDate() + 7);

    const { data: todayRow } = await db.from("daily_games").select("status").eq("game_date", today).maybeSingle();
    todayStatus = todayRow?.status ?? "No puzzle";

    const { data: tomorrowRow } = await db.from("daily_games").select("status").eq("game_date", tomorrow).maybeSingle();
    tomorrowStatus = tomorrowRow?.status ?? "No puzzle";

    const { count: c7 } = await db
      .from("daily_games")
      .select("*", { count: "exact", head: true })
      .gte("game_date", today)
      .lt("game_date", seoulDate(end));
    next7 = c7 ?? 0;

    const { data: health } = await db.from("content_health").select("issue");
    healthIssues = health?.filter((row) => row.issue !== "healthy").length ?? 0;

    const { data: sceneRows } = await db.from("scenes").select("id, scene_assets(id)");
    readyScenes = (sceneRows ?? []).filter((s: any) => (s.scene_assets?.length ?? 0) >= 5).length;
  } catch {
    // demo fallback
  }

  const statusColor = (s: string) =>
    s === "published" ? "var(--green)" : s === "scheduled" ? "#2563EB" : "var(--muted)";

  return (
    <>
      <div className="admin-title">
        <div>
          <div className="eyebrow">COMMAND CENTER</div>
          <h1>Content &amp; Daily Schedule Hub</h1>
          <p className="muted">
            Manage Korean media entities, scene puzzles, audio tracks, and daily schedule sets.
          </p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <Link className="secondary" href="/admin/daily">
            Schedule Today&apos;s 5
          </Link>
          <Link className="primary" href="/admin/scenes">
            Scene Studio
          </Link>
        </div>
      </div>

      <h2
        style={{
          fontSize: "11px",
          fontFamily: "'DM Mono', monospace",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "var(--muted)",
          marginBottom: "14px",
        }}
      >
        Publishing Pipeline &amp; Readiness
      </h2>

      <div className="admin-stat-grid" style={{ marginBottom: "36px" }}>
        <div className="admin-stat-card">
          <span className="stat-label">Today Status</span>
          <strong className="stat-value" style={{ color: statusColor(todayStatus), fontSize: "22px" }}>
            {todayStatus}
          </strong>
          <span className="stat-sub">Live game set</span>
        </div>

        <div className="admin-stat-card">
          <span className="stat-label">Tomorrow Status</span>
          <strong className="stat-value" style={{ color: statusColor(tomorrowStatus), fontSize: "22px" }}>
            {tomorrowStatus}
          </strong>
          <span className="stat-sub">Pipeline readiness</span>
        </div>

        <div className="admin-stat-card">
          <span className="stat-label">7-Day Coverage</span>
          <strong className="stat-value">
            {next7}
            <span style={{ fontSize: "16px", fontWeight: 400 }}> / 7 days</span>
          </strong>
          <span className="stat-sub">Scheduled or published</span>
        </div>

        <div className="admin-stat-card">
          <span className="stat-label">Ready Scenes</span>
          <strong className="stat-value" style={{ color: "var(--green)" }}>
            {readyScenes}
          </strong>
          <span className="stat-sub">Full 5/5 frames uploaded</span>
        </div>
      </div>

      <h2
        style={{
          fontSize: "11px",
          fontFamily: "'DM Mono', monospace",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "var(--muted)",
          marginBottom: "14px",
        }}
      >
        Content Graph &amp; Assets
      </h2>

      <div className="admin-stat-grid" style={{ marginBottom: "40px" }}>
        <div className="admin-stat-card">
          <span className="stat-label">Entities Graph</span>
          <strong className="stat-value">{entities}</strong>
          <span className="stat-sub">Canonical items</span>
        </div>

        <div className="admin-stat-card">
          <span className="stat-label">Dramas</span>
          <strong className="stat-value">{dramas}</strong>
          <span className="stat-sub">Titles in archive</span>
        </div>

        <div className="admin-stat-card">
          <span className="stat-label">Scene Puzzles</span>
          <strong className="stat-value">{scenes}</strong>
          <span className="stat-sub">Visual puzzles</span>
        </div>

        <div className="admin-stat-card">
          <span className="stat-label">Media Files</span>
          <strong className="stat-value">{assets}</strong>
          <span className="stat-sub">Uploaded screenshots</span>
        </div>
      </div>

      <h2
        style={{
          fontSize: "11px",
          fontFamily: "'DM Mono', monospace",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "var(--muted)",
          marginBottom: "14px",
        }}
      >
        Quick Actions &amp; Control
      </h2>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "12px" }}>
        {[
          { href: "/admin/scenes", label: "Scene Studio", desc: "Attach 5 frames", Icon: IconScene },
          { href: "/admin/dramas", label: "Dramas Hub", desc: "Posters & Cast", Icon: IconTrophy },
          { href: "/admin/daily", label: "Today's Five Builder", desc: "Set daily games", Icon: IconCalendar },
          { href: "/admin/entities", label: "Entities Graph", desc: "Manage graph", Icon: IconPeople },
          { href: "/admin/rights", label: "Rights Queue", desc: "Clear media rights", Icon: IconLock },
          { href: "/admin/music", label: "Music / OST", desc: "Audio clip engine", Icon: IconMusic },
        ].map((a) => (
          <Link
            key={a.href}
            href={a.href}
            className="admin-card"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              textDecoration: "none",
              padding: "16px 18px",
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "var(--radius-sm)",
                background: "var(--paper-soft)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--ink)",
                flexShrink: 0,
              }}
            >
              <a.Icon size={20} />
            </div>

            <div>
              <strong style={{ fontSize: "14px", display: "block", color: "var(--ink)" }}>{a.label}</strong>
              <span className="muted" style={{ fontSize: "12px" }}>{a.desc}</span>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
