// Hangul Initial Consonants (초성) List
const INITIAL_CONSONANTS = [
  "ㄱ", "ㄲ", "ㄴ", "ㄷ", "ㄸ", "ㄹ", "ㅁ", "ㅂ", "ㅃ",
  "ㅅ", "ㅆ", "ㅇ", "ㅈ", "ㅉ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"
];

/**
 * Normalizes text by converting to lowercase, stripping spaces and punctuation,
 * and normalizing unicode.
 */
export function normalize(value: string): string {
  if (!value) return "";
  return value
    .toLowerCase()
    .normalize("NFC")
    .replace(/[^\w\u3131-\u318E\uAC00-\uD7A3]/g, "") // Keep alphanumeric + Hangul
    .trim();
}

/**
 * Extracts Korean initial consonants (초성) from a Hangul string.
 * Example: "폭싹 속았수다" -> "ㅍㅆ ㅅㅇㅅㄷ"
 */
export function extractChosung(text: string): string {
  if (!text) return "";
  let result = "";

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const code = char.charCodeAt(0);

    // If Korean Syllable (AC00 - D7A3)
    if (code >= 0xac00 && code <= 0xd7a3) {
      const initialIndex = Math.floor((code - 0xac00) / 588);
      result += INITIAL_CONSONANTS[initialIndex] || char;
    } else if (char === " ") {
      result += " ";
    } else {
      result += char;
    }
  }

  return result;
}

/**
 * Checks if a guess matches any alias using normalized comparison.
 */
export function matchesAlias(guess: string, aliases: string[]): boolean {
  if (!guess || !aliases?.length) return false;
  const cleanGuess = normalize(guess);
  return aliases.some((alias) => normalize(alias) === cleanGuess);
}

/**
 * Checks if a chosung guess matches target chosung string.
 */
export function matchesChosung(guess: string, targetChosung: string, targetFullKr?: string): boolean {
  if (!guess) return false;
  const cleanGuess = normalize(guess);
  const cleanTargetChosung = normalize(targetChosung);

  if (cleanGuess === cleanTargetChosung) return true;

  // Also extract chosung from guess if player typed full hangul
  const extractedFromGuess = normalize(extractChosung(guess));
  if (extractedFromGuess === cleanTargetChosung) return true;

  if (targetFullKr && matchesAlias(guess, [targetFullKr])) return true;

  return false;
}
