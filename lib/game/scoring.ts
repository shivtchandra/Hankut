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

export function calculatePuzzleScore({
  solved,
  attempts,
  cluesUsed = 0,
  timeSeconds = 0,
  difficulty = 5.0,
  config = DEFAULT_SCORING_CONFIG,
}: {
  solved: boolean;
  attempts: number;
  cluesUsed?: number;
  timeSeconds?: number;
  difficulty?: number;
  config?: ScoringConfig;
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

  const base = config.baseScore;
  const attemptPenalty = Math.max(0, (attempts - 1) * config.attemptPenalty);
  const cluePenalty = cluesUsed * config.cluePenalty;
  
  // Fast solver time bonus (up to 60s)
  const timeBonus = timeSeconds > 0 && timeSeconds <= 60
    ? Math.round(((60 - timeSeconds) / 60) * config.timeBonusMax)
    : 0;

  // Perfect solve bonus if solved on 1st attempt with no clues
  const perfectBonus = (attempts === 1 && cluesUsed === 0) ? config.perfectSolveBonus : 0;

  const rawScore = base - attemptPenalty - cluePenalty + timeBonus + perfectBonus;
  const difficultyMult = 1 + (difficulty - 5) * 0.05;
  const finalScore = Math.max(10, Math.round(rawScore * difficultyMult));

  return {
    score: finalScore,
    base,
    attemptPenalty,
    cluePenalty,
    timeBonus,
    perfectBonus,
  };
}

export type TodaysDeokryeokResult = {
  totalScore: number; // Max 25 (5 pts per game)
  maxScore: number;   // 25
  percentileText: string; // e.g. "상위 7%"
  streakDays: number;
  categoryBreakdown: {
    icon: string;
    label: string;
    score: number;
    max: number;
  }[];
};

export function calculateTodaysDeokryeok({
  gameScores, // array of 5 scores (0-5 each)
  streakDays = 1,
}: {
  gameScores: { type: string; score: number }[];
  streakDays?: number;
}): TodaysDeokryeokResult {
  const totalScore = gameScores.reduce((acc, g) => acc + Math.min(5, Math.max(0, g.score)), 0);
  const maxScore = 25;

  // Percentile calculation mapping 0-25 score to realistic Korean gaming percentile
  let percentile = 50;
  if (totalScore >= 24) percentile = 1;
  else if (totalScore >= 22) percentile = 3;
  else if (totalScore >= 20) percentile = 7;
  else if (totalScore >= 18) percentile = 12;
  else if (totalScore >= 15) percentile = 25;
  else if (totalScore >= 12) percentile = 40;
  else if (totalScore >= 8) percentile = 65;
  else percentile = 85;

  const categoryIcons: Record<string, { icon: string; label: string }> = {
    scene: { icon: "🎬", label: "장면" },
    song: { icon: "🎵", label: "노래" },
    chosung: { icon: "🔤", label: "초성" },
    connections: { icon: "🧩", label: "연결고리" },
    people: { icon: "👤", label: "누구지" },
  };

  const categoryBreakdown = gameScores.map((g) => {
    const meta = categoryIcons[g.type] || { icon: "🎯", label: g.type };
    return {
      icon: meta.icon,
      label: meta.label,
      score: Math.min(5, Math.max(0, g.score)),
      max: 5,
    };
  });

  return {
    totalScore,
    maxScore,
    percentileText: `상위 ${percentile}%`,
    streakDays,
    categoryBreakdown,
  };
}
