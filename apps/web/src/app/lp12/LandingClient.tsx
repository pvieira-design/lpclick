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
import { getInicioTestimonials } from "./inicioTestimonials";
import InicioReviewCard from "./InicioReviewCard";

const PATOLOGIAS = [
  "Insônia",
  "Ansiedade",
  "Depressão",
  "Dores",
  "Perda de Peso",
  "TDAH",
  "Enxaqueca",
  "Tabagismo",
] as const;

// Na /inicio a pessoa escolhe o objetivo; a classificação enviada aos sistemas
// continua usando a patologia correspondente.
const GOALS = [
  { label: "Dormir melhor", hint: "Pegar no sono e acordar descansado", patologia: "Insônia" },
  { label: "Relaxar", hint: "Menos tensão no dia a dia", patologia: "Ansiedade" },
  { label: "Alívio de dores", hint: "Dores crônicas, musculares ou articulares", patologia: "Dores" },
  { label: "Melhorar meu humor", hint: "Mais ânimo e disposição", patologia: "Depressão" },
  { label: "Mais foco e concentração", hint: "Render melhor no trabalho e nos estudos", patologia: "TDAH" },
] as const;

function GoalIcon({ patologia }: { patologia: string }) {
  const icon = {
    "Insônia": <path d="M16.5 13.5A6.5 6.5 0 0 1 10.5 3a6.7 6.7 0 1 0 6 10.5Z" />,
    "Ansiedade": <><path d="M3 8c2-3 4-3 6 0s4 3 6 0" /><path d="M5 14c2-2 4-2 6 0s4 2 6 0" /></>,
    "Dores": <><path d="M12 19s-7-4.2-7-9a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 4.8-7 9-7 9Z" /><path d="M7 12h2l1.4-2.2 2.2 4.4L14 12h3" /></>,
    "Depressão": <><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4m0-14.2-1.4 1.4M6.3 17.7l-1.4 1.4" /></>,
    "TDAH": <><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="4" /><circle cx="12" cy="12" r="1" /></>,
  }[patologia];

  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" className="size-5" aria-hidden="true">{icon}</svg>;
}

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

export default function LandingClient({ variant }: { variant?: "inicio" }) {
  const isInicio = variant === "inicio";
  const [selected, setSelected] = useState<Set<string>>(() => new Set(isInicio ? [] : ["Insônia"]));
  const [name, setName] = useState("");
  const [showError, setShowError] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [waUrl, setWaUrl] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const inactivityTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasSubmitted = useRef(false);
  const hasDismissedModal = useRef(false);

  const reduceMotion = useReducedMotion();

  const resetInactivityTimer = useCallback(() => {
    if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
  }, []);

  const startInactivityTimer = useCallback((currentSelected: Set<string>) => {
    resetInactivityTimer();
    if (currentSelected.size === 0 || hasSubmitted.current || hasDismissedModal.current) return;
    inactivityTimer.current = setTimeout(() => {
      if (hasSubmitted.current || hasDismissedModal.current) return;
      if (!dialogRef.current?.open && currentSelected.size > 0) {
        dialogRef.current?.showModal();
        requestAnimationFrame(() => inputRef.current?.focus());
        sendGTMEvent({
          event: "buttonClick",
          category: "Lead",
          action: "Click",
          label: "Abrir modal (inatividade) - LP12",
          value: Array.from(currentSelected).join(", "),
        });
      }
    }, 3000);
  }, [resetInactivityTimer]);

  useEffect(() => {
    return () => resetInactivityTimer();
  }, [resetInactivityTimer]);

  const toggle = useCallback((patologia: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(patologia)) next.delete(patologia);
      else next.add(patologia);
      if (!isInicio) startInactivityTimer(next);
      return next;
    });
  }, [isInicio, startInactivityTimer]);

  const lockScroll = useCallback(() => {
    document.body.style.overflow = "hidden";
  }, []);

  const unlockScroll = useCallback(() => {
    document.body.style.overflow = "";
  }, []);

  const openModal = useCallback((initialPathology?: string, replaceSelection = false) => {
    const dialog = dialogRef.current;
    if (!dialog || dialog.open) return;

    if (initialPathology) {
      setSelected((previous) => new Set(replaceSelection ? [initialPathology] : [...previous, initialPathology]));
    }

    // Abre o modal primeiro — resposta visual instantânea.
    dialog.showModal();
    lockScroll();
    resetInactivityTimer();

    // Focus no próximo frame para não competir com o paint do modal.
    requestAnimationFrame(() => inputRef.current?.focus());

    // Analytics fora do caminho crítico.
    setTimeout(() => {
      sendGTMEvent({
        event: "buttonClick",
        category: "Lead",
        action: "Click",
        label: "Abrir modal - LP12",
        value: initialPathology ?? Array.from(selected).join(", "),
      });
    }, 0);
  }, [isInicio, selected, resetInactivityTimer, lockScroll]);

  const chooseGoal = useCallback((patologia: string) => {
    setShowError(false);
    openModal(patologia, true);
    sendGTMEvent({
      event: "buttonClick",
      category: "Lead",
      action: "Click",
      label: "Selecionar objetivo - Inicio",
      value: patologia,
    });
  }, [openModal]);

  const closeModal = useCallback(() => {
    hasDismissedModal.current = true;
    resetInactivityTimer();
    const dialog = dialogRef.current;
    if (dialog?.open) dialog.close();
    setShowError(false);
    unlockScroll();
  }, [unlockScroll, resetInactivityTimer]);

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent<HTMLDialogElement>) => {
      if (e.target === dialogRef.current) closeModal();
    },
    [closeModal],
  );

  useEffect(() => () => unlockScroll(), [unlockScroll]);

  // Bottom CTA asks for an objective before opening the /inicio modal.
  useEffect(() => {
    const handler = () => {
      if (isInicio && selected.size === 0) document.getElementById("lp12-treatment-form")?.scrollIntoView({ behavior: "smooth" });
      else openModal();
    };
    window.addEventListener("treatment:open", handler);
    return () => window.removeEventListener("treatment:open", handler);
  }, [isInicio, openModal, selected]);

  const handleSubmit = useCallback(() => {
    if (selected.size === 0) return;
    const trimmed = name.trim();
    if (!trimmed) {
      setShowError(true);
      inputRef.current?.focus();
      return;
    }
    hasSubmitted.current = true;
    setSubmitted(true);
    resetInactivityTimer();

    const patologias = Array.from(selected);
    const leadData = collectLeadData(trimmed, patologias);

    sendLeadToApi(leadData);
    sendLeadToCrm(trimmed, patologias);

    sendGTMEvent({
      event: "buttonWhatsappClicked",
      category: "Lead",
      action: "Click",
      label: "Falar com o médico - LP12",
      value: patologias.join(", "),
      leadData,
    });

    const url = buildWhatsAppUrl(trimmed, patologias);
    if (isInicio) setWaUrl(url);
    window.open(url, "_blank", "noopener,noreferrer");
  }, [isInicio, name, selected, resetInactivityTimer]);

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

  const nameError = (
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
  );

  const nameField = (
    <>
        {/* Nome */}
        <label htmlFor="lp12-patient-name" className={`${isInicio ? "mt-4 font-medium text-[#263d2d]" : "mt-5 text-gray-800"} block text-[15px]`}>
          Nome <span className="text-red-500">*</span>
        </label>
        {isInicio && nameError}
        <input
          id="lp12-patient-name"
          ref={inputRef}
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (showError && e.target.value.trim()) setShowError(false);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Como você se chama?"
          className={`mt-2 w-full border bg-white px-4 py-3 text-base text-gray-900 outline-none transition-colors duration-150 placeholder:text-gray-400 focus:border-[#3a7a4f] focus:ring-2 focus:ring-[#cde9d1] ${isInicio ? "rounded-2xl border-[#dce8df]" : "rounded-lg border-gray-200"}`}
          style={{ fontSize: "16px" }}
        />

        {!isInicio && nameError}


    </>
  );

  const relevantReviews = isInicio ? getInicioTestimonials(selected) : [];
  const primaryGoal = selected.values().next().value;
  const selectedGoal = GOALS.find((goal) => goal.patologia === primaryGoal);

  return (
    <>
      <motion.section
        id="lp12-treatment-form"
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
            {isInicio ? (
              <>
                <span className="font-light">Comece seu tratamento com</span>{" "}
                <span className="font-semibold" style={{ color: "var(--green-700)" }}>
                  orientação médica
                </span>
              </>
            ) : (
              <>
                <span className="font-light">Médicos Prescritores de</span>{" "}
                <span className="font-semibold" style={{ color: "var(--green-700)" }}>
                  Cannabis Medicinal
                </span>
              </>
            )}
          </motion.h1>
          <motion.p
            variants={heroItem}
            className="mt-3 text-sm text-gray-500 sm:text-base"
          >
            {isInicio
              ? "Consulta online por R$50. Escolha o que você quer melhorar para iniciar seu atendimento."
              : "Selecione o que você quer tratar e fale com um médico em minutos"}
          </motion.p>
        </header>

        {isInicio ? (
          <div>
            <h2 className="font-display mb-4 text-[1.3rem] font-semibold leading-tight text-[#1c4423]">
              Qual é o seu objetivo principal?
            </h2>
            <div role="group" aria-label="Objetivo principal" className="grid gap-2.5">
              {GOALS.map(({ label, hint, patologia }) => (
                <button
                  key={patologia}
                  type="button"
                  aria-pressed={primaryGoal === patologia}
                  onClick={() => chooseGoal(patologia)}
                  className={`group flex min-h-[76px] items-center gap-3 rounded-2xl border px-3.5 py-3 text-left shadow-[0_2px_10px_rgba(28,68,35,0.045)] transition-[border-color,background-color,box-shadow,transform] hover:-translate-y-0.5 hover:border-[#8fba97] hover:bg-[#fbfdfb] hover:shadow-[0_5px_18px_rgba(28,68,35,0.09)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3d8f4a] ${primaryGoal === patologia ? "border-[#3d8f4a] bg-[#f5faf6]" : "border-[#e0e9e2] bg-white"}`}
                >
                  <span className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${primaryGoal === patologia ? "bg-[#d8ebdc] text-[#1c6b32]" : "bg-[#edf5ef] text-[#3c8150]"}`}>
                    <GoalIcon patologia={patologia} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[14px] font-semibold leading-tight text-[#263d2d]">{label}</span>
                    <span className="mt-1 block text-[11px] leading-tight text-[#69766d]">{hint}</span>
                  </span>
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#f0f6f1] text-[#285e31] transition-colors group-hover:bg-[#dceee0]" aria-hidden="true">
                    <svg className="size-4" viewBox="0 0 20 20" fill="none"><path d="m7 4 6 6-6 6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
        {/* Pathology Grid */}
        <div className="relative">
          <div className={isInicio ? "grid grid-cols-1 gap-1.5" : "grid grid-cols-2 gap-2 sm:gap-3"} role="group" aria-label={isInicio ? "Objetivos" : "Patologias"}>
            {(isInicio ? GOALS : PATOLOGIAS.map((patologia) => ({ label: patologia, hint: "", patologia }))).map(({ label, hint, patologia: p }) => {
              const isSelected = selected.has(p);
              return (
                <motion.button
                  key={p}
                  variants={heroItem}
                  whileHover={reduceMotion ? undefined : { y: -2, scale: 1.01 }}
                  whileTap={reduceMotion ? undefined : { scale: 0.97 }}
                  type="button"
                  role="checkbox"
                  aria-checked={isSelected}
                  onClick={() => isInicio ? openModal(p) : toggle(p)}
                  className={`flex min-w-0 items-center text-left select-none ${isInicio ? "min-h-[54px] gap-3 rounded-[15px] border px-3 py-2" : "gap-3 rounded-[var(--radius-card)] border-2 px-4 py-3.5 text-[0.9rem] font-medium sm:text-base"}`}
                  style={{
                    borderColor: isSelected ? "var(--green-500)" : "var(--line)",
                    backgroundColor: isSelected ? "var(--green-50)" : "white",
                    color: isSelected ? "var(--green-900)" : "#374151",
                    boxShadow: isSelected ? "var(--shadow-card)" : "none",
                    transition:
                      "border-color .15s ease, background-color .15s ease, color .15s ease, box-shadow .2s ease",
                  }}
                >
                  {/* Custom checkbox circle */}
                  <span
                    className={`flex shrink-0 items-center justify-center rounded-full border-2 transition-all duration-150 ease-out ${isInicio ? "size-[18px]" : "size-5"}`}
                    style={{
                      borderColor: isSelected ? "var(--green-500)" : "#d1d5db",
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
                          transition={SPRING}
                        >
                          <path
                            d="M3 6l2 2 4-4"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </motion.svg>
                      )}
                    </AnimatePresence>
                  </span>
                  {isInicio ? (
                    <>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[13px] font-semibold leading-tight text-[#35443a]">{label}</span>
                        <span className="mt-0.5 block text-[11px] leading-tight text-[#69766d]">{hint}</span>
                      </span>
                      <svg className="size-4 shrink-0 text-[#415b49]" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                        <path d="M3.5 10h12m-5-5 5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </>
                  ) : (
                    <span className="min-w-0 flex-1 leading-tight">{label}</span>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* CTA Button */}
        <motion.button
          variants={heroItem}
          whileHover={reduceMotion || (!isInicio && selected.size === 0) ? undefined : { y: -2, scale: 1.01 }}
          whileTap={reduceMotion || (!isInicio && selected.size === 0) ? undefined : { scale: 0.97 }}
          type="button"
          onClick={() => openModal()}
          disabled={!isInicio && selected.size === 0}
          data-hero-cta={isInicio ? "inicio" : undefined}
          className={`mt-6 w-full rounded-[var(--radius-btn)] py-4 text-base font-bold text-white sm:mt-8 sm:text-lg ${isInicio || selected.size > 0 ? "cta-pulse" : ""}`}
          style={{
            backgroundColor: isInicio || selected.size > 0 ? "var(--green-500)" : "#c5d4c9",
            cursor: isInicio || selected.size > 0 ? "pointer" : "not-allowed",
            boxShadow: isInicio || selected.size > 0 ? "var(--shadow-float)" : "none",
            transition: "background-color .15s ease, box-shadow .2s ease",
          }}
        >
          {isInicio ? "Agendar minha consulta" : "Iniciar meu Tratamento"}
        </motion.button>

          </>
        )}

        {/* Badges de segurança da LP12 original */}
        {!isInicio && <motion.div
          variants={heroItem}
          className="mt-14 flex items-center justify-center gap-4 sm:mt-16"
        >
          <img src="/1.webp" alt="Ótimo - Reclame Aqui" width={120} height={60} loading="lazy" decoding="async" className="h-12 w-auto object-contain mix-blend-multiply" />
          <img src="/2.webp" alt="Certificado RA1000 - Reclame Aqui" width={120} height={60} loading="lazy" decoding="async" className="h-12 w-auto object-contain mix-blend-multiply" />
          <img src="/3.webp" alt="4.9 Google - Avaliação de pacientes" width={120} height={60} loading="lazy" decoding="async" className="h-12 w-auto object-contain mix-blend-multiply" />
        </motion.div>}
      </motion.section>

      {/* Modal */}
      <dialog
        ref={dialogRef}
        aria-labelledby={isInicio ? "inicio-dialog-title" : undefined}
        onClose={closeModal}
        onClick={handleBackdropClick}
        className={`max-h-[calc(100dvh-2.5rem)] w-[calc(100%-2.5rem)] ${isInicio ? "max-w-3xl" : "max-w-md"} overflow-hidden rounded-3xl border-0 bg-white p-0 shadow-2xl backdrop:bg-black/50`}
      >
        <div className="flex max-h-[inherit] flex-col">
        <div className={`flex-1 overflow-y-auto overscroll-contain ${isInicio ? "px-4 pt-4 pb-3 sm:px-6 sm:pt-6" : "px-6 pt-6 pb-4"}`}>
        {isInicio ? (
          <header className="border-b border-[#e5eae6] pb-3">
            <div className="flex items-center justify-between gap-3">
              <span className="inline-flex rounded-full bg-[#cde9d1] px-3 py-1 text-xs font-medium text-[#285e31]">Atendimento</span>
              <button type="button" onClick={closeModal} aria-label="Fechar" className="-mr-1 flex size-9 shrink-0 items-center justify-center rounded-full text-[#66776a] hover:bg-[#f1f8f2] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3d8f4a]">
                <svg viewBox="0 0 20 20" fill="none" className="size-5" aria-hidden="true"><path d="m5 5 10 10M15 5 5 15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
              </button>
            </div>
            <h2 id="inicio-dialog-title" className="font-display mt-2 text-[1.7rem] font-medium leading-tight text-gray-900 sm:text-[2rem]">Como você se chama?</h2>
          </header>
        ) : (
        <>
        {/* Header ilustrado */}
        <div className="overflow-hidden rounded-2xl" style={{ backgroundColor: "var(--green-50)" }}>
          <div className="flex items-center gap-2 bg-[#cfe3d3] px-3.5 py-2.5">
            <span className="size-2.5 rounded-full bg-[#ef4444]" />
            <span className="size-2.5 rounded-full bg-[#f5c542]" />
            <span className="size-2.5 rounded-full bg-[#22c55e]" />
            <svg width="16" height="14" viewBox="0 0 16 14" fill="none" className="ml-1.5 text-[#285E31]/70" aria-hidden="true">
              <rect x="1" y="1" width="14" height="12" rx="2" stroke="currentColor" strokeWidth="1.25" />
              <path d="M6 1v12" stroke="currentColor" strokeWidth="1.25" />
            </svg>
            <div className="ml-1 flex items-center gap-1 text-[#285E31]/70">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M7.5 3L4.5 6l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M4.5 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="ml-2 text-[#285E31]/70" aria-hidden="true">
              <path d="M7 1l5 2v4c0 3-2.5 5.5-5 6-2.5-.5-5-3-5-6V3l5-2z" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round" />
            </svg>
            <div className="ml-auto h-4 w-28 rounded-sm bg-white/50" />
          </div>
          <div className="px-5 py-6 text-center">
            <div className="mb-3 flex items-center justify-center gap-1.5">
              <span className="flex size-9 items-center justify-center rounded-full" style={{ backgroundColor: "var(--green-700)" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle cx="12" cy="8" r="3.5" stroke="white" strokeWidth="1.5" />
                  <path d="M5.5 20c.5-3.5 3.5-6 6.5-6s6 2.5 6.5 6" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </span>
              <span className="flex size-9 items-center justify-center rounded-full bg-[#f5d742]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M12 3v18M5 8l14 8M5 16l14-8" stroke="#285E31" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </span>
            </div>
            <p className="text-[15px] leading-snug text-gray-800">
              <span className="font-bold">Falta pouco</span> para você iniciar sua jornada com a Click Cannabis!
            </p>
          </div>
        </div>
        </>
        )}

        {!isInicio && nameField}

        {isInicio ? (
          <>
            {nameField}
            {selectedGoal && (
              <div className="mt-4 flex items-center gap-3 rounded-2xl border border-[#d7e8db] bg-[#f5faf6] px-3 py-2.5">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#dceee0] text-[#285e31]" aria-hidden="true">
                  <GoalIcon patologia={selectedGoal.patologia} />
                </span>
                <span>
                  <span className="block text-[11px] leading-tight text-[#69766d]">Seu objetivo principal</span>
                  <span className="mt-0.5 block text-sm font-semibold leading-tight text-[#1c4423]">{selectedGoal.label}</span>
                </span>
              </div>
            )}
            <motion.button
              whileTap={reduceMotion || selected.size === 0 ? undefined : { scale: 0.98 }}
              type="button"
              onClick={handleSubmit}
              disabled={selected.size === 0}
              className="mt-4 w-full rounded-2xl bg-[#3d8f4a] py-4 text-base font-semibold text-white shadow-[0_8px_20px_rgba(40,94,49,0.18)] transition-colors hover:bg-[#337b40] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#285e31] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-[#9ca3af]"
            >
              {submitted ? "Abrindo WhatsApp..." : "Continuar pelo WhatsApp"}
            </motion.button>
            {waUrl && (
              <p role="status" className="mt-3 text-center text-xs text-[#5b6660]">
                Não abriu? <a href={waUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-[#285e31] underline">Toque aqui</a>
              </p>
            )}
            {relevantReviews.length > 0 && (
              <section className="mt-5 border-t border-[#e5eae6] pt-4" aria-label="Relatos relacionados ao objetivo selecionado">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                  <span className="inline-flex rounded-full bg-[#cde9d1] px-3 py-1 text-xs font-medium text-[#285e31]">Depoimentos</span>
                  <span className="text-xs text-[#748278]">Deslize para ler mais</span>
                </div>
                <div tabIndex={0} className="flex snap-x snap-mandatory items-stretch gap-2 overflow-x-auto pb-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3d8f4a] [scrollbar-width:thin]">
                  {relevantReviews.map((review) => (
                    <div key={review.name} className="w-[calc(100%-2rem)] shrink-0 snap-start sm:w-[calc(50%-0.25rem)]">
                      <InicioReviewCard review={review} compact />
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        ) : (
        <>
        {/* Chips selecionadas */}
        {selected.size > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {Array.from(selected).map((p) => (
              <span
                key={p}
                className="rounded-full px-3 py-1 text-[13px] font-medium"
                style={{ backgroundColor: "var(--green-100)", color: "var(--green-600)" }}
              >
                {p}
              </span>
            ))}
          </div>
        )}

        {/* Lista completa de patologias */}
        <div
          className="mt-5 flex flex-col"
          role="group"
          aria-label="Patologias"
        >
          {[...PATOLOGIAS]
            .sort((a, b) => {
              const aSel = selected.has(a) ? 0 : 1;
              const bSel = selected.has(b) ? 0 : 1;
              return aSel - bSel;
            })
            .map((p) => {
              const isSelected = selected.has(p);
              return (
                <button
                  key={p}
                  type="button"
                  role="checkbox"
                  aria-checked={isSelected}
                  onClick={() => toggle(p)}
                  className="flex items-center gap-3 py-2.5 text-left text-[15px] text-gray-700 transition-colors hover:text-gray-900 select-none"
                >
                  <span
                    className="flex size-5 shrink-0 items-center justify-center rounded-[6px] border-[1.5px] transition-colors"
                    style={{
                      borderColor: isSelected ? "var(--green-500)" : "#d1d5db",
                      backgroundColor: isSelected ? "var(--green-500)" : "transparent",
                    }}
                    aria-hidden="true"
                  >
                    {isSelected && (
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M3 6l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </span>
                  {p}
                </button>
              );
            })}
        </div>
        </>
        )}

        </div>

        {/* Ações fixas */}
        {!isInicio && <div className="flex shrink-0 flex-col gap-3 border-t border-gray-100 bg-white px-6 py-4">
          <motion.button
            whileTap={reduceMotion || selected.size === 0 ? undefined : { scale: 0.97 }}
            type="button"
            onClick={handleSubmit}
            disabled={selected.size === 0}
            className="w-full rounded-full py-3.5 text-base font-semibold text-white transition-colors duration-150"
            style={{
              backgroundColor: selected.size > 0 ? "var(--green-700)" : "#9ca3af",
              cursor: selected.size > 0 ? "pointer" : "not-allowed",
            }}
          >
            {submitted ? "Abrindo WhatsApp..." : "Falar com médico"}
          </motion.button>
          <motion.button
            whileTap={reduceMotion ? undefined : { scale: 0.97 }}
            type="button"
            onClick={closeModal}
            className="w-full rounded-full border-[1.5px] bg-white py-3.5 text-base font-semibold transition-colors duration-150 hover:bg-[#f5faf6]"
            style={{ borderColor: "var(--green-700)", color: "var(--green-700)" }}
          >
            Voltar a página inicial
          </motion.button>
        </div>}
        </div>
      </dialog>
    </>
  );
}
