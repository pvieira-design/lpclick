"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { sendGTMEvent } from "@next/third-parties/google";
import { sendLeadToCrm } from "@/lib/crmLead";
import {
  captureLeadObservation,
  sendCorrelatedLeadEvent,
  withLeadObservation,
} from "@/lib/lead-observation";
import { OBJETIVOS, OPEN_EVENT, type Objetivo, type OpenDetail } from "./config";
import { buildWhatsAppUrl, collectLeadData, sendLeadToApi } from "./lead";

const EASE: [number, number, number, number] = [0.23, 1, 0.32, 1];

export default function ScheduleDialog() {
  const [objetivo, setObjetivo] = useState<Objetivo>();
  const [name, setName] = useState("");
  const [showError, setShowError] = useState(false);
  const [fallbackUrl, setFallbackUrl] = useState<string | null>(null);

  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const originRef = useRef("desconhecida");

  const reduceMotion = useReducedMotion();

  const lockScroll = useCallback((lock: boolean) => {
    document.body.style.overflow = lock ? "hidden" : "";
  }, []);

  const close = useCallback(() => {
    dialogRef.current?.close();
    setShowError(false);
    lockScroll(false);
    // Ao fechar, o <dialog> devolve o foco ao CTA que o abriu, e o navegador
    // desenha o anel de foco. Como quem fecha aqui é toque, tiramos o foco
    // para não deixar contorno residual no botão.
    (document.activeElement as HTMLElement | null)?.blur();
  }, [lockScroll]);

  // Único ponto de abertura: qualquer CTA da página dispara OPEN_EVENT.
  useEffect(() => {
    const handler = (e: Event) => {
      const dialog = dialogRef.current;
      if (!dialog || dialog.open) return;

      const detail = (e as CustomEvent<OpenDetail>).detail ?? { origem: "desconhecida" };
      originRef.current = detail.origem;
      setObjetivo(OBJETIVOS.find(({ label }) => label === detail.objetivo));
      setName("");
      setShowError(false);
      setFallbackUrl(null);
      dialog.showModal();
      lockScroll(true);

      if (window.matchMedia("(min-width: 640px)").matches) {
        inputRef.current?.focus({ preventScroll: true });
      }

      setTimeout(() => {
        sendGTMEvent({
          event: "buttonClick",
          category: "Lead",
          action: "Click",
          label: `Abrir agendamento (${detail.origem}) - LP13`,
        });
      }, 0);
    };

    window.addEventListener(OPEN_EVENT, handler);
    return () => window.removeEventListener(OPEN_EVENT, handler);
  }, [lockScroll]);

  useEffect(() => () => lockScroll(false), [lockScroll]);

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent<HTMLDialogElement>) => {
      if (e.target === dialogRef.current) close();
    },
    [close],
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = name.trim();

    if (!trimmed) {
      setShowError(true);
      inputRef.current?.focus();
      return;
    }

    if (fallbackUrl) {
      window.location.assign(fallbackUrl);
      return;
    }

    const patologias = objetivo ? [objetivo.patologia] : [];
    const leadData = collectLeadData(trimmed, patologias);

    const leadObservationId = captureLeadObservation(trimmed);

    sendLeadToApi(withLeadObservation(leadData, leadObservationId));
    sendLeadToCrm(trimmed, patologias);

    sendCorrelatedLeadEvent(
      {
        event: "buttonWhatsappClicked",
        category: "Lead",
        action: "Click",
        label: `Agendar consulta (${originRef.current}) - LP13`,
      },
      leadObservationId,
    );

    const url = buildWhatsAppUrl(trimmed, objetivo);
    setFallbackUrl(url);
    window.location.assign(url);
  }

  return (
    <>
      <dialog
        ref={dialogRef}
        onClose={() => lockScroll(false)}
        onClick={handleBackdropClick}
        aria-labelledby="lp13-sheet-title"
        className="lp13-sheet w-full max-w-[30rem] border-0 bg-transparent p-0 outline-none"
      >
        <form
          onSubmit={handleSubmit}
          className="flex max-h-[92dvh] flex-col overflow-hidden rounded-t-[1.75rem] bg-white shadow-2xl sm:rounded-[1.75rem]"
        >
          {/* Cabeçalho */}
          <div
            className="relative shrink-0 px-6 pb-5 pt-4"
            style={{
              background:
                "linear-gradient(180deg, var(--green-100) 0%, rgba(245,250,246,0) 100%)",
            }}
          >
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-[color:var(--green-700)]/25 sm:hidden" />
            <button
              type="button"
              onClick={close}
              aria-label="Fechar"
              className="absolute right-4 top-4 hidden size-9 items-center justify-center rounded-full text-[color:var(--muted)] transition-colors hover:bg-black/5 sm:flex"
            >
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>

            <h2
              id="lp13-sheet-title"
              className="font-display pr-8 text-[1.6rem] leading-[1.15] text-[color:var(--green-900)]"
            >
              Agendar minha consulta
            </h2>
            {objetivo && (
              <p className="mt-1.5 text-[13.5px] leading-snug text-[color:var(--muted)]">
                Objetivo selecionado: {objetivo.label}
              </p>
            )}
          </div>

          <div className="flex-1 overflow-y-auto overscroll-contain px-6 pb-5">
            <label htmlFor="lp13-nome" className="block text-[13.5px] font-medium text-[color:var(--ink)]">
              Seu nome
            </label>
            <input
              id="lp13-nome"
              ref={inputRef}
              type="text"
              value={name}
              autoComplete="given-name"
              onChange={(e) => {
                setName(e.target.value);
                if (showError && e.target.value.trim()) setShowError(false);
                if (fallbackUrl) setFallbackUrl(null);
              }}
              aria-invalid={showError}
              aria-describedby={showError ? "lp13-nome-erro" : undefined}
              placeholder="Como podemos te chamar?"
              className="mt-2 w-full rounded-2xl border bg-white px-4 py-3.5 text-[color:var(--ink)] outline-none transition-colors placeholder:text-gray-400 focus:border-[color:var(--green-500)]"
              style={{ borderColor: "var(--line)", fontSize: "16px" }}
            />

            <AnimatePresence>
              {showError && (
                <motion.p
                  id="lp13-nome-erro"
                  role="alert"
                  initial={{ opacity: 0, y: reduceMotion ? 0 : -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2, ease: EASE }}
                  className="mt-2 text-[13px] font-medium text-red-500"
                >
                  Escreva seu nome para continuar
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Ação fixa */}
          <div
            className="shrink-0 border-t bg-white px-6 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4"
            style={{ borderColor: "var(--line)" }}
          >
            <motion.button
              type="submit"
              whileTap={reduceMotion ? undefined : { scale: 0.98 }}
              className="flex w-full items-center justify-center gap-2 rounded-full py-4 text-[16px] font-semibold text-white transition-colors"
              style={{
                backgroundColor: "var(--green-500)",
                boxShadow: "var(--shadow-float)",
              }}
            >
              <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 004.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm5.8 14.13c-.24.68-1.42 1.31-1.96 1.35-.5.04-.99.22-3.35-.7-2.82-1.11-4.6-3.99-4.74-4.18-.14-.19-1.13-1.5-1.13-2.86s.71-2.03.96-2.31c.25-.28.55-.35.73-.35.18 0 .37 0 .53.01.17.01.4-.06.62.48.24.57.8 1.97.87 2.11.07.14.12.3.02.49-.1.19-.15.3-.29.47-.14.16-.3.37-.43.49-.14.14-.29.29-.13.57.17.28.74 1.22 1.58 1.97 1.09.97 2 1.27 2.29 1.41.28.14.45.12.61-.07.17-.19.71-.83.9-1.11.19-.28.37-.23.62-.14.25.09 1.6.76 1.87.9.28.14.46.21.53.32.07.12.07.66-.17 1.34z" />
              </svg>
              Continuar no WhatsApp
            </motion.button>
            {fallbackUrl ? (
              <p className="mt-2.5 text-center text-[12.5px] leading-snug text-[color:var(--muted)]">
                O WhatsApp não abriu?{" "}
                <a
                  href={fallbackUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-[color:var(--green-700)] underline underline-offset-4"
                >
                  Toque aqui
                </a>
              </p>
            ) : (
              <p className="mt-2.5 text-center text-[12px] leading-snug text-[color:var(--muted)]">
                Consulta R$50 · Autorização ANVISA grátis · Sem compromisso
              </p>
            )}
          </div>
        </form>
      </dialog>

      <style>{`
        /* Bottom sheet no mobile, modal centralizado a partir de sm. */
        .lp13-sheet {
          inset: auto 0 0 0;
          max-height: 92dvh;
          opacity: 0;
          transform: translateY(24px);
          transition:
            opacity 220ms cubic-bezier(.23,1,.32,1),
            transform 260ms cubic-bezier(.23,1,.32,1),
            display 260ms allow-discrete,
            overlay 260ms allow-discrete;
        }
        .lp13-sheet[open] { opacity: 1; transform: translateY(0); }
        @starting-style {
          .lp13-sheet[open] { opacity: 0; transform: translateY(24px); }
        }
        @media (min-width: 640px) {
          .lp13-sheet {
            inset: 50% auto auto 50%;
            translate: -50% -50%;
            transform: scale(.96);
          }
          .lp13-sheet[open] { transform: scale(1); }
          @starting-style {
            .lp13-sheet[open] { opacity: 0; transform: scale(.96); }
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .lp13-sheet, .lp13-sheet[open] { transition: none; }
        }
      `}</style>
    </>
  );
}
