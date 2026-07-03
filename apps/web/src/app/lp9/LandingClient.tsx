"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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

function buildWhatsAppUrl(name: string, patologias: string[]) {
  const list = patologias.map((p, i) => `${i + 1}. ${p}`).join("\n");
  const text = `Olá, me chamo ${name}.\n\nPatologias selecionadas:\n${list}`;
  return `https://api.whatsapp.com/send/?phone=${PHONE}&text=${encodeURIComponent(
    text,
  )}&type=phone_number&app_absent=0`;
}

const CSS = `
  .lp9{
    --green-900:#13241b;--green-800:#193024;--green-700:#1f4533;--green-600:#2a6043;
    --green-500:#3a7d57;--green-300:#7fb094;--cream:#f5efe3;--cream-2:#faf6ec;
    --card:#fffdf8;--ocher:#c08a3e;--ocher-soft:#e3c489;--ink:#17241d;--muted:#5d6b61;
    --line:rgba(23,36,29,.12);--shadow-sm:0 1px 2px rgba(19,36,27,.06);
    --shadow:0 18px 50px -24px rgba(19,36,27,.45);--shadow-lg:0 40px 90px -40px rgba(19,36,27,.55);
    --r:18px;--maxw:1180px;
    box-sizing:border-box;position:relative;min-height:100vh;
    font-family:var(--font-lexend),sans-serif;color:var(--ink);background:var(--cream);
    line-height:1.6;-webkit-font-smoothing:antialiased;overflow-x:hidden;
  }
  .lp9 *{box-sizing:border-box;margin:0;padding:0}
  .lp9::before{
    content:"";position:fixed;inset:0;pointer-events:none;z-index:9998;opacity:.035;
    background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  }
  html:has(.lp9){scroll-behavior:smooth}
  .lp9 [id]{scroll-margin-top:76px}
  .lp9 h1,.lp9 h2,.lp9 h3{font-family:var(--font-fraunces),serif;font-weight:500;line-height:1.05;letter-spacing:-.015em}
  .lp9 a{color:inherit;text-decoration:none}
  .lp9 img{max-width:100%;display:block}
  .lp9 .wrap{max-width:var(--maxw);margin:0 auto;padding:0 24px}
  .lp9 .eyebrow{font-size:.74rem;letter-spacing:.22em;text-transform:uppercase;font-weight:600;color:var(--green-600)}

  /* buttons */
  .lp9 .btn{display:inline-flex;align-items:center;justify-content:center;gap:.55rem;font-family:var(--font-lexend);font-weight:600;font-size:1rem;padding:1.05rem 2rem;border-radius:100px;border:none;cursor:pointer;transition:transform .25s cubic-bezier(.2,.8,.2,1),box-shadow .25s,background .25s;white-space:nowrap}
  .lp9 .btn-primary{background:linear-gradient(180deg,var(--green-600),var(--green-700));color:#fdfcf6;box-shadow:0 14px 30px -12px rgba(31,69,51,.7),inset 0 1px 0 rgba(255,255,255,.18)}
  .lp9 .btn-primary:hover{transform:translateY(-3px) scale(1.05);box-shadow:0 22px 44px -14px rgba(31,69,51,.75),inset 0 1px 0 rgba(255,255,255,.22)}
  .lp9 .btn-primary:active{transform:scale(.96);transition-duration:.12s}
  /* celular não tem hover: CTAs principais pulsam de leve pra chamar o olho */
  @keyframes lp9pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.03)}}
  @media(hover:none){
    .lp9 .hero-cta-row .btn,
    .lp9 .sticky-cta .btn{animation:lp9pulse 2.6s ease-in-out infinite}
    .lp9 .hero-cta-row .btn:active,
    .lp9 .sticky-cta .btn:active{animation:none;transform:scale(.96)}
  }
  .lp9 .btn-sub{display:block;font-size:.8rem;font-weight:400;color:var(--muted);margin-top:.55rem;letter-spacing:.01em}

  /* announcement bar */
  .lp9 .anno{background:var(--green-900);color:#e9e3d3;font-size:.82rem;letter-spacing:.04em;overflow:hidden;position:relative;border-bottom:1px solid rgba(255,255,255,.06)}
  .lp9 .anno-track{display:flex;gap:3.5rem;white-space:nowrap;padding:.6rem 0;width:max-content;animation:lp9marq 30s linear infinite}
  .lp9 .anno-track span{display:inline-flex;align-items:center;gap:.55rem;opacity:.92}
  .lp9 .anno-track b{color:#fff;font-weight:600}
  .lp9 .dot{width:5px;height:5px;border-radius:50%;background:var(--green-500);display:inline-block}
  @keyframes lp9marq{to{transform:translateX(-50%)}}

  /* nav */
  .lp9 nav{position:sticky;top:0;z-index:90;background:rgba(245,239,227,.88);backdrop-filter:blur(14px);border-bottom:1px solid var(--line)}
  .lp9 .nav-in{display:flex;align-items:center;justify-content:space-between;height:64px}
  .lp9 .logo{font-family:var(--font-fraunces);font-size:1.4rem;font-weight:600;letter-spacing:-.02em;display:flex;align-items:baseline;gap:.4rem}
  .lp9 .logo b{color:var(--green-700)}
  .lp9 .logo i{font-style:normal;font-size:.66rem;letter-spacing:.24em;text-transform:uppercase;color:var(--green-600);font-family:var(--font-lexend);font-weight:600;transform:translateY(-2px)}
  .lp9 .nav-links{display:flex;gap:2rem;align-items:center;font-size:.92rem;font-weight:400}
  .lp9 .nav-links a{color:var(--muted);transition:color .2s}
  .lp9 .nav-links a:hover{color:var(--green-700)}
  .lp9 .nav-cta{padding:.55rem 1.25rem;font-size:.88rem}
  .lp9 .nav-links .nav-cta{color:#fdfcf6}
  @media(max-width:860px){.lp9 .nav-links a:not(.nav-cta){display:none}}

  /* hero */
  .lp9 .hero{position:relative;padding:56px 0 40px;overflow:hidden}
  .lp9 .hero-bg{position:absolute;inset:0;z-index:0;pointer-events:none}
  .lp9 .blob{position:absolute;border-radius:50%;filter:blur(60px);opacity:.5}
  .lp9 .blob.b1{width:520px;height:520px;background:radial-gradient(circle,#bcd9c5,transparent 65%);top:-160px;right:-120px}
  .lp9 .blob.b2{width:440px;height:440px;background:radial-gradient(circle,#e8d4a6,transparent 68%);bottom:-180px;left:-140px;opacity:.4}
  .lp9 .hero-grid{position:relative;z-index:2;display:grid;grid-template-columns:1.05fr .95fr;gap:48px;align-items:center}
  @media(max-width:920px){.lp9 .hero-grid{grid-template-columns:1fr;gap:26px}}
  .lp9 .hero-rate{display:inline-flex;align-items:center;gap:.7rem;background:var(--card);border:1px solid var(--line);padding:.5rem .9rem;border-radius:100px;font-size:.84rem;box-shadow:var(--shadow-sm);margin-bottom:1.4rem}
  .lp9 .stars{color:var(--ocher);letter-spacing:.05em;font-size:.95rem}
  .lp9 .hero-rate b{font-weight:600}
  .lp9 .hero-rate .sep{width:1px;height:14px;background:var(--line)}
  .lp9 .hero h1{font-size:clamp(2.4rem,5.3vw,4rem)}
  .lp9 .hero h1 em{font-style:italic;color:var(--green-600)}
  .lp9 .hero-sub{font-size:1.16rem;color:var(--muted);margin:1.3rem 0 1.6rem;max-width:34ch;text-wrap:balance}
  /* live badge inline (mobile, primeira dobra) */
  .lp9 .hero-live{display:none;align-items:center;gap:.55rem;margin:0 0 1.3rem;font-size:.92rem;color:var(--green-700);font-weight:500}
  .lp9 .hero-live b{color:var(--green-700);font-weight:700}
  .lp9 .hero-cta-row{display:flex;flex-direction:column;gap:.4rem;align-items:flex-start}
  .lp9 .hero-cta-row .btn{font-size:1.08rem}
  .lp9 .hero-visual{position:relative;height:460px;display:flex;align-items:center;justify-content:center}
  @media(max-width:920px){.lp9 .hero-visual{display:none}}
  .lp9 .hero-card{position:relative;width:100%;max-width:400px;aspect-ratio:1;border-radius:30px;background:linear-gradient(160deg,var(--green-700),var(--green-900));box-shadow:var(--shadow-lg);overflow:hidden;display:flex;align-items:center;justify-content:center}
  .lp9 .hero-card::after{content:"";position:absolute;inset:0;background:radial-gradient(circle at 30% 25%,rgba(127,176,148,.35),transparent 55%)}
  .lp9 .bottle{position:relative;z-index:2;width:120px;height:230px;display:flex;flex-direction:column;align-items:center;animation:lp9float 6s ease-in-out infinite}
  @keyframes lp9float{50%{transform:translateY(-14px)}}
  .lp9 .bottle .cap{width:54px;height:40px;background:linear-gradient(180deg,#dcc594,#bf8f4d);border-radius:8px 8px 4px 4px;box-shadow:inset 0 2px 0 rgba(255,255,255,.3)}
  .lp9 .bottle .neck{width:30px;height:18px;background:#e9dcc0;opacity:.85}
  .lp9 .bottle .body{width:104px;flex:1;background:linear-gradient(160deg,rgba(214,168,92,.92),rgba(168,116,48,.95));border-radius:22px 22px 26px 26px;box-shadow:inset -10px 0 20px rgba(0,0,0,.18),inset 10px 0 20px rgba(255,255,255,.12);position:relative}
  .lp9 .bottle .body::before{content:"";position:absolute;top:18px;left:18px;width:18px;height:70px;background:rgba(255,255,255,.25);border-radius:20px;filter:blur(3px)}
  .lp9 .activity{position:absolute;left:-12px;bottom:34px;z-index:3;background:var(--card);border:1px solid var(--line);border-radius:16px;padding:.85rem 1.1rem;box-shadow:var(--shadow);display:flex;align-items:center;gap:.75rem;animation:lp9rise .8s .6s both}
  @keyframes lp9rise{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
  .lp9 .pulse{width:10px;height:10px;border-radius:50%;background:#46b06a;position:relative;flex-shrink:0}
  .lp9 .pulse::after{content:"";position:absolute;inset:-6px;border-radius:50%;border:2px solid #46b06a;opacity:.6;animation:lp9ping 1.8s ease-out infinite}
  @keyframes lp9ping{to{transform:scale(2.2);opacity:0}}
  .lp9 .activity .num{font-weight:700;color:var(--green-700)}
  .lp9 .activity small{display:block;font-size:.72rem;color:var(--muted);line-height:1.2}
  .lp9 .activity .big{font-size:.92rem;font-weight:500}
  .lp9 .deliv{position:absolute;right:-10px;top:24px;z-index:3;background:var(--green-800);color:#eadfca;border-radius:14px;padding:.7rem .95rem;font-size:.78rem;box-shadow:var(--shadow);display:flex;align-items:center;gap:.5rem;animation:lp9rise .8s .85s both}
  .lp9 .deliv b{color:#fff;font-weight:600}

  /* section base */
  .lp9 section.block{padding:92px 0}
  .lp9 .sec-head{max-width:640px;margin-bottom:3rem}
  .lp9 .sec-head.center{margin:0 auto 3.4rem;text-align:center}
  .lp9 .sec-head h2{font-size:clamp(1.9rem,3.8vw,2.9rem);margin:.8rem 0 .6rem;text-wrap:balance}
  .lp9 .sec-head p{color:var(--muted);font-size:1.06rem}

  /* steps */
  .lp9 .steps{background:linear-gradient(180deg,var(--green-800),var(--green-900));color:#ece5d4;position:relative;overflow:hidden}
  .lp9 .steps .blob.b1{background:radial-gradient(circle,rgba(58,125,87,.5),transparent 65%);opacity:.6;top:-200px;left:-100px}
  .lp9 .steps .sec-head h2{color:#fbf7ec}
  .lp9 .steps .sec-head p{color:#b9c4b8}
  .lp9 .steps .eyebrow{color:var(--ocher-soft)}
  .lp9 .step-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:18px;position:relative;z-index:2}
  @media(max-width:920px){.lp9 .step-grid{grid-template-columns:repeat(2,1fr)}}
  @media(max-width:540px){.lp9 .step-grid{grid-template-columns:1fr}}
  .lp9 .step{background:rgba(255,255,255,.045);border:1px solid rgba(255,255,255,.1);border-radius:var(--r);padding:1.7rem 1.4rem;backdrop-filter:blur(4px);position:relative}
  .lp9 .step-head{display:flex;align-items:center;gap:.75rem;margin-bottom:.6rem}
  .lp9 .step .n{font-family:var(--font-fraunces);font-size:1rem;font-weight:600;color:var(--ocher-soft);border:1.5px solid rgba(227,196,137,.4);width:38px;height:38px;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0}
  .lp9 .step h3{font-size:1.18rem;color:#fbf7ec}
  .lp9 .step p{font-size:.92rem;color:#b9c4b8}
  .lp9 .step .tag{display:inline-block;margin-top:.9rem;font-size:.76rem;font-weight:600;color:#cbe6d2;background:rgba(58,125,87,.32);border:1px solid rgba(127,176,148,.3);padding:.25rem .7rem;border-radius:100px}

  /* forms of consumption */
  .lp9 .forms-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:22px}
  @media(max-width:820px){.lp9 .forms-grid{grid-template-columns:1fr}}
  .lp9 .form-card{background:var(--card);border:1px solid var(--line);border-radius:var(--r);padding:1.5rem 1.6rem;box-shadow:var(--shadow-sm);position:relative;overflow:hidden;transition:transform .3s,box-shadow .3s}
  .lp9 .form-card:hover{transform:translateY(-6px);box-shadow:var(--shadow)}
  .lp9 .form-head{display:flex;align-items:center;gap:.7rem;margin-bottom:.5rem}
  .lp9 .form-card .num{font-family:var(--font-fraunces);font-size:2.2rem;font-weight:400;color:var(--ocher-soft);line-height:1;opacity:.65;flex-shrink:0}
  .lp9 .form-card h3{font-size:1.3rem}
  .lp9 .form-card p{font-size:.95rem;color:var(--muted)}
  .lp9 .forms-note{display:flex;align-items:center;justify-content:center;gap:.55rem;margin-top:1.8rem;font-size:.92rem;font-weight:500;color:var(--green-700);text-align:center;flex-wrap:wrap}
  .lp9 .forms-note svg{flex-shrink:0}

  /* testimonials — section shell (o slider de vídeo traz o próprio CSS) */
  .lp9 .testi{background:var(--cream-2)}

  /* faq */
  .lp9 .faq-wrap{max-width:780px;margin:0 auto}
  .lp9 .faq{border-bottom:1px solid var(--line)}
  .lp9 .faq summary{list-style:none;cursor:pointer;padding:1.4rem .2rem;display:flex;justify-content:space-between;align-items:center;gap:1rem;font-family:var(--font-fraunces);font-size:1.2rem;font-weight:500;color:var(--ink)}
  .lp9 .faq summary::-webkit-details-marker{display:none}
  .lp9 .faq summary .plus{flex-shrink:0;width:30px;height:30px;border-radius:50%;border:1.5px solid var(--line);display:flex;align-items:center;justify-content:center;transition:transform .3s,background .3s;font-size:1.2rem;color:var(--green-600)}
  .lp9 .faq[open] summary .plus{transform:rotate(45deg);background:var(--green-600);color:#fff;border-color:var(--green-600)}
  .lp9 .faq .ans{padding:0 .2rem 1.4rem;color:var(--muted);font-size:.98rem;max-width:62ch}

  /* final cta + form */
  .lp9 .final{background:linear-gradient(165deg,var(--green-800),var(--green-900));color:#f1ecde;position:relative;overflow:hidden}
  .lp9 .final.block{padding:60px 0}
  @media(max-width:640px){.lp9 .final.block{padding:40px 0}}
  .lp9 .final .blob.b1{background:radial-gradient(circle,rgba(58,125,87,.55),transparent 64%);opacity:.6;top:-160px;right:-120px}
  .lp9 .final-in{position:relative;z-index:2;display:flex;justify-content:center}
  .lp9 .form-box{width:100%;max-width:540px;background:var(--card);border-radius:24px;padding:2.2rem;box-shadow:var(--shadow-lg);color:var(--ink)}
  .lp9 .form-progress{font-size:.72rem;letter-spacing:.16em;text-transform:uppercase;font-weight:600;color:var(--muted);margin-bottom:.55rem}
  .lp9 .form-box h3{font-size:1.5rem;margin-bottom:.4rem}
  .lp9 .form-box .fp{font-size:.92rem;color:var(--muted);margin-bottom:1.4rem}
  .lp9 .field{margin-bottom:1rem}
  .lp9 .field label{display:block;font-size:.82rem;font-weight:600;margin-bottom:.4rem;color:var(--ink)}
  .lp9 .field input{width:100%;padding:.9rem 1rem;border:1.5px solid var(--line);border-radius:12px;font-family:var(--font-lexend);font-size:1rem;background:var(--cream-2);transition:border .2s,box-shadow .2s}
  .lp9 .field input:focus{outline:none;border-color:var(--green-500);box-shadow:0 0 0 4px rgba(58,125,87,.12);background:#fff}
  .lp9 .chips{display:flex;flex-wrap:wrap;gap:.5rem}
  .lp9 .chip{font-family:var(--font-lexend);font-size:.85rem;font-weight:500;padding:.5rem .9rem;border-radius:100px;border:1.5px solid var(--line);background:var(--cream-2);color:var(--muted);cursor:pointer;transition:transform .15s,background .2s,color .2s,border-color .2s}
  .lp9 .chip:hover{border-color:var(--green-500);color:var(--green-700)}
  .lp9 .chip.on{background:linear-gradient(180deg,var(--green-600),var(--green-700));border-color:var(--green-700);color:#fdfcf6}
  .lp9 .field-err{color:#c0392b;font-size:.82rem;margin:.2rem 0 .6rem}
  .lp9 .sel-summary{display:flex;flex-wrap:wrap;justify-content:center;gap:.4rem;margin-top:1rem}
  .lp9 .sel-summary span{font-size:.78rem;font-weight:500;color:var(--green-700);background:#e8f0e8;padding:.28rem .75rem;border-radius:100px}
  .lp9 .form-back{display:block;width:100%;background:none;border:none;cursor:pointer;font-family:var(--font-lexend);font-size:.85rem;color:var(--muted);margin-top:.7rem;text-align:center;transition:color .2s}
  .lp9 .form-back:hover{color:var(--green-700)}
  .lp9 .form-box .btn{width:100%;margin-top:.4rem}
  .lp9 .form-box .secure{display:flex;align-items:center;gap:.5rem;justify-content:center;font-size:.78rem;color:var(--muted);margin-top:1rem}

  /* footer */
  .lp9 footer{background:var(--green-900);color:#9fae9f;padding:48px 0 110px;font-size:.88rem}
  .lp9 .foot-cols{display:flex;justify-content:center;gap:4.5rem;flex-wrap:wrap;border-bottom:1px solid rgba(255,255,255,.08);padding-bottom:2rem;margin-bottom:1.6rem}
  .lp9 .foot-cols a{display:block;color:#9fae9f;margin-bottom:.5rem;transition:color .2s}
  .lp9 .foot-cols a:hover{color:#f1ecde}
  .lp9 .foot-cols h4{color:#dfe8dc;font-family:var(--font-lexend);font-weight:600;font-size:.82rem;letter-spacing:.08em;text-transform:uppercase;margin-bottom:.9rem}
  .lp9 .disclaim{font-size:.76rem;color:#6f7e70;line-height:1.6;max-width:70ch;margin:0 auto;text-align:center}

  /* CTA flutuante (só o botão, sem faixa) */
  .lp9 .sticky-cta{position:fixed;left:0;right:0;bottom:calc(16px + env(safe-area-inset-bottom));z-index:95;display:flex;justify-content:center;pointer-events:none;opacity:0;transform:translateY(18px);transition:opacity .3s ease,transform .35s cubic-bezier(.2,.8,.2,1)}
  .lp9 .sticky-cta.show{opacity:1;transform:none}
  .lp9 .sticky-cta .btn{pointer-events:auto;padding:.95rem 2.2rem;box-shadow:0 20px 44px -12px rgba(19,36,27,.6),0 14px 30px -12px rgba(31,69,51,.75),inset 0 1px 0 rgba(255,255,255,.18)}

  /* reveal on scroll */
  .lp9 .reveal{opacity:0;transform:translateY(28px);transition:opacity .7s cubic-bezier(.2,.8,.2,1),transform .7s cubic-bezier(.2,.8,.2,1)}
  .lp9 .reveal.in{opacity:1;transform:none}
  .lp9 .stagger>*{opacity:0;transform:translateY(24px);transition:opacity .6s,transform .6s}
  .lp9 .stagger.in>*{opacity:1;transform:none}
  .lp9 .stagger.in>*:nth-child(1){transition-delay:.05s}
  .lp9 .stagger.in>*:nth-child(2){transition-delay:.13s}
  .lp9 .stagger.in>*:nth-child(3){transition-delay:.21s}
  .lp9 .stagger.in>*:nth-child(4){transition-delay:.29s}

  /* ------- mobile tuning ------- */
  @media(max-width:920px){
    .lp9 .hero-live{display:inline-flex}
    .lp9 .activity{display:none}
  }
  @media(max-width:640px){
    .lp9 .wrap{padding:0 18px}
    .lp9 section.block{padding:56px 0}
    .lp9 .hero{padding:30px 0 22px}
    .lp9 .hero-sub{margin:1.1rem 0 1.3rem;font-size:1.02rem;max-width:none}
    .lp9 .hero-cta-row{align-items:stretch}
    .lp9 .hero-cta-row .btn{width:100%}
    .lp9 .btn-sub{text-align:center}
    .lp9 .sec-head{margin-bottom:2rem}
    .lp9 .sec-head.center{margin-bottom:2.2rem}
    .lp9 .steps .sec-head h2{font-size:1.55rem}
    .lp9 .forms-grid{gap:22px}
    .lp9 .form-card{padding:1.4rem 1.4rem}
    .lp9 .form-card .num{font-size:1.9rem}
    .lp9 .final-in{gap:22px}
    .lp9 .form-box{padding:1.5rem}
    .lp9 .chips{gap:.4rem}
    .lp9 .chip{font-size:.8rem;padding:.45rem .72rem}
    .lp9 .form-box .secure{font-size:.64rem;gap:.4rem}
    .lp9 footer{padding:40px 0 104px}
    .lp9 .foot-cols{gap:2.2rem;justify-content:space-around;text-align:center}
  }
  @media(max-width:560px){
    .lp9 .sticky-cta .btn{width:calc(100% - 48px);max-width:340px;justify-content:center}
  }

  @media(prefers-reduced-motion:reduce){
    .lp9 *{animation:none!important;transition:none!important}
    .lp9 .reveal,.lp9 .stagger>*{opacity:1;transform:none}
  }
`;

const ANNOUNCEMENTS: React.ReactNode[] = [
  <>
    <span className="dot" /> Primeira consulta <b>R$50</b> · 1º acompanhamento{" "}
    <b>grátis</b>
  </>,
  <>
    <span className="dot" /> Médicos de plantão <b>24h</b>, 100% online
  </>,
  <>
    <span className="dot" /> Tratamento <b>regulamentado pela ANVISA</b>
  </>,
  <>
    <span className="dot" /> Entrega em até <b>15 dias úteis</b>
  </>,
];

// Média aproximada de pessoas em consulta por hora do dia (plantão 24h).
// Sem CRM ao vivo: curva fixa por horário + oscilação leve pra dar vida.
const CONSULTAS_BASE_POR_HORA = [
  8, 7, 6, 6, 7, 8, // 0h–5h madrugada
  10, 12, 14, 16, 17, 18, // 6h–11h manhã
  16, 18, 19, 15, 16, 17, // 12h–17h almoço/tarde
  20, 23, 26, 25, 21, 15, // 18h–23h noite (pico ~20h)
];

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
  const [liveCount, setLiveCount] = useState(17);
  const nameRef = useRef<HTMLInputElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);

  // reveal on scroll
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.16 },
    );
    document
      .querySelectorAll(".lp9 .reveal, .lp9 .stagger")
      .forEach((el) => io.observe(el));

    const raf = requestAnimationFrame(() => {
      document
        .querySelectorAll(".lp9 .hero .reveal")
        .forEach((el) => el.classList.add("in"));
    });

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  // CTA flutuante: aparece quando o botão do hero sai da tela e some
  // enquanto o formulário final está visível (evita botão duplicado).
  useEffect(() => {
    const bar = stickyRef.current;
    if (!bar) return;
    const heroCta = document.querySelector(".lp9 .hero-cta-row");
    const finalSection = document.querySelector(".lp9 .final");
    let heroVisible = true;
    let formVisible = false;
    const update = () =>
      bar.classList.toggle("show", !heroVisible && !formVisible);
    const observers: IntersectionObserver[] = [];
    if (heroCta) {
      const io = new IntersectionObserver(([e]) => {
        heroVisible = e.isIntersecting;
        update();
      });
      io.observe(heroCta);
      observers.push(io);
    }
    if (finalSection) {
      const io = new IntersectionObserver(
        ([e]) => {
          formVisible = e.isIntersecting;
          update();
        },
        { threshold: 0.15 },
      );
      io.observe(finalSection);
      observers.push(io);
    }
    update();
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  // contador de atividade — média por hora do dia + oscilação leve
  useEffect(() => {
    const base = () => CONSULTAS_BASE_POR_HORA[new Date().getHours()] ?? 15;
    setLiveCount(base());
    const id = setInterval(() => {
      const b = base();
      const jitter = Math.floor(Math.random() * 6) - 2; // -2..+3
      setLiveCount(Math.max(b - 2, Math.min(b + 3, b + jitter)));
    }, 7000);
    return () => clearInterval(id);
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
      label: "Form passo 2 (nome) - LP9",
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
      label: "Iniciar tratamento - LP9",
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

  const arrowIcon = (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );

  return (
    <>
      <style>{CSS}</style>

      {/* announcement bar */}
      <div className="anno">
        <div className="anno-track">
          {[...ANNOUNCEMENTS, ...ANNOUNCEMENTS].map((content, i) => (
            <span key={i}>{content}</span>
          ))}
        </div>
      </div>

      {/* nav */}
      <nav>
        <div className="wrap nav-in">
          <a href="#" className="logo">
            <b>Click</b>
            <i>Cannabis</i>
          </a>
          <div className="nav-links">
            <a href="#como">Como funciona</a>
            <a href="#formas">Tratamento</a>
            <a href="#depo">Histórias</a>
            <a href="#faq">Dúvidas</a>
            <a href="#form-box" className="btn btn-primary nav-cta">
              Falar com o médico
            </a>
          </div>
        </div>
      </nav>

      {/* hero */}
      <header className="hero">
        <div className="hero-bg">
          <div className="blob b1" />
          <div className="blob b2" />
        </div>
        <div className="wrap hero-grid">
          <div className="hero-copy">
            <div className="hero-rate reveal">
              <span className="stars">★★★★★</span>
              <b>4.9</b>
              <span className="sep" />
              <span>
                <b>+50 mil pacientes</b>
              </span>
            </div>
            <h1 className="reveal">
              Tudo para o seu tratamento com <em>cannabis medicinal</em>.
            </h1>
            <p className="hero-sub reveal">
              Consulta médica, receita, importação e acompanhamento. Tudo 100%
              online.
            </p>
            <div className="hero-live reveal">
              <span className="pulse" />
              <span>
                <b>{liveCount}</b> pessoas em consulta agora
              </span>
            </div>
            <div className="hero-cta-row reveal">
              <a href="#form-box" className="btn btn-primary">
                Falar com o médico
                {arrowIcon}
              </a>
              <span className="btn-sub">
                Primeira consulta{" "}
                <b style={{ color: "var(--green-700)" }}>R$50</b>
              </span>
            </div>
          </div>

          <div className="hero-visual reveal">
            <div className="hero-card">
              <div className="bottle">
                <div className="cap" />
                <div className="neck" />
                <div className="body" />
              </div>
            </div>
            <div className="activity">
              <span className="pulse" />
              <div>
                <span className="big">
                  <span className="num">{liveCount}</span> pessoas em consulta
                </span>
                <small>agora, com médicos de plantão</small>
              </div>
            </div>
            <div className="deliv">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="1" y="3" width="15" height="13" />
                <path d="M16 8h4l3 3v5h-7zM5.5 19a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM18.5 19a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
              </svg>
              <span>
                Entrega em até <b>15 dias úteis</b>
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* testimonials — vídeos reais do banco (2ª dobra) */}
      <TestimonialsSlider items={testimonials} />

      {/* how it works / steps (3ª dobra) */}
      <section className="block steps" id="como">
        <div className="blob b1" />
        <div className="wrap">
          <div className="sec-head center reveal">
            <span className="eyebrow">Tratamento descomplicado</span>
            <h2>Da consulta à sua porta, a gente cuida de cada etapa.</h2>
            <p>Quatro passos simples, com a Click ao seu lado em todos eles.</p>
          </div>
          <div className="step-grid stagger">
            <div className="step">
              <div className="step-head">
                <div className="n">1</div>
                <h3>Consulta médica</h3>
              </div>
              <p>
                100% online, com médicos de plantão 24h por dia. Rápido e sem
                sair de casa.
              </p>
              <span className="tag">Apenas R$50</span>
            </div>
            <div className="step">
              <div className="step-head">
                <div className="n">2</div>
                <h3>Receita médica</h3>
              </div>
              <p>
                Sendo apto, o médico emite a receita que autoriza a importação.
              </p>
            </div>
            <div className="step">
              <div className="step-head">
                <div className="n">3</div>
                <h3>Autorização ANVISA</h3>
              </div>
              <p>
                Te orientamos em toda a documentação e burocracia da
                importação.
              </p>
            </div>
            <div className="step">
              <div className="step-head">
                <div className="n">4</div>
                <h3>Importação e entrega</h3>
              </div>
              <p>
                Suporte completo na importação direta dos EUA, com isenção de
                impostos.
              </p>
              <span className="tag">Até 15 dias úteis</span>
            </div>
          </div>
        </div>
      </section>

      {/* forms of consumption */}
      <section className="block" id="formas">
        <div className="wrap">
          <div className="sec-head reveal">
            <span className="eyebrow">Formas de tratamento</span>
            <h2>Um formato ideal para cada rotina.</h2>
          </div>
          <div className="forms-grid stagger">
            <div className="form-card">
              <div className="form-head">
                <div className="num">01</div>
                <h3>Óleo</h3>
              </div>
              <p>
                Gotas aplicadas sob a língua, com absorção rápida pelo
                organismo.
              </p>
            </div>
            <div className="form-card">
              <div className="form-head">
                <div className="num">02</div>
                <h3>Jujuba</h3>
              </div>
              <p>
                Prática e saborosa, com efeito mais prolongado ao longo do dia.
              </p>
            </div>
            <div className="form-card">
              <div className="form-head">
                <div className="num">03</div>
                <h3>Softgel</h3>
              </div>
              <p>
                Cápsula com dose padronizada, ideal pra quem busca praticidade.
              </p>
            </div>
          </div>
          <p className="forms-note reveal">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
              <path d="M5 12l5 5L20 7" />
            </svg>
            Todas com importação regulamentada pela ANVISA: seu médico indica
            a ideal pro seu caso.
          </p>
        </div>
      </section>

      {/* faq */}
      <section className="block" id="faq">
        <div className="wrap">
          <div className="sec-head center reveal">
            <span className="eyebrow">Tira-dúvidas</span>
            <h2>As perguntas que todo mundo faz.</h2>
          </div>
          <div className="faq-wrap reveal">
            <details className="faq" open>
              <summary>
                O tratamento com cannabis medicinal é legal?{" "}
                <span className="plus">+</span>
              </summary>
              <div className="ans">
                Sim. Todo o processo é feito dentro da lei, com prescrição de
                médico e importação regulamentada e acompanhada pela ANVISA. A
                Click cuida da documentação com você em cada etapa.
              </div>
            </details>
            <details className="faq">
              <summary>
                Como funciona a consulta e quanto custa?{" "}
                <span className="plus">+</span>
              </summary>
              <div className="ans">
                A consulta é 100% online, com médicos de plantão 24h, e custa
                R$50. Se você for apto ao tratamento, o médico emite a receita
                necessária. E a sua primeira consulta de acompanhamento é
                gratuita.
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
                A cannabis medicinal causa dependência ou efeitos colaterais?{" "}
                <span className="plus">+</span>
              </summary>
              <div className="ans">
                O tratamento é prescrito e acompanhado por médico, com dosagem
                orientada para o seu caso. Muitos pacientes relatam justamente
                reduzir o uso de tarja preta. Qualquer dúvida sobre efeitos deve
                ser conversada com o médico na consulta.
              </div>
            </details>
            <details className="faq">
              <summary>
                Preciso de algum exame ou laudo para começar?{" "}
                <span className="plus">+</span>
              </summary>
              <div className="ans">
                Não precisa chegar com laudo pronto. Na consulta, o médico avalia
                o seu caso e indica o melhor caminho. Se for apto ao tratamento,
                ele cuida da receita na hora.
              </div>
            </details>
            <details className="faq">
              <summary>
                Quais formas de tratamento existem?{" "}
                <span className="plus">+</span>
              </summary>
              <div className="ans">
                Óleo, jujuba e softgel. Cada formato tem uma forma de absorção, e
                o seu médico indica a melhor opção para a sua rotina e o seu
                objetivo.
              </div>
            </details>
          </div>
        </div>
      </section>

      {/* final cta + form */}
      <section className="block final" id="form">
        <div className="blob b1" />
        <div className="wrap final-in">
          <div className="form-box reveal" id="form-box">
            <div className="form-progress">Passo {step} de 2</div>
            {step === 1 ? (
              <>
                <h3>O que você quer tratar?</h3>
                <p className="fp">
                  Escolha uma ou mais opções pra falar com o médico certo.
                </p>
                <div className="field">
                  <div className="chips">
                    {PATOLOGIAS.map((p) => (
                      <button
                        type="button"
                        key={p}
                        className={`chip${selected.has(p) ? " on" : ""}`}
                        aria-pressed={selected.has(p)}
                        onClick={() => toggle(p)}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
                {patologiaError && (
                  <p className="field-err">Selecione ao menos uma opção.</p>
                )}
                <button
                  className="btn btn-primary"
                  type="button"
                  onClick={goToStep2}
                >
                  Continuar
                  {arrowIcon}
                </button>
              </>
            ) : (
              <>
                <h3>Falta só o seu nome</h3>
                <p className="fp">Como o médico pode te chamar?</p>
                <div className="field">
                  <label htmlFor="lp9-nome">Seu nome</label>
                  <input
                    id="lp9-nome"
                    ref={nameRef}
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
                {nameError && <p className="field-err">Preencha o seu nome.</p>}
                <button
                  className="btn btn-primary"
                  type="button"
                  onClick={handleSubmit}
                >
                  {submitted
                    ? "Tudo certo! Redirecionando..."
                    : "Falar com o médico"}
                  {!submitted && arrowIcon}
                </button>
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
              </>
            )}
            <div className="secure">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" />
                <path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
              Seus dados estão protegidos e não são compartilhados.
            </div>
          </div>
        </div>
      </section>

      {/* footer */}
      <footer>
        <div className="wrap">
          <div className="foot-cols">
            <div>
              <h4>Tratamento</h4>
              <a href="#como">Como funciona</a>
              <a href="#formas">Formas de tratamento</a>
              <a href="#faq">Dúvidas frequentes</a>
            </div>
            <div>
              <h4>Click Cannabis</h4>
              <a href="#depo">Histórias de pacientes</a>
              <a href="#form-box">Falar com médico</a>
              <a href="https://clickcannabis.com">clickcannabis.com</a>
            </div>
          </div>
          <p className="disclaim">
            A Click Cannabis conecta pacientes a médicos prescritores e dá
            suporte ao processo de importação regulamentado pela ANVISA. O
            tratamento com cannabis medicinal depende de avaliação e prescrição
            médica individual. Os relatos apresentados são experiências reais de
            pacientes e não representam garantia de resultado. © Click Cannabis.
            Todos os direitos reservados.
          </p>
        </div>
      </footer>

      {/* CTA flutuante */}
      <div className="sticky-cta" ref={stickyRef}>
        <a href="#form-box" className="btn btn-primary">
          Falar com o médico
        </a>
      </div>
    </>
  );
}
