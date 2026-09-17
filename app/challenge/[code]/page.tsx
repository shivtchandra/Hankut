import { redirect } from "next/navigation";
import { isValidGameDate, seoulToday } from "@/lib/game/dates";
import { createSupabaseAdmin } from "@/lib/supabase/admin";

type Props = {
  params: Promise<{ code: string }>;
};

export default async function ChallengePage({ params }: Props) {
  const { code } = await params;

  // Old-style: code is a game date
  if (isValidGameDate(code) && code < seoulToday()) {
    redirect(`/?date=${code}&ref=challenge`);
  }

  // New-style: invite_code — look up linked daily_game
  try {
    const db = await createSupabaseAdmin();
    const { data: challenge } = await db
      .from("challenges")
      .select("daily_game_id")
      .eq("invite_code", code.toUpperCase())
      .eq("status", "active")
      .maybeSingle();

    if (challenge?.daily_game_id) {
      const { data: game } = await db
        .from("daily_games")
        .select("game_date")
        .eq("id", challenge.daily_game_id)
        .maybeSingle();

      if (game?.game_date) {
        redirect(`/?date=${game.game_date}&ref=challenge&code=${code.toUpperCase()}`);
      }
    }
  } catch {
    // fall through
  }

  redirect(`/?ref=challenge`);
}
