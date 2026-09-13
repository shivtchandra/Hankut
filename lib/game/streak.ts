const STREAK_KEY = "scene-streak";

type StreakState = {
  count: number;
  lastDate: string | null;
};

function read(): StreakState {
  if (typeof window === "undefined") return { count: 0, lastDate: null };
  try {
    const raw = window.localStorage.getItem(STREAK_KEY);
    if (!raw) return { count: 0, lastDate: null };
    return JSON.parse(raw) as StreakState;
  } catch {
    return { count: 0, lastDate: null };
  }
}

function write(state: StreakState) {
  window.localStorage.setItem(STREAK_KEY, JSON.stringify(state));
}

function yesterdayOf(isoDate: string) {
  const d = new Date(`${isoDate}T12:00:00+09:00`);
  d.setDate(d.getDate() - 1);
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
  }).format(d);
}

export function getStreak() {
  return read().count;
}

/** Call when the player finishes today's puzzle (solved or exhausted). */
export function recordDailyPlay(gameDate: string) {
  const current = read();
  if (current.lastDate === gameDate) {
    return current.count;
  }

  const expectedPrev = yesterdayOf(gameDate);
  const nextCount =
    current.lastDate === expectedPrev ? current.count + 1 : 1;

  write({ count: nextCount, lastDate: gameDate });
  return nextCount;
}

export function buildShareText(input: {
  brand: string;
  gameDate: string;
  solved: boolean;
  attempts: number;
  framesUsed: number;
}) {
  const squares = Array.from({ length: 5 }, (_, i) => {
    if (i < input.framesUsed - 1) return "⬛";
    if (i === input.framesUsed - 1) {
      return input.solved ? "🟩" : "🟥";
    }
    return "⬜";
  }).join("");

  const score = input.solved ? `${input.attempts}/5` : "X/5";
  return `${input.brand} ${input.gameDate}\n${score}\n${squares}`;
}
