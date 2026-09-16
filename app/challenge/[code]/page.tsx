import { redirect } from "next/navigation";
import { isValidGameDate, seoulToday } from "@/lib/game/dates";

type Props = {
  params: Promise<{ code: string }>;
};

/** Older challenge links used /challenge/<code>; send them to the puzzle itself. */
export default async function ChallengePage({ params }: Props) {
  const { code } = await params;

  if (isValidGameDate(code) && code < seoulToday()) {
    redirect(`/?date=${code}&ref=challenge`);
  }

  redirect("/?ref=challenge");
}
