import { LOGO_ICON_D, LOGO_TEXT_D } from "./logoPaths";
import Clico from "./Clico";
import "./intro.css";

// /lp18 conta a história da Click numa tela só, em sequência contínua:
//   logo → Clico dá tchau + frase → "mais de 100 mil" → marcos da história
//   em fotos ("desde 2023 fazendo história") → tela branca, onde entra o funil
//   (ver Lp18Shell).
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
// Sem `story`, a cena das fotos não aparece e a tela branca do funil abre logo
// depois do "100 mil" (é assim na /lp18 por enquanto).

export type StatVariant = "a" | "b" | "c" | "d";
export type StoryVariant = "1" | "2" | "3" | "4";

const HEADLINE = "O maior ecossistema de cannabis medicinal da América Latina";
const ACCENT_FROM = HEADLINE.split(" ").indexOf("América");
// Cada coluna do "100" é uma tira de dígitos que rola e para no último.
const STAT_COLUMNS = ["3581", "246970", "13572580"];
// Cena do "+1 milhão no Instagram": escondida por enquanto. Pra voltar, troque
// pra true e aponte o --t-end das regras de fim pra var(--t-ig-exit).
const MOSTRAR_INSTAGRAM = false;

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
    <div className="lp18-full" style={{ "--photo-count": PHOTOS.length } as React.CSSProperties}>
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
  story,
}: {
  stat?: StatVariant;
  story?: StoryVariant;
}) {
  return (
    <>
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
      {MOSTRAR_INSTAGRAM && (
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
      )}

      <div className="lp18-end" aria-hidden="true" />
    </>
  );
}
