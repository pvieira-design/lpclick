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
  tempoPaciente: string | null;
};

export type FeaturedItem = {
  testimonial: Testimonial;
  quote: string;
  imageSrc?: string;
  subtitle?: string;
  imagePosition?: string;
};

type Props = {
  items: FeaturedItem[];
};

export default function FeaturedTestimonial({ items }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [activeUrl, setActiveUrl] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [open, setOpen] = useState(false);

  const N = items.length;

  const hoverPausedRef = useRef(false);
  const dialogPausedRef = useRef(false);
  // Direção do auto-advance: 1 = avançando, -1 = retrocedendo. Faz "ping-pong"
  // ao bater nos extremos, sem precisar de loop infinito (que dava jump visível).
  const autoDirectionRef = useRef(1);
  const activeIndexRef = useRef(0);
  activeIndexRef.current = activeIndex;
  const intervalIdRef = useRef<number | null>(null);

  // Slide cujo centro é mais próximo do centro do scrollport.
  const getActiveIdx = () => {
    const el = trackRef.current;
    if (!el) return 0;
    const slides = el.children;
    if (slides.length === 0) return 0;
    const maxScroll = el.scrollWidth - el.clientWidth;
    if (el.scrollLeft <= 1) return 0;
    if (el.scrollLeft >= maxScroll - 1) return slides.length - 1;
    const scrollportCenter = el.scrollLeft + el.clientWidth / 2;
    let bestIdx = 0;
    let bestDist = Infinity;
    for (let i = 0; i < slides.length; i++) {
      const slide = slides[i] as HTMLElement;
      const center = slide.offsetLeft + slide.clientWidth / 2;
      const dist = Math.abs(center - scrollportCenter);
      if (dist < bestDist) {
        bestDist = dist;
        bestIdx = i;
      }
    }
    return bestIdx;
  };

  const goTo = (i: number) => {
    const el = trackRef.current;
    if (!el) return;
    const clamped = Math.max(0, Math.min(N - 1, i));
    const slide = el.children[clamped] as HTMLElement | undefined;
    if (!slide) return;
    const target =
      slide.offsetLeft + slide.clientWidth / 2 - el.clientWidth / 2;
    const maxScroll = el.scrollWidth - el.clientWidth;
    const left = Math.max(0, Math.min(maxScroll, target));
    setActiveIndex(clamped);
    el.scrollTo({ left, behavior: "smooth" });
  };

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        setActiveIndex(getActiveIdx());
      });
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const stopAutoAdvance = () => {
    if (intervalIdRef.current !== null) {
      window.clearInterval(intervalIdRef.current);
      intervalIdRef.current = null;
    }
  };

  // Inicia (ou reinicia) o intervalo do auto-advance. Chamar isso após interação
  // manual zera os 5s, evitando que o auto dispare logo em seguida.
  const startAutoAdvance = () => {
    stopAutoAdvance();
    if (N <= 1) return;
    intervalIdRef.current = window.setInterval(() => {
      if (hoverPausedRef.current || dialogPausedRef.current) {
        return;
      }
      const cur = activeIndexRef.current;
      let next = cur + autoDirectionRef.current;
      if (next >= N) {
        autoDirectionRef.current = -1;
        next = cur - 1;
      } else if (next < 0) {
        autoDirectionRef.current = 1;
        next = cur + 1;
      }
      goTo(next);
    }, 5000);
  };

  useEffect(() => {
    startAutoAdvance();
    return stopAutoAdvance;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [N]);

  const handleCardClick = (item: FeaturedItem) => {
    setActiveUrl(item.testimonial.video_url);
    setOpen(true);
    dialogPausedRef.current = true;
    dialogRef.current?.showModal();
  };

  const closeVideo = () => {
    const v = videoRef.current;
    if (v) {
      v.pause();
      v.currentTime = 0;
    }
    dialogRef.current?.close();
    setActiveUrl(null);
    setOpen(false);
    dialogPausedRef.current = false;
  };

  useEffect(() => {
    if (!open) return;
    const v = videoRef.current;
    if (v) v.play().catch(() => {});
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (N === 0) return null;
  const showControls = N > 1;

  return (
    <section className="bg-white py-12 sm:py-20">
      <div
        className="w-full"
        onMouseEnter={() => {
          hoverPausedRef.current = true;
        }}
        onMouseLeave={() => {
          hoverPausedRef.current = false;
        }}
      >
        <div
          ref={trackRef}
          className="featured-track flex overflow-hidden"
          style={{
            paddingInline: "28px",
            gap: "16px",
          }}
        >
          {items.map((item, i) => (
            <div
              key={item.testimonial.id}
              style={{
                flexShrink: 0,
                width: "calc(100% - 56px)",
                maxWidth: "420px",
              }}
            >
              <FeaturedCard
                item={item}
                priority={i === 0}
                onClick={() => handleCardClick(item)}
              />
            </div>
          ))}
        </div>

        {showControls && (
          <div className="mt-6 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => {
                autoDirectionRef.current = -1;
                goTo(activeIndex - 1);
                startAutoAdvance();
              }}
              disabled={activeIndex === 0}
              aria-label="Depoimento anterior"
              className="flex size-11 items-center justify-center rounded-full bg-gray-100 text-[#285E31] transition-colors duration-150 ease-out hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-gray-100"
            >
              <svg width="20" height="20" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <div className="flex items-center gap-2">
              {items.map((item, i) => (
                <button
                  key={item.testimonial.id}
                  type="button"
                  onClick={() => {
                    autoDirectionRef.current = i > activeIndex ? 1 : -1;
                    goTo(i);
                    startAutoAdvance();
                  }}
                  aria-label={`Ir para depoimento ${i + 1}`}
                  aria-current={activeIndex === i}
                  className="h-2 rounded-full transition-all duration-200 ease-out"
                  style={{
                    width: activeIndex === i ? "1.5rem" : "0.5rem",
                    backgroundColor: activeIndex === i ? "#285E31" : "#d1d5db",
                  }}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={() => {
                autoDirectionRef.current = 1;
                goTo(activeIndex + 1);
                startAutoAdvance();
              }}
              disabled={activeIndex >= N - 1}
              aria-label="Próximo depoimento"
              className="flex size-11 items-center justify-center rounded-full bg-gray-100 text-[#285E31] transition-colors duration-150 ease-out hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-gray-100"
            >
              <svg width="20" height="20" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        )}
      </div>

      <dialog
        ref={dialogRef}
        onClose={closeVideo}
        className="featured-dialog w-[calc(100%-2rem)] max-w-md rounded-2xl border-0 bg-black p-0 shadow-2xl"
      >
        <div className="relative">
          <button
            type="button"
            onClick={closeVideo}
            className="absolute right-3 top-3 z-10 flex size-10 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur transition-colors duration-150 ease-out hover:bg-black/80"
            aria-label="Fechar vídeo"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
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
        .featured-track::-webkit-scrollbar { display: none; }

        @keyframes featuredPlayRing {
          0% {
            transform: scale(1);
            opacity: 0.55;
          }
          80% {
            opacity: 0;
          }
          100% {
            transform: scale(1.7);
            opacity: 0;
          }
        }
        .featured-play::before,
        .featured-play::after {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 9999px;
          border: 2px solid rgba(255, 255, 255, 0.7);
          pointer-events: none;
          animation: featuredPlayRing 2.4s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
        }
        .featured-play::after {
          animation-delay: 1.2s;
        }
        .featured-card:hover .featured-play::before,
        .featured-card:hover .featured-play::after {
          animation-play-state: paused;
          opacity: 0;
        }

        .featured-dialog {
          position: fixed;
          top: 50%;
          left: 50%;
          translate: -50% -50%;
          margin: 0;
          opacity: 0;
          transform: scale(0.92) translateY(12px);
          transition:
            opacity 180ms cubic-bezier(0.23, 1, 0.32, 1),
            transform 180ms cubic-bezier(0.23, 1, 0.32, 1),
            display 180ms allow-discrete,
            overlay 180ms allow-discrete;
        }
        .featured-dialog[open] {
          opacity: 1;
          transform: scale(1) translateY(0);
          transition:
            opacity 260ms cubic-bezier(0.23, 1, 0.32, 1),
            transform 260ms cubic-bezier(0.23, 1, 0.32, 1),
            display 260ms allow-discrete,
            overlay 260ms allow-discrete;
        }
        .featured-dialog::backdrop {
          background: rgba(0, 0, 0, 0);
          transition: background 180ms cubic-bezier(0.23, 1, 0.32, 1);
        }
        .featured-dialog[open]::backdrop {
          background: rgba(0, 0, 0, 0.85);
          transition: background 260ms cubic-bezier(0.23, 1, 0.32, 1);
        }
        @starting-style {
          .featured-dialog[open] {
            opacity: 0;
            transform: scale(0.92) translateY(12px);
          }
          .featured-dialog[open]::backdrop {
            background: rgba(0, 0, 0, 0);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .featured-card,
          .featured-card img,
          .featured-card span,
          .featured-dialog,
          .featured-dialog[open],
          .featured-dialog::backdrop,
          .featured-dialog[open]::backdrop {
            transition: none;
          }
          .featured-play::before,
          .featured-play::after {
            animation: none;
            opacity: 0;
          }
        }
      `}</style>
    </section>
  );
}

function FeaturedCard({
  item,
  onClick,
  priority = false,
}: {
  item: FeaturedItem;
  onClick: () => void;
  priority?: boolean;
}) {
  const { testimonial, quote, imageSrc, subtitle, imagePosition = "center" } = item;
  const sub =
    subtitle ??
    (testimonial.patologias.length > 0
      ? `Tratou ${testimonial.patologias[0].toLowerCase()}`
      : "Paciente Click");
  const bgSrc = imageSrc ?? testimonial.thumbnail_url;
  const ariaLabel = `Assistir depoimento de ${testimonial.nome ?? "paciente"}`;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      draggable={false}
      className="featured-card group relative block w-full overflow-hidden rounded-3xl bg-gray-900 text-left outline-none transition-transform duration-200 ease-out hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-[#3E8F4A] focus-visible:ring-offset-4"
    >
      <div className="relative aspect-[9/16] w-full">
        {bgSrc ? (
          <Image
            src={bgSrc}
            alt=""
            fill
            sizes="(min-width: 460px) 420px, calc(100vw - 56px)"
            priority={priority}
            draggable={false}
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
            style={{ objectPosition: imagePosition }}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#3E8F4A] to-[#1a5c30]" />
        )}

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.55) 35%, rgba(0,0,0,0.05) 65%, rgba(0,0,0,0) 100%)",
          }}
        />

        {testimonial.tempoPaciente && (
          <div className="absolute left-4 right-4 top-4 flex justify-start sm:left-6 sm:right-6 sm:top-6">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-medium text-gray-900 shadow-sm backdrop-blur sm:px-3.5 sm:text-[12px]">
              <span
                aria-hidden="true"
                className="size-1.5 rounded-full bg-[#3E8F4A]"
              />
              Paciente há {testimonial.tempoPaciente}
            </div>
          </div>
        )}

        <div className="pointer-events-none absolute inset-0 flex -translate-y-14 items-center justify-center sm:translate-y-0">
          <span
            className="featured-play relative flex size-16 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition-all duration-200 ease-out group-hover:bg-white group-hover:text-[#1a5c30] sm:size-[72px]"
            aria-hidden="true"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="currentColor"
              style={{ transform: "translateX(2px)" }}
              className="sm:!h-6 sm:!w-6"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </div>

        <div className="absolute inset-x-0 bottom-0 flex flex-col gap-5 p-6 sm:p-8">
          <span
            aria-hidden="true"
            className="absolute -top-2 left-5 select-none font-serif text-[110px] leading-none text-white/15 sm:left-7 sm:text-[140px]"
          >
            “
          </span>

          <blockquote
            className="relative text-[1.0625rem] font-light leading-[1.4] text-white sm:text-[1.25rem]"
            style={{ fontFamily: "var(--font-geist-sans), system-ui, sans-serif" }}
          >
            {quote}
          </blockquote>

          <div className="min-w-0">
            <p className="text-[15px] font-semibold text-white sm:text-base">
              {testimonial.nome ?? "Paciente"}
            </p>
            <p className="text-[13px] text-white/70 sm:text-sm">{sub}</p>
          </div>
        </div>
      </div>
    </button>
  );
}
