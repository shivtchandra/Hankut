import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase/admin";

function clampScore(score: unknown) {
  const n = Math.round(Number(score));
  return Number.isFinite(n) ? Math.min(25, Math.max(0, n)) : 0;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      dailyGameId,
      dailySetItemId,
      challengeId,
      guestId,
      completed,
      solved,
      score,
      attempts,
      stepsRevealed,
      timeSeconds,
    } = body;

    if (!dailyGameId && !dailySetItemId && !challengeId) {
      return NextResponse.json({ error: "Game target required" }, { status: 400 });
    }

    const db = await createSupabaseAdmin();

    const insertData: Record<string, unknown> = {
      daily_game_id: dailyGameId ?? null,
      daily_set_item_id: dailySetItemId ?? null,
      challenge_id: challengeId ?? null,
      guest_id: guestId ?? null,
      started_at: new Date().toISOString(),
    };

    if (completed) {
      insertData.completed_at = new Date().toISOString();
      if (solved !== undefined) insertData.solved = Boolean(solved);
      if (score !== undefined) insertData.score = clampScore(score);
      if (attempts !== undefined) insertData.attempts = attempts;
      if (stepsRevealed !== undefined) insertData.steps_revealed = stepsRevealed;
      if (timeSeconds !== undefined) insertData.time_seconds = timeSeconds;
    }

    const { data, error } = await db
      .from("plays")
      .insert(insertData)
      .select("id")
      .single();

    if (error || !data) {
      return NextResponse.json({ error: error?.message ?? "Failed to create play" }, { status: 500 });
    }

    return NextResponse.json({ playId: data.id });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { playId, stepsRevealed, completed, timeSeconds, solved, score, attempts } = body;

    if (!playId) {
      return NextResponse.json({ error: "playId required" }, { status: 400 });
    }

    const db = await createSupabaseAdmin();

    const updates: Record<string, unknown> = {};
    if (stepsRevealed !== undefined) updates.steps_revealed = stepsRevealed;
    if (timeSeconds !== undefined) updates.time_seconds = timeSeconds;
    if (solved !== undefined) updates.solved = Boolean(solved);
    if (score !== undefined) updates.score = clampScore(score);
    if (attempts !== undefined) updates.attempts = attempts;
    if (completed) updates.completed_at = new Date().toISOString();

    const { error } = await db.from("plays").update(updates).eq("id", playId);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
