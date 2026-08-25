"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { PATOLOGIAS, openSchedule } from "./config";

const EASE: [number, number, number, number] = [0.23, 1, 0.32, 1];

// Frases de reconhecimento: a pessoa precisa se ver na faixa em 2 segundos.
const SINTOMAS = [
  "Rola na cama por horas",
  "Mente que não desliga",
  "Acorda às 3h da manhã",
  "Sono leve demais",
  "Acorda mais cansado do que deitou",
  "Depende de remédio pra dormir",
  "Ansiedade que aumenta à noite",
  "Cochila de dia, não dorme de noite",
];

// Hero-formulário: mesma mecânica que converte na lp5 — grid de patologias
// acima da dobra (com Insônia já marcada), tooltip de arranque, timer de
// inatividade abrindo o popup.
//
// A entrada desta dobra é CSS puro (classes lp16-fade*): com Framer o HTML do
// servidor chega com opacity 0 e o hero só aparece depois do JS hidratar —
// péssimo em 3G/in-app browser, que é de onde vem o tráfego de anúncio.
function Hero() {
  const [selected, setSelected] = useState<Set<string>>(() => new Set(["Insônia"]));
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

  // Igual à lp5: mexeu no grid e parou 3s → o popup abre sozinho, uma vez só.
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
    <section className="relative overflow-hidden bg-[color:var(--bg)]">
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
            className="lp16-fade mx-auto mb-6 h-[26px] w-auto"
          />
          {/* Topo genérico, como na lp13: quem chega pelo anúncio de insônia já
              encontra a patologia marcada no grid — o recorte da página aparece
              da prova social em diante, não na promessa do título. */}
          <h1
            className="lp16-fade font-display lp16-display-xl text-[2.15rem] leading-[1.08] sm:text-[3rem]"
            style={{ animationDelay: "160ms" }}
          >
            Médicos Prescritores de
            <br />
            <span className="text-[color:var(--green-ink)]">Cannabis Medicinal</span>
          </h1>
          <p
            className="lp16-fade mt-4 text-[14px] leading-relaxed text-[color:var(--muted)] sm:text-base"
            style={{ animationDelay: "230ms" }}
          >
            {/* Espaço inquebrável antes do preço: sem ele a frase quebra logo
                depois de "por" e o R$50 fica sozinho na segunda linha. */}
            <span className="block text-pretty">
              Consulta online com médico especialista por{"\u00A0"}
              <strong className="font-semibold text-[color:var(--ink)]">R$50</strong>.
            </span>
            <span className="mt-1 block">
              Selecione uma ou mais patologias para ser atendido
            </span>
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
                  className="lp16-fade-flat flex min-w-0 items-center gap-3 rounded-2xl border px-4 py-3.5 text-left text-[14.5px] font-medium select-none sm:text-[15px]"
                  style={{
                    animationDelay: `${300 + i * 45}ms`,
                    borderColor: isSelected ? "var(--green-border)" : "var(--line)",
                    backgroundColor: isSelected ? "var(--green-soft)" : "var(--panel)",
                    color: isSelected ? "var(--green-ink)" : "#374151",
                    transition:
                      "border-color .15s ease, background-color .15s ease, color .15s ease",
                  }}
                >
                  <span
                    className="flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors"
                    style={{
                      borderColor: isSelected ? "var(--green-border)" : "#d1d5db",
                      backgroundColor: isSelected ? "var(--green-border)" : "transparent",
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
          className="lp16-fade-flat mt-6 w-full rounded-2xl py-4 text-base font-bold text-white transition-colors sm:mt-8 sm:text-lg"
          style={{
            animationDelay: "700ms",
            backgroundColor: ativo ? "var(--green-500)" : "#c5d4c9",
            color: ativo ? "#fff" : "var(--muted)",
            boxShadow: ativo ? "var(--shadow-float)" : "none",
            cursor: ativo ? "pointer" : "not-allowed",
          }}
        >
          Iniciar meu Tratamento
        </motion.button>

        {/* Badges de segurança — chips claros para as artes originais respirarem no fundo escuro. */}
        <div
          className="lp16-fade mt-5 flex items-center justify-center gap-3 sm:mt-6"
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
              className="h-12 w-auto object-contain"
            />
          ))}
        </div>
      </div>

      <style>{`
        /* Entrada renderizada antes do JS. O fill forwards segura o estado
           final, então elementos com whileTap (transform do Framer) usam a
           variante -flat, só de opacidade, pra não travar o transform. */
        @keyframes lp16FadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes lp16FadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .lp16-fade {
          opacity: 0;
          animation: lp16FadeUp 600ms cubic-bezier(0.23, 1, 0.32, 1) forwards;
        }
        .lp16-fade-flat {
          opacity: 0;
          animation: lp16FadeIn 500ms cubic-bezier(0.23, 1, 0.32, 1) forwards;
        }
        @media (prefers-reduced-motion: reduce) {
          .lp16-fade, .lp16-fade-flat { animation: none; opacity: 1; }
        }
      `}</style>

      {/* Âncora do sticky: quando o hero sai da tela, o CTA fixo entra. */}
      <div id="lp16-hero-end" aria-hidden="true" className="absolute bottom-0 h-px w-px" />
    </section>
  );
}

function Marquee() {
  const reduceMotion = useReducedMotion();
  const faixa = [...SINTOMAS, ...SINTOMAS];

  return (
    <section
      aria-label="Sintomas mais relatados"
      className="relative overflow-hidden border-y py-4"
      style={{ borderColor: "var(--line)", backgroundColor: "var(--bg-2)" }}
    >
      <div
        className="flex w-max items-center gap-8 whitespace-nowrap"
        style={{
          animation: reduceMotion ? "none" : "lp16-marquee 34s linear infinite",
        }}
      >
        {faixa.map((s, i) => (
          <span
            key={`${s}-${i}`}
            aria-hidden={i >= SINTOMAS.length}
            className="flex items-center gap-8 text-[14px] text-[color:var(--muted)]"
          >
            {s}
            <svg width="8" height="8" viewBox="0 0 8 8" aria-hidden="true">
              <circle cx="4" cy="4" r="3" fill="var(--accent)" />
            </svg>
          </span>
        ))}
      </div>
      <style>{`
        @keyframes lp16-marquee {
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
