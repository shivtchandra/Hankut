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

// ─── CANDIDATE 1: WHAT'S WRONG WITH SECRETARY KIM (2018) · CLEAN SCENE CUT ──
const SECRETARY_KIM_SCENE_PAYLOAD: ScenePayload = {
  id: "scene-whats-wrong-with-secretary-kim-tie",
  episode: 2,
  frames: [
    "/scenes/whats-wrong-with-secretary-kim/frame-1.webp",
    "/scenes/whats-wrong-with-secretary-kim/frame-2.webp",
    "/scenes/whats-wrong-with-secretary-kim/frame-3.webp",
    "/scenes/whats-wrong-with-secretary-kim/frame-4.webp",
    "/scenes/whats-wrong-with-secretary-kim/frame-5.webp",
  ],
  clues: [
    {
      id: "broadcast",
      label: "방영 정보",
      value: "2018 tvN Legend Rom-Com (Peak 8.7% rating) · Based on the hit webtoon by Jung Kyung-yoon",
      unlockAfterAttempt: 1,
    },
    {
      id: "cast",
      label: "주연 배우 & 캐릭터",
      value: "Park Seo-joon × Park Min-young (Lee Young-joon & Kim Mi-so / 박서준 × 박민영)",
      unlockAfterAttempt: 2,
    },
    {
      id: "quote",
      label: "명대사 힌트",
      value: "“김 비서가 왜 그럴까?” — Iconic necktie adjustment scene in the vice chairman's office",
      unlockAfterAttempt: 3,
    },
  ],
  drama: {
    id: "whats-wrong-with-secretary-kim",
    titleKr: "김비서가 왜 그럴까",
    titleEn: "What's Wrong with Secretary Kim",
    aliases: [
      "김비서가 왜 그럴까",
      "What's Wrong with Secretary Kim",
      "Whats Wrong with Secretary Kim",
      "김비서가왜그럴까",
      "김비서",
      "이영준",
      "김미소",
      "박서준",
      "박민영",
      "Secretary Kim",
    ],
    year: 2018,
    network: "tvN",
    genres: ["Romance", "Comedy"],
  },
};

// ─── CANDIDATE 2: THE GLORY (더 글로리) · CLEAN SCENE CUT ─────────────────
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

// ─── CANDIDATE 3: KIM JI-WON (김지원) · WHO IS THIS ACTRESS? ────────────────
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

// ─── CANDIDATE 4: DAILY CONNECTIONS #4 ──────────────────────────────────────
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

type Mode = "secretary-kim" | "the-glory" | "kim-ji-won" | "connections-4";

export default function PreviewPage() {
  const { locale, setLocale } = useLocale();
  const [mode, setMode] = useState<Mode>("secretary-kim");
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
                2018 DRAMA CANDIDATE · TEST PREVIEW
              </span>
              <h1 style={{ fontSize: "20px", margin: "4px 0 0 0", color: "#fafaf9" }}>
                Candidate Puzzles for Tomorrow
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
              onClick={() => { setMode("secretary-kim"); resetGame(); }}
              style={{
                padding: "10px 12px",
                borderRadius: "8px",
                border: mode === "secretary-kim" ? "2px solid #e11d48" : "1px solid #44403c",
                background: mode === "secretary-kim" ? "#e11d48" : "#292524",
                color: "#ffffff",
                fontWeight: 700,
                fontSize: "12px",
                cursor: "pointer",
                textAlign: "center",
              }}
            >
              👔 2018: Secretary Kim (김비서가 왜 그럴까)
            </button>

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
              🧩 Connections #4
            </button>
          </div>
        </div>

        {/* Active Game View */}
        <div key={key}>
          {mode === "secretary-kim" && (
            <SceneGameView
              payload={SECRETARY_KIM_SCENE_PAYLOAD}
              dramas={DEMO_DRAMAS}
            />
          )}

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
