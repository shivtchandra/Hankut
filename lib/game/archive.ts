import { createSupabaseServer } from "@/lib/supabase/server";

export type ArchiveItem = {
  id: string;
  gameDate: string;
  difficulty: number | null;
  titleKr: string;
  titleEn: string;
  sceneCode: string;
};

export async function listArchivedGames(limit = 30): Promise<ArchiveItem[]> {
  const supabase = await createSupabaseServer();
  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
  }).format(new Date());

  const { data, error } = await supabase
    .from("daily_games")
    .select(
      `
      id,
      game_date,
      difficulty,
      scene:scenes (
        scene_code,
        drama:dramas ( title_kr, title_en )
      )
    `,
    )
    .eq("status", "published")
    .lt("game_date", today)
    .order("game_date", { ascending: false })
    .limit(limit);

  if (error || !data) return [];

  return data.map((row) => {
    const scene = Array.isArray(row.scene) ? row.scene[0] : row.scene;
    const drama = Array.isArray(scene?.drama) ? scene?.drama[0] : scene?.drama;
    return {
      id: row.id,
      gameDate: row.game_date,
      difficulty: row.difficulty,
      titleKr: drama?.title_kr ?? "—",
      titleEn: drama?.title_en ?? "",
      sceneCode: scene?.scene_code ?? "",
    };
  });
}
