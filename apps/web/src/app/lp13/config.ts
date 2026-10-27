// Constantes da página da lp13 (/lp13). Tudo que muda com frequência mora aqui.

export const PHONE = "5521993686082";

// O que a pessoa busca (ordem do popup, 2 colunas). Mapeamento igual ao da
// lp12-nova: cada objetivo vira uma patologia do CRM/WhatsApp.
export const OBJETIVOS = [
  { label: "Dormir melhor", patologia: "Insônia" },
  { label: "Desacelerar", patologia: "Ansiedade" },
  { label: "Reduzir o estresse", patologia: "Estresse" },
  { label: "Mais disposição", patologia: "Disposição" },
  { label: "Melhorar o foco", patologia: "TDAH" },
  { label: "Ajuda na recuperação", patologia: "Recuperação" },
  { label: "Aliviar dores", patologia: "Dores" },
  { label: "Outros", patologia: "Outros" },
] as const;

/** Patologias (deduplicadas) dos objetivos marcados, na ordem da lista. */
export function patologiasDe(labels: Set<string>): string[] {
  const out = OBJETIVOS.filter((o) => labels.has(o.label)).map((o) => o.patologia);
  return Array.from(new Set(out));
}

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

export type OpenDetail = { objetivo?: string; origem: string };

export function openSchedule(detail: OpenDetail) {
  window.dispatchEvent(new CustomEvent<OpenDetail>(OPEN_EVENT, { detail }));
}
