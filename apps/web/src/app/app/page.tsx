import { EvolutionCharts } from "./Evolution";
import { FeatureStory, HeroPhone, OfflineDemo } from "./Showcase";
import { StoreButtons } from "./StoreButtons";

const FORMATS = [
  { src: "/produtos/oleo-v3.webp", name: "Óleo", unit: "Dose em gotas." },
  { src: "/produtos/jujuba-v3.webp", name: "Gummy", unit: "Em unidades, com frações como ½." },
  { src: "/produtos/softgel-v3.webp", name: "Softgel", unit: "Em cápsulas." },
] as const;

/* TYPE_LABELS de apps/native/lib/medicine-types.ts, sem os três formatos acima */
const OTHER_TYPES = ["Comprimido", "Gotas", "Líquido", "Spray", "Inalador", "Creme", "Pomada", "Gel", "Adesivo", "Injeção", "Pó"] as const;

export default function AppLandingPage() {
  return (
    <div className="lp">
      <style>{`
.lp {
  --bg: #F7F7F3;
  --surface: #FFFFFF;
  --ink: #0F2418;
  --ink-2: #4D5C52;
  --ink-3: #8A948D;
  --line: rgba(15, 36, 24, 0.1);
  --green: #285E31;
  --green-press: #1F4B27;
  --deep: #0B2A1E;
  --on-deep: #FFFFFF;
  --on-deep-2: rgba(255, 255, 255, 0.7);
  --on-deep-3: rgba(255, 255, 255, 0.48);
  --mint: #8FD49F;
  --sans: var(--font-inter-loaded), "Inter", system-ui, sans-serif;

  min-height: 100svh;
  background: var(--bg);
  color: var(--ink);
  font-family: var(--sans);
  -webkit-font-smoothing: antialiased;
}
.lp a:focus-visible, .lp button:focus-visible { outline: 3px solid #5BA56B; outline-offset: 3px; }
.lp img { display: block; max-width: 100%; }
.wrap { max-width: 1160px; margin: 0 auto; padding-inline: 24px; }

/* Nav */
.nav { position: sticky; top: 0; z-index: 30; background: rgba(247, 247, 243, 0.86); backdrop-filter: saturate(180%) blur(14px); -webkit-backdrop-filter: saturate(180%) blur(14px); border-bottom: 1px solid var(--line); }
.nav-inner { display: flex; align-items: center; justify-content: space-between; height: 64px; }
.nav-cta { display: inline-flex; align-items: center; height: 40px; padding: 0 18px; border-radius: 999px; background: var(--green); color: #fff; font-size: 14px; font-weight: 600; text-decoration: none; transition: background-color 150ms ease, scale 150ms ease-out; }
.nav-cta:active { scale: 0.96; }

/* Tipografia */
.h1, .h2 { font-weight: 650; letter-spacing: -0.04em; text-wrap: balance; margin: 0; }
.h1 { font-size: clamp(48px, 6.4vw, 80px); line-height: 0.98; }
.h2 { font-size: clamp(36px, 4.6vw, 60px); line-height: 1.02; }
.soft { color: var(--ink-3); }
.lede { font-size: clamp(18px, 1.6vw, 20px); line-height: 1.55; color: var(--ink-2); max-width: 30em; margin: 24px 0 0; text-wrap: pretty; }
.kicker { font-size: 14px; font-weight: 600; color: var(--green); margin: 0 0 18px; }

/* Lojas */
.stores { display: flex; flex-wrap: wrap; gap: 12px; }
.store { display: inline-flex; align-items: center; gap: 10px; height: 56px; padding: 0 22px 0 18px; border-radius: 16px; background: var(--ink); color: #fff; text-decoration: none; font-size: 17px; font-weight: 600; letter-spacing: -0.01em; line-height: 1.05; transition: background-color 150ms ease, scale 150ms ease-out; }
.store small { display: block; font-size: 11px; font-weight: 500; letter-spacing: 0; opacity: 0.7; }
.store:active { scale: 0.96; }
.on-deep .store { background: #fff; color: var(--deep); }
.fineprint { margin: 16px 0 0; font-size: 14px; color: var(--ink-3); }
@media (hover: hover) and (pointer: fine) {
  .nav-cta:hover { background: var(--green-press); }
  .store:hover { background: #1D3A29; }
  .on-deep .store:hover { background: #E6F1E8; }
}

/* Faixas escuras */
.on-deep { position: relative; overflow: hidden; background: var(--deep); color: var(--on-deep); }
.on-deep .soft { color: var(--on-deep-3); }
.on-deep .lede { color: var(--on-deep-2); }
.on-deep .kicker { color: var(--mint); }
.on-deep .fineprint { color: var(--on-deep-3); }
.glow { position: absolute; pointer-events: none; border-radius: 50%; background: radial-gradient(closest-side, rgba(70, 190, 95, 0.42), rgba(70, 190, 95, 0.12) 55%, rgba(70, 190, 95, 0) 100%); }

/* ── Hero ── */
.hero { padding-top: 72px; }
.hero .glow { width: 980px; height: 980px; right: -180px; top: -120px; }
.hero-grid { position: relative; display: grid; grid-template-columns: 1.25fr 0.75fr; gap: 40px; align-items: end; }
.hero-copy { padding-bottom: 120px; }
.hero-copy .stores { margin-top: 40px; }
.hero-stage { position: relative; display: flex; flex-direction: column; align-items: center; height: 660px; clip-path: inset(-200px -200px 0 -200px); }
.hero-phone-foot { position: absolute; left: 0; right: 0; top: 380px; display: flex; justify-content: center; z-index: 2; pointer-events: none; }
.hero-hint { font-size: 13px; color: rgba(255,255,255,0.8); padding: 6px 12px; border-radius: 999px; background: rgba(0,0,0,0.35); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); }
.hero-replay { pointer-events: auto; height: 36px; padding: 0 16px; border: 0; border-radius: 999px; background: rgba(255,255,255,0.92); color: var(--deep); font: inherit; font-size: 14px; font-weight: 600; cursor: pointer; transition: scale 150ms ease-out; }
.hero-replay:active { scale: 0.96; }

/* ── Rolagem guiada ── */
.story-section { padding: 40px 0 0; }
.story { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; }
.story-step { min-height: 80vh; display: flex; flex-direction: column; justify-content: center; max-width: 460px; opacity: 0.32; transition: opacity 300ms ease; }
.story-step.is-active { opacity: 1; }
.story-step > h3 { margin: 0; font-size: clamp(32px, 3.6vw, 48px); font-weight: 650; letter-spacing: -0.035em; line-height: 1.05; text-wrap: balance; }
.story-text { margin: 20px 0 0; font-size: 19px; line-height: 1.55; color: var(--ink-2); text-wrap: pretty; }
.story-inline { display: none; }
.story-sticky { position: sticky; top: 64px; height: calc(100vh - 64px); display: flex; align-items: center; justify-content: center; }
.story-layer { position: absolute; inset: 0; }

/* ── Evolução ── */
.evolution { padding: 120px 0 40px; }
.evolution-head { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; align-items: end; margin-bottom: 48px; }
.evolution-head .lede { margin: 0; }

/* ── Lojas inteligentes + QR ── */
.stores-block { display: flex; flex-direction: column; gap: 20px; }
.stores-block.has-qr { align-items: center; }
.store.is-solo { min-width: 220px; justify-content: center; }
.qr-card { display: flex; align-items: center; gap: 18px; max-width: 420px; padding: 16px 20px 16px 16px; border-radius: 20px; background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(255, 255, 255, 0.14); text-align: left; }
.qr-card img { flex: none; width: 96px; height: 96px; padding: 8px; border-radius: 12px; background: #fff; }
.qr-card p { margin: 0; font-size: 14px; line-height: 1.5; color: var(--on-deep-2); }
.qr-card strong { display: block; font-size: 15px; color: #fff; }

/* ── Sem internet ── */
.offline-section { padding: 80px 0 40px; }
.offline { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: center; }
.airplane { display: flex; align-items: center; gap: 14px; width: 100%; max-width: 420px; margin-top: 36px; padding: 14px 16px; border: 1px solid var(--line); border-radius: 20px; background: var(--surface); font: inherit; text-align: left; color: var(--ink); cursor: pointer; transition: border-color 150ms ease, scale 150ms ease-out; }
.airplane:active { scale: 0.98; }
.airplane-icon { flex: none; width: 36px; height: 36px; border-radius: 10px; background: #FF9500; -webkit-mask: none; position: relative; }
.airplane-icon::after { content: ""; position: absolute; inset: 8px; background: #fff; -webkit-mask: url(/app/icons/sf-airplane.png) center / contain no-repeat; mask: url(/app/icons/sf-airplane.png) center / contain no-repeat; }
.airplane-label { flex: 1; display: flex; flex-direction: column; gap: 2px; }
.airplane-label strong { font-size: 16px; font-weight: 600; }
.airplane-label span { font-size: 13px; color: var(--ink-3); }
.airplane-track { flex: none; display: flex; width: 51px; height: 31px; padding: 2px; border-radius: 16px; background: #E3E3E6; transition: background-color 200ms ease; }
.airplane.is-on .airplane-track { justify-content: flex-end; background: #34C759; }
.airplane-thumb { width: 27px; height: 27px; border-radius: 50%; background: #fff; box-shadow: 0 3px 8px rgba(0,0,0,0.15), 0 1px 1px rgba(0,0,0,0.16); }
.offline-list { display: flex; flex-direction: column; gap: 12px; margin: 28px 0 0; padding: 0; list-style: none; }
.offline-list li { display: flex; align-items: center; gap: 12px; font-size: 16px; color: var(--ink-2); transition: color 200ms ease; }
.offline-list li.is-on { color: var(--ink); }
.offline-check { display: grid; place-items: center; flex: none; width: 24px; height: 24px; border-radius: 50%; background: #E6E9E6; color: #8A948D; transition: background-color 200ms ease, color 200ms ease; }
.is-on .offline-check { background: #E4F0E6; color: var(--green); }
.offline-sync { margin: 20px 0 0; font-size: 14px; color: var(--ink-3); }
.offline-stage { display: flex; justify-content: center; }
@media (hover: hover) and (pointer: fine) { .airplane:hover { border-color: rgba(15, 36, 24, 0.22); } }

/* ── Formatos ── */
.formats { padding: 120px 0; }
.formats-head { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; align-items: end; }
.formats-head .lede { margin: 0; }
.formats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-top: 56px; }
.format img { width: 100%; aspect-ratio: 1; object-fit: cover; border-radius: 28px; }
.format strong { display: block; margin-top: 18px; font-size: 20px; font-weight: 600; letter-spacing: -0.015em; }
.format span { display: block; margin-top: 4px; font-size: 16px; color: var(--ink-2); }
.other-types { display: flex; flex-wrap: wrap; align-items: center; gap: 10px 16px; margin-top: 40px; padding-top: 28px; border-top: 1px solid var(--line); }
.other-types > span { font-size: 15px; font-weight: 600; color: var(--ink); }
.other-types ul { display: flex; flex-wrap: wrap; gap: 8px; margin: 0; padding: 0; list-style: none; }
.other-types li { padding: 7px 14px; border-radius: 999px; background: var(--surface); border: 1px solid var(--line); font-size: 15px; color: var(--ink-2); }

/* ── Privacidade ── */
.privacy { padding: 0 0 120px; }
.privacy-card { display: grid; grid-template-columns: 1.4fr 1fr; gap: 48px; align-items: end; padding: 48px; border: 1px solid var(--line); border-radius: 28px; background: var(--surface); }
.privacy-quote { margin: 0; font-size: clamp(26px, 2.8vw, 34px); font-weight: 600; letter-spacing: -0.025em; line-height: 1.25; text-wrap: balance; }
.privacy-links { display: flex; flex-direction: column; gap: 12px; font-size: 16px; }
.privacy-links p { margin: 0 0 4px; color: var(--ink-2); line-height: 1.6; }
.link { color: var(--green); font-weight: 600; text-decoration: underline; text-decoration-thickness: 1px; text-underline-offset: 4px; }

/* ── CTA final / rodapé ── */
.final { padding: 128px 0; text-align: center; }
.final .glow { width: 900px; height: 900px; left: 50%; top: 50%; margin: -450px 0 0 -450px; opacity: 0.8; }
.final .wrap { position: relative; }
.final .lede { margin: 20px auto 0; }
.final .stores { justify-content: center; margin-top: 40px; }
.footer { padding: 32px 0 40px; border-top: 1px solid var(--line); font-size: 13px; color: var(--ink-3); }
.footer-inner { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 16px; }
.footer p { margin: 0; line-height: 1.6; }
.footer nav { display: flex; gap: 20px; }
.footer a { color: var(--ink-2); text-decoration: none; }
.footer a:hover { color: var(--ink); text-decoration: underline; text-underline-offset: 3px; }

@media (max-width: 900px) {
  .hero { padding-top: 48px; }
  .hero-grid, .formats-head, .evolution-head, .offline, .privacy-card { grid-template-columns: 1fr; }
  .offline { gap: 48px; }
  .offline-section { padding: 64px 0 24px; }
  .evolution { padding: 88px 0 24px; }
  .evolution-head { gap: 24px; margin-bottom: 32px; }
  .hero-copy { padding-bottom: 0; }
  .hero-stage { height: 600px; }
  .story { grid-template-columns: 1fr; }
  .story-sticky { display: none; }
  .story-step { min-height: 0; max-width: none; opacity: 1; padding: 64px 0 0; }
  .story-inline { display: flex; justify-content: center; margin-top: 40px; }
  .formats { padding: 96px 0; }
  .formats-grid { grid-template-columns: 1fr; gap: 32px; }
  .privacy { padding-bottom: 88px; }
  .privacy-card { padding: 32px 24px; gap: 32px; border-radius: 24px; }
  .final { padding: 96px 0; }
}
@media (max-width: 520px) {
  .wrap { padding-inline: 20px; }
  .hero-stage { height: 560px; }
  .store { flex: 1 1 0; justify-content: center; padding: 0 12px; }
}
@media (prefers-reduced-motion: reduce) {
  .lp *, .lp *::before, .lp *::after { transition: none !important; }
  .lp *:active { scale: none !important; }
}
      `}</style>

      <header className="nav">
        <div className="wrap nav-inner">
          <img src="/logo.svg" alt="Click Cannabis" width={140} height={20} fetchPriority="high" decoding="async" />
          <a className="nav-cta" href="/app/baixar">Baixar o app</a>
        </div>
      </header>

      <main>
        <section className="hero on-deep">
          <div className="glow" aria-hidden="true" />
          <div className="wrap hero-grid">
            <div className="hero-copy">
              <p className="kicker">App Click Cannabis</p>
              <h1 className="h1">
                Seu tratamento, <span className="soft">em dia.</span>
              </h1>
              <p className="lede">
                Lembretes de dose, suas consultas, sua carteirinha e seus documentos da Click.
                Tudo organizado no seu celular, mesmo sem internet.
              </p>
              <StoreButtons />
              <p className="fineprint">Gratuito, sem anúncios. iPhone e Android.</p>
            </div>
            <div className="hero-stage">
              <HeroPhone />
            </div>
          </div>
        </section>

        <section className="story-section">
          <div className="wrap">
            <FeatureStory />
          </div>
        </section>

        <section className="evolution">
          <div className="wrap">
            <div className="evolution-head">
              <div>
                <p className="kicker">Sua evolução</p>
                <h2 className="h2">
                  Veja como você tem se sentido. <span className="soft">Semana a semana.</span>
                </h2>
              </div>
              <p className="lede">
                Seus registros viram gráficos claros: o impacto das condições que você acompanha, a
                constância das doses e o humor depois de cada uma. Um retrato fiel para levar à
                próxima consulta.
              </p>
            </div>
            <EvolutionCharts />
            <p className="ev-note">
              Dados ilustrativos. Os gráficos mostram o que você registra; o app não avalia o
              tratamento nem substitui o acompanhamento médico.
            </p>
          </div>
        </section>

        <section className="offline-section">
          <div className="wrap">
            <OfflineDemo />
          </div>
        </section>

        <section className="formats">
          <div className="wrap">
            <div className="formats-head">
              <div>
                <p className="kicker">Seus medicamentos</p>
                <h2 className="h2">
                  Todos os remédios, <span className="soft">em um só lugar.</span>
                </h2>
              </div>
              <p className="lede">
                Os produtos da Click e qualquer outro medicamento que você usa. O app mostra cada
                dose na unidade certa e monta os horários da semana.
              </p>
            </div>
            <div className="formats-grid">
              {FORMATS.map((f) => (
                <div key={f.name} className="format">
                  <img src={f.src} alt="" width={600} height={600} loading="lazy" decoding="async" />
                  <strong>{f.name}</strong>
                  <span>{f.unit}</span>
                </div>
              ))}
            </div>
            <div className="other-types">
              <span>E também</span>
              <ul>
                {OTHER_TYPES.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="privacy">
          <div className="wrap">
            <div className="privacy-card">
              <p className="privacy-quote">
                Não vendemos dados pessoais nem usamos dados de saúde para direcionar publicidade.
              </p>
              <div className="privacy-links">
                <p>Você decide o que ativar e pode excluir sua conta quando quiser.</p>
                <a className="link" href="/app/privacidade">Política de privacidade</a>
                <a className="link" href="/app/excluir-conta">Excluir minha conta</a>
              </div>
            </div>
          </div>
        </section>

        <section className="final on-deep" id="baixar">
          <div className="glow" aria-hidden="true" />
          <div className="wrap">
            <h2 className="h2">
              Comece hoje. <span className="soft">É grátis.</span>
            </h2>
            <p className="lede">Baixe o app, entre com seu celular e cadastre seu primeiro medicamento.</p>
            <StoreButtons withQr />
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="wrap footer-inner">
          <p>Clickcannabis S.A. · CNPJ 58.090.406/0001-92</p>
          <nav aria-label="Links do app">
            <a href="/app/suporte">Suporte</a>
            <a href="/app/privacidade">Privacidade</a>
            <a href="/app/excluir-conta">Excluir conta</a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
