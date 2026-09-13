export default function AnalyticsPage() {
  return (
    <>
      <div className="admin-title">
        <div>
          <div className="eyebrow">INSIGHT</div>
          <h1>Analytics</h1>
          <p className="muted">
            Plays, completion rate, and average guesses will land here once
            `plays` / `guesses` are wired from the public game.
          </p>
        </div>
      </div>
      <div className="admin-grid">
        <div className="metric">
          <span className="muted">Plays</span>
          <b>—</b>
        </div>
        <div className="metric">
          <span className="muted">Completed</span>
          <b>—</b>
        </div>
        <div className="metric">
          <span className="muted">Avg guesses</span>
          <b>—</b>
        </div>
        <div className="metric">
          <span className="muted">Hints used</span>
          <b>—</b>
        </div>
      </div>
    </>
  );
}
