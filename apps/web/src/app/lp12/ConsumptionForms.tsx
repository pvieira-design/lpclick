"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import SectionHeading from "./SectionHeading";

const EASE: [number, number, number, number] = [0.23, 1, 0.32, 1];

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
  const reduceMotion = useReducedMotion();

  return (
    <section className="bg-white pt-14 pb-6 sm:pt-20">
      <div className="mx-auto w-full max-w-3xl px-5">
        <SectionHeading label="Medicamentos" title="Formas de consumo" description="Importação legalizada pela ANVISA." className="mb-8 sm:mb-12" />

        <motion.div
          className="flex flex-col gap-1"
          initial={{ opacity: 0, y: reduceMotion ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.55, ease: EASE, delay: reduceMotion ? 0 : 0.08 }}
        >
          {ITEMS.map((item, i) => {
            const isActive = active === i;
            const headerId = `consumption-header-${i}`;
            const panelId = `consumption-panel-${i}`;
            return (
              <div
                key={item.num}
                className={`rounded-2xl transition-colors duration-300 ease-out ${
                  isActive
                    ? "bg-[#f0f7f1]"
                    : "bg-transparent hover:bg-gray-50/70"
                }`}
              >
                <h3 className="m-0">
                  <button
                    id={headerId}
                    type="button"
                    onClick={() => setActive(i)}
                    aria-expanded={isActive}
                    aria-controls={panelId}
                    className="flex w-full items-baseline gap-4 rounded-2xl px-5 py-4 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3a7a4f] focus-visible:ring-offset-2 sm:gap-5 sm:px-8 sm:py-6"
                  >
                    <span
                      className={`shrink-0 tabular-nums text-sm transition-colors duration-300 sm:text-lg ${
                        isActive ? "text-[#2d6e3f]" : "text-gray-400"
                      }`}
                    >
                      {item.num}.
                    </span>
                    <span
                      className={`font-display text-xl font-medium transition-colors duration-300 sm:text-[1.75rem] ${
                        isActive ? "text-gray-900" : "text-gray-400"
                      }`}
                    >
                      {item.title}
                    </span>
                  </button>
                </h3>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={headerId}
                  className="consumption-content grid overflow-hidden"
                  style={{ gridTemplateRows: isActive ? "1fr" : "0fr" }}
                >
                  <div className="overflow-hidden">
                    <p
                      className={`pb-5 pl-[2.625rem] pr-5 text-sm leading-relaxed text-gray-600 transition-opacity duration-200 sm:pb-8 sm:pl-[3.75rem] sm:pr-8 sm:text-base ${
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
        </motion.div>
      </div>

      <style>{`
        .consumption-content {
          transition: grid-template-rows 350ms cubic-bezier(0.23, 1, 0.32, 1);
        }
        @media (prefers-reduced-motion: reduce) {
          .consumption-content { transition: none; }
        }
      `}</style>
    </section>
  );
}
