"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ATENDIMENTO, PATOLOGIAS, isAtendimentoAberto, openSchedule } from "./config";
import ScheduleDialog from "./ScheduleDialog";
import StickyCta from "./StickyCta";

const EASE: [number, number, number, number] = [0.23, 1, 0.32, 1];

const STATS = [
  { valor: "4,9", rotulo: "nota no Google", estrela: true },
  { valor: "+50 mil", rotulo: "pacientes atendidos", estrela: false },
];

// Etapas do tratamento — a Click acompanha todas, mas não executa todas.
const ETAPAS = ["Consulta", "Receita", "ANVISA", "Entrega", "Retorno"];

export default function BioClient() {
  const [aberto, setAberto] = useState<boolean | null>(null);
  const reduceMotion = useReducedMotion();

  // Estado do atendimento só no cliente — evita mismatch de hidratação.
  useEffect(() => {
    const update = () => setAberto(isAtendimentoAberto());
    update();
    const id = setInterval(update, 60_000);
    return () => clearInterval(id);
  }, []);

  // Deep link: /bio#agendar abre o popup direto (usado em stories e anúncios).
  useEffect(() => {
    if (window.location.hash !== "#agendar") return;
    const id = setTimeout(() => openSchedule({ origem: "deep-link" }), 350);
    return () => clearTimeout(id);
  }, []);

  const stagger: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: reduceMotion ? 0 : 0.06 } },
  };
  const item: Variants = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 14 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
  };

  return (
    <>
      <motion.header
        className="flex flex-col items-center text-center"
        variants={stagger}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={item}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.svg"
            alt="Click Cannabis"
            width={168}
            height={24}
            fetchPriority="high"
            decoding="async"
            className="h-6 w-auto"
          />
        </motion.div>

        <motion.h1
          variants={item}
          className="font-display mt-7 text-[1.75rem] leading-[1.08] text-[color:var(--green-900)] sm:text-[2.15rem]"
        >
          Médicos Prescritores de
          <br />
          <span className="text-[color:var(--green-600)]">Cannabis Medicinal</span>
        </motion.h1>

        <motion.p
          variants={item}
          className="mt-3.5 text-[14px] leading-relaxed text-[color:var(--muted)]"
        >
          {/* Cada frase em sua própria linha; a 14px a primeira cabe sem quebrar
              até ~360px de largura. Sem text-balance, que forçava duas linhas. */}
          <span className="block">
            Consulta online com médico especialista por{" "}
            <strong className="font-semibold text-[color:var(--ink)]">R$50</strong>.
          </span>
          <span className="mt-1 block">A Click está com você em cada etapa:</span>
        </motion.p>

        {/* Trilha das etapas do tratamento */}
        <motion.ol
          variants={stagger}
          aria-label="Etapas do tratamento"
          // A largura máxima no mobile força a quebra 3+2; sem ela o navegador
          // encaixa 4 chips e deixa "Retorno" órfão na segunda linha.
          className="mx-auto mt-3.5 flex max-w-[15.5rem] flex-wrap items-center justify-center gap-x-1 gap-y-1.5 sm:max-w-none"
        >
          {ETAPAS.map((etapa, i) => (
            <motion.li key={etapa} variants={item} className="flex items-center gap-1">
              <span
                className="whitespace-nowrap rounded-full border bg-white px-2 py-1.5 text-[11px] font-medium leading-none text-[color:var(--green-800)]"
                style={{ borderColor: "var(--line)", boxShadow: "0 1px 2px rgba(23,27,24,.04)" }}
              >
                {etapa}
              </span>
              {/* Chevron depois do chip: se a trilha quebrar, a linha termina com "›"
                  em vez de começar com ele. */}
              {i < ETAPAS.length - 1 && (
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 16 16"
                  fill="none"
                  className="shrink-0 text-[color:var(--muted)]"
                  aria-hidden="true"
                >
                  <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </motion.li>
          ))}
        </motion.ol>

        {/* Stats */}
        <motion.div
          variants={item}
          className="mt-5 flex w-full items-stretch justify-center rounded-[var(--radius-card)] border bg-white/70 backdrop-blur-sm"
          style={{ borderColor: "var(--line)", boxShadow: "var(--shadow-card)" }}
        >
          {STATS.map((s, i) => (
            <div
              key={s.rotulo}
              className="flex flex-1 flex-col items-center px-1.5 py-3.5"
              style={{ borderLeft: i > 0 ? "1px solid var(--line)" : undefined }}
            >
              <span className="flex items-center gap-1.5">
                <span className="font-display text-[1.35rem] leading-none text-[color:var(--green-700)]">
                  {s.valor}
                </span>
                {/* Estrelas na mesma cor das avaliações do Google logo abaixo. */}
                {s.estrela && (
                  <span className="flex gap-[1px]" role="img" aria-label="5 de 5 estrelas">
                    {Array.from({ length: 5 }).map((_, n) => (
                      <svg
                        key={n}
                        width="10"
                        height="10"
                        viewBox="0 0 20 20"
                        fill="#f5a623"
                        aria-hidden="true"
                        className="shrink-0"
                      >
                        <path d="M10 1.5l2.6 5.27 5.82.85-4.21 4.1.99 5.78L10 14.77l-5.2 2.73.99-5.78L1.58 7.62l5.82-.85L10 1.5z" />
                      </svg>
                    ))}
                  </span>
                )}
              </span>
              <span className="mt-1.5 text-[11.5px] leading-none text-[color:var(--muted)]">
                {s.rotulo}
              </span>
            </div>
          ))}
        </motion.div>

        {/* Status do atendimento — muda ao vivo conforme o horário de Brasília */}
        <motion.div
          variants={item}
          className="mt-4 inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5"
          style={{
            borderColor: aberto === false ? "#e7e2d6" : "#cfe3d3",
            backgroundColor: aberto === false ? "#FCF9F0" : "#fff",
          }}
          aria-live="polite"
        >
          <span
            className={`relative size-2 rounded-full ${aberto === false ? "" : "live-dot"}`}
            style={{ backgroundColor: aberto === false ? "#C99A2E" : "var(--green-500)" }}
            aria-hidden="true"
          />
          <span className="text-[12.5px] font-medium text-[color:var(--ink)]">
            {aberto === false
              ? `Fora do horário · atendemos das ${ATENDIMENTO.rotuloInicio} às ${ATENDIMENTO.rotuloFim}`
              : `Médicos atendendo agora · até ${ATENDIMENTO.rotuloFim}`}
          </span>
        </motion.div>

        {/* CTA principal */}
        <motion.button
          variants={item}
          type="button"
          onClick={() => openSchedule({ origem: "hero" })}
          whileHover={reduceMotion ? undefined : { y: -2 }}
          whileTap={reduceMotion ? undefined : { scale: 0.98 }}
          className="mt-6 w-full rounded-full px-6 text-[17px] font-semibold text-white"
          style={{
            backgroundColor: "var(--green-500)",
            boxShadow: "var(--shadow-float)",
            paddingTop: "1.05rem",
            paddingBottom: "1.05rem",
          }}
        >
          Agendar minha consulta
        </motion.button>

        <motion.p variants={item} className="mt-2.5 text-[12.5px] text-[color:var(--muted)]">
          100% online · em média 10 minutos · sem sair de casa
        </motion.p>
      </motion.header>

      {/* Atalho por sintoma — cada chip abre o popup já com a marcação feita */}
      <motion.section
        className="mt-9"
        initial={{ opacity: 0, y: reduceMotion ? 0 : 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.55, ease: EASE }}
      >
        <h2 className="text-center text-[12px] font-semibold uppercase tracking-[0.14em] text-[color:var(--muted)]">
          O que você quer tratar?
        </h2>
        <div className="mt-3.5 flex flex-wrap justify-center gap-2">
          {PATOLOGIAS.map((p) => (
            <motion.button
              key={p}
              type="button"
              onClick={() => openSchedule({ patologia: p, origem: `chip:${p}` })}
              whileHover={reduceMotion ? undefined : { y: -2 }}
              whileTap={reduceMotion ? undefined : { scale: 0.96 }}
              className="rounded-full border bg-white px-4 py-2.5 text-[13.5px] font-medium text-[color:var(--ink)] transition-colors hover:border-[color:var(--green-500)] hover:text-[color:var(--green-700)]"
              style={{ borderColor: "var(--line)", boxShadow: "0 1px 2px rgba(23,27,24,.04)" }}
            >
              {p}
            </motion.button>
          ))}
        </div>
      </motion.section>

      <div aria-hidden="true" className="h-px w-full" id="bio-hero-end" />

      <ScheduleDialog />
      <StickyCta />
    </>
  );
}
