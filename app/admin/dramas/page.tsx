import Link from "next/link";
import { CreateDramaForm } from "@/components/admin/CreateDramaForm";
import { listDramas } from "./actions";
import { DEMO_DRAMAS } from "@/lib/demo-data";

export default async function DramasPage() {
  let rows: Awaited<ReturnType<typeof listDramas>> = [];
  let source: "supabase" | "demo" = "demo";

  try {
    rows = await listDramas();
    source = "supabase";
  } catch {
    rows = [];
  }

  const demoFallback = source === "demo" || rows.length === 0;

  return (
    <>
      <div className="admin-title">
        <div>
          <div className="eyebrow">CONTENT</div>
          <h1>Dramas</h1>
          <p className="muted">
            {demoFallback
              ? "Showing demo titles until Supabase returns rows."
              : `${rows.length} titles in the archive.`}
          </p>
        </div>
      </div>

      <CreateDramaForm />

      <table className="admin-table" style={{ marginTop: 28 }}>
        <thead>
          <tr>
            <th>Drama</th>
            <th>Year</th>
            <th>Network</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {(demoFallback
            ? DEMO_DRAMAS.map((d) => ({
                id: d.id,
                title_kr: d.titleKr,
                title_en: d.titleEn,
                year: d.year,
                network: d.network,
                status: "demo",
              }))
            : rows
          ).map((d) => (
            <tr key={d.id}>
              <td>
                <b>{d.title_kr}</b>
                <div className="muted">{d.title_en}</div>
              </td>
              <td>{d.year ?? "—"}</td>
              <td>{d.network ?? "—"}</td>
              <td>
                <span className="tag">{d.status}</span>
              </td>
              <td>
                {String(d.id).includes("-") && String(d.id).length > 20 ? (
                  <Link href={`/admin/dramas/${d.id}`}>Open</Link>
                ) : (
                  <span className="muted">demo</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
