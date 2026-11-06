"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { animate, useReducedMotion, type AnimationPlaybackControls } from "framer-motion";
import { sendGTMEvent } from "@next/third-parties/google";
import { audio } from "./som";

// Roleta adaptada da /oferta, com sorteio de verdade e pesos definidos pelo
// Guira em 06/11/2026: 2 por 1 60%, cashback 40%. "Tente novamente" nunca sai.
export type PremioId = "dupla" | "cashback";

export const PREMIOS: Record<PremioId, { titulo: string; desc: string; mensagem: string; peso: number }> = {
  dupla: {
    titulo: "2 consultas pelo preço de 1",
    desc: "Duas consultas por R$25 cada. Você pode usar a segunda no seu acompanhamento.",
    mensagem: "Ganhei na Roleta Green Friday da Click: 2 consultas pelo preço de 1 (R$25 cada).",
    peso: 60,
  },
  cashback: {
    titulo: "R$50 de cashback",
    desc: "Use o cupom CASHBACK no link de pagamento da consulta. Você recebe os R$50 se iniciar o tratamento.",
    mensagem: "Ganhei na Roleta Green Friday da Click: R$50 de cashback (cupom CASHBACK).",
    peso: 40,
  },
};

// Os prêmios ficam estreitos e sempre entre dois "tente novamente", que é
// por onde a roda passa devagar antes de parar.
const FATIAS: { id: PremioId | "tente"; linhas: [string, string]; graus: number }[] = [
  { id: "tente", linhas: ["Tente", "novamente"], graus: 48 },
  { id: "dupla", linhas: ["2 consultas", "por 1"], graus: 45 },
  { id: "tente", linhas: ["Tente", "novamente"], graus: 48 },
  { id: "cashback", linhas: ["R$50", "cashback"], graus: 39 },
  { id: "tente", linhas: ["Tente", "novamente"], graus: 48 },
  { id: "dupla", linhas: ["2 consultas", "por 1"], graus: 45 },
  { id: "tente", linhas: ["Tente", "novamente"], graus: 48 },
  { id: "cashback", linhas: ["R$50", "cashback"], graus: 39 },
];
const INICIO = FATIAS.map((_, i) => FATIAS.slice(0, i).reduce((s, f) => s + f.graus, 0));

// Fatia sob o ponteiro com a roda girada em r graus.
function fatiaEm(r: number) {
  const w = (((-r) % 360) + 360) % 360;
  return FATIAS.findIndex((f, i) => w >= INICIO[i] && w < INICIO[i] + f.graus);
}
const SPIN_S = 7.2;
const VOLTAS = 6;
const STORAGE_KEY = "greenfriday_premio";

function sortearPremio(): PremioId {
  const ids = Object.keys(PREMIOS) as PremioId[];
  let r = Math.random() * ids.reduce((s, id) => s + PREMIOS[id].peso, 0);
  for (const id of ids) {
    r -= PREMIOS[id].peso;
    if (r < 0) return id;
  }
  return "dupla";
}

// Som sintetizado da /oferta, sem assets: estalo de catraca e arpejo de vitória.
const clickBuffers = new WeakMap<AudioContext, AudioBuffer>();

function playTick(ctx: AudioContext, strength = 1) {
  if (ctx.state !== "running") return;
  let buffer = clickBuffers.get(ctx);
  if (!buffer) {
    buffer = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * 0.025), ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    clickBuffers.set(ctx, buffer);
  }
  const t = ctx.currentTime;
  const noise = ctx.createBufferSource();
  noise.buffer = buffer;
  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = 1700;
  filter.Q.value = 0.7;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.16 * strength, t);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.025);
  noise.connect(filter).connect(gain).connect(ctx.destination);
  noise.start(t);
  noise.onended = () => { noise.disconnect(); filter.disconnect(); gain.disconnect(); };

  const body = ctx.createOscillator();
  const bodyGain = ctx.createGain();
  body.type = "sine";
  body.frequency.setValueAtTime(440, t);
  body.frequency.exponentialRampToValueAtTime(180, t + 0.035);
  bodyGain.gain.setValueAtTime(0.09 * strength, t);
  bodyGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.045);
  body.connect(bodyGain).connect(ctx.destination);
  body.start(t);
  body.stop(t + 0.05);
  body.onended = () => { body.disconnect(); bodyGain.disconnect(); };
}

function playWin(ctx: AudioContext) {
  if (ctx.state !== "running") return;
  [523.25, 659.25, 783.99, 1046.5].forEach((frequency, i) => {
    [1, 2].forEach((harmonic) => {
      const t = ctx.currentTime + i * 0.13;
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      oscillator.type = "sine";
      oscillator.frequency.value = frequency * harmonic;
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.linearRampToValueAtTime(harmonic === 1 ? 0.065 : 0.012, t + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.85);
      oscillator.connect(gain).connect(ctx.destination);
      oscillator.start(t);
      oscillator.stop(t + 0.9);
      oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); };
    });
  });
}

const LUZES = 18;

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
  const [vencedora, setVencedora] = useState<number | null>(null);
  const [mudo, setMudo] = useState(false);
  const mudoRef = useRef(false);
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
    const salvo = premioSalvo();
    if (salvo) return onResultado(salvo);
    setGirando(true);
    setStatus("Girando a roleta…");
    vibrate(20);

    // O AudioContext precisa nascer no toque do botão (política de autoplay).
    const ctx = audio();

    const premio = sortearPremio();
    const opcoes = FATIAS.flatMap((f, i) => (f.id === premio ? [i] : []));
    const i = opcoes[Math.floor(Math.random() * opcoes.length)];
    // Para logo depois de cruzar a borda, vindo do "tente novamente": o "quase".
    const parada = INICIO[i] + FATIAS[i].graus * (1 - (0.04 + Math.random() * 0.06));
    const target = 360 * VOLTAS + ((360 - parada) % 360);
    // Salva antes de animar: recarregar no meio do giro não libera outro sorteio.
    try {
      localStorage.setItem(STORAGE_KEY, premio);
    } catch {
      /* storage bloqueado não pode impedir o prêmio */
    }

    sendGTMEvent({ event: "roletaGirou", category: "Roleta", action: "Spin", label: "Girar roleta - Avaliacao" });

    let lastSeg = 0;
    ctrl.current = animate(0, 1, {
      duration: reduce ? 1.2 : SPIN_S,
      ease: "linear",
      onUpdate: (p) => {
        if (reduce) return;
        const r = target * spinEase(p);
        if (wheelRef.current) wheelRef.current.style.transform = `rotate(${r}deg)`;
        const seg = fatiaEm(r);
        if (seg !== lastSeg) {
          lastSeg = seg;
          vibrate(5);
          if (ctx && !mudoRef.current) playTick(ctx, 0.7 + 0.3 * (r / target));
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
        setVencedora(i);
        vibrate([80, 50, 80, 50, 180]);
        if (ctx && !mudoRef.current) playWin(ctx);
        sendGTMEvent({ event: "roletaResultado", category: "Roleta", action: "Result", label: PREMIOS[premio].titulo });
        timeouts.current.push(setTimeout(() => onResultado(premio), 1100));
      },
    });
  }, [girando, reduce, onResultado]);

  return (
    <div className="flex flex-col items-center">
      <button
        type="button"
        onClick={() => setMudo((m) => { mudoRef.current = !m; return !m; })}
        aria-pressed={!mudo}
        aria-label={mudo ? "Ativar som" : "Desativar som"}
        className="mb-2 flex items-center gap-1.5 self-end rounded-full border bg-white px-3 py-1.5 text-xs font-medium"
        style={{ borderColor: "var(--line)", color: "var(--muted)" }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4V5Z" />{mudo ? <path d="m16 9 6 6m0-6-6 6" /> : <><path d="M15 8a6 6 0 0 1 0 8" /><path d="M18 5a10 10 0 0 1 0 14" /></>}</svg>
        Som {mudo ? "desligado" : "ligado"}
      </button>
      <svg viewBox="0 0 420 430" onClick={girar} className={`roleta-svg w-[min(84vw,340px)] cursor-pointer${girando && vencedora === null ? " girando" : ""}${vencedora !== null ? " ganhou" : ""}`} role="img" aria-label="Roleta Click: 2 consultas por 1, cashback e tente novamente">
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
            const escura = f.id === "tente";
            return (
              <g key={i} className="roleta-fatia" style={{ opacity: vencedora === null || vencedora === i ? 1 : 0.35 }}>
                <path d={`M210 210 L${pt(INICIO[i])} A${radius} ${radius} 0 0 1 ${pt(INICIO[i] + f.graus)} Z`} fill={escura ? "#2B6B35" : "#CFE5C3"} stroke="#F4F1E6" strokeWidth="2" />
                <g transform={`rotate(${INICIO[i] + f.graus / 2} 210 210)`}>
                  <text x="210" y="68" textAnchor="middle" fill={escura ? "#F4F1E6" : "#1C4423"} className="roleta-txt" style={{ fontSize: 15 }}>
                    <tspan x="210">{f.linhas[0]}</tspan>
                    <tspan x="210" dy="22">{f.linhas[1]}</tspan>
                  </text>
                </g>
              </g>
            );
          })}
        </g>
        {Array.from({ length: LUZES }).map((_, k) => {
          const a = ((k * 360) / LUZES - 90) * (Math.PI / 180);
          return <circle key={k} className={`roleta-luz ${k % 2 ? "impar" : "par"}`} cx={210 + 194.5 * Math.cos(a)} cy={210 + 194.5 * Math.sin(a)} r="3.2" />;
        })}
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
        {vencedora !== null ? "Benefício garantido!" : girando ? "Roleta girando…" : "Girar a roleta"}
      </button>
    </div>
  );
}
