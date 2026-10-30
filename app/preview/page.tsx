"use client";

import { useState } from "react";
import { SiteNav } from "@/components/layout/SiteNav";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { ConnectionsGameView } from "@/components/game/ConnectionsGameView";
import { PeopleGameView } from "@/components/game/PeopleGameView";
import { ChosungGameView } from "@/components/game/ChosungGameView";
import { useLocale } from "@/components/i18n/LocaleProvider";
import {
  DEMO_CONNECTIONS_PAYLOAD,
  DEMO_PEOPLE_PAYLOAD,
  DEMO_CHOSUNG_PAYLOAD,
  DEMO_DRAMAS,
} from "@/lib/demo-data";
import type { ChosungPayload, ConnectionsPayload, PeoplePayload } from "@/types/game";

const QUEEN_OF_TEARS_CHOSUNG_PAYLOAD: ChosungPayload = {
  id: "chosung-queen-of-tears",
  chosung: "ㄴ ㅁ ㅇ   ㅇ ㅇ",
  answerKr: "눈물의 여왕",
  answerEn: "Queen of Tears",
  category: "tvN Romance · 2024 Legend Hit",
  syllableCount: 4,
  aliases: ["눈물의 여왕", "눈물의여왕", "Queen of Tears", "Queen of Tear", "눈물"],
  clues: [
    { id: "syllables", label: "음절 수", value: "4 Syllables (4글자) · Record-breaking 24.9% tvN viewership", unlockAfterAttempt: 1 },
    { id: "plot", label: "줄거리/배경", value: "Queens Group chaebol heiress & supermarket prince marriage crisis (퀸즈그룹 홍해인 & 백현우)", unlockAfterAttempt: 2 },
    { id: "cast", label: "출연진", value: "Kim Soo-hyun × Kim Ji-won (김수현 × 김지원)", unlockAfterAttempt: 3 },
  ],
};

const GOBLIN_CHOSUNG_PAYLOAD: ChosungPayload = {
  id: "chosung-goblin",
  chosung: "ㄷ ㄲ ㅂ",
  answerKr: "도깨비",
  answerEn: "Goblin",
  category: "tvN Fantasy Romance",
  syllableCount: 3,
  aliases: ["도깨비", "Goblin", "Guardian: The Lonely and Great God", "Guardian", "Dokkaebi"],
  clues: [
    { id: "broadcast", label: "방영", value: "3 Syllables (3글자) · 2016 tvN Legend Hit", unlockAfterAttempt: 1 },
    { id: "writer", label: "제작진", value: "Writer Kim Eun-sook (김은숙 작가) × Dir. Lee Eung-bok", unlockAfterAttempt: 2 },
    { id: "cast", label: "출연진", value: "Gong Yoo, Kim Go-eun, Lee Dong-wook (공유 × 김고은 × 이동욱)", unlockAfterAttempt: 3 },
  ],
};

const CONNECTIONS_EDITION_2_PAYLOAD: ConnectionsPayload = {
  id: "connections-edition-2",
  title: "오늘의 연결고리 #2 (Edition 2)",
  groups: [
    {
      id: "g1",
      label: "시간여행 & 타임슬립 드라마",
      labelEn: "Time Travel & Time Slip",
      description: "과거와 현재를 오가는 운명적 서사의 타임루프 명작들",
      descriptionEn: "Dramas centered on time travel, time slips, or second chances in the past",
      difficulty: "easy",
      items: [
        { id: "c1", text: "선재 업고 튀어", textEn: "Lovely Runner", groupId: "g1" },
        { id: "c2", text: "시그널", textEn: "Signal", groupId: "g1" },
        { id: "c3", text: "내 남편과 결혼해줘", textEn: "Marry My Husband", groupId: "g1" },
        { id: "c4", text: "너의 시간 속으로", textEn: "A Time Called You", groupId: "g1" },
      ],
    },
    {
      id: "g2",
      label: "법정 & 고난도 변호사 드라마",
      labelEn: "Courtroom & High-Stakes Legal",
      description: "법정에서 치열한 정의를 다투는 변호사/판사 이야기",
      descriptionEn: "Thrilling courtroom battles led by lawyers and judges",
      difficulty: "medium",
      items: [
        { id: "c5", text: "이상한 변호사 우영우", textEn: "Extraordinary Attorney Woo", groupId: "g2" },
        { id: "c6", text: "빈센조", textEn: "Vincenzo", groupId: "g2" },
        { id: "c7", text: "소년심판", textEn: "Juvenile Justice", groupId: "g2" },
        { id: "c8", text: "천원짜리 변호사", textEn: "One Dollar Lawyer", groupId: "g2" },
      ],
    },
    {
      id: "g3",
      label: "김지원 주연 대표작",
      labelEn: "Starring Kim Ji-won",
      description: "배우 김지원이 뛰어난 연기력으로 히트시킨 대표작",
      descriptionEn: "Iconic hit dramas led by actress Kim Ji-won",
      difficulty: "hard",
      items: [
        { id: "c9", text: "눈물의 여왕", textEn: "Queen of Tears", groupId: "g3" },
        { id: "c10", text: "나의 해방일지", textEn: "My Liberation Notes", groupId: "g3" },
        { id: "c11", text: "쌈, 마이웨이", textEn: "Fight for My Way", groupId: "g3" },
        { id: "c12", text: "태양의 후예", textEn: "Descendants of the Sun", groupId: "g3" },
      ],
    },
    {
      id: "g4",
      label: "K-좀비 & 치명적 크리처 스릴러",
      labelEn: "Zombie & Creature Outbreak",
      description: "치명적인 바이러스와 감염자에 맞서는 생존 스릴러",
      descriptionEn: "High-octane survival series fighting infected monsters and zombies",
      difficulty: "brutal",
      items: [
        { id: "c13", text: "킹덤", textEn: "Kingdom", groupId: "g4" },
        { id: "c14", text: "지금 우리 학교는", textEn: "All of Us Are Dead", groupId: "g4" },
        { id: "c15", text: "스위트홈", textEn: "Sweet Home", groupId: "g4" },
        { id: "c16", text: "해피니스", textEn: "Happiness", groupId: "g4" },
      ],
    },
  ],
  shuffledItems: [
    { id: "c1", text: "선재 업고 튀어", textEn: "Lovely Runner", groupId: "g1" },
    { id: "c6", text: "빈센조", textEn: "Vincenzo", groupId: "g2" },
    { id: "c11", text: "쌈, 마이웨이", textEn: "Fight for My Way", groupId: "g3" },
    { id: "c13", text: "킹덤", textEn: "Kingdom", groupId: "g4" },
    { id: "c2", text: "시그널", textEn: "Signal", groupId: "g1" },
    { id: "c9", text: "눈물의 여왕", textEn: "Queen of Tears", groupId: "g3" },
    { id: "c5", text: "이상한 변호사 우영우", textEn: "Extraordinary Attorney Woo", groupId: "g2" },
    { id: "c14", text: "지금 우리 학교는", textEn: "All of Us Are Dead", groupId: "g4" },
    { id: "c3", text: "내 남편과 결혼해줘", textEn: "Marry My Husband", groupId: "g1" },
    { id: "c10", text: "나의 해방일지", textEn: "My Liberation Notes", groupId: "g3" },
    { id: "c7", text: "소년심판", textEn: "Juvenile Justice", groupId: "g2" },
    { id: "c15", text: "스위트홈", textEn: "Sweet Home", groupId: "g4" },
    { id: "c4", text: "너의 시간 속으로", textEn: "A Time Called You", groupId: "g1" },
    { id: "c12", text: "태양의 후예", textEn: "Descendants of the Sun", groupId: "g3" },
    { id: "c8", text: "천원짜리 변호사", textEn: "One Dollar Lawyer", groupId: "g2" },
    { id: "c16", text: "해피니스", textEn: "Happiness", groupId: "g4" },
  ],
};

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

const CHA_EUN_WOO_PEOPLE_PAYLOAD = {
  id: "people-cha-eun-woo",
  nameKr: "차은우",
  nameEn: "Cha Eun-woo",
  category: "Actor & Idol (배우/가수)",
  frames: [
    "/people/cha-eun-woo/frame-1.webp",
    "/people/cha-eun-woo/frame-2.webp",
    "/people/cha-eun-woo/frame-3.webp",
    "/people/cha-eun-woo/frame-4.webp",
    "/people/cha-eun-woo/frame-5.webp",
  ],
  aliases: ["차은우", "Cha Eun-woo", "Cha Eunwoo", "Eunwoo", "ASTRO"],
  clues: [
    { id: "debut", label: "데뷔년도", value: "ASTRO Member (2016) / Film 'My Brilliant Life'", unlockAfterAttempt: 1 },
    { id: "dramas", label: "대표작", value: "True Beauty (여신강림), My ID is Gangnam Beauty (강남미인)", unlockAfterAttempt: 2 },
    { id: "recent", label: "최신작", value: "Wonderful World (원더풀 월드), Island (아일랜드)", unlockAfterAttempt: 3 },
  ],
};

type Mode = "connections" | "people" | "chosung";

export default function PreviewPage() {
  const { locale, setLocale } = useLocale();
  const [mode, setMode] = useState<Mode>("people");
  const [connectionsChoice, setConnectionsChoice] = useState<"edition-2" | "edition-1">("edition-2");
  const [actorChoice, setActorChoice] = useState<"kim-ji-won" | "park-bo-gum" | "cha-eun-woo">("kim-ji-won");
  const [chosungChoice, setChosungChoice] = useState<"queen-of-tears" | "goblin" | "tangerines">("queen-of-tears");
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
                LIVE PREVIEW MODE · TEST BEFORE PUSHING
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
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
            <button
              type="button"
              onClick={() => { setMode("chosung"); resetGame(); }}
              style={{
                padding: "12px 8px",
                borderRadius: "8px",
                border: mode === "chosung" ? "2px solid #e11d48" : "1px solid #44403c",
                background: mode === "chosung" ? "#e11d48" : "#292524",
                color: "#ffffff",
                fontWeight: 700,
                fontSize: "13px",
                cursor: "pointer",
                textAlign: "center",
              }}
            >
              ⭐ Day 1 Candidate: 초성 (Chosung)
            </button>

            <button
              type="button"
              onClick={() => { setMode("connections"); resetGame(); }}
              style={{
                padding: "12px 8px",
                borderRadius: "8px",
                border: mode === "connections" ? "2px solid #e11d48" : "1px solid #44403c",
                background: mode === "connections" ? "#e11d48" : "#292524",
                color: "#ffffff",
                fontWeight: 700,
                fontSize: "13px",
                cursor: "pointer",
                textAlign: "center",
              }}
            >
              ⭐ Day 2 Candidate: K-Connections
            </button>

            <button
              type="button"
              onClick={() => { setMode("people"); resetGame(); }}
              style={{
                padding: "12px 8px",
                borderRadius: "8px",
                border: mode === "people" ? "2px solid #e11d48" : "1px solid #44403c",
                background: mode === "people" ? "#e11d48" : "#292524",
                color: "#ffffff",
                fontWeight: 700,
                fontSize: "13px",
                cursor: "pointer",
                textAlign: "center",
              }}
            >
              Alternative: Actor / Face Cut
            </button>
          </div>

          {/* Sub-choice for Chosung */}
          {mode === "chosung" && (
            <div style={{ display: "flex", gap: "10px", marginTop: "12px", alignItems: "center", flexWrap: "wrap" }}>
              <span style={{ fontSize: "12px", color: "#a8a29e", fontWeight: 600 }}>Choose Drama:</span>
              <button
                type="button"
                onClick={() => { setChosungChoice("queen-of-tears"); resetGame(); }}
                style={{
                  padding: "6px 12px",
                  borderRadius: "6px",
                  fontSize: "12px",
                  fontWeight: 600,
                  background: chosungChoice === "queen-of-tears" ? "#dc2626" : "transparent",
                  color: "#f5f5f4",
                  border: chosungChoice === "queen-of-tears" ? "1px solid #ef4444" : "1px solid #57534e",
                  cursor: "pointer",
                }}
              >
                🔥 ㄴ ㅁ ㅇ ㅇ ㅇ (눈물의 여왕 / Queen of Tears) - Recommended for Today
              </button>
              <button
                type="button"
                onClick={() => { setChosungChoice("goblin"); resetGame(); }}
                style={{
                  padding: "6px 12px",
                  borderRadius: "6px",
                  fontSize: "12px",
                  background: chosungChoice === "goblin" ? "#44403c" : "transparent",
                  color: "#f5f5f4",
                  border: "1px solid #57534e",
                  cursor: "pointer",
                }}
              >
                ㄷ ㄲ ㅂ (도깨비 / Goblin)
              </button>
              <button
                type="button"
                onClick={() => { setChosungChoice("tangerines"); resetGame(); }}
                style={{
                  padding: "6px 12px",
                  borderRadius: "6px",
                  fontSize: "12px",
                  background: chosungChoice === "tangerines" ? "#44403c" : "transparent",
                  color: "#f5f5f4",
                  border: "1px solid #57534e",
                  cursor: "pointer",
                }}
              >
                ㅍㅆ ㅅㅇㅅㄷ (폭싹 속았수다)
              </button>
            </div>
          )}

          {/* Sub-choice for Connections */}
          {mode === "connections" && (
            <div style={{ display: "flex", gap: "10px", marginTop: "12px", alignItems: "center", flexWrap: "wrap" }}>
              <span style={{ fontSize: "12px", color: "#a8a29e", fontWeight: 600 }}>Puzzle Edition:</span>
              <button
                type="button"
                onClick={() => { setConnectionsChoice("edition-2"); resetGame(); }}
                style={{
                  padding: "6px 12px",
                  borderRadius: "6px",
                  fontSize: "12px",
                  fontWeight: 600,
                  background: connectionsChoice === "edition-2" ? "#dc2626" : "transparent",
                  color: "#f5f5f4",
                  border: connectionsChoice === "edition-2" ? "1px solid #ef4444" : "1px solid #57534e",
                  cursor: "pointer",
                }}
              >
                ✨ Edition #2: Time Travel / Legal / Kim Ji-won / Zombie (NEW!) - Recommended for Tomorrow
              </button>
              <button
                type="button"
                onClick={() => { setConnectionsChoice("edition-1"); resetGame(); }}
                style={{
                  padding: "6px 12px",
                  borderRadius: "6px",
                  fontSize: "12px",
                  background: connectionsChoice === "edition-1" ? "#44403c" : "transparent",
                  color: "#f5f5f4",
                  border: "1px solid #57534e",
                  cursor: "pointer",
                }}
              >
                Edition #1: Jeju / IU / JTBC / Sci-Fi
              </button>
            </div>
          )}

          {/* Sub-choice for Actor / People */}
          {mode === "people" && (
            <div style={{ display: "flex", gap: "10px", marginTop: "12px", alignItems: "center", flexWrap: "wrap" }}>
              <span style={{ fontSize: "12px", color: "#a8a29e", fontWeight: 600 }}>Actor:</span>
              <button
                type="button"
                onClick={() => { setActorChoice("kim-ji-won"); resetGame(); }}
                style={{
                  padding: "6px 12px",
                  borderRadius: "6px",
                  fontSize: "12px",
                  fontWeight: 600,
                  background: actorChoice === "kim-ji-won" ? "#dc2626" : "transparent",
                  color: "#f5f5f4",
                  border: actorChoice === "kim-ji-won" ? "1px solid #ef4444" : "1px solid #57534e",
                  cursor: "pointer",
                }}
              >
                🔥 Kim Ji-won (김지원) - Using your photo!
              </button>
              <button
                type="button"
                onClick={() => { setActorChoice("park-bo-gum"); resetGame(); }}
                style={{
                  padding: "6px 12px",
                  borderRadius: "6px",
                  fontSize: "12px",
                  background: actorChoice === "park-bo-gum" ? "#44403c" : "transparent",
                  color: "#f5f5f4",
                  border: "1px solid #57534e",
                  cursor: "pointer",
                }}
              >
                Park Bo-gum (박보검) - Oct 28
              </button>
              <button
                type="button"
                onClick={() => { setActorChoice("cha-eun-woo"); resetGame(); }}
                style={{
                  padding: "6px 12px",
                  borderRadius: "6px",
                  fontSize: "12px",
                  background: actorChoice === "cha-eun-woo" ? "#44403c" : "transparent",
                  color: "#f5f5f4",
                  border: "1px solid #57534e",
                  cursor: "pointer",
                }}
              >
                Cha Eun-woo (차은우) - Oct 29
              </button>
            </div>
          )}
        </div>

        {/* Active Game View */}
        <div key={key}>
          {mode === "connections" && (
            <ConnectionsGameView
              payload={connectionsChoice === "edition-2" ? CONNECTIONS_EDITION_2_PAYLOAD : DEMO_CONNECTIONS_PAYLOAD}
            />
          )}

          {mode === "people" && (
            <PeopleGameView
              payload={
                actorChoice === "kim-ji-won"
                  ? KIM_JI_WON_PEOPLE_PAYLOAD
                  : actorChoice === "park-bo-gum"
                  ? DEMO_PEOPLE_PAYLOAD
                  : (CHA_EUN_WOO_PEOPLE_PAYLOAD as any)
              }
              dramas={DEMO_DRAMAS}
            />
          )}

          {mode === "chosung" && (
            <ChosungGameView
              payload={
                chosungChoice === "queen-of-tears"
                  ? QUEEN_OF_TEARS_CHOSUNG_PAYLOAD
                  : chosungChoice === "goblin"
                  ? GOBLIN_CHOSUNG_PAYLOAD
                  : DEMO_CHOSUNG_PAYLOAD
              }
              dramas={DEMO_DRAMAS}
            />
          )}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
