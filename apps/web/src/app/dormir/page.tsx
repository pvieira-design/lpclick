import type { Metadata } from "next";
import { Lexend } from "next/font/google";
import LandingClient from "./LandingClient";
import SleepScience from "./SleepScience";
import StickyContactCTA from "./StickyContactCTA";
import TreatmentSteps from "../lp12/TreatmentSteps";
import Faq from "../lp12/Faq";

const lexend = Lexend({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-dormir",
  display: "swap",
});

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: "Click · Um cuidado a mais com o seu sono",
  description: "Dê o primeiro passo para dormir melhor. Consulta médica online com especialista por R$50.",
  openGraph: {
    title: "Click · Um cuidado a mais com o seu sono",
    description: "Consulta médica online por R$50. Conheça os relatos de quem buscou cuidar do sono.",
    siteName: "Click Cannabis",
    locale: "pt_BR",
    type: "website",
  },
};

export default function DormirPage() {
  return (
    <div className={`dormir bg-white ${lexend.variable}`}>
      <style>{`
        .dormir {
          --green-900: #1C4423;
          --green-700: #285E31;
          --green-600: #35785D;
          --green-500: #3D8F4A;
          --green-100: #E5F2E7;
          --green-50: #F3F8F4;
          --ink: #263A2D;
          --muted: #657169;
          --line: #E0E9E2;
          --shadow-card: 0 2px 10px rgba(28,68,35,.035);
          --shadow-float: 0 6px 18px rgba(40,94,49,.12);
          --radius-card: 1rem;
          --radius-btn: 1rem;
        }
        .dormir .font-display {
          font-family: var(--font-dormir), var(--font-geist-sans), system-ui, sans-serif;
          letter-spacing: -.025em;
        }
        .dormir button { -webkit-tap-highlight-color: transparent; }
      `}</style>
      <main className="flex min-h-svh flex-col bg-white">
        <LandingClient />
        <SleepScience />
        <div id="dormir-treatment-steps">
          <TreatmentSteps startEvent="dormir:treatment:open" />
        </div>
        <Faq />
      </main>
      <footer className="border-t border-[var(--line)] bg-white px-5 pb-[calc(15rem+env(safe-area-inset-bottom))] pt-9 text-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.svg" alt="Click Cannabis" width={160} height={23} loading="lazy" className="mx-auto" />
        <p className="mx-auto mt-5 max-w-2xl text-xs leading-relaxed text-[var(--muted)]">
          A Click conecta você a especialistas e acompanha a sua jornada de cuidado com o sono, 100% online.
          Os relatos apresentados são experiências reais e não representam garantia de resultado.
          © Click. Todos os direitos reservados.
        </p>
      </footer>
      <StickyContactCTA />
    </div>
  );
}
