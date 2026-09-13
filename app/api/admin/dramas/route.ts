import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminApi } from "@/lib/admin-auth";
import { createSupabaseAdmin } from "@/lib/supabase/admin";

const schema = z.object({
  titleKr: z.string().min(1),
  titleEn: z.string().min(1),
  year: z.number().int().optional(),
  network: z.string().optional(),
  genres: z.array(z.string()).default([]),
  status: z
    .enum(["draft", "review", "published", "archived"])
    .default("draft"),
});

export async function POST(req: Request) {
  const auth = await requireAdminApi();
  if (!auth.ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = schema.safeParse(await req.json());
  if (!body.success) {
    return NextResponse.json({ error: body.error.flatten() }, { status: 400 });
  }

  const db = await createSupabaseAdmin();
  const { data, error } = await db
    .from("dramas")
    .insert({
      title_kr: body.data.titleKr,
      title_en: body.data.titleEn,
      year: body.data.year ?? null,
      network: body.data.network ?? null,
      genres: body.data.genres,
      aliases: [body.data.titleKr, body.data.titleEn],
      status: body.data.status,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}
