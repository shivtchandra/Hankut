"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/admin-auth";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { attachPuzzleToDate } from "@/lib/admin/daily-set";
import { isValidGameDate } from "@/lib/game/dates";
import { normalize } from "@/lib/game/normalization";

/** Song sits in slot 2 of Today's 5, after the scene cut. */
const SONG_POSITION = 2;
const DEFAULT_SEGMENTS = [3, 6, 12, 20, 30];

export type SongPuzzleDraft = {
  puzzleId?: string | null;
  titleKr: string;
  titleEn?: string;
  artistKr: string;
  artistEn?: string;
  dramaTitle?: string;
  audioUrl: string;
  startSeconds: number;
  segments: number[];
  aliases: string[];
  gameDate?: string | null;
  publish: boolean;
};

export type SavedSongPuzzle = {
  puzzleId: string;
  titleKr: string;
  titleEn: string;
  artistKr: string;
  artistEn: string;
  dramaTitle: string;
  audioUrl: string;
  startSeconds: number;
  segments: number[];
  aliases: string[];
  gameDate: string | null;
  status: string;
};

export type SaveSongResult =
  | { ok: true; puzzle: SavedSongPuzzle; scheduled: boolean }
  | { ok: false; errors: string[] };

function validate(draft: SongPuzzleDraft): string[] {
  const errors: string[] = [];

  if (!draft.titleKr.trim()) errors.push("Song title is required.");
  if (!draft.artistKr.trim()) errors.push("Artist is required.");
  if (!draft.audioUrl.trim()) errors.push("Upload an audio file first.");

  if (!Number.isFinite(draft.startSeconds) || draft.startSeconds < 0) {
    errors.push("Start point must be zero or more seconds.");
  }

  if (draft.segments.length !== 5) {
    errors.push("Provide exactly 5 reveal lengths.");
  } else if (draft.segments.some((s) => !Number.isFinite(s) || s <= 0)) {
    errors.push("Every reveal length must be longer than 0 seconds.");
  } else if (draft.segments.some((s, i) => i > 0 && s <= draft.segments[i - 1])) {
    errors.push("Reveal lengths must increase from clip 1 to clip 5.");
  }

  if (draft.gameDate && !isValidGameDate(draft.gameDate)) {
    errors.push("Game date must be a real date in YYYY-MM-DD form.");
  }

  return errors;
}

export async function saveSongPuzzle(
  draft: SongPuzzleDraft,
): Promise<SaveSongResult> {
  const { user } = await requireAdmin();

  const errors = validate(draft);
  if (errors.length > 0) return { ok: false, errors };

  const db = await createSupabaseAdmin();

  const titleKr = draft.titleKr.trim();
  const titleEn = (draft.titleEn ?? "").trim();
  const artistKr = draft.artistKr.trim();
  const artistEn = (draft.artistEn ?? "").trim();
  const dramaTitle = (draft.dramaTitle ?? "").trim();
  const startSeconds = Math.round(draft.startSeconds * 10) / 10;

  // The title and artist always count as answers, plus any extras typed in.
  const aliases = Array.from(
    new Set(
      [titleKr, titleEn, artistKr, artistEn, ...draft.aliases]
        .map((value) => value.trim())
        .filter(Boolean),
    ),
  );

  const metadata = {
    artist_kr: artistKr,
    artist_en: artistEn,
    title_en: titleEn,
    drama_title: dramaTitle,
    start_seconds: startSeconds,
  };

  const status = draft.publish ? "published" : "draft";

  let puzzleId = draft.puzzleId ?? "";

  if (puzzleId) {
    const { error } = await db
      .from("puzzles")
      .update({
        title: titleKr,
        metadata,
        status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", puzzleId);

    if (error) return { ok: false, errors: [error.message] };
  } else {
    const { data, error } = await db
      .from("puzzles")
      .insert({ type: "song", title: titleKr, metadata, status })
      .select("id")
      .single();

    if (error || !data) {
      return { ok: false, errors: [error?.message ?? "Could not save the puzzle"] };
    }
    puzzleId = data.id;
  }

  // One audio step per reveal length; the player unlocks them in order.
  await db.from("puzzle_steps").delete().eq("puzzle_id", puzzleId);
  const { error: stepsError } = await db.from("puzzle_steps").insert(
    draft.segments.map((duration, index) => ({
      puzzle_id: puzzleId,
      step_number: index + 1,
      step_type: "audio",
      asset_url: draft.audioUrl,
      metadata: { duration, start_seconds: startSeconds },
      score_penalty: index * 5,
    })),
  );
  if (stepsError) return { ok: false, errors: [stepsError.message] };

  await db.from("puzzle_answers").delete().eq("puzzle_id", puzzleId);
  const { error: answersError } = await db.from("puzzle_answers").insert(
    aliases.map((answer, index) => ({
      puzzle_id: puzzleId,
      answer_text: answer,
      normalized_answer: normalize(answer),
      is_primary: index === 0,
    })),
  );
  if (answersError) return { ok: false, errors: [answersError.message] };

  // Register the clip for the rights queue, keyed by its storage path.
  const assetKey = draft.audioUrl.split("/media/").pop() ?? draft.audioUrl;
  await db.from("audio_assets").upsert(
    {
      puzzle_id: puzzleId,
      title: titleKr,
      artist: artistKr,
      asset_key: assetKey,
      public_url: draft.audioUrl,
      sample_start_seconds: startSeconds,
    },
    { onConflict: "asset_key" },
  );

  let scheduled = false;
  if (draft.gameDate) {
    const attached = await attachPuzzleToDate({
      db,
      gameDate: draft.gameDate,
      puzzleId,
      puzzleType: "song",
      preferredPosition: SONG_POSITION,
      publish: draft.publish,
    });

    if ("error" in attached) return { ok: false, errors: [attached.error] };
    scheduled = true;
  }

  await db.from("admin_activity").insert({
    action: draft.publish ? "song.publish" : "song.save",
    entity_type: "puzzle",
    entity_id: puzzleId,
    after_data: { titleKr, artistKr, gameDate: draft.gameDate ?? null, startSeconds },
    metadata: { actor: user.email },
  });

  revalidatePath("/admin/audio");
  revalidatePath("/admin/daily");
  revalidatePath("/admin/calendar");
  if (draft.publish) revalidatePath("/");

  return {
    ok: true,
    scheduled,
    puzzle: {
      puzzleId,
      titleKr,
      titleEn,
      artistKr,
      artistEn,
      dramaTitle,
      audioUrl: draft.audioUrl,
      startSeconds,
      segments: draft.segments,
      aliases: draft.aliases,
      gameDate: draft.gameDate ?? null,
      status,
    },
  };
}

/** Loads a saved song puzzle for editing: the one on a date, else the newest. */
export async function loadSongPuzzle(
  gameDate?: string,
): Promise<SavedSongPuzzle | null> {
  await requireAdmin();
  const db = await createSupabaseAdmin();

  let puzzleId: string | null = null;
  let scheduledDate: string | null = null;

  if (gameDate && isValidGameDate(gameDate)) {
    const { data: setRow } = await db
      .from("daily_sets")
      .select("id, game_date, items:daily_set_items(puzzle:puzzles(id, type))")
      .eq("game_date", gameDate)
      .maybeSingle();

    const items = (setRow?.items ?? []) as Array<{ puzzle: unknown }>;
    for (const item of items) {
      const puzzle = (Array.isArray(item.puzzle) ? item.puzzle[0] : item.puzzle) as
        | { id: string; type: string }
        | null;
      if (puzzle?.type === "song") {
        puzzleId = puzzle.id;
        scheduledDate = setRow?.game_date ?? gameDate;
        break;
      }
    }

    if (!puzzleId) return null;
  }

  const query = db
    .from("puzzles")
    .select("id, title, status, metadata, steps:puzzle_steps(step_number, asset_url, metadata), answers:puzzle_answers(answer_text, is_primary)")
    .eq("type", "song");

  const { data: puzzle } = puzzleId
    ? await query.eq("id", puzzleId).maybeSingle()
    : await query
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle();

  if (!puzzle) return null;

  const meta = (puzzle.metadata ?? {}) as Record<string, string | number>;
  const steps = [...((puzzle.steps ?? []) as Array<{
    step_number: number;
    asset_url: string | null;
    metadata: { duration?: number } | null;
  }>)].sort((a, b) => a.step_number - b.step_number);

  const answers = (puzzle.answers ?? []) as Array<{
    answer_text: string;
    is_primary: boolean;
  }>;

  if (!scheduledDate) {
    const { data: placement } = await db
      .from("daily_set_items")
      .select("daily_set:daily_sets(game_date)")
      .eq("puzzle_id", puzzle.id)
      .limit(1)
      .maybeSingle();

    const set = Array.isArray(placement?.daily_set)
      ? placement?.daily_set[0]
      : placement?.daily_set;
    scheduledDate = (set as { game_date?: string } | null)?.game_date ?? null;
  }

  const segments = steps
    .map((step) => step.metadata?.duration)
    .filter((duration): duration is number => typeof duration === "number");

  return {
    puzzleId: puzzle.id,
    titleKr: puzzle.title ?? "",
    titleEn: String(meta.title_en ?? ""),
    artistKr: String(meta.artist_kr ?? ""),
    artistEn: String(meta.artist_en ?? ""),
    dramaTitle: String(meta.drama_title ?? ""),
    audioUrl: steps[0]?.asset_url ?? "",
    startSeconds: Number(meta.start_seconds ?? 0),
    segments: segments.length === 5 ? segments : DEFAULT_SEGMENTS,
    aliases: answers.filter((a) => !a.is_primary).map((a) => a.answer_text),
    gameDate: scheduledDate,
    status: puzzle.status ?? "draft",
  };
}
