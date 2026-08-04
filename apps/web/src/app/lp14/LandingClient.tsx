"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { PATOLOGIAS, openSchedule } from "./config";

const EASE: [number, number, number, number] = [0.23, 1, 0.32, 1];

const MODALIDADES = [
  "Jiu-Jitsu",
  "MMA",
  "Muay Thai",
  "Boxe",
  "Crossfit",
  "Corrida",
  "Musculação",
  "Judô",
];

// Hero-formulário: mesma mecânica que converte na lp5 — grid de patologias
// acima da dobra, tooltip de arranque, timer de inatividade abrindo o popup —
// com a pele escura de esporte da lp14.
//
// A entrada desta dobra é CSS puro (classes lp14-fade*): com Framer o HTML do
// servidor chega com opacity 0 e o hero só aparece depois do JS hidratar —
// péssimo em 3G/in-app browser, que é de onde vem o tráfego de anúncio.
function Hero() {
  const [selected, setSelected] = useState<Set<string>>(() => new Set(["Dores"]));
  const [showTooltip, setShowTooltip] = useState(false);
  const reduceMotion = useReducedMotion();

  const hasInteracted = useRef(false);
  const hasAutoOpened = useRef(false);
  const inactivityTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasInteracted.current) setShowTooltip(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const resetInactivityTimer = useCallback(() => {
    if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
  }, []);

  useEffect(() => () => resetInactivityTimer(), [resetInactivityTimer]);

  // Igual à lp5: marcou sintoma e parou 3s → o popup abre sozinho, uma vez só.
  const startInactivityTimer = useCallback(
    (currentSelected: Set<string>) => {
      resetInactivityTimer();
      if (currentSelected.size === 0 || hasAutoOpened.current) return;
      inactivityTimer.current = setTimeout(() => {
        if (hasAutoOpened.current) return;
        hasAutoOpened.current = true;
        openSchedule({
          patologias: Array.from(currentSelected),
          origem: "inatividade",
        });
      }, 3000);
    },
    [resetInactivityTimer],
  );

  const toggle = useCallback(
    (patologia: string) => {
      hasInteracted.current = true;
      setShowTooltip(false);
      setSelected((prev) => {
        const next = new Set(prev);
        if (next.has(patologia)) next.delete(patologia);
        else next.add(patologia);
        startInactivityTimer(next);
        return next;
      });
    },
    [startInactivityTimer],
  );

  const handleCta = useCallback(() => {
    hasAutoOpened.current = true;
    resetInactivityTimer();
    openSchedule({ patologias: Array.from(selected), origem: "hero" });
  }, [selected, resetInactivityTimer]);

  const ativo = selected.size > 0;

  return (
    <section className="relative overflow-hidden">
      {/* Fundo: brilho verde baixo, clima de ginásio sob holofote. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 70% at 50% 112%, var(--green-glow) 0%, rgba(11,13,11,0) 55%), radial-gradient(90% 55% at 50% -10%, rgba(89,209,114,.07) 0%, rgba(11,13,11,0) 60%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(var(--ink) 1px, transparent 1px), linear-gradient(90deg, var(--ink) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage: "radial-gradient(80% 60% at 50% 30%, black, transparent)",
        }}
      />

      <div className="relative z-10 mx-auto flex w-full max-w-xl flex-col px-5 pb-10 pt-7 sm:py-14">
        {/* Cabeçalho */}
        <header className="mb-6 text-center sm:mb-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.svg"
            alt="Click Cannabis"
            width={180}
            height={26}
            fetchPriority="high"
            decoding="async"
            className="lp14-fade mx-auto mb-6 h-[26px] w-auto brightness-0 invert"
          />
          <p
            className="lp14-fade text-[11.5px] font-semibold uppercase tracking-[0.22em] text-[color:var(--green-bright)]"
            style={{ animationDelay: "90ms" }}
          >
            Click Cannabis no esporte
          </p>
          <h1
            className="lp14-fade font-display mt-3 text-[2.1rem] leading-[1.18] sm:text-[2.8rem]"
            style={{ animationDelay: "160ms" }}
          >
            Alta performance
            <br />
            também se
            <br />
            constrói na
            <br />
            <span className="text-[color:var(--green-bright)]">recuperação</span>
          </h1>
          <p
            className="lp14-fade mt-3 text-[14px] text-[color:var(--muted)] sm:text-base"
            style={{ animationDelay: "230ms" }}
          >
            Selecione uma ou mais patologias para ser atendido
          </p>
        </header>

        {/* Grid de patologias */}
        <div className="relative">
          <AnimatePresence>
            {showTooltip && (
              <motion.div
                initial={{ opacity: 0, y: reduceMotion ? 0 : 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: EASE }}
                className="absolute inset-x-0 -top-11 z-20 flex justify-center"
              >
                <div className="relative rounded-lg bg-[color:var(--green-500)] px-4 py-2 text-sm font-medium text-white shadow-lg">
                  Selecione uma das patologias para iniciar
                  <div className="absolute -bottom-1.5 left-1/2 size-3 -translate-x-1/2 rotate-45 bg-[color:var(--green-500)]" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-2 gap-2 sm:gap-2.5" role="group" aria-label="Patologias">
            {PATOLOGIAS.map((p, i) => {
              const isSelected = selected.has(p);
              return (
                <motion.button
                  key={p}
                  type="button"
                  role="checkbox"
                  aria-checked={isSelected}
                  onClick={() => toggle(p)}
                  whileTap={reduceMotion ? undefined : { scale: 0.97 }}
                  className="lp14-fade-flat flex min-w-0 items-center gap-3 rounded-2xl border px-4 py-3.5 text-left text-[14.5px] font-medium select-none sm:text-[15px]"
                  style={{
                    animationDelay: `${300 + i * 45}ms`,
                    borderColor: isSelected ? "var(--green-500)" : "var(--line)",
                    backgroundColor: isSelected ? "rgba(89,209,114,.12)" : "var(--panel)",
                    color: isSelected ? "var(--ink)" : "var(--muted)",
                    transition:
                      "border-color .15s ease, background-color .15s ease, color .15s ease",
                  }}
                >
                  <span
                    className="flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors"
                    style={{
                      borderColor: isSelected ? "var(--green-500)" : "rgba(154,166,156,.5)",
                      backgroundColor: isSelected ? "var(--green-500)" : "transparent",
                    }}
                    aria-hidden="true"
                  >
                    <AnimatePresence>
                      {isSelected && (
                        <motion.svg
                          width="12"
                          height="12"
                          viewBox="0 0 12 12"
                          fill="none"
                          initial={{ scale: reduceMotion ? 1 : 0.4, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: reduceMotion ? 1 : 0.4, opacity: 0 }}
                          transition={{ type: "spring", stiffness: 420, damping: 26 }}
                        >
                          <path
                            d="M3 6l2 2 4-4"
                            stroke="#fff"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </motion.svg>
                      )}
                    </AnimatePresence>
                  </span>
                  <span className="min-w-0 flex-1 truncate">{p}</span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <motion.button
          type="button"
          onClick={handleCta}
          disabled={!ativo}
          whileTap={reduceMotion || !ativo ? undefined : { scale: 0.98 }}
          className="lp14-fade-flat mt-6 w-full rounded-2xl py-4 text-base font-bold text-white transition-colors sm:mt-8 sm:text-lg"
          style={{
            animationDelay: "700ms",
            backgroundColor: ativo ? "var(--green-500)" : "rgba(154,166,156,.25)",
            color: ativo ? "#fff" : "var(--muted)",
            boxShadow: ativo ? "var(--shadow-float)" : "none",
            cursor: ativo ? "pointer" : "not-allowed",
          }}
        >
          Iniciar meu Tratamento
        </motion.button>

        {/* Badges de segurança — chips claros para as artes originais respirarem no fundo escuro. */}
        <div
          className="lp14-fade mt-5 flex items-center justify-center gap-3 sm:mt-6"
          style={{ animationDelay: "800ms" }}
        >
          {[
            { src: "/1.webp", alt: "Ótimo - Reclame Aqui" },
            { src: "/2.webp", alt: "Certificado RA1000 - Reclame Aqui" },
            { src: "/3.webp", alt: "4.9 Google - Avaliação de pacientes" },
          ].map((b) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={b.src}
              src={b.src}
              alt={b.alt}
              width={120}
              height={60}
              loading="lazy"
              decoding="async"
              className="h-12 w-auto rounded-lg bg-white/95 object-contain p-1"
            />
          ))}
        </div>
      </div>

      <style>{`
        /* Entrada renderizada antes do JS. O fill forwards segura o estado
           final, então elementos com whileTap (transform do Framer) usam a
           variante -flat, só de opacidade, pra não travar o transform. */
        @keyframes lp14FadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes lp14FadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .lp14-fade {
          opacity: 0;
          animation: lp14FadeUp 600ms cubic-bezier(0.23, 1, 0.32, 1) forwards;
        }
        .lp14-fade-flat {
          opacity: 0;
          animation: lp14FadeIn 500ms cubic-bezier(0.23, 1, 0.32, 1) forwards;
        }
        @media (prefers-reduced-motion: reduce) {
          .lp14-fade, .lp14-fade-flat { animation: none; opacity: 1; }
        }
      `}</style>

      {/* Âncora do sticky: quando o hero sai da tela, o CTA fixo entra. */}
      <div id="lp14-hero-end" aria-hidden="true" className="absolute bottom-0 h-px w-px" />
    </section>
  );
}

function Marquee() {
  const reduceMotion = useReducedMotion();
  const faixa = [...MODALIDADES, ...MODALIDADES];

  return (
    <section
      aria-label="Modalidades"
      className="relative overflow-hidden border-y py-4"
      style={{ borderColor: "var(--line)", backgroundColor: "var(--bg-2)" }}
    >
      <div
        className="flex w-max items-center gap-8 whitespace-nowrap"
        style={{
          animation: reduceMotion ? "none" : "lp14-marquee 28s linear infinite",
        }}
      >
        {faixa.map((m, i) => (
          <span
            key={`${m}-${i}`}
            aria-hidden={i >= MODALIDADES.length}
            className="font-display flex items-center gap-8 text-[15px] tracking-[0.08em] text-[color:var(--muted)]"
          >
            {m}
            <svg width="8" height="8" viewBox="0 0 8 8" aria-hidden="true">
              <circle cx="4" cy="4" r="3" fill="var(--green-500)" />
            </svg>
          </span>
        ))}
      </div>
      <style>{`
        @keyframes lp14-marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}

export default function LandingClient() {
  return (
    <>
      <Hero />
      <Marquee />
    </>
  );
}
