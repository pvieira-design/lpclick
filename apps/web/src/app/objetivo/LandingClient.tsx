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
import AnimatedLogo from "./AnimatedLogo";

// Ângulo desta LP: a pessoa escolhe um OBJETIVO (não uma patologia). Cada
// objetivo mapeia 1:1 pra patologia que segue pro CRM/WhatsApp — a
// classificação continua idêntica à das outras LPs, só muda a pergunta.
type Goal = {
  id: string;
  label: string;
  hint: string;
  patologia: string;
  icon: React.ReactNode;
};

const ICON = { width: 22, height: 22, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.75, strokeLinecap: "round", strokeLinejoin: "round" } as const;

const GOALS: Goal[] = [
  {
    id: "sono",
    label: "Dormir melhor",
    hint: "Pegar no sono e acordar descansado",
    patologia: "Insônia",
    icon: <svg {...ICON} aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" /></svg>,
  },
  {
    id: "relaxar",
    label: "Relaxar",
    hint: "Menos tensão no dia a dia",
    patologia: "Ansiedade",
    icon: <svg {...ICON} aria-hidden="true"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.5 19 2c1 2 2 4.2 2 8 0 5.5-4.8 10-10 10z" /><path d="M2 21c0-3 1.9-5.5 5.4-6.4" /></svg>,
  },
  {
    id: "dores",
    label: "Alívio de dores",
    hint: "Dores crônicas, musculares ou articulares",
    patologia: "Dores",
    icon: <svg {...ICON} aria-hidden="true"><path d="M2 12h3l2-6 4 12 3-9 2 3h6" /></svg>,
  },
  {
    id: "humor",
    label: "Melhorar meu humor",
    hint: "Mais ânimo e disposição",
    patologia: "Depressão",
    icon: <svg {...ICON} aria-hidden="true"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>,
  },
  {
    id: "foco",
    label: "Mais foco e concentração",
    hint: "Render melhor no trabalho e nos estudos",
    patologia: "TDAH",
    icon: <svg {...ICON} aria-hidden="true"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg>,
  },
];

const PHONE = "5521993686082";

const LEADS_API_ENDPOINT = "/api/leads";

const EASE: [number, number, number, number] = [0.23, 1, 0.32, 1];

type LeadPayload = {
  name: string;
  patologies: string[];
  data: {
    fbclid: string;
    fbp: string;
    fbc: string;
    language: string;
    platform: string;
    referrer: string;
    pageUrl: string;
    utm_term: string;
    userAgent: string;
    appVersion: string;
    utm_medium: string;
    utm_source: string;
    utm_content: string;
    utm_campaign: string;
  };
};

function readCookie(name: string): string {
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
  return match?.[1] ?? "";
}

function readFbclid(): string {
  // URL param tem prioridade; cookie _fbc tem formato "fb.1.{ts}.{fbclid}".
  const fromUrl = new URLSearchParams(window.location.search).get("fbclid");
  if (fromUrl) return fromUrl;
  const fbc = readCookie("_fbc");
  if (!fbc) return "";
  const parts = fbc.split(".");
  return parts.length >= 4 ? parts.slice(3).join(".") : "";
}

function readDeprecatedNav(): { appVersion: string; platform: string } {
  // navigator.appVersion/platform estão deprecated, mas a API backend espera ambos.
  const n = navigator as unknown as { appVersion: string; platform: string };
  return { appVersion: n.appVersion, platform: n.platform };
}

function collectLeadData(name: string, patologies: string[]): LeadPayload {
  const params = new URLSearchParams(window.location.search);
  const { appVersion, platform } = readDeprecatedNav();

  return {
    name,
    patologies,
    data: {
      fbclid: readFbclid(),
      fbp: readCookie("_fbp"),
      fbc: readCookie("_fbc"),
      language: navigator.language,
      platform,
      referrer: document.referrer,
      pageUrl: window.location.href,
      utm_term: params.get("utm_term") ?? "",
      userAgent: navigator.userAgent,
      appVersion,
      utm_medium: params.get("utm_medium") ?? "",
      utm_source: params.get("utm_source") ?? "",
      utm_content: params.get("utm_content") ?? "",
      utm_campaign: params.get("utm_campaign") ?? "",
    },
  };
}

function sendLeadToApi(payload: LeadPayload): void {
  if (!LEADS_API_ENDPOINT) return;
  const body = JSON.stringify(payload);

  // sendBeacon sobrevive à navegação disparada por window.open — preferência nº 1.
  if (typeof navigator.sendBeacon === "function") {
    const blob = new Blob([body], { type: "application/json" });
    if (navigator.sendBeacon(LEADS_API_ENDPOINT, blob)) return;
  }

  // Fallback: fetch com keepalive.
  fetch(LEADS_API_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => {});
}

function buildWhatsAppUrl(name: string, patologias: string[]) {
  const list = patologias.map((p, i) => `${i + 1}. ${p}`).join("\n");
  const text = `Olá, me chamo ${name}.\n\nPatologias selecionadas:\n${list}`;
  return `https://api.whatsapp.com/send/?phone=${PHONE}&text=${encodeURIComponent(text)}&type=phone_number&app_absent=0`;
}

export default function LandingClient() {
  const [goal, setGoal] = useState<Goal | null>(null);
  const [step, setStep] = useState<1 | 2>(1);
  const [name, setName] = useState("");
  const [showError, setShowError] = useState(false);
  const [waUrl, setWaUrl] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const reduceMotion = useReducedMotion();

  const scrollToHero = useCallback(() => {
    sectionRef.current?.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start",
    });
  }, [reduceMotion]);

  // Etapa 1 → 2: clicar no objetivo já define a patologia e troca o painel
  // pelo campo de nome (crossfade no mesmo container, sem modal e sem lista
  // duplicada).
  const chooseGoal = useCallback((g: Goal) => {
    setGoal(g);
    setShowError(false);
    setStep(2);
    setTimeout(() => {
      sendGTMEvent({
        event: "buttonClick",
        category: "Lead",
        action: "Click",
        label: "Selecionar objetivo - Objetivo",
        value: g.patologia,
      });
    }, 0);
  }, []);

  const backToGoals = useCallback(() => {
    setStep(1);
    setShowError(false);
  }, []);

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
      if (goal) setStep(2);
      setTimeout(() => {
        sendGTMEvent({
          event: "buttonClick",
          category: "Lead",
          action: "Click",
          label: "CTA voltar ao formulário - Objetivo",
          value: goal?.patologia ?? "",
        });
      }, 0);
    };
    window.addEventListener("treatment:open", handler);
    return () => window.removeEventListener("treatment:open", handler);
  }, [goal, scrollToHero]);

  const handleSubmit = useCallback(() => {
    if (!goal) return;
    const trimmed = name.trim();
    if (!trimmed) {
      setShowError(true);
      inputRef.current?.focus();
      return;
    }

    const patologias = [goal.patologia];
    const leadData = collectLeadData(trimmed, patologias);

    sendLeadToApi(leadData);
    sendLeadToCrm(trimmed, patologias);

    sendGTMEvent({
      event: "buttonWhatsappClicked",
      category: "Lead",
      action: "Click",
      label: "Falar com o médico - Objetivo",
      value: patologias.join(", "),
      leadData,
    });

    const url = buildWhatsAppUrl(trimmed, patologias);
    // Guarda a URL pra oferecer um link de fallback caso o popup seja bloqueado.
    setWaUrl(url);
    window.open(url, "_blank", "noopener,noreferrer");
  }, [name, goal]);

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
      id="objetivo-treatment-form"
      className="hero-atmosphere scroll-mt-2"
      variants={heroStagger}
      initial="hidden"
      animate="visible"
    >
      <div className="mx-auto flex w-full max-w-xl flex-col px-5 pt-6 pb-10 sm:py-14">
        {/* Header */}
        <header className="mb-6 text-center">
          <motion.div variants={heroItem} className="mx-auto mb-5 w-fit">
            <AnimatedLogo />
          </motion.div>

          {/* Gatilho de disponibilidade (atendimento 24h — mesma promessa do FAQ) */}
          <motion.div
            variants={heroItem}
            className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[13px] font-semibold"
            style={{ borderColor: "#cfe3d3", backgroundColor: "white", color: "var(--green-900)" }}
          >
            <span className="relative flex size-2.5 items-center justify-center" aria-hidden="true">
              <span className="absolute inset-0 animate-ping rounded-full bg-[#3D8F4A] opacity-75" />
              <span className="relative size-2.5 rounded-full bg-[#3D8F4A]" />
            </span>
            Médicos online agora · consulta ainda hoje
          </motion.div>

          <motion.h1
            variants={heroItem}
            className="font-display text-[1.65rem] font-semibold leading-[1.12] sm:text-[2.4rem]"
            style={{ color: "var(--ink)" }}
          >
            Cannabis medicinal com{" "}
            <span style={{ color: "var(--green-700)" }}>acompanhamento médico</span>,
            100% online
          </motion.h1>
          <motion.p variants={heroItem} className="mt-3 text-[15px] sm:text-base" style={{ color: "var(--muted)" }}>
            Consulta por R$50 com médicos prescritores. Comece dizendo o que você quer melhorar.
          </motion.p>
        </header>

        {/* Card do fluxo em 2 etapas */}
        <motion.div
          variants={heroItem}
          className="rounded-[var(--radius-panel)] border bg-white p-4 sm:p-6"
          style={{ borderColor: "var(--line)", boxShadow: "var(--shadow-card)" }}
        >
          {/* Indicador de etapa */}
          <div className="mb-4 flex items-center justify-between">
            <p className="font-display text-[1.15rem] font-semibold leading-snug sm:text-xl" style={{ color: "var(--ink)" }}>
              {step === 1 ? "Qual é o seu objetivo principal?" : "Como você se chama?"}
            </p>
            <div className="ml-3 flex shrink-0 items-center gap-1.5" aria-label={`Etapa ${step} de 2`}>
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

          <div className="relative overflow-hidden">
            <AnimatePresence mode="wait" initial={false}>
              {step === 1 ? (
                <motion.div
                  key="step-goals"
                  variants={panel}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  role="radiogroup"
                  aria-label="Objetivo principal"
                  className="flex flex-col gap-2.5"
                >
                  {GOALS.map((g) => {
                    const isSelected = goal?.id === g.id;
                    return (
                      <motion.button
                        key={g.id}
                        whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                        type="button"
                        role="radio"
                        aria-checked={isSelected}
                        onClick={() => chooseGoal(g)}
                        className="group flex min-h-[64px] w-full cursor-pointer items-center gap-3.5 rounded-[var(--radius-card)] border-2 px-4 py-3 text-left select-none transition-[border-color,background-color,box-shadow] duration-150 hover:bg-[var(--green-50)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3a7a4f] focus-visible:ring-offset-2"
                        style={{
                          borderColor: isSelected ? "var(--green-500)" : "var(--line)",
                          backgroundColor: isSelected ? "var(--green-50)" : "white",
                        }}
                      >
                        <span
                          className="flex size-11 shrink-0 items-center justify-center rounded-full transition-colors duration-150 group-hover:bg-[var(--green-100)]"
                          style={{ backgroundColor: isSelected ? "var(--green-100)" : "var(--green-50)", color: "var(--green-700)" }}
                        >
                          {g.icon}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-[15.5px] font-semibold leading-tight sm:text-base" style={{ color: "var(--ink)" }}>
                            {g.label}
                          </span>
                          <span className="mt-0.5 block text-[12.5px] leading-tight sm:text-[13px]" style={{ color: "var(--muted)" }}>
                            {g.hint}
                          </span>
                        </span>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0 transition-transform duration-150 group-hover:translate-x-0.5" style={{ color: "#9CA89F" }}>
                          <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </motion.button>
                    );
                  })}
                </motion.div>
              ) : (
                <motion.div
                  key="step-name"
                  variants={panel}
                  initial="enter"
                  animate="center"
                  exit="exit"
                >
                  {/* Resumo do objetivo escolhido, com troca rápida */}
                  {goal && (
                    <button
                      type="button"
                      onClick={backToGoals}
                      className="flex w-full cursor-pointer items-center gap-3 rounded-[var(--radius-card)] border px-3.5 py-2.5 text-left transition-colors hover:bg-[var(--green-50)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3a7a4f]"
                      style={{ borderColor: "var(--line)" }}
                    >
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-full" style={{ backgroundColor: "var(--green-100)", color: "var(--green-700)" }}>
                        {goal.icon}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[11px] font-medium uppercase tracking-[0.06em]" style={{ color: "var(--muted)" }}>
                          Seu objetivo
                        </span>
                        <span className="block truncate text-[15px] font-semibold" style={{ color: "var(--ink)" }}>
                          {goal.label}
                        </span>
                      </span>
                      <span className="shrink-0 text-[13px] font-semibold underline-offset-2 hover:underline" style={{ color: "var(--green-700)" }}>
                        Trocar
                      </span>
                    </button>
                  )}

                  <label htmlFor="objetivo-name" className="mt-5 block text-[15px]" style={{ color: "var(--ink)" }}>
                    Nome <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="objetivo-name"
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
                    aria-describedby={showError ? "objetivo-name-error" : undefined}
                    className="mt-2 h-12 w-full rounded-lg border bg-white px-4 text-base outline-none transition-colors duration-150 placeholder:text-gray-400 focus:border-[#3a7a4f]"
                    style={{ fontSize: "16px", borderColor: showError ? "#ef4444" : "#d1d5db", color: "var(--ink)" }}
                  />
                  <AnimatePresence>
                    {showError && (
                      <motion.p
                        id="objetivo-name-error"
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

        {/* Micro-garantias sob o card (SVG, sem emoji) */}
        <motion.ul variants={heroItem} className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[12.5px] font-medium sm:text-[13px]" style={{ color: "var(--muted)" }}>
          {[
            "Receita e autorização ANVISA",
            "1º acompanhamento grátis",
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
