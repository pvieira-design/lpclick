import { NextRequest, NextResponse } from "next/server";
import {
  createHttpSinkTransport,
  isBrowserObservation,
  MAX_PAYLOAD_BYTES,
} from "@click-cannabis/tracking-edge";
import { COOKIE_CONTEXTO, contextoValido } from "@/lib/tracking-context-cookie";
import { limiteDaObservacao } from "@/lib/tracking-rate-limit";
import { resolveDestinoDoTracking, resolveTokenDoTracking } from "@/lib/tracking-sink";

const destino = resolveDestinoDoTracking(process.env);
const token = resolveTokenDoTracking(process.env);
const deliver =
  destino.envia && token !== undefined
    ? createHttpSinkTransport({
        url: destino.url,
        timeoutMs: 4000,
        headers: { authorization: `Bearer ${token}` },
      })
    : null;

function respond(status: number, body: Record<string, unknown>, retryAfterMs?: number) {
  return NextResponse.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store",
      ...(retryAfterMs === undefined
        ? {}
        : { "Retry-After": String(Math.ceil(retryAfterMs / 1000)) }),
    },
  });
}

async function readPayload(
  request: NextRequest
): Promise<{ ok: true; value: unknown } | { ok: false; status: number }> {
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
    return { ok: false, status: 415 };
  }
  if (Number(request.headers.get("content-length")) > MAX_PAYLOAD_BYTES) {
    return { ok: false, status: 413 };
  }
  const reader = request.body?.getReader();
  if (!reader) return { ok: false, status: 400 };
  const chunks: Uint8Array[] = [];
  let total = 0;
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > MAX_PAYLOAD_BYTES) {
        await reader.cancel();
        return { ok: false, status: 413 };
      }
      chunks.push(value);
    }
    const bytes = new Uint8Array(total);
    let offset = 0;
    for (const chunk of chunks) {
      bytes.set(chunk, offset);
      offset += chunk.byteLength;
    }
    return { ok: true, value: JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes)) };
  } catch {
    return { ok: false, status: 400 };
  } finally {
    reader.releaseLock();
  }
}

export async function POST(request: NextRequest) {
  let origin: URL;
  try {
    origin = new URL(request.headers.get("origin") ?? "");
  } catch {
    return respond(403, { accepted: false });
  }
  if (
    !["http:", "https:"].includes(origin.protocol) ||
    origin.host !== request.headers.get("host") ||
    request.headers.get("sec-fetch-site") === "cross-site"
  ) {
    return respond(403, { accepted: false });
  }
  const contexto = contextoValido(request.cookies.get(COOKIE_CONTEXTO)?.value);
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const limite = limiteDaObservacao(contexto, ip);
  if (!limite.permitido) return respond(429, { accepted: false }, limite.esperarMs);

  const body = await readPayload(request);
  if (!body.ok) return respond(body.status, { accepted: false });
  if (!isBrowserObservation(body.value)) return respond(422, { accepted: false });
  const observation = body.value;
  if (
    observation.tracking_context_id !== contexto ||
    observation.provenance.host !== origin.hostname
  ) {
    return respond(403, { accepted: false });
  }
  if (!deliver) return respond(503, { accepted: false });
  const result = await deliver(observation);
  const detail = result.detail as { duplicate?: unknown; conflict?: unknown } | null;
  if (result.ok) {
    return respond(200, {
      accepted: true,
      duplicate: detail?.duplicate === true,
      observation_id: observation.observation_id,
    });
  }
  const status =
    detail?.conflict === true ? 409 : result.retryable ? (result.status === 429 ? 429 : 503) : 422;
  return respond(status, { accepted: false }, result.retryAfterMs);
}
