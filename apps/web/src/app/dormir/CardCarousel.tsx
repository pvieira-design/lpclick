"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

export default function CardCarousel({ children, label }: { children: ReactNode; label: string }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const update = () => setEdges({
      start: track.scrollLeft <= 2,
      end: track.scrollLeft >= track.scrollWidth - track.clientWidth - 2,
    });
    update();
    track.addEventListener("scroll", update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(track);
    return () => {
      track.removeEventListener("scroll", update);
      observer.disconnect();
    };
  }, []);

  const move = (direction: number) => {
    const track = trackRef.current;
    const card = track?.firstElementChild as HTMLElement | null;
    if (!track || !card) return;
    track.scrollBy({
      left: direction * (card.offsetWidth + 16),
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
    });
  };

  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-xs text-[var(--muted)]">Deslize para ler mais</p>
        <div className="flex gap-1.5">
          {[-1, 1].map((direction) => (
            <button
              key={direction}
              type="button"
              aria-label={`${label}: ${direction < 0 ? "anteriores" : "próximos"}`}
              disabled={direction < 0 ? edges.start : edges.end}
              onClick={() => move(direction)}
              className="flex size-11 cursor-pointer items-center justify-center rounded-full border border-[var(--line)] text-[var(--green-700)] transition-colors hover:bg-[var(--green-50)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--green-500)] disabled:cursor-default disabled:opacity-30"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" className={direction < 0 ? "rotate-180" : ""}>
                <path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          ))}
        </div>
      </div>
      <div
        ref={trackRef}
        role="group"
        aria-label={label}
        tabIndex={0}
        className="flex snap-x snap-mandatory items-stretch gap-4 overflow-x-auto overscroll-x-contain pb-4 focus-visible:outline-2 focus-visible:outline-[var(--green-500)] [scrollbar-color:#cdd9d0_transparent] [scrollbar-width:thin]"
      >
        {children}
      </div>
    </div>
  );
}
