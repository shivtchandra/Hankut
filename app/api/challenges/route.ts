import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { dailyGameId, dailySetId, creatorPlayerId, title } = body;

    if (!dailyGameId && !dailySetId) {
      return NextResponse.json({ error: "dailyGameId or dailySetId required" }, { status: 400 });
    }

    const db = await createSupabaseAdmin();

    const { data, error } = await db
      .from("challenges")
      .insert({
        daily_game_id: dailyGameId ?? null,
        daily_set_id: dailySetId ?? null,
        creator_player_id: creatorPlayerId ?? null,
        title: title ?? null,
      })
      .select("id, invite_code, expires_at")
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Failed to create challenge" }, { status: 500 });
    }

    return NextResponse.json({
      id: data.id,
      inviteCode: data.invite_code,
      expiresAt: data.expires_at,
    });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
