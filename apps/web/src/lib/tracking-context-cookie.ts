import { fieldOf, observationSchema, patternOf } from "@click-cannabis/tracking-edge/edge";

export const COOKIE_CONTEXTO = "ctx1";

const padrao = new RegExp(patternOf(fieldOf(observationSchema, "tracking_context_id")));

export function contextoValido(valor: string | undefined | null): string | undefined {
  return typeof valor === "string" && padrao.test(valor) ? valor : undefined;
}

export function contextoDoCabecalhoCookie(cabecalho: string | null): string | undefined {
  if (!cabecalho) return undefined;

  for (const parte of cabecalho.split(";")) {
    const separador = parte.indexOf("=");
    if (separador === -1) continue;
    if (parte.slice(0, separador).trim() !== COOKIE_CONTEXTO) continue;
    return contextoValido(decodeURIComponent(parte.slice(separador + 1).trim()));
  }

  return undefined;
}
