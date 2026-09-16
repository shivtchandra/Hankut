import { notFound } from "next/navigation";
import { ChallengeClient } from "./ChallengeClient";

type Props = {
  params: Promise<{ code: string }>;
};

export default async function ChallengePage({ params }: Props) {
  const { code } = await params;
  const upperCode = code.toUpperCase();

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/api/challenges/${upperCode}`,
    { cache: "no-store" },
  );

  if (!res.ok) notFound();

  const data = await res.json();

  return <ChallengeClient code={upperCode} challenge={data.challenge} players={data.players ?? []} />;
}
