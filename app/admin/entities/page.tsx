import { requireAdmin } from "@/lib/admin-auth";
import { listEntities } from "./actions";
import { EntityTable } from "@/components/admin/EntityTable";

export default async function EntitiesManagerPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; status?: string; search?: string; page?: string }>;
}) {
  await requireAdmin();

  const sp = await searchParams;
  const page = parseInt(sp.page ?? "0", 10);
  const { entities, total } = await listEntities({
    type: sp.type as never,
    status: sp.status,
    search: sp.search,
    page,
  });

  return (
    <div className="admin-entities-page">
      <div className="admin-title">
        <div>
          <span className="eyebrow">CONTENT GRAPH</span>
          <h1>Entities Graph</h1>
          <p className="muted">
            Dramas, movies, music, people, places, brands, food — total {total} entities in database
          </p>
        </div>
      </div>

      <EntityTable entities={entities} total={total} currentPage={page} />
    </div>
  );
}
