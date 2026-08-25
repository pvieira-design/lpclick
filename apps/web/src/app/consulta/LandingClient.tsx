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
type Goal = { id: string; label: string; patologia: string };

const GOALS: Goal[] = [
  { id: "sono", label: "Dormir melhor", patologia: "Insônia" },
  { id: "relaxar", label: "Relaxar", patologia: "Ansiedade" },
  { id: "dores", label: "Alívio de dores", patologia: "Dores" },
  { id: "humor", label: "Melhorar meu humor", patologia: "Depressão" },
  { id: "foco", label: "Mais foco e concentração", patologia: "TDAH" },
];

const PHONE = "5521993686082";

const LEADS_API_ENDPOINT = "/api/leads";

const EASE: [number, number, number, number] = [0.23, 1, 0.32, 1];
const SPRING = { type: "spring", stiffness: 420, damping: 26 } as const;

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
  const [name, setName] = useState("");
  const [showError, setShowError] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const reduceMotion = useReducedMotion();

  const focusName = useCallback(() => {
    // Espera o painel montar/animar antes de rolar e focar.
    requestAnimationFrame(() => {
      panelRef.current?.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "center",
      });
      inputRef.current?.focus({ preventScroll: true });
    });
  }, [reduceMotion]);

  // Clicar num objetivo já seleciona a patologia e revela o campo de nome ali em cima.
  const chooseGoal = useCallback(
    (g: Goal) => {
      setGoal(g);
      setShowError(false);
      focusName();
      setTimeout(() => {
        sendGTMEvent({
          event: "buttonClick",
          category: "Lead",
          action: "Click",
          label: "Selecionar objetivo - Consulta",
          value: g.patologia,
        });
      }, 0);
    },
    [focusName],
  );

  // CTA inferior/sticky: volta pro hero. Com objetivo escolhido, foca o nome;
  // sem objetivo, mostra a lista de objetivos.
  useEffect(() => {
    const handler = () => {
      if (goal) {
        focusName();
      } else {
        sectionRef.current?.scrollIntoView({
          behavior: reduceMotion ? "auto" : "smooth",
          block: "start",
        });
      }
      setTimeout(() => {
        sendGTMEvent({
          event: "buttonClick",
          category: "Lead",
          action: "Click",
          label: "CTA voltar ao formulário - Consulta",
          value: goal?.patologia ?? "",
        });
      }, 0);
    };
    window.addEventListener("treatment:open", handler);
    return () => window.removeEventListener("treatment:open", handler);
  }, [goal, focusName, reduceMotion]);

  const handleSubmit = useCallback(() => {
    if (!goal) return;
    const trimmed = name.trim();
    if (!trimmed) {
      setShowError(true);
      inputRef.current?.focus();
      return;
    }
    setSubmitted(true);

    const patologias = [goal.patologia];
    const leadData = collectLeadData(trimmed, patologias);

    sendLeadToApi(leadData);
    sendLeadToCrm(trimmed, patologias);

    sendGTMEvent({
      event: "buttonWhatsappClicked",
      category: "Lead",
      action: "Click",
      label: "Falar com o médico - Consulta",
      value: patologias.join(", "),
      leadData,
    });

    const url = buildWhatsAppUrl(trimmed, patologias);
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
    visible: { transition: { staggerChildren: reduceMotion ? 0 : 0.07 } },
  };
  const heroItem: Variants = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
  };

  return (
    <>
      <motion.section
        ref={sectionRef}
        id="consulta-treatment-form"
        className="mx-auto flex w-full max-w-xl flex-col px-5 pt-6 pb-10 sm:py-16"
        variants={heroStagger}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <header className="mb-6 text-center sm:mb-8">
          <motion.div variants={heroItem} className="mx-auto mb-6 w-fit">
            <AnimatedLogo />
          </motion.div>
          <motion.h1
            variants={heroItem}
            className="text-[1.75rem] leading-tight tracking-tight text-gray-900 sm:text-4xl"
            style={{ fontFamily: "var(--font-geist-sans), system-ui, sans-serif" }}
          >
            <span className="font-light">Médicos Prescritores de</span>{" "}
            <span className="font-semibold" style={{ color: "var(--green-700)" }}>
              Cannabis Medicinal
            </span>
          </motion.h1>
          <motion.p
            variants={heroItem}
            className="font-display mt-5 text-[1.35rem] leading-snug text-gray-900 sm:text-2xl"
          >
            Qual é o seu objetivo principal?
          </motion.p>
          <motion.p
            variants={heroItem}
            className="mt-1.5 text-sm text-gray-500 sm:text-base"
          >
            Escolha um e fale com um médico em minutos
          </motion.p>

          {/* Gatilho de disponibilidade (atendimento 24h — mesma promessa do FAQ) */}
          <motion.div
            variants={heroItem}
            className="mt-4 inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[13px] font-semibold sm:text-sm"
            style={{
              borderColor: "#cfe3d3",
              backgroundColor: "var(--green-50)",
              color: "var(--green-900)",
            }}
          >
            <span className="relative flex size-2.5 items-center justify-center" aria-hidden="true">
              <span className="absolute inset-0 animate-ping rounded-full bg-[#3D8F4A] opacity-75" />
              <span className="relative size-2.5 rounded-full bg-[#3D8F4A]" />
            </span>
            Médicos online agora · consulta ainda hoje
          </motion.div>
        </header>

        {/* Painel de nome — aparece ali em cima assim que um objetivo é escolhido */}
        <AnimatePresence initial={false}>
          {goal && (
            <motion.div
              key="name-panel"
              ref={panelRef}
              initial={{ opacity: 0, height: 0, y: reduceMotion ? 0 : -8 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.3, ease: EASE }}
              className="overflow-hidden"
            >
              <div
                className="mb-5 rounded-[var(--radius-panel)] border-2 p-5 sm:p-6"
                style={{
                  borderColor: "var(--green-500)",
                  backgroundColor: "var(--green-50)",
                  boxShadow: "var(--shadow-card)",
                }}
              >
                <p className="text-[15px] leading-snug text-gray-800">
                  <span className="font-bold">Falta pouco!</span> Diga seu nome e fale
                  agora com um médico sobre{" "}
                  <span className="font-semibold" style={{ color: "var(--green-700)" }}>
                    {goal.label.toLowerCase()}
                  </span>
                  .
                </p>
                <p className="mt-1.5 flex items-center gap-1.5 text-[13px] font-medium" style={{ color: "var(--green-700)" }}>
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <circle cx="8" cy="8" r="6.25" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M8 4.5V8l2.5 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  Horários disponíveis hoje
                </p>

                <label htmlFor="consulta-name" className="mt-4 block text-[15px] text-gray-800">
                  Nome <span className="text-red-500">*</span>
                </label>
                <input
                  id="consulta-name"
                  ref={inputRef}
                  type="text"
                  autoComplete="given-name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (showError && e.target.value.trim()) setShowError(false);
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="Como você se chama?"
                  className="mt-2 w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-base text-gray-900 outline-none transition-colors duration-150 placeholder:text-gray-400 focus:border-[#3a7a4f]"
                  style={{ fontSize: "16px" }}
                />

                <AnimatePresence>
                  {showError && (
                    <motion.p
                      initial={{ opacity: 0, y: reduceMotion ? 0 : -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2, ease: EASE }}
                      className="mt-2 text-sm font-medium text-red-500"
                    >
                      * Escreva o seu nome para continuar
                    </motion.p>
                  )}
                </AnimatePresence>

                <motion.button
                  whileHover={reduceMotion ? undefined : { y: -2, scale: 1.01 }}
                  whileTap={reduceMotion ? undefined : { scale: 0.97 }}
                  type="button"
                  onClick={handleSubmit}
                  className="cta-pulse mt-4 w-full rounded-[var(--radius-btn)] py-4 text-base font-bold text-white sm:text-lg"
                  style={{
                    backgroundColor: "var(--green-500)",
                    boxShadow: "var(--shadow-float)",
                  }}
                >
                  {submitted ? "Abrindo WhatsApp..." : "Falar com médico"}
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Objetivos (seleção única — o clique revela o campo de nome acima) */}
        <div
          className="flex flex-col gap-2.5 sm:gap-3"
          role="radiogroup"
          aria-label="Objetivo principal"
        >
          {GOALS.map((g) => {
            const isSelected = goal?.id === g.id;
            return (
              <motion.button
                key={g.id}
                variants={heroItem}
                whileHover={reduceMotion ? undefined : { y: -2, scale: 1.01 }}
                whileTap={reduceMotion ? undefined : { scale: 0.97 }}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => chooseGoal(g)}
                className="flex w-full items-center justify-center rounded-full border-2 px-5 py-4 text-center text-base font-semibold select-none sm:text-lg"
                style={{
                  borderColor: isSelected ? "var(--green-700)" : "var(--green-500)",
                  backgroundColor: isSelected ? "var(--green-500)" : "var(--green-50)",
                  color: isSelected ? "white" : "var(--green-900)",
                  boxShadow: isSelected ? "var(--shadow-float)" : "var(--shadow-card)",
                  transition:
                    "border-color .15s ease, background-color .15s ease, color .15s ease, box-shadow .2s ease",
                }}
              >
                <span>{g.label}</span>
              </motion.button>
            );
          })}
        </div>

      </motion.section>

    </>
  );
}
