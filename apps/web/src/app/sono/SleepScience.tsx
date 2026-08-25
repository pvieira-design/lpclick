"use client";

// "A ciência do sono restaurador" — o conteúdo e os temas dos cards vieram do
// BenefitsSlider da lp4, que é o material mais forte de insônia do projeto. A
// mecânica de scroll com snap por arraste é a mesma.

import { useEffect, useRef, useState } from "react";

type Theme = {
  bg: string;
  fg: string;
  fgMuted: string;
  eyebrow: string;
  orb: string;
  isDark: boolean;
};

// Cada tema usa multi-camada: radial complementar (canto oposto ao orb) +
// radial análogo (mid-shadow) + base linear de 4-5 stops em ângulo variado.
// O orb (animado, no topo) é a "fonte de luz" principal.
const T: Record<string, Theme> = {
  sage: {
    bg: `
      radial-gradient(ellipse 70% 55% at 0% 100%, rgba(248, 196, 178, 0.55) 0%, rgba(248, 196, 178, 0) 60%),
      radial-gradient(ellipse 60% 50% at 100% 0%, rgba(168, 222, 184, 0.65) 0%, rgba(168, 222, 184, 0) 55%),
      radial-gradient(ellipse 90% 70% at 30% 60%, rgba(196, 220, 200, 0.5) 0%, rgba(196, 220, 200, 0) 70%),
      linear-gradient(150deg, #e2eee2 0%, #cfe1d2 30%, #b6d2bd 60%, #a8c4b0 85%, #b8c8a8 100%)
    `,
    fg: "#1B2F22",
    fgMuted: "rgba(27, 47, 34, 0.72)",
    eyebrow: "#2D6E3F",
    orb: "radial-gradient(closest-side, rgba(140, 220, 165, 0.65), rgba(140, 220, 165, 0))",
    isDark: false,
  },
  twilight: {
    bg: `
      radial-gradient(ellipse 110% 80% at 95% -10%, rgba(178, 200, 240, 0.32) 0%, rgba(178, 200, 240, 0.14) 28%, rgba(178, 200, 240, 0.04) 55%, rgba(178, 200, 240, 0) 80%),
      radial-gradient(ellipse 95% 70% at 5% 105%, rgba(220, 150, 110, 0.16) 0%, rgba(220, 150, 110, 0.04) 45%, rgba(220, 150, 110, 0) 70%),
      radial-gradient(ellipse 130% 90% at 50% 130%, rgba(98, 120, 220, 0.22) 0%, rgba(98, 120, 220, 0) 70%),
      linear-gradient(160deg, #060a22 0%, #0f1640 25%, #181f54 50%, #222b6c 75%, #2c3680 100%)
    `,
    fg: "#F4F7FF",
    fgMuted: "rgba(244, 247, 255, 0.7)",
    eyebrow: "#A8BCFF",
    orb: "",
    isDark: true,
  },
  dusk: {
    bg: `
      radial-gradient(ellipse 110% 80% at 95% -10%, rgba(220, 165, 240, 0.4) 0%, rgba(220, 165, 240, 0.18) 28%, rgba(220, 165, 240, 0.05) 55%, rgba(220, 165, 240, 0) 80%),
      radial-gradient(ellipse 95% 70% at 5% 105%, rgba(248, 178, 130, 0.18) 0%, rgba(248, 178, 130, 0.05) 45%, rgba(248, 178, 130, 0) 70%),
      radial-gradient(ellipse 120% 85% at 30% 30%, rgba(85, 50, 150, 0.45) 0%, rgba(85, 50, 150, 0.1) 50%, rgba(85, 50, 150, 0) 75%),
      linear-gradient(155deg, #120726 0%, #20113e 25%, #321a60 50%, #44247a 75%, #563096 100%)
    `,
    fg: "#F8F3FF",
    fgMuted: "rgba(248, 243, 255, 0.7)",
    eyebrow: "#D2BCFF",
    orb: "",
    isDark: true,
  },
  lavender: {
    bg: `
      radial-gradient(ellipse 70% 55% at 0% 100%, rgba(252, 215, 200, 0.6) 0%, rgba(252, 215, 200, 0) 65%),
      radial-gradient(ellipse 55% 45% at 100% 0%, rgba(190, 158, 235, 0.55) 0%, rgba(190, 158, 235, 0) 60%),
      radial-gradient(ellipse 80% 60% at 50% 60%, rgba(178, 188, 230, 0.35) 0%, rgba(178, 188, 230, 0) 70%),
      linear-gradient(150deg, #efe6f8 0%, #ddd0ec 30%, #c8b4e2 60%, #b8a4d6 85%, #d4b8c8 100%)
    `,
    fg: "#26203A",
    fgMuted: "rgba(38, 32, 58, 0.72)",
    eyebrow: "#5B4694",
    orb: "radial-gradient(closest-side, rgba(255, 218, 200, 0.7), rgba(255, 218, 200, 0))",
    isDark: false,
  },
  cream: {
    bg: `
      radial-gradient(ellipse 70% 55% at 0% 100%, rgba(168, 200, 168, 0.5) 0%, rgba(168, 200, 168, 0) 60%),
      radial-gradient(ellipse 55% 45% at 100% 0%, rgba(240, 180, 120, 0.6) 0%, rgba(240, 180, 120, 0) 60%),
      radial-gradient(ellipse 85% 65% at 35% 50%, rgba(245, 220, 175, 0.55) 0%, rgba(245, 220, 175, 0) 70%),
      linear-gradient(155deg, #faf3dc 0%, #f4dfb6 30%, #eccc94 60%, #e2b876 85%, #d8a060 100%)
    `,
    fg: "#36280F",
    fgMuted: "rgba(54, 40, 15, 0.72)",
    eyebrow: "#8A6B33",
    orb: "radial-gradient(closest-side, rgba(255, 210, 145, 0.65), rgba(255, 210, 145, 0))",
    isDark: false,
  },
  dawn: {
    bg: `
      radial-gradient(ellipse 70% 55% at 0% 100%, rgba(244, 196, 200, 0.55) 0%, rgba(244, 196, 200, 0) 65%),
      radial-gradient(ellipse 55% 45% at 100% 0%, rgba(252, 222, 188, 0.7) 0%, rgba(252, 222, 188, 0) 60%),
      radial-gradient(ellipse 80% 60% at 50% 60%, rgba(190, 212, 232, 0.45) 0%, rgba(190, 212, 232, 0) 70%),
      linear-gradient(160deg, #e3edf6 0%, #d2e0ee 30%, #bcd0e4 60%, #c4c4d8 85%, #d6bcc8 100%)
    `,
    fg: "#1B2A3A",
    fgMuted: "rgba(27, 42, 58, 0.72)",
    eyebrow: "#3F6A99",
    orb: "radial-gradient(closest-side, rgba(255, 232, 200, 0.75), rgba(255, 232, 200, 0))",
    isDark: false,
  },
  mint: {
    bg: `
      radial-gradient(ellipse 70% 55% at 0% 100%, rgba(255, 218, 195, 0.55) 0%, rgba(255, 218, 195, 0) 60%),
      radial-gradient(ellipse 60% 50% at 100% 0%, rgba(168, 232, 220, 0.65) 0%, rgba(168, 232, 220, 0) 55%),
      radial-gradient(ellipse 90% 70% at 30% 60%, rgba(196, 230, 218, 0.5) 0%, rgba(196, 230, 218, 0) 70%),
      linear-gradient(150deg, #e3f4ec 0%, #cee6dc 30%, #b4d7c8 60%, #a4c5b9 85%, #b4cabd 100%)
    `,
    fg: "#1B2F2A",
    fgMuted: "rgba(27, 47, 42, 0.72)",
    eyebrow: "#2C7361",
    orb: "radial-gradient(closest-side, rgba(150, 220, 200, 0.65), rgba(150, 220, 200, 0))",
    isDark: false,
  },
  coral: {
    bg: `
      radial-gradient(ellipse 70% 55% at 0% 100%, rgba(255, 198, 218, 0.55) 0%, rgba(255, 198, 218, 0) 65%),
      radial-gradient(ellipse 55% 45% at 100% 0%, rgba(255, 178, 130, 0.7) 0%, rgba(255, 178, 130, 0) 60%),
      radial-gradient(ellipse 80% 60% at 50% 60%, rgba(252, 220, 195, 0.5) 0%, rgba(252, 220, 195, 0) 70%),
      linear-gradient(160deg, #fde7dd 0%, #fad1bd 30%, #f4b696 60%, #ec9c7c 85%, #d97f64 100%)
    `,
    fg: "#3a1b14",
    fgMuted: "rgba(58, 27, 20, 0.72)",
    eyebrow: "#a04428",
    orb: "radial-gradient(closest-side, rgba(255, 215, 175, 0.75), rgba(255, 215, 175, 0))",
    isDark: false,
  },
};

type Benefit = {
  id: string;
  badge: string;
  title: string;
  body: string;
  theme: Theme;
};

const BENEFITS: Benefit[] = [
  {
    id: "sono-reparador",
    badge: "Sono profundo · REM",
    title: "Sono mais reparador, não apenas mais longo",
    body: "A maioria dos remédios para dormir induz um sono “pesado” e artificial. Os canabinoides atuam regulando as fases naturais do sono, especialmente o sono profundo e o REM, que são as fases responsáveis pela recuperação física e mental.",
    theme: T.twilight,
  },
  {
    id: "adormecer",
    badge: "CBD · Serotonina",
    title: "Adormecer com mais facilidade",
    body: "A dificuldade para pegar no sono quase sempre vem da “mente acelerada”: pensamentos invasivos, preocupações, sensação de alerta. O CBD interage com receptores de serotonina (5-HT1A) e ajuda a reduzir o cortisol, hormônio do estresse que está alto em quem tem insônia.",
    theme: T.sage,
  },
  {
    id: "menos-despertares",
    badge: "Continuidade · Cortisol",
    title: "Menos despertares durante a noite",
    body: "Acordar 2h, 4h da manhã e não conseguir voltar a dormir é um dos sintomas mais frustrantes da insônia, geralmente ligado à desregulação do ciclo do sono e picos de cortisol. Os canabinoides ajudam o corpo a manter a continuidade do sono ao estabilizar o sistema endocanabinoide.",
    theme: T.dusk,
  },
  {
    id: "ciclo",
    badge: "Ritmo circadiano",
    title: "Regulação do ciclo do sono, não é sedação",
    body: "Remédios como zolpidem te “desligam” à força, mas não tratam a causa da insônia: quando você para, ela volta pior. O CBD atua no sistema endocanabinoide, regulador natural do seu ritmo circadiano. Em vez de forçar o sono, ajuda seu corpo a relembrar como dormir naturalmente.",
    theme: T.cream,
  },
  {
    id: "alternativa",
    badge: "Sem tolerância",
    title: "Alternativa a remédios para dormir tradicionais",
    body: "Zolpidem, trazodona, benzodiazepínicos e até melatonina em altas doses têm limitações sérias: tolerância (você precisa de doses cada vez maiores), dependência, efeitos colaterais cognitivos e, em muitos casos, perda de eficácia depois de meses.",
    theme: T.lavender,
  },
  {
    id: "sem-dependencia",
    badge: "Diferencial clínico",
    title: "Sem dependência química conhecida",
    body: "Benzodiazepínicos como clonazepam e diazepam criam dependência física em poucas semanas. Parar de tomar significa síndrome de abstinência (insônia rebote, ansiedade, tremores). Os canabinoides usados no tratamento, principalmente o CBD, não estão associados a esse tipo de dependência química.",
    theme: T.dawn,
  },
  {
    id: "complementar",
    badge: "Transição gradual",
    title: "Pode complementar o tratamento atual",
    body: "Você não precisa parar tudo do dia para a noite. O médico pode iniciar a cannabis medicinal junto com seu tratamento atual e, conforme você responde, ir ajustando e reduzindo gradualmente a dose do remédio convencional à medida que os canabinoides assumem o trabalho.",
    theme: T.mint,
  },
  {
    id: "ansiedade-sono",
    badge: "Ansiedade + sono",
    title: "Trata ansiedade e sono ao mesmo tempo",
    body: "Mais de 80% dos nossos pacientes têm ansiedade. O ciclo é cruel: você não dorme porque está ansioso, e fica mais ansioso porque não dormiu. Remédios para insônia tratam só o sono. Ansiolíticos tratam só a ansiedade. O CBD age nos dois ao mesmo tempo. É por isso que os pacientes sentem melhora “em camadas”.",
    theme: T.coral,
  },
];

/** Velocidade em px/s a partir das últimas amostras do ponteiro (~80ms). */
function velocityFrom(samples: { x: number; t: number }[]): number {
  if (samples.length < 2) return 0;
  const last = samples[samples.length - 1];
  const first = samples.find((s) => last.t - s.t <= 80) ?? samples[0];
  const dt = last.t - first.t;
  if (dt <= 0) return 0;
  return ((last.x - first.x) / dt) * 1000;
}

/**
 * Onde o gesto pararia sozinho, pela mesma curva de desaceleração exponencial
 * que o scroll do sistema usa (não é a fórmula v²/2a dos livros).
 */
function projectMomentum(velocity: number, decelerationRate = 0.998): number {
  return ((velocity / 1000) * decelerationRate) / (1 - decelerationRate);
}

export default function SleepScience() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const N = BENEFITS.length;

  const dragRef = useRef({
    isDown: false,
    pointerId: null as number | null,
    startX: 0,
    startScrollLeft: 0,
    startIdx: 0,
    moved: false,
    samples: [] as { x: number; t: number }[],
  });

  // rAF da animação de encaixe. Guardado para poder ser cortado no meio: o
  // dedo sempre ganha da animação em curso.
  const animRef = useRef(0);

  const getActiveIdx = () => {
    const el = trackRef.current;
    if (!el) return 0;
    const slides = el.children;
    if (slides.length === 0) return 0;
    const maxScroll = el.scrollWidth - el.clientWidth;
    if (el.scrollLeft <= 1) return 0;
    if (el.scrollLeft >= maxScroll - 1) return slides.length - 1;
    const center = el.scrollLeft + el.clientWidth / 2;
    let bestIdx = 0;
    let bestDist = Infinity;
    for (let i = 0; i < slides.length; i++) {
      const slide = slides[i] as HTMLElement;
      const c = slide.offsetLeft + slide.clientWidth / 2;
      const d = Math.abs(c - center);
      if (d < bestDist) {
        bestDist = d;
        bestIdx = i;
      }
    }
    return bestIdx;
  };

  /** Posição de scroll que centraliza o card i. */
  const scrollLeftFor = (i: number) => {
    const el = trackRef.current;
    if (!el) return 0;
    const slide = el.children[i] as HTMLElement | undefined;
    if (!slide) return el.scrollLeft;
    const target = slide.offsetLeft + slide.clientWidth / 2 - el.clientWidth / 2;
    const maxScroll = el.scrollWidth - el.clientWidth;
    return Math.max(0, Math.min(maxScroll, target));
  };

  /**
   * Encaixa no card com uma mola criticamente amortecida (sem repique), sempre
   * partindo do scroll que está na tela e da velocidade que o dedo tinha. É por
   * isso que não usamos `scrollTo({behavior:"smooth"})`: aquela animação tem
   * duração fixa, ignora a velocidade do gesto e não pode ser agarrada no meio.
   */
  const springTo = (i: number, initialVelocity = 0) => {
    const el = trackRef.current;
    if (!el) return;
    const clamped = Math.max(0, Math.min(N - 1, i));
    setActiveIndex(clamped);
    cancelAnimationFrame(animRef.current);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.scrollLeft = scrollLeftFor(clamped);
      return;
    }

    // response 0.35s, damping 1.0 (o "move/reposition" da Apple, sem overshoot).
    const omega = (2 * Math.PI) / 0.35;
    const k = omega * omega;
    const c = 2 * omega;
    let x = el.scrollLeft;
    let v = initialVelocity;
    let last = performance.now();

    const step = (now: number) => {
      // A medição do alvo fica dentro do loop: se a página reflowar no meio da
      // animação, ela persegue a posição nova em vez de parar no lugar errado.
      const target = scrollLeftFor(clamped);
      const dt = Math.min(0.032, (now - last) / 1000);
      last = now;
      v += (-k * (x - target) - c * v) * dt;
      x += v * dt;
      if (Math.abs(x - target) < 0.5 && Math.abs(v) < 8) {
        el.scrollLeft = target;
        return;
      }
      el.scrollLeft = x;
      animRef.current = requestAnimationFrame(step);
    };
    animRef.current = requestAnimationFrame(step);
  };

  const goTo = (i: number) => springTo(i);

  useEffect(() => () => cancelAnimationFrame(animRef.current), []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        setActiveIndex(getActiveIdx());
      });
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    const el = trackRef.current;
    if (!el) return;
    // Encostar mata a mola em curso: o card fica exatamente onde está na tela e
    // passa a seguir o dedo — nada de esperar a animação terminar.
    cancelAnimationFrame(animRef.current);
    dragRef.current = {
      isDown: true,
      pointerId: e.pointerId,
      startX: e.clientX,
      startScrollLeft: el.scrollLeft,
      startIdx: getActiveIdx(),
      moved: false,
      samples: [{ x: e.clientX, t: e.timeStamp }],
    };
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = dragRef.current;
    if (!d.isDown || e.pointerId !== d.pointerId) return;
    const el = trackRef.current;
    if (!el) return;
    const dx = e.clientX - d.startX;
    if (!d.moved) {
      if (Math.abs(dx) <= 4) return;
      d.moved = true;
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {
        /* noop */
      }
    }
    el.scrollLeft = d.startScrollLeft - dx;
    d.samples.push({ x: e.clientX, t: e.timeStamp });
    if (d.samples.length > 6) d.samples.shift();
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = dragRef.current;
    if (e.pointerId !== d.pointerId) return;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    d.isDown = false;
    d.pointerId = null;
    if (!d.moved) return;

    const el = trackRef.current;
    if (!el) return;

    // Velocidade do dedo em px/s; no scroll o sinal é invertido (arrastar para
    // a esquerda aumenta o scrollLeft).
    const fingerVelocity = velocityFrom(d.samples);
    const scrollVelocity = -fingerVelocity;

    // Encaixa no card mais perto de onde o gesto *ia parar*, não de onde o dedo
    // soltou: um peteleco forte atravessa mais de um card, como no scroll nativo.
    const projected = el.scrollLeft + projectMomentum(scrollVelocity);
    let bestIdx = d.startIdx;
    let bestDist = Infinity;
    for (let i = 0; i < N; i++) {
      const dist = Math.abs(scrollLeftFor(i) - projected);
      if (dist < bestDist) {
        bestDist = dist;
        bestIdx = i;
      }
    }
    // Um gesto curto e lento não deve trocar de card sem querer.
    const dx = e.clientX - d.startX;
    const slideWidth = (el.children[0] as HTMLElement | undefined)?.clientWidth ?? 320;
    if (
      bestIdx === d.startIdx &&
      Math.abs(dx) > slideWidth * 0.18 &&
      Math.abs(fingerVelocity) < 80
    ) {
      bestIdx = d.startIdx + (dx < 0 ? 1 : -1);
    }
    springTo(bestIdx, scrollVelocity);
  };

  return (
    <section className="py-12 sm:py-20">
      <div className="mx-auto w-full max-w-5xl px-5">
        <header className="mb-8 grid grid-cols-1 gap-3 sm:mb-12 sm:grid-cols-[1fr_auto] sm:items-start sm:gap-x-8 sm:gap-y-2">
          <span
            className="inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-medium text-[color:var(--accent)] sm:col-start-2 sm:row-start-1 sm:justify-self-end sm:text-sm"
            style={{ backgroundColor: "var(--accent-soft)" }}
          >
            Ciência
          </span>
          <h2 className="font-display lp16-display-xl text-[2rem] leading-[1.02] sm:col-start-1 sm:row-span-2 sm:row-start-1 sm:text-[3rem]">
            A ciência do sono restaurador
          </h2>
          <p className="text-xs text-[color:var(--muted)] sm:col-start-2 sm:row-start-2 sm:text-right sm:text-sm">
            Como a cannabis medicinal atua em cada etapa do descanso.
          </p>
        </header>
      </div>

      <div className="w-full">
        <div
          ref={trackRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          className="lp16-science-track flex overflow-x-auto overscroll-x-contain"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            touchAction: "pan-y",
            paddingInline: "20px",
            gap: "14px",
          }}
        >
          {BENEFITS.map((b) => (
            <div
              key={b.id}
              style={{
                flexShrink: 0,
                width: "calc(100% - 56px)",
                maxWidth: "360px",
              }}
            >
              <BenefitCard benefit={b} />
            </div>
          ))}
        </div>

        <div className="mx-auto mt-7 flex w-full max-w-5xl items-center justify-center gap-4 px-5 sm:mt-9">
          <button
            type="button"
            onClick={() => goTo(activeIndex - 1)}
            disabled={activeIndex === 0}
            aria-label="Card anterior"
            className="flex size-9 items-center justify-center rounded-full bg-gray-100 text-[color:var(--green-ink)] transition-[background-color,transform] duration-150 ease-out hover:bg-gray-200 active:scale-90 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-gray-100 disabled:active:scale-100"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d="M10 3L5 8l5 5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <div className="flex items-center gap-2">
            {BENEFITS.map((b, i) => (
              <button
                key={b.id}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Ir para o card ${i + 1}`}
                aria-current={activeIndex === i}
                className="h-2 rounded-full transition-all duration-200 ease-out active:scale-125"
                style={{
                  width: activeIndex === i ? "1.5rem" : "0.5rem",
                  backgroundColor:
                    activeIndex === i ? "var(--green-ink)" : "#d1d5db",
                }}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => goTo(activeIndex + 1)}
            disabled={activeIndex >= N - 1}
            aria-label="Próximo card"
            className="flex size-9 items-center justify-center rounded-full bg-gray-100 text-[color:var(--green-ink)] transition-[background-color,transform] duration-150 ease-out hover:bg-gray-200 active:scale-90 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-gray-100 disabled:active:scale-100"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d="M6 3l5 5-5 5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      <style>{`
        .lp16-science-track::-webkit-scrollbar { display: none; }

        .lp16-science-card {
          box-shadow:
            0 1px 2px rgba(0, 0, 0, 0.04),
            0 12px 32px -16px rgba(15, 23, 42, 0.18);
        }
        .lp16-science-card[data-dark="true"] {
          box-shadow:
            0 1px 2px rgba(0, 0, 0, 0.2),
            0 18px 40px -18px rgba(8, 12, 36, 0.45);
        }

        @keyframes lp16OrbBreathe {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.06); opacity: 0.92; }
        }
        .lp16-science-orb {
          animation: lp16OrbBreathe 8s ease-in-out infinite;
          will-change: transform, opacity;
        }
        @media (prefers-reduced-motion: reduce) {
          .lp16-science-orb { animation: none; }
        }
      `}</style>
    </section>
  );
}

function BenefitCard({ benefit }: { benefit: Benefit }) {
  const { badge, title, body, theme } = benefit;
  return (
    <article
      className="lp16-science-card relative flex aspect-[2/3] w-full flex-col overflow-hidden rounded-[28px]"
      data-dark={theme.isDark ? "true" : "false"}
      style={{ background: theme.bg, color: theme.fg }}
    >
      {theme.orb && (
        <div
          aria-hidden="true"
          className="lp16-science-orb pointer-events-none absolute"
          style={{
            width: "70%",
            aspectRatio: "1",
            top: "-16%",
            right: "-22%",
            background: theme.orb,
            filter: "blur(1px)",
          }}
        />
      )}

      <div className="relative z-[1] flex h-full flex-col p-7 sm:p-8">
        <span
          className="inline-flex w-fit items-center text-[11px] font-medium uppercase tracking-[0.16em]"
          style={{ color: theme.eyebrow }}
        >
          {badge}
        </span>

        <div className="mt-auto flex flex-col gap-3.5">
          <h3 className="font-display lp16-display-sm text-[1.65rem] leading-[1.08] sm:text-[1.875rem]">
            {title}
          </h3>
          <p className="text-[13px] leading-relaxed" style={{ color: theme.fgMuted }}>
            {body}
          </p>
        </div>
      </div>
    </article>
  );
}
