// Captação de leads — contrato preservado do projeto de origem.
"use client";

const PHONE = process.env.NEXT_PUBLIC_WHATSAPP_PHONE ?? "5521993686082";

const LEADS_API_ENDPOINT = "/api/leads";

// LP de anúncio: a origem vem 100% da URL do anúncio (o Meta preenche as UTMs).
// Sem carimbo padrão, igual à lp5 — se o anúncio subir sem UTM, o lead chega
// sem origem, e a atribuição no Gerenciador fica limpa.

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
      utm_medium: params.get("utm_medium") ?? "",
      utm_source: params.get("utm_source") ?? "",
      utm_content: params.get("utm_content") ?? "",
      utm_campaign: params.get("utm_campaign") ?? "",
    },
  };
}

export function sendLeadToApi(payload: LeadPayload): void {
  postEmSegundoPlano(LEADS_API_ENDPOINT, JSON.stringify(payload));
}

function postEmSegundoPlano(endpoint: string, body: string): void {
  // sendBeacon sobrevive à navegação disparada por window.open — preferência nº 1.
  if (typeof navigator.sendBeacon === "function") {
    const blob = new Blob([body], { type: "application/json" });
    if (navigator.sendBeacon(endpoint, blob)) return;
  }

  fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => {});
}

// Respostas do quiz salvas no Neon (form_submissions) para cruzar com o
// tracking e o CRM. Em segundo plano, sem await: nunca atrasa o window.open do
// WhatsApp. Falha é silenciosa.
export function sendQuizAnswers(formType: string, respostas: Record<string, unknown>): void {
  // Em dev, não suja o Neon de produção: loga o payload e sai.
  if (process.env.NODE_ENV === "development") {
    console.info("[quiz] dev — respostas não salvas no Neon", { formType, respostas });
    return;
  }

  const utm = Object.fromEntries(
    [...new URLSearchParams(window.location.search)].filter(([k]) => k.startsWith("utm_")),
  );
  postEmSegundoPlano(
    "/api/forms/submit",
    JSON.stringify({ formType, payload: { ...respostas, pageUrl: window.location.href, ...utm } }),
  );
}

// Diferente das outras LPs: o CRM hoje registra o contato assim que a mensagem
// chega, sem depender do texto exato (confirmado pelo Guira em 30/10/2026).
// Por isso a triagem do quiz e o prêmio da roleta seguem no corpo da mensagem.
export function buildWhatsAppUrl(text: string): string {
  return `https://api.whatsapp.com/send/?phone=${PHONE}&text=${encodeURIComponent(text)}&type=phone_number&app_absent=0`;
}
