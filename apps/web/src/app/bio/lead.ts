// Captação de lead da /bio — mesmo contrato usado nas demais LPs.
"use client";

import { PHONE } from "./config";

const LEADS_API_ENDPOINT = "/api/leads";

// Origem carimbada quando o link da bio é aberto sem UTM na URL. A rota /bio é
// o próprio identificador, então não precisa de cauda de parâmetros visível.
// Link de campanha com ?utm_source=... sempre tem prioridade sobre estes.
export const BIO_ORIGIN = {
  utmSource: "organico_bio",
  utmMedium: "bio",
  utmContent: "lp_bio",
} as const;

export type LeadPayload = {
  name: string;
  patologies: string[];
  data: {
    fbclid: string;
    fbp: string;
    fbc: string;
    language: string;
    platform: string;
    referrer: string;
    pageUrl: string;
    utm_term: string;
    userAgent: string;
    appVersion: string;
    utm_medium: string;
    utm_source: string;
    utm_content: string;
    utm_campaign: string;
  };
};

function readCookie(name: string): string {
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
  return match?.[1] ?? "";
}

function readFbclid(): string {
  // URL param tem prioridade; cookie _fbc tem formato "fb.1.{ts}.{fbclid}".
  const fromUrl = new URLSearchParams(window.location.search).get("fbclid");
  if (fromUrl) return fromUrl;
  const fbc = readCookie("_fbc");
  if (!fbc) return "";
  const parts = fbc.split(".");
  return parts.length >= 4 ? parts.slice(3).join(".") : "";
}

function readDeprecatedNav(): { appVersion: string; platform: string } {
  // navigator.appVersion/platform estão deprecated, mas a API backend espera ambos.
  const n = navigator as unknown as { appVersion: string; platform: string };
  return { appVersion: n.appVersion, platform: n.platform };
}

export function collectLeadData(name: string, patologies: string[]): LeadPayload {
  const params = new URLSearchParams(window.location.search);
  const { appVersion, platform } = readDeprecatedNav();

  return {
    name,
    patologies,
    data: {
      fbclid: readFbclid(),
      fbp: readCookie("_fbp"),
      fbc: readCookie("_fbc"),
      language: navigator.language,
      platform,
      referrer: document.referrer,
      pageUrl: window.location.href,
      utm_term: params.get("utm_term") ?? "",
      userAgent: navigator.userAgent,
      appVersion,
      utm_medium: params.get("utm_medium") ?? BIO_ORIGIN.utmMedium,
      utm_source: params.get("utm_source") ?? BIO_ORIGIN.utmSource,
      utm_content: params.get("utm_content") ?? BIO_ORIGIN.utmContent,
      utm_campaign: params.get("utm_campaign") ?? "",
    },
  };
}

export function sendLeadToApi(payload: LeadPayload): void {
  const body = JSON.stringify(payload);

  // sendBeacon sobrevive à navegação disparada por window.open — preferência nº 1.
  if (typeof navigator.sendBeacon === "function") {
    const blob = new Blob([body], { type: "application/json" });
    if (navigator.sendBeacon(LEADS_API_ENDPOINT, blob)) return;
  }

  fetch(LEADS_API_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => {});
}

export function buildWhatsAppUrl(name: string, patologias: string[]): string {
  // ATENÇÃO: este texto é o gatilho que registra o contato no CRM. Precisa bater
  // EXATAMENTE com o padrão das demais LPs — não adicionar linhas (ex.: "Quero
  // agendar minha consulta"), senão o CRM não reconhece e o lead não é atribuído.
  const list = patologias.map((p, i) => `${i + 1}. ${p}`).join("\n");
  const text = `Olá, me chamo ${name}.\n\nPatologias selecionadas:\n${list}`;
  return `https://api.whatsapp.com/send/?phone=${PHONE}&text=${encodeURIComponent(text)}&type=phone_number&app_absent=0`;
}

export function buildSupportUrl(): string {
  const text =
    "Olá! Já sou paciente da Click Cannabis e preciso de ajuda com meu tratamento.";
  return `https://api.whatsapp.com/send/?phone=${PHONE}&text=${encodeURIComponent(text)}&type=phone_number&app_absent=0`;
}
