import { listDailyGames } from "../daily/actions";
import { getSceneStudio } from "../scenes/actions";
import { seoulDate } from "@/lib/game/today";
import { CalendarPickerView } from "@/components/admin/CalendarPickerView";

type Props = {
  searchParams: Promise<{
    month?: string;
    publishSceneId?: string;
    publishedDate?: string;
    publishedTitle?: string;
  }>;
};

export default async function CalendarPage({ searchParams }: Props) {
  const sp = await searchParams;
  const today = seoulDate();
  const monthPrefix = sp.month ?? today.slice(0, 7);

  let rows: Awaited<ReturnType<typeof listDailyGames>> = [];

  try {
    rows = await listDailyGames(monthPrefix);
  } catch {
    rows = [];
  }

  let publishTitle: string | undefined = undefined;
  if (sp.publishSceneId) {
    try {
      const sceneData = await getSceneStudio(sp.publishSceneId);
      const drama = Array.isArray(sceneData.drama) ? sceneData.drama[0] : sceneData.drama;
      publishTitle = drama?.title_kr ?? sceneData.scene_code;
    } catch {
      publishTitle = "Scene Puzzle";
    }
  }

  const [year, month] = monthPrefix.split("-").map(Number);
  const first = new Date(Date.UTC(year, month - 1, 1));
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const startPad = (first.getUTCDay() + 6) % 7;

  const cells: ({ day: number; iso: string } | null)[] = [
    ...Array.from({ length: startPad }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => {
      const day = i + 1;
      const iso = `${monthPrefix}-${String(day).padStart(2, "0")}`;
      return { day, iso };
    }),
  ];

  const monthLabel = first.toLocaleString("en", { month: "long", year: "numeric" });
  const rowsByDate: [string, (typeof rows)[number]][] = rows.map((r) => [r.game_date, r]);

  return (
    <CalendarPickerView
      today={today}
      monthLabel={monthLabel}
      cells={cells}
      rowsByDate={rowsByDate as never}
      publishSceneId={sp.publishSceneId}
      publishTitle={publishTitle}
      publishedDate={sp.publishedDate}
      publishedTitle={sp.publishedTitle}
    />
  );
}
