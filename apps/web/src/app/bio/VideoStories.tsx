"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

type Story = {
  id: string;
  video_url: string;
  thumbnail_url: string | null;
  nome: string | null;
  patologias: string[];
};

const EASE: [number, number, number, number] = [0.23, 1, 0.32, 1];

export default function VideoStories({ items }: { items: Story[] }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [activeUrl, setActiveUrl] = useState<string | null>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!activeUrl) return;
    videoRef.current?.play().catch(() => { /* autoplay bloqueado: o usuário dá play */ });
  }, [activeUrl]);

  if (items.length === 0) return null;

  const open = (url: string) => {
    setActiveUrl(url);
    dialogRef.current?.showModal();
    document.body.style.overflow = "hidden";
  };

  const close = () => {
    const v = videoRef.current;
    if (v) {
      v.pause();
      v.currentTime = 0;
    }
    dialogRef.current?.close();
    setActiveUrl(null);
    document.body.style.overflow = "";
  };

  return (
    <motion.section
      className="mt-12"
      initial={{ opacity: 0, y: reduceMotion ? 0 : 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: EASE }}
    >
      <h2 className="font-display text-center text-[1.7rem] leading-tight text-[color:var(--green-900)]">
        Quem já trata com a gente
      </h2>
      <p className="mt-2 text-center text-[14px] text-[color:var(--muted)]">
        Toque para assistir aos relatos. Todos são pacientes reais.
      </p>

      {/* Sangra até a borda da tela para o carrossel respirar */}
      <div className="-mx-5 mt-5 overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex w-max snap-x snap-mandatory gap-3 px-5">
          {items.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => open(s.video_url)}
              className="group w-[9.5rem] shrink-0 snap-start text-left focus:outline-none"
              aria-label={s.nome ? `Assistir depoimento de ${s.nome}` : "Assistir depoimento"}
            >
              <div className="relative overflow-hidden rounded-[1.1rem] bg-gray-100 shadow-[0_6px_20px_rgba(23,27,24,.10)] transition-transform duration-200 ease-out group-hover:-translate-y-1">
                {s.thumbnail_url ? (
                  <div className="relative aspect-[9/16] w-full">
                    <Image
                      src={s.thumbnail_url}
                      alt=""
                      fill
                      sizes="152px"
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <video
                    src={`${s.video_url}#t=1`}
                    preload="metadata"
                    muted
                    playsInline
                    className="aspect-[9/16] w-full object-cover"
                  />
                )}
                <span className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/0 via-transparent to-black/45" />
                <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <span className="flex size-11 items-center justify-center rounded-full bg-white/95 shadow-lg backdrop-blur transition-transform duration-200 group-hover:scale-110">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--green-700)" style={{ transform: "translateX(1px)" }} aria-hidden="true">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </span>
                </span>
                {s.nome && (
                  <span className="pointer-events-none absolute inset-x-0 bottom-0 p-2.5">
                    <span className="block text-[13px] font-semibold leading-tight text-white drop-shadow">
                      {s.nome}
                    </span>
                    {s.patologias.length > 0 && (
                      <span className="mt-0.5 block truncate text-[11px] leading-tight text-white/80">
                        {s.patologias.join(" · ")}
                      </span>
                    )}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      <dialog
        ref={dialogRef}
        onClose={close}
        onClick={(e) => {
          if (e.target === dialogRef.current) close();
        }}
        className="bio-video w-[calc(100%-2rem)] max-w-[24rem] rounded-[1.25rem] border-0 bg-black p-0 shadow-2xl"
      >
        <div className="relative">
          <button
            type="button"
            onClick={close}
            aria-label="Fechar vídeo"
            className="absolute right-3 top-3 z-10 flex size-10 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur transition-colors hover:bg-black/80"
          >
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
          {activeUrl && (
            <video
              ref={videoRef}
              src={activeUrl}
              controls
              playsInline
              autoPlay
              className="aspect-[9/16] w-full bg-black object-contain"
            />
          )}
        </div>
      </dialog>

      <style>{`
        .bio-video {
          inset: 50% auto auto 50%;
          translate: -50% -50%;
          opacity: 0;
          transform: scale(.94);
          transition:
            opacity 180ms cubic-bezier(.23,1,.32,1),
            transform 200ms cubic-bezier(.23,1,.32,1),
            display 200ms allow-discrete,
            overlay 200ms allow-discrete;
        }
        .bio-video[open] { opacity: 1; transform: scale(1); }
        .bio-video::backdrop { background: rgba(0,0,0,0); transition: background 200ms; }
        .bio-video[open]::backdrop { background: rgba(0,0,0,.88); }
        @starting-style {
          .bio-video[open] { opacity: 0; transform: scale(.94); }
          .bio-video[open]::backdrop { background: rgba(0,0,0,0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .bio-video, .bio-video[open] { transition: none; }
        }
      `}</style>
    </motion.section>
  );
}
