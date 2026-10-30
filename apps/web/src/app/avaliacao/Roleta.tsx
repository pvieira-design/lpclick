"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { animate, useReducedMotion, type AnimationPlaybackControls } from "framer-motion";
import { sendGTMEvent } from "@next/third-parties/google";

// Roleta adaptada da /oferta, com sorteio de verdade e pesos definidos pelo
// Guira em 30/10/2026: retorno incluso 50%, 2 por 1 30%, cashback 20%.
export type PremioId = "retorno" | "dupla" | "cashback";

export const PREMIOS: Record<PremioId, { titulo: string; desc: string; mensagem: string; peso: number }> = {
  retorno: {
    titulo: "1ª consulta por R$40 com retorno incluso",
    desc: "Sua primeira consulta sai por R$40 e a consulta de retorno já vem junto.",
    mensagem: "Ganhei na Roleta Click: 1ª consulta por R$40 com retorno incluso.",
    peso: 50,
  },
  dupla: {
    titulo: "2 consultas pelo preço de 1",
    desc: "Duas consultas por R$25 cada. Você pode usar a segunda no seu acompanhamento.",
    mensagem: "Ganhei na Roleta Click: 2 consultas pelo preço de 1 (R$25 cada).",
    peso: 30,
  },
  cashback: {
    titulo: "R$50 de cashback",
    desc: "Use o cupom CASHBACK no link de pagamento da consulta. Você recebe os R$50 se iniciar o tratamento.",
    mensagem: "Ganhei na Roleta Click: R$50 de cashback (cupom CASHBACK).",
    peso: 20,
  },
};

// Cada prêmio ocupa duas fatias opostas; a roda alterna as cores.
const FATIAS: { id: PremioId; linhas: [string, string] }[] = [
  { id: "retorno", linhas: ["R$40 com", "retorno"] },
  { id: "dupla", linhas: ["2 consultas", "por 1"] },
  { id: "cashback", linhas: ["R$50", "cashback"] },
  { id: "retorno", linhas: ["R$40 com", "retorno"] },
  { id: "dupla", linhas: ["2 consultas", "por 1"] },
  { id: "cashback", linhas: ["R$50", "cashback"] },
];

const N = FATIAS.length;
const SEG = 360 / N;
const SPIN_S = 6.4;
const VOLTAS = 6;
const STORAGE_KEY = "avaliacao_premio";

function sortearPremio(): PremioId {
  const ids = Object.keys(PREMIOS) as PremioId[];
  let r = Math.random() * ids.reduce((s, id) => s + PREMIOS[id].peso, 0);
  for (const id of ids) {
    r -= PREMIOS[id].peso;
    if (r < 0) return id;
  }
  return "retorno";
}

// Mesma curva da /oferta: aceleração, embalo e frenagem longa.
function spinEase(t: number) {
  const acceleration = 0.14;
  const cruise = 0.16;
  const braking = 0.7;
  const distance = acceleration / 2 + cruise + braking / 3;
  if (t < acceleration) return (t * t) / (2 * acceleration) / distance;
  if (t < acceleration + cruise) return (acceleration / 2 + t - acceleration) / distance;
  const u = (t - acceleration - cruise) / braking;
  return (acceleration / 2 + cruise + (braking * (1 - Math.pow(1 - u, 3))) / 3) / distance;
}

// Giro único: o prêmio fica salvo no navegador, então refazer o quiz não sorteia de novo.
export function premioSalvo(): PremioId | null {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return v && v in PREMIOS ? (v as PremioId) : null;
  } catch {
    return null;
  }
}

export default function Roleta({ onResultado }: { onResultado: (p: PremioId) => void }) {
  const reduce = useReducedMotion();
  const [girando, setGirando] = useState(false);
  const [status, setStatus] = useState("Toque no botão e descubra seu benefício.");
  const wheelRef = useRef<SVGGElement>(null);
  const pointerRef = useRef<SVGGElement>(null);
  const ctrl = useRef<AnimationPlaybackControls | null>(null);
  const timeouts = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(
    () => () => {
      ctrl.current?.stop();
      timeouts.current.forEach(clearTimeout);
    },
    [],
  );

  const vibrate = (p: number | number[]) => {
    try {
      navigator.vibrate?.(p);
    } catch {
      /* alguns browsers bloqueiam; nunca quebrar o fluxo */
    }
  };

  const girar = useCallback(() => {
    if (girando) return;
    setGirando(true);
    setStatus("Girando a roleta…");
    vibrate(20);

    const premio = sortearPremio();
    const opcoes = FATIAS.flatMap((f, i) => (f.id === premio ? [i] : []));
    const i = opcoes[Math.floor(Math.random() * opcoes.length)];
    const centro = i * SEG + SEG / 2;
    const target = 360 * VOLTAS + ((360 - centro) % 360);

    sendGTMEvent({ event: "roletaGirou", category: "Roleta", action: "Spin", label: "Girar roleta - Avaliacao" });

    let lastSeg = 0;
    ctrl.current = animate(0, 1, {
      duration: reduce ? 1.2 : SPIN_S,
      ease: "linear",
      onUpdate: (p) => {
        if (reduce) return;
        const r = target * spinEase(p);
        if (wheelRef.current) wheelRef.current.style.transform = `rotate(${r}deg)`;
        const seg = Math.floor(r / SEG);
        if (seg !== lastSeg) {
          lastSeg = seg;
          vibrate(5);
          const ptr = pointerRef.current;
          if (ptr) {
            ptr.classList.add("nudge");
            timeouts.current.push(setTimeout(() => ptr.classList.remove("nudge"), 70));
          }
        }
        if (p > 0.55) setStatus("Quase lá…");
      },
      onComplete: () => {
        if (wheelRef.current) wheelRef.current.style.transform = `rotate(${target}deg)`;
        setStatus("É seu!");
        vibrate([80, 50, 80, 50, 180]);
        try {
          localStorage.setItem(STORAGE_KEY, premio);
        } catch {
          /* storage bloqueado não pode impedir o prêmio */
        }
        sendGTMEvent({ event: "roletaResultado", category: "Roleta", action: "Result", label: PREMIOS[premio].titulo });
        timeouts.current.push(setTimeout(() => onResultado(premio), 1100));
      },
    });
  }, [girando, reduce, onResultado]);

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 420 430" className="roleta-svg w-[min(84vw,340px)]" role="img" aria-label="Roleta Click: consulta com retorno, 2 consultas por 1 e cashback">
        <circle cx="210" cy="214" r="199" fill="#1C4423" />
        <circle cx="210" cy="210" r="199" fill="#2B6B35" />
        <circle cx="210" cy="210" r="190" fill="#F4F1E6" />
        <g ref={wheelRef} className="roleta-rotor">
          {FATIAS.map((f, i) => {
            const radius = 186;
            const pt = (deg: number) => {
              const a = ((deg - 90) * Math.PI) / 180;
              return `${(210 + radius * Math.cos(a)).toFixed(3)} ${(210 + radius * Math.sin(a)).toFixed(3)}`;
            };
            const escura = i % 2 === 0;
            return (
              <g key={i}>
                <path d={`M210 210 L${pt(i * SEG)} A${radius} ${radius} 0 0 1 ${pt((i + 1) * SEG)} Z`} fill={escura ? "#2B6B35" : "#CFE5C3"} stroke="#F4F1E6" strokeWidth="2" />
                <g transform={`rotate(${i * SEG + SEG / 2} 210 210)`}>
                  <text x="210" y="74" textAnchor="middle" fill={escura ? "#F4F1E6" : "#1C4423"} className="roleta-txt">
                    <tspan x="210">{f.linhas[0]}</tspan>
                    <tspan x="210" dy="22">{f.linhas[1]}</tspan>
                  </text>
                </g>
              </g>
            );
          })}
        </g>
        <circle cx="210" cy="210" r="50" fill="#F4F1E6" stroke="#1C4423" strokeWidth="4" />
        <image href="/click-symbol.svg" x="184" y="184" width="52" height="52" />
        <g ref={pointerRef} className="roleta-ponteiro">
          <path d="M198 4 Q210 -1 222 4 L222 20 Q220 28 210 40 Q200 28 198 20 Z" fill="#1C4423" stroke="#F4F1E6" strokeWidth="2" />
        </g>
      </svg>
      <p className="mt-3 min-h-5 text-sm" style={{ color: "var(--muted)" }} role="status" aria-live="polite">
        {status}
      </p>
      <button type="button" onClick={girar} disabled={girando} className="btn-cta mt-3 w-full max-w-xs disabled:opacity-70">
        {girando ? "Roleta girando…" : "Girar a roleta"}
      </button>
    </div>
  );
}
