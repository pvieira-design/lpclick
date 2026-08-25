"use client";

import { motion, useReducedMotion } from "framer-motion";

// Prova social: SÓ claims aprovados pelo manual da marca (doc-click, jun/2026).
const PROOF = [
  { value: "+50 mil", label: "consultas realizadas" },
  { value: "92%", label: "aprovam o médico" },
  { value: "+2.000", label: "avaliações no Google" },
  { value: "R$50", label: "primeira consulta" },
] as const;

export default function ProofStrip() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      aria-label="Números da Click Cannabis"
      className="border-y"
      style={{ borderColor: "var(--line)", backgroundColor: "var(--green-50)" }}
    >
      <motion.ul
        className="mx-auto grid w-full max-w-xl grid-cols-2 gap-x-4 gap-y-5 px-5 py-6 sm:grid-cols-4 sm:gap-x-2 sm:py-7"
        initial={reduceMotion ? false : { opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      >
        {PROOF.map((p) => (
          <li key={p.label} className="text-center">
            <p
              className="font-display text-[1.6rem] font-semibold leading-none sm:text-[1.75rem]"
              style={{ color: "var(--green-700)", fontVariantNumeric: "tabular-nums" }}
            >
              {p.value}
            </p>
            <p className="mt-1.5 text-[12px] leading-tight sm:text-[13px]" style={{ color: "var(--muted)" }}>
              {p.label}
            </p>
          </li>
        ))}
      </motion.ul>
    </section>
  );
}
