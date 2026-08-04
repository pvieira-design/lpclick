"use client";

// Formas de consumo da lp5, com a pele escura da lp14.

import { useState } from "react";

const ITEMS = [
  {
    num: "01",
    title: "Óleo de Cannabis Medicinal",
    desc: "Aplicado sob a língua, o óleo é absorvido pela mucosa bucal, o que permite sua rápida entrada na corrente sanguínea, uma opção de resposta ágil e controlada.",
  },
  {
    num: "02",
    title: "Jujuba de Cannabis Medicinal",
    desc: "A jujuba proporciona uma forma prática, saborosa e discreta de consumo. Embora a absorção seja mais lenta por depender da digestão, os efeitos tendem a ser mais prolongados.",
  },
  {
    num: "03",
    title: "Softgel de Cannabis Medicinal",
    desc: "Forma prática, precisa e discreta de consumir cannabis medicinal. Com dosagem padronizada, são ingeridas por via oral e absorvidas gradualmente pelo organismo, proporcionando efeitos prolongados e estáveis.",
  },
] as const;

export default function ConsumptionForms() {
  const [active, setActive] = useState(0);

  return (
    <section className="pt-12 pb-6 sm:pt-20">
      <div className="mx-auto w-full max-w-3xl px-5">
        <header className="mb-8 grid grid-cols-1 gap-3 sm:mb-12 sm:grid-cols-[1fr_auto] sm:items-start sm:gap-x-8 sm:gap-y-2">
          <span className="inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-medium text-[color:var(--green-bright)] sm:col-start-2 sm:row-start-1 sm:justify-self-end sm:text-sm" style={{ backgroundColor: "rgba(89,209,114,.12)" }}>
            Medicamentos
          </span>
          <h2 className="font-display text-[2rem] leading-[1.02] sm:col-start-1 sm:row-span-2 sm:row-start-1 sm:text-[3rem]">
            Formas de consumo
          </h2>
          <p className="text-xs text-[color:var(--muted)] sm:col-start-2 sm:row-start-2 sm:text-right sm:text-sm">
            Importação legalizada pela ANVISA.
          </p>
        </header>

        <div className="flex flex-col gap-1">
          {ITEMS.map((item, i) => {
            const isActive = active === i;
            const headerId = `lp14-consumption-header-${i}`;
            const panelId = `lp14-consumption-panel-${i}`;
            return (
              <div
                key={item.num}
                className="rounded-2xl transition-colors duration-300 ease-out"
                style={{
                  backgroundColor: isActive ? "var(--panel)" : "transparent",
                }}
              >
                <h3 className="m-0">
                  <button
                    id={headerId}
                    type="button"
                    onClick={() => setActive(i)}
                    aria-expanded={isActive}
                    aria-controls={panelId}
                    className="flex w-full items-baseline gap-4 rounded-2xl px-5 py-4 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--green-500)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0D0B] sm:gap-5 sm:px-8 sm:py-6"
                  >
                    <span
                      className="shrink-0 tabular-nums text-sm transition-colors duration-300 sm:text-lg"
                      style={{ color: isActive ? "var(--green-bright)" : "var(--muted)" }}
                    >
                      {item.num}.
                    </span>
                    <span
                      className="text-xl font-normal tracking-tight transition-colors duration-300 sm:text-[1.75rem]"
                      style={{ color: isActive ? "var(--ink)" : "var(--muted)" }}
                    >
                      {item.title}
                    </span>
                  </button>
                </h3>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={headerId}
                  className="lp14-consumption-content grid overflow-hidden"
                  style={{ gridTemplateRows: isActive ? "1fr" : "0fr" }}
                >
                  <div className="overflow-hidden">
                    <p
                      className={`pb-5 pl-[2.625rem] pr-5 text-sm leading-relaxed text-[color:var(--muted)] transition-opacity duration-200 sm:pb-8 sm:pl-[3.75rem] sm:pr-8 sm:text-base ${
                        isActive ? "opacity-100 delay-100" : "opacity-0"
                      }`}
                    >
                      {item.desc}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        .lp14-consumption-content {
          transition: grid-template-rows 350ms cubic-bezier(0.23, 1, 0.32, 1);
        }
        @media (prefers-reduced-motion: reduce) {
          .lp14-consumption-content { transition: none; }
        }
      `}</style>
    </section>
  );
}
