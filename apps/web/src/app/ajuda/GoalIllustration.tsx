"use client";

import { useId } from "react";
import { C, type SceneDef } from "./scenes/shared";
import sono from "./scenes/sono";
import desacelerar from "./scenes/desacelerar";
import concentracao from "./scenes/concentracao";
import dores from "./scenes/dores";
import disposicao from "./scenes/disposicao";
import outros from "./scenes/outros";

// Ilustrações dos cards de objetivo de /ajuda: o mascote da Click em uma
// situação por objetivo, dentro de um círculo creme. Cada cena fica em
// scenes/<id>.tsx; o mascote base fica em scenes/shared.tsx.
//
// Ao marcar, o círculo dá um leve "pop" e a cena ganha um loop sutil. Tudo
// para com prefers-reduced-motion.

const SCENES = { sono, desacelerar, concentracao, dores, disposicao, outros } satisfies Record<string, SceneDef>;

export type IllustrationId = keyof typeof SCENES;

const BASE_CSS = `
.gi .t { transform-box: fill-box; transform-origin: center; transition: transform .5s cubic-bezier(.23,1,.32,1), opacity .4s ease-out; }
.gi .gi-badge { transform-box: view-box; transform-origin: 40px 40px; transition: transform .45s cubic-bezier(.34,1.56,.64,1); }
.gi.on .gi-badge { transform: scale(1.05); }
`;

const REDUCED_MOTION_CSS = `
@media (prefers-reduced-motion: reduce) {
  .gi *, .gi.on * { transition: none !important; animation: none !important; }
}
`;

const STYLES = BASE_CSS + [...new Set(Object.values(SCENES))].map((s) => s.css).join("\n") + REDUCED_MOTION_CSS;

export default function GoalIllustration({ id, active }: { id: IllustrationId; active: boolean }) {
  // Ids únicos e seguros para url(#...) (useId gera ":r1:").
  const base = useId().replace(/[^a-zA-Z0-9]/g, "");
  const u = (name: string) => `${base}-${name}`;
  const f = (name: string) => `url(#${u(name)})`;
  const { Scene } = SCENES[id];

  return (
    <svg viewBox="0 0 80 80" className={`gi h-full w-auto${active ? " on" : ""}`} aria-hidden="true">
      <defs>
        <clipPath id={u("clip")}>
          <circle cx="40" cy="40" r="36" />
        </clipPath>
      </defs>
      <g className="gi-badge">
        <circle cx="40" cy="40" r="36" fill={C.bg} />
        <g clipPath={f("clip")}>
          <Scene u={u} f={f} />
        </g>
      </g>
    </svg>
  );
}

// Injetado uma vez no grid (evita repetir o <style> em cada card).
export function GoalIllustrationStyles() {
  return <style>{STYLES}</style>;
}
