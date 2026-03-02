import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Click Cannabis — Médicos Prescritores de Cannabis Medicinal";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
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
          backgroundColor: "#3D8F4A",
          gap: 40,
        }}
      >
        {/* Brand mark */}
        <svg
          width="220"
          height="215"
          viewBox="0 0 125 122"
          fill="none"
        >
          <path
            d="M55.2589 104.202C51.2783 108.202 51.2783 114.687 55.2589 118.687C59.2403 122.687 65.6947 122.687 69.6758 118.687C73.6566 114.687 73.6566 108.202 69.6758 104.202L62.4676 96.959L55.2589 104.202Z"
            fill="white"
          />
          <path
            d="M54.6451 0H70.2967L70.297 64.1354L111.189 23.0315L122.256 34.152L85.9488 70.6496H124.942V86.3764H0V70.6496H38.993L2.68503 34.152L13.7525 23.0315L54.6451 64.1354V0Z"
            fill="white"
          />
        </svg>

        {/* Text */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 12,
          }}
        >
          <span
            style={{
              fontSize: 52,
              fontWeight: 700,
              color: "white",
              letterSpacing: "-0.02em",
            }}
          >
            Click Cannabis
          </span>
          <span
            style={{
              fontSize: 26,
              fontWeight: 400,
              color: "rgba(255,255,255,0.85)",
            }}
          >
            Médicos Prescritores de Cannabis Medicinal
          </span>
        </div>
      </div>
    ),
    { ...size },
  );
}
