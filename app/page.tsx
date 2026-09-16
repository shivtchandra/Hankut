export const dynamic = "force-dynamic";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { GamePage } from "@/components/game/GamePage";
import { ViewerClockSync } from "@/components/game/ViewerClockSync";
import { getTodayGame } from "@/lib/game/today";
import {
  VIEWER_TZ_COOKIE,
  isValidGameDate,
  resolveViewerToday,
} from "@/lib/game/dates";

type Props = {
  searchParams: Promise<{ date?: string }>;
};

export default async function Home({ searchParams }: Props) {
  const { date } = (await searchParams) || {};

  const [cookieStore, headerList] = await Promise.all([cookies(), headers()]);
  const storedOffset = cookieStore.get(VIEWER_TZ_COOKIE)?.value;

  // The viewer's own day, capped at Seoul's day so no unreleased cut leaks.
  const today = resolveViewerToday({
    offsetMinutes: storedOffset ? Number(storedOffset) : null,
    timeZone: headerList.get("x-vercel-ip-timezone"),
  });

  // Today lives at the clean "/" URL; malformed or unreleased dates go there too.
  if (date && (!isValidGameDate(date) || date >= today)) {
    redirect("/");
  }

  const { game, dramas, source } = await getTodayGame(date || today);

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
    <>
      <ViewerClockSync />
      <GamePage
        game={game}
        dramas={dramas}
        source={source}
        dateLabel={dateLabel}
        todayDate={today}
      />
    </>
  );
}
