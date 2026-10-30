import type { Metadata } from "next";
import { Lexend } from "next/font/google";
import AvaliacaoClient from "./AvaliacaoClient";

// /avaliacao = quiz de triagem no estilo "Ilustra Click": fundo sálvia claro,
// headline verde alinhada à esquerda com destaque em negrito, cenas vetoriais
// com o boneco da Click e CTA em pílula verde.
const lexend = Lexend({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Click Cannabis · Avaliação rápida",
  description:
    "Responda algumas perguntas rápidas e agende sua consulta online por R$50 com médico especialista, direto pelo WhatsApp.",
  openGraph: {
    title: "Click Cannabis · Avaliação rápida",
    description: "Responda algumas perguntas e agende sua consulta online pelo WhatsApp.",
    siteName: "Click Cannabis",
    locale: "pt_BR",
    type: "website",
  },
};

export const revalidate = false;

export default function AvaliacaoPage() {
  return (
    <div className={`avaliacao ${lexend.variable}`}>
      <style>{`
        .avaliacao {
          --green-900: #1C4423;
          --green-700: #285E31;
          --green-500: #3D8F4A;
          --green-100: #E1EDD8;
          --ink: #263A2D;
          --muted: #56645A;
          --line: #D5E0CF;
          min-height: 100svh;
          background: #EEF3E7;
        }
        .avaliacao .font-display {
          font-family: var(--font-display), var(--font-geist-sans), system-ui, sans-serif;
          letter-spacing: -0.02em;
        }
        .avaliacao .titulo { color: var(--green-700); font-weight: 400; }
        .avaliacao .titulo b { font-weight: 700; }
        .avaliacao .opcao {
          width: 100%;
          min-height: 56px;
          padding: 14px 18px;
          border-radius: 16px;
          border: 2px solid var(--line);
          background: #fff;
          color: var(--ink);
          font-size: 16px;
          font-weight: 500;
          text-align: left;
          gap: 12px;
          transition: border-color .15s, background-color .15s, transform .1s;
        }
        .avaliacao .opcao:hover { border-color: #9CC48F; }
        .avaliacao .opcao:active { transform: scale(.985); }
        .avaliacao .opcao[data-on="true"] { border-color: var(--green-500); background: #F4FAF0; }
        .avaliacao .opcao .check {
          display: flex; align-items: center; justify-content: center;
          width: 22px; height: 22px; flex-shrink: 0; border-radius: 7px;
          border: 2px solid var(--line);
        }
        .avaliacao .opcao[data-on="true"] .check { background: var(--green-500); border-color: var(--green-500); }
        .avaliacao .btn-cta {
          min-height: 56px;
          padding: 14px 24px;
          border-radius: 999px;
          background: #1F8A3B;
          color: #fff;
          font-family: var(--font-display), system-ui, sans-serif;
          font-size: 17px;
          font-weight: 600;
          box-shadow: 0 10px 24px -12px rgba(31,138,59,.7);
          transition: background-color .15s, transform .1s;
        }
        .avaliacao .btn-cta:hover:not(:disabled) { background: #1A7A33; }
        .avaliacao .btn-cta:active:not(:disabled) { transform: scale(.985); }
        .avaliacao button:focus-visible, .avaliacao a:focus-visible, .avaliacao input:focus-visible {
          outline: 3px solid #9CC48F; outline-offset: 3px;
        }
        .avaliacao .roleta-rotor { transform-origin: 210px 210px; will-change: transform; }
        .avaliacao .roleta-txt { font-family: var(--font-display), system-ui, sans-serif; font-size: 19px; font-weight: 700; }
        .avaliacao .roleta-ponteiro { transform-origin: 210px 12px; transition: transform .07s ease-out; }
        .avaliacao .roleta-ponteiro.nudge { transform: rotate(-12deg); }
      `}</style>
      <AvaliacaoClient />
    </div>
  );
}
