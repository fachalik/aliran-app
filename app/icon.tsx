import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#1f3d2e", // forest-900 approximate
        borderRadius: 8,
      }}
    >
      <span
        style={{
          color: "#f9f6f0", // cream-50 approximate
          fontSize: 20,
          fontWeight: 700,
          fontFamily: "sans-serif",
          letterSpacing: "-0.5px",
        }}
      >
        A
      </span>
    </div>,
    { ...size },
  );
}
