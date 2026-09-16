import { listEntities, createEntity } from "@/app/admin/entities/actions";
import { revalidatePath } from "next/cache";
import Link from "next/link";

export default async function AdminMoviesPage() {
  let rows: Awaited<ReturnType<typeof listEntities>>["entities"] = [];
  let total = 0;
  try {
    const result = await listEntities({ type: "movie", limit: 100 });
    rows = result.entities;
    total = result.total;
  } catch {
    rows = [];
  }

  return (
    <>
      <div className="admin-title">
        <div>
          <div className="eyebrow">CONTENT</div>
          <h1>Movies</h1>
          <p className="muted">{total} titles in the archive.</p>
        </div>
      </div>

      <div className="admin-card" style={{ marginBottom: 28 }}>
        <h3 style={{ margin: "0 0 16px", fontSize: 13, fontFamily: "'DM Mono', monospace", letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--muted)" }}>
          Add Movie
        </h3>
        <form
          action={async (fd) => {
            "use server";
            const titleKr = fd.get("titleKr") as string;
            const titleEn = fd.get("titleEn") as string;
            const year = Number(fd.get("year") ?? 0);
            const network = fd.get("network") as string;
            if (!titleKr) return;
            const result = await createEntity({
              type: "movie",
              titleKr,
              titleEn: titleEn || titleKr,
              aliases: [],
              metadata: { year, network },
            });
            if ("error" in result) {
              console.error("[createEntity]", result.error);
            }
            revalidatePath("/admin/movies");
          }}
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr 120px 200px auto", gap: 10, alignItems: "end" }}
        >
          <label style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 12, color: "var(--muted)" }}>
            Korean Title *
            <input name="titleKr" required placeholder="기생충" style={{ padding: "8px 10px", border: "1px solid var(--line)", borderRadius: "var(--radius-sm)", fontSize: 14 }} />
          </label>
          <label style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 12, color: "var(--muted)" }}>
            English Title
            <input name="titleEn" placeholder="Parasite" style={{ padding: "8px 10px", border: "1px solid var(--line)", borderRadius: "var(--radius-sm)", fontSize: 14 }} />
          </label>
          <label style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 12, color: "var(--muted)" }}>
            Year
            <input name="year" type="number" placeholder="2019" style={{ padding: "8px 10px", border: "1px solid var(--line)", borderRadius: "var(--radius-sm)", fontSize: 14 }} />
          </label>
          <label style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 12, color: "var(--muted)" }}>
            Studio / Distributor
            <input name="network" placeholder="CJ ENM" style={{ padding: "8px 10px", border: "1px solid var(--line)", borderRadius: "var(--radius-sm)", fontSize: 14 }} />
          </label>
          <button type="submit" className="primary" style={{ alignSelf: "end" }}>Save</button>
        </form>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Year</th>
            <th>Studio</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr><td colSpan={5} style={{ textAlign: "center", color: "var(--muted)", padding: 28 }}>No movies yet — add one above.</td></tr>
          ) : rows.map((m) => (
            <tr key={m.id}>
              <td>
                <strong style={{ display: "block" }}>{m.titleKr}</strong>
                <span style={{ color: "var(--muted)", fontSize: 12, fontFamily: "'DM Mono', monospace" }}>{m.titleEn}</span>
              </td>
              <td>{(m.metadata as Record<string, unknown>)?.year as string ?? "—"}</td>
              <td>{(m.metadata as Record<string, unknown>)?.network as string ?? "—"}</td>
              <td><span className="tag">{m.status}</span></td>
              <td><Link href={`/admin/entities/${m.id}`} style={{ fontSize: 12, color: "var(--accent)" }}>Edit</Link></td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
