import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase/admin";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ code: string }> },
) {
  try {
    const { code } = await params;
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
      .eq("invite_code", code.toUpperCase())
      .eq("status", "active")
      .maybeSingle();

    if (error || !data) {
      return NextResponse.json({ error: "Challenge not found" }, { status: 404 });
    }

    return NextResponse.json({ challenge: data });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
