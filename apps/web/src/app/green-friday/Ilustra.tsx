"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Doctor, Jump, Meditate, Stand } from "./mascote/shared";

// Ilustrações no estilo "Ilustra Click" (adsmaker/ESTILO_ILUSTRA_CLICK.md):
// vetor geométrico, paleta tonal de verdes, card de cantos arredondados.
// O boneco é o mascote oficial da Click (mascote/, vetorizado das artes da marca).

const SYMBOL_D =
  "M26.808 50.549a4.986 4.986 0 0 0 0 7.026 4.93 4.93 0 0 0 6.993 0 4.986 4.986 0 0 0 0-7.026l-3.497-3.514zM26.508 0h7.593v31.112l19.837-19.94 5.368 5.395-17.612 17.705h18.915v7.63H0v-7.63h18.915L1.303 16.567l5.368-5.394 19.837 19.939z";

export type Pose = "acena" | "comemora" | "medico" | "medita";

// Poses do mascote oficial, usadas como estão na arte (sem redesenhar).
export function Mascote({ pose = "acena", size = 120 }: { pose?: Pose; size?: number }) {
  const reduce = useReducedMotion();
  const p = { x: 50, y: 97, h: pose === "medita" ? 70 : 92 };
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} aria-hidden="true">
      <ellipse cx="50" cy="97" rx="24" ry="3" fill="#000" opacity=".1" />
      <motion.g
        animate={reduce ? undefined : pose === "comemora" ? { y: [0, -5, 0] } : { y: [0, -1.5, 0] }}
        transition={{ duration: pose === "comemora" ? 1.1 : 2.6, repeat: Infinity, ease: "easeInOut" }}
      >
        {pose === "acena" && <Stand {...p} />}
        {pose === "comemora" && <Jump {...p} h={84} />}
        {pose === "medico" && <Doctor {...p} />}
        {pose === "medita" && <Meditate {...p} />}
      </motion.g>
    </svg>
  );
}

export type Prop = "conversa" | "celular" | "calendario" | "presente" | "coracao";

function PropSvg({ prop }: { prop: Prop }) {
  switch (prop) {
    case "conversa":
      return (
        <svg viewBox="0 0 90 80" width="96" aria-hidden="true">
          <rect x="4" y="6" width="70" height="44" rx="14" fill="#F4F1E6" />
          <path d="M18 50 L14 64 L32 50Z" fill="#F4F1E6" />
          <rect x="16" y="19" width="44" height="5" rx="2.5" fill="#9CC48F" />
          <rect x="16" y="30" width="30" height="5" rx="2.5" fill="#C9DFBF" />
          <circle cx="76" cy="58" r="13" fill="#3D8F4A" />
          <path d="M70 58 l4 4 l8 -9" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "celular":
      return (
        <svg viewBox="0 0 70 110" width="70" aria-hidden="true">
          <rect x="2" y="2" width="66" height="106" rx="12" fill="#1C4423" />
          <rect x="7" y="9" width="56" height="88" rx="7" fill="#E9F2E3" />
          <circle cx="35" cy="40" r="18" fill="#B9D7AE" />
          <circle cx="35" cy="34" r="7" fill="#2B6B35" />
          <path d="M23 52 Q35 40 47 52" fill="#2B6B35" />
          <path d="M29 44 q-2 7 3 9 M41 44 q2 7 -3 9" stroke="#F4F1E6" strokeWidth="1.6" fill="none" strokeLinecap="round" />
          <circle cx="24" cy="78" r="7" fill="#3D8F4A" />
          <circle cx="46" cy="78" r="7" fill="#D9573E" />
        </svg>
      );
    case "calendario":
      return (
        <svg viewBox="0 0 84 84" width="84" aria-hidden="true">
          <rect x="4" y="12" width="76" height="68" rx="10" fill="#F4F1E6" />
          <rect x="4" y="12" width="76" height="18" rx="10" fill="#2B6B35" />
          <rect x="4" y="22" width="76" height="8" fill="#2B6B35" />
          <rect x="20" y="4" width="6" height="16" rx="3" fill="#1C4423" />
          <rect x="58" y="4" width="6" height="16" rx="3" fill="#1C4423" />
          <circle cx="42" cy="55" r="14" fill="#3D8F4A" />
          <path d="M35 55 l5 5 l9 -10" stroke="#fff" strokeWidth="3.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "presente":
      return (
        <svg viewBox="0 0 84 84" width="84" aria-hidden="true">
          <rect x="8" y="34" width="68" height="46" rx="6" fill="#2B6B35" />
          <rect x="4" y="24" width="76" height="16" rx="5" fill="#3D8F4A" />
          <rect x="37" y="24" width="10" height="56" fill="#E8D27A" />
          <path d="M42 24 C30 6 14 14 24 24Z M42 24 C54 6 70 14 60 24Z" fill="#E8D27A" />
        </svg>
      );
    case "coracao":
      return (
        <svg viewBox="0 0 84 76" width="80" aria-hidden="true">
          <path d="M42 72 C10 50 2 34 8 20 C14 6 34 4 42 20 C50 4 70 6 76 20 C82 34 74 50 42 72Z" fill="#F4F1E6" />
          <path d="M42 60 C20 44 16 34 20 26 C24 18 36 18 42 28 C48 18 60 18 64 26 C68 34 64 44 42 60Z" fill="#3D8F4A" />
        </svg>
      );
  }
}

// Card ilustrado: degradê tonal de verde, "chão" suave, boneco + objeto da cena.
export function Cena({ pose, prop, compact = false }: { pose: Pose; prop?: Prop; compact?: boolean }) {
  return (
    <div
      className={`relative flex items-end justify-center gap-4 overflow-hidden rounded-[22px] ${compact ? "h-36" : "h-44 sm:h-52"}`}
      style={{ background: "radial-gradient(80% 70% at 30% 20%, #F4F7EA 0%, #DDEBCF 60%, #CBE0BA 100%)" }}
    >
      <div className="absolute inset-x-0 bottom-0 h-10" style={{ background: "#BCD6A8" }} aria-hidden="true" />
      <div className="absolute -right-6 -top-8 size-28 rounded-full" style={{ background: "#FFFFFF", opacity: 0.45 }} aria-hidden="true" />
      <div className="relative z-10 pb-2">
        <Mascote pose={pose} size={compact ? 104 : 124} />
      </div>
      {prop && (
        <div className="relative z-10 pb-6">
          <PropSvg prop={prop} />
        </div>
      )}
    </div>
  );
}

// Símbolo pequeno do canto superior direito, como nas peças do estilo.
export function SimboloClick({ size = 28 }: { size?: number }) {
  return (
    <svg viewBox="0 0 61 60" width={size} height={size} role="img" aria-label="Click Cannabis">
      <path fill="#285E31" d={SYMBOL_D} />
    </svg>
  );
}
