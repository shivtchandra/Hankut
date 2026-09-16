import { AudioStudio } from "@/components/admin/AudioStudio";
import { loadSongPuzzle } from "@/app/admin/audio/actions";
import { seoulToday } from "@/lib/game/dates";

type Props = {
  searchParams: Promise<{ date?: string }>;
};

export default async function AudioStudioPage({ searchParams }: Props) {
  const { date } = (await searchParams) || {};
  const initial = await loadSongPuzzle(date);

  return (
    <AudioStudio initial={initial} defaultGameDate={date || seoulToday()} />
  );
}
