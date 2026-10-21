"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { APPROVED_TESTIMONIALS, type ApprovedTestimonial } from "@/lib/approvedTestimonials";

// Compatível com os lotes aprovados com data aproximada.
type Review = ApprovedTestimonial & { approximateDate?: { displayLabel: string } };

// Seleção editorial: todos os textos finais mencionam sono ou dormir.
const SLEEP_REVIEW_IDS = new Set([1, 3, 9, 12, 18, 34, 46, 72, 140, 146, 148, 165]);
const ITEMS = APPROVED_TESTIMONIALS.filter((review) => SLEEP_REVIEW_IDS.has(review.sourceReviewId));

function reviewDate(review: Review): string {
  if (review.approximateDate) return review.approximateDate.displayLabel;
  if (!review.publishedAt) return "";
  const [year, month, day] = review.publishedAt.split("-");
  return `${day}/${month}/${year}`;
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

  const items = ITEMS;

  // Duplica os itens só depois do primeiro paint pra não inflar o DOM medido
  // pelo Lighthouse no LCP.
  useEffect(() => {
    setDoubled(true);
  }, []);

  // Loop de auto-scroll + render do offset (compartilhado com drag)
  useEffect(() => {
    if (!doubled) return;
    const SPEED_PX_PER_S = reduceMotion ? 0 : 32;
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
      const dt = Math.min(32, ts - lastTs);
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
  }, [doubled, reduceMotion]);

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
      id="primeiro-passo-sono-testimonials-wall"
      aria-labelledby="primeiro-passo-sono-testimonials-title"
      className="relative overflow-hidden bg-white py-10 sm:py-16"
    >
      <header className="mx-auto mb-6 max-w-xl px-4 text-center sm:mb-8 sm:px-5">
        <span
          className="mb-3 inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-medium"
          style={{ backgroundColor: "var(--green-100)", color: "var(--green-700)" }}
        >
          Depoimentos
        </span>
        <h2 id="primeiro-passo-sono-testimonials-title" className="font-display text-2xl sm:text-3xl" style={{ color: "var(--ink)" }}>
          Veja os relatos de quem já passou por aqui
        </h2>
        <p className="mt-3 text-xs" style={{ color: "var(--muted)" }}>
          Relatos de quem buscou cuidar do sono. Resultados variam de pessoa para pessoa.
        </p>
      </header>
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

function ReviewCard({ review }: { review: Review }) {
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
        {review.photo ? <img
          src={review.photo}
          alt=""
          width={40}
          height={40}
          loading="lazy"
          decoding="async"
          draggable={false}
          referrerPolicy="no-referrer"
          className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-100 object-cover"
        /> : (
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-medium text-gray-600" aria-hidden="true">
            {review.name.split(/\s+/).map((part) => part[0]).slice(0, 2).join("")}
          </span>
        )}
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
          {reviewDate(review)}
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
