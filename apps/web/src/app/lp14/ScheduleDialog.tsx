"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { sendGTMEvent } from "@next/third-parties/google";
import { sendLeadToCrm } from "@/lib/crmLead";
import { ATENDIMENTO, OPEN_EVENT, PATOLOGIAS, isAtendimentoAberto, type OpenDetail } from "./config";
import { buildWhatsAppUrl, collectLeadData, sendLeadToApi } from "./lead";

const EASE: [number, number, number, number] = [0.23, 1, 0.32, 1];

export default function ScheduleDialog() {
  const [selected, setSelected] = useState<Set<string>>(() => new Set());
  const [name, setName] = useState("");
  const [showError, setShowError] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [fallbackUrl, setFallbackUrl] = useState<string | null>(null);
  const [aberto, setAberto] = useState(true);

  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const originRef = useRef("desconhecida");
  const lastSubmitRef = useRef(0);

  const reduceMotion = useReducedMotion();

  useEffect(() => {
    setAberto(isAtendimentoAberto());
  }, []);

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
      const detail = (e as CustomEvent<OpenDetail>).detail ?? { origem: "desconhecida" };
      originRef.current = detail.origem;

      const preSelecionadas = [
        ...(detail.patologia ? [detail.patologia] : []),
        ...(detail.patologias ?? []),
      ];
      if (preSelecionadas.length > 0) {
        setSelected((prev) => {
          const next = new Set(prev);
          for (const p of preSelecionadas) next.add(p);
          return next;
        });
      }

      const dialog = dialogRef.current;
      if (!dialog || dialog.open) return;
      dialog.showModal();
      lockScroll(true);

      // Foco no nome só no desktop — no mobile o teclado subindo tapa o formulário.
      if (window.matchMedia("(min-width: 640px)").matches) {
        requestAnimationFrame(() => inputRef.current?.focus());
      }

      setTimeout(() => {
        sendGTMEvent({
          event: "buttonClick",
          category: "Lead",
          action: "Click",
          label: `Abrir agendamento (${detail.origem}) - LP14`,
          value: detail.patologia ?? "",
        });
      }, 0);
    };

    window.addEventListener(OPEN_EVENT, handler);
    return () => window.removeEventListener(OPEN_EVENT, handler);
  }, [lockScroll]);

  useEffect(() => () => lockScroll(false), [lockScroll]);

  const toggle = useCallback((patologia: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(patologia)) next.delete(patologia);
      else next.add(patologia);
      return next;
    });
  }, []);

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent<HTMLDialogElement>) => {
      if (e.target === dialogRef.current) close();
    },
    [close],
  );

  const handleSubmit = useCallback(() => {
    // Duplo clique dispararia lead/CRM/GTM duas vezes; a janela de 1,5s corta
    // o repique sem impedir uma retentativa deliberada.
    if (Date.now() - lastSubmitRef.current < 1500) return;

    const trimmed = name.trim();
    if (!trimmed || selected.size === 0) {
      setShowError(true);
      if (!trimmed) inputRef.current?.focus();
      return;
    }

    lastSubmitRef.current = Date.now();
    setSubmitted(true);

    const patologias = Array.from(selected);
    const leadData = collectLeadData(trimmed, patologias);

    sendLeadToApi(leadData);
    sendLeadToCrm(trimmed, patologias);

    sendGTMEvent({
      event: "buttonWhatsappClicked",
      category: "Lead",
      action: "Click",
      label: `Agendar consulta (${originRef.current}) - LP14`,
      value: patologias.join(", "),
      leadData,
    });

    const url = buildWhatsAppUrl(trimmed, patologias);
    setFallbackUrl(url);
    const aba = window.open(url, "_blank", "noopener,noreferrer");
    // Popup bloqueado (comum em navegador in-app do Instagram): navega na própria aba.
    if (!aba) window.location.href = url;
    // Ao voltar da aba do WhatsApp o botão retém o foco e o navegador desenha
    // o anel; tiramos o foco para não deixar contorno residual.
    (document.activeElement as HTMLElement | null)?.blur();
  }, [name, selected]);

  // O botão só esmaece sem nenhum sintoma marcado — o nome é cobrado na validação,
  // para não deixar apagado (e menos clicável) quem já chegou marcado pelo chip.
  const ativo = selected.size > 0;

  return (
    <>
      <dialog
        ref={dialogRef}
        onClose={() => {
          lockScroll(false);
          // Reabrir o popup depois de um envio volta com o botão destravado.
          setSubmitted(false);
        }}
        onClick={handleBackdropClick}
        aria-labelledby="lp14-sheet-title"
        className="lp14-sheet w-full max-w-[30rem] border-0 bg-transparent p-0 outline-none"
      >
        <div
          className="flex max-h-[92dvh] flex-col overflow-hidden rounded-t-[1.75rem] border text-[color:var(--ink)] shadow-2xl sm:rounded-[1.75rem]"
          style={{ backgroundColor: "var(--panel)", borderColor: "var(--line)" }}
        >
          {/* Cabeçalho */}
          <div
            className="relative shrink-0 px-6 pb-5 pt-4"
            style={{
              background:
                "linear-gradient(180deg, rgba(89,209,114,.12) 0%, rgba(23,27,23,0) 100%)",
            }}
          >
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-white/20 sm:hidden" />
            <button
              type="button"
              onClick={close}
              aria-label="Fechar"
              className="absolute right-4 top-4 hidden size-9 items-center justify-center rounded-full text-[color:var(--muted)] transition-colors hover:bg-white/10 sm:flex"
            >
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>

            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[color:var(--green-bright)]">
              Passo único
            </p>
            <h2
              id="lp14-sheet-title"
              className="font-display mt-1.5 text-[1.6rem] leading-[1.1]"
            >
              O que você quer tratar?
            </h2>
            <p className="mt-1.5 text-[13.5px] leading-snug text-[color:var(--muted)]">
              {aberto
                ? "Marque seus sintomas, deixe seu nome e um médico te atende agora no WhatsApp."
                : `Marque seus sintomas e deixe seu nome. Respondemos assim que o atendimento abrir, às ${ATENDIMENTO.rotuloInicio}.`}
            </p>
          </div>

          {/* Corpo rolável */}
          <div className="flex-1 overflow-y-auto overscroll-contain px-6 pb-5">
            <div className="grid grid-cols-2 gap-2" role="group" aria-label="Sintomas">
              {PATOLOGIAS.map((p) => {
                const isSelected = selected.has(p);
                return (
                  <motion.button
                    key={p}
                    type="button"
                    role="checkbox"
                    aria-checked={isSelected}
                    onClick={() => {
                      toggle(p);
                      if (showError) setShowError(false);
                    }}
                    whileTap={reduceMotion ? undefined : { scale: 0.97 }}
                    className="flex min-w-0 items-center gap-2.5 rounded-2xl border px-3.5 py-3 text-left text-[14px] font-medium select-none"
                    style={{
                      borderColor: isSelected ? "var(--green-500)" : "var(--line)",
                      backgroundColor: isSelected ? "rgba(89,209,114,.12)" : "transparent",
                      color: isSelected ? "var(--ink)" : "var(--muted)",
                      transition: "border-color .15s ease, background-color .15s ease, color .15s ease",
                    }}
                  >
                    <span
                      className="flex size-[18px] shrink-0 items-center justify-center rounded-full border-2 transition-colors"
                      style={{
                        borderColor: isSelected ? "var(--green-500)" : "rgba(154,166,156,.5)",
                        backgroundColor: isSelected ? "var(--green-500)" : "transparent",
                      }}
                      aria-hidden="true"
                    >
                      <AnimatePresence>
                        {isSelected && (
                          <motion.svg
                            width="11"
                            height="11"
                            viewBox="0 0 12 12"
                            fill="none"
                            initial={{ scale: reduceMotion ? 1 : 0.4, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: reduceMotion ? 1 : 0.4, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 420, damping: 26 }}
                          >
                            <path d="M3 6l2 2 4-4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </motion.svg>
                        )}
                      </AnimatePresence>
                    </span>
                    <span className="min-w-0 flex-1 truncate">{p}</span>
                  </motion.button>
                );
              })}
            </div>

            <label htmlFor="lp14-nome" className="mt-5 block text-[13.5px] font-medium">
              Seu nome
            </label>
            <input
              id="lp14-nome"
              ref={inputRef}
              type="text"
              value={name}
              autoComplete="given-name"
              onChange={(e) => {
                setName(e.target.value);
                if (showError && e.target.value.trim()) setShowError(false);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSubmit();
              }}
              placeholder="Como podemos te chamar?"
              className="mt-2 w-full rounded-2xl border bg-transparent px-4 py-3.5 text-[color:var(--ink)] outline-none transition-colors placeholder:text-[color:var(--muted)]/60 focus:border-[color:var(--green-500)]"
              style={{ borderColor: "var(--line)", fontSize: "16px" }}
            />

            <AnimatePresence>
              {showError && (
                <motion.p
                  initial={{ opacity: 0, y: reduceMotion ? 0 : -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2, ease: EASE }}
                  className="mt-2 text-[13px] font-medium text-red-400"
                >
                  {selected.size === 0
                    ? "Marque pelo menos um sintoma para continuar"
                    : "Escreva seu nome para continuar"}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Ação fixa */}
          <div
            className="shrink-0 border-t px-6 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4"
            style={{ borderColor: "var(--line)", backgroundColor: "var(--panel)" }}
          >
            <motion.button
              type="button"
              onClick={handleSubmit}
              whileTap={reduceMotion || !ativo ? undefined : { scale: 0.98 }}
              className="flex w-full items-center justify-center gap-2 rounded-full py-4 text-[16px] font-semibold text-white transition-colors"
              style={{
                backgroundColor: ativo ? "var(--green-500)" : "rgba(154,166,156,.25)",
                color: ativo ? "#fff" : "var(--muted)",
                boxShadow: ativo ? "var(--shadow-float)" : "none",
                cursor: ativo ? "pointer" : "not-allowed",
              }}
            >
              <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 004.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm5.8 14.13c-.24.68-1.42 1.31-1.96 1.35-.5.04-.99.22-3.35-.7-2.82-1.11-4.6-3.99-4.74-4.18-.14-.19-1.13-1.5-1.13-2.86s.71-2.03.96-2.31c.25-.28.55-.35.73-.35.18 0 .37 0 .53.01.17.01.4-.06.62.48.24.57.8 1.97.87 2.11.07.14.12.3.02.49-.1.19-.15.3-.29.47-.14.16-.3.37-.43.49-.14.14-.29.29-.13.57.17.28.74 1.22 1.58 1.97 1.09.97 2 1.27 2.29 1.41.28.14.45.12.61-.07.17-.19.71-.83.9-1.11.19-.28.37-.23.62-.14.25.09 1.6.76 1.87.9.28.14.46.21.53.32.07.12.07.66-.17 1.34z" />
              </svg>
              {submitted ? "Abrindo WhatsApp…" : "Agendar minha consulta"}
            </motion.button>
            {submitted && fallbackUrl ? (
              <p className="mt-2.5 text-center text-[12.5px] leading-snug text-[color:var(--muted)]">
                O WhatsApp não abriu?{" "}
                <a
                  href={fallbackUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-[color:var(--green-bright)] underline underline-offset-4"
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
        </div>
      </dialog>

      <style>{`
        /* Bottom sheet no mobile, modal centralizado a partir de sm. */
        .lp14-sheet {
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
        .lp14-sheet[open] { opacity: 1; transform: translateY(0); }
        @starting-style {
          .lp14-sheet[open] { opacity: 0; transform: translateY(24px); }
        }
        @media (min-width: 640px) {
          .lp14-sheet {
            inset: 50% auto auto 50%;
            translate: -50% -50%;
            transform: scale(.96);
          }
          .lp14-sheet[open] { transform: scale(1); }
          @starting-style {
            .lp14-sheet[open] { opacity: 0; transform: scale(.96); }
          }
        }
        .lp14-sheet::backdrop {
          background: rgba(0, 0, 0, 0.65);
        }
        @media (prefers-reduced-motion: reduce) {
          .lp14-sheet, .lp14-sheet[open], .lp14-sheet::backdrop { transition: none; }
        }
      `}</style>
    </>
  );
}
