import type { Metadata } from "next";
import { Anton } from "next/font/google";
import Footer from "./Footer";
import ScheduleDialog from "./ScheduleDialog";
import StickyCta from "./StickyCta";
import TestimonialsWall from "./TestimonialsWall";
import TreatmentSteps from "./TreatmentSteps";
import VslHero from "./VslHero";

// Display condensada estilo cartaz esportivo, só desta rota — o corpo continua
// na Geist do root.
const anton = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Click Cannabis · A luta mais difícil não tem plateia",
  description:
    "Dor, sono ruim e ansiedade não precisam fazer parte do seu jogo. Assista e comece: consulta médica por R$50, 100% online, com receita e autorização ANVISA.",
  openGraph: {
    title: "Click Cannabis · A luta mais difícil não tem plateia",
    description:
      "Dor, sono ruim e ansiedade não precisam fazer parte do seu jogo. Assista e comece: consulta médica por R$50, 100% online, com receita e autorização ANVISA.",
    siteName: "Click Cannabis",
    locale: "pt_BR",
    type: "website",
  },
};

export default function LandingPage() {
  return (
    <div className={`lp15 ${anton.variable}`}>
      <style>{`
        .lp15 {
          --bg: #0B0D0B;
          --bg-2: #121512;
          --panel: #171B17;
          --ink: #F2F5F0;
          --muted: #9AA69C;
          --line: rgba(242,245,240,.09);
          --green-500: #3D8F4A;
          --green-400: #4CAF5E;
          --green-bright: #59D172;
          --green-glow: rgba(89,209,114,.16);
          --shadow-float: 0 12px 32px rgba(61,143,74,.35);
          color-scheme: dark;
        }
        .lp15 .font-display {
          font-family: var(--font-display), var(--font-geist-sans), system-ui, sans-serif;
          text-transform: uppercase;
          letter-spacing: 0.01em;
        }
        .lp15 ::selection {
          background: var(--green-500);
          color: #fff;
        }
      `}</style>

      <main className="flex min-h-svh flex-col bg-[color:var(--bg)] pb-[calc(7rem+env(safe-area-inset-bottom))] text-[color:var(--ink)]">
        <VslHero />
        <div className="relative">
          <div
            id="lp15-sticky-anchor"
            aria-hidden="true"
            className="pointer-events-none absolute left-0 top-[30svh] h-px w-px"
          />
          <TestimonialsWall />
        </div>
        <div id="lp15-treatment-steps">
          <TreatmentSteps />
        </div>
      </main>
      <Footer />
      <ScheduleDialog />
      <StickyCta />
    </div>
  );
}
