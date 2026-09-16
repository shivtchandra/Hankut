const KEY = "jangmyeon-streak";

type StoredStreak = {
  streak: number;
  lastPlayed: string;
};

function todayKST(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Seoul" });
}

function readStored(): StoredStreak {
  if (typeof window === "undefined") return { streak: 0, lastPlayed: "" };
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { streak: 0, lastPlayed: "" };
    return JSON.parse(raw) as StoredStreak;
  } catch {
    return { streak: 0, lastPlayed: "" };
  }
}

function computeNext(gameDate: string): StoredStreak {
  const current = readStored();
  if (current.lastPlayed === gameDate) return current;

  const prev = new Date(`${gameDate}T12:00:00+09:00`);
  prev.setDate(prev.getDate() - 1);
  const yesterday = prev.toLocaleDateString("en-CA", { timeZone: "Asia/Seoul" });

  const newStreak = current.lastPlayed === yesterday ? current.streak + 1 : 1;
  const data: StoredStreak = { streak: newStreak, lastPlayed: gameDate };
  try { localStorage.setItem(KEY, JSON.stringify(data)); } catch {}
  return data;
}

/** Returns current streak count (0 if none). */
export function getStreak(): number {
  return readStored().streak;
}

/** Records a completed play for gameDate; returns new streak count. */
export function recordDailyPlay(gameDate: string): number {
  return computeNext(gameDate).streak;
}

/** Alias used by SceneGameView — records using today's KST date. */
export function recordPlay(): number {
  return recordDailyPlay(todayKST());
}

type ShareTextOptions = {
  brand: string;
  gameDate: string;
  solved: boolean;
  attempts: number;
  framesUsed: number;
};

export function buildShareText({
  brand,
  gameDate,
  solved,
  attempts,
}: ShareTextOptions): string {
  const blocks = Array.from({ length: 5 }, (_, i) => {
    if (!solved) return "⬛";
    if (i === attempts - 1) return "🟩";
    if (i < attempts - 1) return "🟥";
    return "⬜";
  }).join("");

  const result = solved ? `${attempts}/5 Attempts (${attempts}번 만에 성공)` : "Failed (실패)";
  const origin = typeof window !== "undefined" ? window.location.origin : "https://dramacut.com";
  return `${brand} · ${gameDate}\n${blocks}\n${result}\nCan you guess today's K-drama cut?\n${origin}`;
}

export type StoredDailyGame = {
  gameDate: string;
  attempts: string[];
  solved: boolean;
  frame: number;
  completed: boolean;
};

const GAME_STATE_KEY = "dramacut_game_state_";

export function getDailyGameState(gameDate: string): StoredDailyGame | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(`${GAME_STATE_KEY}${gameDate}`);
    if (!raw) return null;
    return JSON.parse(raw) as StoredDailyGame;
  } catch {
    return null;
  }
}

export function saveDailyGameState(state: StoredDailyGame): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(`${GAME_STATE_KEY}${state.gameDate}`, JSON.stringify(state));
  } catch {}
}

