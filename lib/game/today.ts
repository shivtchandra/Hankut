import { createSupabaseServer } from "@/lib/supabase/server";
import { DEMO_DRAMAS, DEMO_TODAY_GAME } from "@/lib/demo-data";
import type { TodayGame } from "@/types/game";

function one<T>(value: T | T[] | null | undefined): T | null {
  if (!value) return null;
  return Array.isArray(value) ? value[0] ?? null : value;
}

export function seoulDate(date = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
  }).format(date);
}

function mapRow(row: {
  id: string;
  game_date: string;
  difficulty: number | null;
  scene: {
    id: string;
    episode: number | null;
    drama: {
      id: string;
      title_kr: string;
      title_en: string;
      aliases: string[] | null;
      year: number | null;
      network: string | null;
      genres: string[] | null;
    };
    assets: { id: string; public_url: string | null; frame_order: number }[];
    clues: {
      id: string;
      type: string;
      value: string;
      unlock_after: number;
      clue_order: number;
    }[];
  };
}): TodayGame {
  const assets = [...(row.scene.assets ?? [])].sort(
    (a, b) => a.frame_order - b.frame_order,
  );
  const clues = [...(row.scene.clues ?? [])].sort(
    (a, b) => a.clue_order - b.clue_order,
  );

  return {
    id: row.id,
    gameDate: row.game_date,
    difficulty: row.difficulty ?? row.scene.episode ?? 5,
    scene: {
      id: row.scene.id,
      episode: row.scene.episode ?? 1,
      frames: assets
        .map((asset) => asset.public_url)
        .filter((url): url is string => Boolean(url)),
      clues: clues.map((clue) => ({
        id: clue.id,
        label: clue.type,
        value: clue.value,
        unlockAfterAttempt: clue.unlock_after,
      })),
      drama: {
        id: row.scene.drama.id,
        titleKr: row.scene.drama.title_kr,
        titleEn: row.scene.drama.title_en,
        aliases: row.scene.drama.aliases ?? [
          row.scene.drama.title_kr,
          row.scene.drama.title_en,
        ],
        year: row.scene.drama.year,
        network: row.scene.drama.network,
        genres: row.scene.drama.genres ?? [],
      },
    },
  };
}

export async function getTodayGame(targetDate?: string): Promise<{
  game: TodayGame;
  source: "supabase" | "demo";
  dramas: TodayGame["scene"]["drama"][];
}> {
  const gameDate = targetDate || seoulDate();
  const configured =
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!configured) {
    return {
      game: { ...DEMO_TODAY_GAME, gameDate },
      source: "demo",
      dramas: DEMO_DRAMAS,
    };
  }

  try {
    const supabase = await createSupabaseServer();

    const { data, error } = await supabase
      .from("daily_games")
      .select(
        `
        id,
        game_date,
        difficulty,
        scene:scenes (
          id,
          episode,
          drama:dramas (
            id,
            title_kr,
            title_en,
            aliases,
            year,
            network,
            genres
          ),
          assets:scene_assets (
            id,
            public_url,
            frame_order
          ),
          clues (
            id,
            type,
            value,
            unlock_after,
            clue_order
          )
        )
      `,
      )
      .eq("game_date", gameDate)
      .in("status", ["published", "scheduled"])
      .maybeSingle();

    if (error || !data || !one((data as { scene: unknown }).scene)) {
      return {
        game: { ...DEMO_TODAY_GAME, gameDate },
        source: "demo",
        dramas: DEMO_DRAMAS,
      };
    }

    const scene = one((data as { scene: unknown }).scene) as Parameters<typeof mapRow>[0]["scene"] | null;
    if (!scene) {
      return { game: DEMO_TODAY_GAME, source: "demo", dramas: DEMO_DRAMAS };
    }
    const drama = one(scene.drama);
    if (!drama) {
      return { game: DEMO_TODAY_GAME, source: "demo", dramas: DEMO_DRAMAS };
    }
    const game = mapRow({
      ...(data as object),
      scene: {
        ...scene,
        drama,
        assets: Array.isArray(scene.assets) ? scene.assets : [],
        clues: Array.isArray(scene.clues) ? scene.clues : [],
      },
    } as never);

    if (game.scene.frames.length === 0) {
      return {
        game: DEMO_TODAY_GAME,
        source: "demo",
        dramas: DEMO_DRAMAS,
      };
    }

    const { data: dramaRows } = await supabase
      .from("dramas")
      .select("id, title_kr, title_en, aliases, year, network, genres")
      .eq("status", "published")
      .limit(200);

    const dramas =
      dramaRows?.map((row) => ({
        id: row.id,
        titleKr: row.title_kr,
        titleEn: row.title_en,
        aliases: row.aliases ?? [row.title_kr, row.title_en],
        year: row.year,
        network: row.network,
        genres: row.genres ?? [],
      })) ?? DEMO_DRAMAS;

    return { game, source: "supabase", dramas };
  } catch {
    return {
      game: DEMO_TODAY_GAME,
      source: "demo",
      dramas: DEMO_DRAMAS,
    };
  }
}

// ─── Today's 5 ────────────────────────────────────────────────────────────────

import type {
  TodaysFiveGame,
  MiniGameItem,
  ScenePayload,
  SongPayload,
  ChosungPayload,
  ConnectionsPayload,
  ConnectionGroup,
  ConnectionItem,
  PeoplePayload,
  Clue,
} from "@/types/game";
import { DEMO_TODAYS_FIVE } from "@/lib/demo-data";

function mapClues(
  rows: { id: string; type: string; value: string; unlock_after_attempt: number; label?: string }[],
): Clue[] {
  return rows.map((c) => ({
    id: c.id,
    label: c.label ?? c.type,
    value: c.value,
    unlockAfterAttempt: c.unlock_after_attempt,
    type: c.type,
  }));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildMiniGameItem(puzzle: any, steps: any[], clues: any[], answers: any[]): MiniGameItem | null {
  const type = puzzle.type as string;
  const primaryAnswer = answers.find((a: { is_primary: boolean }) => a.is_primary) ?? answers[0];
  const entityMeta = primaryAnswer?.entity ?? puzzle.entity ?? {};

  if (type === "scene" || type === "movie") {
    const frames = steps
      .filter((s: { step_type: string }) => s.step_type === "image")
      .sort((a: { step_number: number }, b: { step_number: number }) => a.step_number - b.step_number)
      .map((s: { asset_url: string | null }) => s.asset_url)
      .filter(Boolean) as string[];

    const payload: ScenePayload = {
      id: puzzle.id,
      episode: puzzle.metadata?.episode ?? 1,
      frames,
      clues: mapClues(clues),
      drama: {
        id: entityMeta.id ?? puzzle.entity_id ?? "",
        titleKr: entityMeta.title_kr ?? primaryAnswer?.answer_text ?? puzzle.title,
        titleEn: entityMeta.title_en ?? "",
        aliases: entityMeta.aliases ?? answers.map((a: { answer_text: string }) => a.answer_text),
        year: entityMeta.metadata?.year ?? null,
        network: entityMeta.metadata?.network ?? null,
        genres: entityMeta.metadata?.genres ?? [],
      },
    };
    return { type: "scene", payload };
  }

  if (type === "song") {
    const audioStep = steps.find((s: { step_type: string }) => s.step_type === "audio");
    const audioSegments = steps
      .filter((s: { step_type: string }) => s.step_type === "audio")
      .sort((a: { step_number: number }, b: { step_number: number }) => a.step_number - b.step_number)
      .map((s: { metadata?: { duration?: number } }) => s.metadata?.duration ?? 2);

    const payload: SongPayload = {
      id: puzzle.id,
      titleKr: entityMeta.title_kr ?? puzzle.title,
      titleEn: entityMeta.title_en ?? "",
      artistKr: puzzle.metadata?.artist_kr ?? "",
      artistEn: puzzle.metadata?.artist_en ?? "",
      audioUrl: audioStep?.asset_url ?? "",
      segments: audioSegments.length > 0 ? audioSegments : [1, 2, 4, 7, 12],
      dramaTitle: puzzle.metadata?.drama_title,
      aliases: answers.map((a: { answer_text: string }) => a.answer_text),
      clues: mapClues(clues),
    };
    return { type: "song", payload };
  }

  if (type === "chosung") {
    const payload: ChosungPayload = {
      id: puzzle.id,
      chosung: puzzle.metadata?.chosung ?? puzzle.title,
      answerKr: primaryAnswer?.answer_text ?? "",
      answerEn: answers.find((a: { metadata?: { lang?: string } }) => a.metadata?.lang === "en")?.answer_text ?? "",
      category: puzzle.metadata?.category ?? "",
      syllableCount: puzzle.metadata?.syllable_count ?? 0,
      aliases: answers.map((a: { answer_text: string }) => a.answer_text),
      clues: mapClues(clues),
    };
    return { type: "chosung", payload };
  }

  if (type === "connections") {
    const groupsMeta: Array<{
      id: string;
      label: string;
      description: string;
      difficulty: "easy" | "medium" | "hard" | "brutal";
      items: Array<{ id: string; text: string; entityId?: string }>;
    }> = puzzle.metadata?.groups ?? [];

    const groups: ConnectionGroup[] = groupsMeta.map((g) => ({
      id: g.id,
      label: g.label,
      description: g.description,
      difficulty: g.difficulty,
      items: g.items.map((item) => ({
        id: item.id,
        text: item.text,
        groupId: g.id,
        entityId: item.entityId,
      })),
    }));

    const allItems = groups.flatMap((g) => g.items);
    const shuffledItems: ConnectionItem[] = [...allItems].sort(() => Math.random() - 0.5);

    const payload: ConnectionsPayload = {
      id: puzzle.id,
      title: puzzle.title,
      groups,
      shuffledItems,
    };
    return { type: "connections", payload };
  }

  if (type === "people") {
    const frames = steps
      .filter((s: { step_type: string }) => ["image", "silhouette", "crop"].includes(s.step_type))
      .sort((a: { step_number: number }, b: { step_number: number }) => a.step_number - b.step_number)
      .map((s: { asset_url: string | null }) => s.asset_url)
      .filter(Boolean) as string[];

    const payload: PeoplePayload = {
      id: puzzle.id,
      nameKr: entityMeta.title_kr ?? primaryAnswer?.answer_text ?? "",
      nameEn: entityMeta.title_en ?? "",
      category: puzzle.metadata?.category ?? entityMeta.type ?? "person",
      frames,
      aliases: answers.map((a: { answer_text: string }) => a.answer_text),
      clues: mapClues(clues),
    };
    return { type: "people", payload };
  }

  return null;
}

export async function getTodaysFive(targetDate?: string): Promise<TodaysFiveGame | null> {
  const configured =
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!configured) return DEMO_TODAYS_FIVE ?? null;

  try {
    const supabase = await createSupabaseServer();
    const gameDate = targetDate || seoulDate();

    const { data: setRow } = await supabase
      .from("daily_sets")
      .select("id, game_date")
      .eq("game_date", gameDate)
      .eq("status", "published")
      .maybeSingle();

    if (!setRow) return DEMO_TODAYS_FIVE ?? null;

    const { data: items } = await supabase
      .from("daily_set_items")
      .select(`
        id,
        position,
        puzzle:puzzles (
          id,
          type,
          title,
          entity_id,
          difficulty,
          metadata,
          entity:entities (
            id,
            type,
            title_kr,
            title_en,
            aliases,
            metadata
          )
        )
      `)
      .eq("daily_set_id", setRow.id)
      .order("position");

    if (!items || items.length === 0) return DEMO_TODAYS_FIVE ?? null;

    const puzzleIds = items
      .map((item) => {
        const p = Array.isArray(item.puzzle) ? item.puzzle[0] : item.puzzle;
        return p?.id;
      })
      .filter(Boolean) as string[];

    const [stepsRes, cluesRes, answersRes] = await Promise.all([
      supabase
        .from("puzzle_steps")
        .select("puzzle_id, step_number, step_type, asset_url, metadata")
        .in("puzzle_id", puzzleIds)
        .order("step_number"),
      supabase
        .from("puzzle_clues")
        .select("puzzle_id, id, type, label, value, unlock_after_attempt")
        .in("puzzle_id", puzzleIds)
        .order("clue_order"),
      supabase
        .from("puzzle_answers")
        .select("puzzle_id, id, answer_text, is_primary, entity:entities(id, title_kr, title_en, aliases, metadata, type)")
        .in("puzzle_id", puzzleIds),
    ]);

    const stepsByPuzzle = (stepsRes.data ?? []).reduce<Record<string, unknown[]>>(
      (acc, s) => { (acc[s.puzzle_id] ??= []).push(s); return acc; },
      {},
    );
    const cluesByPuzzle = (cluesRes.data ?? []).reduce<Record<string, unknown[]>>(
      (acc, c) => { (acc[c.puzzle_id] ??= []).push(c); return acc; },
      {},
    );
    const answersByPuzzle = (answersRes.data ?? []).reduce<Record<string, unknown[]>>(
      (acc, a) => { (acc[a.puzzle_id] ??= []).push(a); return acc; },
      {},
    );

    const miniItems: MiniGameItem[] = [];

    for (const item of items) {
      const puzzle = Array.isArray(item.puzzle) ? item.puzzle[0] : item.puzzle;
      if (!puzzle) continue;
      const entity = Array.isArray((puzzle as { entity?: unknown }).entity)
        ? ((puzzle as { entity?: unknown[] }).entity ?? [])[0]
        : (puzzle as { entity?: unknown }).entity;
      const gameItem = buildMiniGameItem(
        { ...puzzle, entity },
        (stepsByPuzzle[puzzle.id] ?? []) as never[],
        (cluesByPuzzle[puzzle.id] ?? []) as never[],
        (answersByPuzzle[puzzle.id] ?? []) as never[],
      );
      if (gameItem) miniItems.push(gameItem);
    }

    if (miniItems.length === 0) return DEMO_TODAYS_FIVE ?? null;

    return {
      id: setRow.id,
      gameDate: setRow.game_date,
      difficulty: 5,
      items: miniItems,
    };
  } catch {
    return DEMO_TODAYS_FIVE ?? null;
  }
}
