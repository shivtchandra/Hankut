import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const title = searchParams.get("title") || "Guess the K-Drama from one cut";
    const drama = searchParams.get("drama") || "";
    const date = searchParams.get("date") || "DAILY PUZZLE";
    const streak = searchParams.get("streak") || "";
    const score = searchParams.get("score") || "";
    const image = searchParams.get("image") || "";

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "space-between",
            backgroundColor: "#1C1917",
            color: "#FDFBF7",
            padding: "50px 60px",
            fontFamily: "sans-serif",
            position: "relative",
          }}
        >
          {/* Subtle Background Accent */}
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              bottom: 0,
              width: "50%",
              background:
                "radial-gradient(circle at 80% 30%, rgba(220, 38, 38, 0.18), transparent 70%)",
              display: "flex",
            }}
          />

          {/* Header Bar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              zIndex: 10,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "50%",
                  backgroundColor: "#DC2626",
                  color: "#FFFFFF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "20px",
                  fontWeight: 800,
                }}
              >
                컷
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span
                  style={{
                    fontSize: "26px",
                    fontWeight: 800,
                    letterSpacing: "-0.02em",
                  }}
                >
                  Dramacut
                </span>
                <span
                  style={{
                    fontSize: "14px",
                    color: "rgba(253, 251, 247, 0.6)",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  Korean Culture Daily
                </span>
              </div>
            </div>

            <div
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.08)",
                padding: "8px 18px",
                borderRadius: "999px",
                fontSize: "15px",
                color: "rgba(253, 251, 247, 0.8)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span>{date}</span>
            </div>
          </div>

          {/* Center Main Content */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "40px",
              width: "100%",
              margin: "30px 0",
              zIndex: 10,
            }}
          >
            {image ? (
              <img
                src={image}
                alt=""
                style={{
                  width: "320px",
                  height: "200px",
                  objectFit: "cover",
                  borderRadius: "16px",
                  border: "2px solid rgba(255, 255, 255, 0.2)",
                  boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
                }}
              />
            ) : null}

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                flex: 1,
              }}
            >
              <h1
                style={{
                  fontSize: "44px",
                  fontWeight: 800,
                  lineHeight: 1.15,
                  margin: 0,
                  color: "#FFFFFF",
                  letterSpacing: "-0.02em",
                }}
              >
                {title}
              </h1>
              {drama ? (
                <p
                  style={{
                    fontSize: "24px",
                    color: "#DC2626",
                    margin: 0,
                    fontWeight: 700,
                  }}
                >
                  Featured: {drama}
                </p>
              ) : (
                <p
                  style={{
                    fontSize: "20px",
                    color: "rgba(253, 251, 247, 0.7)",
                    margin: 0,
                  }}
                >
                  Can you identify the K-drama from a single frame?
                </p>
              )}
            </div>
          </div>

          {/* Footer Bar / Badges */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              zIndex: 10,
              paddingTop: "20px",
              borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
              {streak ? (
                <div
                  style={{
                    backgroundColor: "rgba(220, 38, 38, 0.2)",
                    border: "1px solid rgba(220, 38, 38, 0.4)",
                    color: "#EF4444",
                    padding: "8px 16px",
                    borderRadius: "12px",
                    fontSize: "16px",
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  🔥 {streak} Day Streak
                </div>
              ) : null}

              {score ? (
                <div
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    color: "#FFFFFF",
                    padding: "8px 16px",
                    borderRadius: "12px",
                    fontSize: "16px",
                    fontWeight: 700,
                  }}
                >
                  Score: {score} pts
                </div>
              ) : null}
            </div>

            <span
              style={{
                fontSize: "16px",
                color: "rgba(253, 251, 247, 0.5)",
              }}
            >
              dramacut.com · Daily K-Culture Puzzle
            </span>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    return new Response(`Failed to generate OG image: ${e.message}`, {
      status: 500,
    });
  }
}
