import { seoulToday } from "@/lib/game/dates";
import type { Locale } from "@/lib/i18n/dictionary";

export type ShareOutcome = "shared" | "copied" | "dismissed" | "failed";

const FALLBACK_ORIGIN = "https://dramacut.com";

/** Canonical origin for links people send to each other. */
export function siteOrigin(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL;
  if (configured) return configured.replace(/\/+$/, "");
  if (typeof window !== "undefined" && window.location.origin) {
    return window.location.origin;
  }
  return FALLBACK_ORIGIN;
}

/**
 * Absolute link that opens a specific puzzle. Today's puzzle keeps the clean
 * "/" URL, since a dated link to it would just redirect there.
 */
export function buildPuzzleUrl(
  gameDate: string,
  ref?: string,
  todayDate: string = seoulToday(),
): string {
  const url = new URL("/", `${siteOrigin()}/`);
  if (gameDate < todayDate) url.searchParams.set("date", gameDate);
  if (ref) url.searchParams.set("ref", ref);
  return url.toString();
}

function resultBlocks(solved: boolean, attempts: number): string {
  return Array.from({ length: 5 }, (_, i) => {
    if (i < attempts - 1) return "🟥";
    if (i === attempts - 1) return solved ? "🟩" : "🟥";
    return "⬜";
  }).join("");
}

type ScoreShareOptions = {
  locale: Locale;
  brand: string;
  gameDate: string;
  todayDate: string;
  solved: boolean;
  attempts: number;
  score: number;
};

/** Score share: spoiler-free grid + the link to that day's puzzle. */
export function buildScoreShare({
  locale,
  brand,
  gameDate,
  todayDate,
  solved,
  attempts,
  score,
}: ScoreShareOptions): { title: string; text: string; url: string } {
  const url = buildPuzzleUrl(gameDate, "score", todayDate);
  const blocks = resultBlocks(solved, attempts);

  const summary =
    locale === "ko"
      ? solved
        ? `${attempts}/5 컷에서 성공 · ${score}점`
        : "5컷 모두 실패"
      : solved
        ? `Solved in ${attempts}/5 cuts · ${score} pts`
        : "Missed it in 5 cuts";

  const invite =
    locale === "ko" ? "오늘의 컷, 너도 맞혀볼래?" : "Can you guess today's cut?";

  return {
    title: `${brand} · ${gameDate}`,
    text: `${brand} · ${gameDate}\n${blocks}\n${summary}\n${invite}`,
    url,
  };
}

type ChallengeShareOptions = {
  locale: Locale;
  brand: string;
  gameDate: string;
  todayDate: string;
  solved: boolean;
  attempts: number;
};

/** Challenge share: the same puzzle link, framed as a head-to-head invite. */
export function buildChallengeShare({
  locale,
  brand,
  gameDate,
  todayDate,
  solved,
  attempts,
}: ChallengeShareOptions): { title: string; text: string; url: string } {
  const url = buildPuzzleUrl(gameDate, "challenge", todayDate);

  const blocks = resultBlocks(solved, attempts);

  const mine =
    locale === "ko"
      ? solved
        ? `${attempts}컷 만에 맞췄어 ${blocks}`
        : `5컷 다 봤는데도 못 맞췄어 ${blocks}`
      : solved
        ? `Got it in ${attempts}/5 cuts ${blocks}`
        : `Couldn't crack it in 5 cuts ${blocks}`;

  const dare = locale === "ko" ? "나 이겨볼 수 있어? 👊" : "Think you can beat me? 👊";

  const label = locale === "ko" ? `🎬 ${brand} 대결` : `🎬 ${brand} Challenge`;

  return {
    title: locale === "ko" ? `${brand} 대결 · ${gameDate}` : `${brand} Challenge · ${gameDate}`,
    text: `${label}\n${mine}\n${dare}`,
    url,
  };
}

/** Plain invite to today's puzzle, used by the "Share game" button. */
export function buildInviteShare({
  locale,
  brand,
  gameDate,
  todayDate,
}: {
  locale: Locale;
  brand: string;
  gameDate: string;
  todayDate: string;
}): { title: string; text: string; url: string } {
  return {
    title: brand,
    text:
      locale === "ko"
        ? `${brand} — 한 컷만 보고 드라마 맞히기. 오늘의 컷 풀어보기:`
        : `${brand} — guess the K-drama from one cut. Today's puzzle:`,
    url: buildPuzzleUrl(gameDate, undefined, todayDate),
  };
}

/** Copies a string, falling back to a hidden textarea. Never throws. */
export async function copyToClipboard(value: string): Promise<boolean> {
  if (typeof navigator === "undefined") return false;

  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(value);
      return true;
    }
  } catch {
    // Falls through to the textarea path below.
  }

  // In-app browsers and insecure contexts still need the legacy copy path.
  try {
    const area = document.createElement("textarea");
    area.value = value;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    area.style.pointerEvents = "none";
    document.body.appendChild(area);
    area.select();
    area.setSelectionRange(0, value.length);
    const ok = document.execCommand("copy");
    document.body.removeChild(area);
    return ok;
  } catch {
    return false;
  }
}

/**
 * Hands the payload to the native share sheet when available, otherwise copies
 * message + link to the clipboard. Never throws.
 */
export async function shareOrCopy(payload: {
  title: string;
  text: string;
  url: string;
}): Promise<ShareOutcome> {
  const { title, text, url } = payload;

  if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
    try {
      await navigator.share({ title, text, url });
      return "shared";
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return "dismissed";
      }
      // Any other share failure falls back to copying.
    }
  }

  return (await copyToClipboard(`${text}\n${url}`)) ? "copied" : "failed";
}
