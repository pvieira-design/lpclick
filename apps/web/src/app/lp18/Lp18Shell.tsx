"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { sendGTMEvent } from "@next/third-parties/google";
import type { Depoimento, GoalId } from "../avaliacao/testimonialSelection";

// O formulário (quiz da /avaliacao) fica num pedaço à parte do JavaScript: a
// abertura sobe leve e ele é baixado em segundo plano enquanto a animação roda.
const carregarForm = () => import("./Lp18Form");
const Lp18Form = dynamic(carregarForm, { ssr: false, loading: () => null });

const AnswerContext = createContext<(jaUsou: boolean) => void>(() => {});
export const useAnswer = () => useContext(AnswerContext);

// Tempo pro botão escolhido acender antes de a tela trocar.
const TROCA_MS = 260;

export default function Lp18Shell({
  fontClass,
  depoimentos,
  children,
}: {
  fontClass: string;
  depoimentos: Record<GoalId, Depoimento[]>;
  children: React.ReactNode;
}) {
  const [jaUsou, setJaUsou] = useState<boolean | null>(null);
  const [noForm, setNoForm] = useState(false);
  const respondeu = useRef(false);

  useEffect(() => {
    sendGTMEvent({ event: "quizStep", category: "Quiz", action: "View", label: "LP18 - abertura" });
    const t = setTimeout(carregarForm, 2500);
    return () => clearTimeout(t);
  }, []);

  const responder = useCallback((valor: boolean) => {
    if (respondeu.current) return;
    respondeu.current = true;
    setJaUsou(valor);
    sendGTMEvent({ event: "quizStep", category: "Quiz", action: "View", label: `LP18 - contato ${valor ? "sim" : "nao"}` });
    carregarForm();
    setTimeout(() => setNoForm(true), TROCA_MS);
  }, []);

  if (noForm && jaUsou !== null) {
    return (
      <div className={`avaliacao lp18-form ${fontClass}`}>
        <Lp18Form depoimentos={depoimentos} jaUsou={jaUsou} />
      </div>
    );
  }

  return (
    <AnswerContext.Provider value={responder}>
      <main className={`lp18 ${fontClass}`}>{children}</main>
    </AnswerContext.Provider>
  );
}
