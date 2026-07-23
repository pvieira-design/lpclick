"use client";

import { motion, useReducedMotion } from "framer-motion";
import { TEXT_TESTIMONIALS, type TextTestimonial } from "../lp5/textTestimonials";
import { LINKS } from "./config";

const EASE: [number, number, number, number] = [0.23, 1, 0.32, 1];

// Carrossel duplicado: mantém o DOM leve usando só os primeiros N depoimentos.
const MAX_ITEMS = 18;

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

function GoogleG({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  );
}

function Stars({ size = 13 }: { size?: number }) {
  return (
    <span className="flex gap-0.5 text-[#f5a623]" role="img" aria-label="5 de 5 estrelas">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path d="M10 1.5l2.6 5.27 5.82.85-4.21 4.1.99 5.78L10 14.77l-5.2 2.73.99-5.78L1.58 7.62l5.82-.85L10 1.5z" />
        </svg>
      ))}
    </span>
  );
}

export default function GoogleReviews() {
  const reduceMotion = useReducedMotion();

  // Scroll nativo horizontal, o mesmo padrão dos depoimentos em vídeo:
  // toque com snap, sem arraste manual ou movimento automático.
  const items = TEXT_TESTIMONIALS.slice(0, MAX_ITEMS);

  return (
    <motion.section
      className="mt-12"
      initial={{ opacity: 0, y: reduceMotion ? 0 : 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.6, ease: EASE }}
    >
      {/* Nota do Google */}
      <div
        className="mx-auto flex w-fit items-center gap-3 rounded-full border bg-white px-4 py-2.5"
        style={{ borderColor: "var(--line)", boxShadow: "var(--shadow-card)" }}
      >
        <GoogleG size={22} />
        <span className="text-[1.35rem] font-semibold leading-none tracking-tight text-[color:var(--ink)]">
          4,9
        </span>
        <span className="flex flex-col gap-1">
          <Stars size={12} />
          <span className="text-[11px] leading-none text-[color:var(--muted)]">
            avaliações de pacientes
          </span>
        </span>
      </div>

      {/* Carrossel de avaliações reais — scroll nativo com snap */}
      <div className="-mx-5 mt-5 overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex w-max snap-x snap-mandatory items-stretch gap-3 px-5">
          {items.map((r, i) => (
            <ReviewCard key={`${r.name}-${i}`} review={r} />
          ))}
        </div>
      </div>

      {/* Selos de reputação */}
      <div className="mt-6 flex items-center justify-center gap-5">
        {[
          { src: "/1.webp", alt: "Ótimo no Reclame Aqui" },
          { src: "/2.webp", alt: "Certificado RA1000 do Reclame Aqui" },
        ].map((s) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={s.src}
            src={s.src}
            alt={s.alt}
            width={120}
            height={60}
            loading="lazy"
            decoding="async"
            className="h-12 w-auto object-contain mix-blend-multiply"
          />
        ))}
      </div>

      <a
        href={LINKS.depoimentos}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 flex w-full items-center justify-center gap-1.5 text-[13.5px] font-medium text-[color:var(--green-700)] underline-offset-4 hover:underline"
      >
        Ver mais depoimentos
        <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </a>
    </motion.section>
  );
}

function ReviewCard({ review }: { review: TextTestimonial }) {
  return (
    <article
      className="flex shrink-0 snap-start flex-col rounded-[var(--radius-card)] border bg-white p-4"
      style={{
        width: "min(76vw, 300px)",
        borderColor: "var(--line)",
        boxShadow: "var(--shadow-card)",
      }}
    >
      <div className="flex items-center gap-2.5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={review.photo}
          alt=""
          width={36}
          height={36}
          loading="lazy"
          decoding="async"
          draggable={false}
          referrerPolicy="no-referrer"
          className="size-9 shrink-0 rounded-full bg-gray-100 object-cover"
        />
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="truncate text-[13.5px] font-medium text-[color:var(--ink)]">
            {review.name}
          </span>
          <span className="mt-0.5">
            <Stars size={11} />
          </span>
        </div>
        <span className="shrink-0 text-[11px] text-gray-400">{relativeDate(review.publishedAt)}</span>
        <GoogleG size={14} />
      </div>

      <p className="mt-2.5 flex-1 text-[13.5px] leading-relaxed text-[color:var(--muted)]">
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
