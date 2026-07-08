"use client";

import { motion, useReducedMotion } from "framer-motion";

export default function TreatmentCTA() {
  const reduceMotion = useReducedMotion();

  const handleClick = () => {
    window.dispatchEvent(new CustomEvent("treatment:open"));
  };

  return (
    <section className="bg-white pb-16 sm:pb-24">
      <div className="mx-auto w-full max-w-xl px-5">
        <motion.button
          type="button"
          onClick={handleClick}
          initial={{ opacity: 0, y: reduceMotion ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          whileHover={reduceMotion ? undefined : { y: -2, scale: 1.01 }}
          whileTap={reduceMotion ? undefined : { scale: 0.97 }}
          transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
          className="w-full rounded-[var(--radius-btn)] py-4 text-base font-bold text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3a7a4f] focus-visible:ring-offset-2 sm:text-lg"
          style={{
            backgroundColor: "var(--green-500)",
            boxShadow: "var(--shadow-float)",
          }}
        >
          Iniciar meu Tratamento
        </motion.button>
      </div>
    </section>
  );
}
