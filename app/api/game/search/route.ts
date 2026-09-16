import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase/admin";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim() ?? "";
  const type = searchParams.get("type") ?? "drama";

  if (q.length < 1) return NextResponse.json([]);

  try {
    const db = await createSupabaseAdmin();

    // Map query type to entity type column values
    const entityTypes: Record<string, string[]> = {
      drama: ["drama"],
      song: ["song"],
      person: ["person"],
      drama_or_song: ["drama", "song"],
    };
    const types = entityTypes[type] ?? ["drama"];

    const { data } = await db
      .from("entities")
      .select("id, title_kr, title_en, type")
      .in("type", types)
      .eq("status", "published")
      .or(`title_kr.ilike.%${q}%,title_en.ilike.%${q}%`)
      .limit(10);

    const results = (data ?? []).map((e) => ({
      id: e.id,
      titleKr: e.title_kr,
      titleEn: e.title_en,
      type: e.type,
    }));

    return NextResponse.json(results);
  } catch {
    return NextResponse.json([]);
  }
}
