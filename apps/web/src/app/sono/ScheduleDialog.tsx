"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { sendGTMEvent } from "@next/third-parties/google";
import { sendLeadToCrm } from "@/lib/crmLead";
import { ATENDIMENTO, OPEN_EVENT, PATOLOGIAS, isAtendimentoAberto, type OpenDetail } from "./config";
import { buildWhatsAppUrl, collectLeadData, sendLeadToApi } from "./lead";

const EASE: [number, number, number, number] = [0.23, 1, 0.32, 1];

/** Resistência progressiva: quanto mais longe do limite, menos o sheet segue. */
function rubberband(overshoot: number, dimension: number, constant = 0.55): number {
  return (overshoot * dimension * constant) / (dimension + constant * Math.abs(overshoot));
}

/** Velocidade vertical em px/s pelas últimas amostras (~80ms). */
function velocityFrom(samples: { y: number; t: number }[]): number {
  if (samples.length < 2) return 0;
  const last = samples[samples.length - 1];
  const first = samples.find((s) => last.t - s.t <= 80) ?? samples[0];
  const dt = last.t - first.t;
  if (dt <= 0) return 0;
  return ((last.y - first.y) / dt) * 1000;
}

/** Onde o gesto pararia sozinho — a curva de desaceleração do scroll do sistema. */
function projectMomentum(velocity: number, decelerationRate = 0.998): number {
  return ((velocity / 1000) * decelerationRate) / (1 - decelerationRate);
}

export default function ScheduleDialog() {
  const [selected, setSelected] = useState<Set<string>>(() => new Set());
  const [name, setName] = useState("");
  const [showError, setShowError] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [fallbackUrl, setFallbackUrl] = useState<string | null>(null);
  const [aberto, setAberto] = useState(true);

  const dialogRef = useRef<HTMLDialogElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const originRef = useRef("desconhecida");
  const lastSubmitRef = useRef(0);

  // Arraste para baixo fechando o sheet (só no mobile, onde ele encosta na
  // borda de baixo e a alça faz sentido).
  const grabRef = useRef({
    active: false,
    pointerId: null as number | null,
    startY: 0,
    dy: 0,
    samples: [] as { y: number; t: number }[],
  });
  const sheetAnimRef = useRef(0);

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

  /** Volta o sheet ao lugar com mola criticamente amortecida, do ponto atual. */
  const settleSheet = useCallback(
    (fromY: number, initialVelocity: number) => {
      const sheet = sheetRef.current;
      if (!sheet) return;
      cancelAnimationFrame(sheetAnimRef.current);
      if (reduceMotion) {
        sheet.style.transform = "";
        return;
      }
      // response 0.3s, damping 1.0 — o "drawer" da Apple, sem repique.
      const omega = (2 * Math.PI) / 0.3;
      const k = omega * omega;
      const c = 2 * omega;
      let y = fromY;
      let v = initialVelocity;
      let last = performance.now();
      const step = (now: number) => {
        const dt = Math.min(0.032, (now - last) / 1000);
        last = now;
        v += (-k * y - c * v) * dt;
        y += v * dt;
        if (Math.abs(y) < 0.5 && Math.abs(v) < 10) {
          sheet.style.transform = "";
          return;
        }
        sheet.style.transform = `translate3d(0, ${y}px, 0)`;
        sheetAnimRef.current = requestAnimationFrame(step);
      };
      sheetAnimRef.current = requestAnimationFrame(step);
    },
    [reduceMotion],
  );

  /** Termina de jogar o sheet para fora na velocidade do gesto e só então fecha. */
  const dismissSheet = useCallback(
    (fromY: number, initialVelocity: number) => {
      const sheet = sheetRef.current;
      if (!sheet || reduceMotion) {
        close();
        if (sheet) sheet.style.transform = "";
        return;
      }
      cancelAnimationFrame(sheetAnimRef.current);
      const height = sheet.offsetHeight || 400;
      let y = fromY;
      // Piso de velocidade: mesmo um empurrão fraco que passou do limiar sai
      // andando, em vez de sumir parado.
      let v = Math.max(initialVelocity, 900);
      let last = performance.now();
      const step = (now: number) => {
        const dt = Math.min(0.032, (now - last) / 1000);
        last = now;
        v += 2400 * dt; // acelera saindo, como algo que já foi solto
        y += v * dt;
        if (y >= height) {
          close();
          sheet.style.transform = "";
          return;
        }
        sheet.style.transform = `translate3d(0, ${y}px, 0)`;
        sheetAnimRef.current = requestAnimationFrame(step);
      };
      sheetAnimRef.current = requestAnimationFrame(step);
    },
    [close, reduceMotion],
  );

  const onGrabDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    // Desktop tem o X e o clique fora; a alça é gesto de mobile.
    if (window.matchMedia("(min-width: 640px)").matches) return;
    if (e.pointerType === "mouse" && e.button !== 0) return;
    cancelAnimationFrame(sheetAnimRef.current);
    grabRef.current = {
      active: true,
      pointerId: e.pointerId,
      startY: e.clientY,
      dy: 0,
      samples: [{ y: e.clientY, t: e.timeStamp }],
    };
  }, []);

  const onGrabMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const g = grabRef.current;
    const sheet = sheetRef.current;
    if (!g.active || e.pointerId !== g.pointerId || !sheet) return;
    if (g.samples.length === 1) {
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {
        /* noop */
      }
    }
    const raw = e.clientY - g.startY;
    // Para baixo o sheet acompanha o dedo 1:1; para cima ele resiste em vez de
    // travar seco — não há para onde ir, mas o gesto continua sendo ouvido.
    g.dy = raw >= 0 ? raw : rubberband(raw, sheet.offsetHeight || 400);
    sheet.style.transform = `translate3d(0, ${g.dy}px, 0)`;
    g.samples.push({ y: e.clientY, t: e.timeStamp });
    if (g.samples.length > 6) g.samples.shift();
  }, []);

  const onGrabUp = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const g = grabRef.current;
      const sheet = sheetRef.current;
      if (!g.active || e.pointerId !== g.pointerId || !sheet) return;
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
      g.active = false;
      g.pointerId = null;

      const velocity = velocityFrom(g.samples);
      const height = sheet.offsetHeight || 400;
      // Decide pela projeção do gesto, não pela posição do dedo: um empurrão
      // curto e rápido fecha; um arraste longo e hesitante volta.
      const projected = g.dy + projectMomentum(velocity);
      if (projected > height * 0.4) {
        dismissSheet(g.dy, velocity);
        return;
      }
      settleSheet(g.dy, velocity);
    },
    [dismissSheet, settleSheet],
  );

  useEffect(() => () => cancelAnimationFrame(sheetAnimRef.current), []);

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
          label: `Abrir agendamento (${detail.origem}) - LP16`,
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
      label: `Agendar consulta (${originRef.current}) - LP16`,
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
        aria-labelledby="lp16-sheet-title"
        className="lp16-sheet w-full max-w-[30rem] border-0 bg-transparent p-0 outline-none"
      >
        <div
          ref={sheetRef}
          className="flex max-h-[92dvh] flex-col overflow-hidden rounded-t-[1.75rem] border text-[color:var(--ink)] shadow-2xl sm:rounded-[1.75rem]"
          style={{ backgroundColor: "var(--panel)", borderColor: "var(--line)" }}
        >
          {/* Cabeçalho — também é a alça: arrastar daqui fecha o sheet. */}
          <div
            onPointerDown={onGrabDown}
            onPointerMove={onGrabMove}
            onPointerUp={onGrabUp}
            onPointerCancel={onGrabUp}
            className="relative shrink-0 touch-none px-6 pb-5 pt-4 sm:touch-auto"
            style={{
              background:
                "linear-gradient(180deg, var(--green-soft) 0%, rgba(255,255,255,0) 100%)",
            }}
          >
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-gray-300 sm:hidden" />
            <button
              type="button"
              onClick={close}
              aria-label="Fechar"
              className="absolute right-4 top-4 hidden size-9 items-center justify-center rounded-full text-[color:var(--muted)] transition-colors hover:bg-gray-100 sm:flex"
            >
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>

            <p className="lp16-eyebrow text-[11px] font-semibold uppercase text-[color:var(--accent)]">
              Passo único
            </p>
            <h2
              id="lp16-sheet-title"
              className="font-display lp16-display-sm mt-1.5 text-[1.6rem] leading-[1.1]"
            >
              Vamos tratar o seu sono?
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
                      backgroundColor: isSelected ? "var(--green-soft)" : "transparent",
                      color: isSelected ? "var(--ink)" : "var(--muted)",
                      transition: "border-color .15s ease, background-color .15s ease, color .15s ease",
                    }}
                  >
                    <span
                      className="flex size-[18px] shrink-0 items-center justify-center rounded-full border-2 transition-colors"
                      style={{
                        borderColor: isSelected ? "var(--green-500)" : "#d1d5db",
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

            <label htmlFor="lp16-nome" className="mt-5 block text-[13.5px] font-medium">
              Seu nome
            </label>
            <input
              id="lp16-nome"
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
                backgroundColor: ativo ? "var(--green-500)" : "#c5d4c9",
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
                  className="font-semibold text-[color:var(--green-ink)] underline underline-offset-4"
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
        .lp16-sheet {
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
        .lp16-sheet[open] { opacity: 1; transform: translateY(0); }
        @starting-style {
          .lp16-sheet[open] { opacity: 0; transform: translateY(24px); }
        }
        @media (min-width: 640px) {
          .lp16-sheet {
            inset: 50% auto auto 50%;
            translate: -50% -50%;
            transform: scale(.96);
          }
          .lp16-sheet[open] { transform: scale(1); }
          @starting-style {
            .lp16-sheet[open] { opacity: 0; transform: scale(.96); }
          }
        }
        .lp16-sheet::backdrop {
          background: rgba(0, 0, 0, 0.5);
        }
        @media (prefers-reduced-motion: reduce) {
          .lp16-sheet, .lp16-sheet[open], .lp16-sheet::backdrop { transition: none; }
        }
      `}</style>
    </>
  );
}
