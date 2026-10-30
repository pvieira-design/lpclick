import * as M from "./mascot";
import * as X from "./mascot-extra";

// Cópia de especialistas/scenes/shared.tsx (cada LP tem a sua). Mascote da
// Click vetorizado direto das artes oficiais (mascot.ts, gerado) e
// utilitários das cenas dos cards de objetivo de /especialistas. O fundo
// creme circular é desenhado em GoalIllustration; cada scenes/<id>.tsx
// desenha uma situação no viewBox 0 0 80 80 (círculo r=36 em 40,40, que
// recorta a cena). Cada cena define:
// - css: classes prefixadas; estado parado (.gi .x) e marcado (.gi.on .x);
// - Scene: o SVG. Use u("nome") para ids e f("nome") para url(#id).
//
// Fidelidade: use as poses abaixo como estão (só posicione, escale,
// espelhe ou gire o mascote inteiro). Não redesenhe o personagem.

export const C = {
  green: "#03A71A",
  dark: "#0F3B2E",
  cream: "#EBEDC5",
  bg: "#F4F5DF",
  light: "#FAFBEF",
} as const;

export type SceneProps = {
  u: (name: string) => string;
  f: (name: string) => string;
};

export type SceneDef = {
  css: string;
  Scene: (props: SceneProps) => React.ReactNode;
};

type Box = readonly [number, number, number, number];

// Posiciona uma pose da arte: (x, y) = centro da base (pés) na cena, h = altura
// total na cena, flip espelha na horizontal, rotate gira (graus) em torno da base.
export type PlaceProps = { x: number; y: number; h: number; flip?: boolean; rotate?: number; className?: string };

function place(box: Box, { x, y, h, flip, rotate }: PlaceProps) {
  const [x0, y0, x1, y1] = box;
  const s = h / (y1 - y0);
  const cx = (x0 + x1) / 2;
  return `translate(${x} ${y})${rotate ? ` rotate(${rotate})` : ""} scale(${flip ? -s : s} ${s}) translate(${-cx} ${-y1})`;
}

// Centro dos olhos no espaço da arte (pose de pé / médico).
const EYES = [
  { x: 451.5, y: 366.5 },
  { x: 518.5, y: 366.5 },
];

export type Eyes = "open" | "closed" | "happy" | "none";

function StandEyes({ eyes }: { eyes: Eyes }) {
  if (eyes === "none") return null;
  if (eyes === "open")
    return (
      <>
        <path d={M.STAND_EYES} fill={C.cream} />
        <path d={M.STAND_PUPILS} fill={C.green} />
      </>
    );
  // fechados (arco para baixo) ou felizes (arco para cima), traço creme da arte da gota
  return (
    <>
      {EYES.map((e) => (
        <path
          key={e.x}
          d={eyes === "closed" ? `M${e.x - 21} ${e.y - 5}q21 17 42 0` : `M${e.x - 21} ${e.y + 7}q21 -17 42 0`}
          fill="none"
          stroke={C.cream}
          strokeWidth="9"
          strokeLinecap="round"
        />
      ))}
    </>
  );
}

// Mascote de pé, sem roupa (base da arte do médico, sem jaleco e óculos, com
// as pernas encurtadas).
export function Stand({ eyes = "open", ...p }: PlaceProps & { eyes?: Eyes }) {
  return (
    <g transform={place(M.BOX_SHORT, p)} className={p.className}>
      <path d={eyes === "open" ? M.STAND_BODY : M.STAND_SOLID} fill={C.green} />
      <StandEyes eyes={eyes} />
    </g>
  );
}

// Só cabeça + braços (pontas e barra) da arte, para poses com pernas próprias
// (meditando, correndo...). (x, y) = centro da BASE DA BARRA na cena; w = largura
// da barra. Proporções das pernas da arte, em função de w: perna ~0.18w de
// largura e ~0.46w de comprimento até o pé; pé ~0.35w × 0.16w, ponta
// arredondada para fora; verde chapado, sem contorno.
export function Head({ x, y, w, eyes = "open", flip, rotate, className }: { x: number; y: number; w: number; eyes?: Eyes; flip?: boolean; rotate?: number; className?: string }) {
  const [x0, , x1, y1] = M.BOX_HEAD;
  const s = w / (x1 - x0);
  const t = `translate(${x} ${y})${rotate ? ` rotate(${rotate})` : ""} scale(${flip ? -s : s} ${s}) translate(${-(x0 + x1) / 2} ${-y1})`;
  return (
    <g transform={t} className={className}>
      <path d={eyes === "open" ? M.HEAD_BODY : M.HEAD_SOLID} fill={C.green} />
      <StandEyes eyes={eyes} />
    </g>
  );
}

// Mascote médico, exatamente como na arte (óculos, jaleco, gravata, estetoscópio).
export function Doctor(p: PlaceProps) {
  return (
    <g transform={place(M.BOX_STAND, p)} className={p.className}>
      <path d={M.DOC_BODY} fill={C.green} />
      <path d={M.DOC_COAT} fill={C.cream} />
      <path d={M.DOC_EYES} fill={C.cream} />
      <path d={M.STAND_PUPILS} fill={C.green} />
      <path d={M.DOC_GLASSES} fill={C.dark} />
      <path d={M.DOC_TIE} fill={C.dark} />
    </g>
  );
}

// Só os óculos da arte, para pôr sobre o Stand (use os mesmos PlaceProps).
export function Glasses(p: PlaceProps) {
  return (
    <g transform={place(M.BOX_SHORT, p)} className={p.className}>
      <path d={M.DOC_EYES} fill={C.cream} />
      <path d={M.STAND_PUPILS} fill={C.green} />
      <path d={M.DOC_GLASSES} fill={C.dark} />
    </g>
  );
}

// Mascote "pulando" da arte da gota (pernas abertas, solas escuras, olhos felizes).
export function Jump(p: PlaceProps) {
  return (
    <g transform={place(M.BOX_JUMP, p)} className={p.className}>
      <path d={M.JUMP_BODY} fill={C.green} />
      <path d={M.JUMP_SOLES} fill={C.dark} />
      <path d={M.JUMP_EYES} fill={C.cream} />
    </g>
  );
}

// Gota da arte (cheia, sem o mascote) e o conta-gotas. Para reproduzir a arte
// inteira, use DropScene.
export function Drop({ fill = C.cream, ...p }: PlaceProps & { fill?: string }) {
  return <path d={M.DROP} fill={fill} transform={place(M.BOX_DROP, p)} className={p.className} />;
}

export function Dropper(p: PlaceProps) {
  return (
    <g transform={place(M.BOX_DROPPER, p)} className={p.className}>
      <path d={M.DROPPER} fill={C.green} />
      <path d={M.DROPPER_TIP} fill={C.cream} />
    </g>
  );
}

// Pose meditando (pernas cruzadas, mãos em mudra, olhos fechados), vetorizada
// da arte aprovada. (x, y) = centro da base; h = altura do corpo.
export function Meditate(p: PlaceProps) {
  return (
    <g transform={place(M.BOX_MED, p)} className={p.className}>
      <path d={M.MED_BODY} fill={C.green} />
      <path d={M.MED_DARK} fill={C.dark} />
      <path d={M.MED_EYES} fill={C.cream} />
    </g>
  );
}

// Poses vetorizadas das capturas de referência (scenes/mascot-extra.ts):
// RUN = correndo de faixa e meias, com poeira; TREE = meditando em pé numa
// perna só; OLD = velhinho de óculos e bengala. Desenhadas como estão.
export type PoseName = "RUN" | "TREE" | "OLD";

// cream: tom do creme (a poeira da corrida precisa de um creme mais escuro
// para aparecer sobre o fundo creme do card).
export function Pose({ name, cream = C.cream, ...p }: PlaceProps & { name: PoseName; cream?: string }) {
  return (
    <g transform={place(X[`BOX_${name}`], p)} className={p.className}>
      <path d={X[`${name}_GREEN`]} fill={C.green} />
      <path d={X[`${name}_CREAM`]} fill={cream} />
      <path d={X[`${name}_DARK`]} fill={C.dark} />
    </g>
  );
}

// A arte da gota completa (gota + mascote + conta-gotas), na posição original.
// (x, y) = centro da base da gota; h = altura da gota.
export function DropScene({ x, y, h, className }: PlaceProps) {
  const [x0, y0, x1, y1] = M.BOX_DROP;
  const s = h / (y1 - y0);
  return (
    <g transform={`translate(${x} ${y}) scale(${s}) translate(${-(x0 + x1) / 2} ${-y1})`} className={className}>
      <path d={M.DROP} fill={C.cream} />
      <path d={M.JUMP_BODY} fill={C.green} />
      <path d={M.JUMP_SOLES} fill={C.dark} />
      <path d={M.JUMP_EYES} fill={C.cream} />
      <path d={M.DROPPER} fill={C.green} />
      <path d={M.DROPPER_TIP} fill={C.cream} />
    </g>
  );
}

// Arredonda coordenadas calculadas (seno/cosseno): servidor e navegador podem
// divergir na última casa decimal e quebrar a hidratação.
export const r2 = (n: number) => Math.round(n * 100) / 100;
