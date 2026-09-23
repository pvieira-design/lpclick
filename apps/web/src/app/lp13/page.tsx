import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import LandingClient from "./LandingClient";
import GoogleReviews from "./GoogleReviews";
import HowItWorks from "./HowItWorks";
import LinkList from "./LinkList";
import Footer from "./Footer";

// Display só nos títulos desta rota — o corpo continua Geist do root.
const display = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Click Cannabis · Agende sua consulta de cannabis medicinal",
  description:
    "Consulta online com médico especialista por R$50. Receita e autorização ANVISA sem burocracia. Agende em menos de 1 minuto.",
  openGraph: {
    title: "Médicos Prescritores de Cannabis Medicinal · Click Cannabis",
    description:
      "Consulta online com médico especialista por R$50. Agende em menos de 1 minuto, 100% online.",
    siteName: "Click Cannabis",
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Médicos Prescritores de Cannabis Medicinal · Click Cannabis",
    description:
      "Consulta online com médico especialista por R$50. Agende em menos de 1 minuto, 100% online.",
  },
};

export const revalidate = false;

export default function LandingPage() {
  return (
    <div className={`lp13 ${display.variable}`}>
      <style>{`
        .lp13 {
          --green-900: #12301A;
          --green-800: #1C4423;
          --green-700: #285E31;
          --green-600: #2d6e3f;
          --green-500: #3D8F4A;
          --green-100: #E5F2E7;
          --green-50: #F5FAF6;
          --ink: #171B18;
          --muted: #5B6660;
          --line: #E5EAE6;
          --sand: #FBFAF7;
          --shadow-card: 0 1px 2px rgba(23,27,24,.04), 0 10px 30px rgba(23,27,24,.06);
          --shadow-float: 0 14px 34px rgba(40,94,49,.24);
          --radius-card: 1.25rem;
          --radius-btn: 999px;
        }
        .lp13 .font-display {
          font-family: var(--font-display), var(--font-geist-sans), system-ui, sans-serif;
          font-weight: 600;
          letter-spacing: -0.025em;
        }
        /* Sem o contorno azul do sistema ao voltar de outra aba (ex.: WhatsApp).
           Foco por teclado ganha um anel verde discreto da marca. */
        .lp13 button:focus,
        .lp13 a:focus,
        .lp13 [role="checkbox"]:focus {
          outline: none;
        }
        .lp13 button:focus-visible,
        .lp13 a:focus-visible,
        .lp13 [role="checkbox"]:focus-visible {
          outline: 2px solid var(--green-500);
          outline-offset: 2px;
        }
        .lp13 dialog {
          position: fixed;
          margin: 0;
        }
        .lp13 dialog::backdrop {
          background: rgba(18, 48, 26, 0.55);
          backdrop-filter: blur(3px);
        }
        @keyframes lp13Live {
          0% { box-shadow: 0 0 0 0 rgba(61,143,74,.5); }
          100% { box-shadow: 0 0 0 10px rgba(61,143,74,0); }
        }
        .lp13 .live-dot::after {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 999px;
          animation: lp13Live 1.8s cubic-bezier(.25,.8,.4,1) infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .lp13 .live-dot::after { animation: none; }
        }
      `}</style>

      <main
        className="min-h-svh"
        style={{
          background:
            "radial-gradient(120% 60% at 50% 0%, #EAF4EC 0%, var(--sand) 46%, var(--sand) 100%)",
        }}
      >
        <div className="mx-auto w-full max-w-[30rem] px-5 pb-[calc(7.5rem+env(safe-area-inset-bottom))] pt-8">
          <LandingClient />
          <HowItWorks />
          <GoogleReviews />
          <LinkList />
          <Footer />
        </div>
      </main>
    </div>
  );
}
