import { requireAdmin } from "@/lib/admin-auth";
import { listPuzzles } from "@/app/admin/puzzles/actions";

export default async function AdminPeoplePage() {
  await requireAdmin();
  const { puzzles, total } = await listPuzzles({ type: "people", limit: 50 });

  return (
    <div className="admin-page">
      <div className="admin-title">
        <div>
          <span className="eyebrow">CONTENT</span>
          <h1>People Puzzles</h1>
          <p className="muted">Actor, singer &amp; entertainer silhouette quizzes ({total})</p>
        </div>
        <a href="/admin/people/new" className="primary">
          + New people puzzle
        </a>
      </div>

      <div
        style={{
          background: "var(--paper)",
          borderRadius: "var(--radius-md)",
          border: "1px solid var(--border)",
          marginTop: "20px",
          overflow: "hidden",
        }}
      >
        {puzzles.length === 0 ? (
          <div style={{ padding: "40px", textAlign: "center", color: "var(--muted)" }}>
            No puzzles — create a new people puzzle
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Entity</th>
                <th>Status</th>
                <th>Difficulty</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {puzzles.map((p) => (
                <tr key={p.id}>
                  <td>
                    <strong>{p.title}</strong>
                  </td>
                  <td style={{ fontSize: "13px", color: "var(--muted)" }}>
                    {p.entityTitle ?? "—"}
                  </td>
                  <td>
                    <span className="tag">{p.status}</span>
                  </td>
                  <td style={{ fontSize: "13px" }}>{p.difficulty}</td>
                  <td style={{ fontSize: "12px", color: "var(--muted)" }}>
                    {p.createdAt
                      ? new Date(p.createdAt).toLocaleDateString("en-US")
                      : "—"}
                  </td>
                  <td>
                    <a
                      href={`/admin/people/${p.id}`}
                      className="secondary"
                      style={{
                        padding: "4px 8px",
                        fontSize: "12px",
                        display: "inline-block",
                      }}
                    >
                      Edit
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
