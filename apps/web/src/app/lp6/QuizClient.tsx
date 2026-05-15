"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { sendGTMEvent } from "@next/third-parties/google";
import { QUESTIONS, type Question } from "./questions";
import type { Testimonial } from "./page";
import TestimonialsSlider from "../lp5/TestimonialsSlider";

const PHONE = "5521993686082";
const TOTAL_NEEDED = 10;
const MAX_WRONG = 3;
const TIMER_MS = 15000;

type Screen = "intro" | "playing" | "wrong" | "won" | "lost";
type WrongReason = "wrong" | "timeout";

const PATOLOGIAS = [
  "Insônia", "Ansiedade", "Depressão", "Dores",
  "Perda de Peso", "TDAH", "Enxaqueca", "Tabagismo",
] as const;

function whatsappUrl(text: string) {
  return `https://api.whatsapp.com/send/?phone=${PHONE}&text=${encodeURIComponent(text)}&type=phone_number&app_absent=0`;
}

function buildWonWhatsAppUrl(name: string, patologias: string[]) {
  const list = patologias.map((p, i) => `${i + 1}. ${p}`).join("\n");
  const text = `Olá, me chamo ${name}.\n\nPatologias selecionadas:\n${list}\n\nAcabei de acertar 10 perguntas no quiz da Click Cannabis e quero resgatar minha consulta de acompanhamento gratuita!`;
  return whatsappUrl(text);
}

function buildLostWhatsAppUrl(name: string, patologias: string[]) {
  const list = patologias.map((p, i) => `${i + 1}. ${p}`).join("\n");
  const text = `Olá, me chamo ${name}.\n\nPatologias selecionadas:\n${list}\n\nJoguei o quiz da Click Cannabis e gostaria de saber mais sobre o tratamento com cannabis medicinal.`;
  return whatsappUrl(text);
}

function readCookie(name: string): string {
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
  return match?.[1] ?? "";
}

function readFbclid(): string {
  const fromUrl = new URLSearchParams(window.location.search).get("fbclid");
  if (fromUrl) return fromUrl;
  const fbc = readCookie("_fbc");
  if (!fbc) return "";
  const parts = fbc.split(".");
  return parts.length >= 4 ? parts.slice(3).join(".") : "";
}

function sendLeadToApi(name: string, patologies: string[]): void {
  const params = new URLSearchParams(window.location.search);
  const n = navigator as unknown as { appVersion: string; platform: string };
  const payload = {
    name,
    patologies,
    data: {
      fbclid: readFbclid(),
      language: navigator.language,
      platform: n.platform,
      referrer: document.referrer,
      utm_term: params.get("utm_term") ?? "",
      userAgent: navigator.userAgent,
      appVersion: n.appVersion,
      utm_medium: params.get("utm_medium") ?? "",
      utm_source: params.get("utm_source") ?? "",
      utm_content: params.get("utm_content") ?? "",
      utm_campaign: params.get("utm_campaign") ?? "",
    },
  };
  const body = JSON.stringify(payload);
  if (typeof navigator.sendBeacon === "function") {
    const blob = new Blob([body], { type: "application/json" });
    if (navigator.sendBeacon("/api/leads", blob)) return;
  }
  fetch("/api/leads", { method: "POST", headers: { "Content-Type": "application/json" }, body, keepalive: true }).catch(() => {});
}

function shuffle<T>(arr: readonly T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export default function QuizClient({ testimonials = [] }: { testimonials?: Testimonial[] }) {
  const [screen, setScreen] = useState<Screen>("intro");
  const [order, setOrder] = useState<Question[]>(QUESTIONS);
  const [index, setIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [lastQuestion, setLastQuestion] = useState<Question | null>(null);
  const [lastReason, setLastReason] = useState<WrongReason>("wrong");

  const current = order[index];
  const progress = useMemo(() => Array.from({ length: TOTAL_NEEDED }, (_, i) => i < correct), [correct]);
  const lives = useMemo(() => Array.from({ length: MAX_WRONG }, (_, i) => i < MAX_WRONG - wrong), [wrong]);

  function start() {
    setOrder(shuffle(QUESTIONS));
    setScreen("playing");
    setIndex(0);
    setCorrect(0);
    setWrong(0);
  }

  function answer(value: boolean) {
    if (!current) return;
    const isRight = value === current.answer;

    if (isRight) {
      const nextCorrect = correct + 1;
      setCorrect(nextCorrect);
      if (nextCorrect >= TOTAL_NEEDED) {
        setScreen("won");
        return;
      }
      setIndex(index + 1);
      return;
    }

    const nextWrong = wrong + 1;
    setWrong(nextWrong);
    setLastQuestion(current);
    setLastReason("wrong");
    if (nextWrong >= MAX_WRONG) {
      setScreen("lost");
      return;
    }
    setScreen("wrong");
  }

  function timeout() {
    if (!current) return;
    const nextWrong = wrong + 1;
    setWrong(nextWrong);
    setLastQuestion(current);
    setLastReason("timeout");
    if (nextWrong >= MAX_WRONG) {
      setScreen("lost");
      return;
    }
    setScreen("wrong");
  }

  function nextAfterWrong() {
    setIndex(index + 1);
    setScreen("playing");
  }

  return (
    <>
      <style>{`
        @keyframes qFadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes qScaleIn {
          from { opacity: 0; transform: scale(0.92); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes qPop {
          0% { transform: scale(0.6); opacity: 0; }
          60% { transform: scale(1.15); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes qShake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-8px); }
          40%, 80% { transform: translateX(8px); }
        }
        @keyframes qConfetti {
          0% { transform: translateY(-20px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0.6; }
        }
        @keyframes qPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.04); }
        }
        @keyframes qGlow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(74, 222, 128, 0.55); }
          50% { box-shadow: 0 0 0 18px rgba(74, 222, 128, 0); }
        }
        @keyframes qProgressFill {
          from { transform: scale(0); }
          to { transform: scale(1); }
        }
        .q-fade-up { animation: qFadeUp 500ms cubic-bezier(0.23, 1, 0.32, 1) forwards; }
        .q-scale-in { animation: qScaleIn 450ms cubic-bezier(0.23, 1, 0.32, 1) forwards; }
        .q-pop { animation: qPop 600ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
        .q-shake { animation: qShake 480ms cubic-bezier(0.36, 0.07, 0.19, 0.97); }
        .q-pulse { animation: qPulse 2.4s ease-in-out infinite; }
        .q-glow { animation: qGlow 2s ease-in-out infinite; }
        .q-fade-glow {
          animation:
            qFadeUp 500ms cubic-bezier(0.23, 1, 0.32, 1) forwards,
            qGlow 2.2s ease-in-out 900ms infinite;
        }
        .q-confetti-piece {
          position: absolute;
          top: -20px;
          width: 10px;
          height: 14px;
          border-radius: 2px;
          animation: qConfetti linear forwards;
        }
        .q-progress-fill { animation: qProgressFill 350ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
        .q-modal-sheet {
          transition: transform 320ms cubic-bezier(0.23, 1, 0.32, 1), opacity 260ms cubic-bezier(0.23, 1, 0.32, 1);
        }
        .q-modal-sheet[data-state="hidden"] { transform: translateY(100%); }
        .q-modal-sheet[data-state="visible"] { transform: translateY(0); }
        @media (min-width: 640px) {
          .q-modal-sheet[data-state="hidden"] { transform: translate(-50%, -50%) scale(0.93); opacity: 0; }
          .q-modal-sheet[data-state="visible"] { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        }
        .q-backdrop-anim { transition: opacity 280ms cubic-bezier(0.23, 1, 0.32, 1); }
        .q-backdrop-anim[data-state="hidden"] { opacity: 0; }
        .q-backdrop-anim[data-state="visible"] { opacity: 1; }
        @media (prefers-reduced-motion: reduce) {
          .q-fade-up, .q-scale-in, .q-pop, .q-shake, .q-pulse, .q-glow, .q-fade-glow, .q-confetti-piece, .q-progress-fill {
            animation: none !important;
            opacity: 1 !important;
          }
          .q-modal-sheet, .q-backdrop-anim { transition: none !important; }
        }
      `}</style>

      <main
        className="relative flex min-h-svh w-full flex-col bg-gradient-to-br from-[#f4faf5] via-white to-[#eaf5ec] text-gray-900"
        style={{ fontFamily: "var(--font-geist-sans), system-ui, sans-serif" }}
      >
        {screen === "intro" && <IntroScreen onStart={start} />}
        {screen === "playing" && current && (
          <PlayingScreen
            question={current}
            correct={correct}
            wrong={wrong}
            progress={progress}
            lives={lives}
            onAnswer={answer}
            onTimeout={timeout}
          />
        )}
        {screen === "wrong" && lastQuestion && (
          <WrongScreen
            question={lastQuestion}
            reason={lastReason}
            wrong={wrong}
            progress={progress}
            lives={lives}
            onNext={nextAfterWrong}
          />
        )}
        {screen === "won" && <WonScreen testimonials={testimonials} />}
        {screen === "lost" && <LostScreen correct={correct} onRetry={start} />}
      </main>
    </>
  );
}

function IntroScreen({ onStart }: { onStart: () => void }) {
  const [showInfo, setShowInfo] = useState(false);
  return (
    <>
      <section className="flex min-h-svh flex-col items-center justify-center px-6 py-8 text-center">
        <img
          src="/logo.svg"
          alt="Click Cannabis"
          width={180}
          height={26}
          className="q-fade-up mb-10 opacity-0"
          style={{ animationDelay: "0ms" }}
        />

        <div
          className="q-fade-up mb-5 inline-flex items-center gap-2 rounded-full border border-[#3a7a4f]/20 bg-[#3a7a4f]/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-[#1a5c30] opacity-0 uppercase"
          style={{ animationDelay: "100ms" }}
        >
          <span className="size-1.5 rounded-full bg-[#3a7a4f]" />
          Quiz Click Cannabis
        </div>

        <h1
          className="q-fade-up max-w-[20ch] text-[2rem] leading-[1.05] font-bold tracking-tight opacity-0 sm:text-5xl"
          style={{ animationDelay: "180ms" }}
        >
          Acerte <span className="text-[#3a7a4f]">10 perguntas</span> e ganhe uma consulta de acompanhamento <span className="text-[#3a7a4f]">100% gratuita!</span>
        </h1>

        <p
          className="q-fade-up mt-5 max-w-[36ch] text-base leading-relaxed text-gray-600 opacity-0 sm:text-lg"
          style={{ animationDelay: "260ms" }}
        >
          Teste seus conhecimentos sobre <strong>insônia e cannabis medicinal</strong>. Acertando 10, você ganha uma <strong>consulta de acompanhamento gratuita ao iniciar seu tratamento na Click!</strong>
        </p>

        <button
          type="button"
          onClick={onStart}
          className="q-fade-glow mt-10 inline-flex items-center justify-center gap-2 rounded-2xl bg-[#3a7a4f] px-10 py-5 text-lg font-semibold text-white opacity-0 shadow-lg shadow-[#3a7a4f]/30 transition-transform duration-150 active:scale-95"
          style={{ animationDelay: "360ms" }}
        >
          Começar
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M5 12h14m0 0l-6-6m6 6l-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <p
          className="q-fade-up mt-6 text-xs text-gray-400 opacity-0"
          style={{ animationDelay: "440ms" }}
        >
          Você pode errar até {MAX_WRONG} vezes
        </p>

        <button
          type="button"
          onClick={() => setShowInfo(true)}
          className="q-fade-up mt-3 text-xs text-[#3a7a4f]/70 opacity-0 underline underline-offset-2 transition-colors hover:text-[#3a7a4f]"
          style={{ animationDelay: "500ms" }}
        >
          O que é uma consulta de acompanhamento?
        </button>
      </section>

      {showInfo && <ConsultaInfoModal onClose={() => setShowInfo(false)} />}
    </>
  );
}

function ConsultaInfoModal({ onClose }: { onClose: () => void }) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const dragStartY = useRef<number | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  function close() {
    setVisible(false);
    setTimeout(onClose, 320);
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") close(); }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onTouchStart(e: React.TouchEvent) {
    if (sheetRef.current && sheetRef.current.scrollTop === 0) {
      dragStartY.current = e.touches[0].clientY;
    } else {
      dragStartY.current = null;
    }
  }

  function onTouchEnd(e: React.TouchEvent) {
    if (dragStartY.current === null) return;
    const delta = e.changedTouches[0].clientY - dragStartY.current;
    if (delta > 80) close();
    dragStartY.current = null;
  }

  const state = visible ? "visible" : "hidden";

  return (
    <>
      <div
        className="q-backdrop-anim fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
        data-state={state}
        onClick={close}
        aria-hidden="true"
      />
      <div
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="consulta-modal-title"
        className="q-modal-sheet fixed inset-x-0 bottom-0 z-50 max-h-[88svh] overflow-y-auto rounded-t-3xl bg-white px-6 pb-10 pt-4 shadow-2xl sm:inset-auto sm:left-1/2 sm:top-1/2 sm:w-full sm:max-w-md sm:rounded-3xl sm:px-8 sm:py-8"
        data-state={state}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-gray-200 sm:hidden" />

        <button
          type="button"
          onClick={close}
          aria-label="Fechar"
          className="absolute right-4 top-4 flex size-8 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
        </button>

        <div className="mb-4 flex size-11 items-center justify-center rounded-2xl bg-[#f0f7f1]">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="10" stroke="#3a7a4f" strokeWidth="2" />
            <path d="M12 8v4m0 4v.01" stroke="#3a7a4f" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
        </div>

        <h2 id="consulta-modal-title" className="mb-1 text-xl font-bold tracking-tight text-gray-900">
          Consulta de acompanhamento
        </h2>
        <p className="mb-5 text-sm leading-relaxed text-gray-500">
          Uma etapa essencial para garantir que o seu tratamento está no caminho certo.
        </p>

        <ul className="space-y-3">
          {([
            {
              icon: <path d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" stroke="#3a7a4f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />,
              text: "Acontece em até 30 dias após o início do tratamento na Click.",
            },
            {
              icon: <path d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zM12 12v4m-2-2h4" stroke="#3a7a4f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />,
              text: "O médico avalia se o tratamento está funcionando para você.",
            },
            {
              icon: <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" stroke="#3a7a4f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />,
              text: "A dosagem é ajustada conforme a sua resposta ao tratamento.",
            },
            {
              icon: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#3a7a4f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />,
              text: "Garante que você avança com segurança e suporte médico completo.",
            },
          ] as { icon: React.ReactNode; text: string }[]).map(({ icon, text }, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-xl bg-[#f0f7f1]">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  {icon}
                </svg>
              </span>
              <p className="text-sm leading-relaxed text-gray-700">{text}</p>
            </li>
          ))}
        </ul>

        <div className="mt-6 rounded-2xl bg-[#f0f7f1] px-4 py-3">
          <p className="text-xs leading-relaxed text-[#1a5c30]">
            <strong>Se você ganhar no quiz</strong>, sua primeira consulta de acompanhamento é <strong>totalmente gratuita!</strong>
          </p>
        </div>
      </div>
    </>
  );
}

function TopHud({
  progress,
  lives,
  questionNumber,
}: {
  progress: boolean[];
  lives: boolean[];
  questionNumber: number;
}) {
  return (
    <header className="sticky top-0 z-10 w-full border-b border-gray-100 bg-white/85 backdrop-blur">
      <div className="mx-auto flex w-full max-w-2xl items-center justify-between gap-4 px-5 py-3">
        <div className="flex flex-1 items-center gap-1.5">
          {progress.map((filled, i) => (
            <div
              key={i}
              className={`h-2 flex-1 rounded-full transition-colors duration-300 ${filled ? "bg-[#3a7a4f]" : "bg-gray-200"}`}
            >
              {filled && <div className="q-progress-fill h-full origin-left rounded-full bg-[#3a7a4f]" />}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-1" aria-label={`Vidas: ${lives.filter(Boolean).length} de ${lives.length}`}>
          {lives.map((alive, i) => (
            <Heart key={i} alive={alive} />
          ))}
        </div>
      </div>
      <div className="mx-auto flex w-full max-w-2xl items-center justify-between px-5 pb-2 text-[11px] font-medium tracking-wide text-gray-500 uppercase">
        <span>Pergunta {questionNumber}</span>
        <span>
          {progress.filter(Boolean).length}/{progress.length} acertos
        </span>
      </div>
    </header>
  );
}

function Heart({ alive }: { alive: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill={alive ? "#ef4444" : "none"} aria-hidden="true">
      <path
        d="M12 21s-7-4.35-9.5-9.13C.65 8.31 2.6 4.5 6.4 4.5c2 0 3.5 1 4.6 2.5c1.1-1.5 2.6-2.5 4.6-2.5c3.8 0 5.75 3.81 3.9 7.37C19 16.65 12 21 12 21z"
        stroke={alive ? "#ef4444" : "#d1d5db"}
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Timer({
  totalMs,
  onTimeout,
}: {
  totalMs: number;
  onTimeout: () => void;
}) {
  const barRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const onTimeoutRef = useRef(onTimeout);
  onTimeoutRef.current = onTimeout;

  useEffect(() => {
    const start = performance.now();
    let rafId: number;

    function tick() {
      const elapsed = performance.now() - start;
      const remaining = Math.max(0, totalMs - elapsed);
      const pct = (remaining / totalMs) * 100;

      const color =
        remaining > 10000 ? "#3a7a4f" : remaining > 5000 ? "#f59e0b" : "#ef4444";

      if (barRef.current) {
        barRef.current.style.width = `${pct}%`;
        barRef.current.style.backgroundColor = color;
      }

      if (textRef.current) {
        const secs = Math.floor(remaining / 1000);
        const ms = Math.floor(remaining % 1000);
        textRef.current.textContent = `${secs}.${String(ms).padStart(3, "0")}s`;
        textRef.current.style.color = color;
      }

      if (remaining <= 0) {
        onTimeoutRef.current();
        return;
      }
      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [totalMs]);

  return (
    <div className="w-full max-w-2xl">
      <div className="mb-1.5 flex items-center justify-between px-0.5">
        <span className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase">Tempo</span>
        <span
          ref={textRef}
          className="font-mono text-xl font-bold tabular-nums"
          style={{ color: "#3a7a4f" }}
        >
          15.000s
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
        <div
          ref={barRef}
          className="h-full rounded-full"
          style={{ width: "100%", backgroundColor: "#3a7a4f" }}
        />
      </div>
    </div>
  );
}

function PlayingScreen({
  question,
  correct,
  wrong,
  progress,
  lives,
  onAnswer,
  onTimeout,
}: {
  question: Question;
  correct: number;
  wrong: number;
  progress: boolean[];
  lives: boolean[];
  onAnswer: (v: boolean) => void;
  onTimeout: () => void;
}) {
  const questionNumber = correct + wrong + 1;
  return (
    <div className="flex min-h-svh w-full flex-col">
      <TopHud progress={progress} lives={lives} questionNumber={questionNumber} />

      <section className="flex flex-1 flex-col items-center justify-center px-5 py-8">
        <Timer key={question.id} totalMs={TIMER_MS} onTimeout={onTimeout} />

        <div
          key={`card-${question.id}`}
          className="q-scale-in mt-4 w-full max-w-2xl rounded-3xl border border-gray-100 bg-white p-7 shadow-xl shadow-gray-900/5 opacity-0 sm:p-10"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#f0f7f1] px-3 py-1 text-[11px] font-semibold tracking-wide text-[#1a5c30] uppercase">
            Verdadeiro ou Falso?
          </div>
          <h2 className="text-[1.4rem] leading-snug font-semibold text-gray-900 sm:text-2xl">
            {question.statement}
          </h2>
        </div>

        <div
          key={`btns-${question.id}`}
          className="q-fade-up mt-5 grid w-full max-w-2xl grid-cols-2 gap-3 opacity-0 sm:gap-4"
          style={{ animationDelay: "180ms" }}
        >
          <AnswerButton variant="true" onClick={() => onAnswer(true)} />
          <AnswerButton variant="false" onClick={() => onAnswer(false)} />
        </div>
      </section>
    </div>
  );
}

function AnswerButton({ variant, onClick }: { variant: "true" | "false"; onClick: () => void }) {
  const isTrue = variant === "true";
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex flex-col items-center justify-center gap-2 rounded-2xl border-2 px-4 py-6 font-semibold transition-all duration-150 active:scale-[0.97] sm:py-8 ${
        isTrue
          ? "border-[#3a7a4f]/30 bg-white text-[#1a5c30] hover:border-[#3a7a4f] hover:bg-[#f0f7f1]"
          : "border-red-200 bg-white text-red-700 hover:border-red-400 hover:bg-red-50"
      }`}
    >
      <span
        className={`flex size-12 items-center justify-center rounded-full transition-colors sm:size-14 ${
          isTrue
            ? "bg-[#3a7a4f]/10 text-[#3a7a4f] group-hover:bg-[#3a7a4f] group-hover:text-white"
            : "bg-red-100 text-red-500 group-hover:bg-red-500 group-hover:text-white"
        }`}
      >
        {isTrue ? (
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M5 12.5l4.5 4.5L19 7.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        )}
      </span>
      <span className="text-base tracking-wide sm:text-lg">{isTrue ? "Verdadeiro" : "Falso"}</span>
    </button>
  );
}

function WrongScreen({
  question,
  reason,
  wrong,
  progress,
  lives,
  onNext,
}: {
  question: Question;
  reason: WrongReason;
  wrong: number;
  progress: boolean[];
  lives: boolean[];
  onNext: () => void;
}) {
  const remaining = MAX_WRONG - wrong;
  return (
    <div className="flex min-h-svh w-full flex-col">
      <TopHud progress={progress} lives={lives} questionNumber={progress.filter(Boolean).length + wrong} />

      <section className="flex flex-1 flex-col items-center justify-center px-5 py-8">
        <div className="q-shake mb-4 flex size-20 items-center justify-center rounded-full bg-red-100 text-red-500 sm:size-24">
          {reason === "timeout" ? (
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5" />
              <path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" />
            </svg>
          )}
        </div>
        <p className="mb-1 text-sm font-semibold tracking-wide text-red-500 uppercase">
          {reason === "timeout" ? "Tempo esgotado!" : "Resposta incorreta"}
        </p>
        <h2 className="mb-6 max-w-[20ch] text-center text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          A resposta era <span className="text-[#3a7a4f]">{question.answer ? "Verdadeiro" : "Falso"}</span>
        </h2>

        <div className="q-scale-in w-full max-w-2xl rounded-3xl border border-gray-100 bg-white p-6 shadow-lg shadow-gray-900/5 opacity-0 sm:p-8">
          <p className="mb-2 text-xs font-semibold tracking-wide text-gray-400 uppercase">Sobre a afirmação</p>
          <p className="mb-4 text-base font-medium text-gray-700 italic sm:text-lg">
            &ldquo;{question.statement}&rdquo;
          </p>
          <div className="rounded-xl bg-[#f0f7f1] p-4 sm:p-5">
            <p className="text-sm leading-relaxed text-gray-700 sm:text-base">{question.explanation}</p>
          </div>
        </div>

        <p className="mt-6 text-sm text-gray-500">
          Você ainda tem <strong className="text-red-500">{remaining}</strong> {remaining === 1 ? "chance" : "chances"}
        </p>

        <button
          type="button"
          onClick={onNext}
          className="mt-4 inline-flex items-center justify-center gap-2 rounded-2xl bg-[#3a7a4f] px-8 py-4 text-base font-semibold text-white shadow-lg shadow-[#3a7a4f]/25 transition-transform duration-150 active:scale-95"
        >
          Próxima pergunta
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M5 12h14m0 0l-6-6m6 6l-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </section>
    </div>
  );
}

function ConfettiBurst() {
  const colors = ["#3a7a4f", "#7dc695", "#fbbf24", "#60a5fa", "#f472b6", "#34d399"];
  const pieces = Array.from({ length: 60 });
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {pieces.map((_, i) => (
        <span
          key={i}
          className="q-confetti-piece"
          style={{
            left: `${Math.random() * 100}%`,
            background: colors[i % colors.length],
            animationDuration: `${2.5 + Math.random() * 2}s`,
            animationDelay: `${Math.random() * 0.6}s`,
            transform: `rotate(${Math.random() * 360}deg)`,
          }}
        />
      ))}
    </div>
  );
}

const WPP_ICON = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M20.52 3.48A11.93 11.93 0 0 0 12 0C5.37 0 0 5.37 0 12c0 2.11.55 4.17 1.6 5.98L0 24l6.18-1.62A11.93 11.93 0 0 0 12 24c6.63 0 12-5.37 12-12c0-3.19-1.24-6.19-3.48-8.52zM12 22a9.93 9.93 0 0 1-5.06-1.39l-.36-.21l-3.67.96l.98-3.58l-.23-.37A9.93 9.93 0 0 1 2 12C2 6.48 6.48 2 12 2s10 4.48 10 10s-4.48 10-10 10zm5.5-7.49c-.3-.15-1.78-.88-2.05-.98c-.27-.1-.47-.15-.67.15c-.2.3-.77.98-.95 1.18c-.18.2-.35.22-.65.07c-.3-.15-1.26-.47-2.4-1.48c-.89-.79-1.49-1.77-1.66-2.07c-.18-.3-.02-.46.13-.61c.14-.14.3-.35.45-.52c.15-.18.2-.3.3-.5c.1-.2.05-.37-.02-.52c-.07-.15-.67-1.62-.92-2.22c-.24-.58-.49-.5-.67-.51l-.57-.01c-.2 0-.52.07-.79.37c-.27.3-1.04 1.02-1.04 2.48c0 1.46 1.06 2.87 1.21 3.07c.15.2 2.09 3.19 5.07 4.47c.71.31 1.26.49 1.69.63c.71.23 1.35.2 1.86.12c.57-.08 1.78-.73 2.03-1.43c.25-.7.25-1.3.18-1.43c-.07-.13-.27-.2-.57-.35z"/>
  </svg>
);

function WonScreen({ testimonials }: { testimonials: Testimonial[] }) {
  const [showModal, setShowModal] = useState(false);

  function openLeadModal() {
    setShowModal(true);
    setTimeout(() => {
      sendGTMEvent({
        event: "buttonClick",
        category: "Lead",
        action: "Click",
        label: "Abrir modal - LP6",
        value: "quiz_winner",
      });
    }, 0);
  }

  return (
    <div className="w-full">
      {/* ── Hero ── */}
      <section className="relative flex flex-col items-center overflow-hidden px-6 pb-12 pt-14 text-center">
        <ConfettiBurst />

        <div className="q-pop relative z-10 mb-6 flex size-24 items-center justify-center rounded-full bg-gradient-to-br from-[#3a7a4f] to-[#1a5c30] text-white shadow-2xl shadow-[#3a7a4f]/40 sm:size-28">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M5 12.5l4.5 4.5L19 7.5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <div className="q-fade-up relative z-10 mb-3 inline-flex items-center gap-2 rounded-full bg-[#3a7a4f]/10 px-4 py-1.5 text-xs font-bold tracking-wide text-[#1a5c30] opacity-0 uppercase" style={{ animationDelay: "180ms" }}>
          Você ganhou
        </div>

        <h1 className="q-fade-up relative z-10 max-w-[18ch] text-[2rem] leading-[1.05] font-bold tracking-tight text-gray-900 opacity-0 sm:text-4xl" style={{ animationDelay: "260ms" }}>
          Consulta de acompanhamento <span className="text-[#3a7a4f]">100% gratuita!</span>
        </h1>

        <p className="q-fade-up relative z-10 mt-4 max-w-[34ch] text-base leading-relaxed text-gray-600 opacity-0" style={{ animationDelay: "340ms" }}>
          Parabéns! Você acertou todas as 10 perguntas. Resgate agora sua consulta de acompanhamento gratuita.
        </p>

        <button
          type="button"
          onClick={openLeadModal}
          className="q-fade-glow relative z-10 mt-8 inline-flex items-center justify-center gap-3 rounded-2xl bg-[#25d366] px-9 py-5 text-base font-semibold text-white opacity-0 shadow-lg shadow-[#25d366]/30 transition-transform duration-150 active:scale-95 sm:text-lg"
          style={{ animationDelay: "420ms" }}
        >
          {WPP_ICON}
          Resgatar no WhatsApp
        </button>
        <p className="q-fade-up relative z-10 mt-4 text-xs text-gray-400 opacity-0" style={{ animationDelay: "500ms" }}>
          Resposta em poucos minutos pelo time da Click
        </p>
      </section>

      {/* ── Pricing ── */}
      <section className="bg-white px-5 py-12">
        <div className="mx-auto max-w-2xl">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-[11px] font-bold tracking-wide text-amber-700 uppercase">
            <span className="size-1.5 rounded-full bg-amber-500" />
            Promoção por tempo limitado
          </div>
          <h2 className="mb-8 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Entenda quanto você está economizando
          </h2>

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="flex flex-col rounded-2xl border-2 border-gray-100 bg-gray-50 p-5">
              <p className="mb-1 text-[11px] font-semibold tracking-wide text-gray-400 uppercase">Preço normal</p>
              <p className="mb-3 text-[2rem] font-bold leading-none tracking-tight text-gray-300 line-through sm:text-4xl">R$125</p>
              <p className="text-sm text-gray-400 leading-snug">por consulta</p>
              <div className="mt-4 rounded-xl bg-gray-100 px-3 py-2.5 text-center">
                <p className="text-xs text-gray-400">2 consultas</p>
                <p className="text-lg font-bold text-gray-300 line-through">R$250</p>
              </div>
            </div>

            <div className="flex flex-col rounded-2xl border-2 border-[#3a7a4f] bg-[#f0f7f1] p-5 shadow-lg shadow-[#3a7a4f]/10">
              <p className="mb-1 text-[11px] font-semibold tracking-wide text-[#1a5c30] uppercase">Seu prêmio</p>
              <p className="mb-3 text-[2rem] font-bold leading-none tracking-tight text-[#3a7a4f] sm:text-4xl">R$25</p>
              <p className="text-sm text-[#1a5c30] leading-snug font-medium">por consulta</p>
              <div className="mt-4 rounded-xl bg-[#3a7a4f] px-3 py-2.5 text-center">
                <p className="text-xs text-white/70">2 consultas</p>
                <p className="text-lg font-bold text-white">R$50</p>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl bg-gradient-to-r from-[#3a7a4f] to-[#1a5c30] px-5 py-4 text-white">
            <div>
              <p className="text-xs font-semibold text-white/70 uppercase tracking-wide">Sua economia total</p>
              <p className="text-2xl font-bold sm:text-3xl">R$200 de desconto</p>
            </div>
            <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-white/20">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17 5.8 21.3l2.4-7.4L2 9.4h7.6L12 2z" fill="currentColor" />
              </svg>
            </div>
          </div>

          <p className="mt-4 text-center text-xs text-gray-400">
            Cada consulta vale R$125 · Você paga apenas R$25 por cada uma
          </p>
        </div>
      </section>

      {/* ── Testimonials ── */}
      {testimonials.length > 0 && (
        <TestimonialsSlider
          items={testimonials}
          titleLight="Pacientes reais que"
          titleBold="trataram insônia com a Click"
        />
      )}

      {/* ── Final CTA ── */}
      <section className="bg-white px-5 py-12 text-center">
        <div className="mx-auto max-w-xl">
          <h2 className="mb-3 text-2xl font-bold tracking-tight text-gray-900">Pronto para dormir melhor?</h2>
          <p className="mb-8 text-base text-gray-500 leading-relaxed">
            Fale agora com a Click no WhatsApp e resgate sua consulta de acompanhamento gratuita.
          </p>
          <button
            type="button"
            onClick={openLeadModal}
            className="inline-flex items-center justify-center gap-3 rounded-2xl bg-[#25d366] px-10 py-5 text-lg font-semibold text-white shadow-lg shadow-[#25d366]/25 transition-transform duration-150 active:scale-95"
          >
            {WPP_ICON}
            Resgatar no WhatsApp
          </button>
          <p className="mt-4 text-xs text-gray-400">Resposta em poucos minutos pelo time da Click</p>
        </div>
      </section>

      {showModal && <WonLeadModal mode="won" onClose={() => setShowModal(false)} />}
    </div>
  );
}

function WonLeadModal({ onClose, mode }: { onClose: () => void; mode: "won" | "lost" }) {
  const [name, setName] = useState("");
  const [showError, setShowError] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(() => new Set(["Insônia"]));
  const [visible, setVisible] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dragStartY = useRef<number | null>(null);
  const hasSubmitted = useRef(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      setVisible(true);
      inputRef.current?.focus();
    });
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  function close() {
    setVisible(false);
    setTimeout(onClose, 320);
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") close(); }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function toggle(p: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(p)) next.delete(p); else next.add(p);
      return next;
    });
  }

  function onTouchStart(e: React.TouchEvent) {
    if (sheetRef.current && sheetRef.current.scrollTop === 0)
      dragStartY.current = e.touches[0].clientY;
    else dragStartY.current = null;
  }

  function onTouchEnd(e: React.TouchEvent) {
    if (dragStartY.current === null) return;
    if (e.changedTouches[0].clientY - dragStartY.current > 80) close();
    dragStartY.current = null;
  }

  function handleSubmit() {
    const trimmed = name.trim();
    if (!trimmed) { setShowError(true); inputRef.current?.focus(); return; }
    if (hasSubmitted.current) return;
    hasSubmitted.current = true;

    const patologias = Array.from(selected);

    sendLeadToApi(trimmed, patologias);

    sendGTMEvent({
      event: "buttonWhatsappClicked",
      category: "Lead",
      action: "Click",
      label: mode === "won" ? "Resgatar consulta - LP6" : "Iniciar tratamento - LP6",
      value: patologias.join(", "),
    });

    const url = mode === "won"
      ? buildWonWhatsAppUrl(trimmed, patologias)
      : buildLostWhatsAppUrl(trimmed, patologias);
    window.open(url, "_blank", "noopener,noreferrer");
    close();
  }

  const state = visible ? "visible" : "hidden";

  return (
    <>
      <div
        className="q-backdrop-anim fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
        data-state={state}
        onClick={close}
        aria-hidden="true"
      />
      <div
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="won-modal-title"
        className="q-modal-sheet fixed inset-x-0 bottom-0 z-50 max-h-[92svh] overflow-y-auto rounded-t-3xl bg-white px-5 pb-10 pt-4 shadow-2xl sm:inset-auto sm:left-1/2 sm:top-1/2 sm:w-full sm:max-w-md sm:rounded-3xl sm:px-8 sm:py-8"
        data-state={state}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-gray-200 sm:hidden" />

        <button
          type="button"
          onClick={close}
          aria-label="Fechar"
          className="absolute right-4 top-4 flex size-8 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
        </button>

        <h2 id="won-modal-title" className="mb-1 text-xl font-bold tracking-tight text-gray-900">
          {mode === "won" ? "Quase lá!" : "Fale com a Click"}
        </h2>
        <p className="mb-6 text-sm leading-relaxed text-gray-500">
          Informe seus dados para personalizarmos seu atendimento.
        </p>

        {/* Name */}
        <label className="mb-1 block text-sm font-semibold text-gray-700" htmlFor="won-name">
          Nome <span className="text-red-500">*</span>
        </label>
        <input
          ref={inputRef}
          id="won-name"
          type="text"
          autoComplete="name"
          placeholder="Seu nome completo"
          value={name}
          onChange={(e) => { setName(e.target.value); if (showError) setShowError(false); }}
          onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); }}
          className={`mb-1 w-full rounded-xl border-2 px-4 py-3 text-base outline-none transition-colors ${showError ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-[#3a7a4f]"}`}
          style={{ fontSize: "16px" }}
        />
        {showError && <p className="mb-4 text-xs text-red-500">Por favor, informe seu nome.</p>}
        {!showError && <div className="mb-4" />}

        {/* Pathologies */}
        <p className="mb-2 text-sm font-semibold text-gray-700">
          Patologias <span className="font-normal text-gray-400">(selecione uma ou mais)</span>
        </p>
        <div className="mb-6 grid grid-cols-2 gap-2" role="group" aria-label="Patologias">
          {PATOLOGIAS.map((p) => {
            const isSelected = selected.has(p);
            return (
              <button
                key={p}
                type="button"
                role="checkbox"
                aria-checked={isSelected}
                onClick={() => toggle(p)}
                className="flex items-center gap-2.5 rounded-xl border-2 px-3 py-2.5 text-left text-sm font-medium transition-colors select-none"
                style={{
                  borderColor: isSelected ? "#3a7a4f" : "#e5e7eb",
                  backgroundColor: isSelected ? "#f0f7f1" : "white",
                  color: isSelected ? "#1a5c30" : "#374151",
                }}
              >
                <span
                  className="flex size-4 shrink-0 items-center justify-center rounded-full border-2 transition-all"
                  style={{
                    borderColor: isSelected ? "#3a7a4f" : "#d1d5db",
                    backgroundColor: isSelected ? "#3a7a4f" : "transparent",
                  }}
                  aria-hidden="true"
                >
                  {isSelected && (
                    <svg width="9" height="9" viewBox="0 0 12 12" fill="none">
                      <path d="M3 6l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </span>
                <span className="min-w-0 flex-1 truncate">{p}</span>
              </button>
            );
          })}
        </div>

        {/* Submit */}
        <button
          type="button"
          onClick={handleSubmit}
          className="w-full inline-flex items-center justify-center gap-3 rounded-2xl bg-[#25d366] px-6 py-4 text-base font-semibold text-white shadow-lg shadow-[#25d366]/25 transition-transform duration-150 active:scale-95"
        >
          {WPP_ICON}
          Resgatar no WhatsApp
        </button>
      </div>
    </>
  );
}

function LostScreen({ correct, onRetry }: { correct: number; onRetry: () => void }) {
  const [showModal, setShowModal] = useState(false);

  function openLeadModal() {
    setShowModal(true);
    setTimeout(() => {
      sendGTMEvent({
        event: "buttonClick",
        category: "Lead",
        action: "Click",
        label: "Abrir modal - LP6",
        value: "quiz_loser",
      });
    }, 0);
  }

  return (
    <section className="flex min-h-svh flex-col items-center justify-center px-6 py-10 text-center">
      <div className="q-pop mb-6 flex size-24 items-center justify-center rounded-full bg-gray-100 text-gray-500 sm:size-28">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 8v5m0 3v.01M4.93 19h14.14a2 2 0 0 0 1.73-3L12.73 4a2 2 0 0 0-3.46 0L3.2 16a2 2 0 0 0 1.73 3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <div className="q-fade-up mb-3 inline-flex items-center gap-2 rounded-full bg-gray-100 px-4 py-1.5 text-xs font-bold tracking-wide text-gray-600 opacity-0 uppercase" style={{ animationDelay: "120ms" }}>
        Quase lá
      </div>

      <h1
        className="q-fade-up max-w-[18ch] text-[2rem] leading-[1.1] font-bold tracking-tight text-gray-900 opacity-0 sm:text-4xl"
        style={{ animationDelay: "200ms" }}
      >
        Você acertou <span className="text-[#3a7a4f]">{correct}</span> de {TOTAL_NEEDED} perguntas
      </h1>

      <p
        className="q-fade-up mt-5 max-w-[36ch] text-base leading-relaxed text-gray-600 opacity-0 sm:text-lg"
        style={{ animationDelay: "280ms" }}
      >
        Dessa vez não rolou a consulta gratuita — mas a Click ainda tem muito a te oferecer. Fale com nosso time e descubra como podemos cuidar do seu sono.
      </p>

      <button
        type="button"
        onClick={openLeadModal}
        className="q-fade-up mt-9 inline-flex items-center justify-center gap-3 rounded-2xl bg-[#25d366] px-10 py-5 text-lg font-semibold text-white opacity-0 shadow-lg shadow-[#25d366]/25 transition-transform duration-150 active:scale-95"
        style={{ animationDelay: "360ms" }}
      >
        {WPP_ICON}
        Falar com a Click
      </button>

      <button
        type="button"
        onClick={onRetry}
        className="q-fade-up mt-4 inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-gray-200 bg-white px-8 py-4 text-base font-semibold text-gray-700 opacity-0 transition-colors duration-150 hover:border-[#3a7a4f] hover:text-[#1a5c30] active:scale-95"
        style={{ animationDelay: "440ms" }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M3 12a9 9 0 1 0 3-6.7M3 4v5h5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Tentar novamente
      </button>

      {showModal && <WonLeadModal mode="lost" onClose={() => setShowModal(false)} />}
    </section>
  );
}
