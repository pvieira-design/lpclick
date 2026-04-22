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

export default function LandingClient() {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [name, setName] = useState("");
  const [showError, setShowError] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const inactivityTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasSubmitted = useRef(false);
  const hasInteracted = useRef(false);
  const hasDismissedModal = useRef(false);

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
          label: "Abrir modal (inatividade) - LP3",
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

  const lockScroll = useCallback(() => {
    document.body.style.overflow = "hidden";
  }, []);

  const unlockScroll = useCallback(() => {
    document.body.style.overflow = "";
  }, []);

  const openModal = useCallback(() => {
    const dialog = dialogRef.current;
    if (!dialog || dialog.open) return;

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
        label: "Abrir modal - LP3",
        value: Array.from(selected).join(", "),
      });
    }, 0);
  }, [selected, resetInactivityTimer, lockScroll]);

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

  // Bottom CTA trigger: always opens the modal.
  useEffect(() => {
    const handler = () => openModal();
    window.addEventListener("treatment:open", handler);
    return () => window.removeEventListener("treatment:open", handler);
  }, [openModal]);

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
      label: "Falar com o médico - LP3",
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
      <section id="lp3-treatment-form" className="mx-auto flex w-full max-w-xl flex-col px-5 pt-6 pb-10 sm:py-16">
        {/* Header */}
        <header className="mb-6 text-center sm:mb-8">
          <img
            src="/logo.svg"
            alt="Click Cannabis"
            width={200}
            height={29}
            fetchPriority="high"
            decoding="async"
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
        <div className="relative">
          {/* Tooltip */}
          {showTooltip && (
            <div className="tooltip-enter absolute inset-x-0 -top-10 z-20 flex justify-center">
              <div className="relative rounded-lg bg-gray-800 px-4 py-2 text-sm font-medium text-white shadow-lg">
                Selecione uma das patologias para iniciar
                <div className="absolute -bottom-1.5 left-1/2 size-3 -translate-x-1/2 rotate-45 bg-gray-800" />
              </div>
            </div>
          )}
          <div className="grid grid-cols-2 gap-2 sm:gap-3" role="group" aria-label="Patologias">
            {PATOLOGIAS.map((p, i) => {
              const isSelected = selected.has(p);
              return (
                <button
                  key={p}
                  type="button"
                  role="checkbox"
                  aria-checked={isSelected}
                  onClick={() => toggle(p)}
                  className="anim-card flex min-w-0 items-center gap-3 rounded-xl border-2 px-4 py-3.5 text-left text-[0.9rem] font-medium transition-colors duration-150 ease-out select-none sm:text-base"
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
                  <span className="min-w-0 flex-1 truncate">{p}</span>
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
          className="anim-btn mt-6 w-full rounded-xl py-4 text-base font-bold text-white transition-all duration-150 ease-out sm:mt-8 sm:text-lg"
          style={{
            backgroundColor: selected.size > 0 ? "#3D8F4A" : "#c5d4c9",
            cursor: selected.size > 0 ? "pointer" : "not-allowed",
          }}
        >
          Iniciar meu Tratamento
        </button>

        {/* Badges de segurança */}
        <div className="anim-btn mt-4 flex items-center justify-center gap-4 sm:mt-6" style={{ animationDelay: "1150ms" }}>
          <img src="/1.webp" alt="Ótimo - Reclame Aqui" width={120} height={60} loading="lazy" decoding="async" className="h-12 w-auto object-contain" />
          <img src="/2.webp" alt="Certificado RA1000 - Reclame Aqui" width={120} height={60} loading="lazy" decoding="async" className="h-12 w-auto object-contain" />
          <img src="/3.webp" alt="4.9 Google - Avaliação de pacientes" width={120} height={60} loading="lazy" decoding="async" className="h-12 w-auto object-contain" />
        </div>
      </section>

      {/* Modal */}
      <dialog
        ref={dialogRef}
        onClose={closeModal}
        onClick={handleBackdropClick}
        className="max-h-[calc(100dvh-2.5rem)] w-[calc(100%-2.5rem)] max-w-md overflow-hidden rounded-3xl border-0 bg-white p-0 shadow-2xl backdrop:bg-black/50"
      >
        <div className="flex max-h-[inherit] flex-col">
        <div className="flex-1 overflow-y-auto overscroll-contain px-6 pt-6 pb-4">
        {/* Header ilustrado */}
        <div className="overflow-hidden rounded-2xl bg-[#f5faf6]">
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
              <span className="flex size-9 items-center justify-center rounded-full bg-[#285E31]">
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

        {/* Nome */}
        <label className="mt-5 block text-[15px] text-gray-800">
          Nome <span className="text-red-500">*</span>
        </label>
        <input
          ref={inputRef}
          type="text"
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

        {showError && (
          <p className="mt-2 text-sm font-medium text-red-500">
            * Escreva o seu nome para continuar
          </p>
        )}

        {/* Chips selecionadas */}
        {selected.size > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {Array.from(selected).map((p) => (
              <span
                key={p}
                className="rounded-full px-3 py-1 text-[13px] font-medium"
                style={{ backgroundColor: "#e6f2e9", color: "#2d6e3f" }}
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
                      borderColor: isSelected ? "#3a7a4f" : "#d1d5db",
                      backgroundColor: isSelected ? "#3a7a4f" : "transparent",
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

        </div>

        {/* Ações fixas */}
        <div className="flex shrink-0 flex-col gap-3 border-t border-gray-100 bg-white px-6 py-4">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={selected.size === 0}
            className="w-full rounded-full py-3.5 text-base font-semibold text-white transition-colors duration-150"
            style={{
              backgroundColor: selected.size > 0 ? "#285E31" : "#9ca3af",
              cursor: selected.size > 0 ? "pointer" : "not-allowed",
            }}
          >
            Falar com médico
          </button>
          <button
            type="button"
            onClick={closeModal}
            className="w-full rounded-full border-[1.5px] border-[#285E31] bg-white py-3.5 text-base font-semibold text-[#285E31] transition-colors duration-150 hover:bg-[#f5faf6]"
          >
            Voltar a página inicial
          </button>
        </div>
        </div>
      </dialog>
    </>
  );
}
