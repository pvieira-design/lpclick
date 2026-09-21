type Janela = { expiraEm: number; contagem: number };

const JANELA_MS = 60_000;
const TETO_POR_CONTEXTO = 30;
const TETO_POR_IP = 120;
const MAX_CHAVES = 5_000;

const janelas = new Map<string, Janela>();

function poda(agora: number) {
  for (const [chave, janela] of janelas) {
    if (janela.expiraEm <= agora) janelas.delete(chave);
  }
  if (janelas.size > MAX_CHAVES) janelas.clear();
}

function consome(chave: string, teto: number, agora: number) {
  const janela = janelas.get(chave);
  if (janela === undefined || janela.expiraEm <= agora) {
    janelas.set(chave, { expiraEm: agora + JANELA_MS, contagem: 1 });
    return { permitido: true, esperarMs: 0 };
  }
  if (janela.contagem >= teto) {
    return { permitido: false, esperarMs: janela.expiraEm - agora };
  }
  janela.contagem += 1;
  return { permitido: true, esperarMs: 0 };
}

export function limiteDaObservacao(
  contexto: string | null | undefined,
  ip: string | null | undefined,
  agora: number = Date.now()
): { permitido: boolean; esperarMs: number } {
  if (janelas.size > MAX_CHAVES) poda(agora);

  const porIp = ip ? consome(`ip:${ip}`, TETO_POR_IP, agora) : { permitido: true, esperarMs: 0 };
  if (!porIp.permitido) return porIp;

  return contexto ? consome(`ctx:${contexto}`, TETO_POR_CONTEXTO, agora) : porIp;
}

export function limpaJanelas() {
  janelas.clear();
}

export const TETOS = { JANELA_MS, TETO_POR_CONTEXTO, TETO_POR_IP, MAX_CHAVES };
