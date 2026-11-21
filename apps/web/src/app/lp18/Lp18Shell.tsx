"use client";

import { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { sendGTMEvent } from "@next/third-parties/google";
import type { Depoimento, GoalId } from "../avaliacao/testimonialSelection";

// O formulário (quiz da /avaliacao) fica num pedaço à parte do JavaScript: a
// abertura sobe leve e ele é baixado em segundo plano enquanto a animação roda.
const carregarForm = () => import("./Lp18Form");
const Lp18Form = dynamic(carregarForm, { ssr: false, loading: () => null });

// A abertura termina com um círculo branco tomando a tela (.lp18-end). Quando
// ele acaba de abrir, a abertura dá lugar ao funil, que nasce no mesmo branco.
// Quem aperta "Pular" gera um quizStep à parte, pra separar quem viu a abertura
// inteira de quem pulou.
const pulouAbertura = () =>
  sendGTMEvent({ event: "quizStep", category: "Quiz", action: "View", label: "LP18 - pulou abertura" });

export default function Lp18Shell({
  fontClass,
  depoimentos,
  children,
}: {
  fontClass: string;
  depoimentos: Record<GoalId, Depoimento[]>;
  children: React.ReactNode;
}) {
  const [noForm, setNoForm] = useState(false);
  const irProFunil = useCallback(() => {
    carregarForm();
    setNoForm(true);
  }, []);

  useEffect(() => {
    sendGTMEvent({ event: "quizStep", category: "Quiz", action: "View", label: "LP18 - abertura" });
    // Sem movimento a abertura não roda; e o "Pular" pode ter sido marcado antes
    // da hidratação, quando o fim da animação ainda não era ouvido.
    const pulou = (document.getElementById("lp18-skip") as HTMLInputElement | null)?.checked;
    if (pulou) pulouAbertura();
    if (pulou || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      irProFunil();
      return;
    }
    const t = setTimeout(carregarForm, 2500);
    return () => clearTimeout(t);
  }, [irProFunil]);

  if (noForm) {
    return (
      <div className={`avaliacao lp18-form ${fontClass}`}>
        <Lp18Form depoimentos={depoimentos} />
      </div>
    );
  }

  return (
    <main
      className={`lp18 ${fontClass}`}
      onAnimationEnd={(e) => {
        if ((e.target as HTMLElement).classList.contains("lp18-end")) irProFunil();
      }}
      onChange={(e) => {
        const alvo = e.target as HTMLInputElement;
        if (alvo.id === "lp18-skip" && alvo.checked) pulouAbertura();
      }}
    >
      {children}
    </main>
  );
}
