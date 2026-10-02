import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase/admin";

const NAME_RE = /^[\p{Script=Hangul}A-Za-z0-9_ ]{2,16}$/u;
const GUEST_RE = /^[0-9a-f-]{36}$/i;

export async function GET(req: NextRequest) {
  const guestId = req.nextUrl.searchParams.get("guestId") ?? "";
  if (!GUEST_RE.test(guestId)) {
    return NextResponse.json({ error: "Invalid guestId" }, { status: 400 });
  }

  const db = await createSupabaseAdmin();
  const { data } = await db
    .from("players")
    .select("display_name")
    .eq("guest_id", guestId)
    .maybeSingle();

  return NextResponse.json({ nickname: data?.display_name ?? null });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const guestId = String(body.guestId ?? "");
    const nickname = String(body.nickname ?? "").trim().replace(/\s+/g, " ");

    if (!GUEST_RE.test(guestId)) {
      return NextResponse.json({ error: "Invalid guestId" }, { status: 400 });
    }
    if (!NAME_RE.test(nickname)) {
      return NextResponse.json({ error: "invalid_name" }, { status: 400 });
    }

    const db = await createSupabaseAdmin();

    const { data: taken } = await db
      .from("players")
      .select("guest_id")
      .ilike("display_name", nickname.replace(/[\\%_]/g, "\\$&"))
      .neq("guest_id", guestId)
      .limit(1);
    if (taken && taken.length > 0) {
      return NextResponse.json({ error: "name_taken" }, { status: 409 });
    }

    const { error } = await db
      .from("players")
      .upsert({ guest_id: guestId, display_name: nickname }, { onConflict: "guest_id" });

    if (error) {
      // 23505 = unique violation (race on display_name)
      const status = error.code === "23505" ? 409 : 500;
      return NextResponse.json({ error: status === 409 ? "name_taken" : error.message }, { status });
    }

    return NextResponse.json({ nickname });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
