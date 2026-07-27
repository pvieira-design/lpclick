"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { openSchedule } from "./config";

export default function StickyCta() {
  const [visible, setVisible] = useState(false);
  const reduceMotion = useReducedMotion();

  // Só aparece depois que o CTA do hero sai da tela — não compete com ele.
  useEffect(() => {
    const anchor = document.getElementById("lp13-hero-end");
    if (!anchor) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.boundingClientRect.top < 0 && !entry.isIntersecting),
      { threshold: 0 },
    );
    observer.observe(anchor);
    return () => observer.disconnect();
  }, []);

  return (
    <motion.div
      aria-hidden={!visible}
      className="pointer-events-none fixed inset-x-0 bottom-0 z-40 px-4 pb-[max(0.875rem,env(safe-area-inset-bottom))] pt-3"
      style={{
        background:
          "linear-gradient(180deg, rgba(251,250,247,0) 0%, rgba(251,250,247,.9) 32%, #FBFAF7 100%)",
      }}
      initial={false}
      animate={{ y: visible ? "0%" : "130%", opacity: visible ? 1 : 0 }}
      transition={reduceMotion ? { duration: 0 } : { duration: 0.32, ease: [0.23, 1, 0.32, 1] }}
    >
      <motion.button
        type="button"
        tabIndex={visible ? 0 : -1}
        onClick={() => openSchedule({ origem: "sticky" })}
        whileTap={reduceMotion ? undefined : { scale: 0.98 }}
        className="pointer-events-auto mx-auto flex w-full max-w-[28rem] items-center justify-center gap-2.5 rounded-full py-4 text-[16px] font-semibold text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--green-500)] focus-visible:ring-offset-2"
        style={{ backgroundColor: "var(--green-500)", boxShadow: "var(--shadow-float)" }}
      >
        Agendar consulta
        <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-[13px] font-semibold">
          R$50
        </span>
      </motion.button>
    </motion.div>
  );
}
