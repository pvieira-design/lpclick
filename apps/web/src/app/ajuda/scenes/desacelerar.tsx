import { C, Pose, type SceneDef } from "./shared";

// Mascote meditando em pé numa perna só, mãos em mudra no alto (pose
// vetorizada da referência), com aura verde atrás. Marcado: respiração lenta
// e a aura pulsa.
const scene: SceneDef = {
  css: `
.gi .de-body { transform-box: view-box; transform-origin: 40px 70px; }
.gi.on .de-body { animation: de-breathe 4s ease-in-out infinite; }
@keyframes de-breathe { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.035); } }
.gi .de-aura { opacity: .6; }
.gi.on .de-aura { animation: de-aura 4s ease-in-out infinite; }
@keyframes de-aura { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.12); opacity: .5; } }
`,
  Scene: () => (
    <>
      <circle className="t de-aura" cx="40" cy="42" r="26" fill={C.green} fillOpacity=".12" />
      <g className="de-body">
        <Pose name="TREE" x={40} y={70} h={52} />
      </g>
    </>
  ),
};

export default scene;
