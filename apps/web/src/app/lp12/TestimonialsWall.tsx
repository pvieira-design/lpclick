"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { TEXT_TESTIMONIALS, type TextTestimonial } from "../lp5/textTestimonials";

const BATCH = 12;

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
  const [visible, setVisible] = useState(BATCH);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const total = TEXT_TESTIMONIALS.length;

  useEffect(() => {
    if (visible >= total) return;
    const el = sentinelRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible((v) => Math.min(v + BATCH, total));
        }
      },
      { rootMargin: "600px 0px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [visible, total]);

  const items = TEXT_TESTIMONIALS.slice(0, visible);
  const columns: TextTestimonial[][] = [[], [], []];
  items.forEach((r, i) => columns[i % 3].push(r));

  return (
    <section id="lp12-testimonials-wall" className="bg-white pb-12 sm:pb-20">
      <div className="mx-auto w-full max-w-5xl px-5">
        <div className="mx-auto flex max-w-[540px] flex-col gap-4 sm:hidden">
          {items.map((r) => (
            <ReviewCard key={`m-${r.name}`} review={r} />
          ))}
        </div>

        <div className="hidden grid-cols-3 gap-4 sm:grid">
          {columns.map((col, ci) => (
            <div key={ci} className="flex flex-col gap-4">
              {col.map((r) => (
                <ReviewCard key={`c${ci}-${r.name}`} review={r} />
              ))}
            </div>
          ))}
        </div>

        {visible < total && (
          <div ref={sentinelRef} aria-hidden="true" className="h-1 w-full" />
        )}
      </div>
    </section>
  );
}

function ReviewCard({ review }: { review: TextTestimonial }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.article
      initial={{ opacity: 0, y: reduceMotion ? 0 : 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
      className="rounded-[var(--radius-card)] border bg-white p-5"
      style={{ borderColor: "var(--line)", boxShadow: "var(--shadow-card)" }}
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
      <p className="mt-3 text-[0.9375rem] leading-relaxed text-gray-700">
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
    </motion.article>
  );
}
