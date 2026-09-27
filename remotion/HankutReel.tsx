import React from "react";
import {
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  Img,
} from "remotion";

export const HankutReel: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const time = frame / fps;

  // Timeline events:
  // 0.0 - 2.8s: Frame 1 (Attempt 1: "True Beauty" - Wrong Shake)
  // 2.8 - 6.0s: Frame 2 (Attempt 2: "Weightlifting Fairy" - Wrong Shake)
  // 6.0 - 9.0s: Frame 3 (Clues unlock: "2018 (JTBC) • College Romance")
  // 9.0 - 13.0s: Frame 4 (Attempt 3: "My ID is Gangnam Beauty" - Solved!)
  // 13.0 - 15.5s: Victory Card Display (+80 PTS, 2 Day Streak)
  // 15.5 - 18.0s: Outro Call-To-Action Banner

  let currentFrameIdx = 0;
  let inputText = "";
  let isShaking = false;
  let shakeOffset = 0;
  let isSolved = false;
  let attempts: string[] = [];
  let cluesUnlocked = false;
  let isOutro = false;

  if (time < 2.8) {
    currentFrameIdx = 0;
    const full = "True Beauty";
    const chars = Math.min(full.length, Math.floor((time / 1.8) * full.length));
    inputText = full.slice(0, chars);
    if (time >= 2.2 && time < 2.7) {
      isShaking = true;
      shakeOffset = Math.sin((time - 2.2) * 45) * 14;
    }
  } else if (time < 6.0) {
    currentFrameIdx = 1;
    attempts = ["True Beauty"];
    const full = "Weightlifting Fairy";
    const dt = time - 2.8;
    const chars = Math.min(full.length, Math.floor((dt / 1.8) * full.length));
    inputText = full.slice(0, chars);
    if (time >= 5.2 && time < 5.8) {
      isShaking = true;
      shakeOffset = Math.sin((time - 5.2) * 45) * 14;
    }
  } else if (time < 9.0) {
    currentFrameIdx = 2;
    attempts = ["True Beauty", "Weightlifting Fairy"];
    cluesUnlocked = true;
    inputText = "";
    if (time > 7.8) {
      currentFrameIdx = 3;
    }
  } else if (time < 13.0) {
    currentFrameIdx = 3;
    attempts = ["True Beauty", "Weightlifting Fairy"];
    cluesUnlocked = true;
    const full = "My ID is Gangnam Beauty";
    const dt = time - 9.0;
    const chars = Math.min(full.length, Math.floor((dt / 2.0) * full.length));
    inputText = full.slice(0, chars);
    if (time >= 12.0) {
      isSolved = true;
      attempts = ["True Beauty", "Weightlifting Fairy", "My ID is Gangnam Beauty"];
    }
  } else if (time < 15.5) {
    currentFrameIdx = 3;
    attempts = ["True Beauty", "Weightlifting Fairy", "My ID is Gangnam Beauty"];
    cluesUnlocked = true;
    isSolved = true;
  } else {
    isOutro = true;
  }

  // Smooth entrance animations
  const solveScale = spring({
    frame: frame - 12 * fps,
    fps,
    config: { damping: 12 },
  });

  const outroProgress = spring({
    frame: frame - 15.5 * fps,
    fps,
    config: { damping: 14 },
  });

  return (
    <div
      style={{
        width: 1080,
        height: 1920,
        backgroundColor: "#FDFBF7",
        backgroundImage:
          "radial-gradient(circle at 50% 0%, rgba(255, 255, 255, 0.95), transparent 70%)",
        color: "#1C1917",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "60px 48px 36px 48px",
        position: "relative",
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      {/* ── TOP SECTION ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {/* Top Navbar */}
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingBottom: 22,
            borderBottom: "1px solid rgba(28, 25, 23, 0.12)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                backgroundColor: "#1C1917",
                color: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 22,
                fontWeight: 900,
                letterSpacing: "1px",
              }}
            >
              HK
            </div>
            <div>
              <div
                style={{
                  fontSize: 36,
                  fontWeight: 800,
                  letterSpacing: "-0.5px",
                  color: "#1C1917",
                  fontFamily: "Georgia, 'Times New Roman', serif",
                }}
              >
                Hankut
              </div>
              <div
                style={{
                  fontSize: 13,
                  letterSpacing: "0.16em",
                  color: "#78716C",
                  textTransform: "uppercase",
                  fontWeight: 600,
                }}
              >
                Korean Culture Daily
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                background: "#F4F0E8",
                border: "1px solid rgba(28, 25, 23, 0.1)",
                borderRadius: 24,
                padding: "8px 20px",
                fontSize: 17,
                fontWeight: 800,
                color: "#B45309",
                letterSpacing: "0.04em",
              }}
            >
              1 DAY STREAK
            </div>

            <div
              style={{
                background: "#F4F0E8",
                border: "1px solid rgba(28, 25, 23, 0.1)",
                borderRadius: 20,
                padding: "8px 18px",
                fontSize: 16,
                fontWeight: 700,
                color: "#57534E",
              }}
            >
              KO | <span style={{ color: "#DC2626" }}>EN</span>
            </div>
          </div>
        </div>

        {/* Subheader & Date Navigation */}
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <div
              style={{
                fontSize: 38,
                fontWeight: 800,
                fontFamily: "Georgia, 'Times New Roman', serif",
                color: "#1C1917",
              }}
            >
              Today&apos;s Scene Cut
            </div>
            <div style={{ fontSize: 18, color: "#78716C", marginTop: 4 }}>
              Guess the drama from 5 progressive stills.
            </div>
          </div>

          <div
            style={{
              background: "#F4F0E8",
              border: "1px solid rgba(28, 25, 23, 0.12)",
              borderRadius: 30,
              padding: "10px 22px",
              fontSize: 16,
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: 16,
              color: "#1C1917",
              letterSpacing: "0.04em",
            }}
          >
            <span style={{ color: "#78716C" }}>&lt;</span>
            <span>SUN, 27 SEPT 2026</span>
            <span style={{ color: "#78716C" }}>&gt;</span>
          </div>
        </div>
      </div>

      {/* ── SCENE STILL (Prominent, Cinematic 984x640) ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div
          style={{
            width: "100%",
            height: 640,
            borderRadius: 24,
            overflow: "hidden",
            position: "relative",
            boxShadow: "0 20px 48px rgba(28, 25, 23, 0.15)",
            border: isShaking
              ? "3px solid #DC2626"
              : isSolved
              ? "3px solid #10B981"
              : "1px solid rgba(28, 25, 23, 0.18)",
            transform: `translateX(${shakeOffset}px)`,
            backgroundColor: "#000",
          }}
        >
          <Img
            src={staticFile(`/reels/gangnam_beauty/frame-${currentFrameIdx + 1}.webp`)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />

          {/* Vignette Overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse at center, transparent 65%, rgba(0, 0, 0, 0.55) 100%)",
              pointerEvents: "none",
            }}
          />

          {/* HUD on Image */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              padding: "20px 28px",
              background:
                "linear-gradient(to top, rgba(0, 0, 0, 0.85) 0%, transparent 100%)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontWeight: 800,
              fontSize: 22,
              color: "#FFFFFF",
              letterSpacing: "0.08em",
            }}
          >
            <span>FRAME 0{currentFrameIdx + 1} / 05</span>
            <span style={{ color: "#D6D3D1" }}>
              {attempts.length} / 5 ATTEMPTS
            </span>
          </div>
        </div>

        {/* Frame Navigation Controls */}
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "8px 12px",
          }}
        >
          <span
            style={{
              fontSize: 18,
              color: currentFrameIdx === 0 ? "#A8A29E" : "#57534E",
              fontWeight: 700,
            }}
          >
            &lt; Prev cut
          </span>

          {/* 5 Dots */}
          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                style={{
                  width: i === currentFrameIdx ? 32 : 14,
                  height: 14,
                  borderRadius: 7,
                  backgroundColor:
                    i === currentFrameIdx
                      ? "#DC2626"
                      : i < currentFrameIdx
                      ? "#1C1917"
                      : "rgba(28, 25, 23, 0.2)",
                  transition: "all 0.3s ease",
                }}
              />
            ))}
          </div>

          <span style={{ fontSize: 18, color: "#1C1917", fontWeight: 700 }}>
            Next cut &gt;
          </span>
        </div>
      </div>

      {/* ── GUESS PANEL CARD (Elevated & Refined) ── */}
      <div
        style={{
          width: "100%",
          background: "#FFFFFF",
          border: "1px solid rgba(28, 25, 23, 0.12)",
          borderRadius: 24,
          padding: "32px 36px",
          boxShadow: "0 12px 32px rgba(28, 25, 23, 0.06)",
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span
            style={{
              fontSize: 15,
              letterSpacing: "0.14em",
              fontWeight: 800,
              color: "#DC2626",
              textTransform: "uppercase",
            }}
          >
            YOUR GUESS
          </span>
          <span
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: "#78716C",
              border: "1px solid rgba(28, 25, 23, 0.14)",
              borderRadius: 20,
              padding: "5px 16px",
            }}
          >
            Share Game
          </span>
        </div>

        <h2
          style={{
            fontSize: 34,
            fontWeight: 800,
            margin: 0,
            fontFamily: "Georgia, 'Times New Roman', serif",
            color: "#1C1917",
          }}
        >
          What drama is this?
        </h2>

        {/* Input Box */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            background: "#FDFBF7",
            border: isShaking
              ? "2px solid #DC2626"
              : isSolved
              ? "2px solid #10B981"
              : "1px solid rgba(28, 25, 23, 0.2)",
            borderRadius: 16,
            padding: "6px 8px 6px 20px",
            height: 78,
            transform: `translateX(${shakeOffset}px)`,
          }}
        >
          <div
            style={{
              flex: 1,
              fontSize: 24,
              fontWeight: inputText ? 700 : 400,
              color: inputText ? "#1C1917" : "#A8A29E",
            }}
          >
            {inputText || "Search drama title..."}
          </div>
          <div
            style={{
              background: inputText ? "#DC2626" : "rgba(28, 25, 23, 0.15)",
              color: "#FFFFFF",
              fontWeight: 800,
              fontSize: 20,
              padding: "16px 30px",
              borderRadius: 12,
            }}
          >
            Guess
          </div>
        </div>

        {/* Skip (+1 frame) Button */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "#F4F0E8",
            border: "1px solid rgba(28, 25, 23, 0.08)",
            borderRadius: 14,
            padding: "14px 22px",
            fontSize: 17,
            fontWeight: 700,
            color: "#57534E",
          }}
        >
          <span>Skip (+1 cut)</span>
          <div style={{ display: "flex", gap: 8 }}>
            {[0, 1, 2, 3, 4].map((d) => (
              <div
                key={d}
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  backgroundColor:
                    d < attempts.length ? "#DC2626" : "rgba(28, 25, 23, 0.2)",
                }}
              />
            ))}
          </div>
        </div>

        {/* Clues Row */}
        <div style={{ display: "flex", gap: 16 }}>
          <div
            style={{
              flex: 1,
              background: cluesUnlocked ? "#ECFDF5" : "#F4F0E8",
              border: cluesUnlocked
                ? "1px solid #10B981"
                : "1px solid rgba(28, 25, 23, 0.1)",
              borderRadius: 14,
              padding: "14px 18px",
            }}
          >
            <div
              style={{
                fontSize: 13,
                color: "#78716C",
                fontWeight: 800,
                textTransform: "uppercase",
              }}
            >
              Year Clue
            </div>
            <div
              style={{
                fontSize: 19,
                fontWeight: 800,
                color: cluesUnlocked ? "#065F46" : "#78716C",
                marginTop: 4,
              }}
            >
              {cluesUnlocked ? "2018 (JTBC)" : "Unlocks on Frame 3"}
            </div>
          </div>

          <div
            style={{
              flex: 1,
              background: cluesUnlocked ? "#ECFDF5" : "#F4F0E8",
              border: cluesUnlocked
                ? "1px solid #10B981"
                : "1px solid rgba(28, 25, 23, 0.1)",
              borderRadius: 14,
              padding: "14px 18px",
            }}
          >
            <div
              style={{
                fontSize: 13,
                color: "#78716C",
                fontWeight: 800,
                textTransform: "uppercase",
              }}
            >
              Genre Clue
            </div>
            <div
              style={{
                fontSize: 19,
                fontWeight: 800,
                color: cluesUnlocked ? "#065F46" : "#78716C",
                marginTop: 4,
              }}
            >
              {cluesUnlocked ? "Romance / College" : "Locked"}
            </div>
          </div>
        </div>

        {/* Result or Attempts List */}
        {isSolved ? (
          <div
            style={{
              background: "#ECFDF5",
              border: "2px solid #10B981",
              borderRadius: 18,
              padding: "24px 28px",
              transform: `scale(${solveScale})`,
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            <div
              style={{
                fontSize: 16,
                fontWeight: 800,
                letterSpacing: "0.12em",
                color: "#059669",
                textTransform: "uppercase",
              }}
            >
              CORRECT ANSWER
            </div>
            <div
              style={{
                fontSize: 34,
                fontWeight: 800,
                color: "#064E3B",
                fontFamily: "Georgia, 'Times New Roman', serif",
              }}
            >
              My ID is Gangnam Beauty
            </div>
            <div style={{ fontSize: 20, color: "#047857", fontWeight: 600 }}>
              내 아이디는 강남미인 (2018)
            </div>

            <div
              style={{
                display: "flex",
                gap: 16,
                marginTop: 10,
                paddingTop: 14,
                borderTop: "1px solid #A7F3D0",
              }}
            >
              <div
                style={{
                  background: "#FFFFFF",
                  padding: "10px 22px",
                  borderRadius: 12,
                }}
              >
                <div style={{ fontSize: 12, color: "#6B7280", fontWeight: 700 }}>
                  SCORE
                </div>
                <div
                  style={{ fontSize: 24, fontWeight: 800, color: "#059669" }}
                >
                  +80 PTS
                </div>
              </div>
              <div
                style={{
                  background: "#FFFFFF",
                  padding: "10px 22px",
                  borderRadius: 12,
                }}
              >
                <div style={{ fontSize: 12, color: "#6B7280", fontWeight: 700 }}>
                  DAILY STREAK
                </div>
                <div
                  style={{ fontSize: 24, fontWeight: 800, color: "#B45309" }}
                >
                  2 DAYS
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {attempts.map((att, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  background: "#FDFBF7",
                  border: "1px solid rgba(28, 25, 23, 0.12)",
                  borderRadius: 12,
                  padding: "12px 18px",
                  fontSize: 18,
                  fontWeight: 700,
                  color: "#1C1917",
                }}
              >
                <span>
                  0{idx + 1}. {att}
                </span>
                <span style={{ color: "#DC2626", fontWeight: 800 }}>WRONG</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── COMMUNITY TICKER / STATS BAR (Fills vertical void with social proof) ── */}
      <div
        style={{
          width: "100%",
          background: "#F4F0E8",
          border: "1px solid rgba(28, 25, 23, 0.1)",
          borderRadius: 18,
          padding: "16px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              backgroundColor: "#10B981",
              boxShadow: "0 0 8px #10B981",
            }}
          />
          <span style={{ fontSize: 17, fontWeight: 700, color: "#1C1917" }}>
            1,420 Kdrama fans played today
          </span>
        </div>
        <span
          style={{
            fontSize: 16,
            fontWeight: 800,
            color: "#DC2626",
            letterSpacing: "0.04em",
          }}
        >
          AVG SCORE: 72 PTS
        </span>
      </div>

      {/* ── BOTTOM DOCK NAVIGATION ── */}
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          padding: "14px 0 6px 0",
          borderTop: "1px solid rgba(28, 25, 23, 0.1)",
        }}
      >
        <div
          style={{
            textAlign: "center",
            color: "#DC2626",
            fontWeight: 800,
            fontSize: 18,
          }}
        >
          Today
        </div>
        <div
          style={{
            textAlign: "center",
            color: "#78716C",
            fontWeight: 700,
            fontSize: 18,
          }}
        >
          Browse
        </div>
        <div
          style={{
            textAlign: "center",
            color: "#78716C",
            fontWeight: 700,
            fontSize: 18,
          }}
        >
          Archive
        </div>
      </div>

      {/* ── OUTRO OVERLAY SCREEN ── */}
      {isOutro && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "rgba(20, 18, 16, 0.96)",
            backdropFilter: "blur(14px)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: 64,
            textAlign: "center",
            transform: `scale(${outroProgress})`,
            zIndex: 100,
          }}
        >
          <div
            style={{
              width: 96,
              height: 96,
              borderRadius: "50%",
              backgroundColor: "#DC2626",
              color: "#FFFFFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 38,
              fontWeight: 800,
              fontFamily: "Georgia, 'Times New Roman', serif",
              marginBottom: 26,
              boxShadow: "0 12px 36px rgba(220, 38, 38, 0.5)",
            }}
          >
            HK
          </div>

          <div
            style={{
              fontSize: 54,
              fontWeight: 800,
              color: "#FFFFFF",
              letterSpacing: "-0.5px",
              marginBottom: 16,
              fontFamily: "Georgia, 'Times New Roman', serif",
            }}
          >
            CAN YOU GUESS IN 1 CUT?
          </div>

          <div
            style={{
              fontSize: 26,
              color: "#A8A29E",
              lineHeight: 1.5,
              maxWidth: 760,
              marginBottom: 48,
            }}
          >
            Every day, a new mystery K-drama scene drops. 5 stills to prove your
            drama memory.
          </div>

          <div
            style={{
              background: "#DC2626",
              color: "#FFFFFF",
              fontSize: 32,
              fontWeight: 800,
              padding: "24px 60px",
              borderRadius: 20,
              boxShadow: "0 14px 36px rgba(220, 38, 38, 0.4)",
              marginBottom: 26,
            }}
          >
            Play Today&apos;s Mystery Cut
          </div>

          <div
            style={{
              fontSize: 38,
              fontWeight: 800,
              color: "#DC2626",
              letterSpacing: "0.02em",
              marginBottom: 10,
            }}
          >
            hankut-psi.vercel.app
          </div>

          <div style={{ fontSize: 22, color: "#78716C", fontWeight: 700 }}>
            Link in Bio
          </div>
        </div>
      )}
    </div>
  );
};
