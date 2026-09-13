"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireAdmin } from "@/lib/admin-auth";
import { createSupabaseAdmin } from "@/lib/supabase/admin";

const schema = z.object({
  gameDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  sceneId: z.string().uuid(),
  difficulty: z.number().optional(),
  status: z.enum(["draft", "scheduled", "published", "retired"]).default("scheduled"),
});

export async function scheduleDailyGame(input: z.input<typeof schema>) {
  await requireAdmin();
  const parsed = schema.parse(input);
  const db = await createSupabaseAdmin();

  const { data, error } = await db
    .from("daily_games")
    .upsert(
      {
        game_date: parsed.gameDate,
        scene_id: parsed.sceneId,
        difficulty: parsed.difficulty ?? null,
        status: parsed.status,
      },
      { onConflict: "game_date" },
    )
    .select()
    .single();

  if (error) throw new Error(error.message);

  revalidatePath("/admin/daily");
  revalidatePath("/admin/calendar");
  revalidatePath("/");
  return data;
}

export async function listDailyGames(monthPrefix?: string) {
  await requireAdmin();
  const db = await createSupabaseAdmin();

  let query = db
    .from("daily_games")
    .select(
      "id, game_date, status, difficulty, scene:scenes(id, scene_code, drama:dramas(title_kr))",
    )
    .order("game_date", { ascending: true });

  if (monthPrefix) {
    query = query
      .gte("game_date", `${monthPrefix}-01`)
      .lte("game_date", `${monthPrefix}-31`);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data ?? [];
}
