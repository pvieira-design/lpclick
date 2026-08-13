"use client";

import { motion, useReducedMotion } from "framer-motion";
import { openSchedule } from "./config";

export default function TreatmentCTA() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="pb-16 sm:pb-24">
      <div className="mx-auto w-full max-w-xl px-5">
        <motion.button
          type="button"
          onClick={() => openSchedule({ origem: "treatment-cta" })}
          whileTap={reduceMotion ? undefined : { scale: 0.98 }}
          className="w-full rounded-2xl py-4 text-base font-bold text-white transition-all duration-150 ease-out hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--green-500)] focus-visible:ring-offset-2 focus-visible:ring-offset-white sm:text-lg"
          style={{ backgroundColor: "var(--green-500)", boxShadow: "var(--shadow-float)" }}
        >
          Iniciar meu Tratamento
        </motion.button>
      </div>
    </section>
  );
}
