import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { normalize } from "@/lib/game/normalization";
import { calculatePuzzleScore } from "@/lib/game/scoring";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { playId, puzzleId, rawGuess, attemptNumber } = body;

    if (!playId || !puzzleId || !rawGuess) {
      return NextResponse.json({ error: "playId, puzzleId, rawGuess required" }, { status: 400 });
    }

    const db = await createSupabaseAdmin();

    // Fetch accepted answers (service role bypasses RLS to access even before reveal)
    const { data: answers } = await db
      .from("puzzle_answers")
      .select("id, answer_text, normalized_answer, entity_id, is_primary")
      .eq("puzzle_id", puzzleId);

    const normalizedGuess = normalize(rawGuess);

    const match = (answers ?? []).find(
      (a) => a.normalized_answer === normalizedGuess,
    );

    const isCorrect = Boolean(match);

    const { data: play } = await db
      .from("plays")
      .select("attempts")
      .eq("id", playId)
      .single();

    const currentAttempts = (play?.attempts ?? 0) + 1;

    // Record the guess
    await db.from("guesses").insert({
      play_id: playId,
      attempt_number: attemptNumber ?? currentAttempts,
      raw_guess: rawGuess,
      normalized_guess: normalizedGuess,
      matched_entity_id: match?.entity_id ?? null,
      is_correct: isCorrect,
    });

    // Update play record
    const playUpdates: Record<string, unknown> = {
      attempts: currentAttempts,
    };

    let score: number | undefined;

    if (isCorrect) {
      const result = calculatePuzzleScore({
        solved: true,
        attempts: currentAttempts,
      });
      score = result.score;
      playUpdates.solved = true;
      playUpdates.score = score;
      playUpdates.completed_at = new Date().toISOString();
    }

    await db.from("plays").update(playUpdates).eq("id", playId);

    // Safe response — never expose answer text here
    return NextResponse.json({
      correct: isCorrect,
      attempts: currentAttempts,
      ...(isCorrect ? { score, entityId: match?.entity_id } : {}),
    });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
