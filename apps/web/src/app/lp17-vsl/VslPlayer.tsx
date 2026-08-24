"use client";

// Dobra única da /lp17: o vídeo é a página inteira.
//
// O filme é vertical (9:16) e tem legenda queimada, então entra mudo e em
// autoplay — quem chega do anúncio já entende a mensagem sem tocar em nada — e
// um overlay convida a ativar o som. Ativar o som reinicia do zero: quem só
// decide ouvir no meio perderia a abertura, que é onde mora o gancho.
//
// O CTA só nasce depois de UNLOCK_AT segundos de vídeo assistidos. Até lá o
// lugar dele fica ocupado por um contador, para a chegada do botão não empurrar
// a página.

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { sendGTMEvent } from "@next/third-parties/google";
import { UNLOCK_AT, openSchedule } from "./config";

const VIDEO_SRC = "/lp17/vsl.mp4";
const POSTER_SRC = "/lp17/vsl-poster.jpg";

export default function VslPlayer() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduceMotion = useReducedMotion();

  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [ended, setEnded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [remaining, setRemaining] = useState(UNLOCK_AT);
  const [unlocked, setUnlocked] = useState(false);

  // Ponto mais avançado já alcançado: ativar o som volta o filme ao início, e
  // sem isso o contador andaria para trás.
  const watchedRef = useRef(0);
  // Cada marco vale um evento por sessão — rever o filme não infla a métrica.
  const trackedUnlock = useRef(false);
  const trackedEnd = useRef(false);

  // Autoplay mudo. Com prefers-reduced-motion o filme espera o toque.
  useEffect(() => {
    const video = videoRef.current;
    if (!video || reduceMotion) return;
    video.play().catch(() => {
      // Política de autoplay recusou (economia de dados, etc.) — o poster e o
      // botão de play seguem disponíveis.
    });
  }, [reduceMotion]);

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      if (ended) video.currentTime = 0;
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [ended]);

  const enableSound = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = false;
    video.volume = 1;
    // Volta ao início: o gancho está nos primeiros segundos.
    video.currentTime = 0;
    video.play().catch(() => {});
    setMuted(false);
    sendGTMEvent({
      event: "vslSoundOn",
      category: "VSL",
      action: "Unmute",
      label: "Ativar som - LP17",
    });
  }, []);

  const replay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = 0;
    video.play().catch(() => {});
  }, []);

  const handleTimeUpdate = useCallback((video: HTMLVideoElement) => {
    if (video.duration) setProgress((video.currentTime / video.duration) * 100);

    if (watchedRef.current >= UNLOCK_AT) return;
    watchedRef.current = Math.max(watchedRef.current, video.currentTime);
    const falta = Math.max(0, Math.ceil(UNLOCK_AT - watchedRef.current));
    setRemaining(falta);

    if (watchedRef.current >= UNLOCK_AT) {
      setUnlocked(true);
      if (!trackedUnlock.current) {
        trackedUnlock.current = true;
        sendGTMEvent({
          event: "vslCtaUnlocked",
          category: "VSL",
          action: "Unlock",
          label: `CTA liberado (${UNLOCK_AT}s) - LP17`,
        });
      }
    }
  }, []);

  return (
    <div className="w-full max-w-[22rem]">
      <figure className="lp17-fade w-full">
        {/* Altura primeiro, largura derivada do 9:16 — assim o filme nunca
            empurra o CTA para fora da dobra. */}
        <div
          className="relative mx-auto aspect-[9/16] h-[min(60svh,32rem)] overflow-hidden rounded-3xl border lg:h-[min(64svh,36rem)]"
          style={{
            borderColor: "var(--line)",
            backgroundColor: "#000",
            boxShadow: "0 18px 44px rgba(17,24,39,.16)",
          }}
        >
          <video
            ref={videoRef}
            src={VIDEO_SRC}
            poster={POSTER_SRC}
            playsInline
            muted={muted}
            preload="auto"
            className="h-full w-full object-cover"
            onClick={togglePlay}
            onPlay={() => {
              setPlaying(true);
              setEnded(false);
            }}
            onPause={() => setPlaying(false)}
            onTimeUpdate={(e) => handleTimeUpdate(e.currentTarget)}
            onEnded={() => {
              setEnded(true);
              setPlaying(false);
              if (!trackedEnd.current) {
                trackedEnd.current = true;
                sendGTMEvent({
                  event: "vslCompleted",
                  category: "VSL",
                  action: "Complete",
                  label: "Vídeo assistido até o fim - LP17",
                });
              }
            }}
          />

          {/* Play central — aparece pausado ou quando o autoplay é recusado. */}
          {!playing && !ended && (
            <button
              type="button"
              onClick={togglePlay}
              aria-label="Reproduzir vídeo"
              className="absolute inset-0 flex items-center justify-center"
              style={{ backgroundColor: "rgba(9,17,12,.35)" }}
            >
              <span
                className="flex size-16 items-center justify-center rounded-full backdrop-blur"
                style={{ backgroundColor: "rgba(9,17,12,.6)", border: "1px solid var(--line)" }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff" aria-hidden="true">
                  <path d="M8 5.5v13l11-6.5L8 5.5z" />
                </svg>
              </span>
            </button>
          )}

          {/* Convite para o som — o filme tem locução, e ela é metade da peça. */}
          {muted && !ended && (
            <motion.button
              type="button"
              onClick={enableSound}
              initial={reduceMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              whileTap={reduceMotion ? undefined : { scale: 0.97 }}
              className="absolute inset-x-3 bottom-4 flex items-center justify-center gap-2 rounded-full px-4 py-3 text-[13.5px] font-semibold text-white backdrop-blur"
              style={{ backgroundColor: "rgba(61,143,74,.92)", boxShadow: "var(--shadow-float)" }}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M4 9v6h4l5 4V5L8 9H4zm12.5 3a4.5 4.5 0 00-2.5-4.03v8.06A4.5 4.5 0 0016.5 12zm-2.5 6.9a7 7 0 000-13.8v2.06a5 7 0 010 9.68v2.06z" />
              </svg>
              Toque para ouvir
            </motion.button>
          )}

          {/* Botão de mudo discreto, depois que o som já está ligado. */}
          {!muted && (
            <button
              type="button"
              onClick={() => {
                const video = videoRef.current;
                if (!video) return;
                video.muted = true;
                setMuted(true);
              }}
              aria-label="Desativar som"
              className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full backdrop-blur"
              style={{ backgroundColor: "rgba(9,17,12,.6)", border: "1px solid var(--line)" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff" aria-hidden="true">
                <path d="M4 9v6h4l5 4V5L8 9H4zm12.5 3a4.5 4.5 0 00-2.5-4.03v8.06A4.5 4.5 0 0016.5 12z" />
              </svg>
            </button>
          )}

          {/* Fim do filme: a decisão vem enquanto a última frase ainda ecoa. */}
          {ended && (
            <motion.div
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center"
              style={{ backgroundColor: "rgba(9,17,12,.86)" }}
            >
              <button
                type="button"
                onClick={() => openSchedule({ origem: "fim-do-video" })}
                className="w-full rounded-2xl px-6 py-3.5 text-[15px] font-bold text-white transition-all duration-150 hover:brightness-110"
                style={{ backgroundColor: "var(--green-500)", boxShadow: "var(--shadow-float)" }}
              >
                Iniciar meu Tratamento
              </button>
              <button
                type="button"
                onClick={replay}
                className="text-[13px] font-medium text-[color:var(--muted)] underline-offset-4 hover:underline"
              >
                Assistir de novo
              </button>
            </motion.div>
          )}

          {/* Progresso: indicador, não controle — a VSL não convida a pular. */}
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-[3px]"
            style={{ backgroundColor: "rgba(255,255,255,.14)" }}
          >
            <div
              className="h-full"
              style={{
                width: `${progress}%`,
                backgroundColor: "#59D172",
                transition: "width .18s linear",
              }}
            />
          </div>
        </div>
      </figure>

      {/* Contador e CTA dividem o mesmo espaço: a troca acontece sem salto. */}
      <div className="mt-5 min-h-[6.25rem] text-center">
        <AnimatePresence mode="wait" initial={false}>
          {unlocked ? (
            <motion.div
              key="cta"
              initial={reduceMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
            >
              <motion.button
                type="button"
                onClick={() => openSchedule({ origem: "cta-liberado" })}
                whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                className="lp17-cta w-full rounded-2xl py-4 text-base font-bold text-white transition-all duration-150 hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--green-500)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--bg)] sm:text-lg"
                style={{ backgroundColor: "var(--green-500)", boxShadow: "var(--shadow-float)" }}
              >
                Iniciar meu Tratamento
              </motion.button>
              <p className="mt-3 text-[12.5px] text-[color:var(--muted)]">
                Consulta R$50 · 100% online · Autorização ANVISA grátis
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="lock"
              initial={false}
              exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col items-center gap-2"
              aria-live="polite"
            >
              <div
                className="flex w-full items-center justify-center gap-2.5 rounded-2xl border border-dashed py-4 text-[14.5px] font-semibold text-[color:var(--muted)]"
                style={{ borderColor: "#CBD5D0", backgroundColor: "var(--bg-soft)" }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M7 10V7a5 5 0 0110 0v3"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                  <rect
                    x="4.5"
                    y="10"
                    width="15"
                    height="10.5"
                    rx="2.5"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />
                </svg>
                {playing
                  ? `Botão liberado em ${formatRemaining(remaining)}`
                  : "Assista ao vídeo para continuar"}
              </div>
              <p className="text-[12.5px] text-[color:var(--muted)]">
                Assista até o final para agendar sua consulta
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style>{`
        @keyframes lp17CtaWave {
          from { box-shadow: 0 0 0 0 rgba(61,143,74,.5); }
          to { box-shadow: 0 0 0 16px rgba(61,143,74,0); }
        }
        /* O botão chega depois de 45s de espera — o pulso avisa que ele chegou. */
        .lp17-cta { position: relative; isolation: isolate; }
        .lp17-cta::after {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          z-index: -1;
          animation: lp17CtaWave 1.8s cubic-bezier(.25,.8,.4,1) 3;
          pointer-events: none;
        }
        @media (prefers-reduced-motion: reduce) {
          .lp17-cta::after { animation: none; }
        }
      `}</style>
    </div>
  );
}

function formatRemaining(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}
