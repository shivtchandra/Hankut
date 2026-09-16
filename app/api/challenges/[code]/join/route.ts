import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase/admin";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ code: string }> },
) {
  try {
    const { code } = await params;
    const body = await req.json();
    const { guestName, playerId, score = 0, attempts = 0 } = body;

    if (!guestName) {
      return NextResponse.json({ error: "guestName required" }, { status: 400 });
    }

    const db = await createSupabaseAdmin();

    // Resolve challenge id
    const { data: challenge } = await db
      .from("challenges")
      .select("id, status")
      .eq("invite_code", code.toUpperCase())
      .maybeSingle();

    if (!challenge || challenge.status !== "active") {
      return NextResponse.json({ error: "Challenge not found or expired" }, { status: 404 });
    }

    const { data, error } = await db
      .from("challenge_players")
      .insert({
        challenge_id: challenge.id,
        player_id: playerId ?? null,
        guest_name: guestName,
        score,
        attempts,
      })
      .select("id")
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Failed to join challenge" }, { status: 500 });
    }

    return NextResponse.json({ ok: true, id: data.id });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
