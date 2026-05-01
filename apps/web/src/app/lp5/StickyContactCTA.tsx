"use client";

import { useEffect, useState } from "react";

export default function StickyContactCTA() {
  const [visible, setVisible] = useState(false);
  const [pulsing, setPulsing] = useState(false);

  useEffect(() => {
    const anchor = document.getElementById("lp5-sticky-anchor");
    if (!anchor) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting || entry.boundingClientRect.top < 0);
      },
      { threshold: 0 },
    );
    observer.observe(anchor);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const ids = ["lp5-treatment-steps", "lp5-other-testimonials"];
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

  const handleClick = () => {
    window.dispatchEvent(new CustomEvent("treatment:open"));
  };

  return (
    <>
      <style>{`
        @keyframes ctaWave {
          0% {
            box-shadow: 0 0 0 0 rgba(61,143,74,0.55);
          }
          100% {
            box-shadow: 0 0 0 18px rgba(61,143,74,0);
          }
        }
        .cta-pulse {
          position: relative;
          isolation: isolate;
        }
        .cta-pulse::after {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          z-index: -1;
          animation: ctaWave 1.6s cubic-bezier(0.25, 0.8, 0.4, 1) infinite;
          pointer-events: none;
        }
        @media (prefers-reduced-motion: reduce) {
          .cta-pulse::after { animation: none; }
        }
      `}</style>
      <div
        aria-hidden={!visible}
        className="pointer-events-none fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 transition-all duration-300 ease-out"
        style={{
          transform: visible ? "translateY(0)" : "translateY(120%)",
          opacity: visible ? 1 : 0,
        }}
      >
        <div className="mx-auto w-full max-w-xl">
          <div
            aria-hidden={!(pulsing && visible)}
            className="overflow-hidden text-left transition-all duration-300 ease-out"
            style={{
              maxHeight: pulsing && visible ? "120px" : "0px",
              opacity: pulsing && visible ? 1 : 0,
              marginBottom: pulsing && visible ? "0.625rem" : "0",
            }}
          >
            <p className="text-left text-[1.25rem] leading-snug text-gray-800">
              Consulta com médico especialista de{" "}
              <span className="text-gray-400 line-through">R$120,00</span>{" "}
              por apenas{" "}
              <span className="font-bold text-[#285E31]">R$50,00</span>
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
          </div>
          <button
            type="button"
            onClick={handleClick}
            tabIndex={visible ? 0 : -1}
            className={`pointer-events-auto w-full rounded-xl py-4 text-base font-bold text-white shadow-[0_8px_24px_rgba(40,94,49,0.35)] transition-all duration-150 ease-out hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3a7a4f] focus-visible:ring-offset-2 active:scale-[0.98] sm:text-lg ${pulsing && visible ? "cta-pulse" : ""}`}
            style={{ backgroundColor: "#3D8F4A" }}
          >
            Iniciar meu Tratamento
          </button>
        </div>
      </div>
    </>
  );
}
