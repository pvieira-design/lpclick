"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

const MESSAGES = [
  <>
    Primeira consulta <b className="font-semibold">R$50</b> · 1º acompanhamento{" "}
    <b className="font-semibold">grátis</b>
  </>,
  <>
    Médicos especialistas <b className="font-semibold">online</b>
  </>,
  <>
    Tratamento <b className="font-semibold">regulamentado pela ANVISA</b>
  </>,
];

export default function AnnouncementBar() {
  const [index, setIndex] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const id = setInterval(
      () => setIndex((i) => (i + 1) % MESSAGES.length),
      4000,
    );
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="flex h-9 items-center justify-center overflow-hidden px-4 text-center"
      style={{ backgroundColor: "var(--green-700)" }}
      role="status"
      aria-live="polite"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.p
          key={index}
          initial={{ opacity: 0, y: reduceMotion ? 0 : 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: reduceMotion ? 0 : -10 }}
          transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
          className="truncate text-xs text-white/90"
        >
          {MESSAGES[index]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
