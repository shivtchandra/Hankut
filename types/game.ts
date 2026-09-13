export type EntityType =
  | "drama"
  | "movie"
  | "song"
  | "album"
  | "person"
  | "place"
  | "brand"
  | "food"
  | "show"
  | "character"
  | "quote"
  | "object"
  | "meme"
  | "slang"
  | "event";

export type Entity = {
  id: string;
  type: EntityType;
  titleKr: string;
  titleEn: string;
  aliases: string[];
  slug?: string;
  description?: string;
  metadata?: Record<string, any>;
  posterUrl?: string;
  thumbnailUrl?: string;
  status: "draft" | "review" | "published" | "archived";
};

export type EntityRelation = {
  id: string;
  sourceEntityId: string;
  targetEntityId: string;
  relationType: string;
  confidence?: number;
  source?: string;
  notes?: string;
};

export type PuzzleType =
  | "scene"
  | "song"
  | "chosung"
  | "connections"
  | "people"
  | "movie"
  | "place"
  | "food"
  | "brand"
  | "quote"
  | "timeline"
  | "object";

export type Clue = {
  id: string;
  label: string;
  value: string;
  unlockAfterAttempt: number;
  type?: string;
};

export type Drama = {
  id: string;
  titleKr: string;
  titleEn: string;
  aliases: string[];
  year: number | null;
  network: string | null;
  genres: string[];
};

export type ScenePayload = {
  id: string;
  episode: number;
  frames: string[];
  clues: Clue[];
  drama: Drama;
};

export type ConnectionItem = {
  id: string;
  text: string;
  groupId: string;
  entityId?: string;
};

export type ConnectionGroup = {
  id: string;
  label: string;
  description: string;
  difficulty: "easy" | "medium" | "hard" | "brutal";
  items: ConnectionItem[];
};

export type ConnectionsPayload = {
  id: string;
  title: string;
  groups: ConnectionGroup[];
  shuffledItems: ConnectionItem[];
};

export type SongPayload = {
  id: string;
  titleKr: string;
  titleEn: string;
  artistKr: string;
  artistEn: string;
  audioUrl: string;
  segments: number[]; // e.g. [1, 2, 4, 7, 12]
  dramaTitle?: string;
  aliases: string[];
  clues: Clue[];
};

export type ChosungPayload = {
  id: string;
  chosung: string; // e.g. ㅍㅆ ㅅㅇㅅㄷ
  answerKr: string;
  answerEn: string;
  category: string;
  syllableCount: number;
  aliases: string[];
  clues: Clue[];
};

export type PeoplePayload = {
  id: string;
  nameKr: string;
  nameEn: string;
  category: string; // e.g. Actor, Idol, Singer, Chef
  frames: string[]; // silhouette -> partial -> wider -> full
  aliases: string[];
  clues: Clue[];
};

export type MiniGameItem =
  | { type: "scene"; payload: ScenePayload }
  | { type: "song"; payload: SongPayload }
  | { type: "chosung"; payload: ChosungPayload }
  | { type: "connections"; payload: ConnectionsPayload }
  | { type: "people"; payload: PeoplePayload };

export type TodaysFiveGame = {
  id: string;
  gameDate: string;
  difficulty: number;
  items: MiniGameItem[];
};

export type TodayGame = {
  id: string;
  gameDate: string;
  difficulty: number;
  scene: ScenePayload;
  todaysFive?: TodaysFiveGame;
};

export type KoreanCultureDNA = {
  drama: number;
  music: number;
  people: number;
  culture: number;
  hangul: number;
  place: number;
  food: number;
};

export type PlayerProfile = {
  totalGames: number;
  totalSolves: number;
  currentStreak: number;
  longestStreak: number;
  averageAttempts: number;
  averageScore: number;
  dna: KoreanCultureDNA;
  solvedEntities: { id: string; title: string; category: string; solvedAt: string }[];
};

export type LeaderboardEntry = {
  rank: number;
  playerName: string;
  score: number;
  streak: number;
  gamesCompleted: number;
  category?: string;
  solvedAt?: string;
};

export type ChallengeRoom = {
  id: string;
  inviteCode: string;
  gameDate: string;
  creatorName: string;
  createdAt: string;
  players: {
    id: string;
    guestName: string;
    score: number;
    completed: boolean;
    attempts: number;
  }[];
};
