import { C, Pose, type SceneDef } from "./shared";

// Mascote correndo (pose vetorizada da referência: faixa na cabeça, meias
// altas, nuvens de poeira e sombra). Marcado: o corpo sobe e desce no ritmo
// da corrida e linhas de velocidade passam atrás.
const scene: SceneDef = {
  css: `
.gi.on .dp-run { animation: dp-bob .3s ease-in-out infinite alternate; }
@keyframes dp-bob { from { transform: translateY(0) rotate(0); } to { transform: translateY(-1.8px) rotate(-1.5deg); } }
.gi .dp-line { opacity: 0; }
.gi.on .dp-line { animation: dp-line .7s linear infinite; }
.gi.on .dp-l2 { animation-delay: -.25s; }
.gi.on .dp-l3 { animation-delay: -.5s; }
@keyframes dp-line { 0% { transform: translateX(6px); opacity: 0; } 30% { opacity: .55; } 100% { transform: translateX(-8px); opacity: 0; } }
`,
  Scene: () => (
    <>
      <g stroke={C.dark} strokeWidth="1.8" strokeLinecap="round">
        <path className="t dp-line" d="M10 26h8" />
        <path className="t dp-line dp-l2" d="M7 34h9" />
        <path className="t dp-line dp-l3" d="M11 42h7" />
      </g>
      <g className="t dp-run">
        <Pose name="RUN" x={40} y={68} h={50} cream="#DEDBA4" />
      </g>
    </>
  ),
};

export default scene;
