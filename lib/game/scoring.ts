export type ScoringConfig = {
  baseScore: number;
  attemptPenalty: number;
  cluePenalty: number;
  timeBonusMax: number;
  perfectSolveBonus: number;
  difficultyMultiplier: number;
};

export const DEFAULT_SCORING_CONFIG: ScoringConfig = {
  baseScore: 100,
  attemptPenalty: 15,
  cluePenalty: 10,
  timeBonusMax: 20,
  perfectSolveBonus: 25,
  difficultyMultiplier: 1.2,
};

export function getAttemptPoints(attemptNumber: number): number {
  switch (attemptNumber) {
    case 1: return 25;
    case 2: return 20;
    case 3: return 15;
    case 4: return 10;
    case 5: return 5;
    default: return 0;
  }
}

export function calculatePuzzleScore({
  solved,
  attempts,
}: {
  solved: boolean;
  attempts: number;
}): {
  score: number;
  base: number;
  attemptPenalty: number;
  cluePenalty: number;
  timeBonus: number;
  perfectBonus: number;
} {
  if (!solved) {
    return {
      score: 0,
      base: 0,
      attemptPenalty: 0,
      cluePenalty: 0,
      timeBonus: 0,
      perfectBonus: 0,
    };
  }

  const score = getAttemptPoints(attempts);

  return {
    score,
    base: 25,
    attemptPenalty: 25 - score,
    cluePenalty: 0,
    timeBonus: 0,
    perfectBonus: attempts === 1 ? 5 : 0,
  };
}

export type TodaysDeokryeokResult = {
  totalScore: number; // Max 25 (5 pts per game)
  maxScore: number;   // 25
  percentileText: string; // e.g. "상위 7%"
  streakDays: number;
  categoryBreakdown: {
    type: string;
    label: string;
    score: number;
    max: number;
  }[];
};

export function calculateTodaysDeokryeok({
  gameScores, // array of 5 scores (0-5 each)
  streakDays = 1,
  locale = "ko",
}: {
  gameScores: { type: string; score: number }[];
  streakDays?: number;
  locale?: string;
}): TodaysDeokryeokResult {
  const totalScore = gameScores.reduce((acc, g) => acc + Math.min(5, Math.max(0, g.score)), 0);
  const maxScore = 25;

  let percentile = 50;
  if (totalScore >= 24) percentile = 1;
  else if (totalScore >= 22) percentile = 3;
  else if (totalScore >= 20) percentile = 7;
  else if (totalScore >= 18) percentile = 12;
  else if (totalScore >= 15) percentile = 25;
  else if (totalScore >= 12) percentile = 40;
  else if (totalScore >= 8) percentile = 65;
  else percentile = 85;

  const categoryLabelsKo: Record<string, string> = {
    scene: "장면",
    song: "노래",
    chosung: "초성",
    connections: "연결고리",
    people: "누구지",
  };

  const categoryLabelsEn: Record<string, string> = {
    scene: "Scene",
    song: "Song",
    chosung: "Chosung",
    connections: "Connections",
    people: "People",
  };

  const labels = locale === "en" ? categoryLabelsEn : categoryLabelsKo;

  const categoryBreakdown = gameScores.map((g) => {
    return {
      type: g.type,
      label: labels[g.type] || g.type,
      score: Math.min(5, Math.max(0, g.score)),
      max: 5,
    };
  });

  return {
    totalScore,
    maxScore,
    percentileText: locale === "en" ? `Top ${percentile}%` : `상위 ${percentile}%`,
    streakDays,
    categoryBreakdown,
  };
}
