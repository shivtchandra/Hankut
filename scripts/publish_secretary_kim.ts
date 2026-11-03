import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const SECRETARY_KIM_PUZZLE = {
  id: "e2018001-0000-4000-8000-000000000001",
  type: "scene",
  title: "김비서가 왜 그럴까 (What's Wrong with Secretary Kim)",
  description: "Guess the iconic 2018 K-drama from 5 cinematic scene cuts.",
  difficulty: 5,
  status: "published",
  metadata: {
    episode: 2,
    frames: [
      "/scenes/whats-wrong-with-secretary-kim/frame-1.webp",
      "/scenes/whats-wrong-with-secretary-kim/frame-2.webp",
      "/scenes/whats-wrong-with-secretary-kim/frame-3.webp",
      "/scenes/whats-wrong-with-secretary-kim/frame-4.webp",
      "/scenes/whats-wrong-with-secretary-kim/frame-5.webp",
    ],
    clues: [
      {
        id: "broadcast",
        label: "방영 정보",
        value: "2018 tvN Legend Rom-Com (Peak 8.7% rating) · Based on the hit webtoon by Jung Kyung-yoon",
        unlockAfterAttempt: 1,
      },
      {
        id: "cast",
        label: "주연 배우 & 캐릭터",
        value: "Park Seo-joon × Park Min-young (Lee Young-joon & Kim Mi-so / 박서준 × 박민영)",
        unlockAfterAttempt: 2,
      },
      {
        id: "quote",
        label: "명대사 힌트",
        value: "“김 비서가 왜 그럴까?” — Iconic necktie adjustment scene in the vice chairman's office",
        unlockAfterAttempt: 3,
      },
    ],
    title_kr: "김비서가 왜 그럴까",
    title_en: "What's Wrong with Secretary Kim",
    aliases: [
      "김비서가 왜 그럴까",
      "What's Wrong with Secretary Kim",
      "Whats Wrong with Secretary Kim",
      "김비서가왜그럴까",
      "김비서",
      "이영준",
      "김미소",
      "박서준",
      "박민영",
      "Secretary Kim",
    ],
    year: 2018,
    network: "tvN",
    genres: ["Romance", "Comedy"],
  },
};

export async function publishSecretaryKim(targetDate: string) {
  console.log(`1. Upserting puzzle into 'puzzles' table...`);
  const { error: pErr } = await supabase.from("puzzles").upsert(
    {
      id: SECRETARY_KIM_PUZZLE.id,
      type: SECRETARY_KIM_PUZZLE.type,
      title: SECRETARY_KIM_PUZZLE.title,
      description: SECRETARY_KIM_PUZZLE.description,
      difficulty: SECRETARY_KIM_PUZZLE.difficulty,
      status: SECRETARY_KIM_PUZZLE.status,
      metadata: SECRETARY_KIM_PUZZLE.metadata,
    },
    { onConflict: "id" }
  );
  if (pErr) throw pErr;
  console.log("✓ Upserted What's Wrong with Secretary Kim Scene Cut puzzle");

  console.log(`2. Upserting daily set for ${targetDate}...`);
  const { data: set, error: setErr } = await supabase
    .from("daily_sets")
    .upsert(
      { game_date: targetDate, status: "published" },
      { onConflict: "game_date" }
    )
    .select("id")
    .single();
  if (setErr) throw setErr;
  console.log(`✓ Daily Set ${targetDate} ID: ${set.id}`);

  console.log(`3. Linking puzzle to daily_set_items...`);
  await supabase.from("daily_set_items").delete().eq("daily_set_id", set.id);
  const { error: itemErr } = await supabase.from("daily_set_items").insert({
    daily_set_id: set.id,
    puzzle_id: SECRETARY_KIM_PUZZLE.id,
    position: 1,
  });
  if (itemErr) throw itemErr;
  console.log(`✓ Linked Secretary Kim to ${targetDate} daily set!`);
}

async function main() {
  const dateArg = process.argv[2] || "2026-11-05";
  console.log(`Target publish date: ${dateArg}`);
  await publishSecretaryKim(dateArg);
  console.log("All done!");
}

if (process.argv[1]?.endsWith("publish_secretary_kim.ts")) {
  main().catch(console.error);
}
