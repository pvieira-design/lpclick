import type { Metadata } from "next";
import Footer from "./Footer";
import ScheduleDialog from "./ScheduleDialog";
import VslPlayer from "./VslPlayer";

export const metadata: Metadata = {
  title: "Click Cannabis · Assista e comece seu tratamento",
  description:
    "Em pouco mais de um minuto você entende como funciona o tratamento com cannabis medicinal: consulta por R$50, 100% online, com receita e autorização ANVISA.",
  openGraph: {
    title: "Click Cannabis · Assista e comece seu tratamento",
    description:
      "Em pouco mais de um minuto você entende como funciona o tratamento com cannabis medicinal: consulta por R$50, 100% online, com receita e autorização ANVISA.",
    siteName: "Click Cannabis",
    locale: "pt_BR",
    type: "website",
  },
};

export default function LandingPage() {
  return (
    <div className="lp17">
      <style>{`
        .lp17 {
          /* Mesma paleta clara da lp5: fundo branco, verde escuro no texto e o
             verde de ação nos botões. */
          --bg: #FFFFFF;
          --bg-soft: #F5FAF6;
          --panel: #FFFFFF;
          --ink: #111827;
          --muted: #6B7280;
          --line: #E5E7EB;
          --green-500: #3D8F4A;
          --green-600: #285E31;
          --green-tint: #F0F7F1;
          --shadow-float: 0 10px 26px rgba(40,94,49,.22);
          color-scheme: light;
        }
        .lp17 ::selection {
          background: var(--green-500);
          color: #fff;
        }
        @keyframes lp17FadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        /* Entrada em CSS puro: o tráfego vem de navegador in-app, onde esperar
           a hidratação para revelar a dobra custa caro. */
        .lp17-fade {
          opacity: 0;
          animation: lp17FadeUp 600ms cubic-bezier(0.23, 1, 0.32, 1) forwards;
        }
        @media (prefers-reduced-motion: reduce) {
          .lp17-fade { animation: none; opacity: 1; }
        }
      `}</style>

      <main className="relative flex min-h-svh flex-col overflow-hidden bg-[color:var(--bg)] text-[color:var(--ink)]">
        {/* Lavada verde discreta atrás do filme — só o suficiente para o branco
            não ficar chapado. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 65% at 50% 100%, var(--bg-soft) 0%, rgba(255,255,255,0) 60%), radial-gradient(90% 50% at 50% -10%, #F0F7F1 0%, rgba(255,255,255,0) 65%)",
          }}
        />

        {/* Bloco único centralizado na altura: sem outras seções, o que sobra de
            viewport vira respiro em volta do filme, não um vazio embaixo. */}
        <div className="relative z-10 mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center px-5 pb-10 pt-6 sm:pt-9">
          {/* Sem headline: o filme fala por si. O h1 fica só para leitores de
              tela e para a página não nascer sem título. */}
          <h1 className="sr-only">
            Click Cannabis — tratamento com cannabis medicinal, 100% online
          </h1>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.svg"
            alt="Click Cannabis"
            width={200}
            height={29}
            fetchPriority="high"
            decoding="async"
            className="lp17-fade mb-6 h-[27px] w-auto lg:h-[29px]"
          />

          <VslPlayer />
        </div>
      </main>

      <Footer />
      <ScheduleDialog />
    </div>
  );
}
