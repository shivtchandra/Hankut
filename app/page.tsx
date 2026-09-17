export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { GamePage } from "@/components/game/GamePage";
import { ViewerClockSync } from "@/components/game/ViewerClockSync";
import { SiteNav } from "@/components/layout/SiteNav";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { getTodayGame } from "@/lib/game/today";
import {
  VIEWER_TZ_COOKIE,
  isValidGameDate,
  resolveViewerToday,
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

  if (source === "demo") {
    return (
      <main className="game-page">
        <ViewerClockSync />
        <SiteNav />
        <div style={{ minHeight: "50vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, padding: "60px 24px", textAlign: "center" }}>
          <p style={{ fontSize: 13, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--muted)", fontFamily: "var(--font-mono, monospace)" }}>
            {dateLabel}
          </p>
          <h1 style={{ fontSize: "clamp(1.4rem, 3vw, 2rem)", fontWeight: 700, margin: 0 }}>
            Today&apos;s cut is being prepared
          </h1>
          <p style={{ fontSize: 15, color: "var(--muted)", maxWidth: 340, margin: 0 }}>
            Come back later — the daily puzzle drops soon.
          </p>
        </div>
        <SiteFooter />
      </main>
    );
  }

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
