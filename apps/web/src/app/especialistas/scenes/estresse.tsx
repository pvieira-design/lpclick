import { C, Jump, type SceneDef } from "./shared";

// Mascote relaxando na banheira: recostado na espuma, olhos felizes, um pé
// com a sola escura para fora. Marcado: as bolhas sobem devagar e estouram.
const scene: SceneDef = {
  css: `
.gi.on .es-b { animation: es-b 3.2s ease-in-out infinite; }
.gi.on .es-b2 { animation-delay: -1.1s; }
.gi.on .es-b3 { animation-delay: -2.1s; }
@keyframes es-b { 0% { opacity: 0; transform: translate(0, 4px) scale(.6); } 25%, 65% { opacity: 1; } 100% { opacity: 0; transform: translate(1px, -6px) scale(1.25); } }
`,
  Scene: () => (
    <>
      {/* mascote recostado */}
      <Jump x={41} y={71} h={50} rotate={-14} />
      {/* espuma */}
      <g fill={C.light}>
        <circle cx="10" cy="57" r="6" />
        <circle cx="19" cy="55" r="6" />
        <circle cx="28" cy="57" r="5.5" />
        <circle cx="37" cy="56" r="5.5" />
        <circle cx="46" cy="57" r="5" />
        <circle cx="54" cy="58" r="4" />
      </g>
      {/* banheira */}
      <path d="M2 58h76v4a14 14 0 0 1-14 14H16A14 14 0 0 1 2 62z" fill={C.dark} />
      <path d="M2 58h76" stroke={C.cream} strokeWidth="1.6" opacity=".55" />
      {/* bolhas */}
      <g fill="none" stroke={C.dark} opacity=".5">
        <circle className="t es-b" cx="51" cy="37" r="2.2" strokeWidth="1.1" />
        <circle className="t es-b es-b2" cx="62" cy="29" r="2.7" strokeWidth="1.1" />
        <circle className="t es-b es-b3" cx="57" cy="19" r="1.7" strokeWidth="1" />
      </g>
    </>
  ),
};

export default scene;
