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
  framesUsed,
}: ShareTextOptions): string {
  const blocks = Array.from({ length: 5 }, (_, i) => {
    if (!solved) return "⬛";
    if (i === attempts - 1) return "🟩";
    if (i < attempts - 1) return "🟥";
    return "⬜";
  }).join("");

  const result = solved ? `${attempts}번 만에 성공` : "실패";
  return `${brand} · ${gameDate}\n${blocks}\n${result}\nhttps://jangmyeon.kr`;
}
