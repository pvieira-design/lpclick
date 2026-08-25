"use client";

import { motion, useReducedMotion } from "framer-motion";
import { LOGO_ICON_D, LOGO_TEXT_D } from "./logoPaths";

const EASE: [number, number, number, number] = [0.23, 1, 0.32, 1];

// Logo.svg inline pra animar símbolo e letras separadamente:
// símbolo entra girando em spring e dá um giro completo periódico;
// as letras revelam num wipe da esquerda pra direita.
export default function AnimatedLogo() {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return (
      <svg
        viewBox="0 0 417 60"
        width={200}
        height={29}
        role="img"
        aria-label="Click Cannabis"
      >
        <path fill="#3d8f4a" d={LOGO_ICON_D} />
        <path fill="#263a2d" d={LOGO_TEXT_D} />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 417 60"
      width={200}
      height={29}
      role="img"
      aria-label="Click Cannabis"
      style={{ overflow: "visible" }}
    >
      <defs>
        <clipPath id="consulta-logo-wipe">
          <motion.rect
            x="75"
            y="-6"
            height="72"
            initial={{ width: 0 }}
            animate={{ width: 350 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.45 }}
          />
        </clipPath>
      </defs>

      {/* Símbolo: entrada em spring com giro + giro completo periódico */}
      <motion.g
        initial={{ scale: 0, rotate: -135, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 240, damping: 17, delay: 0.15 }}
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
      >
        <motion.g
          animate={{ rotate: [0, 360] }}
          transition={{
            delay: 3,
            duration: 0.9,
            ease: [0.6, -0.12, 0.3, 1.1],
            repeat: Infinity,
            repeatDelay: 4.5,
          }}
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
        >
          <path fill="#3d8f4a" d={LOGO_ICON_D} />
        </motion.g>
      </motion.g>

      {/* Letras: wipe da esquerda pra direita */}
      <g clipPath="url(#consulta-logo-wipe)">
        <path fill="#263a2d" d={LOGO_TEXT_D} />
      </g>
    </svg>
  );
}
