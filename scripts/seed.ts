import { config } from "dotenv";
config({ path: ".env.local" });

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Dramacut — deterministic development seed
 * Compatible with: supabase/migrations/001_initial.sql (+ 002 status values)
 * Run: npm run seed
 * Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 */

type DB = SupabaseClient;

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL in .env.local");
if (!SUPABASE_SERVICE_ROLE_KEY) throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY in .env.local");

const supabase: DB = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const ID = {
  dramas: {
    spring: "00000000-0000-0000-0001-000000000001",
    night: "00000000-0000-0000-0001-000000000002",
    wind: "00000000-0000-0000-0001-000000000003",
    rain: "00000000-0000-0000-0001-000000000004",
    grey: "00000000-0000-0000-0001-000000000005",
    weekend: "00000000-0000-0000-0001-000000000006",
  },
  scenes: {
    spring: "00000000-0000-0000-0002-000000000001",
    night: "00000000-0000-0000-0002-000000000002",
    wind: "00000000-0000-0000-0002-000000000003",
    rain: "00000000-0000-0000-0002-000000000004",
    grey: "00000000-0000-0000-0002-000000000005",
    weekend: "00000000-0000-0000-0002-000000000006",
    healthIncomplete: "00000000-0000-0000-0002-000000000007",
    healthBroken: "00000000-0000-0000-0002-000000000008",
  },
  assets: {
    spring1: "00000000-0000-0000-0003-000000000001",
    spring2: "00000000-0000-0000-0003-000000000002",
    spring3: "00000000-0000-0000-0003-000000000003",
    spring4: "00000000-0000-0000-0003-000000000004",
    spring5: "00000000-0000-0000-0003-000000000005",
    night1: "00000000-0000-0000-0003-000000000006",
    night2: "00000000-0000-0000-0003-000000000007",
    night3: "00000000-0000-0000-0003-000000000008",
    night4: "00000000-0000-0000-0003-000000000009",
    night5: "00000000-0000-0000-0003-000000000010",
    wind1: "00000000-0000-0000-0003-000000000011",
    wind2: "00000000-0000-0000-0003-000000000012",
    wind3: "00000000-0000-0000-0003-000000000013",
    wind4: "00000000-0000-0000-0003-000000000014",
    wind5: "00000000-0000-0000-0003-000000000015",
    rain1: "00000000-0000-0000-0003-000000000016",
    rain2: "00000000-0000-0000-0003-000000000017",
    rain3: "00000000-0000-0000-0003-000000000018",
    rain4: "00000000-0000-0000-0003-000000000019",
    rain5: "00000000-0000-0000-0003-000000000020",
    grey1: "00000000-0000-0000-0003-000000000021",
    grey2: "00000000-0000-0000-0003-000000000022",
    grey3: "00000000-0000-0000-0003-000000000023",
    grey4: "00000000-0000-0000-0003-000000000024",
    grey5: "00000000-0000-0000-0003-000000000025",
    weekend1: "00000000-0000-0000-0003-000000000026",
    weekend2: "00000000-0000-0000-0003-000000000027",
    weekend3: "00000000-0000-0000-0003-000000000028",
    weekend4: "00000000-0000-0000-0003-000000000029",
    weekend5: "00000000-0000-0000-0003-000000000030",
    healthIncomplete1: "00000000-0000-0000-0003-000000000031",
    healthBroken1: "00000000-0000-0000-0003-000000000032",
    healthBroken2: "00000000-0000-0000-0003-000000000033",
    healthBroken3: "00000000-0000-0000-0003-000000000034",
    healthBroken4: "00000000-0000-0000-0003-000000000035",
    healthBroken5: "00000000-0000-0000-0003-000000000036",
  },
  dailyGames: {
    d1: "00000000-0000-0000-0004-000000000001",
    d2: "00000000-0000-0000-0004-000000000002",
    d3: "00000000-0000-0000-0004-000000000003",
    d4: "00000000-0000-0000-0004-000000000004",
    d5: "00000000-0000-0000-0004-000000000005",
    d6: "00000000-0000-0000-0004-000000000006",
    d7: "00000000-0000-0000-0004-000000000007",
  },
  players: {
    minji: "00000000-0000-0000-0005-000000000001",
    junho: "00000000-0000-0000-0005-000000000002",
    seoyeon: "00000000-0000-0000-0005-000000000003",
    haru: "00000000-0000-0000-0005-000000000004",
    doyun: "00000000-0000-0000-0005-000000000005",
  },
  plays: {
    minji: "00000000-0000-0000-0006-000000000001",
    junho: "00000000-0000-0000-0006-000000000002",
    seoyeon: "00000000-0000-0000-0006-000000000003",
    haru: "00000000-0000-0000-0006-000000000004",
    doyun: "00000000-0000-0000-0006-000000000005",
  },
  challenges: {
    main: "00000000-0000-0000-0007-000000000001",
    secondary: "00000000-0000-0000-0007-000000000002",
  },
} as const;

async function assertNoError(operation: string, result: { error: { message: string } | null }) {
  if (result.error) throw new Error(`${operation} failed: ${result.error.message}`);
}

async function upsert(table: string, rows: Record<string, unknown>[], onConflict: string) {
  if (rows.length === 0) return;
  await assertNoError(`Upserting ${table}`, await supabase.from(table).upsert(rows, { onConflict }));
}

async function insert(table: string, rows: Record<string, unknown>[]) {
  if (rows.length === 0) return;
  await assertNoError(`Inserting ${table}`, await supabase.from(table).insert(rows));
}

async function deleteWhereIn(table: string, column: string, values: string[]) {
  if (values.length === 0) return;
  await assertNoError(`Deleting ${table}`, await supabase.from(table).delete().in(column, values));
}

function logSection(title: string) {
  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(title);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
}

type AssetRow = {
  id: string;
  scene_id: string;
  frame_order: number;
  asset_key: string;
  public_url: string;
  mime_type: string;
  width: number;
  height: number;
  file_size: number;
  source_url: string;
  source_note: string;
  rights_status: "approved" | "review_required";
};

function fiveFrames(
  sceneId: string,
  prefix: string,
  ids: readonly [string, string, string, string, string],
): AssetRow[] {
  return ids.map((id, index) => {
    const order = index + 1;
    const file = `frame-${String(order).padStart(2, "0")}.svg`;
    return {
      id,
      scene_id: sceneId,
      frame_order: order,
      asset_key: `demo/scenes/${prefix}/${file}`,
      public_url: `/demo/scenes/${prefix}/${file}`,
      mime_type: "image/svg+xml",
      width: 1600,
      height: 1000,
      file_size: 1200 + order * 137,
      source_url: "demo://fictional",
      source_note: "Synthetic SVG development asset.",
      rights_status: "approved" as const,
    };
  });
}

const dramas = [
  { id: ID.dramas.spring, title_kr: "우리들의 봄날", title_en: "Our Spring Days", aliases: ["우리들의 봄날", "Our Spring Days"], year: 2025, network: "tvN", ott_platform: "StreamOne", genres: ["Drama", "Romance", "Slice of Life"], episode_count: 16, synopsis: "A fictional slice-of-life drama about four friends reconnecting in Seoul.", poster_url: "/demo/posters/our-spring-days.svg", country: "KR", status: "published" },
  { id: ID.dramas.night, title_kr: "서울의 마지막 밤", title_en: "Seoul's Last Night", aliases: ["서울의 마지막 밤", "Seoul's Last Night"], year: 2024, network: "MBC", ott_platform: "StreamOne", genres: ["Mystery", "Thriller"], episode_count: 12, synopsis: "A fictional mystery unfolding across Seoul over one unforgettable night.", poster_url: "/demo/posters/seouls-last-night.svg", country: "KR", status: "published" },
  { id: ID.dramas.wind, title_kr: "바람이 머문 자리", title_en: "Where the Wind Stayed", aliases: ["바람이 머문 자리", "Where the Wind Stayed"], year: 2023, network: "JTBC", ott_platform: "WavePlay", genres: ["Healing", "Romance", "Family"], episode_count: 12, synopsis: "A fictional healing story set beside the sea.", poster_url: "/demo/posters/where-the-wind-stayed.svg", country: "KR", status: "published" },
  { id: ID.dramas.rain, title_kr: "비가 오면 기억해", title_en: "Remember When It Rains", aliases: ["비가 오면 기억해", "Remember When It Rains"], year: 2022, network: "JTBC", ott_platform: "CinemaPlay", genres: ["Drama", "Romance"], episode_count: 10, synopsis: "A fictional romantic drama about memory and second chances.", poster_url: "/demo/posters/remember-when-it-rains.svg", country: "KR", status: "published" },
  { id: ID.dramas.grey, title_kr: "회색 도시", title_en: "The Grey City", aliases: ["회색 도시", "The Grey City"], year: 2021, network: "OCN", ott_platform: "CinemaPlay", genres: ["Crime", "Thriller"], episode_count: 10, synopsis: "A fictional crime thriller moving through an unfamiliar Seoul.", poster_url: "/demo/posters/the-grey-city.svg", country: "KR", status: "published" },
  { id: ID.dramas.weekend, title_kr: "주말 사람들", title_en: "Weekend People", aliases: ["주말 사람들", "Weekend People"], year: 2020, network: "SBS", ott_platform: "StreamOne", genres: ["Variety", "Comedy"], episode_count: 24, synopsis: "A fictional weekend entertainment show.", poster_url: "/demo/posters/weekend-people.svg", country: "KR", status: "published" },
] as const;

const scenes = [
  { id: ID.scenes.spring, drama_id: ID.dramas.spring, scene_code: "SPRING-01", episode: 4, timestamp_start: 118.4, timestamp_end: 131.2, difficulty: 6.8, recognition_score: 0.68, description: "Two friends meet beside a quiet street after rain.", location: "Seoul", characters: ["Han Jiwoo", "Kim Haneul"], status: "published", rights_status: "approved", source_url: "demo://fictional", source_note: "Synthetic development fixture." },
  { id: ID.scenes.night, drama_id: ID.dramas.night, scene_code: "NIGHT-07", episode: 7, timestamp_start: 662.2, timestamp_end: 677.5, difficulty: 7.9, recognition_score: 0.41, description: "A red umbrella appears under Seoul streetlights.", location: "Seoul", characters: ["Joon"], status: "published", rights_status: "approved", source_url: "demo://fictional", source_note: "Synthetic development fixture." },
  { id: ID.scenes.wind, drama_id: ID.dramas.wind, scene_code: "WIND-03", episode: 3, timestamp_start: 422.8, timestamp_end: 438.1, difficulty: 5.6, recognition_score: 0.72, description: "A character watches the ocean from a rocky hill.", location: "Jeju", characters: ["Seo Mira"], status: "published", rights_status: "approved", source_url: "demo://fictional", source_note: "Synthetic development fixture." },
  { id: ID.scenes.rain, drama_id: ID.dramas.rain, scene_code: "RAIN-02", episode: 2, timestamp_start: 201.1, timestamp_end: 216.3, difficulty: 4.9, recognition_score: 0.76, description: "A forgotten photograph is discovered inside a book.", location: "Busan", characters: ["Yuna"], status: "published", rights_status: "approved", source_url: "demo://fictional", source_note: "Synthetic development fixture." },
  { id: ID.scenes.grey, drama_id: ID.dramas.grey, scene_code: "GREY-09", episode: 9, timestamp_start: 721.6, timestamp_end: 738.9, difficulty: 8.2, recognition_score: 0.34, description: "An investigator waits near an empty subway platform.", location: "Seoul", characters: ["Kang Jin"], status: "published", rights_status: "approved", source_url: "demo://fictional", source_note: "Synthetic development fixture." },
  { id: ID.scenes.weekend, drama_id: ID.dramas.weekend, scene_code: "WEEKEND-11", episode: 11, timestamp_start: 88.2, timestamp_end: 103.1, difficulty: 3.8, recognition_score: 0.88, description: "A variety cast plays a fictional street game.", location: "Seoul", characters: ["Minji", "Joonho", "Haru"], status: "published", rights_status: "approved", source_url: "demo://fictional", source_note: "Synthetic development fixture." },
  { id: ID.scenes.healthIncomplete, drama_id: ID.dramas.spring, scene_code: "HEALTH-MISSING-FRAMES", episode: 1, timestamp_start: 10, timestamp_end: 20, difficulty: 5, recognition_score: 0.5, description: "Intentional incomplete scene for content-health tests.", location: "Seoul", characters: ["Fixture"], status: "content_review", rights_status: "approved", source_url: "demo://health-fixture", source_note: "Missing-frames fixture." },
  { id: ID.scenes.healthBroken, drama_id: ID.dramas.night, scene_code: "HEALTH-BROKEN-URL", episode: 1, timestamp_start: 10, timestamp_end: 20, difficulty: 5, recognition_score: 0.5, description: "Intentional broken asset URL scene for health tests.", location: "Seoul", characters: ["Fixture"], status: "content_review", rights_status: "approved", source_url: "demo://health-fixture", source_note: "Broken-URL fixture." },
] as const;

const assets: AssetRow[] = [
  ...fiveFrames(ID.scenes.spring, "our-spring-days", [ID.assets.spring1, ID.assets.spring2, ID.assets.spring3, ID.assets.spring4, ID.assets.spring5]),
  ...fiveFrames(ID.scenes.night, "seouls-last-night", [ID.assets.night1, ID.assets.night2, ID.assets.night3, ID.assets.night4, ID.assets.night5]),
  ...fiveFrames(ID.scenes.wind, "where-the-wind-stayed", [ID.assets.wind1, ID.assets.wind2, ID.assets.wind3, ID.assets.wind4, ID.assets.wind5]),
  ...fiveFrames(ID.scenes.rain, "remember-when-it-rains", [ID.assets.rain1, ID.assets.rain2, ID.assets.rain3, ID.assets.rain4, ID.assets.rain5]),
  ...fiveFrames(ID.scenes.grey, "the-grey-city", [ID.assets.grey1, ID.assets.grey2, ID.assets.grey3, ID.assets.grey4, ID.assets.grey5]),
  ...fiveFrames(ID.scenes.weekend, "weekend-people", [ID.assets.weekend1, ID.assets.weekend2, ID.assets.weekend3, ID.assets.weekend4, ID.assets.weekend5]),
  {
    id: ID.assets.healthIncomplete1,
    scene_id: ID.scenes.healthIncomplete,
    frame_order: 1,
    asset_key: "demo/scenes/health-incomplete/frame-01.svg",
    public_url: "/demo/scenes/health-incomplete/frame-01.svg",
    mime_type: "image/svg+xml",
    width: 1600,
    height: 1000,
    file_size: 1000,
    source_url: "demo://health-fixture",
    source_note: "Only frame 1 — content health fixture.",
    rights_status: "approved",
  },
  ...fiveFrames(ID.scenes.healthBroken, "health-broken", [ID.assets.healthBroken1, ID.assets.healthBroken2, ID.assets.healthBroken3, ID.assets.healthBroken4, ID.assets.healthBroken5]).map((row) =>
    row.frame_order === 5
      ? { ...row, public_url: "/does-not-exist/broken-frame.svg", source_note: "Intentional broken asset fixture." }
      : row,
  ),
];

const clueRows = [
  { scene_id: ID.scenes.spring, clue_order: 1, type: "year", value: "2025", unlock_after: 1 },
  { scene_id: ID.scenes.spring, clue_order: 2, type: "network", value: "tvN", unlock_after: 2 },
  { scene_id: ID.scenes.spring, clue_order: 3, type: "location", value: "서울", unlock_after: 3 },
  { scene_id: ID.scenes.spring, clue_order: 4, type: "genre", value: "Slice of Life", unlock_after: 4 },
  { scene_id: ID.scenes.night, clue_order: 1, type: "year", value: "2024", unlock_after: 1 },
  { scene_id: ID.scenes.night, clue_order: 2, type: "genre", value: "미스터리", unlock_after: 2 },
  { scene_id: ID.scenes.night, clue_order: 3, type: "location", value: "서울", unlock_after: 3 },
  { scene_id: ID.scenes.night, clue_order: 4, type: "object", value: "빨간 우산", unlock_after: 4 },
  { scene_id: ID.scenes.wind, clue_order: 1, type: "year", value: "2023", unlock_after: 1 },
  { scene_id: ID.scenes.wind, clue_order: 2, type: "network", value: "JTBC", unlock_after: 2 },
  { scene_id: ID.scenes.wind, clue_order: 3, type: "location", value: "제주", unlock_after: 3 },
  { scene_id: ID.scenes.wind, clue_order: 4, type: "genre", value: "Healing", unlock_after: 4 },
  { scene_id: ID.scenes.rain, clue_order: 1, type: "year", value: "2022", unlock_after: 1 },
  { scene_id: ID.scenes.rain, clue_order: 2, type: "network", value: "JTBC", unlock_after: 2 },
  { scene_id: ID.scenes.rain, clue_order: 3, type: "location", value: "부산", unlock_after: 3 },
  { scene_id: ID.scenes.grey, clue_order: 1, type: "year", value: "2021", unlock_after: 1 },
  { scene_id: ID.scenes.grey, clue_order: 2, type: "network", value: "OCN", unlock_after: 2 },
  { scene_id: ID.scenes.grey, clue_order: 3, type: "genre", value: "Crime Thriller", unlock_after: 3 },
  { scene_id: ID.scenes.grey, clue_order: 4, type: "location", value: "서울 지하철", unlock_after: 4 },
  { scene_id: ID.scenes.weekend, clue_order: 1, type: "year", value: "2020", unlock_after: 1 },
  { scene_id: ID.scenes.weekend, clue_order: 2, type: "network", value: "SBS", unlock_after: 2 },
  { scene_id: ID.scenes.weekend, clue_order: 3, type: "genre", value: "Variety", unlock_after: 3 },
] as const;

const dailyGames = [
  { id: ID.dailyGames.d1, game_date: "2026-09-11", scene_id: ID.scenes.spring, difficulty: 6.8, status: "published" },
  { id: ID.dailyGames.d2, game_date: "2026-09-12", scene_id: ID.scenes.night, difficulty: 7.9, status: "scheduled" },
  { id: ID.dailyGames.d3, game_date: "2026-09-13", scene_id: ID.scenes.wind, difficulty: 5.6, status: "scheduled" },
  { id: ID.dailyGames.d4, game_date: "2026-09-14", scene_id: ID.scenes.rain, difficulty: 4.9, status: "scheduled" },
  { id: ID.dailyGames.d5, game_date: "2026-09-15", scene_id: ID.scenes.grey, difficulty: 8.2, status: "scheduled" },
  { id: ID.dailyGames.d6, game_date: "2026-09-16", scene_id: ID.scenes.weekend, difficulty: 3.8, status: "scheduled" },
  { id: ID.dailyGames.d7, game_date: "2026-09-17", scene_id: ID.scenes.spring, difficulty: 6.8, status: "draft" },
] as const;

const players = [
  { id: ID.players.minji, auth_user_id: null, display_name: "민지" },
  { id: ID.players.junho, auth_user_id: null, display_name: "준호" },
  { id: ID.players.seoyeon, auth_user_id: null, display_name: "서연" },
  { id: ID.players.haru, auth_user_id: null, display_name: "하루" },
  { id: ID.players.doyun, auth_user_id: null, display_name: "도윤" },
] as const;

const plays = [
  { id: ID.plays.minji, player_id: ID.players.minji, daily_game_id: ID.dailyGames.d1, attempts: 2, hints_used: 0, solved: true, completed_at: "2026-09-11T04:11:00.000Z" },
  { id: ID.plays.junho, player_id: ID.players.junho, daily_game_id: ID.dailyGames.d1, attempts: 3, hints_used: 1, solved: true, completed_at: "2026-09-11T04:16:00.000Z" },
  { id: ID.plays.seoyeon, player_id: ID.players.seoyeon, daily_game_id: ID.dailyGames.d1, attempts: 5, hints_used: 2, solved: true, completed_at: "2026-09-11T04:22:00.000Z" },
  { id: ID.plays.haru, player_id: ID.players.haru, daily_game_id: ID.dailyGames.d1, attempts: 1, hints_used: 0, solved: true, completed_at: "2026-09-11T04:08:00.000Z" },
  { id: ID.plays.doyun, player_id: ID.players.doyun, daily_game_id: ID.dailyGames.d1, attempts: 0, hints_used: 0, solved: false, completed_at: null },
] as const;

const guesses = [
  { play_id: ID.plays.minji, guessed_drama_id: ID.dramas.night, raw_guess: "서울의 마지막 밤", attempt_number: 1, is_correct: false },
  { play_id: ID.plays.minji, guessed_drama_id: ID.dramas.spring, raw_guess: "우리들의 봄날", attempt_number: 2, is_correct: true },
  { play_id: ID.plays.junho, guessed_drama_id: ID.dramas.wind, raw_guess: "바람이 머문 자리", attempt_number: 1, is_correct: false },
  { play_id: ID.plays.junho, guessed_drama_id: ID.dramas.rain, raw_guess: "비가 오면 기억해", attempt_number: 2, is_correct: false },
  { play_id: ID.plays.junho, guessed_drama_id: ID.dramas.spring, raw_guess: "우리들의 봄날", attempt_number: 3, is_correct: true },
  { play_id: ID.plays.seoyeon, guessed_drama_id: ID.dramas.grey, raw_guess: "회색 도시", attempt_number: 1, is_correct: false },
  { play_id: ID.plays.seoyeon, guessed_drama_id: ID.dramas.night, raw_guess: "서울의 마지막 밤", attempt_number: 2, is_correct: false },
  { play_id: ID.plays.seoyeon, guessed_drama_id: ID.dramas.wind, raw_guess: "바람이 머문 자리", attempt_number: 3, is_correct: false },
  { play_id: ID.plays.seoyeon, guessed_drama_id: ID.dramas.rain, raw_guess: "비가 오면 기억해", attempt_number: 4, is_correct: false },
  { play_id: ID.plays.seoyeon, guessed_drama_id: ID.dramas.spring, raw_guess: "우리들의 봄날", attempt_number: 5, is_correct: true },
  { play_id: ID.plays.haru, guessed_drama_id: ID.dramas.spring, raw_guess: "우리들의 봄날", attempt_number: 1, is_correct: true },
] as const;

const challenges = [
  { id: ID.challenges.main, daily_game_id: ID.dailyGames.d1, creator_player_id: ID.players.minji, invite_code: "SPRING184", expires_at: "2026-09-18T00:00:00.000Z" },
  { id: ID.challenges.secondary, daily_game_id: ID.dailyGames.d1, creator_player_id: ID.players.junho, invite_code: "SEOUL184", expires_at: "2026-09-20T00:00:00.000Z" },
] as const;

async function seed() {
  console.log("\n🎬 Dramacut");
  console.log("Development database seed");
  console.log(`Supabase: ${SUPABASE_URL}`);

  logSection("1. CLEANING PREVIOUS FIXTURES");
  await deleteWhereIn("guesses", "play_id", Object.values(ID.plays));
  await deleteWhereIn("plays", "id", Object.values(ID.plays));
  await deleteWhereIn("challenges", "id", Object.values(ID.challenges));
  await deleteWhereIn("daily_games", "id", Object.values(ID.dailyGames));
  await deleteWhereIn("clues", "scene_id", Object.values(ID.scenes));
  await deleteWhereIn("scene_assets", "id", Object.values(ID.assets));
  await deleteWhereIn("scenes", "id", Object.values(ID.scenes));
  await deleteWhereIn("players", "id", Object.values(ID.players));
  await deleteWhereIn("dramas", "id", Object.values(ID.dramas));
  console.log("✓ Previous fixtures removed");

  logSection("2. DRAMAS");
  await upsert("dramas", dramas.map((r) => ({ ...r })), "id");
  console.log(`✓ Seeded ${dramas.length} dramas`);

  logSection("3. SCENES");
  await upsert("scenes", scenes.map((r) => ({ ...r })), "id");
  console.log(`✓ Seeded ${scenes.length} scenes`);

  logSection("4. SCENE ASSETS");
  await upsert("scene_assets", assets.map((r) => ({ ...r })), "id");
  console.log(`✓ Seeded ${assets.length} asset records`);

  logSection("5. CLUES");
  await upsert("clues", clueRows.map((r) => ({ ...r })), "scene_id,clue_order");
  console.log(`✓ Seeded ${clueRows.length} clues`);

  logSection("6. DAILY GAMES");
  await upsert("daily_games", dailyGames.map((r) => ({ ...r })), "id");
  console.log(`✓ Seeded ${dailyGames.length} daily games`);

  logSection("7. PLAYERS");
  await upsert("players", players.map((r) => ({ ...r })), "id");
  console.log(`✓ Seeded ${players.length} demo players`);

  logSection("8. PLAYS");
  await upsert("plays", plays.map((r) => ({ ...r })), "id");
  console.log(`✓ Seeded ${plays.length} demo plays`);

  logSection("9. GUESSES");
  await insert("guesses", guesses.map((r) => ({ ...r })));
  console.log(`✓ Seeded ${guesses.length} guesses`);

  logSection("10. CHALLENGES");
  await upsert("challenges", challenges.map((r) => ({ ...r })), "id");
  console.log(`✓ Seeded ${challenges.length} challenges`);

  logSection("11. INTEGRITY CHECKS");
  for (const table of ["dramas", "scenes", "scene_assets", "clues", "daily_games", "players", "plays", "guesses", "challenges"]) {
    const result = await supabase.from(table).select("id", { count: "exact", head: true });
    await assertNoError(`Checking ${table}`, result);
    console.log(`✓ ${table}: ${result.count ?? 0}`);
  }

  console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SEED SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Dramas ${dramas.length} | Scenes ${scenes.length} | Assets ${assets.length}
Clues ${clueRows.length} | Daily ${dailyGames.length} | Plays ${plays.length}
Guesses ${guesses.length} | Challenges ${challenges.length}

Published puzzle: 2026-09-11 — 우리들의 봄날
Challenge: /challenge/SPRING184
`);
}

seed().catch((error) => {
  console.error("\n❌ Seed failed\n");
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
