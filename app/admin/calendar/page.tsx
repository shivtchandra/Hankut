import { listDailyGames } from "../daily/actions";
import { seoulDate } from "@/lib/game/today";

export default async function CalendarPage() {
  const today = seoulDate();
  const monthPrefix = today.slice(0, 7);
  let rows: Awaited<ReturnType<typeof listDailyGames>> = [];

  try {
    rows = await listDailyGames(monthPrefix);
  } catch {
    rows = [];
  }

  const byDate = new Map(
    rows.map((row) => [row.game_date, row] as const),
  );

  const [year, month] = monthPrefix.split("-").map(Number);
  const first = new Date(Date.UTC(year, month - 1, 1));
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const startPad = (first.getUTCDay() + 6) % 7; // Monday-first

  const cells: ({ day: number; iso: string } | null)[] = [
    ...Array.from({ length: startPad }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => {
      const day = i + 1;
      const iso = `${monthPrefix}-${String(day).padStart(2, "0")}`;
      return { day, iso };
    }),
  ];

  return (
    <>
      <div className="admin-title">
        <div>
          <div className="eyebrow">PUBLISH</div>
          <h1>
            {first.toLocaleString("en", { month: "long", year: "numeric" })}
          </h1>
        </div>
      </div>

      <div
        className="calendar-grid"
        style={{ marginBottom: 10, color: "var(--muted)", fontSize: 11 }}
      >
        {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map((d) => (
          <div key={d} style={{ padding: "0 10px" }}>
            {d}
          </div>
        ))}
      </div>

      <div className="calendar-grid">
        {cells.map((cell, index) => {
          if (!cell) return <div key={`pad-${index}`} />;
          const row = byDate.get(cell.iso);
          const scene = Array.isArray(row?.scene) ? row?.scene[0] : row?.scene;
          const drama = Array.isArray(scene?.drama)
            ? scene?.drama[0]
            : scene?.drama;

          return (
            <div
              key={cell.iso}
              className={
                cell.iso === today ? "calendar-cell today" : "calendar-cell"
              }
            >
              <div className="day">{cell.day}</div>
              {row ? (
                <>
                  <strong>{drama?.title_kr ?? scene?.scene_code}</strong>
                  <span className="tag">{row.status}</span>
                </>
              ) : (
                <span className="muted" style={{ fontSize: 12 }}>
                  empty
                </span>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
