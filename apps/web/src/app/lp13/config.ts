// Constantes da página da lp13 (/lp13). Tudo que muda com frequência mora aqui.

export const PHONE = "5521993686082";

// Objetivos da primeira dobra e seu mapeamento para o CRM.
export const OBJETIVOS = [
  { label: "Dormir melhor", patologia: "Insônia" },
  { label: "Reduzir o estresse", patologia: "Estresse" },
  { label: "Mais disposição", patologia: "Disposição" },
  { label: "Melhorar o foco", patologia: "TDAH" },
  { label: "Ajuda na recuperação", patologia: "Recuperação" },
  { label: "Aliviar dores", patologia: "Dores" },
  { label: "Outros", patologia: "Outros" },
] as const;

export type Objetivo = (typeof OBJETIVOS)[number];

export const LINKS = {
  instagram: "https://www.instagram.com/clickcannabis/",
  blog: "https://blog.clickcannabis.com/",
  site: "https://clickcannabis.com/?src=&utm_source=lp13",
  privacidade: "https://clickcannabis.com/politica-de-privacidade/",
  termos: "https://clickcannabis.com/termos-de-uso/",
  depoimentos: "https://clickcannabis.com/depoimentos/#depoimentos",
} as const;

/** Evento que abre o popup de agendamento de qualquer ponto da página. */
export const OPEN_EVENT = "lp13:agendar";

export type OpenDetail = { objetivo?: Objetivo["label"]; origem: string };

export function openSchedule(detail: OpenDetail) {
  window.dispatchEvent(new CustomEvent<OpenDetail>(OPEN_EVENT, { detail }));
}
