"use client";

// Depoimentos escritos (dados da lp5) em faixa horizontal — cards lado a lado
// com auto-scroll e arraste, priorizando as queixas comuns do esporte.

import { useEffect, useRef, useState } from "react";
import { TEXT_TESTIMONIALS, type TextTestimonial } from "../lp5/textTestimonials";

// Fora do recorte de esporte: temas clínicos que não conversam com a página.
const TAGS_EXCLUIDAS = new Set([
  "Depressão",
  "Pânico",
  "TDAH",
  "Tea",
  "Humor",
  "Impulsividade",
  "Irritacao",
]);

// Queixas nº 1 de quem treina — esses depoimentos abrem a faixa.
const TAGS_DOR = new Set(["Dor", "Dor na coluna", "Artrite", "Fibromialgia"]);

// Perfis com nome que soa fake derrubam a credibilidade da faixa.
const NOMES_EXCLUIDOS = new Set(["Jacaré Junior"]);

// Escolhidos a dedo por citarem atividade física no relato: abrem a faixa e
// passam por fora dos filtros de tag.
const NOMES_DESTAQUE = ["Sandra CardosoBueno", "Juliana Lopes", "luiz carlos pizani"];

const MAX_ITEMS = 18;

const ITEMS: TextTestimonial[] = (() => {
  const destaque = NOMES_DESTAQUE.map((n) =>
    TEXT_TESTIMONIALS.find((t) => t.name === n),
  ).filter((t): t is TextTestimonial => t !== undefined);
  const aptos = TEXT_TESTIMONIALS.filter(
    (t) =>
      !NOMES_EXCLUIDOS.has(t.name) &&
      !NOMES_DESTAQUE.includes(t.name) &&
      !t.tags.some((tag) => TAGS_EXCLUIDAS.has(tag)),
  );
  const comDor = aptos.filter((t) => t.tags.some((tag) => TAGS_DOR.has(tag)));
  const demais = aptos.filter((t) => !t.tags.some((tag) => TAGS_DOR.has(tag)));
  return [...destaque, ...comDor, ...demais].slice(0, MAX_ITEMS);
})();

// Recebe o "agora" medido no cliente: calcular com Date.now() na renderização
// divergiria do HTML estático (gerado no build) e quebraria a hidratação.
function relativeDate(iso: string, now: number): string {
  const then = new Date(iso).getTime();
  if (!then) return "";
  const days = Math.max(0, Math.floor((now - then) / (1000 * 60 * 60 * 24)));
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

export default function TestimonialsWall() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [doubled, setDoubled] = useState(false);
  // Preenchido só no cliente — as datas relativas entram após a hidratação.
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
  }, []);

  const offsetRef = useRef(0);
  const halfWidthRef = useRef(0);
  const draggingRef = useRef(false);
  const pointerDownRef = useRef(false);
  const pointerIdRef = useRef<number | null>(null);
  const dragStartXRef = useRef(0);
  const dragStartOffsetRef = useRef(0);
  const hoverPausedRef = useRef(false);

  // Duplica os itens só depois do primeiro paint pra não inflar o DOM medido
  // pelo Lighthouse no LCP.
  useEffect(() => {
    setDoubled(true);
  }, []);

  // Loop de auto-scroll + render do offset (compartilhado com drag)
  useEffect(() => {
    if (!doubled) return;
    // Com prefers-reduced-motion o avanço automático fica parado, mas o loop
    // continua rodando para o arraste manual seguir funcionando.
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const SPEED_PX_PER_S = reduceMotion ? 0 : 28;
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

  const loop = doubled ? [...ITEMS, ...ITEMS] : ITEMS;

  return (
    <section id="lp14-testimonials-wall" className="overflow-hidden py-10 sm:py-16">
      <div className="mx-auto mb-6 w-full max-w-xl px-5 text-center sm:mb-10">
        <h2 className="font-display text-[1.7rem] leading-tight sm:text-4xl">
          <span>Histórias reais de</span>{" "}
          <span className="text-[color:var(--green-bright)]">nossos pacientes</span>
        </h2>
      </div>

      <div
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
            <ReviewCard
              key={`${r.name}-${i}`}
              review={r}
              now={now}
              ariaHidden={i >= ITEMS.length}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function ReviewCard({
  review,
  now,
  ariaHidden,
}: {
  review: TextTestimonial;
  now: number | null;
  ariaHidden: boolean;
}) {
  return (
    <article
      aria-hidden={ariaHidden || undefined}
      className="flex shrink-0 flex-col rounded-2xl border p-5"
      style={{
        borderColor: "var(--line)",
        backgroundColor: "var(--panel)",
        width: "min(78vw, 320px)",
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
          className="h-10 w-10 flex-shrink-0 rounded-full bg-white/10 object-cover"
        />
        <div className="flex flex-1 flex-col">
          <span className="text-[0.875rem] font-medium text-[color:var(--ink)]">
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
        <span className="text-[0.75rem] text-[color:var(--muted)]">
          {now !== null ? relativeDate(review.publishedAt, now) : ""}
        </span>
      </div>
      <p className="mt-3 flex-1 text-[0.9375rem] leading-relaxed text-[color:var(--muted)]">
        “{review.text}”
      </p>
      {review.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {review.tags.map((t) => (
            <span
              key={t}
              className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium text-[color:var(--green-bright)]"
              style={{ backgroundColor: "rgba(89,209,114,.1)" }}
            >
              {t}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}
