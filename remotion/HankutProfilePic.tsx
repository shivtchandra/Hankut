import React from "react";

export const HankutProfilePic: React.FC = () => {
  return (
    <div
      style={{
        width: 1000,
        height: 1000,
        backgroundColor: "#161413",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        fontFamily: "Georgia, 'Times New Roman', serif",
      }}
    >
      {/* Subtle warm radial gradient */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 50% 40%, rgba(220, 38, 38, 0.22) 0%, rgba(22, 20, 19, 0) 70%)",
        }}
      />

      {/* Outer concentric stamp ring */}
      <div
        style={{
          width: 860,
          height: 860,
          borderRadius: "50%",
          border: "4px dashed rgba(253, 251, 247, 0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "absolute",
        }}
      />

      {/* Main Solid Inner Disc */}
      <div
        style={{
          width: 760,
          height: 760,
          borderRadius: "50%",
          backgroundColor: "#1C1917",
          border: "6px solid #DC2626",
          boxShadow:
            "0 30px 80px rgba(0, 0, 0, 0.6), 0 0 60px rgba(220, 38, 38, 0.35)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        {/* Top Tagline Pill */}
        <div
          style={{
            background: "#DC2626",
            color: "#FFFFFF",
            fontSize: 28,
            fontWeight: 900,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            padding: "8px 28px",
            borderRadius: 24,
            marginBottom: 20,
            fontFamily:
              "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          }}
        >
          Daily K-Drama
        </div>

        {/* Central Korean Hangul Glyph "컷" (Cut) */}
        <div
          style={{
            fontSize: 320,
            fontWeight: 900,
            lineHeight: 0.9,
            color: "#FDFBF7",
            textShadow: "0 10px 30px rgba(0, 0, 0, 0.7)",
            letterSpacing: "-4px",
            fontFamily:
              "'Noto Serif KR', 'Apple SD Gothic Neo', 'Nanum Myeongjo', serif",
            marginTop: 10,
          }}
        >
          컷
        </div>

        {/* Brand Name "HANKUT" */}
        <div
          style={{
            fontSize: 64,
            fontWeight: 900,
            color: "#FDFBF7",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            marginTop: 16,
          }}
        >
          HANKUT
        </div>

        {/* Subtitle Dot Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginTop: 14,
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: "0.25em",
            color: "#A8A29E",
            textTransform: "uppercase",
            fontFamily:
              "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          }}
        >
          <span>5 FRAMES</span>
          <span style={{ color: "#DC2626" }}>•</span>
          <span>1 GUESS</span>
        </div>
      </div>
    </div>
  );
};
