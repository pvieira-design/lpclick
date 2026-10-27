"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import { sendGTMEvent } from "@next/third-parties/google";
import { sendLeadToCrm } from "@/lib/crmLead";
import { collectLeadData, sendLeadToApi, buildWhatsAppUrl } from "./lead";
import AnimatedLogo from "./AnimatedLogo";
import { ReviewCard } from "./TestimonialsWall";
import type { ApprovedTestimonial } from "@/lib/approvedTestimonials";
import type { GoalId } from "./testimonialSelection";
import GoalIllustration, { GoalIllustrationStyles, type IllustrationId } from "./GoalIllustration";

// Ângulo desta LP: a pessoa marca um ou mais OBJETIVOS (rótulos do formulário
// atual) em cards 2×4 com mini-ilustração animada. Cada objetivo mapeia pra uma patologia do
// CRM/WhatsApp; objetivos diferentes podem cair na mesma patologia, então a
// lista enviada é deduplicada. `reviews` escolhe a seleção de depoimentos.
type Goal = {
  label: string;
  patologia: string;
  reviews: GoalId | null;
  illustration: IllustrationId;
};

const GOALS: Goal[] = [
  { label: "Melhorar meu sono", patologia: "Insônia", reviews: "sono", illustration: "sono" },
  { label: "Desacelerar a mente", patologia: "Ansiedade", reviews: "relaxar", illustration: "desacelerar" },
  { label: "Regular a ansiedade", patologia: "Ansiedade", reviews: "relaxar", illustration: "ansiedade" },
  { label: "Melhorar a concentração", patologia: "TDAH", reviews: "foco", illustration: "concentracao" },
  { label: "Reduzir o estresse", patologia: "Ansiedade", reviews: "relaxar", illustration: "estresse" },
  { label: "Aliviar dores", patologia: "Dores", reviews: "dores", illustration: "dores" },
  { label: "Mais disposição", patologia: "Depressão", reviews: "humor", illustration: "disposicao" },
  { label: "Aliviar outros sintomas", patologia: "Outros", reviews: null, illustration: "outros" },
];

const EASE: [number, number, number, number] = [0.23, 1, 0.32, 1];

export default function LandingClient({ onGoalChange, goalReviews }: {
  onGoalChange: (goal: GoalId | null) => void;
  goalReviews: ApprovedTestimonial[];
}) {
  // Igual à LP5: começa com o primeiro objetivo marcado.
  const [selected, setSelected] = useState<Set<string>>(() => new Set([GOALS[0].label]));
  const [step, setStep] = useState<1 | 2>(1);
  const [name, setName] = useState("");
  const [showError, setShowError] = useState(false);
  const [waUrl, setWaUrl] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const reduceMotion = useReducedMotion();

  const chosen = GOALS.filter((g) => selected.has(g.label));
  const patologias = [...new Set(chosen.map((g) => g.patologia))];
  const reviewsGoal = chosen.find((g) => g.reviews)?.reviews ?? null;

  const scrollToHero = useCallback(() => {
    sectionRef.current?.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start",
    });
  }, [reduceMotion]);

  const toggle = useCallback((label: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  }, []);

  // Etapa 1 → 2: troca a grade pelo campo de nome (crossfade no mesmo card).
  const goToName = useCallback(() => {
    if (selected.size === 0) return;
    onGoalChange(reviewsGoal);
    setShowError(false);
    setStep(2);
    setTimeout(() => {
      sendGTMEvent({
        event: "buttonClick",
        category: "Lead",
        action: "Click",
        label: "Selecionar objetivo - Especialistas",
        value: patologias.join(", "),
      });
    }, 0);
  }, [selected, onGoalChange, reviewsGoal, patologias]);

  const backToGoals = useCallback(() => {
    setStep(1);
    setShowError(false);
    onGoalChange(null);
  }, [onGoalChange]);

  // Foco no input quando a etapa 2 monta (após a animação de entrada).
  useEffect(() => {
    if (step !== 2) return;
    const id = setTimeout(() => inputRef.current?.focus({ preventScroll: true }), reduceMotion ? 0 : 260);
    return () => clearTimeout(id);
  }, [step, reduceMotion]);

  // CTAs de baixo/sticky: voltam pro hero na etapa em que a pessoa parou.
  useEffect(() => {
    const handler = () => {
      scrollToHero();
      setTimeout(() => {
        sendGTMEvent({
          event: "buttonClick",
          category: "Lead",
          action: "Click",
          label: "CTA voltar ao formulário - Especialistas",
          value: patologias.join(", "),
        });
      }, 0);
    };
    window.addEventListener("treatment:open", handler);
    return () => window.removeEventListener("treatment:open", handler);
  }, [patologias, scrollToHero]);

  const handleSubmit = useCallback(() => {
    if (patologias.length === 0) return;
    const trimmed = name.trim();
    if (!trimmed) {
      setShowError(true);
      inputRef.current?.focus();
      return;
    }

    const leadData = collectLeadData(trimmed, patologias);

    sendLeadToApi(leadData);
    sendLeadToCrm(trimmed, patologias);

    sendGTMEvent({
      event: "buttonWhatsappClicked",
      category: "Lead",
      action: "Click",
      label: "Falar com especialista - Especialistas",
      value: patologias.join(", "),
      leadData,
    });

    const url = buildWhatsAppUrl(trimmed, chosen.map((g) => g.label));
    // Guarda a URL pra oferecer um link de fallback caso o popup seja bloqueado.
    setWaUrl(url);
    window.open(url, "_blank", "noopener,noreferrer");
  }, [name, patologias, chosen]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") handleSubmit();
    },
    [handleSubmit],
  );

  // Entrada do hero: stagger orquestrado (durações curtas — o hero é o LCP).
  const heroStagger: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: reduceMotion ? 0 : 0.06 } },
  };
  const heroItem: Variants = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 14 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } },
  };
  const panel: Variants = {
    enter: { opacity: 0, x: reduceMotion ? 0 : 24 },
    center: { opacity: 1, x: 0, transition: { duration: 0.3, ease: EASE } },
    exit: { opacity: 0, x: reduceMotion ? 0 : -24, transition: { duration: 0.2, ease: EASE } },
  };

  return (
    <motion.section
      ref={sectionRef}
      id="primeiro-passo-treatment-form"
      className="hero-atmosphere scroll-mt-2"
      variants={heroStagger}
      initial="hidden"
      animate="visible"
    >
      <div className="mx-auto flex w-full max-w-xl flex-col gap-5 px-5 py-6 sm:px-8 sm:py-10">
        {/* Header */}
        <header className="text-center">
          <motion.div variants={heroItem} className="mx-auto mb-5 w-fit">
            <AnimatedLogo />
          </motion.div>

          {/* Gatilho de disponibilidade (atendimento 24h — mesma promessa do FAQ) */}
          <motion.div
            variants={heroItem}
            className="mx-auto inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[13px] font-semibold"
            style={{ borderColor: "#cfe3d3", backgroundColor: "white", color: "var(--green-900)" }}
          >
            <span className="relative flex size-2.5 items-center justify-center" aria-hidden="true">
              <span className="absolute inset-0 animate-ping rounded-full bg-[#3D8F4A] opacity-75" />
              <span className="relative size-2.5 rounded-full bg-[#3D8F4A]" />
            </span>
            Especialistas online · atendimento hoje
          </motion.div>

        </header>

        {/* Card do fluxo em 2 etapas */}
        <motion.div
          variants={heroItem}
        >
          <div className="mb-3">
            <p className="font-display text-[1.3rem] font-semibold leading-tight min-[375px]:text-[1.4rem] sm:text-[1.75rem]" style={{ color: "var(--ink)" }}>
              {step === 1 ? "O que você está buscando?" : "Como você se chama?"}
            </p>
            {/* Instrução + indicador de etapa na mesma linha */}
            <div className="mt-2 flex items-center justify-between gap-3">
              <p className="text-[13px]" style={{ color: "var(--muted)" }}>
                {step === 1 ? "Marque uma ou mais opções" : "Último passo para falar com o especialista"}
              </p>
              <div className="flex shrink-0 items-center gap-1.5" aria-label={`Etapa ${step} de 2`}>
                {[1, 2].map((n) => (
                  <span
                    key={n}
                    className="h-1.5 rounded-full transition-all duration-300"
                    style={{
                      width: n === step ? 20 : 8,
                      backgroundColor: n <= step ? "var(--green-500)" : "#d9e3dc",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="relative -mx-5 -mb-12 -mt-5 overflow-hidden px-5 pb-12 pt-5">
            <AnimatePresence mode="wait" initial={false}>
              {step === 1 ? (
                <motion.div
                  key="step-goals"
                  variants={panel}
                  initial="enter"
                  animate="center"
                  exit="exit"
                >
                  <GoalIllustrationStyles />
                  <div className="grid grid-cols-2 gap-2.5 sm:gap-3" role="group" aria-label="Objetivos">
                    {GOALS.map((g) => {
                      const isSelected = selected.has(g.label);
                      return (
                        <button
                          key={g.label}
                          type="button"
                          role="checkbox"
                          aria-checked={isSelected}
                          onClick={() => toggle(g.label)}
                          className="relative flex w-full cursor-pointer flex-col overflow-hidden rounded-2xl border-2 text-center transition-[border-color,background-color,transform] duration-150 ease-out select-none active:scale-[.97] motion-reduce:active:scale-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3a7a4f] focus-visible:ring-offset-2"
                          style={{
                            borderColor: isSelected ? "#3a7a4f" : "#e5e7eb",
                            backgroundColor: isSelected ? "#f0f7f1" : "white",
                          }}
                        >
                          <span
                            className="flex h-[72px] w-full items-center justify-center py-1.5 transition-colors duration-150 sm:h-[104px]"
                            style={{ backgroundColor: isSelected ? "var(--green-100)" : "var(--green-50)" }}
                          >
                            <GoalIllustration id={g.illustration} active={isSelected} />
                          </span>
                          <span
                            className="flex min-h-[2.9rem] items-center justify-center px-2 py-2 text-[13.5px] font-semibold leading-tight sm:text-[15px]"
                            style={{ color: isSelected ? "#1a5c30" : "#374151" }}
                          >
                            {g.label}
                          </span>
                          <span
                            className="absolute right-2 top-2 flex size-5 items-center justify-center rounded-full border-2 bg-white transition-all duration-150 ease-out"
                            style={{
                              borderColor: isSelected ? "#3a7a4f" : "#d1d5db",
                              backgroundColor: isSelected ? "#3a7a4f" : "white",
                            }}
                            aria-hidden="true"
                          >
                            {isSelected && (
                              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                <path d="M3 6l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            )}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <motion.button
                    whileTap={reduceMotion || selected.size === 0 ? undefined : { scale: 0.97 }}
                    type="button"
                    onClick={goToName}
                    disabled={selected.size === 0}
                    className="cta-pulse mt-5 flex h-14 w-full items-center justify-center rounded-full text-base font-bold text-white transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3a7a4f] focus-visible:ring-offset-2 sm:text-lg"
                    style={{
                      backgroundColor: selected.size > 0 ? "var(--green-500)" : "#c5d4c9",
                      cursor: selected.size > 0 ? "pointer" : "not-allowed",
                      boxShadow: selected.size > 0 ? "var(--shadow-float)" : "none",
                    }}
                  >
                    Continuar
                  </motion.button>
                </motion.div>
              ) : (
                <motion.div
                  key="step-name"
                  variants={panel}
                  initial="enter"
                  animate="center"
                  exit="exit"
                >
                  {/* Resumo dos objetivos escolhidos, com troca rápida */}
                  <button
                    type="button"
                    onClick={backToGoals}
                    className="flex w-full cursor-pointer items-start gap-3 rounded-[var(--radius-card)] border px-3.5 py-2.5 text-left transition-colors hover:bg-[var(--green-50)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3a7a4f]"
                    style={{ borderColor: "var(--line)" }}
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block text-[11px] font-medium uppercase tracking-[0.06em]" style={{ color: "var(--muted)" }}>
                        Você busca
                      </span>
                      <span className="mt-1.5 flex flex-wrap gap-1.5">
                        {chosen.map((g) => (
                          <span key={g.label} className="rounded-full px-2.5 py-1 text-[12.5px] font-medium" style={{ backgroundColor: "#e6f2e9", color: "#2d6e3f" }}>
                            {g.label}
                          </span>
                        ))}
                      </span>
                    </span>
                    <span className="shrink-0 pt-0.5 text-[13px] font-semibold underline-offset-2 hover:underline" style={{ color: "var(--green-700)" }}>
                      Trocar
                    </span>
                  </button>

                  <label htmlFor="primeiro-passo-name" className="mt-5 block text-[15px]" style={{ color: "var(--ink)" }}>
                    Nome <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="primeiro-passo-name"
                    ref={inputRef}
                    type="text"
                    autoComplete="given-name"
                    enterKeyHint="send"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (showError && e.target.value.trim()) setShowError(false);
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder="Seu primeiro nome"
                    aria-invalid={showError}
                    aria-describedby={showError ? "primeiro-passo-name-error" : undefined}
                    className="mt-2 h-12 w-full rounded-lg border bg-white px-4 text-base outline-none transition-colors duration-150 placeholder:text-gray-400 focus:border-[#3a7a4f]"
                    style={{ fontSize: "16px", borderColor: showError ? "#ef4444" : "#d1d5db", color: "var(--ink)" }}
                  />
                  <AnimatePresence>
                    {showError && (
                      <motion.p
                        id="primeiro-passo-name-error"
                        role="alert"
                        initial={{ opacity: 0, y: reduceMotion ? 0 : -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2, ease: EASE }}
                        className="mt-2 text-sm font-medium text-red-500"
                      >
                        Escreva o seu nome para continuar
                      </motion.p>
                    )}
                  </AnimatePresence>

                  <motion.button
                    whileHover={reduceMotion ? undefined : { y: -2, scale: 1.01 }}
                    whileTap={reduceMotion ? undefined : { scale: 0.97 }}
                    type="button"
                    onClick={handleSubmit}
                    className="cta-pulse mt-4 flex h-14 w-full cursor-pointer items-center justify-center gap-2.5 rounded-full text-base font-bold text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3a7a4f] focus-visible:ring-offset-2 sm:text-lg"
                    style={{ backgroundColor: "var(--green-500)", boxShadow: "var(--shadow-float)" }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3.1-.2 0-.3 0-.5l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2c0 1.3.9 2.6 1.1 2.8.1.2 1.9 2.9 4.6 4 1.7.7 2.3.8 3.2.7.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3z" />
                    </svg>
                    Falar com um especialista
                  </motion.button>

                  <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-[12.5px]" style={{ color: "var(--muted)" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ color: "var(--green-500)" }}>
                      <path d="M12 2l7 3v6c0 5-3.5 8.5-7 10-3.5-1.5-7-5-7-10V5l7-3z" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
                      <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Sem compromisso. Você conversa primeiro e decide depois.
                  </p>

                  {/* Fallback se o navegador bloquear o popup do WhatsApp */}
                  <AnimatePresence>
                    {waUrl && (
                      <motion.div
                        initial={{ opacity: 0, y: reduceMotion ? 0 : 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25, ease: EASE }}
                        role="status"
                        aria-live="polite"
                        className="mt-4 rounded-[var(--radius-card)] px-4 py-3 text-center text-sm"
                        style={{ backgroundColor: "var(--green-50)", color: "var(--green-900)" }}
                      >
                        Abrindo o WhatsApp...{" "}
                        <a href={waUrl} target="_blank" rel="noopener noreferrer" className="font-semibold underline underline-offset-2" style={{ color: "var(--green-700)" }}>
                          Não abriu? Toque aqui
                        </a>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {step === 2 && reviewsGoal && (
          <section aria-label="Depoimentos relacionados" className="min-w-0">
            <h2 className="font-display text-lg font-semibold" style={{ color: "var(--ink)" }}>
              Depoimentos
            </h2>
            <div tabIndex={0} aria-label="Depoimentos relacionados; deslize para ver mais" className="mt-4 flex gap-3 overflow-x-auto pb-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3a7a4f]">
              {goalReviews.slice(0, 3).map((review) => <ReviewCard key={review.sourceReviewId} review={review} />)}
            </div>
            <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>
              Relatos pessoais. Resultados variam de pessoa para pessoa.
            </p>
          </section>
        )}

        {/* Micro-garantias sob o card (SVG, sem emoji) */}
        <motion.ul variants={heroItem} className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[12.5px] font-medium sm:text-[13px]" style={{ color: "var(--muted)" }}>
          {[
            "100% online",
            "1º retorno grátis",
            "Atendimento 24h",
          ].map((t) => (
            <li key={t} className="flex items-center gap-1.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ color: "var(--green-500)" }}>
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.75" />
                <path d="M8.5 12l2.5 2.5 4.5-5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {t}
            </li>
          ))}
        </motion.ul>
      </div>
    </motion.section>
  );
}
