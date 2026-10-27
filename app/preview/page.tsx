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
import type { ChosungPayload } from "@/types/game";

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
  const [actorChoice, setActorChoice] = useState<"park-bo-gum" | "cha-eun-woo">("park-bo-gum");
  const [chosungChoice, setChosungChoice] = useState<"tangerines" | "goblin">("tangerines");
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
              <span style={{ fontSize: "11px", letterSpacing: "1.5px", textTransform: "uppercase", color: "#a8a29e", fontWeight: 700 }}>
                LIVE PREVIEW MODE
              </span>
              <h1 style={{ fontSize: "20px", margin: "4px 0 0 0", color: "#fafaf9" }}>
                Test Game Modes Before Pushing
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
              Option A: K-Connections
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
              Option C: Actor / People
            </button>

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
              Option D: 초성 (Chosung)
            </button>
          </div>

          {/* Sub-choice for Actor / People */}
          {mode === "people" && (
            <div style={{ display: "flex", gap: "10px", marginTop: "12px", alignItems: "center", flexWrap: "wrap" }}>
              <span style={{ fontSize: "12px", color: "#a8a29e" }}>Actor:</span>
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
                Park Bo-gum (박보검) - Real Photos
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
                Cha Eun-woo (차은우) - Real Photos
              </button>
            </div>
          )}

          {/* Sub-choice for Chosung */}
          {mode === "chosung" && (
            <div style={{ display: "flex", gap: "10px", marginTop: "12px", alignItems: "center" }}>
              <span style={{ fontSize: "12px", color: "#a8a29e" }}>Puzzle:</span>
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
                ㄷㄲㅂ (도깨비)
              </button>
            </div>
          )}
        </div>

        {/* Active Game View */}
        <div key={key}>
          {mode === "connections" && (
            <ConnectionsGameView payload={DEMO_CONNECTIONS_PAYLOAD} />
          )}

          {mode === "people" && (
            <PeopleGameView
              payload={actorChoice === "park-bo-gum" ? DEMO_PEOPLE_PAYLOAD : (CHA_EUN_WOO_PEOPLE_PAYLOAD as any)}
              dramas={DEMO_DRAMAS}
            />
          )}

          {mode === "chosung" && (
            <ChosungGameView
              payload={chosungChoice === "tangerines" ? DEMO_CHOSUNG_PAYLOAD : GOBLIN_CHOSUNG_PAYLOAD}
              dramas={DEMO_DRAMAS}
            />
          )}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
