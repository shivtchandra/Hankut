import { createSupabaseAdmin } from "@/lib/supabase/admin";

export type MediaFolder = "images" | "audio";

function ext(folder: MediaFolder, fileName: string): string {
  if (folder === "images") return ".webp";
  const f = fileName.toLowerCase();
  if (f.endsWith(".mp3")) return ".mp3";
  if (f.endsWith(".ogg")) return ".ogg";
  if (f.endsWith(".aac")) return ".aac";
  return ".mp3";
}

export async function createMediaUploadUrl(folder: MediaFolder, fileName: string) {
  const db = await createSupabaseAdmin();
  const path = `${folder}/${crypto.randomUUID()}${ext(folder, fileName)}`;
  const { data, error } = await db.storage.from("media").createSignedUploadUrl(path);
  if (error || !data) throw error ?? new Error("Supabase storage upload URL failed");
  return {
    signedUrl: data.signedUrl,
    path,
    publicUrl: mediaPublicUrl(path),
  };
}

export function mediaPublicUrl(path: string): string {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  return `${base}/storage/v1/object/public/media/${path}`;
}
