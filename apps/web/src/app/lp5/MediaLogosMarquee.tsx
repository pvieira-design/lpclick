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
    <section
      aria-label="Click Cannabis na mídia"
      className="bg-white py-6 sm:py-10"
    >
      <div className="media-marquee group relative overflow-hidden">
        <div className="media-marquee-track flex w-max gap-10 sm:gap-16">
          {[...LOGOS, ...LOGOS].map((logo, i) => (
            <div
              key={`${logo.alt}-${i}`}
              className="flex h-12 w-32 shrink-0 items-center justify-center sm:h-16 sm:w-44"
            >
              <img
                src={logo.src}
                alt={logo.alt}
                width={532}
                height={222}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-contain opacity-60"
              />
            </div>
          ))}
        </div>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-white to-transparent sm:w-24" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-white to-transparent sm:w-24" />
      </div>

      <style>{`
        @keyframes media-marquee-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .media-marquee-track {
          animation: media-marquee-scroll 30s linear infinite;
          will-change: transform;
        }
        .media-marquee:hover .media-marquee-track {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .media-marquee-track { animation: none; }
        }
      `}</style>
    </section>
  );
}
