"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { openSchedule } from "./config";

const EASE: [number, number, number, number] = [0.23, 1, 0.32, 1];

export default function StickyCta() {
  const [visible, setVisible] = useState(false);
  const [pulsing, setPulsing] = useState(false);
  const reduceMotion = useReducedMotion();

  // Aparece a partir da âncora do primeiro slider (estrutura da lp5) — antes
  // disso o CTA do hero-formulário está em cena e o sticky não compete.
  useEffect(() => {
    const anchor = document.getElementById("lp15-sticky-anchor");
    if (!anchor) return;
    const observer = new IntersectionObserver(
      ([entry]) =>
        setVisible(entry.isIntersecting || entry.boundingClientRect.top < 0),
      { threshold: 0 },
    );
    observer.observe(anchor);
    return () => observer.disconnect();
  }, []);

  // Nas seções profundas, o sticky ganha o painel de preço e o pulso — o
  // mesmo reforço de oferta que funciona na lp5.
  useEffect(() => {
    const ids = ["lp15-treatment-steps"];
    const targets = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (targets.length === 0) return;
    const intersecting = new Set<Element>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) intersecting.add(entry.target);
          else intersecting.delete(entry.target);
        }
        setPulsing(intersecting.size > 0);
      },
      { threshold: 0 },
    );
    targets.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style>{`
        @keyframes lp15StickyWave {
          from { box-shadow: 0 0 0 0 rgba(61,143,74,.55); }
          to { box-shadow: 0 0 0 18px rgba(61,143,74,0); }
        }
        .lp15-sticky-pulse { position: relative; isolation: isolate; }
        .lp15-sticky-pulse::after {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          z-index: -1;
          animation: lp15StickyWave 1.6s cubic-bezier(.25,.8,.4,1) infinite;
          pointer-events: none;
        }
        @media (prefers-reduced-motion: reduce) {
          .lp15-sticky-pulse::after { animation: none; }
        }
      `}</style>

      <motion.div
        aria-hidden={!visible}
        className="pointer-events-none fixed inset-x-0 bottom-0 z-40 border-t px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3"
        style={{ borderColor: "var(--line)", backgroundColor: "var(--bg)" }}
        initial={false}
        animate={{ y: visible ? "0%" : "120%", opacity: visible ? 1 : 0 }}
        transition={reduceMotion ? { duration: 0 } : { duration: 0.32, ease: EASE }}
      >
        <div className="mx-auto w-full max-w-xl">
          <AnimatePresence initial={false}>
            {pulsing && visible && (
              <motion.div
                initial={reduceMotion ? false : { height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={reduceMotion ? undefined : { height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: EASE }}
                className="overflow-hidden text-left"
              >
                <p className="text-[1.15rem] leading-snug text-[color:var(--ink)]">
                  Consulta com médico especialista de{" "}
                  <span className="text-[color:var(--muted)] line-through">R$120,00</span>{" "}
                  por apenas{" "}
                  <span className="font-bold text-[color:var(--green-bright)]">R$50,00</span>
                </p>
                <div className="mb-2.5 mt-2 flex items-center justify-start gap-2">
                  <span
                    className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-semibold tracking-[0.01em] text-[color:var(--green-bright)] sm:text-xs"
                    style={{ borderColor: "var(--line)", backgroundColor: "var(--panel)" }}
                  >
                    <span className="relative flex size-2 items-center justify-center">
                      <span className="absolute inset-0 animate-ping rounded-full bg-[color:var(--green-500)] opacity-75" />
                      <span className="relative size-2 rounded-full bg-[color:var(--green-500)]" />
                    </span>
                    100% online
                  </span>
                  <span
                    className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-semibold tracking-[0.01em] text-[color:var(--green-bright)] sm:text-xs"
                    style={{ borderColor: "var(--line)", backgroundColor: "var(--panel)" }}
                  >
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                      <circle cx="6" cy="5.5" r="2.4" stroke="currentColor" strokeWidth="1.4" />
                      <path d="M1.6 13.4c.6-2.4 2.3-3.8 4.4-3.8s3.8 1.4 4.4 3.8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                      <circle cx="11.5" cy="4.5" r="1.8" stroke="currentColor" strokeWidth="1.3" opacity="0.55" />
                      <path d="M10.4 9.8c1.6.2 2.9 1.4 3.4 3.1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" opacity="0.55" />
                    </svg>
                    +50 mil pacientes
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            type="button"
            tabIndex={visible ? 0 : -1}
            onClick={() => openSchedule({ origem: "sticky" })}
            whileTap={reduceMotion ? undefined : { scale: 0.98 }}
            className={`pointer-events-auto w-full rounded-2xl py-4 text-base font-bold text-white transition-all duration-150 ease-out hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--green-500)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0D0B] sm:text-lg ${
              pulsing && visible ? "lp15-sticky-pulse" : ""
            }`}
            style={{ backgroundColor: "var(--green-500)", boxShadow: "var(--shadow-float)" }}
          >
            Iniciar meu Tratamento
          </motion.button>
        </div>
      </motion.div>
    </>
  );
}
