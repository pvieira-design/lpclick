const SINK_PRODUCAO = "https://api-tracking.useclickcannabis.com/v1/observations";

export type DestinoDoTracking =
  | { envia: true; url: string }
  | { envia: false; motivo: "ambiente-nao-produtivo" | "endereco-invalido" };

function ehLocal(host: string): boolean {
  return host === "localhost" || host === "127.0.0.1" || host === "::1";
}

function ehProducao(env: NodeJS.ProcessEnv): boolean {
  return env.VERCEL_ENV === "production";
}

export function resolveDestinoDoTracking(env: NodeJS.ProcessEnv): DestinoDoTracking {
  const declarado = env.TRACKING_SINK_URL;

  if (ehProducao(env)) {
    return { envia: true, url: declarado && declarado.length > 0 ? declarado : SINK_PRODUCAO };
  }

  if (!declarado || declarado.length === 0) {
    return { envia: false, motivo: "ambiente-nao-produtivo" };
  }

  let host: string;
  try {
    host = new URL(declarado).hostname;
  } catch {
    return { envia: false, motivo: "endereco-invalido" };
  }

  return ehLocal(host)
    ? { envia: true, url: declarado }
    : { envia: false, motivo: "ambiente-nao-produtivo" };
}

export function resolveTokenDoTracking(env: NodeJS.ProcessEnv): string | undefined {
  const token = env.TRACKING_INGEST_TOKEN;
  return token !== undefined && token.length > 0 ? token : undefined;
}
