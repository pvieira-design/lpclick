"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";

const EASE: [number, number, number, number] = [0.23, 1, 0.32, 1];

const BENEFITS = [
  {
    title: "Noites de sono de verdade",
    desc: "Dormir a noite inteira sem depender de tarja preta.",
    Icon: IconMoon,
  },
  {
    title: "Mente mais leve",
    desc: "A ansiedade sob controle pra viver o dia com presença.",
    Icon: IconMind,
  },
  {
    title: "Corpo sem dor",
    desc: "A rotina de volta, sem a dor ditando o seu ritmo.",
    Icon: IconBody,
  },
  {
    title: "Natural e acompanhado",
    desc: "Prescrito por médico, com acompanhamento em cada ajuste.",
    Icon: IconLeaf,
  },
];

export default function Benefits() {
  const reduceMotion = useReducedMotion();

  const grid: Variants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: reduceMotion ? 0 : 0.08 },
    },
  };
  const item: Variants = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: EASE },
    },
  };

  return (
    <section className="bg-white py-14 sm:py-20">
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
            Benefícios
          </span>
          <h2 className="font-display text-[2rem] font-medium leading-[1.05] text-gray-900 sm:col-start-1 sm:row-span-2 sm:row-start-1 sm:text-[3rem]">
            O que muda na sua vida
          </h2>
          <p className="text-xs text-gray-500 sm:col-start-2 sm:row-start-2 sm:text-right sm:text-sm">
            O que os pacientes mais relatam.
          </p>
        </motion.header>

        <motion.div
          className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4"
          variants={grid}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {BENEFITS.map(({ title, desc, Icon }) => (
            <motion.div
              key={title}
              variants={item}
              whileHover={reduceMotion ? undefined : { y: -4 }}
              transition={{ type: "spring", stiffness: 380, damping: 26 }}
              className="flex items-start gap-4 rounded-[var(--radius-card)] border p-5"
              style={{
                borderColor: "var(--line)",
                backgroundColor: "var(--green-50)",
                boxShadow: "var(--shadow-card)",
              }}
            >
              <span
                className="flex size-11 shrink-0 items-center justify-center rounded-full"
                style={{ backgroundColor: "var(--green-100)", color: "var(--green-700)" }}
              >
                <Icon />
              </span>
              <div>
                <h3 className="font-display text-lg font-semibold leading-snug text-gray-900">
                  {title}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-gray-600">{desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function IconMoon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M20 14.5A8.5 8.5 0 019.5 4 8.5 8.5 0 1020 14.5z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconMind() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 3a7 7 0 017 7c0 2.4-1.2 4.4-3 5.7V19a2 2 0 01-2 2h-4a2 2 0 01-2-2v-1.5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path d="M8 14.5C6.2 13.2 5 11.3 5 10a7 7 0 017-7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M9.5 10.5c.5-1.5 2-2.5 2.5-1s2-1.5 2.5 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function IconBody() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="5" r="2.4" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M5 10.5c2.3-.8 4.6-1.2 7-1.2s4.7.4 7 1.2M12 9.5V15m0 0l-3 6m3-6l3 6"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconLeaf() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6 18C6 10 12 5 20 4c-1 8-6 14-14 14z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path d="M6 18c2-4 5-7 9-9M4 21l2-3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}
