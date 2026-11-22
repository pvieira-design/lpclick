"use client";

import { useCallback, useEffect, useState, type ComponentType } from "react";
import { sendGTMEvent } from "@next/third-parties/google";
import type { Depoimento, GoalId } from "../avaliacao/testimonialSelection";

type FormProps = { depoimentos: Record<GoalId, Depoimento[]> };

// O formulário fica num chunk à parte, pré-carregado logo após o load inicial
// (em idle) para que tanto o fim da abertura quanto o "Pular" montem em 0ms,
// sem tela branca esperando rede.
let formPromise: Promise<ComponentType<FormProps>> | null = null;
let FormPronto: ComponentType<FormProps> | null = null;

function carregarForm() {
  if (!formPromise) {
    formPromise = import("./Lp18Form").then((mod) => {
      FormPronto = mod.default;
      return mod.default;
    });
  }
  return formPromise;
}

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
  const [Form, setForm] = useState<ComponentType<FormProps> | null>(null);

  const irProFunil = useCallback(() => {
    if (FormPronto) {
      setForm(() => FormPronto);
      return;
    }
    void carregarForm().then((Comp) => setForm(() => Comp));
  }, []);

  useEffect(() => {
    sendGTMEvent({ event: "quizStep", category: "Quiz", action: "View", label: "LP18 - abertura" });
    const pulou = (document.getElementById("lp18-skip") as HTMLInputElement | null)?.checked;
    if (pulou) pulouAbertura();
    if (pulou || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      irProFunil();
      return;
    }

    let cancelIdle: (() => void) | undefined;
    const agendarPreload = () => {
      const ric = window.requestIdleCallback;
      if (typeof ric === "function") {
        const id = ric(() => void carregarForm(), { timeout: 400 });
        cancelIdle = () => window.cancelIdleCallback(id);
      } else {
        const id = setTimeout(() => void carregarForm(), 120);
        cancelIdle = () => clearTimeout(id);
      }
    };

    if (document.readyState === "complete") {
      agendarPreload();
      return () => cancelIdle?.();
    }
    window.addEventListener("load", agendarPreload, { once: true });
    return () => {
      window.removeEventListener("load", agendarPreload);
      cancelIdle?.();
    };
  }, [irProFunil]);

  if (Form) {
    return (
      <div className={`avaliacao lp18-form ${fontClass}`}>
        <Form depoimentos={depoimentos} />
      </div>
    );
  }

  return (
    <main
      className={`lp18 ${fontClass}`}
      onPointerDown={(e) => {
        if ((e.target as HTMLElement).classList?.contains("lp18-skip")) void carregarForm();
      }}
      onAnimationEnd={(e) => {
        if ((e.target as HTMLElement).classList.contains("lp18-end")) irProFunil();
      }}
      onChange={(e) => {
        const alvo = e.target as HTMLInputElement;
        if (alvo.id === "lp18-skip" && alvo.checked) {
          void carregarForm();
          pulouAbertura();
        }
      }}
    >
      {children}
    </main>
  );
}
