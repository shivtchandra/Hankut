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

export async function getTodayGame(): Promise<{
  game: TodayGame;
  source: "supabase" | "demo";
  dramas: TodayGame["scene"]["drama"][];
}> {
  const configured =
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!configured) {
    return {
      game: DEMO_TODAY_GAME,
      source: "demo",
      dramas: DEMO_DRAMAS,
    };
  }

  try {
    const supabase = await createSupabaseServer();
    const today = seoulDate();

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
      .eq("game_date", today)
      .eq("status", "published")
      .maybeSingle();

    if (error || !data || !one((data as { scene: unknown }).scene)) {
      return {
        game: DEMO_TODAY_GAME,
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
