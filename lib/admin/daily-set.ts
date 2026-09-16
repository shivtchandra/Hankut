import type { createSupabaseAdmin } from "@/lib/supabase/admin";

type Db = Awaited<ReturnType<typeof createSupabaseAdmin>>;

const MAX_POSITION = 10;

/**
 * Puts a puzzle on a date's Today's 5 set, replacing whatever puzzle of the
 * same type was scheduled for that date. Creates the set when missing and only
 * ever raises its status, so publishing one slot never unpublishes the rest.
 */
export async function attachPuzzleToDate({
  db,
  gameDate,
  puzzleId,
  puzzleType,
  preferredPosition,
  publish,
}: {
  db: Db;
  gameDate: string;
  puzzleId: string;
  puzzleType: string;
  preferredPosition: number;
  publish: boolean;
}): Promise<{ setId: string } | { error: string }> {
  const { data: existingSet, error: findError } = await db
    .from("daily_sets")
    .select("id, status")
    .eq("game_date", gameDate)
    .maybeSingle();

  if (findError) return { error: findError.message };

  let setId: string = (existingSet?.id as string | undefined) ?? "";

  if (!setId) {
    const { data: created, error: createError } = await db
      .from("daily_sets")
      .insert({
        game_date: gameDate,
        status: publish ? "published" : "draft",
        published_at: publish ? new Date().toISOString() : null,
      })
      .select("id")
      .single();

    if (createError || !created) {
      return { error: createError?.message ?? "Could not create the daily set" };
    }
    setId = created.id;
  } else if (publish && existingSet?.status !== "published") {
    const { error: publishError } = await db
      .from("daily_sets")
      .update({ status: "published", published_at: new Date().toISOString() })
      .eq("id", setId);

    if (publishError) return { error: publishError.message };
  }

  const { data: items, error: itemsError } = await db
    .from("daily_set_items")
    .select("id, position, puzzle_id, puzzle:puzzles(type)")
    .eq("daily_set_id", setId);

  if (itemsError) return { error: itemsError.message };

  const rows = items ?? [];
  const typeOf = (row: (typeof rows)[number]) => {
    const puzzle = Array.isArray(row.puzzle) ? row.puzzle[0] : row.puzzle;
    return (puzzle as { type?: string } | null)?.type ?? null;
  };

  const mine = rows.find((row) => row.puzzle_id === puzzleId);
  if (mine) return { setId };

  const sameType = rows.filter((row) => typeOf(row) === puzzleType);
  if (sameType.length > 0) {
    const { error: deleteError } = await db
      .from("daily_set_items")
      .delete()
      .in(
        "id",
        sameType.map((row) => row.id),
      );
    if (deleteError) return { error: deleteError.message };
  }

  const taken = new Set(
    rows
      .filter((row) => !sameType.some((dropped) => dropped.id === row.id))
      .map((row) => row.position as number),
  );

  let position = preferredPosition;
  if (taken.has(position)) {
    position = 0;
    for (let candidate = 1; candidate <= MAX_POSITION; candidate += 1) {
      if (!taken.has(candidate)) {
        position = candidate;
        break;
      }
    }
    if (position === 0) return { error: "That date already has 10 puzzles." };
  }

  const { error: insertError } = await db
    .from("daily_set_items")
    .insert({ daily_set_id: setId, position, puzzle_id: puzzleId });

  if (insertError) return { error: insertError.message };

  return { setId };
}
