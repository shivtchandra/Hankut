"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireAdmin } from "@/lib/admin-auth";
import { createSupabaseAdmin } from "@/lib/supabase/admin";

const sceneSchema = z.object({
  dramaId: z.string().uuid(),
  episode: z.number().int().positive(),
  difficulty: z.number().min(0).max(10),
  recognitionScore: z.number().min(0).max(10),
  description: z.string().optional(),
  sceneCode: z.string().min(1).optional(),
});

export async function createScene(input: z.input<typeof sceneSchema>) {
  await requireAdmin();
  const parsed = sceneSchema.parse(input);
  const db = await createSupabaseAdmin();

  const sceneCode =
    parsed.sceneCode ??
    `S${String(parsed.episode).padStart(2, "0")}-${crypto.randomUUID().slice(0, 8)}`;

  const { data, error } = await db
    .from("scenes")
    .insert({
      drama_id: parsed.dramaId,
      episode: parsed.episode,
      difficulty: parsed.difficulty,
      recognition_score: parsed.recognitionScore / 10,
      description: parsed.description ?? null,
      scene_code: sceneCode,
      status: "draft",
    })
    .select()
    .single();

  if (error) throw new Error(error.message);

  revalidatePath(`/admin/dramas/${parsed.dramaId}`);
  revalidatePath("/admin/scenes");
  return data;
}

export async function updateSceneMeta(input: {
  sceneId: string;
  episode: number;
  difficulty: number;
  recognitionScore: number;
  description?: string;
  status?: string;
}) {
  await requireAdmin();
  const db = await createSupabaseAdmin();

  const { data, error } = await db
    .from("scenes")
    .update({
      episode: input.episode,
      difficulty: input.difficulty,
      recognition_score: input.recognitionScore / 10,
      description: input.description ?? null,
      ...(input.status ? { status: input.status } : {}),
    })
    .eq("id", input.sceneId)
    .select()
    .single();

  if (error) throw new Error(error.message);

  // Sync with daily_games and calendar if published
  if (input.status === "published" || input.status === "ready") {
    const match = data.scene_code?.match(/(\d{4})(\d{2})(\d{2})/);
    if (match) {
      const gameDate = `${match[1]}-${match[2]}-${match[3]}`;
      await db.from("daily_games").upsert(
        {
          game_date: gameDate,
          scene_id: data.id,
          difficulty: input.difficulty ?? 5,
          status: "published",
        },
        { onConflict: "game_date" }
      );
    }
  }

  revalidatePath(`/admin/scenes/${input.sceneId}`);
  revalidatePath("/admin/calendar");
  revalidatePath("/admin/daily");
  revalidatePath("/");
  return data;
}

export async function publishSceneForDate(sceneId: string, gameDate: string) {
  await requireAdmin();
  const db = await createSupabaseAdmin();

  const { data: scene, error: sceneErr } = await db
    .from("scenes")
    .select("id, scene_code, episode, difficulty, drama:dramas(title_kr)")
    .eq("id", sceneId)
    .single();

  if (sceneErr || !scene) throw new Error("Scene not found");

  const formattedCode = `DC-${gameDate.replace(/-/g, "")}-${sceneId.slice(0, 4).toUpperCase()}`;

  const { error: updateErr } = await db
    .from("scenes")
    .update({
      status: "published",
      scene_code: formattedCode,
    })
    .eq("id", sceneId);

  if (updateErr) throw new Error(updateErr.message);

  const { error: dailyErr } = await db
    .from("daily_games")
    .upsert(
      {
        game_date: gameDate,
        scene_id: sceneId,
        difficulty: scene.difficulty ?? 5,
        status: "published",
      },
      { onConflict: "game_date" }
    );

  if (dailyErr) throw new Error(dailyErr.message);

  revalidatePath("/admin/calendar");
  revalidatePath("/admin/daily");
  revalidatePath("/admin/scenes");
  revalidatePath("/");

  const dramaTitle = Array.isArray(scene.drama) ? scene.drama[0]?.title_kr : (scene.drama as any)?.title_kr;
  return { ok: true, gameDate, sceneCode: formattedCode, title: dramaTitle ?? formattedCode };
}

export async function attachSceneAsset(input: {
  sceneId: string;
  publicUrl: string;
  storageKey?: string;
  position: number;
  mimeType?: string;
}) {
  await requireAdmin();
  const db = await createSupabaseAdmin();

  const { data, error } = await db
    .from("scene_assets")
    .upsert(
      {
        scene_id: input.sceneId,
        public_url: input.publicUrl,
        asset_key: input.storageKey ?? `external/${input.sceneId}/frame-${input.position}`,
        frame_order: input.position,
        mime_type: input.mimeType ?? null,
        rights_status: "review_required",
      },
      { onConflict: "scene_id,frame_order" },
    )
    .select()
    .single();

  if (error) throw new Error(error.message);
  revalidatePath(`/admin/scenes/${input.sceneId}`);
  return data;
}

export async function saveClues(input: {
  sceneId: string;
  clues: { type: string; value: string; unlockAfter: number; order: number }[];
}) {
  await requireAdmin();
  const db = await createSupabaseAdmin();

  await db.from("clues").delete().eq("scene_id", input.sceneId);

  if (input.clues.length) {
    const { error } = await db.from("clues").insert(
      input.clues.map((clue) => ({
        scene_id: input.sceneId,
        type: clue.type,
        value: clue.value,
        unlock_after: clue.unlockAfter,
        clue_order: clue.order,
      })),
    );
    if (error) throw new Error(error.message);
  }

  revalidatePath(`/admin/scenes/${input.sceneId}`);
  return { ok: true };
}

export async function getSceneStudio(sceneId: string) {
  await requireAdmin();
  const db = await createSupabaseAdmin();

  const { data, error } = await db
    .from("scenes")
    .select(
      `
      id,
      episode,
      difficulty,
      recognition_score,
      description,
      status,
      rights_status,
      scene_code,
      drama:dramas ( id, title_kr, title_en ),
      assets:scene_assets ( id, public_url, frame_order, asset_key ),
      clues ( id, type, value, unlock_after, clue_order )
    `,
    )
    .eq("id", sceneId)
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function listScenes() {
  await requireAdmin();
  const db = await createSupabaseAdmin();
  const { data, error } = await db
    .from("scenes")
    .select(
      "id, scene_code, episode, difficulty, status, rights_status, drama:dramas(title_kr, title_en), assets:scene_assets(id, frame_order)",
    )
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) throw new Error(error.message);
  return data ?? [];
}
