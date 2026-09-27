import { AudioStudio } from "@/components/admin/AudioStudio";
import { loadSongPuzzle, listSongPuzzles } from "@/app/admin/audio/actions";
import { seoulToday } from "@/lib/game/dates";

type Props = {
  searchParams: Promise<{ date?: string; id?: string }>;
};

export default async function AudioStudioPage({ searchParams }: Props) {
  const { date, id } = (await searchParams) || {};
  const [initial, songList] = await Promise.all([
    loadSongPuzzle(date, id),
    listSongPuzzles(),
  ]);

  return (
    <AudioStudio
      initial={initial}
      songList={songList}
      defaultGameDate={date || seoulToday()}
    />
  );
}
