import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-auth";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import type { EntityType } from "@/types/game";

export async function POST(request: Request) {
  const auth = await requireAdminApi();
  if (!auth.ok) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { type, titleKr, titleEn, aliases = [], metadata = {} } = body as {
    type: EntityType;
    titleKr: string;
    titleEn: string;
    aliases: string[];
    metadata: Record<string, unknown>;
  };

  if (!type || !titleKr) {
    return NextResponse.json({ error: "type and titleKr required" }, { status: 400 });
  }

  const db = await createSupabaseAdmin();
  const slug = titleEn.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const { data, error } = await db
    .from("entities")
    .insert({ type, title_kr: titleKr, title_en: titleEn, aliases, slug, metadata, status: "draft" })
    .select("id, type, title_kr, title_en, aliases, slug, description, status, metadata, created_at")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await db.from("admin_activity").insert({
    action: "create_entity",
    entity_type: type,
    entity_id: data.id,
    metadata: { title_kr: titleKr, by: auth.user.email },
  }).maybeSingle();

  return NextResponse.json({
    entity: {
      id: data.id,
      titleKr: data.title_kr,
      titleEn: data.title_en,
      status: data.status,
      metadata: data.metadata ?? {},
    },
  });
}
