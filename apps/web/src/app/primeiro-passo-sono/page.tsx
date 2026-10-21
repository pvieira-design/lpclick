import type { Metadata } from "next";
import { Lexend } from "next/font/google";
import LandingClient from "./LandingClient";
import Footer from "./Footer";
import StickyContactCTA from "./StickyContactCTA";
import TestimonialsWall from "./TestimonialsWall";
import SleepScience from "./SleepScience";

// Réplica de /primeiro-passo com foco em dormir melhor.
// Depoimentos exclusivamente da base aprovada; ver docs/depoimentos-aprovados.md.
const lexend = Lexend({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: "Click · Dormir melhor com acompanhamento de especialistas",
  description:
    "Dê o primeiro passo para cuidar do seu sono. Consulta médica por R$50, 100% online, com acompanhamento de especialistas.",
  openGraph: {
    title: "Click · Dormir melhor com acompanhamento de especialistas",
    description:
      "Cuide do seu sono com acompanhamento de especialistas. Consulta médica por R$50, 100% online.",
    siteName: "Click",
    locale: "pt_BR",
    type: "website",
  },
};

export default function LandingPage() {
  return (
    <div className={`primeiro-passo-sono ${lexend.variable}`}>
      <style>{`
        .primeiro-passo-sono {
          --green-900: #1C4423;
          --green-700: #285E31;
          --green-600: #2d6e3f;
          --green-500: #3D8F4A;
          --green-100: #E5F2E7;
          --green-50: #F5FAF6;
          --ink: #263A2D;
          --muted: #5B6660;
          --line: #E5EAE6;
          --shadow-card: 0 1px 2px rgba(23,27,24,.05), 0 8px 24px rgba(23,27,24,.06);
          --shadow-float: 0 12px 32px rgba(40,94,49,.22);
          --radius-card: 1rem;
          --radius-panel: 1.5rem;
          --radius-btn: .875rem;
        }
        .primeiro-passo-sono .hero-atmosphere {
          background:
            radial-gradient(60% 45% at 50% -5%, rgba(61,143,74,.16), transparent 70%),
            radial-gradient(40% 30% at 90% 20%, rgba(229,242,231,.9), transparent 70%),
            #fff;
        }
        .primeiro-passo-sono .font-display {
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
        .primeiro-passo-sono .cta-pulse {
          position: relative;
          isolation: isolate;
        }
        .primeiro-passo-sono .cta-pulse::after {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          z-index: -1;
          animation: ctaWave 1.6s cubic-bezier(0.25, 0.8, 0.4, 1) infinite;
          pointer-events: none;
        }
        @media (prefers-reduced-motion: reduce) {
          .primeiro-passo-sono .cta-pulse::after { animation: none; }
        }
      `}</style>

      <main className="flex min-h-svh flex-col bg-white">
        <LandingClient />
        <TestimonialsWall />
        <SleepScience />
      </main>
      <Footer />
      <StickyContactCTA />
    </div>
  );
}
