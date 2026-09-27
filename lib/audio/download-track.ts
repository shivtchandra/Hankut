import { execFile } from "child_process";
import fs from "fs";
import os from "os";
import path from "path";
import { promisify } from "util";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { mediaPublicUrl } from "@/lib/storage/media";

const execFileAsync = promisify(execFile);

export type DownloadAudioResult =
  | { ok: true; audioUrl: string }
  | { ok: false; error: string };

/**
 * Searches for and downloads the full song audio (MP3) matching the given track title & artist,
 * then uploads it to Supabase media storage under audio/ and returns its public URL.
 */
export async function downloadFullTrackAudio(
  title: string,
  artist: string,
): Promise<DownloadAudioResult> {
  const cleanTitle = title.trim();
  const cleanArtist = artist.trim();
  if (!cleanTitle && !cleanArtist) {
    return { ok: false, error: "Track title or artist is required" };
  }

  const query = `${cleanTitle} ${cleanArtist} audio`.trim();
  const fileId = crypto.randomUUID();
  const tempPrefix = path.join(os.tmpdir(), `spotify-full-${fileId}`);
  const expectedMp3 = `${tempPrefix}.mp3`;

  const customEnv = {
    ...process.env,
    PATH: `/opt/homebrew/bin:/usr/local/bin:${process.env.PATH || ""}`,
  };

  try {
    // Search YouTube and extract audio to MP3 using yt-dlp & ffmpeg
    await execFileAsync(
      "yt-dlp",
      [
        "--no-update",
        "--no-playlist",
        "-x",
        "--audio-format",
        "mp3",
        "--audio-quality",
        "5",
        "-o",
        `${tempPrefix}.%(ext)s`,
        `ytsearch1:${query}`,
      ],
      {
        env: customEnv,
        timeout: 45000,
      },
    );

    if (!fs.existsSync(expectedMp3)) {
      return { ok: false, error: "Audio download completed but output file not found" };
    }

    const fileBuffer = await fs.promises.readFile(expectedMp3);
    const storagePath = `audio/${crypto.randomUUID()}.mp3`;

    const db = await createSupabaseAdmin();
    const { error: uploadError } = await db.storage
      .from("media")
      .upload(storagePath, fileBuffer, {
        contentType: "audio/mpeg",
        upsert: true,
      });

    if (uploadError) {
      return { ok: false, error: uploadError.message };
    }

    const publicUrl = mediaPublicUrl(storagePath);
    return { ok: true, audioUrl: publicUrl };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.warn("[downloadFullTrackAudio] Failed to download full audio:", message);
    return { ok: false, error: message };
  } finally {
    try {
      if (fs.existsSync(expectedMp3)) {
        await fs.promises.unlink(expectedMp3);
      }
    } catch {}
  }
}
