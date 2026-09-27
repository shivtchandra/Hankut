#!/usr/bin/env tsx
import { execSync, spawnSync } from "child_process";
import fs from "fs";
import path from "path";

/**
 * Script to extract random/distributed screengrabs from local videos or YouTube clips.
 * 
 * Usage:
 *   npx tsx scripts/grab-frames.ts --url "https://www.youtube.com/watch?v=..." --name "queen-of-tears" --count 5
 *   npx tsx scripts/grab-frames.ts --file "./sample.mp4" --name "crash-landing" --count 8
 */

function parseArgs() {
  const args = process.argv.slice(2);
  const params: Record<string, string> = {};

  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith("--")) {
      const key = args[i].replace(/^--/, "");
      const next = args[i + 1];
      if (next && !next.startsWith("--")) {
        params[key] = next;
        i++;
      } else {
        params[key] = "true";
      }
    }
  }

  return {
    url: params.url || params.u,
    file: params.file || params.f,
    name: params.name || params.n || ("scene-" + Date.now()),
    count: parseInt(params.count || params.c || "5", 10),
    outDir: params.out || path.join(process.cwd(), "extracted_frames"),
  };
}

function checkTool(tool: string) {
  const res = spawnSync("which", [tool], { encoding: "utf-8" });
  if (res.status !== 0) {
    console.error("❌ Error: Required tool " + tool + " is not installed or not in PATH.");
    process.exit(1);
  }
}

function getVideoDuration(filePath: string): number {
  const result = execSync(
    "ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 \"" + filePath + "\"",
    { encoding: "utf-8" }
  );
  const duration = parseFloat(result.trim());
  if (isNaN(duration) || duration <= 0) {
    throw new Error("Could not determine video duration for " + filePath);
  }
  return duration;
}

function formatTimestamp(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 100);
  return (
    hrs.toString().padStart(2, "0") +
    ":" +
    mins.toString().padStart(2, "0") +
    ":" +
    secs.toString().padStart(2, "0") +
    "." +
    ms.toString().padStart(2, "0")
  );
}

async function main() {
  const { url, file, name, count, outDir } = parseArgs();

  if (!url && !file) {
    console.log(`
🎬 Dramacut Frame Grabber CLI

Usage:
  npx tsx scripts/grab-frames.ts --url <YouTube_URL> --name <drama-slug> [--count 5]
  npx tsx scripts/grab-frames.ts --file <local_video.mp4> --name <drama-slug> [--count 5]

Options:
  --url, -u     YouTube URL to download and extract from
  --file, -f    Local video file path
  --name, -n    Output folder name (e.g. \x27queen-of-tears-ep04\x27)
  --count, -c   Number of random frames to extract (default: 5)
  --out         Base output directory (default: ./extracted_frames)
    `);
    process.exit(0);
  }

  checkTool("ffmpeg");
  checkTool("ffprobe");

  const targetDir = path.join(outDir, name);
  fs.mkdirSync(targetDir, { recursive: true });

  let videoPath = file;
  let tempVideoDownloaded = false;

  if (url) {
    checkTool("yt-dlp");
    console.log("📥 Downloading video from YouTube: " + url + "...");
    const tempFile = path.join(targetDir, "_source_" + Date.now() + ".mp4");    // Download best video with reliable mobile/web player client fallback
    execSync(
      `yt-dlp --no-update --extractor-args "youtube:player_client=android,mweb,ios,web" -f "best[height<=1080]/bestvideo[height<=1080]+bestaudio/best" "${url}" -o "${tempFile}"`,
      { stdio: "inherit" }
    );
    videoPath = tempFile;
    tempVideoDownloaded = true;
  }

  if (!videoPath || !fs.existsSync(videoPath)) {
    console.error("❌ Video file not found: " + videoPath);
    process.exit(1);
  }

  const duration = getVideoDuration(videoPath);
  console.log("⏱️ Video duration: " + Math.round(duration) + "s (~" + (duration / 60).toFixed(1) + " mins)");

  const startOffset = Math.min(10, duration * 0.05);
  const endOffset = Math.max(duration - 10, duration * 0.95);
  const playableDuration = endOffset - startOffset;

  if (playableDuration <= 0) {
    console.error("❌ Video is too short to extract distributed frames.");
    process.exit(1);
  }

  const chunkSize = playableDuration / count;
  const timestamps: number[] = [];

  for (let i = 0; i < count; i++) {
    const chunkStart = startOffset + i * chunkSize;
    const randomInChunk = chunkStart + Math.random() * (chunkSize * 0.85);
    timestamps.push(randomInChunk);
  }

  console.log("📸 Extracting " + count + " random frames...");

  timestamps.forEach((sec, idx) => {
    const frameIndex = idx + 1;
    const outFile = path.join(targetDir, "frame-" + frameIndex + ".jpg");
    const timeFormatted = formatTimestamp(sec);

    execSync(
      "ffmpeg -y -ss " + timeFormatted + " -i \"" + videoPath + "\" -frames:v 1 -q:v 2 \"" + outFile + "\"",
      { stdio: "ignore" }
    );
    console.log("  ✓ Frame " + frameIndex + "/" + count + " extracted at " + timeFormatted + " -> " + path.relative(process.cwd(), outFile));
  });

  if (tempVideoDownloaded && videoPath && fs.existsSync(videoPath)) {
    console.log("🧹 Cleaning up source video download...");
    fs.unlinkSync(videoPath);
  }

  console.log("\n🎉 Done! All frames saved to: " + targetDir);
}

main().catch((err) => {
  console.error("❌ Error:", err);
  process.exit(1);
});
