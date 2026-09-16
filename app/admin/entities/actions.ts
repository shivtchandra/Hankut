"use server";

import { requireAdmin } from "@/lib/admin-auth";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import type { EntityType } from "@/types/game";

export type EntityRow = {
  id: string;
  type: EntityType;
  titleKr: string;
  titleEn: string;
  aliases: string[];
  slug: string | null;
  description: string | null;
  status: string;
  metadata: Record<string, unknown>;
  createdAt: string;
};

export async function listEntities({
  type,
  status,
  search,
  page = 0,
  limit = 50,
}: {
  type?: EntityType;
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
} = {}): Promise<{ entities: EntityRow[]; total: number }> {
  await requireAdmin();
  const db = await createSupabaseAdmin();

  let query = db
    .from("entities")
    .select("id, type, title_kr, title_en, aliases, slug, description, status, metadata, created_at", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(page * limit, (page + 1) * limit - 1);

  if (type) query = query.eq("type", type);
  if (status) query = query.eq("status", status);
  if (search) {
    query = query.or(
      `title_kr.ilike.%${search}%,title_en.ilike.%${search}%`,
    );
  }

  const { data, count, error } = await query;

  if (error || !data) return { entities: [], total: 0 };

  return {
    entities: data.map((row) => ({
      id: row.id,
      type: row.type as EntityType,
      titleKr: row.title_kr,
      titleEn: row.title_en,
      aliases: row.aliases ?? [],
      slug: row.slug,
      description: row.description,
      status: row.status,
      metadata: (row.metadata as Record<string, unknown>) ?? {},
      createdAt: row.created_at,
    })),
    total: count ?? 0,
  };
}

export async function createEntity(data: {
  type: EntityType;
  titleKr: string;
  titleEn: string;
  aliases?: string[];
  description?: string;
  metadata?: Record<string, unknown>;
  status?: string;
}): Promise<{ id: string } | { error: string }> {
  const { user } = await requireAdmin();
  const db = await createSupabaseAdmin();

  const slug = data.titleEn
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  const { data: row, error } = await db
    .from("entities")
    .insert({
      type: data.type,
      title_kr: data.titleKr,
      title_en: data.titleEn,
      aliases: data.aliases ?? [data.titleKr, data.titleEn],
      description: data.description ?? null,
      metadata: data.metadata ?? {},
      status: data.status ?? "draft",
      slug,
    })
    .select("id")
    .single();

  if (error || !row) return { error: error?.message ?? "Failed to create entity" };

  await db.from("admin_activity").insert({
    action: "entity.create",
    entity_type: "entity",
    entity_id: row.id,
    after_data: { type: data.type, titleKr: data.titleKr, titleEn: data.titleEn },
    metadata: { actor: user.email },
  });

  return { id: row.id };
}

export async function updateEntity(
  id: string,
  data: Partial<{
    titleKr: string;
    titleEn: string;
    aliases: string[];
    description: string;
    metadata: Record<string, unknown>;
    status: string;
  }>,
): Promise<{ ok: boolean } | { error: string }> {
  const { user } = await requireAdmin();
  const db = await createSupabaseAdmin();

  const updates: Record<string, unknown> = {};
  if (data.titleKr !== undefined) updates.title_kr = data.titleKr;
  if (data.titleEn !== undefined) updates.title_en = data.titleEn;
  if (data.aliases !== undefined) updates.aliases = data.aliases;
  if (data.description !== undefined) updates.description = data.description;
  if (data.metadata !== undefined) updates.metadata = data.metadata;
  if (data.status !== undefined) updates.status = data.status;
  updates.updated_at = new Date().toISOString();

  const { error } = await db.from("entities").update(updates).eq("id", id);

  if (error) return { error: error.message };

  await db.from("admin_activity").insert({
    action: "entity.update",
    entity_type: "entity",
    entity_id: id,
    after_data: updates,
    metadata: { actor: user.email },
  });

  return { ok: true };
}

export async function archiveEntity(id: string): Promise<{ ok: boolean } | { error: string }> {
  return updateEntity(id, { status: "archived" });
}

export async function addEntityRelation(data: {
  sourceEntityId: string;
  targetEntityId: string;
  relationType: string;
  confidence?: number;
  notes?: string;
}): Promise<{ ok: boolean } | { error: string }> {
  await requireAdmin();
  const db = await createSupabaseAdmin();

  const { error } = await db.from("entity_relations").insert({
    source_entity_id: data.sourceEntityId,
    target_entity_id: data.targetEntityId,
    relation_type: data.relationType,
    confidence: data.confidence ?? 1.0,
    notes: data.notes ?? null,
  });

  if (error) return { error: error.message };
  return { ok: true };
}
