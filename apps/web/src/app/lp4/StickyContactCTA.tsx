"use client";

import { useEffect, useState } from "react";

export default function StickyContactCTA() {
  const [visible, setVisible] = useState(false);
  const [pulsing, setPulsing] = useState(false);

  useEffect(() => {
    const anchor = document.getElementById("lp4-sticky-anchor");
    if (!anchor) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(!entry.isIntersecting && entry.boundingClientRect.top < 0);
      },
      { threshold: 0 },
    );
    observer.observe(anchor);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const wall = document.getElementById("lp4-testimonials-wall");
    if (!wall) return;
    const observer = new IntersectionObserver(
      ([entry]) => setPulsing(entry.isIntersecting),
      { threshold: 0 },
    );
    observer.observe(wall);
    return () => observer.disconnect();
  }, []);

  const handleClick = () => {
    window.dispatchEvent(new CustomEvent("treatment:open"));
  };

  return (
    <>
      <style>{`
        @keyframes ctaPulse {
          0%, 100% {
            box-shadow:
              0 8px 24px rgba(40,94,49,0.35),
              0 0 0 0 rgba(61,143,74,0.55);
            transform: scale(1);
          }
          50% {
            box-shadow:
              0 8px 24px rgba(40,94,49,0.35),
              0 0 0 14px rgba(61,143,74,0);
            transform: scale(1.025);
          }
        }
        .cta-pulse {
          animation: ctaPulse 1.6s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .cta-pulse { animation: none; }
        }
      `}</style>
      <div
        aria-hidden={!visible}
        className="pointer-events-none fixed inset-x-0 bottom-0 z-40 bg-white px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 transition-all duration-300 ease-out"
        style={{
          transform: visible ? "translateY(0)" : "translateY(120%)",
          opacity: visible ? 1 : 0,
        }}
      >
        <div className="mx-auto w-full max-w-xl">
          <button
            type="button"
            onClick={handleClick}
            tabIndex={visible ? 0 : -1}
            className={`pointer-events-auto w-full rounded-xl py-4 text-base font-bold text-white shadow-[0_8px_24px_rgba(40,94,49,0.35)] transition-all duration-150 ease-out hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3a7a4f] focus-visible:ring-offset-2 active:scale-[0.98] sm:text-lg ${pulsing && visible ? "cta-pulse" : ""}`}
            style={{ backgroundColor: "#3D8F4A" }}
          >
            Entrar em contato
          </button>
        </div>
      </div>
    </>
  );
}
