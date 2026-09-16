export const SEOUL_TZ = "Asia/Seoul";

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

/** Formats a Date as YYYY-MM-DD on the Seoul clock. */
export function seoulDate(date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: SEOUL_TZ }).format(date);
}

/** Today's puzzle date — the game rolls over at midnight KST. */
export function seoulToday(): string {
  return seoulDate();
}

/** True for a real calendar date in YYYY-MM-DD form (rejects 2026-02-31). */
export function isValidGameDate(value: string): boolean {
  if (!ISO_DATE.test(value)) return false;
  const parsed = new Date(`${value}T12:00:00+09:00`);
  if (Number.isNaN(parsed.getTime())) return false;
  return seoulDate(parsed) === value;
}

/** Moves a puzzle date by whole days, staying on the Seoul clock. */
export function shiftGameDate(gameDate: string, days: number): string {
  const base = new Date(`${gameDate}T12:00:00+09:00`);
  base.setUTCDate(base.getUTCDate() + days);
  return seoulDate(base);
}

/**
 * The newest puzzle a player may open. Never past today in Seoul, and never
 * past the viewer's own calendar day when their clock is behind Seoul — so
 * nobody can peek at a puzzle that is still "tomorrow" for them.
 */
export function latestPlayableDate(viewerToday?: string | null): string {
  const seoul = seoulToday();
  if (viewerToday && isValidGameDate(viewerToday) && viewerToday < seoul) {
    return viewerToday;
  }
  return seoul;
}

/** Cookie holding the viewer's UTC offset in minutes, as getTimezoneOffset(). */
export const VIEWER_TZ_COOKIE = "dc_tz";

/** Calendar day for a UTC offset in getTimezoneOffset() form (IST = -330). */
export function dateFromUtcOffset(offsetMinutes: number): string {
  const shifted = new Date(Date.now() - offsetMinutes * 60_000);
  return shifted.toISOString().slice(0, 10);
}

/** Calendar day in an IANA time zone, or "" if the zone is unusable. */
export function dateInTimeZone(timeZone: string): string {
  try {
    return new Intl.DateTimeFormat("en-CA", { timeZone }).format(new Date());
  } catch {
    return "";
  }
}

/**
 * The viewer's puzzle day: their own calendar day, capped at Seoul's day so
 * clocks ahead of Korea can't unlock an unreleased cut. Falls back to Seoul
 * until the client reports its offset.
 */
export function resolveViewerToday(hint: {
  offsetMinutes?: number | null;
  timeZone?: string | null;
}): string {
  const { offsetMinutes, timeZone } = hint;

  // Real offsets stay within ±14h; anything wider is a tampered cookie.
  if (
    typeof offsetMinutes === "number" &&
    Number.isFinite(offsetMinutes) &&
    Math.abs(offsetMinutes) <= 840
  ) {
    return latestPlayableDate(dateFromUtcOffset(offsetMinutes));
  }

  if (timeZone) {
    const byZone = dateInTimeZone(timeZone);
    if (byZone) return latestPlayableDate(byZone);
  }

  return seoulToday();
}

/** Unplayable: malformed, or ahead of the latest released puzzle. */
export function isBlockedGameDate(
  gameDate: string,
  viewerToday?: string | null,
): boolean {
  if (!isValidGameDate(gameDate)) return true;
  return gameDate > latestPlayableDate(viewerToday);
}
