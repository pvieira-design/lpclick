"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { sendGTMEvent } from "@next/third-parties/google";

const PATOLOGIAS = [
  "Alcoolismo",
  "Ansiedade",
  "Perda de Peso",
  "Obesidade",
  "Depressão",
  "Dores",
  "Epilepsia",
  "Insônia",
  "Tabagismo",
  "Autismo",
  "Enxaqueca",
  "Fibromialgia",
  "Parkinson",
  "TDAH",
] as const;

const PHONE = "5521993686082";

function buildWhatsAppUrl(name: string, patologias: string[]) {
  const list = patologias.map((p, i) => `${i + 1}. ${p}`).join("\n");
  const text = `Olá, me chamo ${name}.\n\nPatologias selecionadas:\n${list}`;
  return `https://wa.me/${PHONE}?text=${encodeURIComponent(text)}&utm_source=funilcurto`;
}

export default function LP2() {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");

  // Notification state
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [progress, setProgress] = useState(100);
  const progressInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  const autoOpenedRef = useRef(false);

  const clearProgressInterval = useCallback(() => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
      progressInterval.current = null;
    }
  }, []);

  const triggerNotification = useCallback(
    (message: string) => {
      clearProgressInterval();
      setShowNotification(true);
      setNotificationMessage(message);
      setProgress(100);

      const totalDuration = 6000;
      const intervalMs = 50;
      const decrement = 100 / (totalDuration / intervalMs);

      progressInterval.current = setInterval(() => {
        setProgress((prev) => {
          const next = prev - decrement;
          if (next <= 0) {
            clearProgressInterval();
            setShowNotification(false);
            return 0;
          }
          return next;
        });
      }, intervalMs);
    },
    [clearProgressInterval],
  );

  // Notification: "Selecione uma patologia" after 5s inactivity (no selection, no modal)
  useEffect(() => {
    if (showModal || selected.size > 0) {
      clearProgressInterval();
      setShowNotification(false);
      return;
    }
    const timer = setTimeout(
      () => triggerNotification("Selecione uma patologia para continuar"),
      5000,
    );
    return () => {
      clearTimeout(timer);
      clearProgressInterval();
      setShowNotification(false);
    };
  }, [showModal, selected.size, triggerNotification, clearProgressInterval]);

  // Notification: "Escreva o seu nome" after 5s in modal without name
  useEffect(() => {
    if (!showModal || name.trim().length > 0) {
      clearProgressInterval();
      setShowNotification(false);
      return;
    }
    const timer = setTimeout(
      () => triggerNotification("Escreva o seu nome para continuar"),
      5000,
    );
    return () => clearTimeout(timer);
  }, [showModal, name, triggerNotification, clearProgressInterval]);

  const openModal = useCallback(() => {
    setShowModal(true);
    sendGTMEvent({
      event: "formStart",
      category: "Lead",
      action: "FormOpen",
      label: "Modal aberto - LP2",
      value: Array.from(selected).join(", "),
    });
  }, [selected]);

  // Auto-open modal 3s after first pathology selection
  useEffect(() => {
    if (selected.size === 0 || showModal || autoOpenedRef.current) return;
    const timer = setTimeout(() => {
      autoOpenedRef.current = true;
      openModal();
    }, 3000);
    return () => clearTimeout(timer);
  }, [selected, showModal, openModal]);

  const toggle = useCallback((patologia: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(patologia)) next.delete(patologia);
      else next.add(patologia);
      return next;
    });
  }, []);

  const handleSubmit = useCallback(() => {
    const trimmed = name.trim();
    if (!trimmed) return;

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
  }, [name, selected]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") handleSubmit();
    },
    [handleSubmit],
  );

  const isNameNotification =
    notificationMessage === "Escreva o seu nome para continuar";

  return (
    <>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 200ms cubic-bezier(0.23, 1, 0.32, 1) forwards;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-fade-in { animation: none; opacity: 1; }
        }
      `}</style>

      <div className="flex min-h-svh flex-col items-center bg-white">
        {/* Header */}
        <header className="w-full bg-white">
          <div className="mx-auto flex max-w-[600px] items-center justify-center px-4 pt-3 pb-1.5">
            <img
              src="/logo.svg"
              alt="Click Cannabis"
              className="h-[34px]"
            />
          </div>
        </header>

        {/* Main */}
        <main className="mx-auto flex w-full max-w-[600px] flex-col items-center px-4 pt-3 pb-8">
          <h1
            className="text-center text-3xl leading-tight font-normal tracking-tight text-gray-900"
          >
            Médicos Prescritores de Cannabis Medicinal
          </h1>
          <p className="mt-2 max-w-md text-center text-sm font-normal text-gray-500">
            Selecione abaixo uma ou mais patologias e inicie seu tratamento com
            cannabis medicinal ainda hoje.
          </p>

          {/* Pathology Grid */}
          <div className="mt-[18px] grid w-full grid-cols-2 gap-[9px]">
            {PATOLOGIAS.map((p) => {
              const isSelected = selected.has(p);
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => toggle(p)}
                  className="flex cursor-pointer items-center gap-2 rounded-xl border-2 px-3 py-[9px] text-left font-medium transition-all duration-150 select-none"
                  style={{
                    borderColor: isSelected ? "#3a7a4f" : "#e5e7eb",
                    backgroundColor: isSelected ? "#f0f7f1" : "white",
                    color: isSelected ? "#1a5c30" : "#374151",
                    boxShadow: isSelected
                      ? "0 1px 2px rgba(0,0,0,0.05)"
                      : "none",
                  }}
                >
                  {/* Checkbox */}
                  <span
                    className="flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-150"
                    style={{
                      borderColor: isSelected ? "#3a7a4f" : "#d1d5db",
                      backgroundColor: isSelected ? "#3a7a4f" : "transparent",
                    }}
                  >
                    {isSelected && (
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        fill="none"
                      >
                        <path
                          d="M3.5 7l2.5 2.5 4.5-4.5"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </span>
                  <span className="text-[15px] leading-tight font-light">
                    {p}
                  </span>
                </button>
              );
            })}
          </div>

          {/* CTA Button */}
          <button
            type="button"
            disabled={selected.size === 0}
            onClick={openModal}
            className="mt-[18px] h-14 w-full rounded-xl text-base font-semibold text-white shadow-md transition-all duration-150"
            style={{
              backgroundColor: selected.size > 0 ? "#3D8F4A" : "#c5d4c9",
              cursor: selected.size > 0 ? "pointer" : "not-allowed",
            }}
          >
            Iniciar meu Tratamento
          </button>
        </main>

        {/* Footer */}
        <footer className="mt-10 w-full bg-white py-8">
          <div className="mx-auto flex max-w-[600px] flex-col items-center gap-5 px-4">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-900">
                HEALTH MEDIA LTDA
              </p>
              <p className="mt-0.5 text-xs text-gray-500">
                CNPJ 41.247.190/0001-23
              </p>
            </div>
            <div className="flex w-full items-center justify-between">
              <img
                src="/1.webp"
                alt="Ótimo - Reclame Aqui"
                className="h-12"
              />
              <img
                src="/2.webp"
                alt="Certificado RA1000 - Reclame Aqui"
                className="h-10"
              />
              <img
                src="/3.webp"
                alt="4.9 Google - Avaliação de pacientes"
                className="h-12"
              />
            </div>
          </div>
        </footer>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            {/* Overlay */}
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setShowModal(false)}
            />

            <div className="relative w-full max-w-[500px]">
              {/* Notification above modal (name) */}
              {showNotification && isNameNotification && (
                <div className="animate-fade-in absolute bottom-full right-0 left-0 z-50 mb-3 overflow-hidden rounded-lg shadow-lg"
                  style={{ backgroundColor: "#3D8F4A" }}
                >
                  <div className="px-4 py-3 text-center text-base font-medium whitespace-nowrap text-white">
                    {notificationMessage}
                  </div>
                  <div className="h-1 w-full bg-white/30">
                    <div
                      className="h-full bg-white transition-all duration-50 ease-linear"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Modal content */}
              <div className="animate-fade-in relative w-full rounded-2xl bg-white p-5 pb-8 shadow-xl">
                {/* Close button */}
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="absolute top-4 right-4 z-10 text-gray-400 transition-colors hover:text-gray-600"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                  >
                    <path
                      d="M5 5l10 10M15 5L5 15"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>

                {/* Name input */}
                <div className="mt-2 w-full">
                  <label
                    htmlFor="firstName"
                    className="text-sm font-medium text-gray-900"
                  >
                    Primeiro Nome
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    placeholder="Digite o seu primeiro nome..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="mt-1.5 h-[60px] w-full rounded-xl border-2 border-gray-200 bg-white px-4 text-base text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-[#3a7a4f]"
                    style={{ fontSize: "16px" }}
                  />
                  <p className="mt-1 text-sm font-medium text-red-500">
                    * Escreva o seu nome para continuar
                  </p>
                </div>

                {/* Selected pathologies */}
                {selected.size > 0 && (
                  <div className="mt-4 w-full">
                    <p className="mb-2 text-sm font-medium text-gray-500">
                      Patologias selecionadas
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {PATOLOGIAS.filter((p) => selected.has(p)).map((p) => (
                        <span
                          key={p}
                          className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium"
                          style={{
                            backgroundColor: "#e6f2e9",
                            borderColor: "rgba(58,122,79,0.2)",
                            color: "#2d6e3f",
                          }}
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Submit button */}
                <button
                  type="button"
                  disabled={name.trim().length === 0}
                  onClick={handleSubmit}
                  className="mt-5 h-14 w-full rounded-xl text-base font-semibold text-white shadow-md transition-all duration-150"
                  style={{
                    backgroundColor:
                      name.trim().length > 0 ? "#1a5c30" : "#c5d4c9",
                    cursor:
                      name.trim().length > 0 ? "pointer" : "not-allowed",
                  }}
                >
                  Falar com o Médico
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Top notification (pathology selection) */}
        {showNotification && !isNameNotification && (
          <div
            className="animate-fade-in fixed top-6 left-1/2 z-50 w-[90%] max-w-[400px] -translate-x-1/2 overflow-hidden rounded-lg shadow-lg"
            style={{ backgroundColor: "#3D8F4A" }}
          >
            <div className="px-4 py-3 text-center text-base font-medium whitespace-nowrap text-white">
              {notificationMessage}
            </div>
            <div className="h-1 w-full bg-white/30">
              <div
                className="h-full bg-white transition-all duration-50 ease-linear"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
