"use client";

import { motion, useReducedMotion } from "framer-motion";

export default function Footer() {
  const reduceMotion = useReducedMotion();

  return (
    <footer
      className="px-5 pb-[calc(10rem+env(safe-area-inset-bottom))] pt-12 text-center"
      style={{ backgroundColor: "var(--green-900)" }}
    >
      <motion.div
        className="mx-auto flex w-full max-w-3xl flex-col items-center gap-6"
        initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo.svg"
          alt="Click Cannabis"
          width={160}
          height={23}
          loading="lazy"
          decoding="async"
          className="brightness-0 invert opacity-90"
        />
        <p className="max-w-[70ch] text-xs leading-relaxed text-white/50">
          A Click Cannabis conecta pacientes a médicos prescritores e dá
          suporte ao processo de importação regulamentado pela ANVISA. O
          tratamento com cannabis medicinal depende de avaliação e prescrição
          médica individual. Os relatos apresentados são experiências reais de
          pacientes e não representam garantia de resultado. © Click Cannabis.
          Todos os direitos reservados.
        </p>
      </motion.div>
    </footer>
  );
}
