export const dynamic = "force-dynamic";

import { GamePage } from "@/components/game/GamePage";
import { getTodayGame, getTodaysFive } from "@/lib/game/today";

export default async function Home() {
  const [{ game, dramas, source }, todaysFive] = await Promise.all([
    getTodayGame(),
    getTodaysFive(),
  ]);

  const dateLabel = new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Seoul",
  })
    .format(new Date(`${game.gameDate}T12:00:00+09:00`))
    .toUpperCase();

  return (
    <GamePage
      game={game}
      dramas={dramas}
      source={source}
      dateLabel={dateLabel}
      todaysFive={todaysFive ?? undefined}
    />
  );
}
