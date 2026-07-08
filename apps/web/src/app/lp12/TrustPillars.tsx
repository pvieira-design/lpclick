"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";

const EASE: [number, number, number, number] = [0.23, 1, 0.32, 1];

const PILLARS = [
  {
    title: "100% dentro da lei",
    desc: "Prescrição médica e importação regulamentada e acompanhada pela ANVISA, do início ao fim.",
  },
  {
    title: "Médico especialista, 24h",
    desc: "Consulta 100% online com médicos prescritores de plantão todos os dias, a qualquer hora.",
  },
  {
    title: "1º acompanhamento grátis",
    desc: "Depois da consulta, o primeiro retorno pra ajustar o seu tratamento não custa nada.",
  },
  {
    title: "Suporte humano de verdade",
    desc: "Nosso time acompanha você da receita à entrega — burocracia é problema nosso, não seu.",
  },
];

export default function TrustPillars() {
  const reduceMotion = useReducedMotion();

  const list: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: reduceMotion ? 0 : 0.09 } },
  };
  const item: Variants = {
    hidden: { opacity: 0, x: reduceMotion ? 0 : -18 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: EASE } },
  };

  return (
    <section className="py-14 sm:py-20" style={{ backgroundColor: "var(--green-50)" }}>
      <div className="mx-auto w-full max-w-3xl px-5">
        <motion.header
          className="mb-8 grid grid-cols-1 gap-3 sm:mb-12 sm:grid-cols-[1fr_auto] sm:items-start sm:gap-x-8 sm:gap-y-2"
          initial={{ opacity: 0, y: reduceMotion ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <span
            className="inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-medium sm:col-start-2 sm:row-start-1 sm:justify-self-end sm:text-sm"
            style={{ backgroundColor: "var(--green-100)", color: "var(--green-700)" }}
          >
            Compromissos
          </span>
          <h2 className="font-display text-[2rem] font-medium leading-[1.05] text-gray-900 sm:col-start-1 sm:row-span-2 sm:row-start-1 sm:text-[3rem]">
            O que garantimos a você
          </h2>
          <p className="text-xs text-gray-500 sm:col-start-2 sm:row-start-2 sm:text-right sm:text-sm">
            Nosso contrato de confiança.
          </p>
        </motion.header>

        <motion.ul
          className="flex flex-col divide-y rounded-[var(--radius-panel)] border bg-white"
          style={{ borderColor: "var(--line)", boxShadow: "var(--shadow-card)" }}
          variants={list}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {PILLARS.map(({ title, desc }) => (
            <motion.li
              key={title}
              variants={item}
              className="flex items-start gap-4 p-5 sm:p-6"
              style={{ borderColor: "var(--line)" }}
            >
              <span
                className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full"
                style={{ backgroundColor: "var(--green-500)" }}
                aria-hidden="true"
              >
                <svg width="14" height="14" viewBox="0 0 12 12" fill="none">
                  <path
                    d="M2.5 6l2.4 2.4L9.5 3.8"
                    stroke="white"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <div>
                <h3 className="font-display text-lg font-semibold leading-snug text-gray-900">
                  {title}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-gray-600">{desc}</p>
              </div>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
