export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { GamePage } from "@/components/game/GamePage";
import { TodaysFiveView } from "@/components/game/TodaysFiveView";
import { ViewerClockSync } from "@/components/game/ViewerClockSync";
import { SiteNav } from "@/components/layout/SiteNav";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { getTodayGame, getTodaysFive } from "@/lib/game/today";
import {
  VIEWER_TZ_COOKIE,
  isValidGameDate,
  resolveViewerToday,
  shiftGameDate,
} from "@/lib/game/dates";

type Props = {
  searchParams: Promise<{ date?: string; ref?: string }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { ref } = await searchParams;
  if (ref === "challenge") {
    return {
      title: "⚔️ Can you beat me? · Dramacut",
      description: "Someone challenged you to guess today's K-drama cut. Think you can do better?",
      openGraph: {
        title: "⚔️ Can you beat me? · Dramacut",
        description: "Someone challenged you to guess today's K-drama cut. Think you can do better?",
        images: [{ url: "/api/og?title=Can+you+beat+me%3F&date=CHALLENGE", width: 1200, height: 630 }],
      },
      twitter: {
        card: "summary_large_image",
        title: "⚔️ Can you beat me? · Dramacut",
        description: "Someone challenged you to guess today's K-drama cut. Think you can do better?",
      },
    };
  }
  return {};
}

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

  const targetDate = date || today;
  const [{ game, dramas, source }, todaysFive] = await Promise.all([
    getTodayGame(targetDate),
    getTodaysFive(targetDate),
  ]);

  const dateLabel = new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Seoul",
  })
    .format(new Date(`${targetDate}T12:00:00+09:00`))
    .toUpperCase();

  return (
    <>
      <ViewerClockSync />
      <GamePage
        game={game}
        todaysFive={todaysFive && todaysFive.items.length > 0 ? todaysFive : undefined}
        dramas={dramas}
        source={source}
        dateLabel={dateLabel}
        todayDate={today}
      />
    </>
  );
}
