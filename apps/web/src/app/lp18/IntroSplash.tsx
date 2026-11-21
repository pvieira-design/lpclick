import { LOGO_ICON_D, LOGO_TEXT_D } from "./logoPaths";
import AnswerButtons from "./AnswerButtons";
import Clico from "./Clico";

// /lp18 conta a história da Click numa tela só, em sequência contínua:
//   logo → Clico dá tchau + frase → "mais de 100 mil" → marcos da história
//   em fotos ("desde 2023 fazendo história") → Instagram → pergunta.
//
// Cores e tipografia seguem o aidesignclick (brand/tokens.json, modo escuro):
// fundo chapado floresta-800, texto quase-branco, destaque lima-300, Lexend
// nos títulos e Inter no corpo.
//
// A sequência é 100% CSS e renderizada no servidor: começa no primeiro paint,
// sem esperar hidratação nem JS. Só transform/opacity/clip-path (compositor).
// Os tempos de cada cena ficam nas variáveis --t-* abaixo.
//
// O ato do "100 mil" tem 3 versões em validação (prop `stat`, ?v=a|b|c):
//   a = rolo de dígitos + anéis · b = fundo troca num flash
//   c = a frase vai se completando e o fundo troca de cor a cada pedaço (corte seco)
//   d = igual à c, mas cada cor nova abre em onda a partir do centro
// "Nossa história" tem 4 jeitos de a foto aparecer (prop `story`, ?h=1|2|3|4):
//   1 = baralho · 2 = tela cheia · 3 = carrossel · 4 = polaroids

export type StatVariant = "a" | "b" | "c" | "d";
export type StoryVariant = "1" | "2" | "3" | "4";

const HEADLINE = "O maior ecossistema de cannabis medicinal da América Latina";
const ACCENT_FROM = HEADLINE.split(" ").indexOf("América");
// Cada coluna do "100" é uma tira de dígitos que rola e para no último.
const STAT_COLUMNS = ["3581", "246970", "13572580"];
const QUESTION = "Você já teve contato prévio com esse novo tipo de tratamento?";

// Marcos da história. As fotos ainda são retângulos de marcação.
const MOMENTS = ["Click Runner", "Limpeza de praia", "Carnaval"];
// Fotos de "Nossa história": na versão tela cheia passam todas, uma atrás da
// outra (esportes → praia → pessoas → limpeza de praia). Pra acrescentar foto,
// ponha o arquivo em public/lp18 como foto-NN.webp e aumente PHOTO_COUNT; a
// duração da cena se ajusta sozinha.
const PHOTO_COUNT = 18;
// Cada foto existe em 720px e em 1080px (foto-NN-1080.webp): o navegador pega
// a maior só em tela de alta densidade, pra ficar nítida sem pesar nas outras.
const PHOTOS = Array.from(
  { length: PHOTO_COUNT },
  (_, n) => `/lp18/foto-${String(n + 1).padStart(2, "0")}`,
);

const i = (n: number) => ({ "--i": n }) as React.CSSProperties;

function Words({ text, accentFrom = Infinity }: { text: string; accentFrom?: number }) {
  const words = text.split(" ");
  return (
    <>
      {words.map((word, n) => (
        <span key={n}>
          <span className="lp18-word">
            <span className={n >= accentFrom ? "lp18-accent" : undefined} style={i(n)}>
              {word}
            </span>
          </span>
          {n < words.length - 1 ? " " : null}
        </span>
      ))}
    </>
  );
}

function StatRoll() {
  return (
    <div className="lp18-stat" aria-hidden="true">
      <p className="lp18-kicker">Mais de</p>
      <div className="lp18-stat-stage">
        <span className="lp18-ring" style={i(0)} />
        <span className="lp18-ring" style={i(1)} />
        <p className="lp18-stat-big">
          {STAT_COLUMNS.map((digits, n) => (
            <span key={n} className="lp18-col">
              <span className="lp18-strip" style={i(n)}>
                {digits.split("").map((d, j) => (
                  <span key={j}>{d}</span>
                ))}
              </span>
            </span>
          ))}
          <span className="lp18-mil">mil</span>
        </p>
      </div>
      <p className="lp18-stat-label">pacientes atendidos</p>
    </div>
  );
}

function StatFlash() {
  return (
    <div className="lp18-flash" aria-hidden="true">
      <div>
        <p className="lp18-flash-kicker">Mais de</p>
        <p className="lp18-flash-big">
          {"100".split("").map((d, n) => (
            <span key={n} className="lp18-word">
              <span style={i(n)}>{d}</span>
            </span>
          ))}
          <span className="lp18-word lp18-flash-mil">
            <span style={i(3)}>mil</span>
          </span>
        </p>
        <p className="lp18-flash-label">pacientes atendidos</p>
      </div>
    </div>
  );
}

// "Mais de" → "100" → "mil" → "pacientes atendidos": cada pedaço entra, o
// fundo troca de cor e nada some; o bloco se mantém centralizado enquanto cresce.
function StatBuild({ wave = false }: { wave?: boolean }) {
  return (
    <div className={`lp18-build${wave ? " lp18-build-wave" : ""}`} aria-hidden="true">
      {[1, 2, 3, 4].map((n) => (
        <div key={n} className={`lp18-bg lp18-bg-${n}`} />
      ))}
      <div className="lp18-build-a">
        <div className="lp18-build-b">
          <div className="lp18-build-c">
            <div className="lp18-b-mais">Mais de</div>
            <div className="lp18-b-100">100</div>
            <div className="lp18-b-mask lp18-b-mask-mil">
              <div className="lp18-b-mil">mil</div>
            </div>
            <div className="lp18-b-mask lp18-b-mask-pac">
              <div className="lp18-b-pac">pacientes atendidos</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Captions() {
  return (
    <div className="lp18-captions">
      {MOMENTS.map((title, n) => (
        <p key={n} className={`lp18-caption lp18-caption-${n + 1}`}>
          {title}
        </p>
      ))}
    </div>
  );
}

// 1 · Baralho: as fotos entram pelos lados e empilham.
function StoryDeck() {
  return (
    <div className="lp18-scene lp18-moments">
      <p className="lp18-kicker">Nossa história</p>
      <div className="lp18-deck" aria-hidden="true">
        {MOMENTS.map((_, n) => (
          <div key={n} className={`lp18-ph lp18-ph-${n + 1} lp18-card lp18-card-${n + 1}`}>
            Foto
          </div>
        ))}
      </div>
      <Captions />
    </div>
  );
}

// 2 · Tela cheia: as fotos passam em sequência rápida, uma atrás da outra,
// entrando alternadamente por baixo e pelo lado, com zoom lento. O título fica fixo.
function StoryFull() {
  return (
    <div className="lp18-full">
      <div aria-hidden="true">
        {PHOTOS.map((src, n) => (
          <div
            key={src}
            className={`lp18-full-slide${n % 2 ? " lp18-full-side" : ""}${
              n === PHOTOS.length - 1 ? " lp18-full-last" : ""
            }`}
            style={{ "--at": `calc(var(--t-m1) + ${n} * var(--photo-step))` } as React.CSSProperties}
          >
            {/* prioridade baixa: só entram em cena segundos depois, não disputam o primeiro paint */}
            <img
              className="lp18-full-img"
              src={`${src}.webp`}
              srcSet={`${src}.webp 720w, ${src}-1080.webp 1080w`}
              sizes="100vw"
              alt=""
              decoding="async"
              fetchPriority="low"
            />
          </div>
        ))}
      </div>
      <div className="lp18-full-scrim" />
      <p className="lp18-full-title">
        Desde <span className="lp18-accent">2023</span>
        <br />
        fazendo história
      </p>
    </div>
  );
}

// 3 · Carrossel: uma fita de fotos que desliza; a do centro cresce.
function StoryCarousel() {
  return (
    <div className="lp18-scene lp18-moments lp18-carousel">
      <p className="lp18-kicker">Nossa história</p>
      <div className="lp18-track-in" aria-hidden="true">
        <div className="lp18-track-a">
          <div className="lp18-track-b">
            {MOMENTS.map((_, n) => (
              <div key={n} className={`lp18-ph lp18-ph-${n + 1} lp18-slide lp18-slide-${n + 1}`}>
                Foto
              </div>
            ))}
          </div>
        </div>
      </div>
      <Captions />
    </div>
  );
}

// 4 · Polaroids: as fotos caem espalhadas, uma por vez, e ficam as três.
function StoryPolaroids() {
  return (
    <div className="lp18-scene lp18-moments lp18-polaroids">
      <p className="lp18-kicker">Nossa história</p>
      <div className="lp18-pile">
        {MOMENTS.map((title, n) => (
          <figure key={n} className={`lp18-polaroid lp18-polaroid-${n + 1} lp18-at-${n + 1}`}>
            <div className={`lp18-ph lp18-ph-${n + 1}`} aria-hidden="true">
              Foto
            </div>
            <figcaption>{title}</figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}

export default function IntroSplash({
  stat = "a",
  story = "1",
}: {
  stat?: StatVariant;
  story?: StoryVariant;
}) {
  return (
    <>
      <style>{`
        .lp18 {
          --ease-out: cubic-bezier(0.23, 1, 0.32, 1);
          --ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);
          --display: var(--font-display), var(--font-geist-sans), system-ui, sans-serif;

          /* aidesignclick · brand/tokens.json */
          --floresta-950: #041B14;
          --floresta-800: #10392D;
          --floresta-700: #214C3E;
          --floresta-500: #3F6B5C;
          --floresta-200: #ABCDC0;
          --verde-700: #32733B;
          --verde-600: #148421;
          --verde-500: #00A819;
          --lima-300: #B6EF48;
          --amarelo-300: #EDD94A;
          --quase-branco: #FBFCF9;

          /* tempo a mais que a versão escolhida do "100 mil" ocupa; empurra o resto */
          --stat-extra: 0ms;
          /* ajuste de duração da cena de fotos (versão tela cheia) */
          --m2-extra: 0ms;
          --t-shift: 500ms;        /* símbolo vai pro lugar + letras aparecem */
          --t-lift: 1150ms;        /* logo sobe pro topo */
          --t-clico: 1450ms;       /* Clico entra */
          --t-words: 1650ms;       /* frase começa */
          --t-wave: 1950ms;        /* Clico dá tchau */
          --t-exit: 3500ms;        /* frase + Clico saem */
          --t-stat: 3700ms;        /* "mais de 100 mil" entra */
          --t-land: 4920ms;        /* (versão a) último dígito trava */
          --t-stat-exit: calc(5650ms + var(--stat-extra)); 
          --t-m1: calc(5850ms + var(--stat-extra)); /* marco 1 */
          --t-m2: calc(7050ms + var(--stat-extra)); /* marco 2 */
          --t-m3: calc(8250ms + var(--stat-extra) + var(--m2-extra)); /* marco 3 */
          --t-m-exit: calc(9450ms + var(--stat-extra) + var(--m2-extra)); 
          --t-ig: calc(9650ms + var(--stat-extra) + var(--m2-extra)); /* Instagram */
          --t-ig-exit: calc(10900ms + var(--stat-extra) + var(--m2-extra)); 
          --t-question: calc(11100ms + var(--stat-extra) + var(--m2-extra)); /* pergunta entra */
          --t-buttons: calc(11550ms + var(--stat-extra) + var(--m2-extra)); /* Sim / Não */

          position: relative;
          min-height: 100svh;
          overflow: hidden;
          isolation: isolate;
          font-family: var(--font-body), var(--font-geist-sans), system-ui, sans-serif;
          color: var(--quase-branco);
          background: var(--floresta-800); /* fundo chapado, como pede a marca */
        }

        /* ───────── Logo: nasce no centro da tela (236×34) e sobe pro topo ───────── */
        .lp18-logo {
          position: absolute;
          top: 50%;
          left: 50%;
          display: flex;
          gap: 8px;
          width: 236px;
          height: 34px;
          margin: -17px 0 0 -118px;
          z-index: 1; /* fica por cima das fotos em tela cheia */
          will-change: transform;
          animation: lp18-lift 600ms var(--ease-in-out) var(--t-lift) forwards;
        }
        .lp18-logo svg { display: block; height: 34px; width: auto; }
        /* Símbolo: nasce no centro, maior, e depois desliza pro lugar */
        .lp18-icon-shift {
          animation: lp18-icon-shift 650ms var(--ease-in-out) var(--t-shift) backwards;
        }
        .lp18-icon-pop {
          display: block;
          animation: lp18-icon-pop 500ms cubic-bezier(0.34, 1.4, 0.64, 1) backwards;
        }
        /* Letras: wipe da esquerda pra direita */
        .lp18-wordmark {
          clip-path: inset(0 0 0 0);
          animation: lp18-wipe 600ms var(--ease-in-out) calc(var(--t-shift) + 180ms) backwards;
        }

        /* ───────── Cenas: todas ocupam o mesmo lugar, abaixo do logo ───────── */
        .lp18-copy,
        .lp18-stat,
        .lp18-scene,
        .lp18-ask {
          position: absolute;
          top: calc(50% - 80px);
          left: 0;
          right: 0;
          padding: 0 24px;
          text-align: center;
        }
        /* Saídas discretas e mais rápidas que as entradas */
        .lp18-copy {
          top: calc(50% - 150px);
          animation: lp18-out 260ms ease-in var(--t-exit) forwards;
        }
        /* Clico: entra com um pulinho e dá tchau com o braço direito */
        .lp18-clico {
          display: block;
          width: 132px;
          height: 132px;
          margin: 0 auto 14px;
          animation: lp18-clico-in 700ms cubic-bezier(0.34, 1.4, 0.64, 1) var(--t-clico) backwards;
        }
        .lp18-clico-arm {
          transform-origin: 0 0;
          animation: lp18-wave 1300ms var(--ease-in-out) var(--t-wave);
        }
        .lp18-headline,
        .lp18-question {
          margin: 0 auto;
          font-family: var(--display);
          font-weight: 500;
          line-height: 1.12;
          letter-spacing: -0.025em;
          text-wrap: balance;
        }
        .lp18-headline { max-width: 17ch; font-size: clamp(1.75rem, 6.4vw, 3.25rem); }
        .lp18-question { max-width: 19ch; font-size: clamp(1.625rem, 5.8vw, 2.75rem); }

        /* Palavra subindo de dentro de uma máscara */
        .lp18-word {
          display: inline-block;
          overflow: hidden;
          vertical-align: top;
          padding-bottom: 0.14em;
          margin-bottom: -0.14em;
        }
        .lp18-word > span {
          display: inline-block;
          animation: lp18-word 650ms var(--ease-out) calc(var(--t-words) + var(--i) * 55ms) backwards;
        }
        .lp18-question .lp18-word > span {
          animation-delay: calc(var(--t-question) + var(--i) * 40ms);
        }
        .lp18-accent { color: var(--lima-300); }

        .lp18-kicker {
          margin: 0 0 10px;
          font-size: clamp(0.75rem, 3.2vw, 0.9375rem);
          font-weight: 600;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--lima-300);
          animation: lp18-rise 600ms var(--ease-out) var(--t-scene, var(--t-stat)) backwards;
        }

        /* ───────── 100 mil · versão A: rolo de dígitos + anéis ─────────
           As três colunas existem desde o início, então o bloco já nasce
           centralizado e não anda enquanto os dígitos giram. */
        .lp18-stat-label {
          margin: 10px 0 0;
          font-size: clamp(1.125rem, 4.8vw, 1.625rem);
          color: var(--floresta-200);
          animation: lp18-rise 600ms var(--ease-out) calc(var(--t-stat) + 260ms) backwards;
        }
        .lp18-stat-stage { position: relative; display: inline-block; }
        .lp18-stat-big {
          position: relative;
          margin: 0;
          font-family: var(--display);
          font-size: clamp(4.5rem, 22vw, 9rem);
          font-weight: 600;
          line-height: 1.08;
          letter-spacing: -0.04em;
          white-space: nowrap;
          font-variant-numeric: tabular-nums;
          animation: lp18-punch 520ms var(--ease-in-out) var(--t-land);
        }
        .lp18-col {
          display: inline-block;
          height: 1.08em;
          overflow: hidden;
          vertical-align: top;
        }
        .lp18-strip {
          display: flex;
          flex-direction: column;
          transform: translateY(calc(-100% + 1.08em));
          will-change: transform;
          animation: lp18-roll calc(820ms + var(--i) * 200ms) cubic-bezier(0.16, 1, 0.3, 1) var(--t-stat) backwards;
        }
        .lp18-strip > span { height: 1.08em; }
        .lp18-mil {
          display: inline-block;
          margin-left: 0.18em;
          color: var(--lima-300);
          animation: lp18-mil 700ms var(--ease-out) calc(var(--t-stat) + 420ms) backwards;
        }
        .lp18-ring {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 62vmin;
          height: 62vmin;
          max-width: 420px;
          max-height: 420px;
          translate: -50% -50%;
          border: 1.5px solid var(--lima-300);
          border-radius: 50%;
          opacity: 0;
          pointer-events: none;
          animation: lp18-ring 1100ms cubic-bezier(0.215, 0.61, 0.355, 1) calc(var(--t-land) + var(--i) * 170ms);
        }

        /* ───────── Flash (100 mil · versão B, e Instagram): o fundo troca de repente ─────────
           Um círculo verde-lima abre do centro e toma a tela inteira; no
           fim a tela sobe como cortina e devolve o fundo escuro. */
        .lp18-flash {
          --t-in: var(--t-stat);
          --t-out: var(--t-stat-exit);
          position: absolute;
          inset: 0;
          z-index: 2;
          display: grid;
          place-items: center;
          padding: 0 20px;
          text-align: center;
          color: var(--floresta-800);
          background: var(--lima-300);
          clip-path: circle(0% at 50% 46%);
          will-change: transform, clip-path;
          animation:
            lp18-flash-in 520ms var(--ease-out) var(--t-in) forwards,
            lp18-curtain 420ms var(--ease-in-out) var(--t-out) forwards;
        }
        .lp18-flash-kicker,
        .lp18-flash-label {
          margin: 0;
          font-weight: 600;
          animation: lp18-rise 500ms var(--ease-out) calc(var(--t-in) + 200ms) backwards;
        }
        .lp18-flash-kicker {
          font-size: clamp(0.8125rem, 3.4vw, 1rem);
          letter-spacing: 0.22em;
          text-transform: uppercase;
        }
        .lp18-flash-label {
          margin-top: 12px;
          font-size: clamp(1.25rem, 5.4vw, 1.875rem);
          animation-delay: calc(var(--t-in) + 620ms);
        }
        .lp18-flash-big {
          --t-words: calc(var(--t-in) + 160ms);
          margin: 4px 0 0;
          font-family: var(--display);
          font-size: clamp(5rem, 25vw, 10rem);
          font-weight: 600;
          line-height: 1;
          letter-spacing: -0.045em;
          white-space: nowrap;
        }
        .lp18-flash-mil { margin-left: 0.16em; color: var(--verde-700); }
        .lp18-flash-ig { --t-in: var(--t-ig); --t-out: var(--t-ig-exit); }
        .lp18-flash-ig .lp18-flash-big { font-size: clamp(3.5rem, 17vw, 7rem); }

        /* ───────── 100 mil · versões C e D: a frase se completa, o fundo troca ─────────
           O bloco já está montado inteiro; ele começa deslocado pra baixo pela
           metade da altura do que ainda não apareceu (assim o que está visível
           fica no centro) e sobe um degrau a cada pedaço que entra. */
        .lp18:has(.lp18-build) { --stat-extra: 1350ms; } /* dura 3300ms; a janela padrão é 1950ms */
        .lp18-build {
          --u: min(1vw, 0.62svh);
          --h-100: calc(var(--u) * 41);
          --h-mil: calc(var(--u) * 32);
          --h-pac: calc(var(--u) * 15);
          --t2: calc(var(--t-stat) + 500ms);   /* "100" */
          --t3: calc(var(--t-stat) + 1100ms);  /* "mil" */
          --t4: calc(var(--t-stat) + 1800ms);  /* "pacientes atendidos" */
          position: absolute;
          inset: 0;
          z-index: 2;
          display: grid;
          place-items: center;
          text-align: center;
          font-family: var(--display);
          font-weight: 600;
          letter-spacing: -0.045em;
          white-space: nowrap;
          color: var(--floresta-800);
          /* no último fundo (verde escuro) o texto vira claro e o "mil" vira lima */
          animation:
            lp18-on 1ms steps(1) var(--t-stat) backwards,
            lp18-ink 1ms steps(1) var(--t4) forwards,
            lp18-fade-out 320ms ease-in var(--t-stat-exit) forwards;
        }
        .lp18-build-wave {
          animation:
            lp18-on 1ms steps(1) var(--t-stat) backwards,
            lp18-ink 260ms linear calc(var(--t4) + 60ms) forwards,
            lp18-fade-out 320ms ease-in var(--t-stat-exit) forwards;
        }
        .lp18-bg { position: absolute; inset: 0; animation: lp18-on 1ms steps(1) var(--at) backwards; }
        .lp18-bg-1 { --at: var(--t-stat); background: var(--quase-branco); }
        .lp18-bg-2 { --at: var(--t2);     background: var(--amarelo-300); }
        .lp18-bg-3 { --at: var(--t3);     background: var(--lima-300); }
        .lp18-bg-4 { --at: var(--t4);     background: var(--floresta-800); }
        /* versão D: a cor nova abre em onda a partir do centro */
        .lp18-build-wave .lp18-bg {
          clip-path: circle(150% at 50% 50%);
          animation: lp18-wave-bg 650ms var(--ease-out) var(--at) backwards;
        }

        .lp18-build-a, .lp18-build-b, .lp18-build-c { position: relative; will-change: transform; }
        .lp18-build-a { animation: lp18-up-100 480ms var(--ease-out) var(--t2) backwards; }
        .lp18-build-b { animation: lp18-up-mil 620ms var(--ease-in-out) var(--t3) backwards; }
        .lp18-build-c { animation: lp18-up-pac 620ms var(--ease-in-out) var(--t4) backwards; }

        .lp18-b-mais {
          font-size: calc(var(--u) * 9);
          line-height: calc(var(--u) * 13);
          letter-spacing: -0.02em;
          animation: lp18-appear 450ms var(--ease-out) var(--t-stat) backwards;
        }
        .lp18-b-100 {
          font-size: calc(var(--u) * 46);
          line-height: var(--h-100);
          animation: lp18-appear 480ms var(--ease-out) var(--t2) backwards;
        }
        .lp18-b-mask { overflow: hidden; }
        .lp18-b-mask-mil { height: var(--h-mil); }
        .lp18-b-mask-pac { height: var(--h-pac); }
        /* o "mil" sai de trás do "100", pra baixo */
        .lp18-b-mil {
          font-size: calc(var(--u) * 34);
          line-height: var(--h-mil);
          animation:
            lp18-from-above 620ms var(--ease-in-out) var(--t3) backwards,
            lp18-ink-lima 1ms steps(1) var(--t4) forwards;
        }
        .lp18-b-pac {
          font-size: calc(var(--u) * 7.6);
          line-height: var(--h-pac);
          letter-spacing: -0.02em;
          animation: lp18-from-above 620ms var(--ease-in-out) var(--t4) backwards;
        }

        /* ───────── Momentos: baralho de fotos ───────── */
        .lp18-deck {
          position: relative;
          width: min(58vw, 250px);
          aspect-ratio: 4 / 5;
          margin: 30px auto 0;
        }
        /* Retângulo de marcação no lugar da foto */
        .lp18-ph {
          display: grid;
          place-items: center;
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--floresta-200);
        }
        .lp18-ph-1 { background: var(--floresta-700); }
        .lp18-ph-2 {
          background: var(--verde-700) url(/lp18/foto-15.webp) center / cover;
          color: transparent;
        }
        .lp18-ph-3 { background: var(--verde-600); }
        .lp18-at-1 { --at: var(--t-m1); }
        .lp18-at-2 { --at: var(--t-m2); }
        .lp18-at-3 { --at: var(--t-m3); }

        /* 1 · Baralho */
        .lp18-card {
          position: absolute;
          inset: 0;
          border-radius: 20px;
          border: 1px solid var(--floresta-500);
          /* sombra em camadas, no verde escuro (nunca preto) */
          box-shadow:
            0 1px 2px rgb(4 27 20 / .2),
            0 6px 14px -4px rgb(4 27 20 / .3),
            0 18px 36px -12px rgb(4 27 20 / .4);
          transform: rotate(var(--r));
          will-change: transform;
          animation: lp18-card 800ms var(--ease-out) var(--at) backwards;
        }
        .lp18-card-1 { --r: -4deg; --from: -70%, 48px; --at: var(--t-m1); }
        .lp18-card-2 { --r: 3deg;  --from: 70%, 48px;  --at: var(--t-m2); }
        .lp18-card-3 { --r: -1deg; --from: 0%, 90px;   --at: var(--t-m3); }

        /* 2 · Tela cheia. A cena dura (nº de fotos × --photo-step) + uma pausa na
           última, em vez dos 3600ms das versões por marco; a diferença empurra
           o resto da história. */
        .lp18 { --photo-step: 400ms; --photo-hold: 700ms; }
        .lp18:has(.lp18-full) {
          --m2-extra: calc(${PHOTOS.length} * var(--photo-step) + var(--photo-hold) - 3600ms);
        }
        .lp18-full {
          position: absolute;
          inset: 0;
          animation: lp18-fade-out 320ms ease-in var(--t-m-exit) forwards;
        }
        /* Cada foto some assim que a 2ª seguinte já a cobriu por inteiro: só 2 ou
           3 ficam vivas por vez, o que poupa memória de vídeo em celular. */
        .lp18-full-slide {
          position: absolute;
          inset: 0;
          background: var(--floresta-700); /* aparece se a foto ainda não carregou */
          clip-path: inset(0 0 0 0);
          animation:
            lp18-blind 340ms var(--ease-in-out) var(--at) backwards,
            lp18-off 1ms steps(1) calc(var(--at) + 3 * var(--photo-step)) forwards;
        }
        .lp18-full-side { animation-name: lp18-blind-side, lp18-off; }
        .lp18-full-last { animation-name: lp18-blind-side, none; }
        .lp18-full-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          animation: lp18-zoom 1400ms var(--ease-out) var(--at) backwards;
        }
        /* véu no verde escuro: garante leitura do logo em cima e do título embaixo */
        .lp18-full-scrim {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            rgb(16 57 45 / .85) 0%,
            rgb(16 57 45 / 0) 26%,
            rgb(16 57 45 / 0) 48%,
            rgb(16 57 45 / .92) 82%
          );
          animation: lp18-fade-in 500ms ease-out var(--t-m1) backwards;
        }
        .lp18-full-title {
          position: absolute;
          left: 24px;
          right: 24px;
          bottom: calc(132px + env(safe-area-inset-bottom));
          margin: 0;
          font-family: var(--display);
          font-size: clamp(2.25rem, 10.5vw, 4rem);
          font-weight: 600;
          line-height: 1.02;
          letter-spacing: -0.035em;
          animation: lp18-rise 600ms var(--ease-out) calc(var(--t-m1) + 300ms) backwards;
        }

        /* 3 · Carrossel */
        .lp18-carousel {
          --card: min(64vw, 270px);
          --step: calc(var(--card) + 14px);
          padding: 0;
        }
        .lp18-track-in {
          margin-top: 30px;
          animation: lp18-track-in 800ms var(--ease-out) var(--t-m1) backwards;
        }
        .lp18-track-a { animation: lp18-step 750ms var(--ease-in-out) var(--t-m2) forwards; }
        .lp18-track-b {
          display: flex;
          gap: 14px;
          padding-left: calc(50% - var(--card) / 2);
          animation: lp18-step 750ms var(--ease-in-out) var(--t-m3) forwards;
        }
        .lp18-slide {
          flex: none;
          width: var(--card);
          aspect-ratio: 2 / 3;
          border-radius: 20px;
          border: 1px solid var(--floresta-500);
          scale: 0.86;
          opacity: 0.45;
          will-change: scale, opacity;
        }
        .lp18-slide-1 { animation: lp18-focus 1650ms var(--ease-in-out) calc(var(--t-m1) - 150ms); }
        .lp18-slide-2 { animation: lp18-focus 1650ms var(--ease-in-out) calc(var(--t-m2) - 150ms); }
        .lp18-slide-3 { animation: lp18-focus-in 600ms var(--ease-in-out) var(--t-m3) forwards; }

        /* 4 · Polaroids */
        .lp18-pile {
          position: relative;
          width: min(86vw, 340px);
          height: min(104vw, 410px);
          margin: 26px auto 0;
        }
        .lp18-polaroid {
          position: absolute;
          margin: 0;
          padding: 8px 8px 0;
          border-radius: 6px;
          background: var(--quase-branco);
          color: var(--floresta-800);
          box-shadow:
            0 1px 2px rgb(4 27 20 / .2),
            0 6px 14px -4px rgb(4 27 20 / .3),
            0 18px 36px -12px rgb(4 27 20 / .4);
          transform: rotate(var(--r));
          will-change: transform;
          animation: lp18-drop 620ms var(--ease-out) var(--at) backwards;
        }
        .lp18-polaroid .lp18-ph { aspect-ratio: 1; border-radius: 2px; }
        .lp18-polaroid figcaption {
          padding: 8px 0 10px;
          font-family: var(--display);
          font-size: 0.875rem;
          font-weight: 500;
        }
        .lp18-polaroid-1 { --r: -6deg; top: 0;   left: 0;  width: 50%; }
        .lp18-polaroid-2 { --r: 5deg;  top: 9%;  right: 0; width: 50%; }
        .lp18-polaroid-3 { --r: -2deg; top: 53%; left: 1%; width: 50%; }

        .lp18-captions { display: grid; margin-top: 30px; }
        .lp18-caption {
          grid-area: 1 / 1;
          margin: 0;
          font-family: var(--display);
          font-size: clamp(1.375rem, 5.6vw, 2rem);
          font-weight: 500;
          letter-spacing: -0.02em;
        }
        .lp18-caption-1 {
          animation:
            lp18-rise 600ms var(--ease-out) calc(var(--t-m1) + 250ms) backwards,
            lp18-out 220ms ease-in var(--t-m2) forwards;
        }
        .lp18-caption-2 {
          animation:
            lp18-rise 600ms var(--ease-out) calc(var(--t-m2) + 250ms) backwards,
            lp18-out 220ms ease-in var(--t-m3) forwards;
        }
        .lp18-caption-3 {
          animation: lp18-rise 600ms var(--ease-out) calc(var(--t-m3) + 250ms) backwards;
        }

        /* ───────── Pergunta ───────── */
        .lp18-answers {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          max-width: 360px;
          margin: 28px auto 0;
        }
        .lp18-answer {
          min-height: 56px;
          border-radius: 14px;
          border: 1.5px solid var(--floresta-500);
          background: var(--floresta-700);
          color: var(--quase-branco);
          font-family: inherit;
          font-size: 1.0625rem;
          font-weight: 600;
          cursor: pointer;
          -webkit-tap-highlight-color: transparent;
          touch-action: manipulation;
          animation: lp18-rise 550ms var(--ease-out) calc(var(--t-buttons) + var(--i) * 80ms) backwards;
          transition:
            scale 150ms ease-out,
            background-color 150ms ease,
            border-color 150ms ease,
            color 150ms ease;
        }
        .lp18-answer:active { scale: 0.97; }
        .lp18-answer:focus-visible { outline: 2px solid var(--lima-300); outline-offset: 3px; }
        .lp18-answer[aria-pressed="true"] {
          background: var(--lima-300);
          border-color: var(--lima-300);
          color: var(--floresta-800);
        }
        @media (hover: hover) and (pointer: fine) {
          .lp18-answer:not([aria-pressed="true"]):hover {
            border-color: var(--lima-300);
          }
        }

        /* ───────── Pular: checkbox + :has(), funciona sem JS ───────── */
        .lp18-skip-input { position: absolute; opacity: 0; pointer-events: none; }
        .lp18-skip {
          position: absolute;
          z-index: 3;
          left: 50%;
          bottom: calc(20px + env(safe-area-inset-bottom));
          translate: -50% 0;
          padding: 12px 20px;
          border-radius: 999px;
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--floresta-200);
          background: var(--floresta-700);
          cursor: pointer;
          -webkit-tap-highlight-color: transparent;
          animation:
            lp18-rise 500ms var(--ease-out) 1600ms backwards,
            lp18-out 200ms ease-in var(--t-ig-exit) forwards;
        }
        .lp18-skip-input:focus-visible + .lp18-skip { outline: 2px solid var(--lima-300); outline-offset: 3px; }

        @keyframes lp18-icon-pop { from { opacity: 0; transform: scale(0.6) rotate(-90deg); } }
        @keyframes lp18-icon-shift { from { transform: translateX(101px) scale(1.5); } }
        @keyframes lp18-wipe { from { clip-path: inset(0 100% 0 0); transform: translateX(-16px); } }
        @keyframes lp18-lift { to { transform: translateY(calc(-50svh + 52px)) scale(0.86); } }
        @keyframes lp18-word { from { opacity: 0; transform: translateY(105%); } }
        @keyframes lp18-rise { from { opacity: 0; transform: translateY(12px); } }
        @keyframes lp18-out { to { opacity: 0; transform: translateY(-12px); visibility: hidden; } }
        @keyframes lp18-roll { from { transform: translateY(1.08em); } }
        @keyframes lp18-mil { from { opacity: 0; transform: translateX(-0.25em); } }
        @keyframes lp18-punch { 40% { scale: 1.06; } }
        @keyframes lp18-ring {
          0% { opacity: 0; transform: scale(0.45); }
          15% { opacity: 0.6; }
          100% { opacity: 0; transform: scale(1.7); }
        }
        @keyframes lp18-flash-in { to { clip-path: circle(150% at 50% 46%); } }
        @keyframes lp18-curtain { to { transform: translateY(-100%); visibility: hidden; } }
        @keyframes lp18-on { from { opacity: 0; } }
        @keyframes lp18-ink { to { color: var(--quase-branco); } }
        @keyframes lp18-ink-lima { to { color: var(--lima-300); } }
        @keyframes lp18-appear {
          0% { opacity: 0; transform: scale(1.22); }
          14% { opacity: 1; }
        }
        @keyframes lp18-from-above { from { transform: translateY(-105%); } }
        @keyframes lp18-up-100 { from { transform: translateY(calc(var(--h-100) / 2)); } }
        @keyframes lp18-up-mil { from { transform: translateY(calc(var(--h-mil) / 2)); } }
        @keyframes lp18-up-pac { from { transform: translateY(calc(var(--h-pac) / 2)); } }
        @keyframes lp18-wave-bg { from { clip-path: circle(0% at 50% 50%); } }
        @keyframes lp18-card {
          from {
            opacity: 0;
            transform: translate(var(--from)) rotate(calc(var(--r) * 5)) scale(0.9);
          }
        }
        @keyframes lp18-fade-in { from { opacity: 0; } }
        @keyframes lp18-fade-out { to { opacity: 0; visibility: hidden; } }
        @keyframes lp18-off { to { visibility: hidden; } }
        @keyframes lp18-blind { from { clip-path: inset(100% 0 0 0); } }
        @keyframes lp18-blind-side { from { clip-path: inset(0 0 0 100%); } }
        @keyframes lp18-zoom { from { transform: scale(1.18); } }
        @keyframes lp18-track-in { from { opacity: 0; transform: translateX(45%); } }
        @keyframes lp18-step { to { transform: translateX(calc(var(--step) * -1)); } }
        @keyframes lp18-focus {
          18%, 82% { scale: 1; opacity: 1; }
        }
        @keyframes lp18-focus-in { to { scale: 1; opacity: 1; } }
        @keyframes lp18-drop {
          from { opacity: 0; transform: rotate(calc(var(--r) * 3)) scale(1.4); }
        }
        @keyframes lp18-clico-in {
          from { opacity: 0; transform: translateY(26px) scale(0.85) rotate(-10deg); }
        }
        @keyframes lp18-wave {
          0%, 100% { transform: rotate(0deg); }
          16%, 50%, 84% { transform: rotate(-17deg); }
          33%, 67% { transform: rotate(-3deg); }
        }

        /* Pulou: vai direto pro estado final (logo no topo + pergunta) */
        .lp18:has(.lp18-skip-input:checked) :is(.lp18-copy, .lp18-stat, .lp18-flash, .lp18-build, .lp18-scene, .lp18-full, .lp18-skip) {
          display: none;
        }
        .lp18:has(.lp18-skip-input:checked) :is(.lp18-logo, .lp18-icon-shift, .lp18-icon-pop, .lp18-wordmark, .lp18-question .lp18-word > span, .lp18-answer) {
          animation: none;
        }
        .lp18:has(.lp18-skip-input:checked) .lp18-logo { transform: translateY(calc(-50svh + 52px)) scale(0.86); }
        .lp18:has(.lp18-skip-input:checked) .lp18-ask { animation: lp18-rise 400ms var(--ease-out); }

        /* Sem movimento: mesmo estado final, sem nenhuma animação */
        @media (prefers-reduced-motion: reduce) {
          .lp18-logo,
          .lp18-icon-shift,
          .lp18-icon-pop,
          .lp18-wordmark,
          .lp18-question .lp18-word > span,
          .lp18-answer {
            animation: none;
          }
          .lp18-answer { transition: none; }
          .lp18-logo { transform: translateY(calc(-50svh + 52px)) scale(0.86); }
          .lp18-copy,
          .lp18-stat,
          .lp18-flash,
          .lp18-build,
          .lp18-scene,
          .lp18-full,
          .lp18-skip { display: none; }
        }
      `}</style>

      <input id="lp18-skip" type="checkbox" className="lp18-skip-input" aria-label="Pular apresentação" />
      <label htmlFor="lp18-skip" className="lp18-skip">
        Pular
      </label>

      <div className="lp18-logo" role="img" aria-label="Click Cannabis">
        <span className="lp18-icon-shift">
          <span className="lp18-icon-pop">
            <svg viewBox="0 0 61 60" aria-hidden="true">
              <path fill="#fff" d={LOGO_ICON_D} />
            </svg>
          </span>
        </span>
        <span className="lp18-wordmark">
          <svg viewBox="75 0 342 60" aria-hidden="true">
            <path fill="#fff" d={LOGO_TEXT_D} />
          </svg>
        </span>
      </div>

      <div className="lp18-copy">
        <Clico className="lp18-clico" />
        <p className="lp18-headline">
          <Words text={HEADLINE} accentFrom={ACCENT_FROM} />
        </p>
      </div>

      <p className="sr-only">Mais de 100 mil pacientes atendidos</p>
      {stat === "a" && <StatRoll />}
      {stat === "b" && <StatFlash />}
      {stat === "c" && <StatBuild />}
      {stat === "d" && <StatBuild wave />}

      {story === "1" && <StoryDeck />}
      {story === "2" && <StoryFull />}
      {story === "3" && <StoryCarousel />}
      {story === "4" && <StoryPolaroids />}

      {/* Instagram: mesma animação de flash da versão B do "100 mil" */}
      <div className="lp18-flash lp18-flash-ig">
        <div>
          <p className="lp18-flash-kicker">No Instagram</p>
          <p className="lp18-flash-big">
            <span className="lp18-word">
              <span style={i(0)}>+1</span>
            </span>
            <span className="lp18-word lp18-flash-mil">
              <span style={i(2)}>milhão</span>
            </span>
          </p>
          <p className="lp18-flash-label">de seguidores</p>
        </div>
      </div>

      <div className="lp18-ask">
        <h1 className="lp18-question">
          <Words text={QUESTION} />
        </h1>
        <AnswerButtons />
      </div>
    </>
  );
}
