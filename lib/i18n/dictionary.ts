export type Locale = "en" | "ko";

export const dictionaries = {
  en: {
    brandName: "Dramacut",
    brandMark: "컷",
    tagline: "One cut. Guess the K-drama.",
    navArchive: "Archive",
    navLeaderboard: "Ranking",
    navProfile: "My record",
    todayScene: "Today's cut",
    yourGuess: "Your guess",
    whatDrama: "What drama is this?",
    guessPlaceholder: "Enter a drama title",
    guess: "Guess",
    locked: "Locked",
    reveal: "Reveal",
    enterTitle: "Please enter a drama title.",
    correct: "Correct!",
    wrongNext: "Not quite. Check the next cut.",
    seeAnswer: "Here's today's answer.",
    answerEyebrow: "Correct",
    answerReveal: "Today's answer",
    solvedIn: "guesses to solve",
    challengeFriend: "Challenge a friend",
    shareResult: "Share result",
    shareCopied: "Result copied — paste it in your group chat.",
    shareFailed: "Could not copy.",
    emptyScene: "Cut unavailable",
    everyDay: "A new cut every day",
    streak: "day streak",
    sceneLabel: "Cut",
    attemptsOf: "/5",
    noSuggestions: "No matches",
  },
  ko: {
    brandName: "드라마컷",
    brandMark: "컷",
    tagline: "한 컷만 보고, 드라마를 맞혀보세요.",
    navArchive: "지난 컷",
    navLeaderboard: "덕력 랭킹",
    navProfile: "내 기록",
    todayScene: "오늘의 컷",
    yourGuess: "추측",
    whatDrama: "어떤 드라마일까요?",
    guessPlaceholder: "드라마 제목을 입력하세요",
    guess: "추측",
    locked: "잠금",
    reveal: "힌트 보기",
    enterTitle: "드라마 제목을 입력해 주세요.",
    correct: "정답이에요!",
    wrongNext: "아쉽네요. 다음 컷을 확인해 보세요.",
    seeAnswer: "오늘의 정답을 확인해 보세요.",
    answerEyebrow: "정답이에요",
    answerReveal: "오늘의 정답",
    solvedIn: "번 만에 성공",
    challengeFriend: "친구에게 도전",
    shareResult: "결과 공유",
    shareCopied: "결과가 복사됐어요. 단톡에 붙여넣으세요.",
    shareFailed: "복사에 실패했어요.",
    emptyScene: "컷을 불러올 수 없어요",
    everyDay: "매일 새로운 컷",
    streak: "일 연속",
    sceneLabel: "컷",
    attemptsOf: "/5",
    noSuggestions: "검색 결과 없음",
  },
} as const;

export type DictionaryKey = keyof typeof dictionaries.en;

/** Map common clue type keys / Korean labels for bilingual display */
export const clueLabelMap: Record<string, { en: string; ko: string }> = {
  year: { en: "Year", ko: "방영" },
  방영: { en: "Year", ko: "방영" },
  platform: { en: "Platform", ko: "플랫폼" },
  플랫폼: { en: "Platform", ko: "플랫폼" },
  network: { en: "Network", ko: "방송사" },
  방송사: { en: "Network", ko: "방송사" },
  location: { en: "Setting", ko: "배경" },
  setting: { en: "Setting", ko: "배경" },
  배경: { en: "Setting", ko: "배경" },
  actor: { en: "Cast", ko: "출연" },
  cast: { en: "Cast", ko: "출연" },
  출연: { en: "Cast", ko: "출연" },
  genre: { en: "Genre", ko: "장르" },
  장르: { en: "Genre", ko: "장르" },
};

export function localizeClueLabel(raw: string, locale: Locale) {
  const key = raw.trim().toLowerCase();
  const hit =
    clueLabelMap[raw] ??
    clueLabelMap[key] ??
    Object.entries(clueLabelMap).find(([k]) => k.toLowerCase() === key)?.[1];
  if (hit) return hit[locale];
  return raw;
}
