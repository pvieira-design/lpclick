import type { Metadata } from "next";
import { Instrument_Serif } from "next/font/google";
import ConsumptionForms from "./ConsumptionForms";
import Footer from "./Footer";
import LandingClient from "./LandingClient";
import ScheduleDialog from "./ScheduleDialog";
import SleepScience from "./SleepScience";
import StickyCta from "./StickyCta";
import TestimonialsWall from "./TestimonialsWall";
import TreatmentCTA from "./TreatmentCTA";
import TreatmentSteps from "./TreatmentSteps";

// Serifada editorial só desta rota, nos títulos — o tom é calmo, não o cartaz
// condensado da lp14. O corpo continua na Geist do root.
const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Click Cannabis · Tratamento para Insônia",
  description:
    "Dificuldade para dormir, despertares de madrugada e mente acelerada têm tratamento. Consulta médica por R$50, 100% online, com receita e autorização ANVISA.",
  openGraph: {
    title: "Click Cannabis · Tratamento para Insônia",
    description:
      "Dificuldade para dormir, despertares de madrugada e mente acelerada têm tratamento. Consulta médica por R$50, 100% online, com receita e autorização ANVISA.",
    siteName: "Click Cannabis",
    locale: "pt_BR",
    type: "website",
  },
};

export default function LandingPage() {
  return (
    <div className={`lp16 ${instrumentSerif.variable}`}>
      <style>{`
        /* Mesma paleta clara da lp5: branco, cinzas do Tailwind e os dois
           verdes da marca. --green-ink é o verde escuro dos textos de
           destaque; --green-500 é o do botão. */
        .lp16 {
          --bg: #ffffff;
          --bg-2: #f7f9f8;
          --panel: #ffffff;
          --ink: #111827;
          --muted: #6b7280;
          --line: #e5e7eb;
          --accent: #2d6e3f;
          --accent-soft: #e6f2e9;
          --green-500: #3D8F4A;
          --green-ink: #285E31;
          --green-soft: #f0f7f1;
          --green-border: #3a7a4f;
          --shadow-float: 0 10px 26px rgba(61,143,74,.28);
          color-scheme: light;
        }
        /* Tracking não é um valor só para todos os tamanhos: título grande pede
           letras mais juntas, texto pequeno pede um respiro. Cada display abaixo
           traz o seu; aqui fica só o mínimo comum. */
        .lp16 .font-display {
          font-family: var(--font-display), Georgia, serif;
          font-optical-sizing: auto;
        }
        .lp16 .lp16-display-xl { letter-spacing: -0.022em; }
        .lp16 .lp16-display-lg { letter-spacing: -0.018em; }
        .lp16 .lp16-display-sm { letter-spacing: -0.012em; }
        /* Maiúsculas pequenas (chips, eyebrows) precisam do movimento oposto. */
        .lp16 .lp16-eyebrow { letter-spacing: 0.14em; }
        .lp16 ::selection {
          background: var(--green-500);
          color: #fff;
        }
      `}</style>

      <main className="flex min-h-svh flex-col bg-[color:var(--bg)] pb-[calc(7rem+env(safe-area-inset-bottom))] text-[color:var(--ink)]">
        <LandingClient />
        <div className="relative">
          <div
            id="lp16-sticky-anchor"
            aria-hidden="true"
            className="pointer-events-none absolute left-0 top-[40svh] h-px w-px"
          />
          <TestimonialsWall />
        </div>
        <SleepScience />
        <ConsumptionForms />
        <TreatmentCTA />
        <div id="lp16-treatment-steps">
          <TreatmentSteps />
        </div>
      </main>
      <Footer />
      <ScheduleDialog />
      <StickyCta />
    </div>
  );
}
