"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  MotionConfig,
  animate,
  motion,
  useReducedMotion,
  type AnimationPlaybackControls,
} from "framer-motion";
import { sendGTMEvent } from "@next/third-parties/google";
import { sendLeadToCrm } from "@/lib/crmLead";

/* ============================ CONFIGURAÇÃO ============================ */

// Os demais benefícios compõem a roda; esta oferta garante o cashback.
const PREMIOS = [
  { label: "R$50\ncashback", cashback: true },
  { label: "Frete\ngrátis", cashback: false },
  { label: "Agende 1\nganhe outra", cashback: false },
  { label: "Frete\ngrátis", cashback: false },
  { label: "Agende 1\nganhe outra", cashback: false },
  { label: "Tente na\npróxima", cashback: false },
];
const CUPOM = "CASHBACK";
const PHONE = "5521993686082";

function buildWhatsAppUrl(name: string, sintomas: string[]) {
  const list = sintomas.map((sintoma, i) => `${i + 1}. ${sintoma}`).join("\n");
  const text = `Olá, me chamo ${name}.\n\nQuero agendar minha consulta. Liberei R$50 de cashback na Roleta Click e tenho o cupom ${CUPOM} para usar no link de pagamento da consulta.\n\nPatologias selecionadas:\n${list}`;
  return `https://api.whatsapp.com/send/?phone=${PHONE}&text=${encodeURIComponent(text)}&type=phone_number&app_absent=0`;
}

const PREMIOS_INFO = {
  "res-0": {
    prize: "Você liberou R$50 de cashback!",
    desc: "Aplique o cupom no pagamento da consulta. Você recebe R$50 de cashback se iniciar o tratamento e realizar o processo de importação.",
  },
};

// 6 sintomas em 2 linhas. Ansiedade já vem pré-selecionada — o CRM exige ao
// menos um sintoma preenchido pra casar o lead.
const SINTOMAS = [
  "Ansiedade",
  "Insônia",
  "Dores",
  "Depressão",
  "TDAH",
  "Enxaqueca",
] as const;
const SINTOMA_PADRAO = "Ansiedade";

const N = PREMIOS.length; // 6
const SEG = 360 / N; // 60 graus
const SPIN_S = 7.2; // duração do giro (segundos)
const VOLTAS = 7; // voltas completas antes de alinhar

// Giro único: quando ligado, o prêmio fica salvo no navegador — recarregar a
// página não devolve a roleta e some o botão de voltar da tela de prêmio.
// ⚠️ DESLIGADO durante o desenvolvimento pra poder voltar e testar à vontade.
// TODO: mudar pra TRUE na versão final, antes de ir pro ar.
const GIRO_UNICO = false;
const STORAGE_KEY = "lp10_premio";

/* ============================ ANIMAÇÃO (variants Framer Motion) ============================ */

const EASE = [0.2, 0.8, 0.2, 1] as const;

// Tela inteira: entra com fade+sobe, filhos revelam em cascata (stagger).
const screenV = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: EASE,
      staggerChildren: 0.07,
      delayChildren: 0.05,
    },
  },
  exit: { opacity: 0, y: -14, transition: { duration: 0.22, ease: "easeIn" as const } },
};

const itemV = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.25 } },
};

/* ============================ ÁUDIO (sintetizado, sem assets) ============================ */

type Ctx = AudioContext;

const clickBuffers = new WeakMap<Ctx, AudioBuffer>();

// Um estalo curto de madeira: ruído filtrado + corpo grave, sem apito digital.
function playTick(ctx: Ctx, strength = 1) {
  if (ctx.state !== "running") return;
  let buffer = clickBuffers.get(ctx);
  if (!buffer) {
    buffer = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * 0.025), ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    clickBuffers.set(ctx, buffer);
  }
  const t = ctx.currentTime;
  const noise = ctx.createBufferSource();
  noise.buffer = buffer;
  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = 1700;
  filter.Q.value = 0.7;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.16 * strength, t);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.025);
  noise.connect(filter).connect(gain).connect(ctx.destination);
  noise.start(t);
  noise.onended = () => { noise.disconnect(); filter.disconnect(); gain.disconnect(); };

  const body = ctx.createOscillator();
  const bodyGain = ctx.createGain();
  body.type = "sine";
  body.frequency.setValueAtTime(440, t);
  body.frequency.exponentialRampToValueAtTime(180, t + 0.035);
  bodyGain.gain.setValueAtTime(0.09 * strength, t);
  bodyGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.045);
  body.connect(bodyGain).connect(ctx.destination);
  body.start(t);
  body.stop(t + 0.05);
  body.onended = () => { body.disconnect(); bodyGain.disconnect(); };
}

function playWin(ctx: Ctx) {
  if (ctx.state !== "running") return;
  // Arpejo de sino com harmônico suave e cauda curta.
  [523.25, 659.25, 783.99, 1046.5].forEach((frequency, i) => {
    [1, 2].forEach((harmonic) => {
      const t = ctx.currentTime + i * 0.13;
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      oscillator.type = "sine";
      oscillator.frequency.value = frequency * harmonic;
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.linearRampToValueAtTime(harmonic === 1 ? 0.065 : 0.012, t + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.85);
      oscillator.connect(gain).connect(ctx.destination);
      oscillator.start(t);
      oscillator.stop(t + 0.9);
      oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); };
    });
  });
}

// Integra uma velocidade contínua: aceleração, embalo e desaceleração longa.
function spinEase(t: number) {
  const acceleration = 0.14;
  const cruise = 0.16;
  const braking = 0.7;
  const distance = acceleration / 2 + cruise + braking / 3;
  if (t < acceleration) return (t * t / (2 * acceleration)) / distance;
  if (t < acceleration + cruise) return (acceleration / 2 + t - acceleration) / distance;
  const u = (t - acceleration - cruise) / braking;
  return (acceleration / 2 + cruise + braking * (1 - Math.pow(1 - u, 3)) / 3) / distance;
}

/* ============================ COMPONENTE ============================ */

type Screen = "roleta" | "res-0";

export default function LandingClient() {
  const [screen, setScreen] = useState<Screen>("roleta");
  const [spinning, setSpinning] = useState(false);
  const [landed, setLanded] = useState(false);
  const [spinPhase, setSpinPhase] = useState("Girando a roleta…");
  const spinLock = useRef(false);
  const resultHeading = useRef<HTMLHeadingElement>(null);
  const [muted, setMuted] = useState(false);
  const reduceMotion = useReducedMotion();

  const wheelRef = useRef<SVGGElement>(null);
  const pointerRef = useRef<SVGGElement>(null);
  const rotRef = useRef(0); // ângulo acumulado da roda
  const spinCtrl = useRef<AnimationPlaybackControls | null>(null);
  const timeouts = useRef<ReturnType<typeof setTimeout>[]>([]);
  const audioRef = useRef<Ctx | null>(null);
  const mutedRef = useRef(false);
  mutedRef.current = muted;

  // Já girou antes? Vai direto pra tela do prêmio, sem roleta de novo.
  // Roda no client (localStorage não existe no servidor).
  useEffect(() => {
    if (!GIRO_UNICO) return;
    try {
      const salvo = localStorage.getItem(STORAGE_KEY);
      if (salvo === "res-0") setScreen(salvo);
    } catch {
      /* modo privado pode bloquear storage; segue com a roleta */
    }
  }, []);

  useEffect(
    () => () => {
      spinCtrl.current?.stop();
      timeouts.current.forEach(clearTimeout);
      audioRef.current?.close().catch(() => {});
      audioRef.current = null;
    },
    [],
  );

  const later = useCallback((fn: () => void, ms: number) => {
    timeouts.current.push(setTimeout(fn, ms));
  }, []);

  const vibrate = useCallback((pattern: number | number[]) => {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch {
        /* alguns browsers bloqueiam; nunca quebrar o fluxo */
      }
    }
  }, []);

  const ensureAudio = useCallback((): Ctx | null => {
    if (!audioRef.current) {
      const AC =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (AC) audioRef.current = new AC();
    }
    audioRef.current?.resume().catch(() => {});
    return audioRef.current;
  }, []);

  // O resultado permanece na única fatia de cashback.
  const sortear = useCallback(() => PREMIOS.findIndex((premio) => premio.cashback), []);

  const girar = useCallback(() => {
    if (spinLock.current) return;
    spinLock.current = true;
    setLanded(false);
    setSpinPhase("Girando a roleta…");
    setSpinning(true);

    // AudioContext precisa nascer num gesto do usuário (política de autoplay)
    let ctx: Ctx | null = null;
    try { ctx = ensureAudio(); } catch { /* Som é opcional. */ }
    vibrate(20);

    const i = sortear();
    const centro = i * SEG + SEG / 2;
    const from = rotRef.current;
    const atual = ((from % 360) + 360) % 360;
    const preciso = (((360 - centro - atual) % 360) + 360) % 360;
    const target = from + 360 * (VOLTAS + Math.floor(Math.random() * 2)) + preciso;

    sendGTMEvent({
      event: "roletaGirou",
      category: "Roleta",
      action: "Spin",
      label: "Girar roleta - Oferta",
    });

    // animate() do Framer Motion dirige o giro; o onUpdate entrega o ângulo
    // a cada frame — é onde o tick de som + vibração + ponteiro dispara
    // exatamente quando uma fatia passa.
    let lastSeg = Math.floor(from / SEG);
    let lastTickAt = 0;

    later(() => setSpinPhase("Desacelerando…"), reduceMotion ? 1200 : 4200);
    if (!reduceMotion) later(() => setSpinPhase("Quase lá…"), 6100);

    spinCtrl.current = animate(0, 1, {
      duration: reduceMotion ? 2.4 : SPIN_S,
      ease: "linear",
      onUpdate: (progress) => {
        // Movimento reduzido mantém a espera, sem várias voltas rápidas.
        if (reduceMotion) return;
        const r = from + (target - from) * spinEase(progress);
        if (wheelRef.current)
          wheelRef.current.style.transform = `rotate(${r}deg)`;

        const seg = Math.floor(r / SEG);
        const now = performance.now();
        if (seg !== lastSeg && now - lastTickAt > 45) {
          lastSeg = seg;
          lastTickAt = now;
          if (ctx && !mutedRef.current) playTick(ctx, 0.7 + 0.3 * (r - from) / (target - from));
          vibrate(6);
          // ponteiro dá o "toc" pra trás, como roleta de verdade
          const p = pointerRef.current;
          if (p) {
            p.classList.add("nudge");
            later(() => p.classList.remove("nudge"), 70);
          }
        }
      },
      onComplete: () => {
        rotRef.current = target;
        if (wheelRef.current) wheelRef.current.style.transform = `rotate(${target}deg)`;
        // O ponteiro termina no centro de uma fatia de cashback.
        const tela = "res-0" as const;
        setLanded(true);
        if (ctx && !mutedRef.current) playWin(ctx);

        sendGTMEvent({
          event: "roletaResultado",
          category: "Roleta",
          action: "Result",
          label: "Cashback de R$50",
        });

        // trava o giro único: prêmio salvo, recarregar não devolve a roleta
        if (GIRO_UNICO) {
          try {
            localStorage.setItem(STORAGE_KEY, tela);
          } catch {
            /* storage bloqueado não pode impedir o prêmio */
          }
        }

        // pausa de suspense antes de revelar
        later(() => {
          vibrate([80, 50, 80, 50, 180]);
          setScreen(tela);
          setSpinning(false);
          window.scrollTo(0, 0);
        }, 1200);
      },
    });
  }, [sortear, ensureAudio, vibrate, later, reduceMotion]);

  return (
    <MotionConfig reducedMotion="user">
    <main className="offer-shell">
      <header className="offer-header">
        <a className="logo" href="/" aria-label="Click Cannabis, início"><b>Click</b><i>Cannabis</i></a>
        <span className="header-note">Seu cuidado começa na Click.</span>
        <button className="sound-toggle" onClick={() => setMuted(m => !m)} aria-label={muted ? "Ativar som" : "Desativar som"} aria-pressed={!muted}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4V5Z"/>{muted ? <path d="m16 9 6 6m0-6-6 6"/> : <><path d="M15 8a6 6 0 0 1 0 8"/><path d="M18 5a10 10 0 0 1 0 14"/></>}</svg>
          <span>Som {muted ? "desligado" : "ligado"}</span>
        </button>
      </header>
      <AnimatePresence mode="wait">
        {screen === "roleta" ? (
          <motion.section key="roleta" className="offer-grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="offer-copy">
              <h1>Gire a roleta.<br />Comece seu cuidado<br /><em>com uma vantagem.</em></h1>
            </div>
            <div className="wheel-panel">
              <div className={"wheel-stage" + (spinning ? " spinning" : "") + (landed ? " landed" : "")}>
                <svg className="wheel-svg" viewBox="0 0 420 430" role="img" aria-labelledby="offer-wheel-title">
                  <title id="offer-wheel-title">Roleta Click: cashback, frete grátis, consulta extra e tente na próxima.</title>
                  <defs>
                    <linearGradient id="offer-rim" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0" stopColor="#f0dfb4" />
                      <stop offset="0.45" stopColor="#c4a46b" />
                      <stop offset="1" stopColor="#e8d2a0" />
                    </linearGradient>
                    <linearGradient id="offer-hub" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0" stopColor="#fffef8" />
                      <stop offset="1" stopColor="#eeeade" />
                    </linearGradient>
                    <filter id="offer-hub-shadow" x="-40%" y="-40%" width="180%" height="180%">
                      <feDropShadow dx="0" dy="4" stdDeviation="5" floodColor="#173e32" floodOpacity="0.2" />
                    </filter>
                  </defs>
                  <circle cx="210" cy="214" r="199" fill="#ac915f" />
                  <circle className="svg-rim" cx="210" cy="210" r="199" fill="url(#offer-rim)" />
                  <circle cx="210" cy="210" r="192" fill="#faf5e6" />
                  <g className="wheel-rotor" ref={wheelRef} style={{ transform: `rotate(${rotRef.current}deg)` }}>
                    {PREMIOS.map((prize, i) => {
                      const start = (i * SEG - 90) * Math.PI / 180;
                      const end = ((i + 1) * SEG - 90) * Math.PI / 180;
                      const radius = 188;
                      const point = (angle: number) => `${(210 + radius * Math.cos(angle)).toFixed(4)} ${(210 + radius * Math.sin(angle)).toFixed(4)}`;
                      const lines = prize.label.split("\n");
                      return (
                        <g key={i}>
                          <path d={`M210 210 L${point(start)} A${radius} ${radius} 0 0 1 ${point(end)} Z`} fill={prize.cashback ? "#efdfb6" : "#254e3d"} stroke="#f8f1dd" strokeWidth="1.3" />
                          <g transform={`rotate(${i * SEG + SEG / 2} 210 210)`}>
                            <text className={prize.cashback ? "svg-prize" : "svg-alternative"} x="210" y="76" textAnchor="middle" fill={prize.cashback ? "#234833" : "#f4ecd9"}>
                              <tspan x="210">{lines[0]}</tspan>
                              <tspan className="svg-prize-caption" x="210" dy="21">{lines[1]}</tspan>
                            </text>
                          </g>
                        </g>
                      );
                    })}
                  </g>
                  <circle cx="210" cy="210" r="56" fill="url(#offer-hub)" stroke="#c4a66e" strokeWidth="3" filter="url(#offer-hub-shadow)" />
                  <image href="/click-symbol.svg" x="181" y="181" width="58" height="58" />
                  <g className="svg-pointer" ref={pointerRef}>
                    <path d="M198 4 Q210 -1 222 4 L222 20 Q220 28 210 40 Q200 28 198 20 Z" fill="#234833" stroke="#fff9e9" strokeWidth="2" />
                    <circle cx="210" cy="12" r="3" fill="#e8d2a0" />
                  </g>
                </svg>
              </div>
              <div className="spin-controls">
                <p className="spin-status" role="status" aria-live="polite">{landed ? "É seu! R$50 de cashback liberados." : spinning ? spinPhase : "Tudo pronto? Seu benefício começa com um giro."}</p>
                <motion.button className="btn btn-gold spin-btn" onClick={girar} disabled={spinning} whileTap={{ scale: .98 }}><span>{landed ? "Cashback liberado!" : spinning ? "Roleta girando…" : "Girar a roleta"}</span><span aria-hidden="true">{spinning ? "✧" : "↗"}</span></motion.button>
              </div>
            </div>
          </motion.section>
        ) : (
          <ResultForm key="cashback" screen="res-0" info={PREMIOS_INFO["res-0"]} vibrate={vibrate} headingRef={resultHeading} onBack={() => {spinLock.current = false; rotRef.current = 0; setLanded(false); setScreen("roleta"); window.scrollTo(0, 0);}} />
        )}
      </AnimatePresence>
      <footer className="offer-footer"><span>CLICK CANNABIS · CUIDADO QUE ACOLHE</span><span>Benefício válido para agendamentos por esta página.</span></footer>
    </main>
    </MotionConfig>
  );
}

/* ==================== FORMULÁRIO DE RESGATE (tela de prêmio) ==================== */

function ResultForm({
  screen,
  info,
  vibrate,
  onBack,
  headingRef,
}: {
  screen: "res-0";
  headingRef: React.RefObject<HTMLHeadingElement | null>;
  info: { prize: string; desc: string };
  vibrate: (pattern: number | number[]) => void;
  onBack: () => void;
}) {
  const [selected, setSelected] = useState<Set<string>>(
    () => new Set([SINTOMA_PADRAO]),
  );
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState(false);
  const [sintomaError, setSintomaError] = useState(false);
  const [done, setDone] = useState(false);
  const [whatsappUrl, setWhatsappUrl] = useState("");
  const nameRef = useRef<HTMLInputElement>(null);
  const [copyState, setCopyState] = useState<"idle" | "copied" | "manual">("idle");
  const couponRef = useRef<HTMLElement>(null);

  const copyCoupon = async () => {
    try {
      await navigator.clipboard.writeText(CUPOM);
      setCopyState("copied");
    } catch {
      const selection = window.getSelection();
      if (couponRef.current && selection) {
        const range = document.createRange();
        range.selectNodeContents(couponRef.current);
        selection.removeAllRanges();
        selection.addRange(range);
      }
      setCopyState("manual");
    }
  };

  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
  }, [headingRef]);

  const toggle = useCallback(
    (s: string) => {
      setSintomaError(false);
      vibrate(10);
      setSelected((prev) => {
        const next = new Set(prev);
        if (next.has(s)) next.delete(s);
        else next.add(s);
        return next;
      });
    },
    [vibrate],
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = name.trim();
      const sintomas = Array.from(selected);

      if (sintomas.length === 0) {
        setSintomaError(true);
        vibrate([40, 30, 40]);
        return;
      }
      if (!trimmed) {
        setNameError(true);
        vibrate([40, 30, 40]);
        nameRef.current?.focus();
        return;
      }

      sendGTMEvent({
        event: "buttonWhatsappClicked",
        category: "Lead",
        action: "Click",
        label: "Agendar consulta - Oferta Cashback",
        value: sintomas.join(", "),
        leadData: {
          name: trimmed,
          patologies: sintomas,
          premio: "Cashback de R$50",
          cupom: CUPOM,
        },
      });

      sendLeadToCrm(trimmed, sintomas);
      const url = buildWhatsAppUrl(trimmed, sintomas);
      setWhatsappUrl(url);
      // Mesmo fluxo das LP9 e LP11: abre durante o envio do formulário,
      // sem aguardar o CRM, para preservar o gesto do usuário.
      window.open(url, "_blank", "noopener,noreferrer");
      vibrate(30);
      setDone(true);
      window.scrollTo(0, 0);
    },
    [name, selected, vibrate],
  );

  return (
    <motion.section
      className="screen result"
      id={screen}
      variants={screenV}
      initial="hidden"
      animate="show"
      exit="exit"
    >
      <div className="result-intro">
        <span className="eyebrow">SEU BENEFÍCIO FOI LIBERADO</span>
        <h2 className="win-prize" tabIndex={-1} ref={headingRef}>{info.prize}</h2>
        <div className="cashback-ticket">
          <div className="ticket-top"><span>SEU CASHBACK CLICK</span><span aria-hidden="true">✧</span></div>
          <p className="ticket-value"><small>R$</small>50<span>,00</span></p>
          <p className="ticket-label">de cashback ao iniciar o tratamento e realizar a importação</p>
          <div className="ticket-bottom coupon-row">
            <div><span>SEU CUPOM</span><code ref={couponRef}>{CUPOM}</code></div>
            <button type="button" onClick={copyCoupon}>{copyState === "copied" ? "Copiado ✓" : "Copiar cupom"}</button>
          </div>
          <p className="copy-status" role="status">{copyState === "copied" ? "Cupom copiado. Use no link de pagamento da consulta." : copyState === "manual" ? "Copie o texto selecionado ou digite CASHBACK no pagamento." : "Aplique no link de pagamento da consulta."}</p>
        </div>
        <p className="win-desc">{info.desc}</p>
        <div className="coupon-how">
          <h3>Como usar seu cupom</h3>
          <ol>
            <li><b>1</b><span>Preencha seu nome e sintomas e siga para o <strong>WhatsApp</strong>. A equipe fará algumas perguntas rápidas para agendar sua consulta.</span></li>
            <li><b>2</b><span>Você receberá o <strong>link de pagamento da consulta pelo WhatsApp</strong>. Abra o link e aplique <strong>CASHBACK</strong> no campo de cupom antes de pagar.</span></li>
            <li><b>3</b><span>Se iniciar o tratamento e realizar a <strong>importação</strong>, você recebe <strong>R$50 de cashback</strong> sobre esse processo.</span></li>
          </ol>
        </div>
      </div>

      {/* o card entra quando rola até ele (em telas baixas fica abaixo da dobra) */}
      <motion.form
        className="res-form"
        onSubmit={handleSubmit}
        noValidate
        initial={{ opacity: 0, y: 26 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.5, ease: EASE, delay: 0.1 }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {!done ? (
            <motion.div
              key="form"
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <h3>Continue seu agendamento</h3>
              <p className="fp">
                Selecione seus sintomas e informe seu nome. Você seguirá para o WhatsApp para conversar com nossa equipe e agendar sua consulta.
              </p>
              <div className="field">
                <label>Seus sintomas</label>
                <div className="chips">
                  {SINTOMAS.map((s) => (
                    <motion.button
                      type="button"
                      aria-pressed={selected.has(s)}
                      key={s}
                      className={"chip" + (selected.has(s) ? " sel" : "")}
                      onClick={() => toggle(s)}
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.92 }}
                    >
                      {s}
                    </motion.button>
                  ))}
                </div>
                {sintomaError && (
                  <motion.p
                    className="err"
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    Selecione pelo menos um sintoma.
                  </motion.p>
                )}
              </div>
              <div className="field">
                <label htmlFor="oferta-name">Seu nome</label>
                <input
                  ref={nameRef}
                  id="oferta-name"
                  autoComplete="name"
                  aria-invalid={nameError}
                  type="text"
                  placeholder="Como podemos te chamar?"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setNameError(false);
                  }}
                  required
                />
                {nameError && (
                  <motion.p
                    className="err"
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    Escreva seu nome pra continuar.
                  </motion.p>
                )}
              </div>
              <motion.button
                className="btn btn-primary"
                type="submit"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.96 }}
              >
                Agendar pelo WhatsApp ↗
              </motion.button>
              <div className="secure">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" />
                  <path d="M7 11V7a5 5 0 0110 0v4" />
                </svg>
                Seus dados serão usados para o atendimento.
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="done"
              className="form-done show"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: EASE }}
            >
              <motion.div
                className="ok"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 420, damping: 16 }}
              >
                <svg
                  width="26"
                  height="26"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#fff"
                  strokeWidth="2.4"
                >
                  <path d="M5 12l5 5L20 7" />
                </svg>
              </motion.div>
              <h3>Seu cupom vai com você.</h3>
              <p>Continue com nossa equipe pelo WhatsApp. Aplique <strong>CASHBACK</strong> no link de pagamento da consulta que receber por lá. Os R$50 de cashback são recebidos se você iniciar o tratamento e realizar a importação.</p>
              <a
                className="btn btn-primary whatsapp-reopen"
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Abrir WhatsApp ↗
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.form>

      {/* botão de voltar só existe enquanto o giro único está desligado */}
      {!GIRO_UNICO && !done && (
        <motion.button
          className="btn btn-ghost back"
          onClick={onBack}
          variants={itemV}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.95 }}
        >
          ← Voltar para a roleta
        </motion.button>
      )}
    </motion.section>
  );
}
