import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { playId, clueId, sceneClueId, attemptNumber, scorePenalty = 10 } = body;

    if (!playId || (!clueId && !sceneClueId)) {
      return NextResponse.json({ error: "playId and clueId required" }, { status: 400 });
    }

    const db = await createSupabaseAdmin();

    await db.from("clue_usage").insert({
      play_id: playId,
      clue_id: clueId ?? null,
      scene_clue_id: sceneClueId ?? null,
      attempt_number: attemptNumber ?? null,
      score_penalty: scorePenalty,
    });

    // Increment hints_used via raw update (no RPC needed)
    const { data: play } = await db
      .from("plays")
      .select("hints_used")
      .eq("id", playId)
      .single();
    if (play) {
      await db
        .from("plays")
        .update({ hints_used: (play.hints_used ?? 0) + 1 })
        .eq("id", playId);
    }

    return NextResponse.json({ ok: true, scorePenalty });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
