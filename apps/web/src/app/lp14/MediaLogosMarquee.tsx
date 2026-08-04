// Marquee de logos de mídia da lp5 — as artes têm fundo branco, então no
// escuro entram invertidas com blend screen: o fundo some e só o glifo fica.

const LOGOS = [
  { src: "/midia/uol.webp", alt: "UOL" },
  { src: "/midia/oglobo.webp", alt: "O Globo" },
  { src: "/midia/terra.webp", alt: "Terra" },
  { src: "/midia/estadao.webp", alt: "Estadão" },
  { src: "/midia/forbes.webp", alt: "Forbes" },
  { src: "/midia/cnn.webp", alt: "CNN" },
  { src: "/midia/vejario.webp", alt: "Veja Rio" },
] as const;

export default function MediaLogosMarquee() {
  return (
    <section aria-label="Click Cannabis na mídia" className="py-6 sm:py-10">
      <div className="lp14-media-marquee group relative overflow-hidden">
        <div className="lp14-media-track flex w-max gap-10 sm:gap-16">
          {[...LOGOS, ...LOGOS].map((logo, i) => (
            <div
              key={`${logo.alt}-${i}`}
              aria-hidden={i >= LOGOS.length}
              className="flex h-12 w-32 shrink-0 items-center justify-center bg-[#0B0D0B] sm:h-16 sm:w-44"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logo.src}
                alt={logo.alt}
                width={532}
                height={222}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-contain opacity-60 contrast-150 grayscale invert mix-blend-screen"
              />
            </div>
          ))}
        </div>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-[#0B0D0B] to-transparent sm:w-24" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-[#0B0D0B] to-transparent sm:w-24" />
      </div>

      <style>{`
        @keyframes lp14-media-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .lp14-media-track {
          animation: lp14-media-scroll 30s linear infinite;
          will-change: transform;
        }
        .lp14-media-marquee:hover .lp14-media-track {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .lp14-media-track { animation: none; }
        }
      `}</style>
    </section>
  );
}
