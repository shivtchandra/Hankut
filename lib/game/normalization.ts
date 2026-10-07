// Hangul Initial Consonants (초성) List
const INITIAL_CONSONANTS = [
  "ㄱ", "ㄲ", "ㄴ", "ㄷ", "ㄸ", "ㄹ", "ㅁ", "ㅂ", "ㅃ",
  "ㅅ", "ㅆ", "ㅇ", "ㅈ", "ㅉ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"
];

/**
 * Expands common English contractions (e.g. "I'm" -> "I am", "Don't" -> "Do not")
 * so that players can type either variant and match interchangeably.
 */
export function expandContractions(text: string): string {
  if (!text) return "";
  return text
    .replace(/\b(?:i['’]?m)\b/gi, "i am")
    .replace(/\b(?:you['’]?re)\b/gi, "you are")
    .replace(/\b(?:he['’]?s)\b/gi, "he is")
    .replace(/\b(?:she['’]?s)\b/gi, "she is")
    .replace(/\b(?:it['’]?s)\b/gi, "it is")
    .replace(/\b(?:we['’]?re)\b/gi, "we are")
    .replace(/\b(?:they['’]?re)\b/gi, "they are")
    .replace(/\b(?:that['’]?s)\b/gi, "that is")
    .replace(/\b(?:what['’]?s)\b/gi, "what is")
    .replace(/\b(?:who['’]?s)\b/gi, "who is")
    .replace(/\b(?:there['’]?s)\b/gi, "there is")
    .replace(/\b(?:here['’]?s)\b/gi, "here is")
    .replace(/\b(?:where['’]?s)\b/gi, "where is")
    .replace(/\b(?:let['’]?s)\b/gi, "let us")
    .replace(/\b(?:don['’]?t)\b/gi, "do not")
    .replace(/\b(?:doesn['’]?t)\b/gi, "does not")
    .replace(/\b(?:didn['’]?t)\b/gi, "did not")
    .replace(/\b(?:can['’]?t|cannot)\b/gi, "can not")
    .replace(/\b(?:won['’]?t)\b/gi, "will not")
    .replace(/\b(?:wouldn['’]?t)\b/gi, "would not")
    .replace(/\b(?:shouldn['’]?t)\b/gi, "should not")
    .replace(/\b(?:couldn['’]?t)\b/gi, "could not")
    .replace(/\b(?:isn['’]?t)\b/gi, "is not")
    .replace(/\b(?:aren['’]?t)\b/gi, "are not")
    .replace(/\b(?:wasn['’]?t)\b/gi, "was not")
    .replace(/\b(?:weren['’]?t)\b/gi, "were not")
    .replace(/\b(?:haven['’]?t)\b/gi, "have not")
    .replace(/\b(?:hasn['’]?t)\b/gi, "has not")
    .replace(/\b(?:hadn['’]?t)\b/gi, "had not");
}

/**
 * Strips punctuation and spaces without contraction expansion.
 */
export function rawNormalize(value: string): string {
  if (!value) return "";
  return value
    .toLowerCase()
    .normalize("NFC")
    .replace(/[^\w\u3131-\u318E\uAC00-\uD7A3]/g, "")
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
 * Normalizes text by expanding English contractions, converting to lowercase,
 * stripping spaces and punctuation, and normalizing unicode.
 */
export function normalize(value: string): string {
  if (!value) return "";
  return rawNormalize(expandContractions(value));
}

/**
 * Generates an expanded set of aliases for a drama including:
 * - Original Hangul and English titles
 * - Hangul title without spaces (e.g. "로봇이 아니야" -> "로봇이아니야")
 * - English title without punctuation/apostrophes (e.g. "I'm Not a Robot" -> "Im Not a Robot")
 * - English title with expanded contractions (e.g. "I Am Not a Robot")
 * - English title with contractions if entered expanded
 */
export function generateSmartAliases(
  titleKr: string,
  titleEn: string,
  userAliases: string[] = [],
): string[] {
  const set = new Set<string>();

  const add = (val?: string | null) => {
    if (!val) return;
    const trimmed = String(val).trim();
    if (trimmed) set.add(trimmed);
  };

  add(titleKr);
  add(titleEn);
  userAliases.forEach(add);

  if (titleKr) {
    add(titleKr.replace(/\s+/g, ""));
  }

  if (titleEn) {
    add(titleEn.replace(/['’]/g, ""));

    const expanded = titleEn
      .replace(/\b(?:i['’]?m)\b/gi, "I Am")
      .replace(/\b(?:you['’]?re)\b/gi, "You Are")
      .replace(/\b(?:he['’]?s)\b/gi, "He Is")
      .replace(/\b(?:she['’]?s)\b/gi, "She Is")
      .replace(/\b(?:it['’]?s)\b/gi, "It Is")
      .replace(/\b(?:we['’]?re)\b/gi, "We Are")
      .replace(/\b(?:they['’]?re)\b/gi, "They Are")
      .replace(/\b(?:that['’]?s)\b/gi, "That Is")
      .replace(/\b(?:what['’]?s)\b/gi, "What Is")
      .replace(/\b(?:who['’]?s)\b/gi, "Who Is")
      .replace(/\b(?:there['’]?s)\b/gi, "There Is")
      .replace(/\b(?:here['’]?s)\b/gi, "Here Is")
      .replace(/\b(?:where['’]?s)\b/gi, "Where Is")
      .replace(/\b(?:let['’]?s)\b/gi, "Let Us")
      .replace(/\b(?:don['’]?t)\b/gi, "Do Not")
      .replace(/\b(?:doesn['’]?t)\b/gi, "Does Not")
      .replace(/\b(?:didn['’]?t)\b/gi, "Did Not")
      .replace(/\b(?:can['’]?t|cannot)\b/gi, "Can Not")
      .replace(/\b(?:won['’]?t)\b/gi, "Will Not")
      .replace(/\b(?:wouldn['’]?t)\b/gi, "Would Not")
      .replace(/\b(?:shouldn['’]?t)\b/gi, "Should Not")
      .replace(/\b(?:couldn['’]?t)\b/gi, "Could Not")
      .replace(/\b(?:isn['’]?t)\b/gi, "Is Not")
      .replace(/\b(?:aren['’]?t)\b/gi, "Are Not")
      .replace(/\b(?:wasn['’]?t)\b/gi, "Was Not")
      .replace(/\b(?:weren['’]?t)\b/gi, "Were Not");

    if (expanded !== titleEn) add(expanded);

    const contracted = titleEn
      .replace(/\bi am\b/gi, "I'm")
      .replace(/\byou are\b/gi, "You're")
      .replace(/\bhe is\b/gi, "He's")
      .replace(/\bshe is\b/gi, "She's")
      .replace(/\bit is\b/gi, "It's")
      .replace(/\bwe are\b/gi, "We're")
      .replace(/\bthey are\b/gi, "They're")
      .replace(/\bthat is\b/gi, "That's")
      .replace(/\bwhat is\b/gi, "What's")
      .replace(/\bwho is\b/gi, "Who's")
      .replace(/\bthere is\b/gi, "There's")
      .replace(/\bdo not\b/gi, "Don't")
      .replace(/\bdoes not\b/gi, "Doesn't")
      .replace(/\bdid not\b/gi, "Didn't")
      .replace(/\bcan not\b/gi, "Can't")
      .replace(/\bcannot\b/gi, "Can't")
      .replace(/\bwill not\b/gi, "Won't")
      .replace(/\bis not\b/gi, "Isn't")
      .replace(/\bare not\b/gi, "Aren't");

    if (contracted !== titleEn) add(contracted);
  }

  return Array.from(set);
}

/**
 * Checks if a guess matches any alias using normalized comparison,
 * testing both expanded contractions and literal normalized forms.
 */
export function matchesAlias(guess: string, aliases: string[]): boolean {
  if (!guess || !aliases?.length) return false;
  const cleanGuess = normalize(guess);
  const rawGuess = rawNormalize(guess);
  return aliases.some((alias) => {
    const cleanAlias = normalize(alias);
    const rawAlias = rawNormalize(alias);
    return (
      (cleanGuess && cleanAlias && cleanGuess === cleanAlias) ||
      (rawGuess && rawAlias && rawGuess === rawAlias) ||
      (cleanGuess && rawAlias && cleanGuess === rawAlias) ||
      (rawGuess && cleanAlias && rawGuess === cleanAlias)
    );
  });
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
