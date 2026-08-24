"use client";

// Etapas do tratamento (estrutura da lp5), em cards escuros com stagger.

import { motion, type Variants } from "framer-motion";

const EASE: [number, number, number, number] = [0.23, 1, 0.32, 1];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

const STEPS = [
  {
    chip: "Etapa 1",
    title: "Consulta médica",
    desc: "Faça sua consulta médica por apenas R$50, todo o processo é 100% online, com médicos de plantão todos os dias.",
  },
  {
    chip: "Etapa 2",
    title: "Receita médica",
    desc: "Se apto para o tratamento, o médico emitirá a receita necessária para que a autorização possa ser solicitada.",
  },
  {
    chip: "Etapa 3",
    title: "Autorização da ANVISA",
    desc: "Acompanhamos você em todas as etapas do processo de documentação necessário para a importação dos medicamentos prescritos.",
  },
  {
    chip: "Etapa 4",
    title: "Importação e entrega",
    desc: "Oferecemos suporte completo na importação direta dos EUA, com isenção de impostos e entrega em até 15 dias úteis.",
  },
];

export default function TreatmentSteps() {
  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-5">
        <motion.header
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto] sm:items-start sm:gap-x-8 sm:gap-y-2"
        >
          <motion.span
            variants={fadeUp}
            className="inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-medium text-[color:var(--green-ink)] sm:col-start-2 sm:row-start-1 sm:justify-self-end sm:text-sm"
            style={{ backgroundColor: "var(--accent-soft)" }}
          >
            Processos
          </motion.span>
          <motion.h2
            variants={fadeUp}
            className="font-display lp16-display-xl text-[2rem] leading-[1.02] sm:col-start-1 sm:row-span-2 sm:row-start-1 sm:text-[3rem]"
          >
            Tratamento descomplicado
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="text-xs text-[color:var(--muted)] sm:col-start-2 sm:row-start-2 sm:text-right sm:text-sm"
          >
            Entenda cada uma das nossas etapas.
          </motion.p>
        </motion.header>

        <motion.ol
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="grid gap-4 sm:grid-cols-2"
        >
          {STEPS.map((step, i) => (
            <motion.li
              key={step.chip}
              variants={fadeUp}
              className="rounded-3xl border p-6 sm:p-7"
              style={{ borderColor: "var(--line)", backgroundColor: "var(--panel)" }}
            >
              <div className="flex items-center justify-between">
                <span
                  className="inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[color:var(--green-ink)]"
                  style={{ backgroundColor: "var(--accent-soft)" }}
                >
                  {step.chip}
                </span>
                <span className="font-display text-[2rem] leading-none text-[color:var(--green-ink)]/60">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="mt-4 text-[18px] font-semibold">{step.title}</h3>
              <p className="mt-2 text-[14.5px] leading-relaxed text-[color:var(--muted)]">
                {step.desc}
              </p>
            </motion.li>
          ))}
        </motion.ol>
      </div>
    </section>
  );
}
