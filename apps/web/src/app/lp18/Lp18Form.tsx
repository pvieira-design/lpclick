"use client";

import AvaliacaoClient from "../avaliacao/AvaliacaoClient";
import type { Depoimento, GoalId } from "../avaliacao/testimonialSelection";

// Passos do formulário da /lp18: o mesmo quiz da /avaliacao, até o envio no
// WhatsApp, em fundo branco. O passo do contato com CBD não aparece de novo,
// porque a pessoa já respondeu na abertura.
// Os estilos são os da /avaliacao (page.tsx de lá), só com o fundo trocado.
const CSS = `
        .avaliacao {
          --green-900: #1C4423;
          --green-700: #285E31;
          --green-500: #3D8F4A;
          --green-100: #E1EDD8;
          --ink: #263A2D;
          --muted: #56645A;
          --line: #D5E0CF;
          min-height: 100svh;
          background: #fff;
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
        .avaliacao .roleta-fatia { transition: opacity .5s ease; }
        .avaliacao .roleta-luz { fill: #F4F1E6; opacity: .45; }
        .avaliacao .girando .roleta-luz { animation: roleta-pisca .36s steps(1) infinite; }
        .avaliacao .girando .roleta-luz.impar { animation-delay: .18s; }
        .avaliacao .ganhou .roleta-luz { fill: #F2C94C; opacity: 1; animation: roleta-pisca .5s steps(1) 4; }
        @keyframes roleta-pisca { 0% { opacity: 1; fill: #F2C94C; } 50% { opacity: .45; fill: #F4F1E6; } }
        @media (prefers-reduced-motion: reduce) { .avaliacao .roleta-luz { animation: none !important; } }
              /* Só na /lp18: entra por cima do verde da abertura. */
        .lp18-form { animation: lp18-form-in 280ms cubic-bezier(0.23, 1, 0.32, 1); }
        @keyframes lp18-form-in { from { opacity: 0; } }
        @media (prefers-reduced-motion: reduce) { .lp18-form { animation: none; } }
`;

export default function Lp18Form({
  depoimentos,
  jaUsou,
}: {
  depoimentos: Record<GoalId, Depoimento[]>;
  jaUsou: boolean;
}) {
  return (
    <>
      <style>{CSS}</style>
      <AvaliacaoClient depoimentos={depoimentos} origem="LP18" jaUsouInicial={jaUsou} />
    </>
  );
}
