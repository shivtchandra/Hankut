import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase/admin";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: dbId } = await params;

  const db = await createSupabaseAdmin();

  const { data: puzzles } = await db
    .from("daily_games")
    .select("id, game_date")
    .eq("status", "published")
    .order("game_date", { ascending: false })
    .limit(50)
    // join via scenes to filter by drama
    .in(
      "scene_id",
      (
        await db
          .from("scenes")
          .select("id")
          .eq("drama_id", dbId)
      ).data?.map((s) => s.id) ?? [],
    );

  if (!puzzles || puzzles.length === 0) {
    return NextResponse.json({ puzzles: [], communityStats: {} });
  }

  const gameIds = puzzles.map((p) => p.id);
  const { data: plays } = await db
    .from("plays")
    .select("daily_game_id, solved, score")
    .in("daily_game_id", gameIds)
    .not("completed_at", "is", null);

  const statsMap: Record<string, { play_count: number; solved_count: number; score_sum: number }> = {};
  for (const play of plays ?? []) {
    if (!statsMap[play.daily_game_id]) {
      statsMap[play.daily_game_id] = { play_count: 0, solved_count: 0, score_sum: 0 };
    }
    statsMap[play.daily_game_id].play_count++;
    if (play.solved) statsMap[play.daily_game_id].solved_count++;
    if (play.score) statsMap[play.daily_game_id].score_sum += play.score;
  }

  const result = puzzles.map((p) => {
    const s = statsMap[p.id];
    return {
      id: p.id,
      game_date: p.game_date,
      play_count: s?.play_count ?? 0,
      solved_count: s?.solved_count ?? 0,
      avg_score: s && s.play_count > 0 ? Math.round(s.score_sum / s.play_count) : null,
      solve_rate: s && s.play_count > 0 ? Math.round((s.solved_count / s.play_count) * 100) : null,
    };
  });

  return NextResponse.json({ puzzles: result });
}
