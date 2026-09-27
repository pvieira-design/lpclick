"use client";

import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  CareScreen,
  ConsultationActivity,
  DosageSheet,
  ExploreScreen,
  FeelingSheet,
  HomeScreen,
  LockScreen,
  NotificationCard,
  Phone,
  WalletSheet,
} from "./PhoneScreens";

const ENTER = { type: "spring", duration: 0.6, bounce: 0.2 } as const;
const EXIT = { duration: 0.2, ease: [0.4, 0, 1, 1] } as const;
const EASE_OUT = [0.32, 0.72, 0, 1] as const;

/* Textos reais de apps/native/lib/notifications.ts */
const DOSE = {
  id: "dose",
  title: "Hora do Full Spectrum CBG",
  body: "Sua dose das 08:00 está na hora. Abra o Click para registrar.",
};
const CHECKIN = {
  id: "checkin",
  title: "Momento do seu acompanhamento",
  body: "Abra o Click para fazer seu registro de hoje.",
};

/* ─── Topo: a notificação chegando ─── */

export function HeroPhone() {
  const [notice, setNotice] = useState<(typeof DOSE & { key: number }) | null>(null);
  const [actions, setActions] = useState(false);
  const [done, setDone] = useState(false);
  const timers = useRef<number[]>([]);

  const later = (fn: () => void, ms: number) => timers.current.push(window.setTimeout(fn, ms));
  const clear = () => {
    timers.current.forEach(window.clearTimeout);
    timers.current = [];
  };

  const play = () => {
    clear();
    setNotice(null);
    setActions(false);
    setDone(false);
    later(() => setNotice({ ...DOSE, key: Date.now() }), 900);
    later(() => setActions(true), 2300);
  };

  useEffect(() => {
    play();
    return clear;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const answer = (next: typeof DOSE, delay: number) => {
    clear();
    setActions(false);
    setNotice(null);
    later(() => setNotice({ ...next, key: Date.now() }), delay);
    if (next.id === "dose") later(() => setActions(true), delay + 1300);
    else later(() => setDone(true), delay + 900);
  };

  return (
    <MotionConfig reducedMotion="user">
      <Phone scale={0.8} label="Demonstração do lembrete de dose na tela de bloqueio" interactive>
        <LockScreen>
          <AnimatePresence mode="wait">
            {notice && (
              <motion.div
                key={notice.key}
                className="ios-notice-stack"
                initial={{ opacity: 0, y: -40, scale: 0.94 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -16, scale: 0.97, transition: EXIT }}
                transition={ENTER}
              >
                <button
                  type="button"
                  className="ios-notice-button"
                  onClick={() => notice.id === "dose" && setActions((v) => !v)}
                >
                  <NotificationCard title={notice.title} body={notice.body} />
                </button>
                <AnimatePresence initial={false}>
                  {actions && notice.id === "dose" && (
                    <motion.div
                      className="ios-notice-actions"
                      initial={{ opacity: 0, y: -10, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, transition: EXIT }}
                      transition={{ duration: 0.28, ease: EASE_OUT }}
                    >
                      <button type="button" onClick={() => answer(CHECKIN, 1200)}>Tomei</button>
                      <button type="button" onClick={() => answer(DOSE, 1500)}>Lembrar em 15 min</button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </LockScreen>
      </Phone>
      <div className="hero-phone-foot">
        <AnimatePresence mode="wait">
          {done ? (
            <motion.button
              key="replay"
              type="button"
              className="hero-replay"
              onClick={play}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              Ver de novo
            </motion.button>
          ) : actions ? (
            <motion.span
              key="hint"
              className="hero-hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              Toque em Tomei ou Lembrar
            </motion.span>
          ) : null}
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
}

/* ─── Rolagem guiada ─── */

const STEPS = [
  {
    kicker: "Agenda",
    title: "Seu dia, organizado para você.",
    text: "Cada dose no horário certo, em ordem. Se alguma atrasar, o app avisa, e você acompanha sua constância semana a semana.",
  },
  {
    kicker: "Ajuste de dose",
    title: "Mudou a dose? Ajuste na hora.",
    text: "Seu médico ajustou a dosagem? Corrija no momento de marcar, só daquela vez ou daqui para frente.",
  },
  {
    kicker: "Diário",
    title: "Tomou? Conte como se sentiu.",
    text: "Um toque depois da dose e pronto. Com o tempo, você enxerga como tem se sentido ao longo do tratamento.",
  },
  {
    kicker: "Consultas",
    title: "Sua consulta, lembrada em tempo real.",
    text: "No dia, a contagem aparece direto na tela do celular, sem precisar abrir o app. Na hora, é só tocar para chegar à consulta.",
  },
  {
    kicker: "Carteirinha",
    title: "Seus documentos, sempre com você.",
    text: "Carteirinha, receita e autorização da Anvisa salvas no celular, prontas para mostrar quando precisar, até sem internet.",
  },
  {
    kicker: "Seus dados na Click",
    title: "Toda a sua Click na palma da mão.",
    text: "Consultas, receitas, pagamentos e pedidos em um só lugar. Tudo o que você tem com a Click, organizado para você.",
  },
  {
    kicker: "Explore",
    title: "Suas dúvidas, respondidas por médicos.",
    text: "Vídeos curtos com a equipe médica da Click sobre sono, ansiedade, dor e as perguntas que todo paciente tem.",
  },
] as const;

function Countdown({ running }: { running: boolean }) {
  const [left, setLeft] = useState(13 * 60);
  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => setLeft((s) => (s <= 1 ? 13 * 60 : s - 1)), 1000);
    return () => window.clearInterval(id);
  }, [running]);
  const mm = String(Math.floor(left / 60)).padStart(2, "0");
  const ss = String(left % 60).padStart(2, "0");
  return <ConsultationActivity countdown={`${mm}:${ss}`} />;
}

function SheetOver({ open, children }: { open: boolean; children: ReactNode }) {
  return (
    <>
      <motion.div
        className="ios-scrim"
        initial={false}
        animate={{ opacity: open ? 1 : 0 }}
        transition={{ duration: 0.35, ease: EASE_OUT }}
      />
      <motion.div
        className="ios-sheet-wrap"
        initial={false}
        animate={{ y: open ? 0 : "105%" }}
        transition={{ duration: 0.5, ease: EASE_OUT, delay: open ? 0.15 : 0 }}
      >
        {children}
      </motion.div>
    </>
  );
}

function StoryScreen({ step, animate }: { step: number; animate: boolean }) {
  switch (step) {
    case 0:
      return <HomeScreen morning="late" />;
    case 1:
      return (
        <HomeScreen morning="taken">
          <SheetOver open={animate}>
            <DosageSheet />
          </SheetOver>
        </HomeScreen>
      );
    case 2:
      return (
        <HomeScreen morning="taken">
          <SheetOver open={animate}>
            <FeelingSheet selected="Bem" />
          </SheetOver>
        </HomeScreen>
      );
    case 3:
      return (
        <LockScreen time="14:17" date="sexta-feira, 9 de outubro">
          <Countdown running={animate} />
        </LockScreen>
      );
    case 4:
      return (
        <CareScreen>
          <SheetOver open={animate}>
            <WalletSheet />
          </SheetOver>
        </CareScreen>
      );
    case 5:
      return <CareScreen scroll={560} />;
    default:
      return <ExploreScreen />;
  }
}

export function FeatureStory() {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.step));
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    refs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <div className="story">
        <div className="story-steps">
          {STEPS.map((s, i) => (
            <div
              key={s.kicker}
              ref={(el) => {
                refs.current[i] = el;
              }}
              data-step={i}
              className={`story-step${active === i ? " is-active" : ""}`}
            >
              <p className="kicker">{s.kicker}</p>
              <h3>{s.title}</h3>
              <p className="story-text">{s.text}</p>
              <div className="story-inline">
                <Phone scale={0.62} label={s.title}>
                  <StoryScreen step={i} animate />
                </Phone>
              </div>
            </div>
          ))}
        </div>
        <div className="story-sticky">
          <div className="story-phone">
            <Phone scale={0.8} label={STEPS[active].title}>
              {STEPS.map((s, i) => (
                <motion.div
                  key={s.kicker}
                  className="story-layer"
                  initial={false}
                  animate={{ opacity: active === i ? 1 : 0, scale: active === i ? 1 : 0.98 }}
                  transition={{ duration: 0.4, ease: EASE_OUT }}
                  style={{ zIndex: active === i ? 1 : 0 }}
                >
                  <StoryScreen step={i} animate={active === i} />
                </motion.div>
              ))}
            </Phone>
          </div>
        </div>
      </div>
    </MotionConfig>
  );
}

/* ─── Sem internet: o app é local-first (docs/agents/local-first-ui.md) ─── */

const OFFLINE_ITEMS = [
  "Lembretes de dose chegam no horário",
  "Marcar doses e registrar o humor",
  "Carteirinha, receita e autorização da Anvisa",
] as const;

export function OfflineDemo() {
  const [airplane, setAirplane] = useState(false);

  return (
    <MotionConfig reducedMotion="user">
      <div className="offline">
        <div className="offline-copy">
          <p className="kicker">Sem internet</p>
          <h2 className="h2">
            Sem sinal, <span className="soft">sem problema.</span>
          </h2>
          <p className="lede">
            Sua agenda, seus lembretes e seus documentos ficam salvos no celular. No avião, na
            estrada ou no subsolo, o app continua funcionando.
          </p>

          <button
            type="button"
            role="switch"
            aria-checked={airplane}
            className={`airplane${airplane ? " is-on" : ""}`}
            onClick={() => setAirplane((v) => !v)}
          >
            <span className="airplane-icon" aria-hidden="true" />
            <span className="airplane-label">
              <strong>Modo avião</strong>
              <span>{airplane ? "Sem internet, e o lembrete chegou no horário." : "Desligue a internet do iPhone ao lado"}</span>
            </span>
            <span className="airplane-track" aria-hidden="true">
              <motion.span className="airplane-thumb" layout transition={{ type: "spring", duration: 0.35, bounce: 0.15 }} />
            </span>
          </button>

          <ul className="offline-list">
            {OFFLINE_ITEMS.map((item) => (
              <li key={item} className={airplane ? "is-on" : ""}>
                <span className="offline-check" aria-hidden="true">
                  <svg width="12" height="12" viewBox="0 0 512 512" fill="none" stroke="currentColor" strokeWidth="56" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M416 128L192 384l-96-96" />
                  </svg>
                </span>
                {item}
              </li>
            ))}
          </ul>
          <p className="offline-sync">Quando a conexão volta, tudo se sincroniza sozinho.</p>
        </div>

        <div className="offline-stage">
          <Phone scale={0.74} label="Demonstração do app funcionando em modo avião">
            <HomeScreen morning="pending" airplane={airplane}>
              <AnimatePresence>
                {airplane && (
                  <motion.div
                    className="offline-banner"
                    initial={{ opacity: 0, y: -40, scale: 0.94 }}
                    animate={{ opacity: 1, y: 0, scale: 1, transition: { ...ENTER, delay: 0.7 } }}
                    exit={{ opacity: 0, y: -16, scale: 0.97, transition: EXIT }}
                  >
                    <NotificationCard title={DOSE.title} body={DOSE.body} />
                  </motion.div>
                )}
              </AnimatePresence>
            </HomeScreen>
          </Phone>
        </div>
      </div>
    </MotionConfig>
  );
}
