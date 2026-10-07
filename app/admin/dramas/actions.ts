"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireAdmin } from "@/lib/admin-auth";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { fetchAllRows } from "@/lib/supabase/fetch-all";
import { generateSmartAliases, normalize } from "@/lib/game/normalization";

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

  const smartAliases = generateSmartAliases(
    parsed.titleKr,
    parsed.titleEn,
    parsed.aliases,
  );

  const { data, error } = await db
    .from("dramas")
    .insert({
      title_kr: parsed.titleKr,
      title_en: parsed.titleEn,
      year: parsed.year,
      network: parsed.network,
      genres: parsed.genres,
      aliases: smartAliases,
      status: parsed.status,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);

  revalidatePath("/admin/dramas");
  revalidatePath("/");
  return data;
}

export type QuickDramaInput = {
  titleEn: string;
  titleKr?: string;
  altTitles?: string[];
  year?: number | null;
};

export async function quickCreateDrama(
  input: QuickDramaInput,
): Promise<{ id: string; title_en: string; title_kr: string; aliases: string[] | null }> {
  await requireAdmin();
  const titleEn = input.titleEn.trim();
  const titleKr = input.titleKr?.trim() || titleEn;
  if (!titleEn) throw new Error("English title is required");
  const db = await createSupabaseAdmin();

  // Every spelling players might type: both titles, Korean without spaces, contractions, alt titles.
  const aliases = generateSmartAliases(titleKr, titleEn, input.altTitles ?? []);
  const wantedKeys = new Set(aliases.map(normalize).filter(Boolean));

  // Reuse an existing drama whose title or alias matches, instead of creating a
  // duplicate that players can never find or guess correctly.
  const existing = await fetchAllRows<{ id: string; title_en: string; title_kr: string; aliases: string[] | null; status: string }>(
    (from, to) =>
      db
        .from("dramas")
        .select("id, title_en, title_kr, aliases, status")
        .neq("status", "archived")
        .order("id")
        .range(from, to),
  );
  const match = existing
    .filter((d) => [d.title_en, d.title_kr, ...(d.aliases ?? [])].some((t) => wantedKeys.has(normalize(t))))
    .sort((a, b) => Number(b.status === "published") - Number(a.status === "published"))[0];
  if (match) {
    return { id: match.id, title_en: match.title_en, title_kr: match.title_kr, aliases: match.aliases };
  }

  // Published so it shows in the player autocomplete and its aliases count as correct guesses.
  const { data, error } = await db
    .from("dramas")
    .insert({
      title_en: titleEn,
      title_kr: titleKr,
      year: input.year ?? null,
      status: "published",
      genres: [],
      aliases,
    })
    .select("id, title_en, title_kr, aliases")
    .single();
  if (error) throw new Error(error.message);
  revalidatePath("/admin/dramas");
  revalidatePath("/");
  return data;
}

export async function updateDramaPoster(id: string, posterUrl: string) {
  await requireAdmin();
  const db = await createSupabaseAdmin();
  const { error } = await db
    .from("dramas")
    .update({ poster_url: posterUrl || null })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/dramas/${id}`);
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
