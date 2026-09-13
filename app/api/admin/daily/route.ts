import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminApi } from "@/lib/admin-auth";
import { createSupabaseAdmin } from "@/lib/supabase/admin";

const schema = z.object({
  gameDate: z.string(),
  sceneId: z.string().uuid(),
  difficulty: z.number().optional(),
  status: z
    .enum(["draft", "scheduled", "published", "retired"])
    .default("scheduled"),
});

export async function POST(req: Request) {
  const auth = await requireAdminApi();
  if (!auth.ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = schema.safeParse(await req.json());
  if (!body.success) {
    return NextResponse.json({ error: body.error.flatten() }, { status: 400 });
  }

  const db = await createSupabaseAdmin();
  const { data, error } = await db
    .from("daily_games")
    .upsert(
      {
        game_date: body.data.gameDate,
        scene_id: body.data.sceneId,
        difficulty: body.data.difficulty ?? null,
        status: body.data.status,
      },
      { onConflict: "game_date" },
    )
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}
