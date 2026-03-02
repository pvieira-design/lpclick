"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { sendGTMEvent } from "@next/third-parties/google";

const PATOLOGIAS = [
  "Ansiedade",
  "Insônia",
  "Dores",
  "TDAH",
  "Perda de Peso",
  "Obesidade",
  "Alcoolismo",
  "Depressão",
  "Epilepsia",
  "Tabagismo",
  "Autismo",
  "Enxaqueca",
  "Fibromialgia",
  "Parkinson",
] as const;

const PHONE = "5521993686082";

function buildWhatsAppUrl(name: string, patologias: string[]) {
  const list = patologias.map((p, i) => `${i + 1}. ${p}`).join("\n");
  const text = `Olá, me chamo ${name}.\n\nPatologias selecionadas:\n${list}`;
  return `https://api.whatsapp.com/send/?phone=${PHONE}&text=${encodeURIComponent(text)}&type=phone_number&app_absent=0`;
}

export default function LandingPage() {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [showError, setShowError] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [scrolledTop, setScrolledTop] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const inactivityTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasSubmitted = useRef(false);
  const hasInteracted = useRef(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasInteracted.current) setShowTooltip(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const dismissTooltip = useCallback(() => {
    hasInteracted.current = true;
    setShowTooltip(false);
  }, []);

  const resetInactivityTimer = useCallback(() => {
    if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
  }, []);

  const startInactivityTimer = useCallback((currentSelected: Set<string>) => {
    resetInactivityTimer();
    if (currentSelected.size === 0 || hasSubmitted.current) return;
    inactivityTimer.current = setTimeout(() => {
      if (hasSubmitted.current) return;
      if (!dialogRef.current?.open && currentSelected.size > 0) {
        setModalOpen(true);
        dialogRef.current?.showModal();
        setTimeout(() => inputRef.current?.focus(), 100);
        sendGTMEvent({
          event: "formStart",
          category: "Lead",
          action: "FormOpen",
          label: "Modal aberto (inatividade) - LP2",
          value: Array.from(currentSelected).join(", "),
        });
      }
    }, 3000);
  }, [resetInactivityTimer]);

  useEffect(() => {
    return () => resetInactivityTimer();
  }, [resetInactivityTimer]);

  const toggle = useCallback((patologia: string) => {
    dismissTooltip();
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(patologia)) next.delete(patologia);
      else next.add(patologia);
      startInactivityTimer(next);
      return next;
    });
  }, [startInactivityTimer, dismissTooltip]);

  const openModal = useCallback(() => {
    if (selected.size === 0) return;
    resetInactivityTimer();
    setModalOpen(true);
    dialogRef.current?.showModal();
    setTimeout(() => inputRef.current?.focus(), 100);
    sendGTMEvent({
      event: "formStart",
      category: "Lead",
      action: "FormOpen",
      label: "Modal aberto - LP2",
      value: Array.from(selected).join(", "),
    });
  }, [selected, resetInactivityTimer]);

  const closeModal = useCallback(() => {
    setModalOpen(false);
    dialogRef.current?.close();
    setShowError(false);
  }, []);

  const handleSubmit = useCallback(() => {
    const trimmed = name.trim();
    if (!trimmed) {
      setShowError(true);
      inputRef.current?.focus();
      return;
    }
    hasSubmitted.current = true;
    resetInactivityTimer();

    const patologias = Array.from(selected);
    const params = new URLSearchParams(window.location.search);
    const fbclid = document.cookie.match(/(?:^|;\s*)fbclid=([^;]*)/)?.[1] || "";

    sendGTMEvent({
      event: "buttonWhatsappClicked",
      category: "Lead",
      action: "Click",
      label: "Falar com o médico - LP2",
      value: patologias.join(", "),
      leadData: {
        name: trimmed,
        patologies: patologias,
        referrer: document.referrer,
        userAgent: navigator.userAgent,
        language: navigator.language,
        platform: navigator.platform,
        src: params.get("src") || "",
        utm_source: params.get("utm_source") || "",
        utm_medium: params.get("utm_medium") || "",
        utm_content: params.get("utm_content") || "",
        utm_campaign: params.get("utm_campaign") || "",
        utm_term: params.get("utm_term") || "",
        fbclid,
      },
    });

    const url = buildWhatsAppUrl(trimmed, patologias);
    window.open(url, "_blank", "noopener,noreferrer");
  }, [name, selected, resetInactivityTimer]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") handleSubmit();
    },
    [handleSubmit],
  );

  return (
    <>
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95) translateY(8px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .anim-logo {
          opacity: 0;
          animation: fadeInUp 600ms cubic-bezier(0.23, 1, 0.32, 1) forwards;
        }
        .anim-title {
          opacity: 0;
          animation: fadeInUp 600ms cubic-bezier(0.23, 1, 0.32, 1) 120ms forwards;
        }
        .anim-subtitle {
          opacity: 0;
          animation: fadeInUp 600ms cubic-bezier(0.23, 1, 0.32, 1) 220ms forwards;
        }
        .anim-card {
          opacity: 0;
          animation: fadeInUp 500ms cubic-bezier(0.23, 1, 0.32, 1) forwards;
        }
        .anim-btn {
          opacity: 0;
          animation: fadeInUp 500ms cubic-bezier(0.23, 1, 0.32, 1) 1050ms forwards;
        }
        dialog::backdrop {
          background: rgba(0,0,0,0);
          transition: background 200ms ease;
        }
        dialog[open]::backdrop {
          background: rgba(0,0,0,0.5);
        }
        dialog {
          position: fixed;
          top: 50%;
          left: 50%;
          translate: -50% -50%;
          margin: 0;
          opacity: 0;
          transform: scale(0.95);
          transition: opacity 200ms cubic-bezier(0.23,1,0.32,1), transform 200ms cubic-bezier(0.23,1,0.32,1), display 200ms allow-discrete, overlay 200ms allow-discrete;
        }
        dialog[open] {
          opacity: 1;
          transform: scale(1);
        }
        @starting-style {
          dialog[open] {
            opacity: 0;
            transform: scale(0.95);
          }
          dialog[open]::backdrop {
            background: rgba(0,0,0,0);
          }
        }
        @keyframes tooltipIn {
          0% { opacity: 0; transform: translateY(8px) scale(0.96); }
          60% { opacity: 1; transform: translateY(-3px) scale(1.01); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .tooltip-enter {
          animation: tooltipIn 500ms cubic-bezier(0.23, 1, 0.32, 1) forwards;
        }
        @media (prefers-reduced-motion: reduce) {
          .tooltip-enter { animation: none; opacity: 1; }
          .anim-logo, .anim-title, .anim-subtitle, .anim-card, .anim-btn {
            animation: none;
            opacity: 1;
          }
          dialog, dialog::backdrop {
            transition: none;
          }
        }
      `}</style>

      <main className="flex h-svh flex-col bg-white">
        <div className="mx-auto flex w-full max-w-xl flex-1 flex-col overflow-hidden px-5 pt-6 pb-4 sm:py-16">
          {/* Header */}
          <header className="mb-4 shrink-0 text-center sm:mb-8">
            <img
              src="/logo.svg"
              alt="Click Cannabis"
              width={200}
              height={29}
              className="anim-logo mx-auto mb-6"
            />
            <h1
              className="anim-title text-[1.75rem] leading-tight tracking-tight text-gray-900 sm:text-4xl"
              style={{ fontFamily: "var(--font-geist-sans), system-ui, sans-serif" }}
            >
              <span className="font-light">Médicos Prescritores de</span>{" "}
              <span className="font-semibold">Cannabis Medicinal</span>
            </h1>
            <p className="anim-subtitle mt-3 text-sm text-gray-500 sm:text-base">
              Selecione uma ou mais patologias para ser atendido
            </p>
          </header>

          {/* Pathology Grid */}
          <div className="relative min-h-0 flex-1">
            {/* Tooltip */}
            {showTooltip && (
              <div className="tooltip-enter absolute inset-x-0 -top-10 z-20 flex justify-center">
                <div className="relative rounded-lg bg-gray-800 px-4 py-2 text-sm font-medium text-white shadow-lg">
                  Selecione uma das patologias para iniciar
                  <div className="absolute -bottom-1.5 left-1/2 size-3 -translate-x-1/2 rotate-45 bg-gray-800" />
                </div>
              </div>
            )}
            <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-12 bg-gradient-to-b from-white to-transparent transition-opacity duration-200 ease-out" style={{ opacity: scrolledTop ? 1 : 0 }} />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-12 bg-gradient-to-t from-white to-transparent" />
          <div ref={gridRef} onScroll={() => { if (gridRef.current) setScrolledTop(gridRef.current.scrollTop > 4); }} className="grid h-full grid-cols-2 content-start gap-2 overflow-y-auto pt-2 pb-14 [scrollbar-width:none] sm:gap-3 sm:pb-2 [&::-webkit-scrollbar]:hidden" role="group" aria-label="Patologias">
            {PATOLOGIAS.map((p, i) => {
              const isSelected = selected.has(p);
              return (
                <button
                  key={p}
                  type="button"
                  role="checkbox"
                  aria-checked={isSelected}
                  onClick={() => toggle(p)}
                  className="anim-card flex items-center gap-3 rounded-xl border-2 px-4 py-3.5 text-left text-[0.9rem] font-medium transition-colors duration-150 ease-out select-none sm:text-base"
                  style={{
                    animationDelay: `${250 + i * 50}ms`,
                    borderColor: isSelected ? "#3a7a4f" : "#e5e7eb",
                    backgroundColor: isSelected ? "#f0f7f1" : "white",
                    color: isSelected ? "#1a5c30" : "#374151",
                  }}
                >
                  {/* Custom checkbox circle */}
                  <span
                    className="flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-150 ease-out"
                    style={{
                      borderColor: isSelected ? "#3a7a4f" : "#d1d5db",
                      backgroundColor: isSelected ? "#3a7a4f" : "transparent",
                    }}
                    aria-hidden="true"
                  >
                    {isSelected && (
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path
                          d="M3 6l2 2 4-4"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </span>
                  {p}
                </button>
              );
            })}
          </div>
          </div>

          {/* CTA Button */}
          <button
            type="button"
            onClick={openModal}
            disabled={selected.size === 0}
            className="anim-btn mt-3 w-full shrink-0 rounded-xl py-4 text-base font-bold text-white transition-all duration-150 ease-out sm:mt-6 sm:text-lg"
            style={{
              backgroundColor: selected.size > 0 ? "#3D8F4A" : "#c5d4c9",
              cursor: selected.size > 0 ? "pointer" : "not-allowed",
            }}
          >
            Iniciar meu Tratamento
          </button>

          {/* Badges de segurança */}
          <div className="anim-btn mt-3 flex shrink-0 items-center justify-center gap-4 sm:mt-6" style={{ animationDelay: "1150ms" }}>
            <img src="/1.webp" alt="Ótimo - Reclame Aqui" width={120} height={60} className="h-12 w-auto object-contain" />
            <img src="/2.webp" alt="Certificado RA1000 - Reclame Aqui" width={120} height={60} className="h-12 w-auto object-contain" />
            <img src="/3.webp" alt="4.9 Google - Avaliação de pacientes" width={120} height={60} className="h-12 w-auto object-contain" />
          </div>
        </div>

        {/* Modal */}
        <dialog
          ref={dialogRef}
          onClose={closeModal}
          className="w-[calc(100%-2.5rem)] max-w-md rounded-2xl border-0 bg-white p-6 shadow-2xl backdrop:bg-black/50"
        >
          <div className="flex items-start justify-between">
            <h2 className="text-lg font-bold text-gray-900">Primeiro Nome</h2>
            <button
              type="button"
              onClick={closeModal}
              className="flex size-8 items-center justify-center rounded-lg text-gray-400 transition-colors duration-150 ease-out hover:bg-gray-100 hover:text-gray-600"
              aria-label="Fechar"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M5 5l10 10M15 5L5 15"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>

          <input
            ref={inputRef}
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (showError && e.target.value.trim()) setShowError(false);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Seu nome"
            className="mt-4 w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-base text-gray-900 outline-none transition-colors duration-150 ease-out placeholder:text-gray-400 focus:border-[#3a7a4f]"
            style={{ fontSize: "16px" }}
          />

          {showError && (
            <p className="mt-2 text-sm font-medium text-red-500">
              * Escreva o seu nome para continuar
            </p>
          )}

          {selected.size > 0 && (
            <div className="mt-4">
              <p className="text-sm text-gray-500">Patologias selecionadas</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {Array.from(selected).map((p) => (
                  <span
                    key={p}
                    className="rounded-full px-3 py-1 text-sm font-semibold"
                    style={{ backgroundColor: "#e6f2e9", color: "#2d6e3f" }}
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={handleSubmit}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl py-4 text-base font-bold text-white transition-all duration-150 ease-out sm:text-lg"
            style={{ backgroundColor: "#1a5c30" }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Falar com o Médico
          </button>
        </dialog>
      </main>
    </>
  );
}
