import React from "react";
import { Img, staticFile } from "remotion";

export const HankutThumbnail: React.FC = () => {
  return (
    <div
      style={{
        width: 1080,
        height: 1920,
        backgroundColor: "#FDFBF7",
        backgroundImage:
          "radial-gradient(circle at 50% 0%, #FFFFFF 0%, #F8F5EE 60%, #EFEAE0 100%)",
        color: "#1C1917",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "80px 56px 64px 56px",
        boxSizing: "border-box",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative background grid line accents */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 56,
          right: 56,
          height: 1,
          backgroundColor: "rgba(28, 25, 23, 0.08)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 56,
          right: 56,
          height: 1,
          backgroundColor: "rgba(28, 25, 23, 0.08)",
        }}
      />

      {/* ── TOP SECTION ── */}
      <div>
        {/* Brand bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingBottom: 28,
            borderBottom: "2px solid rgba(28, 25, 23, 0.12)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div
              style={{
                width: 60,
                height: 60,
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
                  fontSize: 38,
                  fontWeight: 900,
                  letterSpacing: "-0.5px",
                  color: "#1C1917",
                  fontFamily: "Georgia, 'Times New Roman', serif",
                }}
              >
                Hankut
              </div>
              <div
                style={{
                  fontSize: 14,
                  letterSpacing: "0.18em",
                  color: "#78716C",
                  textTransform: "uppercase",
                  fontWeight: 700,
                }}
              >
                Daily K-Drama Frame Game
              </div>
            </div>
          </div>

          <div
            style={{
              background: "#1C1917",
              color: "#FDFBF7",
              borderRadius: 30,
              padding: "10px 24px",
              fontSize: 17,
              fontWeight: 800,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Today&apos;s Cut
          </div>
        </div>

        {/* Big Hook Title */}
        <div style={{ marginTop: 44, textAlign: "center" }}>
          <div
            style={{
              display: "inline-block",
              background: "rgba(220, 38, 38, 0.1)",
              border: "1.5px solid rgba(220, 38, 38, 0.3)",
              borderRadius: 24,
              padding: "8px 24px",
              color: "#DC2626",
              fontSize: 18,
              fontWeight: 800,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              marginBottom: 18,
            }}
          >
            94% of Kdrama Fans Fail Cut 1
          </div>

          <div
            style={{
              fontSize: 66,
              lineHeight: 1.08,
              fontWeight: 900,
              letterSpacing: "-1.5px",
              color: "#1C1917",
              fontFamily: "Georgia, 'Times New Roman', serif",
            }}
          >
            Can you guess the drama from <span style={{ color: "#DC2626", fontStyle: "italic" }}>1 frame</span>?
          </div>
        </div>
      </div>

      {/* ── CINEMATIC STILL CARD ── */}
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          margin: "24px 0",
        }}
      >
        <div
          style={{
            width: "100%",
            height: 680,
            borderRadius: 28,
            overflow: "hidden",
            position: "relative",
            boxShadow:
              "0 24px 50px -12px rgba(28, 25, 23, 0.25), 0 0 0 1px rgba(28, 25, 23, 0.15)",
            backgroundColor: "#000",
          }}
        >
          <Img
            src={staticFile("/reels/gangnam_beauty/frame-1.webp")}
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
                "linear-gradient(to top, rgba(0, 0, 0, 0.88) 0%, rgba(0,0,0,0.1) 40%, rgba(0, 0, 0, 0.6) 100%)",
            }}
          />

          {/* Card Top Badges */}
          <div
            style={{
              position: "absolute",
              top: 26,
              left: 28,
              right: 28,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div
              style={{
                background: "#DC2626",
                color: "#FFFFFF",
                fontWeight: 900,
                fontSize: 18,
                padding: "8px 20px",
                borderRadius: 20,
                letterSpacing: "0.1em",
              }}
            >
              CUT 01 / 05
            </div>

            <div
              style={{
                background: "rgba(0, 0, 0, 0.65)",
                backdropFilter: "blur(8px)",
                color: "#FDFBF7",
                fontWeight: 700,
                fontSize: 16,
                padding: "8px 18px",
                borderRadius: 20,
                border: "1px solid rgba(255, 255, 255, 0.2)",
                letterSpacing: "0.06em",
              }}
            >
              MAX SCORE: 100 PTS
            </div>
          </div>

          {/* Card Bottom Clues */}
          <div
            style={{
              position: "absolute",
              bottom: 24,
              left: 28,
              right: 28,
            }}
          >
            <div
              style={{
                fontSize: 15,
                color: "#D6D3D1",
                textTransform: "uppercase",
                letterSpacing: "0.14em",
                fontWeight: 700,
                marginBottom: 6,
              }}
            >
              Drama Clues
            </div>
            <div
              style={{
                fontSize: 26,
                fontWeight: 800,
                color: "#FFFFFF",
                fontFamily: "Georgia, 'Times New Roman', serif",
                letterSpacing: "-0.3px",
              }}
            >
              2018 (JTBC) • College Romance • Webtoon Adaptation
            </div>
          </div>
        </div>

        {/* Frame Tracker Dots */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginTop: 22,
          }}
        >
          <div
            style={{
              width: 36,
              height: 12,
              borderRadius: 6,
              backgroundColor: "#DC2626",
            }}
          />
          <div
            style={{
              width: 14,
              height: 12,
              borderRadius: 6,
              backgroundColor: "rgba(28, 25, 23, 0.2)",
            }}
          />
          <div
            style={{
              width: 14,
              height: 12,
              borderRadius: 6,
              backgroundColor: "rgba(28, 25, 23, 0.2)",
            }}
          />
          <div
            style={{
              width: 14,
              height: 12,
              borderRadius: 6,
              backgroundColor: "rgba(28, 25, 23, 0.2)",
            }}
          />
          <div
            style={{
              width: 14,
              height: 12,
              borderRadius: 6,
              backgroundColor: "rgba(28, 25, 23, 0.2)",
            }}
          />
        </div>
      </div>

      {/* ── INTERACTIVE GUESS TEASER & CTA ── */}
      <div>
        {/* Guess Card */}
        <div
          style={{
            background: "#F4F0E8",
            border: "2px solid rgba(28, 25, 23, 0.12)",
            borderRadius: 24,
            padding: "26px 30px",
            display: "flex",
            flexDirection: "column",
            gap: 16,
            boxShadow: "0 10px 30px rgba(28, 25, 23, 0.05)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div
              style={{
                fontSize: 16,
                fontWeight: 800,
                color: "#57534E",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              Guess The Title
            </div>
            <div
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: "#B45309",
              }}
            >
              1 cut reveals 1 new hint
            </div>
          </div>

          {/* Letter Puzzle Tiles / Input Mockup */}
          <div
            style={{
              height: 68,
              background: "#FFFFFF",
              border: "2px dashed rgba(28, 25, 23, 0.25)",
              borderRadius: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 24px",
            }}
          >
            <span
              style={{
                fontSize: 24,
                fontFamily: "Georgia, 'Times New Roman', serif",
                letterSpacing: "4px",
                color: "#1C1917",
                fontWeight: 700,
              }}
            >
              M _  I D  I S  G _ _ _ _ _ M  _ _ _ _ _ Y
            </span>

            <div
              style={{
                background: "#DC2626",
                color: "#FFFFFF",
                fontWeight: 800,
                fontSize: 16,
                padding: "10px 22px",
                borderRadius: 12,
                letterSpacing: "0.06em",
              }}
            >
              GUESS
            </div>
          </div>
        </div>

        {/* Final CTA Bar */}
        <div
          style={{
            marginTop: 26,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 10,
          }}
        >
          <div
            style={{
              width: "100%",
              background: "#1C1917",
              color: "#FFFFFF",
              padding: "22px 0",
              borderRadius: 20,
              textAlign: "center",
              fontSize: 24,
              fontWeight: 800,
              letterSpacing: "0.04em",
              boxShadow: "0 12px 28px rgba(28, 25, 23, 0.2)",
            }}
          >
            Play Free: hankut-psi.vercel.app
          </div>

          <div
            style={{
              fontSize: 16,
              color: "#78716C",
              fontWeight: 600,
              letterSpacing: "0.02em",
            }}
          >
            Drop your score in comments • Daily puzzle resets midnight KST
          </div>
        </div>
      </div>
    </div>
  );
};
