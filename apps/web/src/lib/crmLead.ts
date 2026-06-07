// Envio de lead para o CRM Click (contrato: integracao-site-crm-leads.md).
// Chamado direto do browser — o CRM captura o IP do usuário no servidor.

const CRM_ENDPOINT = "https://projetocrm-api.runveloz.com/public/site-leads";
const APP_VERSION = "lpclick-v1";

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

export function sendLeadToCrm(name: string, pathologies: string[]): void {
  const params = new URLSearchParams(window.location.search);
  const n = navigator as unknown as { platform: string };

  const payload = {
    name,
    pathologies,
    utmSource: params.get("utm_source") ?? undefined,
    utmMedium: params.get("utm_medium") ?? undefined,
    utmCampaign: params.get("utm_campaign") ?? undefined,
    utmContent: params.get("utm_content") ?? undefined,
    utmTerm: params.get("utm_term") ?? undefined,
    utmId: params.get("utm_id") ?? undefined,
    fbclid: readFbclid() || undefined,
    fbp: readCookie("_fbp") || undefined,
    fbc: readCookie("_fbc") || undefined,
    pageUrl: window.location.href,
    referrer: document.referrer || undefined,
    language: navigator.language,
    platform: n.platform || undefined,
    userAgent: navigator.userAgent,
    appVersion: APP_VERSION,
  };

  // keepalive: o envio sobrevive ao redirect imediato para o WhatsApp.
  // Nunca bloquear o fluxo do usuário por falha de tracking.
  fetch(CRM_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    keepalive: true,
  }).catch(() => {});
}
