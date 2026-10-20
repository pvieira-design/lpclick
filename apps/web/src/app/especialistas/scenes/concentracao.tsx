import { C, Glasses, Stand, type SceneDef } from "./shared";

// Mascote lendo: de pé com os óculos da arte, livro aberto (capa verde-escura,
// páginas creme com linhas) na frente das pernas. Marcado: uma página vira
// em loop e o mascote inclina levemente, como quem lê.
const M = { x: 40, y: 70.8, h: 46.8 };

// linhas de texto de uma página (lado esquerdo; o direito é espelhado)
const LINES = [59.5, 62.5, 65.5];

const scene: SceneDef = {
  css: `
.gi .co-body { transform-origin: 50% 100%; }
.gi.on .co-body { animation: co-tilt 3.2s ease-in-out infinite; }
@keyframes co-tilt { 0%, 100% { transform: rotate(0); } 50% { transform: rotate(-3deg); } }
.gi .co-page { opacity: 0; transform-origin: 0% 50%; }
.gi.on .co-page { animation: co-page 3.2s ease-in-out infinite; }
@keyframes co-page { 0%, 15% { opacity: 0; transform: scaleX(1); } 18% { opacity: 1; transform: scaleX(1); } 55% { opacity: 1; transform: scaleX(-1); } 60%, 100% { opacity: 0; transform: scaleX(-1); } }
`,
  Scene: () => (
    <>
      <g className="t co-body">
        <Stand x={M.x} y={M.y} h={M.h} eyes="none" />
        <Glasses x={M.x} y={M.y} h={M.h} />
        {/* livro aberto */}
        <g transform="translate(0 -2)">
          <path d="M18 56.5q11-3.5 22 0q11-3.5 22 0V72q-11-3.5-22 0q-11-3.5-22 0z" fill={C.dark} />
          <path d="M20 55q10-3 20 0v14.5q-10-3-20 0z" fill={C.light} />
          <path d="M60 55q-10-3-20 0v14.5q10-3 20 0z" fill={C.light} />
          {LINES.map((y) => (
            <g key={y} stroke={C.dark} strokeWidth=".9" strokeLinecap="round" fill="none" opacity=".35">
              <path d={`M23 ${y}q7.5-2 15 0`} />
              <path d={`M42 ${y}q7.5-2 15 0`} />
            </g>
          ))}
          {/* página que vira */}
          <path className="t co-page" d="M40 55q10-3 20 0v14.5q-10-3-20 0z" fill={C.cream} />
        </g>
      </g>
    </>
  ),
};

export default scene;
