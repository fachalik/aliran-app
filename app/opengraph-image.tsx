import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Aliran — Patungan subscription, tanpa drama";

export default function OgImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "flex-end",
        padding: "72px 80px",
        background: "#f5f1eb", // cream-100
        position: "relative",
      }}
    >
      {/* Background accent blob */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: 600,
          height: 400,
          borderRadius: "0 0 0 100%",
          background: "#1f3d2e",
          opacity: 0.08,
        }}
      />

      {/* Logo mark */}
      <div
        style={{
          position: "absolute",
          top: 64,
          left: 80,
          display: "flex",
          alignItems: "center",
          gap: 16,
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            background: "#1f3d2e",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#f9f6f0",
            fontSize: 28,
            fontWeight: 700,
            fontFamily: "sans-serif",
          }}
        >
          A
        </div>
        <span
          style={{
            fontSize: 28,
            fontWeight: 700,
            fontFamily: "sans-serif",
            color: "#1f3d2e",
            letterSpacing: "-0.5px",
          }}
        >
          Aliran
        </span>
      </div>

      {/* Headline */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        <p
          style={{
            fontSize: 72,
            fontWeight: 700,
            fontFamily: "sans-serif",
            color: "#1f3d2e",
            lineHeight: 1.1,
            letterSpacing: "-2px",
            margin: 0,
          }}
        >
          Patungan subscription,
          <br />
          tanpa drama.
        </p>
        <p
          style={{
            fontSize: 28,
            fontFamily: "sans-serif",
            color: "#7a7060",
            margin: 0,
            lineHeight: 1.4,
          }}
        >
          Lacak uangmu. Bot yang nagih temanmu. Otomatis.
        </p>
      </div>
    </div>,
    { ...size },
  );
}
