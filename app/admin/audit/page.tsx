import { requireAdmin } from "@/lib/admin-auth";
import { createSupabaseAdmin } from "@/lib/supabase/admin";

const ACTION_COLORS: Record<string, string> = {
  "puzzle.publish": "#dcfce7",
  "puzzle.create": "#dbeafe",
  "entity.create": "#dbeafe",
  "entity.update": "#fef9c3",
  "entity.archive": "#fee2e2",
  "asset.rights_update": "#f3e8ff",
};

export default async function AuditLogPage({
  searchParams,
}: {
  searchParams: Promise<{ action?: string; page?: string }>;
}) {
  await requireAdmin();
  const sp = await searchParams;
  const page = parseInt(sp.page ?? "0", 10);
  const limit = 50;

  const db = await createSupabaseAdmin();

  let query = db
    .from("admin_activity")
    .select("id, action, entity_type, entity_id, after_data, metadata, created_at", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(page * limit, (page + 1) * limit - 1);

  if (sp.action) query = query.eq("action", sp.action);

  const { data: rows, count } = await query;

  return (
    <div className="admin-page">
      <div className="admin-title">
        <div>
          <span className="eyebrow">SYSTEM</span>
          <h1>Audit Log</h1>
          <p className="muted">{count ?? 0} records</p>
        </div>
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
        <table className="admin-table">
          <thead>
            <tr>
              <th>Time</th>
              <th>Action</th>
              <th>Type</th>
              <th>ID</th>
              <th>Metadata</th>
            </tr>
          </thead>
          <tbody>
            {(rows ?? []).length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: "center", padding: "40px", color: "var(--muted)" }}>
                  No records
                </td>
              </tr>
            ) : (
              (rows ?? []).map((row) => (
                <tr key={row.id}>
                  <td style={{ fontSize: "12px", color: "var(--muted)", whiteSpace: "nowrap" }}>
                    {new Date(row.created_at).toLocaleString("en-US")}
                  </td>
                  <td>
                    <span
                      className="tag"
                      style={{
                        background: ACTION_COLORS[row.action] ?? "var(--paper-soft)",
                        color: "var(--ink)",
                      }}
                    >
                      {row.action}
                    </span>
                  </td>
                  <td style={{ fontSize: "12px" }}>{row.entity_type ?? "—"}</td>
                  <td style={{ fontSize: "11px", color: "var(--muted)", fontFamily: "monospace" }}>
                    {row.entity_id ? row.entity_id.slice(0, 8) + "…" : "—"}
                  </td>
                  <td style={{ fontSize: "11px", color: "var(--muted)" }}>
                    {row.metadata
                      ? (row.metadata as Record<string, unknown>).actor?.toString() ?? ""
                      : ""}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div style={{ display: "flex", gap: "8px", padding: "12px 16px", justifyContent: "flex-end" }}>
          {page > 0 && (
            <a href={`/admin/audit?page=${page - 1}`} className="secondary" style={{ padding: "6px 12px", fontSize: "13px" }}>
              ← Prev
            </a>
          )}
          {(rows?.length ?? 0) === limit && (
            <a href={`/admin/audit?page=${page + 1}`} className="secondary" style={{ padding: "6px 12px", fontSize: "13px" }}>
              Next →
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
