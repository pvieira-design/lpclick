import { C, Stand, type SceneDef } from "./shared";

// Respiração guiada: mascote de pé, olhos fechados e sereno, com um halo de
// respiração atrás e uma linha que vai de agitada (esquerda) a suave (direita).
// Marcado: o halo expande e contrai (inspira/expira, 4s) e o mascote acompanha.
const scene: SceneDef = {
  css: `
.gi .ax-ring { transform-origin: 50% 50%; }
.gi.on .ax-ring { animation: ax-breathe 4s ease-in-out infinite; }
.gi.on .ax-ring2 { animation-name: ax-breathe2; }
@keyframes ax-breathe { 0%, 100% { transform: scale(.86); } 50% { transform: scale(1.06); } }
@keyframes ax-breathe2 { 0%, 100% { transform: scale(.84); opacity: .15; } 50% { transform: scale(1.06); opacity: .4; } }
.gi .ax-body { transform-origin: 50% 100%; }
.gi.on .ax-body { animation: ax-body 4s ease-in-out infinite; }
@keyframes ax-body { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.03, 1.05); } }
`,
  Scene: () => (
    <>
      {/* halo de respiração */}
      <circle className="t ax-ring" cx="40" cy="38" r="24" fill={C.green} opacity=".1" />
      <circle className="t ax-ring ax-ring2" cx="40" cy="38" r="29.5" fill="none" stroke={C.green} strokeWidth="1.4" opacity=".35" />
      {/* linha: agitada → calma */}
      <path
        d="M4 52l3-5 3 9 3-10 3 9 3-6 3 4h4M48 52q4-2 8 0t8 0 8 0 8 0"
        fill="none"
        stroke={C.dark}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity=".55"
      />
      {/* sombra */}
      <ellipse cx="40" cy="72.5" rx="16" ry="2.4" fill={C.dark} opacity=".14" />
      {/* mascote */}
      <g className="t ax-body">
        <Stand x={40} y={70} h={46} eyes="closed" />
      </g>
    </>
  ),
};

export default scene;
