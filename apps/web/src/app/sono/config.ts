// Constantes da /sono — LP de anúncio focada em insônia/dificuldade para
// dormir. Tudo que muda com frequência mora aqui.

export const PHONE = "5521993686082";

// Mesmos nomes das demais LPs (o CRM reconhece por eles); a ordem prioriza a
// queixa da página e as comorbidades que mais aparecem junto com insônia.
export const PATOLOGIAS = [
  "Insônia",
  "Ansiedade",
  "Dores",
  "Depressão",
  "Enxaqueca",
  "TDAH",
  "Perda de Peso",
  "Tabagismo",
] as const;

export const LINKS = {
  site: "https://clickcannabis.com/?src=&utm_source=sono",
  privacidade: "https://clickcannabis.com/politica-de-privacidade/",
  termos: "https://clickcannabis.com/termos-de-uso/",
} as const;

// Atendimento das 8h às 23h30, horário de Brasília.
export const ATENDIMENTO = {
  inicio: 8,
  fimHora: 23,
  fimMinuto: 30,
  rotuloInicio: "8h",
  rotuloFim: "23h30",
} as const;

/** Evento que abre o popup de agendamento de qualquer ponto da página. */
export const OPEN_EVENT = "lp16:agendar";

export type OpenDetail = {
  patologia?: string;
  /** Pré-seleção vinda do grid do hero (estrutura da lp5). */
  patologias?: string[];
  origem: string;
};

export function openSchedule(detail: OpenDetail) {
  window.dispatchEvent(new CustomEvent<OpenDetail>(OPEN_EVENT, { detail }));
}

/** Minutos desde a meia-noite em São Paulo, independente do fuso do dispositivo. */
export function brasiliaMinutes(now: Date = new Date()): number {
  const [h, m] = new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Sao_Paulo",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  })
    .format(now)
    .split(":")
    .map(Number);
  return h * 60 + m;
}

export function isAtendimentoAberto(now: Date = new Date()): boolean {
  const min = brasiliaMinutes(now);
  return (
    min >= ATENDIMENTO.inicio * 60 &&
    min < ATENDIMENTO.fimHora * 60 + ATENDIMENTO.fimMinuto
  );
}
