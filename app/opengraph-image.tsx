import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "howfastismy.net — Free Internet Speed Test";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
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
          background: "linear-gradient(135deg, #0f0c29 0%, #1e1b4b 50%, #0f172a 100%)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ fontSize: 72, marginBottom: 16, display: "flex" }}>⚡</div>
        <div
          style={{
            fontSize: 52,
            fontWeight: 800,
            background: "linear-gradient(90deg, #a78bfa, #60a5fa)",
            backgroundClip: "text",
            color: "transparent",
            marginBottom: 16,
          }}
        >
          howfastismy.net
        </div>
        <div style={{ fontSize: 28, color: "#94a3b8", marginBottom: 40 }}>
          Free Internet Speed Test
        </div>
        <div
          style={{
            display: "flex",
            gap: 48,
            fontSize: 20,
            color: "#64748b",
          }}
        >
          <span>Download</span>
          <span>Upload</span>
          <span>Ping</span>
          <span>Jitter</span>
          <span>Health Score</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
