import Image from "next/image";

const ITEMS = [
  {
    num: "01",
    title: "Óleo de Cannabis Medicinal",
    desc: "Aplicado sob a língua, o óleo é absorvido pela mucosa bucal, o que permite sua rápida entrada na corrente sanguínea, uma opção de resposta ágil e controlada.",
    image: "/produtos/oleo-v3.webp",
    alt: "Frasco de óleo de cannabis medicinal",
  },
  {
    num: "02",
    title: "Jujuba de Cannabis Medicinal",
    desc: "A jujuba proporciona uma forma prática, saborosa e discreta de consumo. Embora a absorção seja mais lenta por depender da digestão, os efeitos tendem a ser mais prolongados.",
    image: "/produtos/jujuba-v3.webp",
    alt: "Jujubas de cannabis medicinal",
  },
  {
    num: "03",
    title: "Softgel de Cannabis Medicinal",
    desc: "Forma prática, precisa e discreta de consumir cannabis medicinal. Com dosagem padronizada, são ingeridas por via oral e absorvidas gradualmente pelo organismo, proporcionando efeitos prolongados e estáveis.",
    image: "/produtos/softgel-v3.webp",
    alt: "Cápsulas softgel de cannabis medicinal",
  },
] as const;

export default function ConsumptionForms() {
  return (
    <section className="bg-white pt-12 pb-6 sm:pt-20">
      <div className="mx-auto w-full max-w-5xl px-5">
        <header className="consumption-header mb-2 grid grid-cols-1 gap-3 sm:mb-12 sm:grid-cols-[1fr_auto] sm:items-start sm:gap-x-8 sm:gap-y-2">
          <span className="inline-flex w-fit items-center rounded-full bg-[#e6f2e9] px-3 py-1 text-xs font-medium text-[#2d6e3f] sm:col-start-2 sm:row-start-1 sm:justify-self-end sm:text-sm">
            Medicamentos
          </span>
          <h2
            className="text-[2rem] font-light leading-[1.05] tracking-tight text-gray-900 sm:col-start-1 sm:row-span-2 sm:row-start-1 sm:text-[3rem]"
            style={{ fontFamily: "var(--font-geist-sans), system-ui, sans-serif" }}
          >
            Formas de consumo
          </h2>
          <p className="text-xs text-gray-500 sm:col-start-2 sm:row-start-2 sm:text-right sm:text-sm">
            Importação legalizada pela ANVISA.
          </p>
        </header>

        <div className="consumption-cards grid grid-cols-1 gap-5 sm:grid-cols-3 sm:gap-5">
          {ITEMS.map((item, i) => (
            <article
              key={item.num}
              className="card flex flex-col overflow-hidden rounded-3xl bg-[#f5f5f6] ring-1 ring-gray-200/60"
              style={{ "--stack-top": `${144 + i * 52}px` } as React.CSSProperties}
            >
              <div className="relative aspect-square w-full bg-[#f5faf6]">
                <Image
                  src={item.image}
                  alt={item.alt}
                  fill
                  sizes="(min-width: 1024px) 320px, (min-width: 640px) 33vw, calc(100vw - 40px)"
                  quality={95}
                  className="object-contain"
                  loading="lazy"
                />
                <span className="absolute left-3 top-3 inline-flex items-center rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-semibold tabular-nums tracking-wider text-[#2d6e3f] shadow-sm ring-1 ring-black/[0.04] backdrop-blur">
                  {item.num}
                </span>
              </div>

              <div className="flex flex-1 flex-col p-5 sm:p-6">
                <h3
                  className="text-[1.0625rem] font-semibold leading-snug tracking-tight text-gray-900"
                  style={{ fontFamily: "var(--font-geist-sans), system-ui, sans-serif" }}
                >
                  {item.title}
                </h3>
                <p className="mt-2 text-[0.875rem] leading-relaxed text-gray-500">
                  {item.desc}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 639px) {
          .consumption-header {
            position: sticky;
            top: 0;
            z-index: 20;
            background: white;
            padding-top: 0.75rem;
            padding-bottom: 0.75rem;
          }
          .consumption-cards .card {
            position: sticky;
            top: var(--stack-top);
          }
          .consumption-cards .card:last-child {
            top: 0;
            z-index: 30;
          }
        }
      `}</style>
    </section>
  );
}
