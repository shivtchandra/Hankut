"use client";

import { useState } from "react";
import { SiteNav } from "@/components/layout/SiteNav";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SceneGameView } from "@/components/game/SceneGameView";
import { ConnectionsGameView } from "@/components/game/ConnectionsGameView";
import { PeopleGameView } from "@/components/game/PeopleGameView";
import { useLocale } from "@/components/i18n/LocaleProvider";
import {
  DEMO_DRAMAS,
} from "@/lib/demo-data";
import type { ConnectionsPayload, ScenePayload, PeoplePayload } from "@/types/game";

// ─── CANDIDATE 1: THE GLORY (더 글로리) · CLEAN SCENE CUT ─────────────────
const THE_GLORY_SCENE_PAYLOAD: ScenePayload = {
  id: "scene-the-glory-gym-bravo",
  episode: 3,
  frames: [
    "/scenes/the-glory/frame-1.webp",
    "/scenes/the-glory/frame-2.webp",
    "/scenes/the-glory/frame-3.webp",
    "/scenes/the-glory/frame-4.webp",
    "/scenes/the-glory/frame-5.webp",
  ],
  clues: [
    { id: "broadcast", label: "방영 정보", value: "2022-2023 Netflix Global Top 10 Sensation · Written by Kim Eun-sook (김은숙)", unlockAfterAttempt: 1 },
    { id: "cast", label: "주연 배우", value: "Song Hye-kyo × Lim Ji-yeon (Moon Dong-eun & Park Yeon-jin / 송혜교 × 임지연)", unlockAfterAttempt: 2 },
    { id: "quote", label: "명대사 힌트", value: "“브라보! 멋지다, 박연진!” (High school gym alumni award ceremony confrontation)", unlockAfterAttempt: 3 },
  ],
  drama: {
    id: "the-glory",
    titleKr: "더 글로리",
    titleEn: "The Glory",
    aliases: ["더 글로리", "The Glory", "더글로리", "문동은", "박연진", "송혜교", "연진아"],
    year: 2022,
    network: "Netflix",
    genres: ["Thriller", "Revenge", "Drama"],
  },
};

// ─── CANDIDATE 2: KIM JI-WON (김지원) · WHO IS THIS ACTRESS? ────────────────
const KIM_JI_WON_PEOPLE_PAYLOAD: PeoplePayload = {
  id: "people-kim-ji-won",
  nameKr: "김지원",
  nameEn: "Kim Ji-won",
  category: "Actress (배우)",
  frames: [
    "/people/kim-ji-won/frame-1.webp",
    "/people/kim-ji-won/frame-2.webp",
    "/people/kim-ji-won/frame-3.webp",
    "/people/kim-ji-won/frame-4.webp",
    "/people/kim-ji-won/frame-5.webp",
  ],
  aliases: [
    "김지원",
    "Kim Ji-won",
    "Kim Jiwon",
    "Jiwon",
    "지원",
    "홍해인",
    "Hong Hae-in",
    "Hong Haein",
    "염미정",
    "Yeom Mi-jeong",
  ],
  clues: [
    {
      id: "debut",
      label: "데뷔년도",
      value: "2010 Lollipop Commercial / High Kick: Revenge of the Short Legged",
      unlockAfterAttempt: 1,
    },
    {
      id: "dramas",
      label: "대표작",
      value: "Queen of Tears (눈물의 여왕), Fight for My Way (쌈 마이웨이), The Heirs (상속자들)",
      unlockAfterAttempt: 2,
    },
    {
      id: "recent",
      label: "최신작/역할",
      value: "Hong Hae-in in Queen of Tears (눈물의 여왕 홍해인) / My Liberation Notes (나의 해방일지)",
      unlockAfterAttempt: 3,
    },
  ],
};

// ─── CANDIDATE 3: DAILY CONNECTIONS #3 (EDITION 3) · TODAY ─────────────────
const CONNECTIONS_EDITION_3_PAYLOAD: ConnectionsPayload = {
  id: "connections-edition-3",
  title: "오늘의 연결고리 #3 (Edition 3)",
  groups: [
    {
      id: "g1",
      label: "재벌가 & 후계자 로맨스",
      labelEn: "Romantic Chaebol & Heiress",
      description: "거대 재벌 후계자와 사랑에 빠지는 클래식 로코 명작들",
      descriptionEn: "Iconic romantic dramas featuring wealthy heirs and corporate chaebols",
      difficulty: "easy",
      items: [
        { id: "c1", text: "사랑의 불시착", textEn: "Crash Landing on You", groupId: "g1" },
        { id: "c2", text: "상속자들", textEn: "The Heirs", groupId: "g1" },
        { id: "c3", text: "사내맞선", textEn: "Business Proposal", groupId: "g1" },
        { id: "c4", text: "킹더랜드", textEn: "King the Land", groupId: "g1" },
      ],
    },
    {
      id: "g2",
      label: "조선 왕실 & 궁중 로맨스 사극",
      labelEn: "Joseon Royalty & Palace Romance",
      description: "궁궐의 암투 속에서 피어난 애틋한 왕실 사극 로맨스",
      descriptionEn: "Emotional palace sageuks centered on kings, queens, and crown princes",
      difficulty: "medium",
      items: [
        { id: "c5", text: "옷소매 붉은 끝동", textEn: "The Red Sleeve", groupId: "g2" },
        { id: "c6", text: "슈룹", textEn: "Under the Queen's Umbrella", groupId: "g2" },
        { id: "c7", text: "해를 품은 달", textEn: "Moon Embracing the Sun", groupId: "g2" },
        { id: "c8", text: "철인왕후", textEn: "Mr. Queen", groupId: "g2" },
      ],
    },
    {
      id: "g3",
      label: "다크 히어로 & 사적 복수 대행",
      labelEn: "Dark Revenge & Vigilante Justice",
      description: "법이 심판하지 못한 악인들을 직접 처단하는 처절한 복수극",
      descriptionEn: "High-octane revenge and vigilante thrillers taking justice into their own hands",
      difficulty: "hard",
      items: [
        { id: "c9", text: "더 글로리", textEn: "The Glory", groupId: "g3" },
        { id: "c10", text: "모범택시", textEn: "Taxi Driver", groupId: "g3" },
        { id: "c11", text: "마이 네임", textEn: "My Name", groupId: "g3" },
        { id: "c12", text: "펜트하우스", textEn: "The Penthouse", groupId: "g3" },
      ],
    },
    {
      id: "g4",
      label: "위장 잠입 & 비밀 이중 신분",
      labelEn: "Secret / Dual Identities",
      description: "진짜 정체를 숨기고 다른 사람으로 살아가야 하는 비밀스러운 운명",
      descriptionEn: "Characters living dangerous double lives under concealed or altered identities",
      difficulty: "brutal",
      items: [
        { id: "c13", text: "힐러", textEn: "Healer", groupId: "g4" },
        { id: "c14", text: "킬미, 힐미", textEn: "Kill Me, Heal Me", groupId: "g4" },
        { id: "c15", text: "악의 꽃", textEn: "Flower of Evil", groupId: "g4" },
        { id: "c16", text: "뷰티 인사이드", textEn: "The Beauty Inside", groupId: "g4" },
      ],
    },
  ],
  shuffledItems: [
    { id: "c3", text: "사내맞선", textEn: "Business Proposal", groupId: "g1" },
    { id: "c7", text: "해를 품은 달", textEn: "Moon Embracing the Sun", groupId: "g2" },
    { id: "c11", text: "마이 네임", textEn: "My Name", groupId: "g3" },
    { id: "c1", text: "사랑의 불시착", textEn: "Crash Landing on You", groupId: "g1" },
    { id: "c15", text: "악의 꽃", textEn: "Flower of Evil", groupId: "g4" },
    { id: "c6", text: "슈룹", textEn: "Under the Queen's Umbrella", groupId: "g2" },
    { id: "c10", text: "모범택시", textEn: "Taxi Driver", groupId: "g3" },
    { id: "c14", text: "킬미, 힐미", textEn: "Kill Me, Heal Me", groupId: "g4" },
    { id: "c2", text: "상속자들", textEn: "The Heirs", groupId: "g1" },
    { id: "c8", text: "철인왕후", textEn: "Mr. Queen", groupId: "g2" },
    { id: "c12", text: "펜트하우스", textEn: "The Penthouse", groupId: "g3" },
    { id: "c16", text: "뷰티 인사이드", textEn: "The Beauty Inside", groupId: "g4" },
    { id: "c4", text: "킹더랜드", textEn: "King the Land", groupId: "g1" },
    { id: "c5", text: "옷소매 붉은 끝동", textEn: "The Red Sleeve", groupId: "g2" },
    { id: "c9", text: "더 글로리", textEn: "The Glory", groupId: "g3" },
    { id: "c13", text: "힐러", textEn: "Healer", groupId: "g4" },
  ],
};

// ─── CANDIDATE 4: DAILY CONNECTIONS #4 (EDITION 4) · TOMORROW ──────────────
const CONNECTIONS_EDITION_4_PAYLOAD: ConnectionsPayload = {
  id: "connections-edition-4",
  title: "오늘의 연결고리 #4 (Edition 4)",
  groups: [
    {
      id: "g1",
      label: "청춘 & 학원 캠퍼스 로맨스",
      labelEn: "Youth & Campus Romance",
      description: "풋풋한 학창 시절과 캠퍼스의 설렘을 담은 청춘 드라마",
      descriptionEn: "Heartfluttering school and university youth romances",
      difficulty: "easy",
      items: [
        { id: "t1", text: "여신강림", textEn: "True Beauty", groupId: "g1" },
        { id: "t2", text: "어쩌다 발견한 하루", textEn: "Extraordinary You", groupId: "g1" },
        { id: "t3", text: "역도요정 김복주", textEn: "Weightlifting Fairy Kim Bok-joo", groupId: "g1" },
        { id: "t4", text: "치즈인더트랩", textEn: "Cheese in the Trap", groupId: "g1" },
      ],
    },
    {
      id: "g2",
      label: "생명을 살리는 메디컬 휴먼 드라마",
      labelEn: "Medical & Hospital Heroes",
      description: "병원 응급실과 수술실에서 펼쳐지는 의사들의 치열한 삶과 휴머니즘",
      descriptionEn: "Gripping medical dramas centered around doctors and life-saving surgeries",
      difficulty: "medium",
      items: [
        { id: "t5", text: "슬기로운 의사생활", textEn: "Hospital Playlist", groupId: "g2" },
        { id: "t6", text: "낭만닥터 김사부", textEn: "Dr. Romantic", groupId: "g2" },
        { id: "t7", text: "닥터슬럼프", textEn: "Doctor Slump", groupId: "g2" },
        { id: "t8", text: "닥터 이방인", textEn: "Doctor Stranger", groupId: "g2" },
      ],
    },
    {
      id: "g3",
      label: "신비로운 판타지 존재 & 신화 속 생물",
      labelEn: "Supernatural Fantasy Creatures",
      description: "구미호, 멸망, 영혼의 지배자 등 초자연적 존재와의 환상 로맨스",
      descriptionEn: "Romances involving non-human deities, spirits, and mythological creatures",
      difficulty: "hard",
      items: [
        { id: "t9", text: "호텔 델루나", textEn: "Hotel Del Luna", groupId: "g3" },
        { id: "t10", text: "간 떨어지는 동거", textEn: "My Roommate is a Gumiho", groupId: "g3" },
        { id: "t11", text: "어느 날 우리 집 현관으로 멸망이 들어왔다", textEn: "Doom at Your Service", groupId: "g3" },
        { id: "t12", text: "구미호뎐", textEn: "Tale of the Nine Tailed", groupId: "g3" },
      ],
    },
    {
      id: "g4",
      label: "평행세계 & 다중우주 타임라인",
      labelEn: "Parallel Worlds & Multiverse",
      description: "두 개의 서로 다른 차원과 평행우주를 넘나드는 미스터리",
      descriptionEn: "Mind-bending dramas traveling between parallel dimensions and alternate timelines",
      difficulty: "brutal",
      items: [
        { id: "t13", text: "더 킹 : 영원의 군주", textEn: "The King: Eternal Monarch", groupId: "g4" },
        { id: "t14", text: "W (더블유)", textEn: "W: Two Worlds", groupId: "g4" },
        { id: "t15", text: "트레인", textEn: "Train", groupId: "g4" },
        { id: "t16", text: "앨리스", textEn: "Alice", groupId: "g4" },
      ],
    },
  ],
  shuffledItems: [
    { id: "t3", text: "역도요정 김복주", textEn: "Weightlifting Fairy Kim Bok-joo", groupId: "g1" },
    { id: "t6", text: "낭만닥터 김사부", textEn: "Dr. Romantic", groupId: "g2" },
    { id: "t10", text: "간 떨어지는 동거", textEn: "My Roommate is a Gumiho", groupId: "g3" },
    { id: "t14", text: "W (더블유)", textEn: "W: Two Worlds", groupId: "g4" },
    { id: "t1", text: "여신강림", textEn: "True Beauty", groupId: "g1" },
    { id: "t7", text: "닥터슬럼프", textEn: "Doctor Slump", groupId: "g2" },
    { id: "t11", text: "어느 날 우리 집 현관으로 멸망이 들어왔다", textEn: "Doom at Your Service", groupId: "g3" },
    { id: "t15", text: "트레인", textEn: "Train", groupId: "g4" },
    { id: "t2", text: "어쩌다 발견한 하루", textEn: "Extraordinary You", groupId: "g1" },
    { id: "t8", text: "닥터 이방인", textEn: "Doctor Stranger", groupId: "g2" },
    { id: "t12", text: "구미호뎐", textEn: "Tale of the Nine Tailed", groupId: "g3" },
    { id: "t16", text: "앨리스", textEn: "Alice", groupId: "g4" },
    { id: "t4", text: "치즈인더트랩", textEn: "Cheese in the Trap", groupId: "g1" },
    { id: "t5", text: "슬기로운 의사생활", textEn: "Hospital Playlist", groupId: "g2" },
    { id: "t9", text: "호텔 델루나", textEn: "Hotel Del Luna", groupId: "g3" },
    { id: "t13", text: "더 킹 : 영원의 군주", textEn: "The King: Eternal Monarch", groupId: "g4" },
  ],
};

type Mode = "the-glory" | "kim-ji-won" | "connections-3" | "connections-4";

export default function PreviewPage() {
  const { locale, setLocale } = useLocale();
  const [mode, setMode] = useState<Mode>("the-glory");
  const [key, setKey] = useState(0);

  function resetGame() {
    setKey((prev) => prev + 1);
  }

  function toggleLanguage() {
    setLocale(locale === "en" ? "ko" : "en");
  }

  return (
    <div className="game-page-root">
      <SiteNav />

      <main className="game-main-content" style={{ padding: "16px", maxWidth: "800px", margin: "0 auto" }}>
        {/* Preview Control Header */}
        <div
          style={{
            background: "#1c1917",
            border: "1px solid #44403c",
            borderRadius: "12px",
            padding: "16px",
            marginBottom: "24px",
            color: "#f5f5f4",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px", marginBottom: "16px" }}>
            <div>
              <span style={{ fontSize: "11px", letterSpacing: "1.5px", textTransform: "uppercase", color: "#f43f5e", fontWeight: 700 }}>
                CANDIDATE PUZZLES · TEST PREVIEW
              </span>
              <h1 style={{ fontSize: "20px", margin: "4px 0 0 0", color: "#fafaf9" }}>
                Candidate Puzzles for Today & Tomorrow
              </h1>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                type="button"
                onClick={toggleLanguage}
                style={{
                  background: "#44403c",
                  color: "#fafaf9",
                  border: "1px solid #78716c",
                  padding: "8px 14px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: 700,
                  fontSize: "13px",
                }}
              >
                🌐 Language: {locale.toUpperCase()}
              </button>
              <button
                type="button"
                onClick={resetGame}
                style={{
                  background: "#292524",
                  color: "#e7e5e4",
                  border: "1px solid #57534e",
                  padding: "8px 14px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: "13px",
                }}
              >
                🔄 Reset
              </button>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "8px" }}>
            <button
              type="button"
              onClick={() => { setMode("the-glory"); resetGame(); }}
              style={{
                padding: "10px 12px",
                borderRadius: "8px",
                border: mode === "the-glory" ? "2px solid #e11d48" : "1px solid #44403c",
                background: mode === "the-glory" ? "#e11d48" : "#292524",
                color: "#ffffff",
                fontWeight: 700,
                fontSize: "12px",
                cursor: "pointer",
                textAlign: "center",
              }}
            >
              🎬 The Glory (Clean Scene Cut)
            </button>

            <button
              type="button"
              onClick={() => { setMode("kim-ji-won"); resetGame(); }}
              style={{
                padding: "10px 12px",
                borderRadius: "8px",
                border: mode === "kim-ji-won" ? "2px solid #e11d48" : "1px solid #44403c",
                background: mode === "kim-ji-won" ? "#e11d48" : "#292524",
                color: "#ffffff",
                fontWeight: 700,
                fontSize: "12px",
                cursor: "pointer",
                textAlign: "center",
              }}
            >
              ✨ Kim Ji-won (Photo Reveal)
            </button>

            <button
              type="button"
              onClick={() => { setMode("connections-3"); resetGame(); }}
              style={{
                padding: "10px 12px",
                borderRadius: "8px",
                border: mode === "connections-3" ? "2px solid #e11d48" : "1px solid #44403c",
                background: mode === "connections-3" ? "#e11d48" : "#292524",
                color: "#ffffff",
                fontWeight: 700,
                fontSize: "12px",
                cursor: "pointer",
                textAlign: "center",
              }}
            >
              🧩 Today: Connections #3
            </button>

            <button
              type="button"
              onClick={() => { setMode("connections-4"); resetGame(); }}
              style={{
                padding: "10px 12px",
                borderRadius: "8px",
                border: mode === "connections-4" ? "2px solid #e11d48" : "1px solid #44403c",
                background: mode === "connections-4" ? "#e11d48" : "#292524",
                color: "#ffffff",
                fontWeight: 700,
                fontSize: "12px",
                cursor: "pointer",
                textAlign: "center",
              }}
            >
              🧩 Tomorrow: Connections #4
            </button>
          </div>
        </div>

        {/* Active Game View */}
        <div key={key}>
          {mode === "the-glory" && (
            <SceneGameView
              payload={THE_GLORY_SCENE_PAYLOAD}
              dramas={DEMO_DRAMAS}
            />
          )}

          {mode === "kim-ji-won" && (
            <PeopleGameView
              payload={KIM_JI_WON_PEOPLE_PAYLOAD}
              dramas={DEMO_DRAMAS}
            />
          )}

          {mode === "connections-3" && (
            <ConnectionsGameView
              payload={CONNECTIONS_EDITION_3_PAYLOAD}
            />
          )}

          {mode === "connections-4" && (
            <ConnectionsGameView
              payload={CONNECTIONS_EDITION_4_PAYLOAD}
            />
          )}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
