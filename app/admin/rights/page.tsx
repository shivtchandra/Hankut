import { requireAdmin } from "@/lib/admin-auth";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { RightsReviewClient } from "./RightsReviewClient";

export default async function RightsReviewPage() {
  await requireAdmin();
  const db = await createSupabaseAdmin();

  const { data: assets } = await db
    .from("assets")
    .select(
      "id, asset_type, storage_key, public_url, mime_type, rights_status, source_url, source_name, rights_notes, created_at",
    )
    .eq("rights_status", "review_required")
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <div className="admin-page">
      <div className="admin-title">
        <div>
          <span className="eyebrow">RIGHTS REVIEW</span>
          <h1>Rights Review</h1>
          <p className="muted">
            {assets?.length ?? 0} assets pending review — approve or reject
          </p>
        </div>
      </div>

      <RightsReviewClient assets={assets ?? []} />
    </div>
  );
}
