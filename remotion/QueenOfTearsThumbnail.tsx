import React from "react";
import { Img, staticFile } from "remotion";

export const QueenOfTearsThumbnail: React.FC = () => {
  return (
    <div
      style={{
        width: 1080,
        height: 1920,
        backgroundColor: "#0D0B0A",
        backgroundImage:
          "radial-gradient(circle at 50% 15%, #251716 0%, #0D0B0A 80%)",
        color: "#F5F5F4",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "70px 52px 60px 52px",
        boxSizing: "border-box",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* ── TOP BADGE ── */}
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingBottom: 22,
            borderBottom: "1px solid rgba(255, 255, 255, 0.15)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div
              style={{
                width: 58,
                height: 58,
                borderRadius: "50%",
                backgroundColor: "#DC2626",
                color: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 24,
                fontWeight: 900,
                boxShadow: "0 6px 18px rgba(220, 38, 38, 0.5)",
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
                  color: "#FFFFFF",
                  fontFamily: "Georgia, 'Times New Roman', serif",
                }}
              >
                Hankut
              </div>
              <div
                style={{
                  fontSize: 14,
                  letterSpacing: "0.18em",
                  color: "#A8A29E",
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
              background: "rgba(220, 38, 38, 0.2)",
              border: "1px solid rgba(220, 38, 38, 0.5)",
              borderRadius: 22,
              padding: "9px 22px",
              fontSize: 17,
              fontWeight: 900,
              color: "#F87171",
              letterSpacing: "0.04em",
            }}
          >
            🔥 82% FAILED
          </div>
        </div>

        {/* Big Hook Title */}
        <div style={{ marginTop: 36 }}>
          <div
            style={{
              fontSize: 22,
              fontWeight: 800,
              letterSpacing: "0.14em",
              color: "#FACC15",
              textTransform: "uppercase",
              marginBottom: 10,
            }}
          >
            SAVAGE K-DRAMA CHALLENGE
          </div>
          <div
            style={{
              fontSize: 66,
              fontWeight: 900,
              fontFamily: "Georgia, 'Times New Roman', serif",
              lineHeight: 1.08,
              color: "#FFFFFF",
              letterSpacing: "-1px",
            }}
          >
            Guess From
            <br />
            <span
              style={{
                background: "linear-gradient(90deg, #DC2626 0%, #F87171 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              The Shoes Alone 👠
            </span>
          </div>
        </div>
      </div>

      {/* ── CINEMATIC SPLIT CARDS ── */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 20,
          margin: "30px 0",
        }}
      >
        {/* Cut 1 (The Shoes) */}
        <div
          style={{
            width: "100%",
            height: 380,
            borderRadius: 22,
            overflow: "hidden",
            position: "relative",
            boxShadow: "0 20px 40px rgba(0,0,0,0.8)",
            border: "2px solid rgba(220, 38, 38, 0.6)",
          }}
        >
          <Img
            src={staticFile("/reels/queen_of_tears/frame-1.webp")}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <div
            style={{
              position: "absolute",
              top: 18,
              left: 18,
              background: "#DC2626",
              color: "#FFFFFF",
              fontSize: 16,
              fontWeight: 900,
              padding: "6px 16px",
              borderRadius: 10,
              letterSpacing: "0.08em",
            }}
          >
            CUT 01 / 05
          </div>
        </div>

        {/* Cut 5 (The Boss Face - Teaser with mysterious glow) */}
        <div
          style={{
            width: "100%",
            height: 380,
            borderRadius: 22,
            overflow: "hidden",
            position: "relative",
            boxShadow: "0 20px 40px rgba(0,0,0,0.8)",
            border: "2px solid rgba(255, 255, 255, 0.2)",
          }}
        >
          <Img
            src={staticFile("/reels/queen_of_tears/frame-5.webp")}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to top, rgba(13, 11, 10, 0.95) 0%, transparent 60%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: 20,
              left: 24,
              right: 24,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 14,
                  color: "#FEF08A",
                  fontWeight: 800,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                }}
              >
                CUT 05 REVEAL
              </div>
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 900,
                  color: "#FFFFFF",
                  fontFamily: "Georgia, 'Times New Roman', serif",
                }}
              >
                Hong Hae-in 👑
              </div>
            </div>
            <div
              style={{
                background: "rgba(0,0,0,0.6)",
                border: "1px solid rgba(254, 240, 138, 0.4)",
                padding: "8px 16px",
                borderRadius: 12,
                fontSize: 16,
                fontWeight: 800,
                color: "#FEF08A",
              }}
            >
              +80 PTS
            </div>
          </div>
        </div>
      </div>

      {/* ── BOTTOM CALL TO ACTION ── */}
      <div
        style={{
          width: "100%",
          background: "rgba(255, 255, 255, 0.05)",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          borderRadius: 24,
          padding: "28px 32px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "0 16px 36px rgba(0, 0, 0, 0.5)",
        }}
      >
        <div>
          <div
            style={{
              fontSize: 15,
              color: "#A8A29E",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            Play Free Online
          </div>
          <div
            style={{
              fontSize: 34,
              fontWeight: 900,
              color: "#FEF08A",
              marginTop: 4,
            }}
          >
            hankut.shivachandra.work
          </div>
        </div>

        <div
          style={{
            background: "#DC2626",
            color: "#FFFFFF",
            fontSize: 20,
            fontWeight: 900,
            padding: "16px 30px",
            borderRadius: 16,
            boxShadow: "0 8px 24px rgba(220, 38, 38, 0.5)",
          }}
        >
          Play Today ➔
        </div>
      </div>
    </div>
  );
};
