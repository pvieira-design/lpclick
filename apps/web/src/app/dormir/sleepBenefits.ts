type Theme = {
  bg: string;
  fg: string;
  fgMuted: string;
  eyebrow: string;
  orb: string;
  isDark: boolean;
};

// Cada tema usa multi-camada: radial complementar (canto oposto ao orb) +
// radial análogo (mid-shadow) + base linear de 4-5 stops em ângulo variado.
// O orb no topo é a "fonte de luz" principal.
const T: Record<string, Theme> = {
  sage: {
    bg: `
      radial-gradient(ellipse 70% 55% at 0% 100%, rgba(248, 196, 178, 0.55) 0%, rgba(248, 196, 178, 0) 60%),
      radial-gradient(ellipse 60% 50% at 100% 0%, rgba(168, 222, 184, 0.65) 0%, rgba(168, 222, 184, 0) 55%),
      radial-gradient(ellipse 90% 70% at 30% 60%, rgba(196, 220, 200, 0.5) 0%, rgba(196, 220, 200, 0) 70%),
      linear-gradient(150deg, #e2eee2 0%, #cfe1d2 30%, #b6d2bd 60%, #a8c4b0 85%, #b8c8a8 100%)
    `,
    fg: "#1B2F22",
    fgMuted: "rgba(27, 47, 34, 0.72)",
    eyebrow: "#2D6E3F",
    orb: "radial-gradient(closest-side, rgba(140, 220, 165, 0.65), rgba(140, 220, 165, 0))",
    isDark: false,
  },
  twilight: {
    bg: `
      radial-gradient(ellipse 110% 80% at 95% -10%, rgba(178, 200, 240, 0.32) 0%, rgba(178, 200, 240, 0.14) 28%, rgba(178, 200, 240, 0.04) 55%, rgba(178, 200, 240, 0) 80%),
      radial-gradient(ellipse 95% 70% at 5% 105%, rgba(220, 150, 110, 0.16) 0%, rgba(220, 150, 110, 0.04) 45%, rgba(220, 150, 110, 0) 70%),
      radial-gradient(ellipse 130% 90% at 50% 130%, rgba(98, 120, 220, 0.22) 0%, rgba(98, 120, 220, 0) 70%),
      linear-gradient(160deg, #060a22 0%, #0f1640 25%, #181f54 50%, #222b6c 75%, #2c3680 100%)
    `,
    fg: "#F4F7FF",
    fgMuted: "rgba(244, 247, 255, 0.7)",
    eyebrow: "#A8BCFF",
    orb: "",
    isDark: true,
  },
  dusk: {
    bg: `
      radial-gradient(ellipse 110% 80% at 95% -10%, rgba(220, 165, 240, 0.4) 0%, rgba(220, 165, 240, 0.18) 28%, rgba(220, 165, 240, 0.05) 55%, rgba(220, 165, 240, 0) 80%),
      radial-gradient(ellipse 95% 70% at 5% 105%, rgba(248, 178, 130, 0.18) 0%, rgba(248, 178, 130, 0.05) 45%, rgba(248, 178, 130, 0) 70%),
      radial-gradient(ellipse 120% 85% at 30% 30%, rgba(85, 50, 150, 0.45) 0%, rgba(85, 50, 150, 0.1) 50%, rgba(85, 50, 150, 0) 75%),
      linear-gradient(155deg, #120726 0%, #20113e 25%, #321a60 50%, #44247a 75%, #563096 100%)
    `,
    fg: "#F8F3FF",
    fgMuted: "rgba(248, 243, 255, 0.7)",
    eyebrow: "#D2BCFF",
    orb: "",
    isDark: true,
  },
  lavender: {
    bg: `
      radial-gradient(ellipse 70% 55% at 0% 100%, rgba(252, 215, 200, 0.6) 0%, rgba(252, 215, 200, 0) 65%),
      radial-gradient(ellipse 55% 45% at 100% 0%, rgba(190, 158, 235, 0.55) 0%, rgba(190, 158, 235, 0) 60%),
      radial-gradient(ellipse 80% 60% at 50% 60%, rgba(178, 188, 230, 0.35) 0%, rgba(178, 188, 230, 0) 70%),
      linear-gradient(150deg, #efe6f8 0%, #ddd0ec 30%, #c8b4e2 60%, #b8a4d6 85%, #d4b8c8 100%)
    `,
    fg: "#26203A",
    fgMuted: "rgba(38, 32, 58, 0.72)",
    eyebrow: "#5B4694",
    orb: "radial-gradient(closest-side, rgba(255, 218, 200, 0.7), rgba(255, 218, 200, 0))",
    isDark: false,
  },
  cream: {
    bg: `
      radial-gradient(ellipse 70% 55% at 0% 100%, rgba(168, 200, 168, 0.5) 0%, rgba(168, 200, 168, 0) 60%),
      radial-gradient(ellipse 55% 45% at 100% 0%, rgba(240, 180, 120, 0.6) 0%, rgba(240, 180, 120, 0) 60%),
      radial-gradient(ellipse 85% 65% at 35% 50%, rgba(245, 220, 175, 0.55) 0%, rgba(245, 220, 175, 0) 70%),
      linear-gradient(155deg, #faf3dc 0%, #f4dfb6 30%, #eccc94 60%, #e2b876 85%, #d8a060 100%)
    `,
    fg: "#36280F",
    fgMuted: "rgba(54, 40, 15, 0.72)",
    eyebrow: "#8A6B33",
    orb: "radial-gradient(closest-side, rgba(255, 210, 145, 0.65), rgba(255, 210, 145, 0))",
    isDark: false,
  },
  dawn: {
    bg: `
      radial-gradient(ellipse 70% 55% at 0% 100%, rgba(244, 196, 200, 0.55) 0%, rgba(244, 196, 200, 0) 65%),
      radial-gradient(ellipse 55% 45% at 100% 0%, rgba(252, 222, 188, 0.7) 0%, rgba(252, 222, 188, 0) 60%),
      radial-gradient(ellipse 80% 60% at 50% 60%, rgba(190, 212, 232, 0.45) 0%, rgba(190, 212, 232, 0) 70%),
      linear-gradient(160deg, #e3edf6 0%, #d2e0ee 30%, #bcd0e4 60%, #c4c4d8 85%, #d6bcc8 100%)
    `,
    fg: "#1B2A3A",
    fgMuted: "rgba(27, 42, 58, 0.72)",
    eyebrow: "#3F6A99",
    orb: "radial-gradient(closest-side, rgba(255, 232, 200, 0.75), rgba(255, 232, 200, 0))",
    isDark: false,
  },
  mint: {
    bg: `
      radial-gradient(ellipse 70% 55% at 0% 100%, rgba(255, 218, 195, 0.55) 0%, rgba(255, 218, 195, 0) 60%),
      radial-gradient(ellipse 60% 50% at 100% 0%, rgba(168, 232, 220, 0.65) 0%, rgba(168, 232, 220, 0) 55%),
      radial-gradient(ellipse 90% 70% at 30% 60%, rgba(196, 230, 218, 0.5) 0%, rgba(196, 230, 218, 0) 70%),
      linear-gradient(150deg, #e3f4ec 0%, #cee6dc 30%, #b4d7c8 60%, #a4c5b9 85%, #b4cabd 100%)
    `,
    fg: "#1B2F2A",
    fgMuted: "rgba(27, 47, 42, 0.72)",
    eyebrow: "#2C7361",
    orb: "radial-gradient(closest-side, rgba(150, 220, 200, 0.65), rgba(150, 220, 200, 0))",
    isDark: false,
  },
  coral: {
    bg: `
      radial-gradient(ellipse 70% 55% at 0% 100%, rgba(255, 198, 218, 0.55) 0%, rgba(255, 198, 218, 0) 65%),
      radial-gradient(ellipse 55% 45% at 100% 0%, rgba(255, 178, 130, 0.7) 0%, rgba(255, 178, 130, 0) 60%),
      radial-gradient(ellipse 80% 60% at 50% 60%, rgba(252, 220, 195, 0.5) 0%, rgba(252, 220, 195, 0) 70%),
      linear-gradient(160deg, #fde7dd 0%, #fad1bd 30%, #f4b696 60%, #ec9c7c 85%, #d97f64 100%)
    `,
    fg: "#3a1b14",
    fgMuted: "rgba(58, 27, 20, 0.72)",
    eyebrow: "#a04428",
    orb: "radial-gradient(closest-side, rgba(255, 215, 175, 0.75), rgba(255, 215, 175, 0))",
    isDark: false,
  },
};

export type Benefit = {
  id: string;
  badge: string;
  title: string;
  body: string;
  theme: Theme;
};

export const BENEFITS: Benefit[] = [
  {
    id: "sono-reparador",
    badge: "Sono profundo · REM",
    title: "Sono mais reparador, não apenas mais longo",
    body: "A maioria dos remédios para dormir induz um sono “pesado” e artificial. Os canabinoides atuam regulando as fases naturais do sono, especialmente o sono profundo e o REM, que são as fases responsáveis pela recuperação física e mental.",
    theme: T.twilight,
  },
  {
    id: "adormecer",
    badge: "CBD · Serotonina",
    title: "Adormecer com mais facilidade",
    body: "A dificuldade para pegar no sono quase sempre vem da “mente acelerada”: pensamentos invasivos, preocupações, sensação de alerta. O CBD interage com receptores de serotonina (5-HT1A) e ajuda a reduzir o cortisol, hormônio do estresse que está alto em quem tem insônia.",
    theme: T.sage,
  },
  {
    id: "menos-despertares",
    badge: "Continuidade · Cortisol",
    title: "Menos despertares durante a noite",
    body: "Acordar 2h, 4h da manhã e não conseguir voltar a dormir é um dos sintomas mais frustrantes da insônia, geralmente ligado à desregulação do ciclo do sono e picos de cortisol. Os canabinoides ajudam o corpo a manter a continuidade do sono ao estabilizar o sistema endocanabinoide.",
    theme: T.dusk,
  },
  {
    id: "ciclo",
    badge: "Ritmo circadiano",
    title: "Regulação do ciclo do sono, não é sedação",
    body: "Remédios como zolpidem te “desligam” à força, mas não tratam a causa da insônia: quando você para, ela volta pior. O CBD atua no sistema endocanabinoide, regulador natural do seu ritmo circadiano. Em vez de forçar o sono, ajuda seu corpo a relembrar como dormir naturalmente.",
    theme: T.cream,
  },
  {
    id: "alternativa",
    badge: "Sem tolerância",
    title: "Alternativa a remédios para dormir tradicionais",
    body: "Zolpidem, trazodona, benzodiazepínicos e até melatonina em altas doses têm limitações sérias: tolerância (você precisa de doses cada vez maiores), dependência, efeitos colaterais cognitivos e, em muitos casos, perda de eficácia depois de meses.",
    theme: T.lavender,
  },
  {
    id: "sem-dependencia",
    badge: "Diferencial clínico",
    title: "Sem dependência química conhecida",
    body: "Benzodiazepínicos como clonazepam e diazepam criam dependência física em poucas semanas. Parar de tomar significa síndrome de abstinência (insônia rebote, ansiedade, tremores). Os canabinoides usados no tratamento, principalmente o CBD, não estão associados a esse tipo de dependência química.",
    theme: T.dawn,
  },
  {
    id: "complementar",
    badge: "Transição gradual",
    title: "Pode complementar o tratamento atual",
    body: "Você não precisa parar tudo do dia para a noite. O médico pode iniciar a cannabis medicinal junto com seu tratamento atual e, conforme você responde, ir ajustando e reduzindo gradualmente a dose do remédio convencional à medida que os canabinoides assumem o trabalho.",
    theme: T.mint,
  },
  {
    id: "ansiedade-sono",
    badge: "Ansiedade + sono",
    title: "Trata ansiedade e sono ao mesmo tempo",
    body: "Mais de 80% dos nossos pacientes têm ansiedade. O ciclo é cruel: você não dorme porque está ansioso, e fica mais ansioso porque não dormiu. Remédios para insônia tratam só o sono. Ansiolíticos tratam só a ansiedade. O CBD age nos dois ao mesmo tempo. É por isso que os pacientes sentem melhora “em camadas”.",
    theme: T.coral,
  },
];
