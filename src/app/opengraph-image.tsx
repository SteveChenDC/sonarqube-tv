import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "SonarQube.tv — Video tutorials for code quality and security";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0a0a0a",
          backgroundImage:
            "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(41,0,66,0.5), transparent)",
        }}
      >
        {/* Play icon */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: "#D3121D",
            marginBottom: 32,
          }}
        >
          <div
            style={{
              width: 0,
              height: 0,
              borderTop: "18px solid transparent",
              borderBottom: "18px solid transparent",
              borderLeft: "30px solid #ffffff",
              marginLeft: 6,
            }}
          />
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            color: "#FFFFFF",
            letterSpacing: "-0.02em",
            marginBottom: 16,
          }}
        >
          SonarQube.tv
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 28,
            color: "#A8B3C2",
            textAlign: "center",
            maxWidth: 700,
          }}
        >
          Video tutorials, webinars & demos for code quality and security
        </div>

        {/* Bottom accent line */}
        <div
          style={{
            display: "flex",
            gap: 4,
            marginTop: 48,
          }}
        >
          <div
            style={{
              width: 60,
              height: 4,
              borderRadius: 2,
              backgroundColor: "#D3121D",
            }}
          />
          <div
            style={{
              width: 60,
              height: 4,
              borderRadius: 2,
              backgroundColor: "#126ED3",
            }}
          />
          <div
            style={{
              width: 60,
              height: 4,
              borderRadius: 2,
              backgroundColor: "#290042",
            }}
          />
        </div>
      </div>
    ),
    { ...size }
  );
}
