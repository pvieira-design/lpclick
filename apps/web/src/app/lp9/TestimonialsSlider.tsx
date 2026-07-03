"use client";

// Carrossel de depoimentos em vídeo — mesma mecânica do lp5/TestimonialsSlider
// (auto-scroll contínuo, drag com pointer capture, modal <dialog>), com a
// casca visual adaptada à estética da lp9 (creme + Fraunces). Estilos em
// classes próprias (.vt-*) porque o reset `.lp9 *` zera margens/paddings de
// utilitários Tailwind empatados em especificidade.

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export type VideoTestimonial = {
  id: string;
  user_id: string | null;
  video_url: string;
  thumbnail_url: string | null;
  nome: string | null;
  patologias: string[];
};

type Props = {
  items: VideoTestimonial[];
};

const CSS = `
  .lp9 .vt-scroller{overflow:hidden;cursor:grab;touch-action:pan-y}
  .lp9 .vt-scroller:active{cursor:grabbing}
  .lp9 .vt-track{display:flex;gap:16px;padding:6px 24px 4px;width:max-content;will-change:transform}
  .lp9 .vt-card{flex-shrink:0;width:min(64vw,220px);display:flex;flex-direction:column}
  .lp9 .vt-thumb{position:relative;overflow:hidden;border-radius:18px;background:#e6e1d2;border:1px solid var(--line);box-shadow:var(--shadow-sm);cursor:pointer;padding:0;display:block;width:100%;transition:transform .2s ease,box-shadow .2s ease}
  .lp9 .vt-thumb:hover{transform:translateY(-3px);box-shadow:var(--shadow)}
  .lp9 .vt-media{position:relative;aspect-ratio:9/16;width:100%;pointer-events:none}
  .lp9 .vt-media video{width:100%;height:100%;object-fit:cover;display:block}
  .lp9 .vt-grad{position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,0),transparent 55%,rgba(0,0,0,.28));pointer-events:none}
  .lp9 .vt-play{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;pointer-events:none}
  .lp9 .vt-play span{width:54px;height:54px;border-radius:50%;background:rgba(255,253,248,.95);display:flex;align-items:center;justify-content:center;box-shadow:0 8px 24px rgba(0,0,0,.25);transition:transform .2s ease}
  .lp9 .vt-thumb:hover .vt-play span{transform:scale(1.08)}
  .lp9 .vt-name{margin-top:.7rem;font-weight:600;font-size:.9rem;color:var(--ink);padding:0 2px}
  .lp9 .vt-meta{margin-top:.15rem;font-size:.76rem;line-height:1.4;color:var(--muted);padding:0 2px}

  .lp9-video-dialog{position:fixed;top:50%;left:50%;translate:-50% -50%;margin:0;width:calc(100% - 2rem);max-width:420px;border:none;border-radius:18px;background:#000;padding:0;box-shadow:var(--shadow-lg);opacity:0;transform:scale(.92) translateY(12px);transition:opacity 180ms cubic-bezier(.23,1,.32,1),transform 180ms cubic-bezier(.23,1,.32,1),display 180ms allow-discrete,overlay 180ms allow-discrete}
  .lp9-video-dialog[open]{opacity:1;transform:scale(1) translateY(0);transition:opacity 260ms cubic-bezier(.23,1,.32,1),transform 260ms cubic-bezier(.23,1,.32,1),display 260ms allow-discrete,overlay 260ms allow-discrete}
  .lp9-video-dialog::backdrop{background:rgba(0,0,0,0);transition:background 180ms cubic-bezier(.23,1,.32,1)}
  .lp9-video-dialog[open]::backdrop{background:rgba(0,0,0,.85);transition:background 260ms cubic-bezier(.23,1,.32,1)}
  @starting-style{
    .lp9-video-dialog[open]{opacity:0;transform:scale(.92) translateY(12px)}
    .lp9-video-dialog[open]::backdrop{background:rgba(0,0,0,0)}
  }
  .lp9-video-dialog .vt-close{position:absolute;right:12px;top:12px;z-index:10;width:40px;height:40px;display:flex;align-items:center;justify-content:center;border:none;border-radius:50%;background:rgba(0,0,0,.6);color:#fff;cursor:pointer;backdrop-filter:blur(4px)}
  .lp9-video-dialog .vt-close:hover{background:rgba(0,0,0,.8)}
  .lp9-video-dialog video{aspect-ratio:9/16;width:100%;background:#000;object-fit:contain;display:block;border-radius:18px}
  @media(prefers-reduced-motion:reduce){
    .lp9-video-dialog,.lp9-video-dialog[open],.lp9-video-dialog::backdrop,.lp9-video-dialog[open]::backdrop{transition:none}
  }
`;

export default function TestimonialsSlider({ items }: Props) {
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

  // Duplica os itens só depois do primeiro paint pra não inflar o DOM no LCP.
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
    if (v) v.play().catch(() => { /* autoplay bloqueado; usuário dá play */ });
  }, [activeUrl]);

  if (items.length === 0) return null;

  const loop = doubled ? [...items, ...items] : items;

  return (
    <section className="block testi" id="depo">
      <style>{CSS}</style>
      <div className="wrap">
        <div className="sec-head center reveal">
          <span className="eyebrow">Histórias reais</span>
          <h2>Veja os depoimentos de quem faz o tratamento com a Click.</h2>
        </div>
      </div>

      <div
        className="vt-scroller"
        onMouseEnter={() => { hoverPausedRef.current = true; }}
        onMouseLeave={() => { hoverPausedRef.current = false; }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <div ref={trackRef} className="vt-track">
          {loop.map((s, i) => (
            <div key={`${s.id}-${i}`} className="vt-card">
              <button
                type="button"
                className="vt-thumb"
                onClick={(e) => {
                  if (dragMovedRef.current) {
                    e.preventDefault();
                    return;
                  }
                  openVideo(s.video_url);
                }}
                draggable={false}
                aria-label={
                  s.nome
                    ? `Assistir depoimento de ${s.nome}`
                    : "Assistir depoimento"
                }
              >
                <div className="vt-media">
                  {s.thumbnail_url ? (
                    <Image
                      src={s.thumbnail_url}
                      alt=""
                      fill
                      sizes="220px"
                      draggable={false}
                      style={{ objectFit: "cover", userSelect: "none" }}
                    />
                  ) : (
                    <video
                      src={`${s.video_url}#t=1`}
                      preload="metadata"
                      muted
                      playsInline
                    />
                  )}
                </div>
                <div className="vt-grad" />
                <div className="vt-play">
                  <span>
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="#1f4533"
                      style={{ transform: "translateX(1.5px)" }}
                      aria-hidden="true"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </span>
                </div>
              </button>
              {s.nome && <p className="vt-name">{s.nome}</p>}
              {s.patologias.length > 0 && (
                <p className="vt-meta">{s.patologias.join(" · ")}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      <dialog ref={dialogRef} onClose={closeVideo} className="lp9-video-dialog">
        <div style={{ position: "relative" }}>
          <button
            type="button"
            className="vt-close"
            onClick={closeVideo}
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
            />
          )}
        </div>
      </dialog>
    </section>
  );
}
