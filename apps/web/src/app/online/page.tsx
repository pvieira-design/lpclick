import type { Metadata } from "next";
import { Lexend } from "next/font/google";
import LandingExperience from "./LandingExperience";
import Footer from "./Footer";
import TreatmentSteps from "./TreatmentSteps";
import Faq from "./Faq";
import StickyContactCTA from "./StickyContactCTA";
import { GOAL_TESTIMONIALS } from "./testimonialSelection";

// Réplica independente de clickconsulta.com/primeiro-passo para edição local.
// Depoimentos exclusivamente da base aprovada; ver docs/depoimentos-aprovados.md.
const lexend = Lexend({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: "Click Consulta · Bem-estar com acompanhamento de especialistas",
  description:
    "Primeiro atendimento por R$50, 100% online. Conte o que você quer melhorar e fale com um especialista ainda hoje.",
  openGraph: {
    title: "Click Consulta · Bem-estar com acompanhamento de especialistas",
    description:
      "Primeiro atendimento por R$50, 100% online. Fale com um especialista ainda hoje.",
    siteName: "Click",
    locale: "pt_BR",
    type: "website",
  },
};

export default function LandingPage() {
  return (
    <div className={`primeiro-passo ${lexend.variable}`}>
      <style>{`
        .primeiro-passo {
          --green-900: #18382C;
          --green-700: #216244;
          --green-600: #2d6e3f;
          --green-500: #35785D;
          --green-100: #E5F2E7;
          --green-50: #F5FAF6;
          --ink: #18382C;
          --muted: #5B6660;
          --line: #E5EAE6;
          --shadow-card: 0 1px 2px rgba(23,27,24,.05), 0 8px 24px rgba(23,27,24,.06);
          --shadow-float: 0 12px 32px rgba(40,94,49,.22);
          --radius-card: 1rem;
          --radius-panel: 1.5rem;
          --radius-btn: .875rem;
        }
        .primeiro-passo .hero-atmosphere {
          background: #fff;
        }
        .primeiro-passo .font-display {
          font-family: var(--font-display), var(--font-geist-sans), system-ui, sans-serif;
          letter-spacing: -0.02em;
        }
        @keyframes ctaWave {
          0% {
            box-shadow: 0 0 0 0 rgba(61,143,74,0.55);
          }
          100% {
            box-shadow: 0 0 0 18px rgba(61,143,74,0);
          }
        }
        .primeiro-passo .cta-pulse {
          position: relative;
          isolation: isolate;
        }
        .primeiro-passo .cta-pulse::after {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          z-index: -1;
          animation: ctaWave 1.6s cubic-bezier(0.25, 0.8, 0.4, 1) infinite;
          pointer-events: none;
        }
        @media (prefers-reduced-motion: reduce) {
          .primeiro-passo .cta-pulse::after { animation: none; }
        }
      `}</style>

      <main className="flex min-h-svh flex-col bg-white">
        <LandingExperience reviewsByGoal={GOAL_TESTIMONIALS} />
        <TreatmentSteps />
        <Faq />
      </main>
      <Footer />
      <StickyContactCTA />
    </div>
  );
}
