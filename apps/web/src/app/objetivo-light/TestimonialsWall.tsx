"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { TEXT_TESTIMONIALS, type TextTestimonial } from "../lp5/textTestimonials";

// Carrossel duplicado: mantém o DOM leve usando só os primeiros N depoimentos.
const MAX_ITEMS = 16;

function relativeDate(iso: string): string {
  const then = new Date(iso).getTime();
  if (!then) return "";
  const days = Math.max(0, Math.floor((Date.now() - then) / (1000 * 60 * 60 * 24)));
  if (days < 7) return `há ${days} dia${days === 1 ? "" : "s"}`;
  if (days < 30) {
    const w = Math.floor(days / 7);
    return `há ${w} semana${w === 1 ? "" : "s"}`;
  }
  const months = Math.floor(days / 30);
  if (months < 12) return `há ${months} ${months === 1 ? "mês" : "meses"}`;
  const years = Math.floor(months / 12);
  return `há ${years} ano${years === 1 ? "" : "s"}`;
}

const TAG_STYLES: Record<string, string> = {
  Insônia: "bg-[#e6f2e9] text-[#2d6e3f]",
  Ansiedade: "bg-[#eef2ff] text-[#4f46e5]",
  Dor: "bg-[#fee7e6] text-[#b1382e]",
  Pânico: "bg-[#f3e8ff] text-[#7c3aed]",
  Depressão: "bg-[#e0e7ef] text-[#475569]",
  Foco: "bg-[#fef3c7] text-[#92400e]",
  Estresse: "bg-[#ffedd5] text-[#9a3412]",
  Artrite: "bg-[#fce7f3] text-[#9d174d]",
};
const tagStyle = (t: string) => TAG_STYLES[t] ?? "bg-gray-100 text-gray-600";

export default function TestimonialsWall() {
  const reduceMotion = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const [doubled, setDoubled] = useState(false);

  const offsetRef = useRef(0);
  const halfWidthRef = useRef(0);
  const draggingRef = useRef(false);
  const pointerDownRef = useRef(false);
  const pointerIdRef = useRef<number | null>(null);
  const dragStartXRef = useRef(0);
  const dragStartOffsetRef = useRef(0);
  const hoverPausedRef = useRef(false);

  const items = TEXT_TESTIMONIALS.slice(0, MAX_ITEMS);

  // Duplica os itens só depois do primeiro paint pra não inflar o DOM medido
  // pelo Lighthouse no LCP.
  useEffect(() => {
    setDoubled(true);
  }, []);

  // Loop de auto-scroll + render do offset (compartilhado com drag)
  useEffect(() => {
    if (!doubled) return;
    const SPEED_PX_PER_S = 32;
    let raf = 0;
    let lastTs = 0;

    const measure = () => {
      const el = trackRef.current;
      if (!el) return;
      halfWidthRef.current = el.scrollWidth / 2;
    };
    measure();
    window.addEventListener("resize", measure);

    const tick = (ts: number) => {
      if (lastTs === 0) lastTs = ts;
      const dt = ts - lastTs;
      lastTs = ts;
      const paused = draggingRef.current || hoverPausedRef.current;
      const half = halfWidthRef.current;
      if (!paused && half > 0) {
        offsetRef.current -= (SPEED_PX_PER_S * dt) / 1000;
        if (offsetRef.current <= -half) offsetRef.current += half;
      }
      const el = trackRef.current;
      if (el) el.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", measure);
    };
  }, [doubled]);

  const wrapOffset = (off: number) => {
    const half = halfWidthRef.current;
    if (half <= 0) return off;
    let x = off;
    while (x <= -half) x += half;
    while (x > 0) x -= half;
    return x;
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    pointerDownRef.current = true;
    pointerIdRef.current = e.pointerId;
    draggingRef.current = false;
    dragStartXRef.current = e.clientX;
    dragStartOffsetRef.current = offsetRef.current;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!pointerDownRef.current || e.pointerId !== pointerIdRef.current) return;
    const delta = e.clientX - dragStartXRef.current;
    if (!draggingRef.current) {
      if (Math.abs(delta) <= 4) return;
      draggingRef.current = true;
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch { /* already captured or unsupported */ }
    }
    offsetRef.current = wrapOffset(dragStartOffsetRef.current + delta);
  };

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerId !== pointerIdRef.current) return;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    pointerDownRef.current = false;
    pointerIdRef.current = null;
    draggingRef.current = false;
  };

  const loop = doubled ? [...items, ...items] : items;

  return (
    <section
      id="objetivo-light-testimonials-wall"
      className="relative overflow-hidden bg-white pb-12 sm:pb-20"
    >
      <motion.div
        initial={{ opacity: 0, y: reduceMotion ? 0 : 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        onMouseEnter={() => { hoverPausedRef.current = true; }}
        onMouseLeave={() => { hoverPausedRef.current = false; }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        className="cursor-grab select-none active:cursor-grabbing"
        style={{ touchAction: "pan-y" }}
      >
        <div
          ref={trackRef}
          className="flex w-max items-stretch gap-4 px-4 sm:gap-5"
          style={{ willChange: "transform" }}
        >
          {loop.map((r, i) => (
            <ReviewCard key={`${r.name}-${i}`} review={r} />
          ))}
        </div>
      </motion.div>
    </section>
  );
}

function ReviewCard({ review }: { review: TextTestimonial }) {
  return (
    <article
      className="flex shrink-0 flex-col rounded-[var(--radius-card)] border bg-white p-5"
      style={{
        width: "min(78vw, 340px)",
        borderColor: "var(--line)",
        boxShadow: "var(--shadow-card)",
      }}
    >
      <div className="flex items-center gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={review.photo}
          alt=""
          width={40}
          height={40}
          loading="lazy"
          decoding="async"
          draggable={false}
          referrerPolicy="no-referrer"
          className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-100 object-cover"
        />
        <div className="flex flex-1 flex-col">
          <span className="text-[0.875rem] font-medium text-gray-900">
            {review.name}
          </span>
          <div
            role="img"
            className="mt-0.5 flex items-center gap-0.5 text-[#f5a623]"
            aria-label="5 estrelas"
          >
            {Array.from({ length: 5 }).map((_, i) => (
              <svg
                key={i}
                width="12"
                height="12"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M10 1.5l2.6 5.27 5.82.85-4.21 4.1.99 5.78L10 14.77l-5.2 2.73.99-5.78L1.58 7.62l5.82-.85L10 1.5z" />
              </svg>
            ))}
          </div>
        </div>
        <span className="text-[0.75rem] text-gray-400">
          {relativeDate(review.publishedAt)}
        </span>
      </div>
      <p className="mt-3 flex-1 text-[0.9375rem] leading-relaxed text-gray-700">
        “{review.text}”
      </p>
      {review.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {review.tags.map((t) => (
            <span
              key={t}
              className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${tagStyle(t)}`}
            >
              {t}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}
