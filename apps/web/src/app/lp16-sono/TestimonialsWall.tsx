"use client";

// Depoimentos escritos (dados da lp5) em faixa horizontal — cards lado a lado
// com auto-scroll e arraste. Nesta LP a ordem é por força do relato de sono:
// quem conta que largou o tarja preta ou que voltou a dormir a noite toda abre
// a faixa; os demais depoimentos de insônia vêm em seguida.

import { useEffect, useRef, useState } from "react";
import { TEXT_TESTIMONIALS, type TextTestimonial } from "../lp5/textTestimonials";

// Perfis com nome que soa fake derrubam a credibilidade da faixa.
const NOMES_EXCLUIDOS = new Set(["Jacaré Junior"]);

// Prova mais forte que existe para esta página: trocou o remédio de dormir.
const REMEDIOS = /tarja preta|zolpidem|rivotril|clonazepam|diazepam|frontal|amitriptilina|benzodiazep|remédio para dormir|remédios para dormir|rem[eé]dio pra dormir|indutor/i;

// Relato específico de sono (não só a tag) — "durmo 7 horas", "voltei a dormir".
const SONO_FORTE = /insônia crônica|voltei a dormir|durmo a noite|noite toda|durmo bem|durmo \d|dormir a noite|sono profundo|acordava/i;
const SONO = /dorm|sono|insônia|insonia/i;

const MAX_ITEMS = 18;

// Taxa de desaceleração por milissegundo do arremesso (mesma ordem do scroll
// nativo). Mais perto de 1 = desliza por mais tempo.
const DECELERATION = 0.996;

/** Mantém o offset dentro de uma metade da faixa duplicada, dos dois lados. */
function wrapOffset(off: number, half: number): number {
  if (half <= 0) return off;
  let x = off;
  while (x <= -half) x += half;
  while (x > 0) x -= half;
  return x;
}

/** Velocidade em px/s a partir das amostras recentes do ponteiro. */
function velocityFrom(samples: { x: number; t: number }[]): number {
  if (samples.length < 2) return 0;
  const last = samples[samples.length - 1];
  // ~80ms de janela: pega o flick final mesmo que o dedo tenha parado antes.
  const first = samples.find((s) => last.t - s.t <= 80) ?? samples[0];
  const dt = last.t - first.t;
  if (dt <= 0) return 0;
  return ((last.x - first.x) / dt) * 1000;
}

function score(t: TextTestimonial): number {
  let s = 0;
  if (REMEDIOS.test(t.text)) s += 4;
  if (SONO_FORTE.test(t.text)) s += 3;
  if (SONO.test(t.text)) s += 2;
  if (t.tags.includes("Insônia")) s += 1;
  return s;
}

const ITEMS: TextTestimonial[] = TEXT_TESTIMONIALS.filter(
  (t) => !NOMES_EXCLUIDOS.has(t.name) && (t.tags.includes("Insônia") || SONO.test(t.text)),
)
  // Ordenação estável (índice como desempate) para o HTML do servidor bater
  // com o do cliente.
  .map((t, i) => ({ t, i, s: score(t) }))
  .sort((a, b) => b.s - a.s || a.i - b.i)
  .slice(0, MAX_ITEMS)
  .map(({ t }) => t);

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
  // Últimas amostras do dedo (posição + instante). Sem elas o arraste morre no
  // release; com elas a faixa sai voando na velocidade em que foi solta.
  const samplesRef = useRef<{ x: number; t: number }[]>([]);
  const momentumRef = useRef(0); // px/s, decai até o auto-scroll reassumir

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
      // Um dt grande (aba em segundo plano, jank) daria um salto enorme; 32ms
      // é o teto de um frame lento.
      const dt = Math.min(32, ts - lastTs);
      lastTs = ts;
      const paused = draggingRef.current || hoverPausedRef.current;
      const half = halfWidthRef.current;
      // Com movimento reduzido a faixa não anda sozinha nem desliza depois do
      // gesto: o arraste segue 1:1, e nada se move sem o dedo.
      if (SPEED_PX_PER_S === 0) momentumRef.current = 0;
      if (!paused && half > 0) {
        const momentum = momentumRef.current;
        if (Math.abs(momentum) > SPEED_PX_PER_S) {
          // Desaceleração exponencial, a mesma curva do scroll do iOS: o
          // arremesso continua e vai cedendo lugar ao avanço automático.
          offsetRef.current += (momentum * dt) / 1000;
          momentumRef.current = momentum * Math.pow(DECELERATION, dt);
        } else {
          momentumRef.current = 0;
          offsetRef.current -= (SPEED_PX_PER_S * dt) / 1000;
        }
        offsetRef.current = wrapOffset(offsetRef.current, half);
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

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    pointerDownRef.current = true;
    pointerIdRef.current = e.pointerId;
    draggingRef.current = false;
    dragStartXRef.current = e.clientX;
    dragStartOffsetRef.current = offsetRef.current;
    // Encostar já interrompe o arremesso anterior: a faixa fica sob o dedo no
    // ponto em que estava, sem terminar o movimento antes de obedecer.
    momentumRef.current = 0;
    samplesRef.current = [{ x: e.clientX, t: e.timeStamp }];
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
    offsetRef.current = wrapOffset(
      dragStartOffsetRef.current + delta,
      halfWidthRef.current,
    );
    const samples = samplesRef.current;
    samples.push({ x: e.clientX, t: e.timeStamp });
    if (samples.length > 6) samples.shift();
  };

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerId !== pointerIdRef.current) return;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    // A animação continua na velocidade exata em que o dedo saiu — sem costura
    // entre arrastar e deslizar.
    if (draggingRef.current) momentumRef.current = velocityFrom(samplesRef.current);
    samplesRef.current = [];
    pointerDownRef.current = false;
    pointerIdRef.current = null;
    draggingRef.current = false;
  };

  const loop = doubled ? [...ITEMS, ...ITEMS] : ITEMS;

  return (
    <section id="lp16-testimonials-wall" className="overflow-hidden py-10 sm:py-16">
      <div className="mx-auto mb-6 w-full max-w-xl px-5 text-center sm:mb-10">
        <h2 className="font-display lp16-display-lg text-[1.9rem] leading-[1.1] sm:text-4xl">
          <span>Quem também não dormia</span>{" "}
          <span className="text-[color:var(--green-ink)]">e hoje dorme</span>
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
      className="flex shrink-0 flex-col rounded-2xl border p-5 shadow-sm"
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
          className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-100 object-cover"
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
              className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium text-[color:var(--green-ink)]"
              style={{ backgroundColor: "var(--green-soft)" }}
            >
              {t}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}
