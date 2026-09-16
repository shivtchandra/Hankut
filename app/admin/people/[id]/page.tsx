import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin-auth";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { PeopleStudio } from "@/components/admin/PeopleStudio";

export default async function PeoplePuzzleEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;

  const db = await createSupabaseAdmin();

  const { data: puzzle } = await db
    .from("puzzles")
    .select("id, title, status, entity_id")
    .eq("id", id)
    .eq("type", "people")
    .single();

  if (!puzzle) notFound();

  const [{ data: steps }, { data: clues }, { data: answers }] =
    await Promise.all([
      db
        .from("puzzle_steps")
        .select("step_number, step_type, asset_url")
        .eq("puzzle_id", id)
        .order("step_number"),
      db
        .from("puzzle_clues")
        .select("clue_order, type, label, value, unlock_after_attempt")
        .eq("puzzle_id", id)
        .order("clue_order"),
      db
        .from("puzzle_answers")
        .select("answer_text, is_primary")
        .eq("puzzle_id", id)
        .order("is_primary", { ascending: false }),
    ]);

  const initialFrames = (steps ?? []).map((s) => ({
    stepNumber: s.step_number,
    label: `0${s.step_number} Frame`,
    stepType: s.step_type,
    assetUrl: s.asset_url ?? "",
  }));

  const initialClues = (clues ?? []).map((c) => ({
    clueOrder: c.clue_order,
    type: c.type,
    label: c.label,
    value: c.value,
    unlockAfterAttempt: c.unlock_after_attempt ?? 2,
  }));

  const initialAnswers = (answers ?? []).map((a) => a.answer_text);

  const presignUrl = process.env.NEXT_PUBLIC_R2_PRESIGN_URL;

  return (
    <div className="admin-page">
      <div className="admin-title">
        <div>
          <span className="eyebrow">PEOPLE STUDIO</span>
          <h1>{puzzle.title}</h1>
          <p className="muted">
            Status: {puzzle.status} · ID: {puzzle.id.slice(0, 8)}…
          </p>
        </div>
        <a href="/admin/people" className="secondary">
          ← Back
        </a>
      </div>

      <PeopleStudio
        puzzleId={puzzle.id}
        entityId={puzzle.entity_id ?? undefined}
        initialFrames={initialFrames.length > 0 ? initialFrames : undefined}
        initialAnswers={initialAnswers}
        initialClues={initialClues.length > 0 ? initialClues : undefined}
        guestPresignUrl={presignUrl}
      />
    </div>
  );
}
