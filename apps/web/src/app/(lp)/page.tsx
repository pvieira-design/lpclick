"use client";

import { useCallback, useEffect, useRef, useState } from "react";

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
  const inactivityTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasSubmitted = useRef(false);

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
      startInactivityTimer(next);
      return next;
    });
  }, [startInactivityTimer]);

  const openModal = useCallback(() => {
    if (selected.size === 0) return;
    resetInactivityTimer();
    setModalOpen(true);
    dialogRef.current?.showModal();
    setTimeout(() => inputRef.current?.focus(), 100);
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
    const url = buildWhatsAppUrl(trimmed, Array.from(selected));
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
        @media (prefers-reduced-motion: reduce) {
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
            className="mt-6 w-full rounded-xl py-4 text-base font-bold text-white transition-all duration-150 ease-out sm:text-lg"
            style={{ backgroundColor: "#1a5c30" }}
          >
            Falar com o Médico
          </button>
        </dialog>
      </main>
    </>
  );
}
