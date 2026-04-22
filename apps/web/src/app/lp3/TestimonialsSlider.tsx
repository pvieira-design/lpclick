"use client";

import { useEffect, useRef, useState } from "react";

type Testimonial = {
  id: string;
  user_id: string | null;
  video_url: string;
  thumbnail_url: string | null;
};

export default function TestimonialsSlider({ items }: { items: Testimonial[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const modalVideoRef = useRef<HTMLVideoElement>(null);
  const [activeUrl, setActiveUrl] = useState<string | null>(null);

  const openVideo = (url: string) => {
    setActiveUrl(url);
    dialogRef.current?.showModal();
    if (trackRef.current) trackRef.current.style.animationPlayState = "paused";
  };

  const closeVideo = () => {
    const v = modalVideoRef.current;
    if (v) {
      v.pause();
      v.currentTime = 0;
    }
    dialogRef.current?.close();
    setActiveUrl(null);
    if (trackRef.current) trackRef.current.style.animationPlayState = "running";
  };

  useEffect(() => {
    if (!activeUrl) return;
    const v = modalVideoRef.current;
    if (v) v.play().catch(() => { /* autoplay blocked; user can hit play */ });
  }, [activeUrl]);

  if (items.length === 0) return null;

  const loop = [...items, ...items];

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
        onMouseEnter={() => {
          if (trackRef.current) trackRef.current.style.animationPlayState = "paused";
        }}
        onMouseLeave={() => {
          if (trackRef.current && !activeUrl) trackRef.current.style.animationPlayState = "running";
        }}
      >
        <div ref={trackRef} className="marquee-track flex w-max gap-4 px-4 sm:gap-5">
          {loop.map((s, i) => (
            <button
              key={`${s.id}-${i}`}
              type="button"
              onClick={() => openVideo(s.video_url)}
              className="group relative shrink-0 overflow-hidden rounded-2xl bg-gray-100 shadow-sm transition-transform duration-200 ease-out hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3a7a4f] focus-visible:ring-offset-2"
              style={{ width: "min(64vw, 220px)" }}
              aria-label="Assistir depoimento"
            >
              {s.thumbnail_url ? (
                <img
                  src={s.thumbnail_url}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="aspect-[9/16] w-full object-cover"
                />
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
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .marquee-track {
          animation: marquee ${Math.max(items.length * 6, 30)}s linear infinite;
          will-change: transform;
        }
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
          .marquee-track { animation: none; }
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
