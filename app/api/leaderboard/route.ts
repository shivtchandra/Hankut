import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

const PERIODS = new Set(["today", "week", "month", "all"]);

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const period = PERIODS.has(sp.get("period") ?? "") ? sp.get("period")! : "all";
  const guestId = sp.get("guestId") || null;

  const db = await createSupabaseAdmin();
  const { data, error } = await db.rpc("get_leaderboard", {
    p_period: period,
    p_limit: 50,
    p_guest_id: guestId,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ period, rows: data ?? [] });
}
