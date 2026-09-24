"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

export default function StickyContactCTA({ variant }: { variant?: "inicio" }) {
  const [visible, setVisible] = useState(false);
  const [pulsing, setPulsing] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const anchor = variant === "inicio"
      ? document.getElementById("lp12-treatment-form")
      : document.getElementById("lp12-sticky-anchor");
    if (!anchor) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(variant === "inicio"
          ? !entry.isIntersecting && entry.boundingClientRect.bottom < 0
          : entry.isIntersecting || entry.boundingClientRect.top < 0);
      },
      { threshold: 0 },
    );
    observer.observe(anchor);
    return () => observer.disconnect();
  }, [variant]);

  useEffect(() => {
    if (variant === "inicio") return;
    const ids = ["lp12-treatment-steps", "lp12-testimonials-wall"];
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
  }, [variant]);

  const handleClick = () => {
    window.dispatchEvent(new CustomEvent("treatment:open"));
  };

  return (
    <>
      {/* Estilo .cta-pulse é global da lp12 (definido em page.tsx), compartilhado com o CTA do hero. */}
      <motion.div
        aria-hidden={!visible}
        className="pointer-events-none fixed inset-x-0 bottom-0 z-40 border-t bg-white px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3"
        style={{ borderColor: "var(--line)" }}
        initial={false}
        animate={{
          y: visible ? "0%" : "120%",
          opacity: visible ? 1 : 0,
        }}
        transition={
          reduceMotion
            ? { duration: 0 }
            : { duration: 0.35, ease: [0.23, 1, 0.32, 1] }
        }
      >
        <div className="mx-auto w-full max-w-xl">
          {variant === "inicio" && (
            <div className="mb-2.5 text-left">
              <p className="mb-1.5 flex items-center gap-1 text-[9px] font-bold uppercase tracking-[0.08em] text-[#3d714b] sm:text-[10px]">
                <span className="size-1.5 shrink-0 rounded-full bg-[#3d8f4a]" aria-hidden="true" />
                <span className="shrink-0">Agenda de hoje aberta</span>
                <span className="min-w-0 truncate font-normal normal-case tracking-normal text-[#7b8780]">· horários sujeitos à disponibilidade</span>
              </p>
              <p className="text-[1.05rem] leading-snug text-[#263a2d] sm:text-[1.2rem]">
                Consulta com médico especialista de{" "}
                <span className="text-[#9ba39e] line-through">R$120,00</span>{" "}
                por apenas <span className="whitespace-nowrap font-extrabold text-[#285e31]">R$50,00</span>
              </p>
              <div className="mt-2.5 flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#cfe3d3] bg-gradient-to-b from-white to-[#f5faf6] px-3 py-1.5 text-[10px] font-bold text-[#1f4f2a] shadow-[0_1px_2px_rgba(40,94,49,0.06)] sm:text-xs">
                  <span className="relative flex size-2 items-center justify-center" aria-hidden="true">
                    <span className="absolute inset-0 animate-ping rounded-full bg-[#3d8f4a] opacity-70" />
                    <span className="relative size-2 rounded-full bg-[#3d8f4a]" />
                  </span>
                  100% online
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#cfe3d3] bg-gradient-to-b from-white to-[#f5faf6] px-3 py-1.5 text-[10px] font-bold text-[#1f4f2a] shadow-[0_1px_2px_rgba(40,94,49,0.06)] sm:text-xs">
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="text-[#285e31]">
                    <circle cx="6" cy="5.5" r="2.4" stroke="currentColor" strokeWidth="1.4" />
                    <path d="M1.6 13.4c.6-2.4 2.3-3.8 4.4-3.8s3.8 1.4 4.4 3.8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                    <circle cx="11.5" cy="4.5" r="1.8" stroke="currentColor" strokeWidth="1.3" opacity="0.55" />
                    <path d="M10.4 9.8c1.6.2 2.9 1.4 3.4 3.1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" opacity="0.55" />
                  </svg>
                  +50 mil pacientes
                </span>
              </div>
            </div>
          )}
          {variant !== "inicio" && <div
            aria-hidden={!(pulsing && visible)}
            className="overflow-hidden text-left transition-all duration-300 ease-out"
            style={{
              maxHeight: pulsing && visible ? "120px" : "0px",
              opacity: pulsing && visible ? 1 : 0,
              marginBottom: pulsing && visible ? "0.625rem" : "0",
            }}
          >
            <p className="text-left text-[1.25rem] leading-snug text-gray-800">
              Consulta com médico especialista por apenas{" "}
              <span className="whitespace-nowrap font-bold text-[#285E31]">R$50</span>
            </p>
            <div className="mt-2.5 flex items-center justify-start gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#cfe3d3] bg-gradient-to-b from-white to-[#f5faf6] px-3 py-1.5 text-[11px] font-semibold tracking-[0.01em] text-[#1f4f2a] shadow-[0_1px_2px_rgba(40,94,49,0.06)] sm:text-xs">
                <span className="relative flex size-2 items-center justify-center">
                  <span className="absolute inset-0 animate-ping rounded-full bg-[#3D8F4A] opacity-75" />
                  <span className="relative size-2 rounded-full bg-[#3D8F4A]" />
                </span>
                100% online
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#cfe3d3] bg-gradient-to-b from-white to-[#f5faf6] px-3 py-1.5 text-[11px] font-semibold tracking-[0.01em] text-[#1f4f2a] shadow-[0_1px_2px_rgba(40,94,49,0.06)] sm:text-xs">
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="text-[#285E31]">
                  <circle cx="6" cy="5.5" r="2.4" stroke="currentColor" strokeWidth="1.4" />
                  <path d="M1.6 13.4c.6-2.4 2.3-3.8 4.4-3.8s3.8 1.4 4.4 3.8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                  <circle cx="11.5" cy="4.5" r="1.8" stroke="currentColor" strokeWidth="1.3" opacity="0.55" />
                  <path d="M10.4 9.8c1.6.2 2.9 1.4 3.4 3.1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" opacity="0.55" />
                </svg>
                +50 mil pacientes
              </span>
            </div>
          </div>}
          <motion.button
            type="button"
            onClick={handleClick}
            tabIndex={visible ? 0 : -1}
            whileHover={reduceMotion ? undefined : { y: -2, scale: 1.01 }}
            whileTap={reduceMotion ? undefined : { scale: 0.97 }}
            className={`pointer-events-auto flex w-full items-center justify-center gap-3 rounded-[var(--radius-btn)] py-4 text-base font-bold text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3a7a4f] focus-visible:ring-offset-2 sm:text-lg ${visible ? "cta-pulse" : ""}`}
            style={{
              backgroundColor: "var(--green-500)",
              boxShadow: "var(--shadow-float)",
            }}
          >
            {variant === "inicio" ? (
              <>Agendar minha consulta <svg className="size-4" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M3.5 10h12m-5-5 5 5-5 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg></>
            ) : "Iniciar meu Tratamento"}
          </motion.button>
        </div>
      </motion.div>
    </>
  );
}
