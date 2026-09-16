"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin-auth";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { normalize } from "@/lib/game/normalization";

export type PuzzleType =
  | "scene" | "song" | "chosung" | "connections" | "people"
  | "movie" | "place" | "food" | "brand" | "quote" | "timeline" | "object";

export async function createPuzzle({
  type,
  title,
  entityId,
  metadata,
  difficulty = 5,
}: {
  type: PuzzleType;
  title: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
  difficulty?: number;
}): Promise<{ id: string } | { error: string }> {
  const { user } = await requireAdmin();
  const db = await createSupabaseAdmin();

  const { data, error } = await db
    .from("puzzles")
    .insert({
      type,
      title,
      entity_id: entityId ?? null,
      metadata: metadata ?? {},
      difficulty,
      status: "draft",
    })
    .select("id")
    .single();

  if (error || !data) return { error: error?.message ?? "Failed to create puzzle" };

  await db.from("admin_activity").insert({
    action: "puzzle.create",
    entity_type: "puzzle",
    entity_id: data.id,
    after_data: { type, title },
    metadata: { actor: user.email },
  });

  return { id: data.id };
}

export async function savePuzzleSteps(
  puzzleId: string,
  steps: Array<{
    stepNumber: number;
    stepType: string;
    assetUrl?: string;
    textContent?: string;
    metadata?: Record<string, unknown>;
    scorePenalty?: number;
  }>,
): Promise<{ ok: boolean } | { error: string }> {
  await requireAdmin();
  const db = await createSupabaseAdmin();

  await db.from("puzzle_steps").delete().eq("puzzle_id", puzzleId);

  if (steps.length === 0) return { ok: true };

  const rows = steps.map((s) => ({
    puzzle_id: puzzleId,
    step_number: s.stepNumber,
    step_type: s.stepType,
    asset_url: s.assetUrl ?? null,
    text_content: s.textContent ?? null,
    metadata: s.metadata ?? {},
    score_penalty: s.scorePenalty ?? 0,
  }));

  const { error } = await db.from("puzzle_steps").insert(rows);
  if (error) return { error: error.message };
  return { ok: true };
}

export async function savePuzzleClues(
  puzzleId: string,
  clues: Array<{
    clueOrder: number;
    type: string;
    label: string;
    value: string;
    unlockAfterAttempt?: number;
    scorePenalty?: number;
  }>,
): Promise<{ ok: boolean } | { error: string }> {
  await requireAdmin();
  const db = await createSupabaseAdmin();

  await db.from("puzzle_clues").delete().eq("puzzle_id", puzzleId);

  if (clues.length === 0) return { ok: true };

  const rows = clues.map((c) => ({
    puzzle_id: puzzleId,
    clue_order: c.clueOrder,
    type: c.type,
    label: c.label,
    value: c.value,
    unlock_after_attempt: c.unlockAfterAttempt ?? 2,
    score_penalty: c.scorePenalty ?? 10,
  }));

  const { error } = await db.from("puzzle_clues").insert(rows);
  if (error) return { error: error.message };
  return { ok: true };
}

export async function savePuzzleAnswers(
  puzzleId: string,
  answers: Array<{
    answerText: string;
    entityId?: string;
    isPrimary?: boolean;
  }>,
): Promise<{ ok: boolean } | { error: string }> {
  await requireAdmin();
  const db = await createSupabaseAdmin();

  await db.from("puzzle_answers").delete().eq("puzzle_id", puzzleId);

  if (answers.length === 0) return { ok: true };

  const rows = answers.map((a) => ({
    puzzle_id: puzzleId,
    answer_text: a.answerText,
    normalized_answer: normalize(a.answerText),
    entity_id: a.entityId ?? null,
    is_primary: a.isPrimary ?? false,
  }));

  const { error } = await db.from("puzzle_answers").insert(rows);
  if (error) return { error: error.message };
  return { ok: true };
}

export async function publishPuzzle(puzzleId: string): Promise<{ ok: boolean } | { error: string }> {
  const { user } = await requireAdmin();
  const db = await createSupabaseAdmin();

  const { error } = await db
    .from("puzzles")
    .update({ status: "published", updated_at: new Date().toISOString() })
    .eq("id", puzzleId);

  if (error) return { error: error.message };

  await db.from("admin_activity").insert({
    action: "puzzle.publish",
    entity_type: "puzzle",
    entity_id: puzzleId,
    metadata: { actor: user.email },
  });

  revalidatePath("/admin/daily");
  return { ok: true };
}

export async function listPuzzles({
  type,
  status,
  page = 0,
  limit = 50,
}: {
  type?: PuzzleType;
  status?: string;
  page?: number;
  limit?: number;
} = {}) {
  await requireAdmin();
  const db = await createSupabaseAdmin();

  let query = db
    .from("puzzles")
    .select(
      "id, type, title, status, difficulty, entity_id, created_at, entity:entities(title_kr, title_en)",
      { count: "exact" },
    )
    .order("created_at", { ascending: false })
    .range(page * limit, (page + 1) * limit - 1);

  if (type) query = query.eq("type", type);
  if (status) query = query.eq("status", status);

  const { data, count, error } = await query;
  if (error) return { puzzles: [], total: 0 };

  return {
    puzzles: (data ?? []).map((p) => ({
      id: p.id,
      type: p.type as PuzzleType,
      title: p.title,
      status: p.status,
      difficulty: p.difficulty,
      entityId: p.entity_id,
      createdAt: p.created_at,
      entityTitle: (p.entity as null | { title_kr?: string })?.title_kr ?? null,
    })),
    total: count ?? 0,
  };
}
