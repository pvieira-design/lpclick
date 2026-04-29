"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type Testimonial = {
  id: string;
  user_id: string | null;
  video_url: string;
  thumbnail_url: string | null;
  nome: string | null;
  patologias: string[];
};

export default function TestimonialsSlider({ items }: { items: Testimonial[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const modalVideoRef = useRef<HTMLVideoElement>(null);
  const [activeUrl, setActiveUrl] = useState<string | null>(null);
  const [doubled, setDoubled] = useState(false);

  const offsetRef = useRef(0);
  const halfWidthRef = useRef(0);
  const draggingRef = useRef(false);
  const pointerDownRef = useRef(false);
  const pointerIdRef = useRef<number | null>(null);
  const dragStartXRef = useRef(0);
  const dragStartOffsetRef = useRef(0);
  const dragMovedRef = useRef(false);
  const hoverPausedRef = useRef(false);
  const dialogPausedRef = useRef(false);

  // Duplica os itens só depois do primeiro paint pra não inflar o DOM medido
  // pelo Lighthouse no LCP.
  useEffect(() => {
    setDoubled(true);
  }, []);

  // Loop de auto-scroll + render do offset (compartilhado com drag)
  useEffect(() => {
    if (!doubled) return;
    const SPEED_PX_PER_S = 40;
    let raf = 0;
    let lastTs = 0;

    const measure = () => {
      const el = trackRef.current;
      if (!el) return;
      halfWidthRef.current = el.scrollWidth / 2;
    };
    measure();
    window.addEventListener("resize", measure);

    const tick = (ts: number) => {
      if (lastTs === 0) lastTs = ts;
      const dt = ts - lastTs;
      lastTs = ts;
      const paused =
        draggingRef.current ||
        hoverPausedRef.current ||
        dialogPausedRef.current;
      const half = halfWidthRef.current;
      if (!paused && half > 0) {
        offsetRef.current -= (SPEED_PX_PER_S * dt) / 1000;
        if (offsetRef.current <= -half) offsetRef.current += half;
      }
      const el = trackRef.current;
      if (el) el.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", measure);
    };
  }, [doubled]);

  const wrapOffset = (off: number) => {
    const half = halfWidthRef.current;
    if (half <= 0) return off;
    let x = off;
    while (x <= -half) x += half;
    while (x > 0) x -= half;
    return x;
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    pointerDownRef.current = true;
    pointerIdRef.current = e.pointerId;
    draggingRef.current = false;
    dragMovedRef.current = false;
    dragStartXRef.current = e.clientX;
    dragStartOffsetRef.current = offsetRef.current;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!pointerDownRef.current || e.pointerId !== pointerIdRef.current) return;
    const delta = e.clientX - dragStartXRef.current;
    if (!draggingRef.current) {
      if (Math.abs(delta) <= 4) return;
      draggingRef.current = true;
      dragMovedRef.current = true;
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch { /* already captured or unsupported */ }
    }
    offsetRef.current = wrapOffset(dragStartOffsetRef.current + delta);
  };

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerId !== pointerIdRef.current) return;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    pointerDownRef.current = false;
    pointerIdRef.current = null;
    draggingRef.current = false;
  };

  const openVideo = (url: string) => {
    setActiveUrl(url);
    dialogRef.current?.showModal();
    dialogPausedRef.current = true;
  };

  const closeVideo = () => {
    const v = modalVideoRef.current;
    if (v) {
      v.pause();
      v.currentTime = 0;
    }
    dialogRef.current?.close();
    setActiveUrl(null);
    dialogPausedRef.current = false;
  };

  useEffect(() => {
    if (!activeUrl) return;
    const v = modalVideoRef.current;
    if (v) v.play().catch(() => { /* autoplay blocked; user can hit play */ });
  }, [activeUrl]);

  if (items.length === 0) return null;

  const loop = doubled ? [...items, ...items] : items;

  return (
    <section className="relative overflow-hidden bg-white py-10 sm:py-16">
      <div className="mx-auto mb-6 w-full max-w-xl px-5 text-center sm:mb-10">
        <h2
          className="text-[1.5rem] leading-tight tracking-tight text-gray-900 sm:text-3xl"
          style={{ fontFamily: "var(--font-geist-sans), system-ui, sans-serif" }}
        >
          <span className="font-light">Histórias reais de</span>{" "}
          <span className="font-semibold">nossos pacientes</span>
        </h2>
      </div>

      <div
        onMouseEnter={() => { hoverPausedRef.current = true; }}
        onMouseLeave={() => { hoverPausedRef.current = false; }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        className="cursor-grab select-none active:cursor-grabbing"
        style={{ touchAction: "pan-y" }}
      >
        <div
          ref={trackRef}
          className="flex w-max gap-4 px-4 sm:gap-5"
          style={{ willChange: "transform" }}
        >
          {loop.map((s, i) => (
            <div
              key={`${s.id}-${i}`}
              className="flex shrink-0 flex-col"
              style={{ width: "min(64vw, 220px)" }}
            >
              <button
                type="button"
                onClick={(e) => {
                  if (dragMovedRef.current) {
                    e.preventDefault();
                    return;
                  }
                  openVideo(s.video_url);
                }}
                draggable={false}
                className="group relative overflow-hidden rounded-2xl bg-gray-100 shadow-sm transition-transform duration-200 ease-out hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3a7a4f] focus-visible:ring-offset-2"
                aria-label={s.nome ? `Assistir depoimento de ${s.nome}` : "Assistir depoimento"}
              >
                {s.thumbnail_url ? (
                  <div className="pointer-events-none relative aspect-[9/16] w-full">
                    <Image
                      src={s.thumbnail_url}
                      alt=""
                      fill
                      sizes="220px"
                      draggable={false}
                      className="object-cover select-none"
                    />
                  </div>
                ) : (
                  <video
                    src={`${s.video_url}#t=1`}
                    preload="metadata"
                    muted
                    playsInline
                    className="pointer-events-none aspect-[9/16] w-full object-cover"
                  />
                )}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/0 via-transparent to-black/25" />
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <div className="flex size-14 items-center justify-center rounded-full bg-white/95 shadow-[0_8px_24px_rgba(0,0,0,0.25)] backdrop-blur transition-transform duration-200 ease-out group-hover:scale-110 sm:size-16">
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="#1a5c30"
                      style={{ transform: "translateX(1.5px)" }}
                      aria-hidden="true"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </button>
              {(s.nome || s.patologias.length > 0) && (
                <div className="mt-3 px-0.5">
                  {s.nome && (
                    <p className="text-[14px] font-semibold text-gray-900">{s.nome}</p>
                  )}
                  {s.patologias.length > 0 && (
                    <p className="mt-0.5 text-[12px] leading-snug text-gray-500">
                      {s.patologias.join(" · ")}
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <dialog
        ref={dialogRef}
        onClose={closeVideo}
        className="video-dialog w-[calc(100%-2rem)] max-w-md rounded-2xl border-0 bg-black p-0 shadow-2xl"
      >
        <div className="relative">
          <button
            type="button"
            onClick={closeVideo}
            className="absolute right-3 top-3 z-10 flex size-10 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur transition-colors duration-150 ease-out hover:bg-black/80"
            aria-label="Fechar vídeo"
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
          {activeUrl && (
            <video
              ref={modalVideoRef}
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
        /* Closed/exit state — transition values here fire when closing */
        .video-dialog {
          opacity: 0;
          transform: scale(0.92) translateY(12px);
          transition:
            opacity 180ms cubic-bezier(0.23, 1, 0.32, 1),
            transform 180ms cubic-bezier(0.23, 1, 0.32, 1),
            display 180ms allow-discrete,
            overlay 180ms allow-discrete;
          will-change: transform, opacity;
        }
        /* Open/entry state — transition values here fire when opening */
        .video-dialog[open] {
          opacity: 1;
          transform: scale(1) translateY(0);
          transition:
            opacity 260ms cubic-bezier(0.23, 1, 0.32, 1),
            transform 260ms cubic-bezier(0.23, 1, 0.32, 1),
            display 260ms allow-discrete,
            overlay 260ms allow-discrete;
        }
        .video-dialog::backdrop {
          background: rgba(0, 0, 0, 0);
          transition: background 180ms cubic-bezier(0.23, 1, 0.32, 1);
        }
        .video-dialog[open]::backdrop {
          background: rgba(0, 0, 0, 0.85);
          transition: background 260ms cubic-bezier(0.23, 1, 0.32, 1);
        }
        @starting-style {
          .video-dialog[open] {
            opacity: 0;
            transform: scale(0.92) translateY(12px);
          }
          .video-dialog[open]::backdrop {
            background: rgba(0, 0, 0, 0);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .video-dialog,
          .video-dialog[open],
          .video-dialog::backdrop,
          .video-dialog[open]::backdrop {
            transition: none;
          }
        }
      `}</style>
    </section>
  );
}
