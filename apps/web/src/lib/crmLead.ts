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

// Origem padrão para quando a URL não traz UTM (ex.: link da bio sem parâmetros).
// Opcional: LPs que não passam nada mantêm o comportamento anterior (undefined).
//
// Precedência (intencional): UTM na URL SEMPRE vence os defaults. Atenção: o
// Instagram anexa ig/social/link_in_bio ao link da bio, então tráfego real
// chega com UTM da Meta — os defaults só valem para URL sem nenhuma utm_*.
// O fallback é atômico: nunca mistura UTM de link com default no mesmo lead
// (param vazio conta como ausente). Ver também bio/lead.ts.
type LeadOrigin = {
  utmSource?: string;
  utmMedium?: string;
  utmContent?: string;
};

const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "utm_id",
] as const;

export function sendLeadToCrm(
  name: string,
  pathologies: string[],
  defaults?: LeadOrigin,
): void {
  // Em dev, não suja o CRM de produção: loga o payload e sai.
  if (process.env.NODE_ENV === "development") {
    console.info("[crmLead] dev — lead não enviado ao CRM", {
      name,
      pathologies,
      defaults,
    });
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const n = navigator as unknown as { platform: string };

  // Sem defaults (demais LPs): leitura crua, comportamento original intacto.
  // Com defaults (/bio): vazio = ausente, e o trio só entra se a URL não
  // trouxer nenhuma utm_* — nunca híbrido.
  const raw = (k: string) => params.get(k);
  const clean = (k: string) => params.get(k)?.trim() || null;
  const get = defaults ? clean : raw;
  const applied =
    defaults && !UTM_KEYS.some((k) => clean(k) !== null) ? defaults : undefined;

  const payload = {
    name,
    pathologies,
    utmSource: get("utm_source") ?? applied?.utmSource ?? undefined,
    utmMedium: get("utm_medium") ?? applied?.utmMedium ?? undefined,
    utmCampaign: get("utm_campaign") ?? undefined,
    utmContent: get("utm_content") ?? applied?.utmContent ?? undefined,
    utmTerm: get("utm_term") ?? undefined,
    utmId: get("utm_id") ?? undefined,
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
