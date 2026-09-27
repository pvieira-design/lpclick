import type { CSSProperties, ReactNode } from "react";
import "./phone-screens.css";

/*
 * Réplicas das telas do app nativo (apps/native) em 402×874 pt, o tamanho do iPhone 17 Pro.
 * Medidas, cores e textos copiados dos componentes reais; texto no tamanho padrão do iOS.
 * Ícones: SF Symbols da barra de abas exportados do macOS, SVGs duotone de
 * apps/native/assets/icons e Ionicons (MIT), os mesmos que o app usa.
 */

function Mask({ src, size, color, style }: { src: string; size: number; color: string; style?: CSSProperties }) {
  return (
    <span
      aria-hidden="true"
      className="ios-mask"
      style={{ width: size, height: size, backgroundColor: color, WebkitMaskImage: `url(${src})`, maskImage: `url(${src})`, ...style }}
    />
  );
}

const duo = (name: string) => `/app/icons/${name}.svg`;

function Ion({ size, color, children }: { size: number; color?: string; children: ReactNode }) {
  return (
    <svg width={size} height={size} viewBox="0 0 512 512" fill="currentColor" aria-hidden="true" style={{ color, flex: "none" }}>
      {children}
    </svg>
  );
}
const s32 = { fill: "none", stroke: "currentColor", strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 32 } as const;

const IonWater = (p: { size: number; color?: string }) => (
  <Ion {...p}>
    <path d="M400 320c0 88.37-55.63 144-144 144s-144-55.63-144-144c0-94.83 103.23-222.85 134.89-259.88a12 12 0 0118.23 0C296.77 97.15 400 225.17 400 320z" {...s32} strokeMiterlimit={10} />
    <path d="M344 328a72 72 0 01-72 72" {...s32} />
  </Ion>
);
const IonExpand = (p: { size: number; color?: string }) => (
  <Ion {...p}>
    <path d="M432 320v112H320M421.8 421.77L304 304M80 192V80h112M90.2 90.23L208 208M320 80h112v112M421.77 90.2L304 208M192 432H80V320M90.23 421.8L208 304" {...s32} />
  </Ion>
);
const IonMedical = (p: { size: number; color?: string }) => (
  <Ion {...p}>
    <path d="M429.93 174.27l-16.47-28.59a15.49 15.49 0 00-21.15-5.7l-98.39 57a4 4 0 01-6-3.5L288 80a16 16 0 00-16-16h-32a16 16 0 00-16 16l.07 113.57a4 4 0 01-6 3.5l-98.39-57a15.49 15.49 0 00-21.15 5.7l-16.46 28.6a15.42 15.42 0 005.69 21.1l98.49 57.08a4 4 0 010 6.9l-98.49 57.08a15.54 15.54 0 00-5.69 21.1l16.47 28.59a15.49 15.49 0 0021.15 5.7l98.39-57a4 4 0 016 3.5L224 432a16 16 0 0016 16h32a16 16 0 0016-16l-.07-113.67a4 4 0 016-3.5l98.39 57a15.49 15.49 0 0021.15-5.7l16.47-28.59a15.42 15.42 0 00-5.69-21.1l-98.49-57.08a4 4 0 010-6.9l98.49-57.08a15.51 15.51 0 005.68-21.11z" {...s32} />
  </Ion>
);
const IonAdd = (p: { size: number; color?: string }) => (
  <Ion {...p}>
    <path d="M256 112v288M400 256H112" {...s32} />
  </Ion>
);
export const IonCheckmark = (p: { size: number; color?: string }) => (
  <Ion {...p}>
    <path d="M416 128L192 384l-96-96" {...s32} />
  </Ion>
);
const IonAlert = (p: { size: number; color?: string }) => (
  <Ion {...p}>
    <path d="M256 80c-8.66 0-16.58 7.36-16 16l8 216a8 8 0 008 8h0a8 8 0 008-8l8-216c.58-8.64-7.34-16-16-16z" {...s32} />
    <circle cx="256" cy="416" r="16" {...s32} />
  </Ion>
);
const IonTime = (p: { size: number; color?: string }) => (
  <Ion {...p}>
    <path d="M256 64C150 64 64 150 64 256s86 192 192 192 192-86 192-192S362 64 256 64z" {...s32} strokeMiterlimit={10} />
    <path d="M256 128v144h96" {...s32} />
  </Ion>
);
const IonChevronForward = (p: { size: number; color?: string }) => (
  <Ion {...p}>
    <path d="M184 112l144 144-144 144" {...s32} strokeWidth={48} />
  </Ion>
);
const IonChevronDown = (p: { size: number; color?: string }) => (
  <Ion {...p}>
    <path d="M112 184l144 144 144-144" {...s32} strokeWidth={48} />
  </Ion>
);
const IonPerson = (p: { size: number; color?: string }) => (
  <Ion {...p}>
    <path d="M344 144c-3.92 52.87-44 96-88 96s-84.15-43.12-88-96c-4-55 35-96 88-96s92 42 88 96z" {...s32} />
    <path d="M256 304c-87 0-175.3 48-191.64 138.6C62.39 453.52 68.57 464 80 464h352c11.44 0 17.62-10.48 15.65-21.4C431.3 352 343 304 256 304z" {...s32} strokeMiterlimit={10} />
  </Ion>
);
const IonCamera = (p: { size: number; color?: string }) => (
  <Ion {...p}>
    <circle cx="256" cy="272" r="64" />
    <path d="M432 144h-59c-3 0-6.72-1.94-9.62-5l-25.94-40.94a15.52 15.52 0 00-1.37-1.85C327.11 85.76 315 80 302 80h-92c-13 0-25.11 5.76-34.07 16.21a15.52 15.52 0 00-1.37 1.85l-25.94 41c-2.22 2.42-5.34 5-8.62 5v-8a16 16 0 00-16-16h-24a16 16 0 00-16 16v8h-4a48.05 48.05 0 00-48 48V384a48.05 48.05 0 0048 48h352a48.05 48.05 0 0048-48V192a48.05 48.05 0 00-48-48zM256 368a96 96 0 1196-96 96.11 96.11 0 01-96 96z" />
  </Ion>
);
const IonClose = (p: { size: number; color?: string }) => (
  <Ion {...p}>
    <path d="M368 368L144 144M368 144L144 368" {...s32} />
  </Ion>
);
const IonArrowForward = (p: { size: number; color?: string }) => (
  <Ion {...p}>
    <path d="M268 112l144 144-144 144M392 256H100" {...s32} strokeWidth={48} />
  </Ion>
);
const IonDocument = (p: { size: number; color?: string }) => (
  <Ion {...p}>
    <path d="M416 221.25V416a48 48 0 01-48 48H144a48 48 0 01-48-48V96a48 48 0 0148-48h98.75a32 32 0 0122.62 9.37l141.26 141.26a32 32 0 019.37 22.62z" {...s32} />
    <path d="M256 56v120a32 32 0 0032 32h120M176 288h160M176 368h160" {...s32} />
  </Ion>
);
const IonShield = (p: { size: number; color?: string }) => (
  <Ion {...p}>
    <path d="M336 176L225.2 304 176 255.8" {...s32} />
    <path d="M463.1 112.37C373.68 96.33 336.71 84.45 256 48c-80.71 36.45-117.68 48.33-207.1 64.37C32.7 369.13 240.58 457.79 256 464c15.42-6.21 223.3-94.87 207.1-351.63z" {...s32} />
  </Ion>
);
const IonPlay = (p: { size: number; color?: string }) => (
  <Ion {...p}>
    <path d="M133 440a35.37 35.37 0 01-17.5-4.67c-12-6.8-19.46-20-19.46-34.33V111c0-14.37 7.46-27.53 19.46-34.33a35.13 35.13 0 0135.77.45l247.85 148.36a36 36 0 010 61l-247.89 148.4A35.5 35.5 0 01133 440z" />
  </Ion>
);
const IonFlashlight = (p: { size: number; color?: string }) => (
  <Ion {...p}>
    <path d="M462 216c9.35-9.35 15.14-19.09 17.19-28.95 2.7-12.95-1.29-25.55-11.22-35.48L360.43 44.05C346.29 29.92 322 24.07 296 50l-2 2a8 8 0 000 11.32L448.64 218a8 8 0 0011.36 0zM250.14 153.08l-.16 2.34c-.53 7.18-6.88 19.15-13.88 26.14L47.27 370.36c-11.12 11.11-16.46 25.57-15.05 40.7C33.49 424.58 40.16 438 51 448.83L63.17 461c12.61 12.6 27.78 19 42.49 19a50.4 50.4 0 0036-15.24l188.84-188.8c7.07-7.07 18.84-13.3 26.17-13.87 17.48-1.32 43.57-3.28 67.79-15.65a4 4 0 001-6.37L271.69 86.31a4 4 0 00-6.39 1c-12.12 22.99-13.82 46.91-15.16 65.77zm-9.95 146.83a20 20 0 110-25.25 20 20 0 010 25.25z" />
  </Ion>
);

function ClickLogo({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={(size * 20) / 22} viewBox="0 0 22 20" fill={color} aria-hidden="true" style={{ flex: "none" }}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.9404 0H9.28186V10.541L2.33597 3.78534L0.456072 5.61304L6.62323 11.6116H0V14.1964H21.2223V11.6116H14.5991L20.7662 5.61304L18.8863 3.78534L11.9405 10.541L11.9404 0ZM9.38764 19.5069C8.71147 18.8495 8.71147 17.7836 9.38764 17.1262L10.6121 15.9358L11.8364 17.1262C12.5126 17.7836 12.5126 18.8495 11.8364 19.5069C11.1602 20.1644 10.0639 20.1644 9.38764 19.5069Z"
      />
    </svg>
  );
}

export function AppIcon({ size = 38 }: { size?: number }) {
  return (
    <span className="app-icon" style={{ width: size, height: size, borderRadius: size * 0.225 }}>
      <ClickLogo size={size * 0.52} color="#fff" />
    </span>
  );
}

/* ─── Aparelho ─── */

export function Phone({ scale, children, label, interactive = false }: { scale: number; children: ReactNode; label: string; interactive?: boolean }) {
  return (
    <div className="iphone" style={{ "--s": scale } as CSSProperties} role={interactive ? "group" : "img"} aria-label={label}>
      <div className="iphone-screen">{children}</div>
    </div>
  );
}

export function StatusBar({ time = "8:00", tone = "dark", airplane = false }: { time?: string; tone?: "dark" | "light"; airplane?: boolean }) {
  return (
    <div className={`ios-status ios-status-${tone}`}>
      <span className="ios-time">{time}</span>
      <span className="ios-island" />
      <span className="ios-glyphs">
        {airplane ? (
          <Mask src="/app/icons/sf-airplane.png" size={17} color="currentColor" />
        ) : (
          <>
            <svg width="19" height="12" viewBox="0 0 19 12" fill="currentColor" aria-hidden="true">
              <rect x="0" y="7.5" width="3.2" height="4.5" rx="1" />
              <rect x="5" y="5" width="3.2" height="7" rx="1" />
              <rect x="10" y="2.5" width="3.2" height="9.5" rx="1" />
              <rect x="15" y="0" width="3.2" height="12" rx="1" />
            </svg>
            <svg width="17" height="12" viewBox="0 0 17 12" fill="currentColor" aria-hidden="true">
              <path d="M8.5 2.3c2.4 0 4.6.9 6.3 2.5l1.3-1.3A10.6 10.6 0 0 0 8.5.4 10.6 10.6 0 0 0 .9 3.5l1.3 1.3a8.8 8.8 0 0 1 6.3-2.5Z" />
              <path d="M8.5 5.9c1.4 0 2.7.5 3.7 1.4l1.3-1.3A7.1 7.1 0 0 0 8.5 4a7.1 7.1 0 0 0-5 2l1.3 1.3c1-.9 2.3-1.4 3.7-1.4Z" />
              <path d="M8.5 9.3c.5 0 1 .2 1.3.5L8.5 11.2 7.2 9.8c.3-.3.8-.5 1.3-.5Z" />
            </svg>
          </>
        )}
        <svg width="27" height="13" viewBox="0 0 27 13" fill="none" aria-hidden="true">
          <rect x="0.5" y="0.5" width="23" height="12" rx="3.8" stroke="currentColor" opacity="0.4" />
          <rect x="2" y="2" width="20" height="9" rx="2.5" fill="currentColor" />
          <path d="M25 4.5v4c.8-.3 1.3-1.1 1.3-2s-.5-1.7-1.3-2Z" fill="currentColor" opacity="0.4" />
        </svg>
      </span>
    </div>
  );
}

/* NativeTabs tintColor="#285E31" (app/(app)/(tabs)/_layout.tsx) */
function TabBar({ active }: { active: "home" | "care" | "explore" | "mind" }) {
  const tabs = [
    { key: "home", label: "Início", icon: "heart", on: "heart.fill" },
    { key: "care", label: "Care", icon: "cross.case", on: "cross.case.fill" },
    { key: "explore", label: "Explore", icon: "safari", on: "safari.fill" },
    { key: "mind", label: "Mente", icon: "brain.head.profile", on: "brain.head.profile" },
  ] as const;
  return (
    <div className="ios-tabbar">
      {tabs.map((t) => {
        const on = t.key === active;
        return (
          <span key={t.key} className={`ios-tab${on ? " is-active" : ""}`}>
            <Mask src={`/app/icons/sf-${on ? t.on : t.icon}.png`} size={26} color={on ? "#285E31" : "#1C1C1E"} style={{ WebkitMaskSize: "contain", maskSize: "contain" }} />
            {t.label}
          </span>
        );
      })}
    </div>
  );
}

/* ─── Início: app/(app)/(tabs)/(home)/index.tsx ─── */

export type DoseState = "pending" | "late" | "taken";

const STRIP: ([string, string] | string)[] = [
  ["Dom", "27"],
  ["Seg", "28"],
  ["Ter", "29"],
  ["Qua", "30"],
  "Out",
  ["Qui", "1"],
  ["Sex", "2"],
];

function DoseRow({ time, state, mood }: { time: string; state: DoseState; mood?: string }) {
  if (state === "taken") {
    return (
      <div className="h-logged">
        <span className="h-logged-check">
          <IonCheckmark size={14} color="#2D6937" />
        </span>
        <span className="h-logged-name">Full Spectrum CBG 6.000mg · 2 gotas</span>
        {mood && <span className="h-logged-mood">{mood}</span>}
        <span className="h-logged-time">{time}</span>
      </div>
    );
  }
  const late = state === "late";
  return (
    <div className={`h-dose${late ? " is-late" : ""}`}>
      <span className="h-dose-time">{time}</span>
      <span className="h-med-icon">
        <IonWater size={14} color="#fff" />
      </span>
      <span className="h-dose-text">
        <strong>Full Spectrum CBG 6.000mg</strong>
        <span>{late ? "Atrasado · 2 gotas · Óleo" : "2 gotas · Óleo"}</span>
      </span>
      <span className="h-badge">{late ? <IonAlert size={14} color="#9A3412" /> : "—"}</span>
    </div>
  );
}

function WalletMiniArt() {
  return (
    <svg width="72" height="64" viewBox="0 0 88 64" fill="none" aria-hidden="true" style={{ flex: "none" }}>
      <g transform="rotate(11 56 28)">
        <rect x="35" y="3" width="39" height="48" rx="6" fill="#8CA77A" />
        <path d="M43 16h22M43 23h22M43 30h14" stroke="#D6E8A6" strokeWidth="2" strokeLinecap="round" />
      </g>
      <g transform="rotate(-7 38 39)">
        <rect x="6" y="20" width="62" height="38" rx="6" fill="#F8F7F2" />
        <g transform="translate(14 28)">
          <ClickLogo size={16} color="#15311B" />
        </g>
        <path d="M36 32h24M36 38h18" stroke="#829079" strokeWidth="2" strokeLinecap="round" />
        <path d="M14 49h46" stroke="#285E31" strokeWidth="3" strokeLinecap="round" />
      </g>
    </svg>
  );
}

export function HomeScreen({
  morning,
  mood,
  streak = 6,
  airplane = false,
  children,
}: {
  morning: DoseState;
  mood?: string;
  streak?: number;
  airplane?: boolean;
  children?: ReactNode;
}) {
  const days = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
  return (
    <div className="ios ios-grouped">
      <StatusBar airplane={airplane} />
      <div className="h-content">
        <div className="h-title">Início</div>
        <div className="h-month">Setembro 2026</div>
        <div className="h-strip">
          {STRIP.map((d) =>
            typeof d === "string" ? (
              <span key={d} className="h-strip-month">
                {d}
              </span>
            ) : (
              <span key={d[1]} className={`h-day${d[1] === "27" ? " is-selected" : ""}`}>
                <span>{d[0]}</span>
                <strong>{d[1]}</strong>
              </span>
            ),
          )}
        </div>

        <div className="h-card h-today">
          <div className="h-today-head">
            <div>
              <strong>Hoje, 27 de Setembro</strong>
              <span>Resumo do dia</span>
            </div>
            <span className="h-expand">
              <IonExpand size={18} color="#2D6937" />
            </span>
          </div>
          <div className="h-doses">
            <DoseRow time="08:00" state={morning} mood={mood} />
            <DoseRow time="20:00" state="pending" />
          </div>
          <div className="h-as-needed">
            <IonMedical size={18} color="#8E8E93" />
            <span>Conforme necessário</span>
            <span className="h-plus">
              <IonAdd size={16} color="#2D6937" />
            </span>
          </div>
        </div>

        <div className="h-card h-streak">
          <div className="h-streak-head">
            <span className="h-flame">{"\u{1F525}"}</span>
            <strong>{streak}</strong>
            <span>dias seguidos</span>
          </div>
          <div className="h-streak-days">
            {days.map((d, i) => (
              <span key={d} className="h-streak-day">
                <span className={`h-dot${i < 6 ? " is-taken" : " is-today"}`}>
                  {i < 6 ? <IonCheckmark size={14} color="#fff" /> : <IonTime size={14} color="#2D6937" />}
                </span>
                {d}
              </span>
            ))}
          </div>
          <div className="h-progress">
            <span className="h-track">
              <span style={{ width: `${(streak / 7) * 100}%` }} />
            </span>
            <span className="h-next">Próximo: 7 dias</span>
          </div>
        </div>

        <div className="h-wallet-compact">
          <WalletMiniArt />
          <div className="h-wallet-text">
            <strong>Minha carteirinha</strong>
            <span>Veja seus documentos</span>
          </div>
          <IonChevronForward size={12} color="#D6E8A6" />
        </div>
      </div>
      <TabBar active="home" />
      {children}
    </div>
  );
}

/* ─── Tela de bloqueio ─── */

export function LockScreen({
  children,
  time = "8:00",
  date = "domingo, 27 de setembro",
}: {
  children?: ReactNode;
  time?: string;
  date?: string;
}) {
  return (
    <div className="ios ios-lock">
      <StatusBar tone="light" time={time} />
      <div className="ios-lock-date">{date}</div>
      <div className="ios-lock-time">{time}</div>
      <div className="ios-lock-notices">{children}</div>
      <span className="ios-lock-btn is-left">
        <IonFlashlight size={22} />
      </span>
      <span className="ios-lock-btn is-right">
        <IonCamera size={22} />
      </span>
      <span className="ios-home-indicator" />
    </div>
  );
}

export function NotificationCard({ title, body, time = "agora" }: { title: string; body: string; time?: string }) {
  return (
    <div className="ios-notice">
      <AppIcon size={38} />
      <div className="ios-notice-text">
        <div className="ios-notice-head">
          <strong>{title}</strong>
          <span>{time}</span>
        </div>
        <p>{body}</p>
      </div>
    </div>
  );
}

/* ─── Sheets: components/sheet.tsx (cornerRadius 24) ─── */

export const MOODS = [
  ["\u{1F616}", "Péssimo"],
  ["\u{1F615}", "Mal"],
  ["\u{1F610}", "Ok"],
  ["\u{1F642}", "Bem"],
  ["\u{1F60A}", "Ótimo"],
  ["\u{1F929}", "Incrível"],
] as const;

/* components/feeling-sheet.tsx */
export function FeelingSheet({ selected }: { selected?: string }) {
  return (
    <div className="sh">
      <span className="sh-grabber" />
      <div className="sh-head">
        <strong>Como você se sente?</strong>
      </div>
      <div className="sh-body">
        <div className="sh-moods">
          {MOODS.map(([emoji, label]) => (
            <span key={label} className={`sh-mood${selected === label ? " is-selected" : ""}`}>
              <span className="sh-mood-emoji">{emoji}</span>
              {label}
            </span>
          ))}
        </div>
      </div>
      <div className="sh-foot">
        <span className="sh-primary">Salvar</span>
      </div>
    </div>
  );
}

/* components/dosage-check-sheet.tsx */
export function DosageSheet() {
  return (
    <div className="sh">
      <span className="sh-grabber" />
      <div className="sh-head">
        <strong>Dosagem</strong>
      </div>
      <div className="sh-body sh-dosage">
        <p className="sh-q">
          Sua dosagem continua <b>2 gotas</b>?
        </p>
        <div className="sh-choices">
          <span className="sh-choice">Sim</span>
          <span className="sh-choice is-selected">Não</span>
        </div>
        <div className="sh-field">
          <span className="sh-label">Nova dosagem</span>
          <div className="sh-input">
            <strong>3</strong>
            <span className="sh-input-sep" />
            <span>gotas</span>
          </div>
        </div>
        <div className="sh-field">
          <span className="sh-label">Aplicar para</span>
          <div className="sh-choices is-small">
            <span className="sh-choice">Só esta dose</span>
            <span className="sh-choice is-selected">Esta e próximas</span>
          </div>
        </div>
      </div>
      <div className="sh-foot">
        <span className="sh-primary">Continuar</span>
      </div>
    </div>
  );
}

/* ─── Consulta: features/consultation-tracking/ios.tsx (banner) ─── */

export function ConsultationActivity({ countdown }: { countdown: string }) {
  return (
    <div className="la">
      <div className="la-head">
        <svg width="14" height="14" viewBox="0 0 512 512" fill="#A8D6AC" aria-hidden="true">
          <path d="M480 128a64 64 0 00-64-64h-16V48.45c0-8.61-6.62-16-15.23-16.43A16 16 0 00368 48v16H144V48.45c0-8.61-6.62-16-15.23-16.43A16 16 0 00112 48v16H96a64 64 0 00-64 64v12a4 4 0 004 4h440a4 4 0 004-4zM32 416a64 64 0 0064 64h320a64 64 0 0064-64V179a3 3 0 00-3-3H35a3 3 0 00-3 3z" />
        </svg>
        <strong>Sua consulta</strong>
        <span>Click</span>
      </div>
      <div className="la-main">
        <div>
          <span className="la-label">9 de out. · Brasília</span>
          <strong className="la-time">14:30</strong>
        </div>
        <div className="is-end">
          <span className="la-label">Começa em</span>
          <strong className="la-count">{countdown}</strong>
        </div>
      </div>
      <div className="la-links">
        <span>Preencher anamnese</span>
        <span>Ver consulta</span>
      </div>
    </div>
  );
}

/* ─── Care: features/care/local-care-hub.tsx ─── */

/* Dados de exemplo, sem paciente real. */
const SAMPLE = { name: "Ana Beatriz Souza", short: "Ana Beatriz", initials: "AS", email: "ana.souza@email.com" };

/* features/patient-wallet/wallet-ui.tsx → WalletIdentityCard */
export function WalletIdentityCard({ miniature = false }: { miniature?: boolean }) {
  return (
    <div className={`w-card${miniature ? " is-mini" : ""}`}>
      <div className="w-card-body">
        <div className="w-card-brand">
          <ClickLogo size={miniature ? 20 : 28} color="#15311B" />
          <span>Click Cannabis</span>
        </div>
        <div className="w-card-name">
          <span className="w-eyebrow">CARTEIRINHA DO PACIENTE</span>
          <strong>{SAMPLE.name}</strong>
        </div>
        {!miniature && (
          <div className="w-card-fields">
            <div>
              <span className="w-eyebrow">NASCIMENTO</span>
              <span>14/03/1987</span>
            </div>
            <div>
              <span className="w-eyebrow">CPF</span>
              <span>123.***.***-09</span>
            </div>
          </div>
        )}
      </div>
      <div className="w-card-foot">CUIDADO QUE ACOMPANHA VOCÊ</div>
    </div>
  );
}

function NavRow({ icon, label, divider = true }: { icon: string; label: string; divider?: boolean }) {
  return (
    <>
      <div className="c-nav-row">
        <Mask src={duo(icon)} size={20} color="#2D6937" />
        <span>{label}</span>
        <IonChevronForward size={18} color="#C4C4C4" />
      </div>
      {divider && <span className="c-divider" />}
    </>
  );
}

function SummaryCard({ icon, title, text }: { icon: string; title: string; text: string }) {
  return (
    <div className="c-summary">
      <span className="c-summary-icon">
        <Mask src={duo(icon)} size={22} color="#285E31" />
      </span>
      <div>
        <strong>{title}</strong>
        <span>{text}</span>
      </div>
      <IonChevronForward size={19} color="#8C948C" />
    </div>
  );
}

export function CareScreen({ scroll = 0, airplane = false, children }: { scroll?: number; airplane?: boolean; children?: ReactNode }) {
  return (
    <div className="ios ios-grouped">
      <div className="c-content" style={{ transform: `translateY(${-scroll}px)` }}>
        <div className="c-header">
          <strong>Sua jornada</strong>
          <span className="c-pill">
            <IonPerson size={16} color="#285E31" />
            <span>{SAMPLE.short}</span>
            <IonChevronDown size={14} color="#285E31" />
          </span>
        </div>
        <div className="c-stack">
          <div className="c-card c-profile">
            <div className="c-profile-row">
              <span className="c-avatar">
                {SAMPLE.initials}
                <span className="c-avatar-badge">
                  <IonCamera size={12} color="#fff" />
                </span>
              </span>
              <div className="c-profile-text">
                <strong>{SAMPLE.name}</strong>
                <span>
                  <Mask src={duo("mail-02")} size={13} color="#8E8E93" />
                  {SAMPLE.email}
                </span>
              </div>
            </div>
            <div className="c-profile-nav">
              <NavRow icon="users-plus" label="Indicações" divider={false} />
            </div>
          </div>

          <div className="c-wallet">
            <span className="c-wallet-eyebrow">Sempre com você</span>
            <div className="c-wallet-mid">
              <div className="c-wallet-copy">
                <strong>
                  Minha
                  <br />
                  carteirinha
                </strong>
                <span>
                  Seus documentos,
                  <br />
                  onde você estiver.
                </span>
              </div>
              <div className="c-wallet-tilt">
                <WalletIdentityCard miniature />
              </div>
            </div>
            <div className="c-wallet-foot">
              <span>
                <i />2 documentos salvos no aparelho
              </span>
              <span className="c-wallet-open">
                Abrir <IonArrowForward size={16} color="#fff" />
              </span>
            </div>
          </div>

          <div className="c-group">
            <strong className="c-heading">Sua evolução</strong>
            <SummaryCard icon="activity" title="Condições acompanhadas" text="2 condições acompanhadas" />
            <SummaryCard icon="certificate-02" title="Satisfação geral" text="Indo bem" />
            <SummaryCard icon="bank-note-01" title="Medicamentos" text="3 medicamentos cadastrados" />
          </div>

          <div className="c-group">
            <strong className="c-heading">Seus dados na Click</strong>
            <div className="c-card c-nav">
              <NavRow icon="calendar-heart-02" label="Consultas" />
              <NavRow icon="folder" label="Receitas e documentos" />
              <NavRow icon="wallet-03" label="Pagamentos" />
              <NavRow icon="package-check" label="Pedidos" divider={false} />
            </div>
          </div>
        </div>
      </div>
      <div className={`c-statusbar${scroll > 0 ? " is-scrolled" : ""}`}>
        <StatusBar airplane={airplane} />
      </div>
      {scroll > 0 && <div className="c-sticky">Sua jornada</div>}
      <TabBar active="care" />
      {children}
    </div>
  );
}

/* features/patient-wallet/patient-wallet-entry.tsx → AppSheet (cornerRadius 28) */
export function WalletSheet() {
  return (
    <div className="sh is-app">
      <span className="sh-grabber" />
      <div className="sh-app-head">
        <strong>Minha carteirinha</strong>
        <span className="sh-close">
          <IonClose size={22} color="#1C1C1E" />
        </span>
      </div>
      <div className="sh-app-body">
        <WalletIdentityCard />
        <span className="w-eyebrow w-docs-label">SEUS DOCUMENTOS</span>
        <div className="w-tiles">
          {[
            { title: "Receita médica", icon: <IonDocument size={24} color="#15311B" />, date: "02/09/2026" },
            { title: "Autorização Anvisa", icon: <IonShield size={24} color="#15311B" />, date: "05/09/2026" },
          ].map((d) => (
            <div key={d.title} className="w-tile">
              <div className="w-tile-top">
                <span className="w-paper">{d.icon}</span>
                <IonArrowForward size={19} color="#15311B" />
              </div>
              <strong>{d.title}</strong>
              <span>Adicionado em {d.date}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="sh-app-foot">
        <span className="w-button">Configurar carteirinha</span>
      </div>
    </div>
  );
}

/* ─── Explore: app/(app)/(tabs)/(explore)/content.tsx ─── */

const VIDEOS = [
  { slug: "07-duvidas-frequentes-sobre-tdah-e-cannabis-medicinal", title: "TDAH e cannabis medicinal: 5 dúvidas mais frequentes", time: "5:15", tags: ["Tdah", "Duvidas Frequentes"] },
  { slug: "10-duvidas-frequentes-sobre-enxaqueca-e-cannabis-medicinal", title: "Enxaqueca e cannabis medicinal: 5 dúvidas mais frequentes", time: "5:59", tags: ["Enxaqueca", "Duvidas Frequentes"] },
];

export function ExploreScreen() {
  return (
    <div className="ios ios-grouped">
      <StatusBar />
      <div className="e-content">
        <div className="h-title e-title">Explore</div>
        <div className="e-series">
          {[
            { icon: "help-circle", color: "#34C759", name: "Dúvidas", count: "5 conteúdos" },
            { icon: "cloud-moon", color: "#5856D6", name: "Sono", count: "18 conteúdos" },
            { icon: "activity", color: "#AF52DE", name: "Ansiedade", count: "19 conteúdos" },
          ].map((s) => (
            <div key={s.name} className="e-serie">
              <Mask src={duo(s.icon)} size={20} color={s.color} />
              <div>
                <strong>{s.name}</strong>
                <span>{s.count}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="e-featured">
          <img src="/app/videos/featured-safety.webp" alt="" width={900} height={522} />
          <span className="e-featured-shade" />
          <div className="e-featured-text">
            <span>Em destaque</span>
            <strong>Segurança no Tratamento</strong>
          </div>
        </div>

        <div className="e-section-head">
          <strong>Dúvidas frequentes</strong>
          <span>Respostas rápidas para os principais quadros</span>
        </div>
        <div className="e-shelf">
          {VIDEOS.map((v) => (
            <div key={v.slug} className="e-video">
              <div className="e-thumb">
                <img src={`/app/videos/${v.slug}.webp`} alt="" width={640} height={360} />
                <span className="e-play">
                  <IonPlay size={24} color="#fff" />
                </span>
                <span className="e-duration">{v.time}</span>
              </div>
              <strong>{v.title}</strong>
              <div className="e-tags">
                {v.tags.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <TabBar active="explore" />
    </div>
  );
}
