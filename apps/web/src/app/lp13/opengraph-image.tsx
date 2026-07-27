import { ImageResponse } from "next/og";

// Imagem de preview (Open Graph) da /lp13 — o cartão que WhatsApp, Instagram
// e afins mostram quando o link é compartilhado. Espelha a primeira dobra.
export const runtime = "edge";

export const alt =
  "Click Cannabis — consulta com médico especialista por R$50, 100% online";
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
          justifyContent: "space-between",
          padding: "72px 80px",
          backgroundColor: "#F5FAF6",
          backgroundImage:
            "radial-gradient(1200px 520px at 50% -10%, #E1F0E5 0%, rgba(225,240,229,0) 60%)",
        }}
      >
        {/* Marca */}
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <svg width="40" height="39" viewBox="0 0 125 122" fill="none">
            <path
              d="M55.2589 104.202C51.2783 108.202 51.2783 114.687 55.2589 118.687C59.2403 122.687 65.6947 122.687 69.6758 118.687C73.6566 114.687 73.6566 108.202 69.6758 104.202L62.4676 96.959L55.2589 104.202Z"
              fill="#285E31"
            />
            <path
              d="M54.6451 0H70.2967L70.297 64.1354L111.189 23.0315L122.256 34.152L85.9488 70.6496H124.942V86.3764H0V70.6496H38.993L2.68503 34.152L13.7525 23.0315L54.6451 64.1354V0Z"
              fill="#285E31"
            />
          </svg>
          <span style={{ fontSize: 30, fontWeight: 700, color: "#171B18", letterSpacing: "-0.02em" }}>
            Click Cannabis
          </span>
        </div>

        {/* Mensagem central */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 68, fontWeight: 700, color: "#12301A", letterSpacing: "-0.03em", lineHeight: 1.08 }}>
              Médicos Prescritores de
            </span>
            <span style={{ fontSize: 68, fontWeight: 700, color: "#2d6e3f", letterSpacing: "-0.03em", lineHeight: 1.08 }}>
              Cannabis Medicinal
            </span>
          </div>
          <span style={{ fontSize: 34, fontWeight: 400, color: "#5B6660", lineHeight: 1.3 }}>
            Consulta online com médico especialista por
            <span style={{ fontWeight: 700, color: "#171B18", marginLeft: 12 }}>R$50</span>
          </span>
        </div>

        {/* Prova social */}
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {["4,9 no Google", "+50 mil pacientes", "100% online"].map((t) => (
            <div
              key={t}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "12px 22px",
                borderRadius: 999,
                backgroundColor: "#FFFFFF",
                border: "1px solid #E5EAE6",
                fontSize: 24,
                fontWeight: 600,
                color: "#285E31",
              }}
            >
              {t}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size },
  );
}
