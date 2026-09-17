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

  let dailyRows: any[] = [];
  try {
    let query = db
      .from("daily_games")
      .select(
        "id, game_date, status, difficulty, scene:scenes(id, scene_code, drama:dramas(title_kr, title_en))",
      )
      .order("game_date", { ascending: true });

    if (monthPrefix) {
      query = query
        .gte("game_date", `${monthPrefix}-01`)
        .lte("game_date", `${monthPrefix}-31`);
    }

    const { data, error } = await query;
    if (!error && data) dailyRows = data;
  } catch {
    dailyRows = [];
  }

  const result = [...dailyRows];
  const dateMap = new Map(result.map((r) => [r.game_date, r]));

  // Also query daily_sets table (from TodaysFiveBuilder)
  try {
    let setQuery = db
      .from("daily_sets")
      .select("id, game_date, status, title")
      .order("game_date", { ascending: true });

    if (monthPrefix) {
      setQuery = setQuery
        .gte("game_date", `${monthPrefix}-01`)
        .lte("game_date", `${monthPrefix}-31`);
    }

    const { data: setRows } = await setQuery;
    if (setRows) {
      for (const st of setRows) {
        const existing = dateMap.get(st.game_date);
        const synthRow = {
          id: st.id,
          game_date: st.game_date,
          status: st.status ?? "published",
          difficulty: 5,
          scene: {
            id: st.id,
            scene_code: st.title ?? "Daily Set",
            drama: { title_kr: st.title ?? "Daily Set", title_en: "Daily Set" },
          },
        };

        if (!existing) {
          result.push(synthRow as never);
          dateMap.set(st.game_date, synthRow as never);
        } else if (st.status === "published" && existing.status !== "published") {
          (existing as any).status = "published";
          if (!(existing as any).scene) {
            (existing as any).scene = synthRow.scene;
          }
        }
      }
    }
  } catch {
    // Ignore daily_sets query errors
  }

  // Also query scenes with scene_code matching dates to prevent calendar gaps
  try {
    const { data: sceneRows } = await db
      .from("scenes")
      .select("id, scene_code, status, difficulty, created_at, drama:dramas(title_kr, title_en)")
      .order("created_at", { ascending: false });

    if (sceneRows) {
      for (const sc of sceneRows) {
        if (sc.status !== "published" && sc.status !== "ready") continue;

        let gameDate: string | null = null;
        const match = sc.scene_code?.match(/(\d{4})(\d{2})(\d{2})/);
        if (match) {
          gameDate = `${match[1]}-${match[2]}-${match[3]}`;
        } else if ((sc as any).created_at) {
          gameDate = new Date((sc as any).created_at).toISOString().slice(0, 10);
        }

        if (gameDate) {
          if (monthPrefix && !gameDate.startsWith(monthPrefix)) continue;
          const existing = dateMap.get(gameDate);
          const synthRow = {
            id: sc.id,
            game_date: gameDate,
            status: sc.status === "ready" ? "scheduled" : "published",
            difficulty: sc.difficulty ?? 5,
            scene: sc,
          };

          if (!existing) {
            result.push(synthRow as never);
            dateMap.set(gameDate, synthRow as never);
          } else if (existing.status !== "published") {
            (existing as any).status = sc.status === "ready" ? "scheduled" : "published";
            (existing as any).scene = sc;
          }
        }
      }
    }
  } catch {
    // Ignore scenes query errors
  }

  return result;
}

// ─── Scene-first daily scheduler ─────────────────────────────────────────────

export async function createSceneAndSchedule({
  gameDate,
  dramaId,
  imageUrls,
  difficulty,
  publish,
}: {
  gameDate: string;
  dramaId: string;
  imageUrls: string[]; // up to 5, in frame order
  difficulty: number;
  publish: boolean;
}) {
  await requireAdmin();
  const db = await createSupabaseAdmin();

  const sceneCode = `DC-${gameDate.replace(/-/g, "")}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

  const { data: scene, error: sceneErr } = await db
    .from("scenes")
    .insert({
      drama_id: dramaId,
      scene_code: sceneCode,
      difficulty,
      status: publish ? "ready" : "draft",
    })
    .select("id")
    .single();

  if (sceneErr || !scene) throw new Error(sceneErr?.message ?? "Scene create failed");

  const validUrls = imageUrls.filter(Boolean);
  if (validUrls.length > 0) {
    const assets = validUrls.map((url, i) => ({
      scene_id: scene.id,
      frame_order: i + 1,
      asset_key: `scenes/${scene.id}/frame-${i + 1}`,
      public_url: url,
      rights_status: "review_required",
    }));
    const { error: assetErr } = await db.from("scene_assets").insert(assets);
    if (assetErr) throw new Error(assetErr.message);
  }

  const { error: dgErr } = await db
    .from("daily_games")
    .upsert(
      { game_date: gameDate, scene_id: scene.id, difficulty, status: publish ? "published" : "draft" },
      { onConflict: "game_date" },
    );

  if (dgErr) throw new Error(dgErr.message);

  revalidatePath("/admin/daily");
  revalidatePath("/admin/calendar");
  if (publish) revalidatePath("/");
  return scene.id;
}

// ─── Daily Sets (Today's 5) ───────────────────────────────────────────────────

export async function saveDailySet({
  gameDate,
  title,
  puzzleIds,
}: {
  gameDate: string;
  title?: string;
  puzzleIds: string[]; // ordered positions 1..N
}) {
  await requireAdmin();
  const db = await createSupabaseAdmin();

  // Upsert the daily_set row
  const { data: setRow, error: setError } = await db
    .from("daily_sets")
    .upsert({ game_date: gameDate, title: title ?? null, status: "draft" }, { onConflict: "game_date" })
    .select("id")
    .single();

  if (setError || !setRow) throw new Error(setError?.message ?? "Failed to upsert daily_set");

  // Replace items
  await db.from("daily_set_items").delete().eq("daily_set_id", setRow.id);

  if (puzzleIds.length > 0) {
    const items = puzzleIds.map((puzzleId, i) => ({
      daily_set_id: setRow.id,
      position: i + 1,
      puzzle_id: puzzleId,
    }));
    const { error: itemsError } = await db.from("daily_set_items").insert(items);
    if (itemsError) throw new Error(itemsError.message);
  }

  revalidatePath("/admin/daily");
  revalidatePath("/admin/calendar");
  return { id: setRow.id };
}

export async function publishDailySet(gameDate: string) {
  await requireAdmin();
  const db = await createSupabaseAdmin();

  const { error } = await db
    .from("daily_sets")
    .update({ status: "published", published_at: new Date().toISOString() })
    .eq("game_date", gameDate);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/daily");
  revalidatePath("/admin/calendar");
  revalidatePath("/");
}

export async function listDailySets(monthPrefix?: string) {
  await requireAdmin();
  const db = await createSupabaseAdmin();

  let query = db
    .from("daily_sets")
    .select(`
      id,
      game_date,
      status,
      title,
      published_at,
      items:daily_set_items (
        position,
        puzzle:puzzles ( id, type, title, difficulty )
      )
    `)
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
