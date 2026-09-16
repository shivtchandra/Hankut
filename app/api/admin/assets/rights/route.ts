import { NextRequest, NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-auth";
import { createSupabaseAdmin } from "@/lib/supabase/admin";

const VALID_STATUSES = ["approved", "rejected", "unknown", "review_required"];

export async function PATCH(req: NextRequest) {
  const { ok, user } = await requireAdminApi();
  if (!ok) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { id, rightsStatus } = body;

  if (!id || !VALID_STATUSES.includes(rightsStatus)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const db = await createSupabaseAdmin();

  const { error } = await db
    .from("assets")
    .update({ rights_status: rightsStatus, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await db.from("admin_activity").insert({
    action: "asset.rights_update",
    entity_type: "asset",
    entity_id: id,
    after_data: { rights_status: rightsStatus },
    metadata: { actor: user?.email },
  });

  return NextResponse.json({ ok: true });
}
