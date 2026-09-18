import { NextRequest, NextResponse } from "next/server";
import { fetchGameByDate, fetchDramasList } from "@/lib/game/today";
import { DEMO_DRAMAS, DEMO_TODAY_GAME } from "@/lib/demo-data";
import { isValidGameDate, seoulToday } from "@/lib/game/dates";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const date = req.nextUrl.searchParams.get("date") ?? seoulToday();

  if (!isValidGameDate(date) || date > seoulToday()) {
    return NextResponse.json({ error: "invalid date" }, { status: 400 });
  }

  const configured =
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!configured) {
    return NextResponse.json({
      game: { ...DEMO_TODAY_GAME, gameDate: date },
      dramas: DEMO_DRAMAS,
    });
  }

  try {
    const [game, dramas] = await Promise.all([
      fetchGameByDate(date),
      fetchDramasList(),
    ]);

    if (!game) {
      return NextResponse.json({ game: null, dramas });
    }

    return NextResponse.json({ game, dramas });
  } catch {
    return NextResponse.json(
      { game: { ...DEMO_TODAY_GAME, gameDate: date }, dramas: DEMO_DRAMAS },
    );
  }
}
