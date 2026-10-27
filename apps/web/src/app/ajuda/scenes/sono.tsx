import { C, Stand, type SceneDef } from "./shared";

// Mascote dormindo: deitado no travesseiro, coberto até a barra, olhos
// fechados, lua e "z". Marcado: os "z" sobem e somem e o mascote respira.
const scene: SceneDef = {
  css: `
.gi .sl-z { opacity: 0; }
.gi.on .sl-z { animation: sl-z 2.6s ease-in-out infinite; }
.gi.on .sl-z2 { animation-delay: .9s; }
@keyframes sl-z { 0% { opacity: 0; transform: translate(0, 2px); } 30%, 60% { opacity: 1; } 100% { opacity: 0; transform: translate(2px, -4px); } }
.gi .sl-body { transform-origin: 50% 100%; }
.gi.on .sl-body { animation: sl-breathe 3.2s ease-in-out infinite; }
@keyframes sl-breathe { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.035, 1.05); } }
`,
  Scene: () => (
    <>
      {/* lua */}
      <path d="M60 12.5a7.5 7.5 0 1 0 8 10.9 6 6 0 1 1-8-10.9z" fill={C.dark} />
      {/* travesseiro */}
      <rect x="10" y="40" width="60" height="17" rx="8.5" fill={C.light} />
      {/* mascote (pernas escondidas sob o cobertor) */}
      <g className="t sl-body">
        <Stand x={40} y={68.4} h={43.4} eyes="closed" />
      </g>
      {/* cobertor */}
      <path d="M2 52q19-4.5 38-1.5t38 1.5V80H2z" fill={C.dark} />
      <path d="M2 58.5q19-4.5 38-1.5t38 1.5" fill="none" stroke={C.cream} strokeWidth="1.6" opacity=".55" />
      {/* z */}
      <path className="t sl-z" d="M15.5 23h4l-4 4h4" fill="none" stroke={C.dark} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path className="t sl-z sl-z2" d="M21.5 15.5h3.2l-3.2 3.2h3.2" fill="none" stroke={C.dark} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
};

export default scene;
