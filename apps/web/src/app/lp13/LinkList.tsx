"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { sendGTMEvent } from "@next/third-parties/google";
import { LINKS } from "./config";
import { buildSupportUrl } from "./lead";

const EASE: [number, number, number, number] = [0.23, 1, 0.32, 1];

const IconInstagram = (
  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.7" />
    <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.7" />
    <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" />
  </svg>
);

const IconBlog = (
  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M5 4h11l3 3v13H5z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    <path d="M8.5 10h7M8.5 13.5h7M8.5 17h4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
  </svg>
);

const IconSite = (
  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" />
    <path d="M3 12h18M12 3c2.5 2.6 3.8 5.7 3.8 9S14.5 18.4 12 21c-2.5-2.6-3.8-5.7-3.8-9S9.5 5.6 12 3z" stroke="currentColor" strokeWidth="1.7" />
  </svg>
);

const IconSuporte = (
  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M4 13a8 8 0 1116 0v4a3 3 0 01-3 3h-2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    <rect x="2.5" y="12" width="4" height="6" rx="2" stroke="currentColor" strokeWidth="1.7" />
    <rect x="17.5" y="12" width="4" height="6" rx="2" stroke="currentColor" strokeWidth="1.7" />
  </svg>
);

type Item = {
  href: string;
  icone: ReactNode;
  titulo: string;
  descricao: string;
  label: string;
};

const ITENS: Item[] = [
  {
    href: LINKS.instagram,
    icone: IconInstagram,
    titulo: "Instagram",
    descricao: "@clickcannabis · bastidores, dúvidas e histórias",
    label: "Instagram",
  },
  {
    href: LINKS.blog,
    icone: IconBlog,
    titulo: "Blog",
    descricao: "Conteúdo sobre cannabis medicinal explicado sem juridiquês",
    label: "Blog",
  },
  {
    href: LINKS.site,
    icone: IconSite,
    titulo: "Site oficial",
    descricao: "Conheça a Click Cannabis por inteiro",
    label: "Site",
  },
];

function track(label: string) {
  sendGTMEvent({
    event: "buttonClick",
    category: "Navegação",
    action: "Click",
    label: `${label} - LP13`,
  });
}

export default function LinkList() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.section
      className="mt-12"
      initial={{ opacity: 0, y: reduceMotion ? 0 : 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: EASE }}
    >
      <h2 className="text-center text-[12px] font-semibold uppercase tracking-[0.14em] text-[color:var(--muted)]">
        Mais da Click
      </h2>

      <div className="mt-4 flex flex-col gap-2.5">
        {ITENS.map((item, i) => (
          <motion.a
            key={item.titulo}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track(item.label)}
            whileHover={reduceMotion ? undefined : { y: -2 }}
            whileTap={reduceMotion ? undefined : { scale: 0.99 }}
            initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.4, ease: EASE, delay: reduceMotion ? 0 : i * 0.05 }}
            className="flex items-center gap-3.5 rounded-[var(--radius-card)] border bg-white px-4 py-3.5 transition-colors hover:border-[color:var(--green-500)]"
            style={{ borderColor: "var(--line)", boxShadow: "var(--shadow-card)" }}
          >
            <span
              className="flex size-10 shrink-0 items-center justify-center rounded-full text-[color:var(--green-700)]"
              style={{ backgroundColor: "var(--green-50)" }}
            >
              {item.icone}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[15px] font-semibold text-[color:var(--ink)]">
                {item.titulo}
              </span>
              <span className="mt-0.5 block truncate text-[12.5px] text-[color:var(--muted)]">
                {item.descricao}
              </span>
            </span>
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none" className="shrink-0 text-[color:var(--muted)]" aria-hidden="true">
              <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.a>
        ))}
      </div>

      {/* Paciente atual: caminho separado para não entupir o funil de consulta nova */}
      <a
        href={buildSupportUrl()}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => track("Já sou paciente")}
        className="mt-5 flex items-center gap-3.5 rounded-[var(--radius-card)] border border-dashed px-4 py-3.5 transition-colors hover:bg-white"
        style={{ borderColor: "#d8d2c2", backgroundColor: "#FCFBF6" }}
      >
        <span
          className="flex size-10 shrink-0 items-center justify-center rounded-full text-[#8a6d1f]"
          style={{ backgroundColor: "#F6EFDC" }}
        >
          {IconSuporte}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[15px] font-semibold text-[color:var(--ink)]">
            Já sou paciente
          </span>
          <span className="mt-0.5 block text-[12.5px] leading-snug text-[color:var(--muted)]">
            1ª consulta de retorno gratuita, dúvidas e suporte
          </span>
        </span>
        <svg width="15" height="15" viewBox="0 0 16 16" fill="none" className="shrink-0 text-[color:var(--muted)]" aria-hidden="true">
          <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </a>
    </motion.section>
  );
}
