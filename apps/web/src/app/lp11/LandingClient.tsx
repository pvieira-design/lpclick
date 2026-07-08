"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
  type Variants,
} from "framer-motion";
import { sendGTMEvent } from "@next/third-parties/google";
import { sendLeadToCrm } from "@/lib/crmLead";
import TestimonialsSlider, { type VideoTestimonial } from "./TestimonialsSlider";

const PATOLOGIAS = [
  "Ansiedade",
  "Insônia",
  "Dores",
  "TDAH",
  "Perda de Peso",
  "Obesidade",
  "Alcoolismo",
  "Depressão",
  "Epilepsia",
  "Tabagismo",
  "Autismo",
  "Enxaqueca",
  "Fibromialgia",
  "Parkinson",
] as const;

const PHONE = "5521993686082";
const EASE: [number, number, number, number] = [0.23, 1, 0.32, 1];
const BTN_SPRING = { type: "spring", stiffness: 420, damping: 26 } as const;

function buildWhatsAppUrl(name: string, patologias: string[]) {
  const list = patologias.map((p, i) => `${i + 1}. ${p}`).join("\n");
  const text = `Olá, me chamo ${name}.\n\nPatologias selecionadas:\n${list}`;
  return `https://api.whatsapp.com/send/?phone=${PHONE}&text=${encodeURIComponent(
    text,
  )}&type=phone_number&app_absent=0`;
}

/* ————————————————————————————————————————————————————————————————
   A página é um filme em atos, dirigido pelo scroll:
   1 COVER      vídeo do óleo pinado, título gigante, zoom sutil
   2 MANIFESTO  linhas tipográficas que acendem uma a uma
   3 MOLÉCULA   vídeo da molécula pinado, legendas que trocam
   4 NÚMEROS    um número gigante por tela, com count-up
   5 JORNADA    4 cartas full-screen que se empilham
   6 VOZES      depoimentos reais
   7 DÚVIDAS    faq compacto
   8 COMEÇO     conversão em tela verde-noite
   Com prefers-reduced-motion ou save-data, os atos viram seções
   estáticas empilhadas (classe .flat).
———————————————————————————————————————————————————————————————— */

const CSS = `
  .lp11{
    --green-900:#13241b;--green-800:#193024;--green-700:#1f4533;--green-600:#2a6043;
    --cream:#f5efe3;--cream-2:#efe6d2;--card:#fffdf8;
    --gold:#c08a3e;--gold-2:#d9a55b;--gold-soft:#e3c489;--gold-deep:#8f6224;
    --ink:#17241d;--muted:#5d6b61;--line:rgba(23,36,29,.12);
    --shadow-lg:0 40px 90px -40px rgba(19,36,27,.55);
    box-sizing:border-box;position:relative;min-height:100vh;
    font-family:var(--font-lexend),sans-serif;color:var(--ink);background:var(--cream);
    line-height:1.6;-webkit-font-smoothing:antialiased;overflow-x:hidden;
  }
  .lp11 *{box-sizing:border-box;margin:0;padding:0}
  .lp11::before{
    content:"";position:fixed;inset:0;pointer-events:none;z-index:9998;opacity:.04;
    background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  }
  .lp11 h1,.lp11 h2,.lp11 h3{font-family:var(--font-fraunces),serif;font-weight:300;line-height:1.02;letter-spacing:-.02em}
  .lp11 a{color:inherit;text-decoration:none}
  .lp11 em{font-style:italic;color:var(--gold-deep)}
  .lp11 .serif{font-family:var(--font-fraunces),serif}

  /* marca fixa, mínima */
  .lp11 .brand{position:fixed;top:calc(14px + env(safe-area-inset-top));left:18px;z-index:96;
    display:flex;align-items:baseline;gap:.35rem;font-family:var(--font-fraunces);
    font-size:1.15rem;font-weight:600;letter-spacing:-.02em;mix-blend-mode:multiply}
  .lp11 .brand b{color:var(--green-700)}
  .lp11 .brand i{font-style:normal;font-size:.56rem;letter-spacing:.24em;text-transform:uppercase;
    color:var(--gold-deep);font-family:var(--font-lexend);font-weight:600;transform:translateY(-2px)}

  /* CTA pílula flutuante */
  .lp11 .pill-cta{position:fixed;left:0;right:0;bottom:calc(16px + env(safe-area-inset-bottom));z-index:95;
    display:flex;justify-content:center;pointer-events:none;opacity:0;transform:translateY(18px);
    transition:opacity .35s ease,transform .4s cubic-bezier(.2,.8,.2,1)}
  .lp11 .pill-cta.show{opacity:1;transform:none}
  .lp11 .pill-cta a{pointer-events:auto;display:inline-flex;align-items:center;gap:.5rem;
    font-weight:600;font-size:.95rem;padding:.9rem 1.9rem;border-radius:100px;color:#fdfcf6;
    background:linear-gradient(180deg,var(--green-600),var(--green-700));
    box-shadow:0 20px 44px -12px rgba(19,36,27,.6),inset 0 1px 0 rgba(255,255,255,.18)}
  @keyframes lp11pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.03)}}
  @media(hover:none){.lp11 .pill-cta a{animation:lp11pulse 2.6s ease-in-out infinite}
    .lp11 .pill-cta a:active{animation:none;transform:scale(.96)}}

  /* palco pinado padrão */
  .lp11 .act{position:relative}
  .lp11 .stage{position:sticky;top:0;height:100svh;overflow:hidden;
    display:flex;align-items:center;justify-content:center}
  .lp11 .flat .act{height:auto!important}
  .lp11 .flat .act .stage{position:relative;height:auto;min-height:0;padding:72px 0;
    flex-direction:column;gap:2.2rem}
  .lp11 .flat .cover .stage{height:88svh;min-height:560px;padding:0}

  /* ato 1 — cover */
  .lp11 .cover{height:230vh}
  .lp11 .cover .media{position:absolute;inset:0}
  .lp11 .cover video,.lp11 .cover .poster{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
  .lp11 .cover .veil{position:absolute;inset:0;background:
    linear-gradient(180deg,rgba(245,239,227,.16),rgba(245,239,227,0) 30%,rgba(245,239,227,0) 55%,rgba(245,239,227,.72) 88%,var(--cream))}
  .lp11 .cover .exit-veil{position:absolute;inset:0;background:var(--cream)}
  .lp11 .cover-copy{position:absolute;left:0;right:0;bottom:12svh;z-index:3;text-align:center;padding:0 22px}
  .lp11 .cover-kicker{font-size:.68rem;letter-spacing:.3em;text-transform:uppercase;font-weight:600;
    color:var(--gold-deep);margin-bottom:1.1rem}
  .lp11 .cover h1{font-size:clamp(2.9rem,10.5vw,6.4rem);color:var(--ink);text-wrap:balance}
  .lp11 .cover h1 .w{display:inline-block;white-space:pre}
  .lp11 .cover-sub{margin-top:1.15rem;font-size:.98rem;color:var(--ink);opacity:.72}
  .lp11 .scroll-cue{position:absolute;left:50%;bottom:3svh;transform:translateX(-50%);z-index:3;
    display:flex;flex-direction:column;align-items:center;gap:.45rem;
    font-size:.6rem;letter-spacing:.3em;text-transform:uppercase;color:var(--muted)}
  .lp11 .scroll-cue .tick{width:1px;height:38px;background:linear-gradient(180deg,var(--gold),transparent);
    animation:lp11drip 2.2s ease-in-out infinite}
  @keyframes lp11drip{0%{transform:scaleY(0);transform-origin:top}55%{transform:scaleY(1);transform-origin:top}
    56%{transform-origin:bottom}100%{transform:scaleY(0);transform-origin:bottom}}

  /* ato 2 — manifesto */
  .lp11 .manifesto{height:420vh;background:var(--cream)}
  .lp11 .manifesto .stage{background:
    radial-gradient(90% 60% at 78% 18%,rgba(227,196,137,.35),transparent 60%),
    radial-gradient(80% 55% at 18% 85%,rgba(192,138,62,.22),transparent 60%),var(--cream)}
  .lp11 .mline{position:absolute;left:0;right:0;padding:0 26px;text-align:center}
  .lp11 .mline p{font-family:var(--font-fraunces),serif;font-weight:300;
    font-size:clamp(1.85rem,6.4vw,3.6rem);line-height:1.14;letter-spacing:-.015em;
    max-width:17ch;margin:0 auto;text-wrap:balance}
  .lp11 .m-index{position:absolute;top:calc(20px + env(safe-area-inset-top));right:22px;
    font-size:.66rem;letter-spacing:.26em;color:var(--muted);text-transform:uppercase}
  .lp11 .flat .mline{position:relative;margin:2.4rem 0}

  /* ato 3 — molécula */
  .lp11 .mol{height:320vh;background:var(--cream)}
  .lp11 .mol .frame{position:absolute;inset:0;display:flex;align-items:center;justify-content:center}
  .lp11 .mol .portal{position:relative;width:100%;height:100%;overflow:hidden}
  @media(min-width:880px){
    .lp11 .mol .portal{width:min(46vw,560px);height:min(74vh,700px);border-radius:32px;box-shadow:var(--shadow-lg)}
  }
  .lp11 .mol video,.lp11 .mol img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
  .lp11 .mol .portal::after{content:"";position:absolute;inset:0;
    background:linear-gradient(180deg,rgba(245,239,227,.3),transparent 30%,transparent 62%,rgba(23,36,29,.28))}
  .lp11 .mol-kicker{position:absolute;top:calc(20px + env(safe-area-inset-top));left:0;right:0;
    text-align:center;font-size:.68rem;letter-spacing:.3em;text-transform:uppercase;font-weight:600;
    color:var(--gold-deep);z-index:4}
  .lp11 .mol-cap{position:absolute;left:0;right:0;bottom:9svh;z-index:4;text-align:center;padding:0 26px}
  .lp11 .mol-cap .big{font-family:var(--font-fraunces),serif;font-weight:300;
    font-size:clamp(1.6rem,5.6vw,2.9rem);line-height:1.12;color:#fdfcf6;
    text-shadow:0 2px 24px rgba(19,36,27,.45);max-width:20ch;margin:0 auto;text-wrap:balance}
  .lp11 .mol-cap .big em{color:var(--gold-soft)}
  .lp11 .flat .mol-cap{position:relative;bottom:auto;margin-top:1.4rem}
  .lp11 .flat .mol-cap .big{color:var(--ink);text-shadow:none}
  .lp11 .flat .mol .portal{height:70vh}

  /* ato 4 — números */
  .lp11 .nums{height:380vh}
  .lp11 .nums .bg{position:absolute;inset:0}
  .lp11 .nums .bg img{width:100%;height:100%;object-fit:cover}
  .lp11 .nums .bg::after{content:"";position:absolute;inset:0;background:
    linear-gradient(180deg,rgba(245,239,227,.88),rgba(245,239,227,.55) 40%,rgba(245,239,227,.82))}
  .lp11 .nums-kicker{position:absolute;top:calc(20px + env(safe-area-inset-top));left:0;right:0;text-align:center;
    font-size:.68rem;letter-spacing:.3em;text-transform:uppercase;font-weight:600;color:var(--gold-deep);z-index:4}
  .lp11 .num-slide{position:absolute;left:0;right:0;text-align:center;padding:0 26px}
  .lp11 .num-slide .value{font-family:var(--font-fraunces),serif;font-weight:300;
    font-size:clamp(4.6rem,20vw,10rem);line-height:1;color:var(--ink);letter-spacing:-.03em}
  .lp11 .num-slide .value sup{font-size:.32em;color:var(--gold-deep);vertical-align:super}
  .lp11 .num-slide .label{margin-top:.7rem;font-size:1rem;color:var(--muted);max-width:26ch;margin-left:auto;margin-right:auto}
  .lp11 .num-slide .rule{width:52px;height:1.5px;background:var(--gold-deep);margin:1.1rem auto 0}
  .lp11 .flat .num-slide{position:relative;margin:2.6rem 0}

  /* ato 5 — jornada (cartas empilhadas) */
  .lp11 .journey{height:440vh;background:var(--green-900)}
  .lp11 .journey .stage{align-items:flex-end;justify-content:center}
  .lp11 .j-kicker{position:absolute;top:calc(20px + env(safe-area-inset-top));left:0;right:0;text-align:center;z-index:1;
    font-size:.68rem;letter-spacing:.3em;text-transform:uppercase;font-weight:600;color:var(--gold-soft)}
  .lp11 .j-card{position:absolute;left:12px;right:12px;bottom:12px;top:calc(64px + env(safe-area-inset-top));
    border-radius:26px;padding:clamp(1.6rem,5vw,3rem);overflow:hidden;
    display:flex;flex-direction:column;justify-content:flex-end;box-shadow:0 -20px 60px -30px rgba(0,0,0,.5)}
  @media(min-width:880px){.lp11 .j-card{left:50%;right:auto;width:min(680px,92vw);transform:translateX(-50%)}}
  .lp11 .j-card .ghost{position:absolute;top:-.12em;right:.05em;font-family:var(--font-fraunces),serif;
    font-weight:300;font-size:clamp(7rem,32vw,15rem);line-height:1;opacity:.1;letter-spacing:-.04em}
  .lp11 .j-card h3{font-size:clamp(1.9rem,7vw,3rem);font-weight:300;margin-bottom:.55rem}
  .lp11 .j-card p{font-size:1rem;max-width:36ch;opacity:.82}
  .lp11 .j-card .tag{display:inline-block;width:fit-content;margin-top:1.1rem;font-size:.76rem;font-weight:600;
    padding:.32rem .85rem;border-radius:100px;letter-spacing:.04em}
  .lp11 .j-card.t-cream{background:var(--card);color:var(--ink)}
  .lp11 .j-card.t-cream .tag{background:rgba(192,138,62,.16);color:var(--gold-deep);border:1px solid rgba(192,138,62,.3)}
  .lp11 .j-card.t-green{background:linear-gradient(170deg,var(--green-700),var(--green-800));color:#f1ecde}
  .lp11 .j-card.t-green .tag{background:rgba(227,196,137,.16);color:var(--gold-soft);border:1px solid rgba(227,196,137,.3)}
  .lp11 .j-card.t-gold{background:linear-gradient(165deg,#e8cf9d,var(--gold-2));color:#3d2c12}
  .lp11 .j-card.t-gold .tag{background:rgba(61,44,18,.12);color:#3d2c12;border:1px solid rgba(61,44,18,.22)}
  .lp11 .flat .j-card{position:relative;top:auto;left:auto;right:auto;bottom:auto;transform:none!important;
    margin:14px 12px;min-height:52vh}

  /* ato 6 — vozes */
  .lp11 .voices{background:var(--cream);padding:96px 0 10px}
  .lp11 .voices .head{text-align:center;padding:0 26px;margin-bottom:.6rem}
  .lp11 .voices .head .kicker{font-size:.68rem;letter-spacing:.3em;text-transform:uppercase;font-weight:600;color:var(--gold-deep)}
  .lp11 .voices .head h2{font-size:clamp(2.1rem,7vw,3.6rem);margin-top:.8rem;text-wrap:balance}

  /* ato 7 — dúvidas */
  .lp11 .faq-act{background:var(--cream);padding:70px 0 96px}
  .lp11 .faq-wrap{max-width:720px;margin:0 auto;padding:0 22px}
  .lp11 .faq-act .kicker{display:block;text-align:center;font-size:.68rem;letter-spacing:.3em;
    text-transform:uppercase;font-weight:600;color:var(--gold-deep);margin-bottom:2rem}
  .lp11 .faq{border-bottom:1px solid var(--line)}
  .lp11 .faq summary{list-style:none;cursor:pointer;padding:1.25rem .2rem;display:flex;
    justify-content:space-between;align-items:center;gap:1rem;
    font-family:var(--font-fraunces);font-size:1.12rem;font-weight:400}
  .lp11 .faq summary::-webkit-details-marker{display:none}
  .lp11 .faq summary .plus{flex-shrink:0;width:28px;height:28px;border-radius:50%;border:1.5px solid var(--line);
    display:flex;align-items:center;justify-content:center;transition:transform .3s,background .3s;
    font-size:1.1rem;color:var(--gold-deep)}
  .lp11 .faq[open] summary .plus{transform:rotate(45deg);background:var(--gold);color:#fff;border-color:var(--gold)}
  .lp11 .faq .ans{padding:0 .2rem 1.3rem;color:var(--muted);font-size:.95rem;max-width:60ch}

  /* ato 8 — começo (conversão) */
  .lp11 .begin{position:relative;background:linear-gradient(170deg,var(--green-800),var(--green-900));
    color:#f1ecde;padding:90px 0 40px;overflow:hidden;min-height:100svh;
    display:flex;flex-direction:column;justify-content:center}
  .lp11 .begin .glow{position:absolute;border-radius:50%;filter:blur(80px);width:560px;height:560px;
    background:radial-gradient(circle,rgba(192,138,62,.32),transparent 62%);top:-200px;right:-140px;pointer-events:none}
  .lp11 .begin-in{position:relative;z-index:2;max-width:560px;margin:0 auto;padding:0 20px;width:100%}
  .lp11 .begin h2{font-size:clamp(2.6rem,10vw,4.6rem);color:#fbf7ec;text-align:center;margin-bottom:.5rem}
  .lp11 .begin h2 em{color:var(--gold-soft)}
  .lp11 .begin .lead-in{text-align:center;color:#b9c4b8;font-size:1rem;margin-bottom:2rem}
  .lp11 .begin .lead-in b{color:var(--gold-soft);font-weight:600}

  .lp11 .form-box{width:100%;background:var(--card);border-radius:24px;padding:2rem;box-shadow:var(--shadow-lg);color:var(--ink)}
  .lp11 .form-progress{font-size:.7rem;letter-spacing:.16em;text-transform:uppercase;font-weight:600;color:var(--muted);margin-bottom:.5rem}
  .lp11 .form-box h3{font-size:1.45rem;font-weight:400;margin-bottom:.35rem}
  .lp11 .form-box .fp{font-size:.9rem;color:var(--muted);margin-bottom:1.3rem}
  .lp11 .field{margin-bottom:1rem}
  .lp11 .field label{display:block;font-size:.8rem;font-weight:600;margin-bottom:.4rem}
  .lp11 .field input{width:100%;padding:.9rem 1rem;border:1.5px solid var(--line);border-radius:12px;
    font-family:var(--font-lexend);font-size:1rem;background:var(--cream);transition:border .2s,box-shadow .2s}
  .lp11 .field input:focus{outline:none;border-color:var(--gold);box-shadow:0 0 0 4px rgba(192,138,62,.14);background:#fff}
  .lp11 .chips{display:flex;flex-wrap:wrap;gap:.45rem}
  .lp11 .chip{font-family:var(--font-lexend);font-size:.84rem;font-weight:500;padding:.48rem .85rem;
    border-radius:100px;border:1.5px solid var(--line);background:var(--cream);color:var(--muted);
    cursor:pointer;transition:background .2s,color .2s,border-color .2s}
  .lp11 .chip:hover{border-color:var(--gold);color:var(--gold-deep)}
  .lp11 .chip.on{background:linear-gradient(180deg,var(--green-600),var(--green-700));border-color:var(--green-700);color:#fdfcf6}
  .lp11 .field-err{color:#c0392b;font-size:.82rem;margin:.2rem 0 .6rem}
  .lp11 .sel-summary{display:flex;flex-wrap:wrap;justify-content:center;gap:.4rem;margin-top:1rem}
  .lp11 .sel-summary span{font-size:.76rem;font-weight:500;color:var(--green-700);background:#e8f0e8;padding:.26rem .7rem;border-radius:100px}
  .lp11 .form-back{display:block;width:100%;background:none;border:none;cursor:pointer;
    font-family:var(--font-lexend);font-size:.84rem;color:var(--muted);margin-top:.7rem;text-align:center}
  .lp11 .btn{display:inline-flex;align-items:center;justify-content:center;gap:.55rem;width:100%;
    font-family:var(--font-lexend);font-weight:600;font-size:1.02rem;padding:1.02rem 2rem;margin-top:.4rem;
    border-radius:100px;border:none;cursor:pointer;color:#fdfcf6;
    background:linear-gradient(180deg,var(--green-600),var(--green-700));
    box-shadow:0 14px 30px -12px rgba(31,69,51,.7),inset 0 1px 0 rgba(255,255,255,.18);transition:box-shadow .25s}
  .lp11 .form-box .secure{display:flex;align-items:center;gap:.5rem;justify-content:center;font-size:.74rem;color:var(--muted);margin-top:1rem}
  .lp11 .begin .disclaim{position:relative;z-index:2;font-size:.72rem;color:#6f7e70;line-height:1.6;
    max-width:64ch;margin:56px auto 0;text-align:center;padding:0 22px}

  @media(prefers-reduced-motion:reduce){
    .lp11 *{animation:none!important;transition:none!important}
  }
`;

/* ——— linhas do manifesto ——— */
const MANIFESTO: React.ReactNode[] = [
  <>Ansiedade, insônia, dor — talvez você já tenha tentado de tudo.</>,
  <>
    Mas o seu corpo tem um <em>sistema próprio</em> de equilíbrio.
  </>,
  <>
    O canabidiol conversa com ele. <em>Naturalmente.</em>
  </>,
  <>
    E hoje isso é um tratamento <em>legal</em> no Brasil.
  </>,
];

const MOL_CAPTIONS: React.ReactNode[] = [
  <>
    CBD · <em>Canabidiol</em> — a molécula da planta.
  </>,
  <>
    Age no seu <em>sistema endocanabinoide</em>: sono, dor e humor.
  </>,
  <>
    Prescrito por médicos. <em>Regulamentado pela ANVISA.</em>
  </>,
];

const NUMBERS = [
  { target: 50, prefix: "+", suffix: " mil", decimals: 0, label: "pacientes acompanhados em todo o Brasil" },
  { target: 4.9, prefix: "", suffix: "", sup: "★", decimals: 1, label: "de avaliação média entre os pacientes" },
  { target: 24, prefix: "", suffix: "h", decimals: 0, label: "médicos de plantão, consulta 100% online" },
];

const JOURNEY = [
  { n: "01", t: "Consulta médica", d: "100% online, com médicos de plantão 24h. Sem sair de casa, sem fila, sem julgamento.", tag: "Apenas R$50", theme: "t-cream" },
  { n: "02", t: "Receita médica", d: "Sendo apto, o médico emite na hora a receita que autoriza a sua importação.", tag: "No mesmo dia", theme: "t-green" },
  { n: "03", t: "Autorização ANVISA", d: "A gente cuida de toda a documentação e burocracia da importação com você.", tag: "Sem dor de cabeça", theme: "t-gold" },
  { n: "04", t: "Chega na sua porta", d: "Importação direta dos EUA com isenção de impostos e acompanhamento completo.", tag: "Até 15 dias úteis", theme: "t-cream" },
];

/* ——— sub-componentes com transforms próprios ——— */

function ManifestoLine({
  progress,
  index,
  total,
  children,
  flat,
}: {
  progress: MotionValue<number>;
  index: number;
  total: number;
  children: React.ReactNode;
  flat: boolean;
}) {
  const seg = 1 / total;
  const s = index * seg;
  const e = s + seg;
  const isLast = index === total - 1;
  const opacity = useTransform(
    progress,
    isLast ? [s, s + seg * 0.28, 1] : [s, s + seg * 0.28, e - seg * 0.22, e],
    isLast ? [0, 1, 1] : [0, 1, 1, 0],
  );
  const y = useTransform(progress, [s, s + seg * 0.28], [34, 0]);
  return (
    <motion.div className="mline" style={flat ? undefined : { opacity, y }}>
      <p>{children}</p>
    </motion.div>
  );
}

function CountUp({
  active,
  target,
  decimals,
  prefix,
  suffix,
}: {
  active: boolean;
  target: number;
  decimals: number;
  prefix: string;
  suffix: string;
}) {
  const mv = useMotionValue(0);
  const [text, setText] = useState(`${prefix}0${suffix}`);
  useEffect(() => {
    if (!active) return;
    const controls = animate(mv, target, {
      duration: 1.4,
      ease: EASE,
      onUpdate: (v) =>
        setText(
          `${prefix}${v.toLocaleString("pt-BR", {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
          })}${suffix}`,
        ),
    });
    return () => controls.stop();
  }, [active, target, decimals, prefix, suffix, mv]);
  return <>{text}</>;
}

function NumberSlide({
  progress,
  index,
  total,
  item,
  flat,
}: {
  progress: MotionValue<number>;
  index: number;
  total: number;
  item: (typeof NUMBERS)[number];
  flat: boolean;
}) {
  const seg = 1 / total;
  const s = index * seg;
  const e = s + seg;
  const isLast = index === total - 1;
  const opacity = useTransform(
    progress,
    isLast ? [s, s + seg * 0.3, 1] : [s, s + seg * 0.3, e - seg * 0.2, e],
    isLast ? [0, 1, 1] : [0, 1, 1, 0],
  );
  const y = useTransform(progress, [s, s + seg * 0.3], [40, 0]);
  const [active, setActive] = useState(flat);
  useEffect(() => {
    if (flat) return;
    const unsub = progress.on("change", (v) => {
      if (v >= s && v < e + seg * 0.2) setActive(true);
    });
    return unsub;
  }, [progress, s, e, seg, flat]);
  return (
    <motion.div className="num-slide" style={flat ? undefined : { opacity, y }}>
      <div className="value">
        <CountUp
          active={active}
          target={item.target}
          decimals={item.decimals}
          prefix={item.prefix}
          suffix={item.suffix}
        />
        {item.sup ? <sup>{item.sup}</sup> : null}
      </div>
      <div className="rule" />
      <p className="label">{item.label}</p>
    </motion.div>
  );
}

function JourneyCard({
  progress,
  index,
  total,
  item,
  flat,
}: {
  progress: MotionValue<number>;
  index: number;
  total: number;
  item: (typeof JOURNEY)[number];
  flat: boolean;
}) {
  const seg = 1 / total;
  const s = index * seg;
  const y = useTransform(
    progress,
    [s, s + seg * 0.72],
    [index === 0 ? "0%" : "112%", "0%"],
  );
  return (
    <motion.div
      className={`j-card ${item.theme}`}
      style={flat ? undefined : { y }}
    >
      <span className="ghost serif">{item.n}</span>
      <h3>{item.t}</h3>
      <p>{item.d}</p>
      <span className="tag">{item.tag}</span>
    </motion.div>
  );
}

/* ——— página ——— */

export default function LandingClient({
  testimonials,
}: {
  testimonials: VideoTestimonial[];
}) {
  const [name, setName] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [step, setStep] = useState<1 | 2>(1);
  const [nameError, setNameError] = useState(false);
  const [patologiaError, setPatologiaError] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [saveData, setSaveData] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);

  const coverRef = useRef<HTMLDivElement>(null);
  const manifestoRef = useRef<HTMLDivElement>(null);
  const molRef = useRef<HTMLDivElement>(null);
  const molVideoRef = useRef<HTMLVideoElement>(null);
  const numsRef = useRef<HTMLDivElement>(null);
  const journeyRef = useRef<HTMLDivElement>(null);

  const reduceMotion = useReducedMotion();
  const flat = saveData || !!reduceMotion;

  useEffect(() => {
    const conn = (
      navigator as Navigator & { connection?: { saveData?: boolean } }
    ).connection;
    if (conn?.saveData) setSaveData(true);
  }, []);

  /* ato 1 — cover: zoom sutil + saída do título + véu de transição */
  const { scrollYProgress: coverP } = useScroll({
    target: coverRef,
    offset: ["start start", "end start"],
  });
  const coverScale = useTransform(coverP, [0, 1], [1, 1.14]);
  const titleOpacity = useTransform(coverP, [0, 0.32, 0.55], [1, 1, 0]);
  const titleY = useTransform(coverP, [0.2, 0.55], [0, -70]);
  const exitVeil = useTransform(coverP, [0.62, 0.95], [0, 1]);
  const cueOpacity = useTransform(coverP, [0, 0.12], [1, 0]);

  /* ato 2 — manifesto */
  const { scrollYProgress: maniP } = useScroll({
    target: manifestoRef,
    offset: ["start start", "end end"],
  });

  /* ato 3 — molécula */
  const { scrollYProgress: molP } = useScroll({
    target: molRef,
    offset: ["start start", "end end"],
  });
  const molScale = useTransform(molP, [0, 0.18], [0.94, 1]);
  const molIn = useTransform(molP, [0, 0.1], [0.4, 1]);

  /* ato 4 — números: pan lento no fundo */
  const { scrollYProgress: numsP } = useScroll({
    target: numsRef,
    offset: ["start start", "end end"],
  });
  const numsBgScale = useTransform(numsP, [0, 1], [1.18, 1.02]);
  const numsBgY = useTransform(numsP, [0, 1], ["-3%", "3%"]);

  /* ato 5 — jornada */
  const { scrollYProgress: jouP } = useScroll({
    target: journeyRef,
    offset: ["start start", "end end"],
  });

  /* vídeo da molécula: carrega só quando o ato se aproxima */
  useEffect(() => {
    if (flat) return;
    const vid = molVideoRef.current;
    const wrap = molRef.current;
    if (!vid || !wrap) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          if (!vid.src) {
            vid.src = "/lp11/molecule-loop.mp4";
            vid.load();
          }
          vid.play().catch(() => {});
          io.disconnect();
        }
      },
      { rootMargin: "600px" },
    );
    io.observe(wrap);
    return () => io.disconnect();
  }, [flat]);

  /* CTA pílula: aparece após o cover, some no ato final */
  useEffect(() => {
    const bar = pillRef.current;
    if (!bar) return;
    const cover = document.querySelector(".lp11 .cover");
    const final = document.querySelector(".lp11 .begin");
    let coverVisible = true;
    let formVisible = false;
    const update = () =>
      bar.classList.toggle("show", !coverVisible && !formVisible);
    const observers: IntersectionObserver[] = [];
    if (cover) {
      const io = new IntersectionObserver(([e]) => {
        coverVisible = e.isIntersecting;
        update();
      });
      io.observe(cover);
      observers.push(io);
    }
    if (final) {
      const io = new IntersectionObserver(
        ([e]) => {
          formVisible = e.isIntersecting;
          update();
        },
        { threshold: 0.12 },
      );
      io.observe(final);
      observers.push(io);
    }
    update();
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const toggle = useCallback((patologia: string) => {
    setPatologiaError(false);
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(patologia)) next.delete(patologia);
      else next.add(patologia);
      return next;
    });
  }, []);

  const goToStep2 = useCallback(() => {
    if (selected.size === 0) {
      setPatologiaError(true);
      return;
    }
    setStep(2);
    sendGTMEvent({
      event: "formStart",
      category: "Lead",
      action: "FormOpen",
      label: "Form passo 2 (nome) - LP11",
      value: Array.from(selected).join(", "),
    });
    setTimeout(() => nameRef.current?.focus(), 80);
  }, [selected]);

  const handleSubmit = useCallback(() => {
    const trimmed = name.trim();
    const patologias = Array.from(selected);
    if (patologias.length === 0) {
      setPatologiaError(true);
      setStep(1);
      return;
    }
    if (!trimmed) {
      setNameError(true);
      nameRef.current?.focus();
      return;
    }

    setSubmitted(true);

    const params = new URLSearchParams(window.location.search);
    const fbclid = document.cookie.match(/(?:^|;\s*)fbclid=([^;]*)/)?.[1] || "";

    sendGTMEvent({
      event: "buttonWhatsappClicked",
      category: "Lead",
      action: "Click",
      label: "Iniciar tratamento - LP11",
      value: patologias.join(", "),
      leadData: {
        name: trimmed,
        patologies: patologias,
        referrer: document.referrer,
        userAgent: navigator.userAgent,
        language: navigator.language,
        platform: navigator.platform,
        src: params.get("src") || "",
        utm_source: params.get("utm_source") || "",
        utm_medium: params.get("utm_medium") || "",
        utm_content: params.get("utm_content") || "",
        utm_campaign: params.get("utm_campaign") || "",
        utm_term: params.get("utm_term") || "",
        fbclid,
      },
    });

    sendLeadToCrm(trimmed, patologias);

    const url = buildWhatsAppUrl(trimmed, patologias);
    window.open(url, "_blank", "noopener,noreferrer");
  }, [name, selected]);

  /* título do cover: palavras com stagger */
  const coverWords = useMemo(
    () => ["A ", "calma ", "tem ", "uma ", "molécula."],
    [],
  );
  const wordVar: Variants = {
    hidden: { opacity: 0, y: flat ? 0 : 26 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: flat ? 0 : 0.35 + i * 0.11, duration: 0.7, ease: EASE },
    }),
  };

  const arrowIcon = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );

  return (
    <div className={flat ? "flat" : undefined}>
      <style>{CSS}</style>

      {/* marca fixa */}
      <a href="#" className="brand">
        <b>Click</b>
        <i>Cannabis</i>
      </a>

      {/* ATO 1 — cover */}
      <section className="act cover" ref={coverRef}>
        <div className="stage">
          <motion.div
            className="media"
            style={flat ? undefined : { scale: coverScale }}
          >
            {flat ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img className="poster" src="/lp11/hero-poster.webp" alt="" />
            ) : (
              <video
                playsInline
                muted
                autoPlay
                loop
                preload="auto"
                poster="/lp11/hero-poster.webp"
                src="/lp11/hero-oil.mp4"
              />
            )}
            <div className="veil" />
          </motion.div>
          <motion.div
            className="cover-copy"
            style={flat ? undefined : { opacity: titleOpacity, y: titleY }}
          >
            <motion.p
              className="cover-kicker"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: flat ? 0 : 0.15, duration: 0.8 }}
            >
              Cannabis medicinal · 100% online
            </motion.p>
            <h1 aria-label="A calma tem uma molécula.">
              {coverWords.map((w, i) => (
                <motion.span
                  key={i}
                  className="w"
                  custom={i}
                  variants={wordVar}
                  initial="hidden"
                  animate="visible"
                  aria-hidden
                >
                  {i === coverWords.length - 1 ? <em>{w}</em> : w}
                </motion.span>
              ))}
            </h1>
            <motion.p
              className="cover-sub"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: flat ? 0 : 1.05, duration: 0.8 }}
            >
              Primeira consulta R$50 · Regulamentado pela ANVISA
            </motion.p>
          </motion.div>
          <motion.div
            className="scroll-cue"
            style={flat ? undefined : { opacity: cueOpacity }}
            aria-hidden
          >
            <span className="tick" />
            role
          </motion.div>
          {!flat && (
            <motion.div className="exit-veil" style={{ opacity: exitVeil }} />
          )}
        </div>
      </section>

      {/* ATO 2 — manifesto */}
      <section className="act manifesto" ref={manifestoRef}>
        <div className="stage">
          <span className="m-index">Click Cannabis</span>
          {MANIFESTO.map((line, i) => (
            <ManifestoLine
              key={i}
              progress={maniP}
              index={i}
              total={MANIFESTO.length}
              flat={flat}
            >
              {line}
            </ManifestoLine>
          ))}
        </div>
      </section>

      {/* ATO 3 — molécula */}
      <section className="act mol" ref={molRef}>
        <div className="stage">
          <span className="mol-kicker">A ciência</span>
          <div className="frame">
            <motion.div
              className="portal"
              style={flat ? undefined : { scale: molScale, opacity: molIn }}
            >
              {flat ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src="/lp11/molecule-poster.webp" alt="" loading="lazy" />
              ) : (
                <video
                  ref={molVideoRef}
                  playsInline
                  muted
                  loop
                  preload="none"
                  poster="/lp11/molecule-poster.webp"
                />
              )}
            </motion.div>
          </div>
          {MOL_CAPTIONS.map((cap, i) => {
            const seg = 1 / MOL_CAPTIONS.length;
            const s = i * seg;
            const e = s + seg;
            const isLast = i === MOL_CAPTIONS.length - 1;
            return (
              <MolCaption
                key={i}
                progress={molP}
                s={s}
                e={e}
                isLast={isLast}
                seg={seg}
                flat={flat}
              >
                {cap}
              </MolCaption>
            );
          })}
        </div>
      </section>

      {/* ATO 4 — números */}
      <section className="act nums" ref={numsRef}>
        <div className="stage">
          <motion.div
            className="bg"
            style={flat ? undefined : { scale: numsBgScale, y: numsBgY }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/lp11/dropper-callout.webp" alt="" loading="lazy" />
          </motion.div>
          <span className="nums-kicker">Por que a Click</span>
          {NUMBERS.map((item, i) => (
            <NumberSlide
              key={i}
              progress={numsP}
              index={i}
              total={NUMBERS.length}
              item={item}
              flat={flat}
            />
          ))}
        </div>
      </section>

      {/* ATO 5 — jornada */}
      <section className="act journey" ref={journeyRef}>
        <div className="stage">
          <span className="j-kicker">Como funciona</span>
          {JOURNEY.map((item, i) => (
            <JourneyCard
              key={i}
              progress={jouP}
              index={i}
              total={JOURNEY.length}
              item={item}
              flat={flat}
            />
          ))}
        </div>
      </section>

      {/* ATO 6 — vozes */}
      <section className="voices" id="depo">
        <div className="head">
          <span className="kicker">Histórias reais</span>
          <h2>
            Quem já vive <em>isso</em>.
          </h2>
        </div>
        <TestimonialsSlider items={testimonials} />
      </section>

      {/* ATO 7 — dúvidas */}
      <section className="faq-act" id="faq">
        <div className="faq-wrap">
          <span className="kicker">Dúvidas frequentes</span>
          <details className="faq" open>
            <summary>
              O tratamento é legal? <span className="plus">+</span>
            </summary>
            <div className="ans">
              Sim. Todo o processo é feito dentro da lei, com prescrição médica
              e importação regulamentada e acompanhada pela ANVISA. A Click
              cuida da documentação com você em cada etapa.
            </div>
          </details>
          <details className="faq">
            <summary>
              Como funciona a consulta e quanto custa?{" "}
              <span className="plus">+</span>
            </summary>
            <div className="ans">
              A consulta é 100% online, com médicos de plantão 24h, e custa
              R$50. Se você for apto, o médico emite a receita necessária. A
              primeira consulta de acompanhamento é gratuita.
            </div>
          </details>
          <details className="faq">
            <summary>
              Em quanto tempo o medicamento chega?{" "}
              <span className="plus">+</span>
            </summary>
            <div className="ans">
              Após a autorização, a importação é feita direto dos EUA com
              isenção de impostos e suporte completo da Click. A entrega
              acontece em até 15 dias úteis.
            </div>
          </details>
          <details className="faq">
            <summary>
              Causa dependência ou efeitos colaterais?{" "}
              <span className="plus">+</span>
            </summary>
            <div className="ans">
              O tratamento é prescrito e acompanhado por médico, com dosagem
              orientada para o seu caso. Muitos pacientes relatam justamente
              reduzir o uso de tarja preta. Dúvidas sobre efeitos devem ser
              conversadas com o médico na consulta.
            </div>
          </details>
          <details className="faq">
            <summary>
              Preciso de exame ou laudo pra começar?{" "}
              <span className="plus">+</span>
            </summary>
            <div className="ans">
              Não. Na consulta, o médico avalia o seu caso e indica o melhor
              caminho. Se for apto ao tratamento, ele cuida da receita na hora.
            </div>
          </details>
          <details className="faq">
            <summary>
              Quais formas de tratamento existem?{" "}
              <span className="plus">+</span>
            </summary>
            <div className="ans">
              Óleo, jujuba e softgel. Cada formato tem uma forma de absorção, e
              o seu médico indica a melhor opção pra sua rotina e objetivo.
            </div>
          </details>
        </div>
      </section>

      {/* ATO 8 — começo */}
      <section className="begin" id="form">
        <div className="glow" />
        <div className="begin-in">
          <motion.h2
            initial={{ opacity: 0, y: flat ? 0 : 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            Comece <em>hoje</em>.
          </motion.h2>
          <motion.p
            className="lead-in"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15, duration: 0.7 }}
          >
            O primeiro passo custa <b>R$50</b> e leva minutos.
          </motion.p>
          <motion.div
            className="form-box"
            id="form-box"
            initial={{ opacity: 0, y: flat ? 0 : 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.65, ease: EASE }}
          >
            <div className="form-progress">Passo {step} de 2</div>
            <AnimatePresence mode="wait" initial={false}>
              {step === 1 ? (
                <motion.div
                  key="step-1"
                  initial={{ opacity: 0, x: flat ? 0 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: flat ? 0 : -20 }}
                  transition={{ duration: 0.28, ease: EASE }}
                >
                  <h3>O que você quer tratar?</h3>
                  <p className="fp">
                    Escolha uma ou mais opções pra falar com o médico certo.
                  </p>
                  <div className="field">
                    <div className="chips">
                      {PATOLOGIAS.map((p) => (
                        <motion.button
                          type="button"
                          key={p}
                          className={`chip${selected.has(p) ? " on" : ""}`}
                          aria-pressed={selected.has(p)}
                          onClick={() => toggle(p)}
                          whileHover={flat ? undefined : { scale: 1.05 }}
                          whileTap={flat ? undefined : { scale: 0.93 }}
                          transition={BTN_SPRING}
                        >
                          {p}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                  <AnimatePresence>
                    {patologiaError && (
                      <motion.p
                        className="field-err"
                        initial={{ opacity: 0, y: flat ? 0 : -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2, ease: EASE }}
                      >
                        Selecione ao menos uma opção.
                      </motion.p>
                    )}
                  </AnimatePresence>
                  <motion.button
                    className="btn"
                    type="button"
                    onClick={goToStep2}
                    whileHover={flat ? undefined : { y: -3, scale: 1.03 }}
                    whileTap={flat ? undefined : { scale: 0.96 }}
                    transition={BTN_SPRING}
                  >
                    Continuar
                    {arrowIcon}
                  </motion.button>
                </motion.div>
              ) : (
                <motion.div
                  key="step-2"
                  initial={{ opacity: 0, x: flat ? 0 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: flat ? 0 : 20 }}
                  transition={{ duration: 0.28, ease: EASE }}
                  onAnimationComplete={() => nameRef.current?.focus()}
                >
                  <h3>Falta só o seu nome</h3>
                  <p className="fp">Como o médico pode te chamar?</p>
                  <div className="field">
                    <label htmlFor="lp11-nome">Seu nome</label>
                    <input
                      id="lp11-nome"
                      ref={nameRef}
                      autoFocus
                      type="text"
                      placeholder="Como podemos te chamar?"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (nameError) setNameError(false);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSubmit();
                      }}
                    />
                  </div>
                  <AnimatePresence>
                    {nameError && (
                      <motion.p
                        className="field-err"
                        initial={{ opacity: 0, y: flat ? 0 : -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2, ease: EASE }}
                      >
                        Preencha o seu nome.
                      </motion.p>
                    )}
                  </AnimatePresence>
                  <motion.button
                    className="btn"
                    type="button"
                    onClick={handleSubmit}
                    whileHover={flat ? undefined : { y: -3, scale: 1.03 }}
                    whileTap={flat ? undefined : { scale: 0.96 }}
                    transition={BTN_SPRING}
                  >
                    {submitted
                      ? "Tudo certo! Redirecionando..."
                      : "Falar com o médico"}
                    {!submitted && arrowIcon}
                  </motion.button>
                  <div className="sel-summary">
                    {Array.from(selected).map((p) => (
                      <span key={p}>{p}</span>
                    ))}
                  </div>
                  <button
                    type="button"
                    className="form-back"
                    onClick={() => setStep(1)}
                  >
                    ← Voltar e editar a seleção
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
            <div className="secure">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" />
                <path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
              Seus dados estão protegidos e não são compartilhados.
            </div>
          </motion.div>
        </div>
        <p className="disclaim">
          A Click Cannabis conecta pacientes a médicos prescritores e dá suporte
          ao processo de importação regulamentado pela ANVISA. O tratamento com
          cannabis medicinal depende de avaliação e prescrição médica
          individual. Os relatos apresentados são experiências reais de
          pacientes e não representam garantia de resultado. © Click Cannabis.
        </p>
      </section>

      {/* CTA pílula flutuante */}
      <div className="pill-cta" ref={pillRef}>
        <motion.a
          href="#form-box"
          whileHover={flat ? undefined : { y: -3, scale: 1.04 }}
          whileTap={flat ? undefined : { scale: 0.96 }}
          transition={BTN_SPRING}
        >
          Falar com o médico
          {arrowIcon}
        </motion.a>
      </div>
    </div>
  );
}

function MolCaption({
  progress,
  s,
  e,
  seg,
  isLast,
  flat,
  children,
}: {
  progress: MotionValue<number>;
  s: number;
  e: number;
  seg: number;
  isLast: boolean;
  flat: boolean;
  children: React.ReactNode;
}) {
  const opacity = useTransform(
    progress,
    isLast ? [s, s + seg * 0.3, 1] : [s, s + seg * 0.3, e - seg * 0.2, e],
    isLast ? [0, 1, 1] : [0, 1, 1, 0],
  );
  const y = useTransform(progress, [s, s + seg * 0.3], [26, 0]);
  return (
    <motion.div className="mol-cap" style={flat ? undefined : { opacity, y }}>
      <p className="big">{children}</p>
    </motion.div>
  );
}
