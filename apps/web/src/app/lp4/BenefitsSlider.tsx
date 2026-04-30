"use client";

import { useEffect, useRef, useState } from "react";

type Theme = {
  bg: string;
  fg: string;
  fgMuted: string;
  eyebrow: string;
  orb: string;
  isDark: boolean;
};

type Benefit = {
  id: string;
  badge: string;
  title: string;
  body: string;
  theme: Theme;
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
};

const BENEFITS: Benefit[] = [
  {
    id: "cbd",
    badge: "CBD · Cannabidiol",
    title: "Silencia a mente para dormir",
    body: "O canabinoide mais estudado para ansiedade. Reduz a ruminação e os pensamentos acelerados que mantêm você acordado, sem efeito psicoativo nem sonolência diurna.",
    theme: T.sage,
  },
  {
    id: "cbn",
    badge: "CBN · Canabinol",
    title: "O canabinoide do sono profundo",
    body: "Conhecido como “o canabinoide do sono”. O CBN tem ação sedativa natural e age para iniciar o sono mais rápido e prolongar as fases reparadoras do descanso.",
    theme: T.twilight,
  },
  {
    id: "thc",
    badge: "THC · Tetrahidrocanabinol",
    title: "Encurta o tempo até adormecer",
    body: "Em microdoses prescritas pelo médico, o THC reduz a latência do sono — o tempo até pegar no sono — e aprofunda os ciclos N3 de descanso reparador.",
    theme: T.dusk,
  },
  {
    id: "terpenos",
    badge: "Terpenos · Mirceno + Linalol",
    title: "O aroma que relaxa o corpo",
    body: "Mirceno e Linalol — os mesmos compostos da lavanda — agem em sinergia com os canabinoides para relaxar a musculatura e baixar o ritmo cardíaco antes de dormir.",
    theme: T.lavender,
  },
  {
    id: "endocanabinoide",
    badge: "Sistema Endocanabinoide",
    title: "Reajusta seu relógio biológico",
    body: "Os canabinoides interagem com receptores CB1 que regulam o ciclo sono-vigília, ajudando o corpo a reconhecer os horários certos de descanso e energia.",
    theme: T.cream,
  },
  {
    id: "sem-dependencia",
    badge: "Diferencial clínico",
    title: "Sem ressaca medicamentosa",
    body: "Diferente dos hipnóticos tradicionais, a cannabis medicinal não cria dependência química nem deixa aquela sensação de cabeça pesada ao acordar.",
    theme: T.dawn,
  },
];

export default function BenefitsSlider() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const N = BENEFITS.length;

  const dragRef = useRef({
    isDown: false,
    pointerId: null as number | null,
    startX: 0,
    startScrollLeft: 0,
    moved: false,
  });

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

  const goTo = (i: number) => {
    const el = trackRef.current;
    if (!el) return;
    const clamped = Math.max(0, Math.min(N - 1, i));
    const slide = el.children[clamped] as HTMLElement | undefined;
    if (!slide) return;
    const target =
      slide.offsetLeft + slide.clientWidth / 2 - el.clientWidth / 2;
    const maxScroll = el.scrollWidth - el.clientWidth;
    const left = Math.max(0, Math.min(maxScroll, target));
    setActiveIndex(clamped);
    el.scrollTo({ left, behavior: "smooth" });
  };

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
    if (e.pointerType !== "mouse") return;
    if (e.button !== 0) return;
    const el = trackRef.current;
    if (!el) return;
    dragRef.current = {
      isDown: true,
      pointerId: e.pointerId,
      startX: e.clientX,
      startScrollLeft: el.scrollLeft,
      moved: false,
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
  };
  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = dragRef.current;
    if (e.pointerId !== d.pointerId) return;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    d.isDown = false;
    d.pointerId = null;
    if (d.moved) goTo(getActiveIdx());
  };

  return (
    <section className="bg-white py-12 sm:py-20">
      <div className="mx-auto w-full max-w-5xl px-5">
        <header className="mb-8 grid grid-cols-1 gap-3 sm:mb-12 sm:grid-cols-[1fr_auto] sm:items-start sm:gap-x-8 sm:gap-y-2">
          <span className="inline-flex w-fit items-center rounded-full bg-[#e6f2e9] px-3 py-1 text-xs font-medium text-[#2d6e3f] sm:col-start-2 sm:row-start-1 sm:justify-self-end sm:text-sm">
            Ciência
          </span>
          <h2
            className="text-[2rem] font-light leading-[1.05] tracking-tight text-gray-900 sm:col-start-1 sm:row-span-2 sm:row-start-1 sm:text-[3rem]"
            style={{
              fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
            }}
          >
            A ciência do sono restaurador
          </h2>
          <p className="text-xs text-gray-500 sm:col-start-2 sm:row-start-2 sm:text-right sm:text-sm">
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
          className="benefits-track flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            touchAction: "pan-x pan-y",
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
                scrollSnapAlign: "center",
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
            aria-label="Benefício anterior"
            className="flex size-9 items-center justify-center rounded-full bg-gray-100 text-[#285E31] transition-colors duration-150 ease-out hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-gray-100"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
            >
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
                aria-label={`Ir para benefício ${i + 1}`}
                aria-current={activeIndex === i}
                className="h-2 rounded-full transition-all duration-200 ease-out"
                style={{
                  width: activeIndex === i ? "1.5rem" : "0.5rem",
                  backgroundColor:
                    activeIndex === i ? "#285E31" : "#d1d5db",
                }}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => goTo(activeIndex + 1)}
            disabled={activeIndex >= N - 1}
            aria-label="Próximo benefício"
            className="flex size-9 items-center justify-center rounded-full bg-gray-100 text-[#285E31] transition-colors duration-150 ease-out hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-gray-100"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
            >
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
        .benefits-track::-webkit-scrollbar { display: none; }

        .benefit-card {
          box-shadow:
            0 1px 2px rgba(0, 0, 0, 0.04),
            0 12px 32px -16px rgba(15, 23, 42, 0.18);
        }
        .benefit-card[data-dark="true"] {
          box-shadow:
            0 1px 2px rgba(0, 0, 0, 0.2),
            0 18px 40px -18px rgba(8, 12, 36, 0.45);
        }

        @keyframes benefitOrbBreathe {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.06); opacity: 0.92; }
        }
        .benefit-orb {
          animation: benefitOrbBreathe 8s ease-in-out infinite;
          will-change: transform, opacity;
        }
        @media (prefers-reduced-motion: reduce) {
          .benefit-orb { animation: none; }
        }
      `}</style>
    </section>
  );
}

function BenefitCard({ benefit }: { benefit: Benefit }) {
  const { badge, title, body, theme } = benefit;
  return (
    <article
      className="benefit-card relative flex aspect-[4/5] w-full flex-col overflow-hidden rounded-[28px]"
      data-dark={theme.isDark ? "true" : "false"}
      style={{ background: theme.bg, color: theme.fg }}
    >
      {theme.orb && (
        <div
          aria-hidden="true"
          className="benefit-orb pointer-events-none absolute"
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
          <h3
            className="text-[1.65rem] font-light leading-[1.08] tracking-[-0.01em] sm:text-[1.875rem]"
            style={{
              fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
            }}
          >
            {title}
          </h3>
          <p
            className="text-[0.9375rem] leading-relaxed sm:text-[0.975rem]"
            style={{ color: theme.fgMuted }}
          >
            {body}
          </p>
        </div>
      </div>
    </article>
  );
}
