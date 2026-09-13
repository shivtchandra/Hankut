import type {
  ChosungPayload,
  ConnectionsPayload,
  Drama,
  PeoplePayload,
  ScenePayload,
  SongPayload,
  TodayGame,
  TodaysFiveGame,
} from "@/types/game";

export const DEMO_DRAMAS: Drama[] = [
  {
    id: "demo-iu-park",
    titleKr: "폭싹 속았수다",
    titleEn: "When Life Gives You Tangerines",
    aliases: [
      "폭싹 속았수다",
      "When Life Gives You Tangerines",
      "폭싹속았수다",
      "tangerines",
    ],
    year: 2025,
    network: "Netflix",
    genres: ["Drama", "Romance", "Family"],
  },
  {
    id: "my-liberation-notes",
    titleKr: "나의 해방일지",
    titleEn: "My Liberation Notes",
    aliases: ["나의 해방일지", "My Liberation Notes", "나해일"],
    year: 2022,
    network: "JTBC",
    genres: ["Drama", "Slice of Life"],
  },
  {
    id: "our-blues",
    titleKr: "우리들의 블루스",
    titleEn: "Our Blues",
    aliases: ["우리들의 블루스", "Our Blues", "우블"],
    year: 2022,
    network: "tvN",
    genres: ["Drama"],
  },
  {
    id: "demo-moving",
    titleKr: "무빙",
    titleEn: "Moving",
    aliases: ["무빙", "Moving"],
    year: 2023,
    network: "Disney+",
    genres: ["Action", "Fantasy", "Drama"],
  },
  {
    id: "demo-hotel",
    titleKr: "호텔 델루나",
    titleEn: "Hotel del Luna",
    aliases: ["호텔 델루나", "Hotel del Luna", "델루나"],
    year: 2019,
    network: "tvN",
    genres: ["Fantasy", "Romance"],
  },
];

export const DEMO_SCENE_PAYLOAD: ScenePayload = {
  id: "scene-demo-001",
  episode: 3,
  frames: [
    "/demo/frame-1.svg",
    "/demo/frame-2.svg",
    "/demo/frame-3.svg",
    "/demo/frame-4.svg",
    "/demo/frame-5.svg",
  ],
  clues: [
    {
      id: "year",
      label: "방영년도",
      value: "2025년",
      unlockAfterAttempt: 1,
    },
    {
      id: "platform",
      label: "플랫폼",
      value: "Netflix",
      unlockAfterAttempt: 2,
    },
    {
      id: "setting",
      label: "촬영 배경",
      value: "제주도",
      unlockAfterAttempt: 3,
    },
    {
      id: "cast",
      label: "주연 배우",
      value: "아이유, 박보검",
      unlockAfterAttempt: 4,
    },
  ],
  drama: DEMO_DRAMAS[0],
};

export const DEMO_SONG_PAYLOAD: SongPayload = {
  id: "song-demo-001",
  titleKr: "그대라는 시",
  titleEn: "A Poem Called You",
  artistKr: "태연",
  artistEn: "Taeyeon",
  audioUrl: "https://actions.google.com/sounds/v1/ambiences/outdoor_park.ogg",
  segments: [1, 2, 4, 7, 12],
  dramaTitle: "호텔 델루나 OST",
  aliases: ["그대라는 시", "A Poem Called You", "태연 그대라는시", "호텔 델루나 ost"],
  clues: [
    { id: "year", label: "발매년도", value: "2019년", unlockAfterAttempt: 1 },
    { id: "artist", label: "가수", value: "태연 (소녀시대)", unlockAfterAttempt: 2 },
    { id: "drama", label: "삽입 드라마", value: "호텔 델루나", unlockAfterAttempt: 3 },
  ],
};

export const DEMO_CHOSUNG_PAYLOAD: ChosungPayload = {
  id: "chosung-demo-001",
  chosung: "ㅍㅆ ㅅㅇㅅㄷ",
  answerKr: "폭싹 속았수다",
  answerEn: "When Life Gives You Tangerines",
  category: "2025 드라마",
  syllableCount: 7,
  aliases: ["폭싹 속았수다", "When Life Gives You Tangerines", "폭싹속았수다"],
  clues: [
    { id: "syllables", label: "음절 수", value: "7글자", unlockAfterAttempt: 1 },
    { id: "year", label: "방영", value: "2025 넷플릭스", unlockAfterAttempt: 2 },
    { id: "actor", label: "출연진", value: "아이유 × 박보검", unlockAfterAttempt: 3 },
  ],
};

export const DEMO_CONNECTIONS_PAYLOAD: ConnectionsPayload = {
  id: "connections-demo-001",
  title: "오늘의 연결고리 #247",
  groups: [
    {
      id: "g1",
      label: "제주도를 배경으로 한 드라마",
      description: "아름다운 제주도의 풍경과 이야기를 담은 연출작들",
      difficulty: "easy",
      items: [
        { id: "c1", text: "폭싹 속았수다", groupId: "g1" },
        { id: "c2", text: "우리들의 블루스", groupId: "g1" },
        { id: "c3", text: "웰컴투 삼달리", groupId: "g1" },
        { id: "c4", text: "맨도롱 또ロット", groupId: "g1" },
      ],
    },
    {
      id: "g2",
      label: "아이유(이지은) 주연 드라마",
      description: "배우 이지은이 명연기를 펼친 대표작",
      difficulty: "medium",
      items: [
        { id: "c5", text: "호텔 델루나", groupId: "g2" },
        { id: "c6", text: "나의 아저씨", groupId: "g2" },
        { id: "c7", text: "달의 연인", groupId: "g2" },
        { id: "c8", text: "프로듀사", groupId: "g2" },
      ],
    },
    {
      id: "g3",
      label: "JTBC 슬라이스 오브 라이프 명작",
      description: "삶의 깊은 울림과 감동을 준 잔잔한 명작",
      difficulty: "hard",
      items: [
        { id: "c9", text: "나의 해방일지", groupId: "g3" },
        { id: "c10", text: "눈이 부시게", groupId: "g3" },
        { id: "c11", text: "멜로가 체질", groupId: "g3" },
        { id: "c12", text: "청춘시대", groupId: "g3" },
      ],
    },
    {
      id: "g4",
      label: "디즈니+ / OTT 초능력 & 히어로물",
      description: "압도적 스케일의 초능력자 서사를 다룬 드라마",
      difficulty: "brutal",
      items: [
        { id: "c13", text: "무빙", groupId: "g4" },
        { id: "c14", text: "조명가게", groupId: "g4" },
        { id: "c15", text: "비질란테", groupId: "g4" },
        { id: "c16", text: "지옥", groupId: "g4" },
      ],
    },
  ],
  shuffledItems: [
    { id: "c1", text: "폭싹 속았수다", groupId: "g1" },
    { id: "c9", text: "나의 해방일지", groupId: "g3" },
    { id: "c5", text: "호텔 델루나", groupId: "g2" },
    { id: "c13", text: "무빙", groupId: "g4" },
    { id: "c2", text: "우리들의 블루스", groupId: "g1" },
    { id: "c6", text: "나의 아저씨", groupId: "g2" },
    { id: "c10", text: "눈이 부시게", groupId: "g3" },
    { id: "c14", text: "조명가게", groupId: "g4" },
    { id: "c3", text: "웰컴투 삼달리", groupId: "g1" },
    { id: "c7", text: "달의 연인", groupId: "g2" },
    { id: "c11", text: "멜로가 체질", groupId: "g3" },
    { id: "c15", text: "비질란테", groupId: "g4" },
    { id: "c4", text: "맨도롱 또롯", groupId: "g1" },
    { id: "c8", text: "프로듀사", groupId: "g2" },
    { id: "c12", text: "청춘시대", groupId: "g3" },
    { id: "c16", text: "지옥", groupId: "g4" },
  ],
};

export const DEMO_PEOPLE_PAYLOAD: PeoplePayload = {
  id: "people-demo-001",
  nameKr: "박보검",
  nameEn: "Park Bo-gum",
  category: "배우",
  frames: [
    "/demo/frame-1.svg",
    "/demo/frame-2.svg",
    "/demo/frame-3.svg",
    "/demo/frame-4.svg",
    "/demo/frame-5.svg",
  ],
  aliases: ["박보검", "Park Bo-gum", "Park Bogum", "bogum"],
  clues: [
    { id: "debut", label: "데뷔년도", value: "2011년 영화 '블라인드'", unlockAfterAttempt: 1 },
    { id: "dramas", label: "대표작", value: "응답하라 1988, 구르미 그린 달빛", unlockAfterAttempt: 2 },
    { id: "recent", label: "최신작", value: "폭싹 속았수다 (관식 역)", unlockAfterAttempt: 3 },
  ],
};

export const DEMO_TODAYS_FIVE: TodaysFiveGame = {
  id: "todays-five-demo-001",
  gameDate: "2026-09-11",
  difficulty: 7.2,
  items: [
    { type: "scene", payload: DEMO_SCENE_PAYLOAD },
    { type: "song", payload: DEMO_SONG_PAYLOAD },
    { type: "chosung", payload: DEMO_CHOSUNG_PAYLOAD },
    { type: "connections", payload: DEMO_CONNECTIONS_PAYLOAD },
    { type: "people", payload: DEMO_PEOPLE_PAYLOAD },
  ],
};

export const DEMO_TODAY_GAME: TodayGame = {
  id: "demo-daily-001",
  gameDate: "2026-09-11",
  difficulty: 6.8,
  scene: DEMO_SCENE_PAYLOAD,
  todaysFive: DEMO_TODAYS_FIVE,
};
