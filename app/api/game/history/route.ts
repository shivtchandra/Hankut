import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const deviceId = req.nextUrl.searchParams.get("device_id");
  if (!deviceId) return NextResponse.json([]);

  const db = await createSupabaseAdmin();
  const { data } = await db
    .from("plays")
    .select("daily_game_id, solved, score, attempts, daily_games(game_date)")
    .eq("guest_id", deviceId)
    .not("daily_game_id", "is", null)
    .not("completed_at", "is", null);

  const rows = (data ?? []).map((row) => {
    const dg = Array.isArray(row.daily_games) ? row.daily_games[0] : row.daily_games;
    return {
      game_date: (dg as { game_date: string } | null)?.game_date ?? null,
      solved: row.solved,
      score: row.score,
      attempts: row.attempts,
    };
  }).filter((r) => r.game_date);

  return NextResponse.json(rows);
}
