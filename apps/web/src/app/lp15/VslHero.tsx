"use client";

// Dobra da VSL: o filme do Pedro Machado é a peça central da página.
//
// O vídeo é vertical (9:16) e tem legenda queimada, então ele entra mudo e em
// autoplay — quem chega de anúncio já entende a mensagem sem tocar em nada — e
// um overlay convida a ativar o som. Ativar o som reinicia do zero: quem só
// decide ouvir no meio perderia a abertura, que é onde mora o gancho.

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { sendGTMEvent } from "@next/third-parties/google";
import { openSchedule } from "./config";

const VIDEO_SRC = "/lp15/pedro-vsl.mp4";
const POSTER_SRC = "/lp15/pedro-vsl-poster.jpg";

export default function VslHero() {
  return (
    <section className="relative overflow-hidden">
      {/* Fundo: holofote verde baixo, mesma linguagem do filme. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 70% at 50% 105%, var(--green-glow) 0%, rgba(11,13,11,0) 55%), radial-gradient(90% 55% at 50% -10%, rgba(89,209,114,.07) 0%, rgba(11,13,11,0) 60%)",
        }}
      />

      {/* Coluna única em toda largura de tela: sem headline nem parágrafo, duas
          colunas deixariam metade do desktop vazia ao lado do filme. */}
      <div className="relative z-10 mx-auto flex w-full max-w-xl flex-col items-center px-5 pb-10 pt-6 sm:pt-9 lg:pb-14 lg:pt-10">
        <header className="mb-5 text-center lg:mb-7">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.svg"
            alt="Click Cannabis"
            width={168}
            height={24}
            fetchPriority="high"
            decoding="async"
            className="lp15-fade mx-auto h-[24px] w-auto brightness-0 invert lg:h-[26px]"
          />
          {/* Sem headline, o filme fala por si — mas a página não pode ficar sem
              título, então o eyebrow assume o h1. */}
          <h1
            className="lp15-fade mt-4 text-[11.5px] font-semibold uppercase tracking-[0.22em] text-[color:var(--green-bright)]"
            style={{ animationDelay: "90ms" }}
          >
            Click Cannabis no esporte
          </h1>
        </header>

        <VideoPlayer />
        <Pitch />
      </div>

      <style>{`
        @keyframes lp15FadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes lp15FadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        /* Entrada em CSS puro: o tráfego vem de navegador in-app, onde esperar
           a hidratação para revelar a dobra custa caro. */
        .lp15-fade {
          opacity: 0;
          animation: lp15FadeUp 600ms cubic-bezier(0.23, 1, 0.32, 1) forwards;
        }
        .lp15-fade-flat {
          opacity: 0;
          animation: lp15FadeIn 500ms cubic-bezier(0.23, 1, 0.32, 1) forwards;
        }
        @media (prefers-reduced-motion: reduce) {
          .lp15-fade, .lp15-fade-flat { animation: none; opacity: 1; }
        }
      `}</style>

      {/* Âncora do sticky: passou do filme, o CTA fixo entra. */}
      <div id="lp15-hero-end" aria-hidden="true" className="absolute bottom-0 h-px w-px" />
    </section>
  );
}

function VideoPlayer() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduceMotion = useReducedMotion();

  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [ended, setEnded] = useState(false);
  const [progress, setProgress] = useState(0);

  // Só marcamos a conclusão uma vez por sessão: rever o filme não deve inflar
  // a métrica de retenção.
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
      label: "Ativar som - LP15",
    });
  }, []);

  const replay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = 0;
    video.play().catch(() => {});
  }, []);

  return (
    <figure className="lp15-fade w-full max-w-[22rem] lg:max-w-none">
      {/* Altura primeiro, largura derivada do 9:16 — assim o filme nunca empurra
          o CTA para fora da dobra. No desktop sobra altura, e é ela que o
          filme ganha: 66svh contra os 58svh do celular. */}
      <div
        className="relative mx-auto aspect-[9/16] h-[min(58svh,32rem)] overflow-hidden rounded-3xl border lg:h-[min(60svh,34rem)]"
        style={{
          borderColor: "var(--line)",
          backgroundColor: "#000",
          boxShadow: "0 24px 60px rgba(0,0,0,.55)",
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
          onTimeUpdate={(e) => {
            const v = e.currentTarget;
            if (v.duration) setProgress((v.currentTime / v.duration) * 100);
          }}
          onEnded={() => {
            setEnded(true);
            setPlaying(false);
            if (!trackedEnd.current) {
              trackedEnd.current = true;
              sendGTMEvent({
                event: "vslCompleted",
                category: "VSL",
                action: "Complete",
                label: "Vídeo assistido até o fim - LP15",
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
            style={{ backgroundColor: "rgba(11,13,11,.35)" }}
          >
            <span
              className="flex size-16 items-center justify-center rounded-full backdrop-blur"
              style={{ backgroundColor: "rgba(11,13,11,.6)", border: "1px solid var(--line)" }}
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
            style={{ backgroundColor: "rgba(11,13,11,.6)", border: "1px solid var(--line)" }}
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
            style={{ backgroundColor: "rgba(11,13,11,.86)" }}
          >
            <button
              type="button"
              onClick={() => openSchedule({ origem: "fim-do-video" })}
              className="mt-1 w-full rounded-2xl px-6 py-3.5 text-[15px] font-bold text-white transition-all duration-150 hover:brightness-110"
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
              backgroundColor: "var(--green-bright)",
              transition: "width .18s linear",
            }}
          />
        </div>
      </div>

      {/* Quem está na tela — sem isso o filme é só um homem de kimono. */}
      <figcaption className="mt-3.5 text-center">
        <span className="block text-[14.5px] font-semibold text-[color:var(--ink)]">
          Pedro Machado
        </span>
        <span className="mt-0.5 block text-[12.5px] text-[color:var(--muted)]">
          Campeão mundial de jiu-jitsu
        </span>
      </figcaption>
    </figure>
  );
}

function Pitch() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="w-full max-w-[22rem] text-center">
      <motion.button
        type="button"
        onClick={() => openSchedule({ origem: "hero" })}
        whileTap={reduceMotion ? undefined : { scale: 0.98 }}
        className="lp15-fade-flat mt-6 w-full rounded-2xl py-4 text-base font-bold text-white transition-all duration-150 hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--green-500)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0D0B] sm:text-lg"
        style={{
          animationDelay: "320ms",
          backgroundColor: "var(--green-500)",
          boxShadow: "var(--shadow-float)",
        }}
      >
        Iniciar meu Tratamento
      </motion.button>

      <p
        className="lp15-fade mt-3 text-[12.5px] text-[color:var(--muted)]"
        style={{ animationDelay: "380ms" }}
      >
        Consulta R$50 · Autorização ANVISA grátis
      </p>

      <div
        className="lp15-fade mt-6 flex items-center justify-center gap-3"
        style={{ animationDelay: "440ms" }}
      >
        {[
          { src: "/1.webp", alt: "Ótimo - Reclame Aqui" },
          { src: "/2.webp", alt: "Certificado RA1000 - Reclame Aqui" },
          { src: "/3.webp", alt: "4.9 Google - Avaliação de pacientes" },
        ].map((b) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={b.src}
            src={b.src}
            alt={b.alt}
            width={120}
            height={60}
            loading="lazy"
            decoding="async"
            className="h-12 w-auto rounded-lg bg-white/95 object-contain p-1"
          />
        ))}
      </div>
    </div>
  );
}
