import { C, Pose, type SceneDef } from "./shared";

// Mascote velhinho de óculos e bengala (pose vetorizada da referência),
// curvado para frente com dor nas costas: traços de dor saindo das costas.
// Marcado: ele se endireita um pouco, a dor some e um brilho verde suave
// pulsa nas costas (alívio).
const B = { x: 58, y: 44 }; // costas (lombar) na cena

const scene: SceneDef = {
  css: `
.gi .do-body { transform-box: view-box; transform-origin: 42px 70px; transform: rotate(-12deg); transition: transform .7s cubic-bezier(.23,1,.32,1); }
.gi.on .do-body { transform: rotate(-3deg); }
.gi .do-pain { animation: do-pain 1.2s ease-in-out infinite; }
.gi.on .do-pain { animation: none; opacity: 0; transform: scale(.4); }
@keyframes do-pain { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.15); } }
.gi .do-glow { opacity: 0; }
.gi.on .do-glow { animation: do-glow 3s ease-in-out infinite; }
@keyframes do-glow { 0%, 100% { opacity: .12; transform: scale(.85); } 50% { opacity: .28; transform: scale(1.15); } }
`,
  Scene: () => (
    <>
      <ellipse cx="42" cy="70.5" rx="20" ry="2.2" fill={C.dark} opacity=".14" />
      <circle className="t do-glow" cx={B.x} cy={B.y} r="9" fill={C.green} />
      <g className="do-body">
        <Pose name="OLD" x={42} y={70} h={50} />
      </g>
      <g className="t do-pain" stroke={C.dark} strokeWidth="1.6" strokeLinecap="round">
        <path d={`M${B.x + 4} ${B.y - 5}l4 -3M${B.x + 5.5} ${B.y}h5M${B.x + 4} ${B.y + 5}l4 3`} />
      </g>
    </>
  ),
};

export default scene;
