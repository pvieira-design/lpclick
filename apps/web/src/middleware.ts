import { NextResponse } from "next/server";
import type { NextFetchEvent, NextRequest } from "next/server";
import {
  buildEdgeSeen,
  createHttpSinkTransport,
  createOutbox,
  generateTrackingContextId,
  visitorCandidates,
} from "@click-cannabis/tracking-edge/edge";
import { COOKIE_CONTEXTO as COOKIE, contextoValido } from "@/lib/tracking-context-cookie";
import { resolveDestinoDoTracking, resolveTokenDoTracking } from "@/lib/tracking-sink";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;
const DESTINO = resolveDestinoDoTracking(process.env);
const COOKIE_DOMAIN = process.env.TRACKING_COOKIE_DOMAIN ?? ".clickatendimento.com";

const CAMPAIGN_PARAMS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "gclid",
  "fbclid",
  "gbraid",
  "wbraid",
  "ttclid",
];

const TOKEN = resolveTokenDoTracking(process.env);
const deliver =
  DESTINO.envia && TOKEN !== undefined
    ? createHttpSinkTransport({
        url: DESTINO.url,
        timeoutMs: 2000,
        headers: { authorization: `Bearer ${TOKEN}` },
      })
    : null;

function clientIp(request: NextRequest): string | undefined {
  const real = request.headers.get("x-real-ip")?.trim();
  if (real) return real;
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || undefined;
}

function hostDe(request: NextRequest): string {
  return (request.headers.get("host") ?? request.nextUrl.hostname).split(":")[0];
}

function candidatos(request: NextRequest, url: string) {
  return visitorCandidates({
    url,
    referrer: request.headers.get("referer") ?? undefined,
    userAgent: request.headers.get("user-agent") ?? undefined,
    cookies: Object.fromEntries(
      request.cookies.getAll().map(cookie => [cookie.name, cookie.value])
    ),
    ip: clientIp(request),
  });
}

function cobreSubdominios(host: string): boolean {
  const raiz = COOKIE_DOMAIN.replace(/^\./, "");
  return Boolean(raiz) && (host === raiz || host.endsWith(`.${raiz}`));
}

function gravaCookie(
  response: NextResponse,
  request: NextRequest,
  nome: string,
  valor: string,
  maxAge: number
) {
  response.cookies.set(nome, valor, {
    maxAge,
    path: "/",
    sameSite: "lax",
    httpOnly: false,
    secure: request.nextUrl.protocol === "https:",
    ...(cobreSubdominios(hostDe(request)) ? { domain: COOKIE_DOMAIN } : {}),
  });
}

function entrega(
  response: NextResponse,
  event: NextFetchEvent,
  request: NextRequest,
  trackingContextId: string,
  motivo: string,
  url: string
) {
  const enrichment = candidatos(request, url);
  const observation = buildEdgeSeen({
    trackingContextId,
    consent: { status: "granted", source: "default" },
    host: hostDe(request),
    path: new URL(url).pathname,
    enrichment,
  });
  if (enrichment.fbc && enrichment.fbc !== request.cookies.get("_fbc")?.value) {
    gravaCookie(response, request, "_fbc", enrichment.fbc, 60 * 60 * 24 * 90);
    response.headers.set("Cache-Control", "private, no-store");
  }
  response.headers.set("x-tracking-context", trackingContextId);
  response.headers.set("x-tracking-observation", observation.observation_id);
  response.headers.set("x-tracking-reason", motivo);

  if (!deliver) {
    response.headers.set(
      "x-tracking-entrega",
      `bloqueada-${(DESTINO as { motivo: string }).motivo}`
    );
    return;
  }

  const outbox = createOutbox({
    transport: deliver,
    maxAttempts: 3,
    baseDelayMs: 200,
    maxDelayMs: 1000,
    jitter: Math.random,
  });
  event.waitUntil(
    outbox
      .enqueue(observation)
      .then(() => {
        const failed = outbox.deadLetters()[0];
        if (failed)
          console.error("[edge] entrega-esgotada", observation.observation_id, failed.status);
      })
      .catch(() => {
        console.error("[edge] entrega-interrompida", observation.observation_id);
      })
  );
}

function ehNavegacao(request: NextRequest): boolean {
  const dest = request.headers.get("sec-fetch-dest");
  if (dest) return dest === "document";
  return (request.headers.get("accept") ?? "").includes("text/html");
}

function veioDaPropriaCasa(request: NextRequest): boolean {
  const referer = request.headers.get("referer");
  if (!referer) return false;
  try {
    return new URL(referer).host.split(":")[0] === hostDe(request);
  } catch {
    return false;
  }
}

export function middleware(request: NextRequest, event: NextFetchEvent) {
  const cookieValue = request.cookies.get(COOKIE)?.value;
  const existing = contextoValido(cookieValue);

  const response = NextResponse.next();
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/image/")) {
    response.headers.set("Cache-Control", "public, max-age=31536000, immutable");
  }

  const navegacao = ehNavegacao(request);
  const trackingContextId = existing ?? generateTrackingContextId();
  const isNewContext = !existing;
  const semCookieAposNavegar = isNewContext && navegacao && veioDaPropriaCasa(request);
  const hasCampaign = CAMPAIGN_PARAMS.some(p => request.nextUrl.searchParams.has(p));

  if (isNewContext && navegacao) {
    gravaCookie(response, request, COOKIE, trackingContextId, COOKIE_MAX_AGE);
    response.headers.set("Cache-Control", "private, no-store");
  }

  if (semCookieAposNavegar) {
    response.headers.set("x-tracking-storage", "sem-cookie-apos-navegacao");
  }

  if (pathname.replace(/\/$/, "") === "/api/tracking/observations") {
    response.headers.set("Cache-Control", "no-store");
  } else if (pathname.startsWith("/api/") && !isNewContext) {
    response.headers.set("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300");
  }

  if (navegacao && (isNewContext || hasCampaign)) {
    const motivo = semCookieAposNavegar
      ? "contexto-novo-sem-cookie"
      : isNewContext
        ? "contexto-novo"
        : "campanha";
    entrega(response, event, request, trackingContextId, motivo, request.nextUrl.href);
  } else {
    response.headers.set("x-tracking-context", trackingContextId);
    response.headers.set("x-tracking-reason", navegacao ? "sem-sinal-novo" : "nao-e-navegacao");
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|webp|avif|svg|ico|css|js)$).*)",
  ],
};
