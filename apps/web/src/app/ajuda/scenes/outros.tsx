import { C, Doctor, type SceneDef } from "./shared";

// Médico pronto para atender: o mascote de jaleco da arte, de corpo inteiro,
// sobre um halo suave (contraste do jaleco creme), com um balão de fala
// verde-escuro e a cruz de saúde. Marcado: o balão dá um "pop" e o médico
// balança de leve, cumprimentando.
const scene: SceneDef = {
  css: `
.gi .ou-bubble { transform-origin: 0% 100%; }
.gi.on .ou-bubble { animation: ou-pop 2.8s cubic-bezier(.34,1.56,.64,1) infinite; }
@keyframes ou-pop { 0%, 40%, 100% { transform: scale(1); } 12% { transform: scale(1.16); } 24% { transform: scale(.96); } }
.gi .ou-doc { transform-origin: 50% 100%; }
.gi.on .ou-doc { animation: ou-sway 2.8s ease-in-out infinite; }
@keyframes ou-sway { 0%, 100% { transform: rotate(0deg); } 25% { transform: rotate(-3deg); } 60% { transform: rotate(2.5deg); } }
`,
  Scene: () => (
    <>
      {/* halo atrás do médico */}
      <circle cx="37" cy="47" r="25" fill={C.green} opacity=".16" />
      {/* médico */}
      <g className="t ou-doc">
        <Doctor x={37} y={72} h={53} />
      </g>
      {/* balão de fala com a cruz de saúde */}
      <g className="t ou-bubble">
        <path d="M55.5 26.5l-2.5 4l5-1.5z" fill={C.dark} />
        <circle cx="61" cy="21.5" r="7" fill={C.dark} />
        <path d="M61 17.5v8M57 21.5h8" stroke={C.cream} strokeWidth="2.4" strokeLinecap="round" />
      </g>
    </>
  ),
};

export default scene;
