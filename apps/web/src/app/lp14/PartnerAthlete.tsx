"use client";

// Seção de autoridade: Pedro Machado, campeão de jiu-jitsu e atleta parceiro
// da Click. Fotos do ensaio oficial (public/lp14) — a luz de holofote delas é
// a mesma linguagem visual do resto da página.

import Image from "next/image";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { openSchedule } from "./config";

const EASE: [number, number, number, number] = [0.23, 1, 0.32, 1];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

export default function PartnerAthlete() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="mx-auto w-full max-w-3xl px-5 py-14 sm:py-20 lg:max-w-[62rem]">
      <div className="grid items-center gap-8 lg:grid-cols-[1fr_1.1fr] lg:gap-12">
        {/* Fotos */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          className="relative"
        >
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border" style={{ borderColor: "var(--line)" }}>
            <Image
              src="/lp14/pedro-medalhas.jpg"
              alt="Pedro Machado, de camiseta Click Cannabis, diante da mesa com suas medalhas de jiu-jitsu"
              fill
              sizes="(min-width: 1024px) 28rem, 100vw"
              className="object-cover"
            />
            <span
              className="absolute bottom-3 left-3 rounded-full px-3.5 py-1.5 text-[12px] font-semibold text-[color:var(--ink)] backdrop-blur"
              style={{ backgroundColor: "rgba(11,13,11,.72)" }}
            >
              Pedro Machado · Jiu-Jitsu
            </span>
          </div>
          {/* Segunda foto sobreposta, só em telas maiores. */}
          <div
            className="absolute -bottom-6 -right-4 hidden w-[38%] overflow-hidden rounded-2xl border shadow-2xl sm:block"
            style={{ borderColor: "var(--line)", rotate: "3deg" }}
          >
            <Image
              src="/lp14/pedro-oleo.jpg"
              alt="Pedro Machado, com as medalhas no pescoço, tomando o óleo sublingual"
              width={532}
              height={800}
              className="h-auto w-full"
            />
          </div>
        </motion.div>

        {/* Texto */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.p
            variants={fadeUp}
            className="text-[12px] font-semibold uppercase tracking-[0.22em] text-[color:var(--green-bright)]"
          >
            Atleta parceiro da Click
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="font-display mt-4 text-[1.7rem] leading-[1.06] sm:text-[2.8rem]"
          >
            Campeão mundial de <span className="whitespace-nowrap">jiu-jitsu</span>.{" "}
            <span className="text-[color:var(--green-bright)]">Paciente Click.</span>
          </motion.h2>

          {/* Fala do próprio Pedro, transcrita dos vídeos oficiais da parceria. */}
          <motion.blockquote
            variants={fadeUp}
            className="mt-5 border-l-2 pl-4 text-[1.15rem] leading-snug text-[color:var(--ink)] sm:text-[1.3rem]"
            style={{ borderColor: "var(--green-500)" }}
          >
            "A luta mais difícil não tem plateia. Ela acontece aqui dentro."
          </motion.blockquote>

          <motion.p
            variants={fadeUp}
            className="mt-4 text-[15.5px] leading-[1.55] text-[color:var(--muted)]"
          >
            Todo mundo vê as lutas no tatame. Ninguém vê o que acontece entre
            elas: o sono ruim, a ansiedade antes de competir, a lesão que pede
            recuperação. É essa luta que o Pedro trata com acompanhamento
            médico. Na experiência que ele mesmo conta, a diferença apareceu na
            calma, no sono e na ansiedade, além da recuperação da lesão que
            sofreu em 2022. Como ele resume: "mente e corpo é um só".
          </motion.p>
          <motion.p
            variants={fadeUp}
            className="mt-3 text-[15.5px] leading-[1.55] text-[color:var(--muted)]"
          >
            O tratamento dele começou como o de qualquer paciente da Click:
            consulta com médico prescritor, receita e autorização da ANVISA. O
            mesmo caminho está a um clique de você.
          </motion.p>
          <motion.div variants={fadeUp} className="mt-7">
            <motion.button
              type="button"
              onClick={() => openSchedule({ origem: "pedro" })}
              whileTap={reduceMotion ? undefined : { scale: 0.98 }}
              className="w-full rounded-2xl px-8 py-4 text-base font-bold text-white transition-all duration-150 ease-out hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--green-500)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0D0B] sm:w-auto"
              style={{ backgroundColor: "var(--green-500)", boxShadow: "var(--shadow-float)" }}
            >
              Iniciar meu Tratamento
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
