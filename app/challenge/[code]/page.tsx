import { notFound } from "next/navigation";
import { ChallengeClient } from "./ChallengeClient";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ code: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { code } = await params;
  const upperCode = code.toUpperCase();
  const title = `Challenge #${upperCode} — Dramacut K-Drama Duel`;
  const description = `You have been invited to a K-drama trivia duel! Solve the scene cut puzzle and see if you can beat the score on Dramacut.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: `/api/og?title=${encodeURIComponent(
            `Challenge #${upperCode}`
          )}&date=K-DRAMA%20DUEL&score=25`,
          width: 1200,
          height: 630,
          alt: `Challenge ${upperCode} on Dramacut`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [
        `/api/og?title=${encodeURIComponent(
          `Challenge #${upperCode}`
        )}&date=K-DRAMA%20DUEL&score=25`,
      ],
    },
  };
}

export default async function ChallengePage({ params }: Props) {
  const { code } = await params;
  const upperCode = code.toUpperCase();

  try {
    const db = await createSupabaseAdmin();
    const { data, error } = await db
      .from("challenges")
      .select(`
        id,
        invite_code,
        title,
        expires_at,
        status,
        daily_game_id,
        daily_set_id,
        challenge_players (
          id,
          guest_name,
          score,
          attempts,
          completed_at,
          rank
        )
      `)
      .eq("invite_code", upperCode)
      .eq("status", "active")
      .maybeSingle();

    if (error || !data) {
      // Fallback for demo challenges or unrecorded codes
      return (
        <ChallengeClient
          code={upperCode}
          challenge={{
            id: `demo-${upperCode}`,
            invite_code: upperCode,
            title: `K-Drama Challenge #${upperCode}`,
            expires_at: null,
            status: "active",
          }}
          players={[
            {
              id: "demo-host",
              display_name: "Host Player",
              score: 25,
              completed_at: new Date().toISOString(),
            },
          ]}
        />
      );
    }

    const players = (data.challenge_players || []).map((p: any) => ({
      id: p.id,
      display_name: p.guest_name,
      score: p.score,
      completed_at: p.completed_at,
    }));

    return (
      <ChallengeClient
        code={upperCode}
        challenge={data}
        players={players}
      />
    );
  } catch {
    // Graceful fallback if database environment variables are not present
    return (
      <ChallengeClient
        code={upperCode}
        challenge={{
          id: `demo-${upperCode}`,
          invite_code: upperCode,
          title: `K-Drama Challenge #${upperCode}`,
          expires_at: null,
          status: "active",
        }}
        players={[
          {
            id: "demo-host",
            display_name: "Host Player",
            score: 25,
            completed_at: new Date().toISOString(),
          },
        ]}
      />
    );
  }
}
