import type { Metadata } from "next";
import { Lexend } from "next/font/google";
import LandingClient from "./LandingClient";
import AnnouncementBar from "./AnnouncementBar";
import ProofStrip from "./ProofStrip";
import Footer from "./Footer";
import StickyContactCTA from "./StickyContactCTA";
import TestimonialsWall from "./TestimonialsWall";

// /bem-estar = /objetivo sem menção a médico/cannabis (copy neutra de
// bem-estar, sem as seções de tratamento). Origem: /objetivo = evolução da /consulta: hero em 2 etapas (objetivo → nome),
// prova social aprovada antes do CTA e tipografia da marca (Lexend nos
// títulos, conforme o manual doc-click). Corpo continua Geist do root.
const lexend = Lexend({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Click · Bem-estar com acompanhamento de especialistas",
  description:
    "Primeiro atendimento por R$50, 100% online. Conte o que você quer melhorar e fale com um especialista ainda hoje.",
  openGraph: {
    title: "Click · Bem-estar com acompanhamento de especialistas",
    description:
      "Primeiro atendimento por R$50, 100% online. Fale com um especialista ainda hoje.",
    siteName: "Click",
    locale: "pt_BR",
    type: "website",
  },
};

export const revalidate = false;

export default function LandingPage() {
  return (
    <div className={`bem-estar ${lexend.variable}`}>
      <style>{`
        .bem-estar {
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
        .bem-estar .hero-atmosphere {
          background:
            radial-gradient(60% 45% at 50% -5%, rgba(61,143,74,.16), transparent 70%),
            radial-gradient(40% 30% at 90% 20%, rgba(229,242,231,.9), transparent 70%),
            #fff;
        }
        .bem-estar .font-display {
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
        .bem-estar .cta-pulse {
          position: relative;
          isolation: isolate;
        }
        .bem-estar .cta-pulse::after {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          z-index: -1;
          animation: ctaWave 1.6s cubic-bezier(0.25, 0.8, 0.4, 1) infinite;
          pointer-events: none;
        }
        @media (prefers-reduced-motion: reduce) {
          .bem-estar .cta-pulse::after { animation: none; }
        }
      `}</style>

      <main className="flex min-h-svh flex-col bg-white">
        <AnnouncementBar />
        <LandingClient />
        <ProofStrip />
        <div id="bem-estar-sticky-anchor" aria-hidden="true" />
        <TestimonialsWall />
      </main>
      <Footer />
      <StickyContactCTA />
    </div>
  );
}
