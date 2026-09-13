"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireAdmin } from "@/lib/admin-auth";
import { createSupabaseAdmin } from "@/lib/supabase/admin";

const dramaSchema = z.object({
  titleKr: z.string().min(1),
  titleEn: z.string().min(1),
  year: z.number().int().nullable(),
  network: z.string().nullable(),
  genres: z.array(z.string()),
  aliases: z.array(z.string()),
  status: z.enum(["draft", "review", "published", "archived"]),
});

export async function createDrama(input: z.input<typeof dramaSchema>) {
  await requireAdmin();
  const parsed = dramaSchema.parse(input);
  const db = await createSupabaseAdmin();

  const { data, error } = await db
    .from("dramas")
    .insert({
      title_kr: parsed.titleKr,
      title_en: parsed.titleEn,
      year: parsed.year,
      network: parsed.network,
      genres: parsed.genres,
      aliases: parsed.aliases.length
        ? parsed.aliases
        : [parsed.titleKr, parsed.titleEn],
      status: parsed.status,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);

  revalidatePath("/admin/dramas");
  return data;
}

export async function listDramas() {
  await requireAdmin();
  const db = await createSupabaseAdmin();
  const { data, error } = await db
    .from("dramas")
    .select("id, title_kr, title_en, year, network, genres, status, aliases")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
}
