// Captação de lead da /bio — mesmo contrato usado nas demais LPs.
"use client";

import { PHONE } from "./config";

const LEADS_API_ENDPOINT = "/api/leads";

// ── Carimbo de origem: leia antes de mexer ───────────────────────────────────
// 1. UTM presente na URL SEMPRE vence o carimbo padrão — intencional, para
//    links de campanha/stories poderem se identificar.
// 2. O Instagram anexa sozinho `utm_source=ig&utm_medium=social&
//    utm_content=link_in_bio` ao link da bio. Tráfego real do IG chega
//    rotulado pela Meta, a menos que a URL do perfil carregue as UTMs
//    canônicas abaixo. O Gerenciador tem regra que traduz os dois formatos.
// 3. A tripla abaixo só entra quando a URL não traz NENHUMA utm_* não-vazia
//    (fallback atômico: nunca mistura URL + padrão no mesmo lead; param vazio
//    tipo `?utm_medium=` conta como ausente).
// Em jul-ago/2026 essas regras renderam 10 dias de investigação: os leads
// pareciam "sem carimbo" porque chegavam como ig/social/link_in_bio.
export const BIO_ORIGIN = {
  utmSource: "organico_bio",
  utmMedium: "bio",
  utmContent: "lp_bio",
} as const;

const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_content",
  "utm_campaign",
  "utm_term",
] as const;

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

  // Vazio conta como ausente; fallback é atômico (ver bloco no topo).
  const utm = (key: string) => params.get(key)?.trim() ?? "";
  const urlTemUtm = UTM_KEYS.some((k) => utm(k) !== "");

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
      utm_term: utm("utm_term"),
      userAgent: navigator.userAgent,
      appVersion,
      utm_medium: urlTemUtm ? utm("utm_medium") : BIO_ORIGIN.utmMedium,
      utm_source: urlTemUtm ? utm("utm_source") : BIO_ORIGIN.utmSource,
      utm_content: urlTemUtm ? utm("utm_content") : BIO_ORIGIN.utmContent,
      utm_campaign: utm("utm_campaign"),
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
