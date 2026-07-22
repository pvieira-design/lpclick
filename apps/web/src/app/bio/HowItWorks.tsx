"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ATENDIMENTO, openSchedule } from "./config";

const EASE: [number, number, number, number] = [0.23, 1, 0.32, 1];

const PASSOS = [
  {
    titulo: "Você marca em 1 minuto",
    texto: `Diz o que quer tratar e o nosso time agenda o melhor horário para você, das ${ATENDIMENTO.rotuloInicio} às ${ATENDIMENTO.rotuloFim}.`,
  },
  {
    titulo: "Consulta online com médico especialista",
    texto: "Em média 10 minutos por vídeo, do seu celular. Sem fila, sem sala de espera.",
  },
  {
    titulo: "Receita e autorização da ANVISA",
    texto:
      "O médico emite a receita e a Click te guia no passo a passo da autorização, sem custo nenhum.",
  },
  {
    titulo: "Importação do medicamento",
    texto: "Importado dos Estados Unidos, sem imposto e chega na sua casa.",
  },
  {
    titulo: "Acompanhamento incluso",
    texto:
      "A primeira consulta de retorno é gratuita, 30 dias após a chegada do medicamento.",
  },
];

export default function HowItWorks() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.section
      className="mt-12"
      initial={{ opacity: 0, y: reduceMotion ? 0 : 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: EASE }}
    >
      <h2 className="font-display text-center text-[1.7rem] leading-tight text-[color:var(--green-900)]">
        Como funciona
      </h2>
      <p className="mt-2 text-center text-[14px] text-[color:var(--muted)]">
        Do primeiro contato ao tratamento, sem sair de casa.
      </p>

      {/* Preço em destaque */}
      <div
        className="mt-6 flex overflow-hidden rounded-[var(--radius-card)] border bg-white"
        style={{ borderColor: "var(--line)", boxShadow: "var(--shadow-card)" }}
      >
        <div className="flex flex-1 flex-col items-center px-3 py-5">
          <span className="font-display text-[1.9rem] leading-none text-[color:var(--green-700)]">
            R$50
          </span>
          <span className="mt-2 text-center text-[12px] leading-tight text-[color:var(--muted)]">
            consulta com
            <br />
            médico especialista
          </span>
        </div>
        <div
          className="flex flex-1 flex-col items-center px-3 py-5"
          style={{ borderLeft: "1px solid var(--line)" }}
        >
          <span className="font-display text-[1.9rem] leading-none text-[color:var(--green-700)]">
            Grátis
          </span>
          <span className="mt-2 text-center text-[12px] leading-tight text-[color:var(--muted)]">
            autorização
            <br />
            da ANVISA
          </span>
        </div>
      </div>

      {/* Timeline */}
      <ol className="relative mt-7 space-y-6 pl-11">
        <span
          aria-hidden="true"
          className="absolute left-[15px] top-2 h-[calc(100%-1.5rem)] w-px"
          style={{ backgroundColor: "var(--line)" }}
        />
        {PASSOS.map((p, i) => (
          <motion.li
            key={p.titulo}
            className="relative"
            initial={{ opacity: 0, x: reduceMotion ? 0 : -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.45, ease: EASE, delay: reduceMotion ? 0 : i * 0.06 }}
          >
            <span
              className="absolute -left-11 top-0 flex size-8 items-center justify-center rounded-full text-[13px] font-semibold text-white"
              style={{ backgroundColor: "var(--green-700)" }}
              aria-hidden="true"
            >
              {i + 1}
            </span>
            <h3 className="text-[15px] font-semibold leading-snug text-[color:var(--ink)]">
              {p.titulo}
            </h3>
            <p className="mt-1 text-[13.5px] leading-relaxed text-[color:var(--muted)]">
              {p.texto}
            </p>
          </motion.li>
        ))}
      </ol>

      <button
        type="button"
        onClick={() => openSchedule({ origem: "como-funciona" })}
        className="mt-7 w-full rounded-full border-[1.5px] bg-white py-3.5 text-[15px] font-semibold transition-colors hover:bg-[color:var(--green-50)]"
        style={{ borderColor: "var(--green-700)", color: "var(--green-700)" }}
      >
        Começar meu tratamento
      </button>
    </motion.section>
  );
}
