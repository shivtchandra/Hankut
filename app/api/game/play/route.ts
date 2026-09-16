import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { puzzleId, dailyGameId, dailySetItemId, challengeId, guestId } = body;

    if (!puzzleId) {
      return NextResponse.json({ error: "puzzleId required" }, { status: 400 });
    }

    const db = await createSupabaseAdmin();

    const { data, error } = await db
      .from("plays")
      .insert({
        puzzle_id: puzzleId,
        daily_game_id: dailyGameId ?? null,
        daily_set_item_id: dailySetItemId ?? null,
        challenge_id: challengeId ?? null,
        guest_id: guestId ?? null,
        started_at: new Date().toISOString(),
      })
      .select("id")
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Failed to create play" }, { status: 500 });
    }

    return NextResponse.json({ playId: data.id });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { playId, stepsRevealed, completed, timeSeconds } = body;

    if (!playId) {
      return NextResponse.json({ error: "playId required" }, { status: 400 });
    }

    const db = await createSupabaseAdmin();

    const updates: Record<string, unknown> = {};
    if (stepsRevealed !== undefined) updates.steps_revealed = stepsRevealed;
    if (timeSeconds !== undefined) updates.time_seconds = timeSeconds;
    if (completed) updates.completed_at = new Date().toISOString();

    await db.from("plays").update(updates).eq("id", playId);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
