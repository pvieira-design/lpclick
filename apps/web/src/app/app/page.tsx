"use client";

import { useEffect, useState } from "react";

const FEATURES = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="4" width="20" height="20" rx="4" />
        <path d="M10 14.5l3 3 5.5-6" />
      </svg>
    ),
    title: "Controle de Doses",
    desc: "Cada dose registrada no momento exato. Sem esquecimentos, sem duplicações. Você foca no tratamento, o app cuida do resto.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="14" cy="14" r="10" />
        <path d="M14 8v6l4 2" />
      </svg>
    ),
    title: "Lembretes Sob Medida",
    desc: "Alarmes que respeitam a sua rotina. Configure horários flexíveis e receba notificações discretas quando for hora da próxima dose.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 20l4-4 3 3 5-6 4 4 4-5" />
        <rect x="4" y="4" width="20" height="20" rx="3" />
      </svg>
    ),
    title: "Relatórios para o Médico",
    desc: "Histórico detalhado de adesão ao tratamento. Exporte e compartilhe com seu prescritor em cada consulta de retorno.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="6" y="3" width="16" height="22" rx="3" />
        <circle cx="14" cy="19" r="1.5" />
        <path d="M10 3v2h8V3" />
      </svg>
    ),
    title: "Seus Dados, Só Seus",
    desc: "Criptografia de ponta a ponta. Nenhum dado é vendido ou compartilhado. Privacidade não é feature, é fundamento.",
  },
] as const;

const STEPS = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 2l-8 8h5v8h6v-8h5z" />
      </svg>
    ),
    text: "Baixe gratuitamente na App Store ou Google Play",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 5h12M4 10h12M4 15h8" />
      </svg>
    ),
    text: "Cadastre seus medicamentos e dosagens",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2v4M7 2v4M3 8h14M3 5a2 2 0 012-2h10a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V5z" />
      </svg>
    ),
    text: "Receba lembretes personalizados no seu horário",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="10" cy="10" r="7" />
        <path d="M7 10l2 2 4-4" />
      </svg>
    ),
    text: "Acompanhe sua evolução e compartilhe com o médico",
  },
] as const;

const APPLE_STORE_URL = "https://apps.apple.com/app/click-cannabis";
const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=com.clickcannabis";

export default function AppLandingPage() {
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set([...prev, entry.target.id]));
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );

    const sections = document.querySelectorAll("[data-animate]");
    for (const section of sections) observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const isVisible = (id: string) => visibleSections.has(id);

  return (
    <>
      <style>{`
        :root {
          --green-deep: #0B3D1E;
          --green-mid: #1B6B3A;
          --green-accent: #2ECC71;
          --green-pale: #E8F5EC;
          --green-glass: rgba(46, 204, 113, 0.08);
          --surface: #FFFFFF;
          --text-primary: #0A1F12;
          --text-secondary: #4A6B56;
          --text-muted: #7A9A88;
          --border: rgba(11, 61, 30, 0.08);
          --font-inter: var(--font-inter-loaded), 'Inter', system-ui, sans-serif;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(32px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-24px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          33% { transform: translateY(-6px) rotate(0.5deg); }
          66% { transform: translateY(3px) rotate(-0.3deg); }
        }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(46, 204, 113, 0.3); }
          50% { box-shadow: 0 0 0 12px rgba(46, 204, 113, 0); }
        }
        @keyframes grain {
          0%, 100% { transform: translate(0, 0); }
          10% { transform: translate(-5%, -10%); }
          30% { transform: translate(3%, -15%); }
          50% { transform: translate(12%, 9%); }
          70% { transform: translate(9%, 4%); }
          90% { transform: translate(-1%, 7%); }
        }

        .hero-gradient {
          background: white;
        }

        .grain::after {
          display: none;
        }

        .anim-up {
          opacity: 0;
          animation: fadeUp 800ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .anim-up-d1 { animation-delay: 80ms; }
        .anim-up-d2 { animation-delay: 180ms; }
        .anim-up-d3 { animation-delay: 300ms; }
        .anim-up-d4 { animation-delay: 440ms; }
        .anim-up-d5 { animation-delay: 580ms; }

        .reveal {
          opacity: 0;
          transform: translateY(28px);
          transition: opacity 700ms cubic-bezier(0.16, 1, 0.3, 1),
                      transform 700ms cubic-bezier(0.16, 1, 0.3, 1);
        }
        .reveal.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .feature-card {
          position: relative;
          background: white;
          border: 1px solid var(--border);
          border-radius: 20px;
          padding: 28px;
          transition: transform 300ms cubic-bezier(0.16, 1, 0.3, 1),
                      box-shadow 300ms cubic-bezier(0.16, 1, 0.3, 1),
                      border-color 300ms ease;
          overflow: hidden;
        }
        .feature-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, var(--green-accent), transparent);
          opacity: 0;
          transition: opacity 300ms ease;
        }
        .feature-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 60px rgba(11, 61, 30, 0.08), 0 8px 24px rgba(11, 61, 30, 0.04);
          border-color: rgba(46, 204, 113, 0.2);
        }
        .feature-card:hover::before { opacity: 1; }

        .store-btn {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 12px;
          padding: 14px 24px;
          border-radius: 14px;
          font-weight: 600;
          transition: transform 200ms cubic-bezier(0.16, 1, 0.3, 1),
                      box-shadow 200ms cubic-bezier(0.16, 1, 0.3, 1);
          overflow: hidden;
        }
        .store-btn::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%);
          pointer-events: none;
        }
        .store-btn:hover {
          transform: translateY(-3px) scale(1.02);
          box-shadow: 0 16px 48px rgba(11, 61, 30, 0.15), 0 6px 16px rgba(11, 61, 30, 0.08);
        }
        .store-btn:active {
          transform: translateY(0) scale(0.98);
        }

        .step-line {
          position: absolute;
          left: 19px;
          top: 44px;
          bottom: -20px;
          width: 1px;
          background: linear-gradient(180deg, var(--green-accent) 0%, transparent 100%);
        }

        .stat-card {
          background: linear-gradient(135deg, var(--green-deep) 0%, #14532d 100%);
          border-radius: 20px;
          padding: 32px;
          color: white;
          position: relative;
          overflow: hidden;
        }
        .stat-card::after {
          content: '';
          position: absolute;
          top: -50%;
          right: -50%;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle, rgba(46, 204, 113, 0.15) 0%, transparent 70%);
          pointer-events: none;
        }

        .mesh-bg {
          background: white;
        }

        @media (prefers-reduced-motion: reduce) {
          .anim-up, .reveal { opacity: 1; transform: none; animation: none; transition: none; }
          .grain::after { animation: none; }
          .feature-card, .store-btn { transition: none; }
        }
      `}</style>

      <div className="min-h-svh" style={{ background: "var(--surface)", color: "var(--text-primary)", fontFamily: "var(--font-inter)" }}>

        {/* ─── NAV ─── */}
        <nav className="anim-up fixed top-0 inset-x-0 z-50" style={{ backdropFilter: "blur(16px) saturate(180%)", WebkitBackdropFilter: "blur(16px) saturate(180%)", background: "rgba(255, 255, 255, 0.8)" }}>
          <div className="mx-auto max-w-5xl flex items-center justify-between px-6 py-4">
            <img src="/logo.svg" alt="Click Cannabis" width={140} height={20} fetchPriority="high" decoding="async" />
            <a
              href={APPLE_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold px-5 py-2.5 rounded-full transition-colors"
              style={{ background: "var(--green-deep)", color: "white" }}
            >
              Baixar App
            </a>
          </div>
        </nav>

        {/* ─── HERO ─── */}
        <section
          className="hero-gradient relative overflow-hidden pt-28 pb-20 sm:pt-36 sm:pb-28"
        >
          {/* Animated mesh orb */}

          <div className="relative mx-auto max-w-3xl px-6 text-center">
            {/* Status pill */}
            <div className="anim-up inline-flex items-center gap-2.5 rounded-full px-4 py-2 mb-8" style={{ background: "var(--green-glass)", border: "1px solid rgba(46, 204, 113, 0.15)" }}>
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full opacity-60" style={{ background: "var(--green-accent)", animation: "pulseGlow 2s ease-in-out infinite" }} />
                <span className="relative inline-flex h-2 w-2 rounded-full" style={{ background: "var(--green-accent)" }} />
              </span>
              <span className="text-sm font-medium" style={{ color: "var(--green-mid)" }}>
                Disponível para iOS e Android
              </span>
            </div>

            {/* Headline */}
            <h1 className="anim-up anim-up-d1" style={{ fontSize: "clamp(2.5rem, 6vw, 4rem)", lineHeight: 1.05, letterSpacing: "-0.03em", fontWeight: 300 }}>
              O controle do seu
              <br />
              <span style={{ fontWeight: 700, color: "var(--green-deep)" }}>
                tratamento,{" "}
                <span style={{ background: "linear-gradient(135deg, var(--green-deep) 0%, var(--green-mid) 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  simplificado
                </span>
              </span>
            </h1>

            <p className="anim-up anim-up-d2 mx-auto mt-6 max-w-lg text-lg leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              Organize medicamentos, receba lembretes inteligentes e acompanhe sua evolução.
              Tudo em um app projetado para quem usa cannabis medicinal.
            </p>

            {/* Store buttons */}
            <div className="anim-up anim-up-d3 mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href={APPLE_STORE_URL} target="_blank" rel="noopener noreferrer" className="store-btn text-white" style={{ background: "var(--green-deep)" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                <div className="text-left">
                  <div className="text-[10px] leading-none opacity-60 font-normal">Baixe na</div>
                  <div className="text-[15px] leading-tight font-semibold">App Store</div>
                </div>
              </a>
              <a href={PLAY_STORE_URL} target="_blank" rel="noopener noreferrer" className="store-btn text-white" style={{ background: "var(--green-deep)" }}>
                <svg width="20" height="22" viewBox="0 0 22 24" fill="currentColor"><path d="M1.22.557c-.3.3-.44.75-.44 1.28v20.33c0 .53.15.97.46 1.28l.07.06L12.9 12.03v-.06L1.29.49 1.22.557zM16.78 15.92l-3.88-3.89v-.06l3.88-3.89.09.05 4.6 2.61c1.31.75 1.31 1.97 0 2.71l-4.6 2.61-.09.05v-.19zM16.87 16.11L12.9 12.03 1.36 23.57c.43.46 1.15.52 1.96.08l13.55-7.54zM16.87 7.95L3.32.41C2.51-.03 1.79.03 1.36.49L12.9 12.03l3.97-4.08z"/></svg>
                <div className="text-left">
                  <div className="text-[10px] leading-none opacity-60 font-normal">Disponível no</div>
                  <div className="text-[15px] leading-tight font-semibold">Google Play</div>
                </div>
              </a>
            </div>

            {/* Proof strip */}
            <div className="anim-up anim-up-d4 mt-12 flex items-center justify-center gap-3 text-sm" style={{ color: "var(--text-muted)" }}>
              <div className="flex -space-x-2">
                {[0,1,2,3].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold text-white" style={{ background: `hsl(${150 + i * 15}, 45%, ${35 + i * 5}%)` }}>
                    {["M","A","R","P"][i]}
                  </div>
                ))}
              </div>
              <span>Mais de <strong style={{ color: "var(--text-primary)" }}>50 mil pacientes</strong> atendidos</span>
            </div>
          </div>
        </section>

        {/* ─── STATS BAR ─── */}
        <section className="relative -mt-8 z-10 px-6" id="stats" data-animate>
          <div className={`reveal mx-auto max-w-4xl grid grid-cols-3 gap-px rounded-2xl overflow-hidden shadow-xl shadow-green-900/5 ${isVisible("stats") ? "visible" : ""}`} style={{ background: "var(--border)" }}>
            {[
              { value: "50K+", label: "Consultas Realizadas" },
              { value: "4.9", label: "Avaliação no Google" },
              { value: "RA1000", label: "Reclame Aqui" },
            ].map((stat, i) => (
              <div key={stat.label} className="bg-white py-6 sm:py-8 text-center" style={{ transitionDelay: `${i * 100}ms` }}>
                <div className="text-2xl sm:text-3xl font-bold" style={{ color: "var(--green-deep)" }}>{stat.value}</div>
                <div className="mt-1 text-xs sm:text-sm" style={{ color: "var(--text-muted)" }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── FEATURES ─── */}
        <section className="mesh-bg py-24 sm:py-32 px-6" id="features" data-animate>
          <div className="mx-auto max-w-4xl">
            <div className={`reveal text-center mb-16 ${isVisible("features") ? "visible" : ""}`}>
              <div className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 mb-5 text-xs font-semibold tracking-wider uppercase" style={{ background: "var(--green-pale)", color: "var(--green-mid)" }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M7 1v12M1 7h12"/></svg>
                Funcionalidades
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight" style={{ letterSpacing: "-0.02em" }}>
                Projetado para quem leva
                <br />
                <span style={{ color: "var(--green-mid)" }}>o tratamento a sério</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {FEATURES.map((f, i) => (
                <div
                  key={f.title}
                  id={`feat-${i}`}
                  data-animate
                  className={`feature-card reveal ${isVisible(`feat-${i}`) ? "visible" : ""}`}
                  style={{ transitionDelay: `${i * 80}ms` }}
                >
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5" style={{ background: "var(--green-pale)", color: "var(--green-mid)" }}>
                    {f.icon}
                  </div>
                  <h3 className="text-lg font-bold mb-2" style={{ color: "var(--text-primary)" }}>{f.title}</h3>
                  <p className="text-[15px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── HOW IT WORKS ─── */}
        <section className="py-24 sm:py-32 px-6" style={{ background: "white" }} id="steps" data-animate>
          <div className="mx-auto max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Left: text */}
            <div className={`reveal ${isVisible("steps") ? "visible" : ""}`}>
              <div className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 mb-5 text-xs font-semibold tracking-wider uppercase" style={{ background: "var(--green-pale)", color: "var(--green-mid)" }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 7h10M7 2l5 5-5 5"/></svg>
                Como Funciona
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4" style={{ letterSpacing: "-0.02em" }}>
                Do download ao controle total em{" "}
                <span style={{ color: "var(--green-mid)" }}>menos de um minuto</span>
              </h2>
              <p className="text-base leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                Sem cadastro complicado, sem curva de aprendizado. O app foi feito para ser intuitivo desde o primeiro toque.
              </p>
            </div>

            {/* Right: steps */}
            <div className="space-y-8">
              {STEPS.map((s, i) => (
                <div
                  key={i}
                  id={`step-${i}`}
                  data-animate
                  className={`reveal relative flex items-start gap-5 ${isVisible(`step-${i}`) ? "visible" : ""}`}
                  style={{ transitionDelay: `${i * 120}ms` }}
                >
                  {i < STEPS.length - 1 && <div className="step-line" />}
                  <div className="relative z-10 w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-white font-bold text-sm" style={{ background: "var(--green-deep)" }}>
                    {i + 1}
                  </div>
                  <div className="pt-1.5">
                    <p className="text-[15px] font-medium leading-relaxed" style={{ color: "var(--text-primary)" }}>{s.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── TRUST SECTION ─── */}
        <section className="py-24 sm:py-32 px-6" style={{ background: "var(--surface)" }} id="trust" data-animate>
          <div className="mx-auto max-w-4xl">
            <div className={`reveal stat-card grain text-center ${isVisible("trust") ? "visible" : ""}`}>
              <h2 className="relative text-2xl sm:text-3xl font-bold tracking-tight mb-4">
                A confiança de quem já transformou
                <br />
                sua vida com cannabis medicinal
              </h2>
              <p className="relative text-base opacity-70 mb-10 max-w-lg mx-auto">
                A Click Cannabis é a maior plataforma de telemedicina canábica do Brasil. Nota máxima no Reclame Aqui, avaliação 4.9 no Google.
              </p>
              <div className={`relative reveal flex items-center justify-center gap-8 sm:gap-12 ${isVisible("trust") ? "visible" : ""}`} style={{ transitionDelay: "200ms" }}>
                <img src="/1.webp" alt="Ótimo - Reclame Aqui" width={120} height={60} loading="lazy" decoding="async" className="h-12 sm:h-14 w-auto object-contain brightness-0 invert opacity-80" />
                <img src="/2.webp" alt="Certificado RA1000 - Reclame Aqui" width={120} height={60} loading="lazy" decoding="async" className="h-10 sm:h-12 w-auto object-contain brightness-0 invert opacity-80" />
                <img src="/3.webp" alt="4.9 Google - Avaliação de pacientes" width={120} height={60} loading="lazy" decoding="async" className="h-12 sm:h-14 w-auto object-contain brightness-0 invert opacity-80" />
              </div>
            </div>
          </div>
        </section>

        {/* ─── FINAL CTA ─── */}
        <section className="py-24 sm:py-32 px-6" style={{ background: "white" }} id="cta" data-animate>
          <div className="mx-auto max-w-2xl text-center">
            <div className={`reveal ${isVisible("cta") ? "visible" : ""}`}>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4" style={{ letterSpacing: "-0.02em" }}>
                Comece agora.{" "}
                <span style={{ color: "var(--green-mid)" }}>Gratuito.</span>
              </h2>
              <p className="text-base mb-10" style={{ color: "var(--text-secondary)" }}>
                Sem assinatura, sem anúncios, sem surpresas.
                <br />
                Apenas o app que o seu tratamento merece.
              </p>
            </div>

            <div className={`reveal flex flex-col sm:flex-row items-center justify-center gap-4 ${isVisible("cta") ? "visible" : ""}`} style={{ transitionDelay: "150ms" }}>
              <a href={APPLE_STORE_URL} target="_blank" rel="noopener noreferrer" className="store-btn text-white" style={{ background: "var(--green-deep)" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                <div className="text-left">
                  <div className="text-[10px] leading-none opacity-60 font-normal">Baixe na</div>
                  <div className="text-[15px] leading-tight font-semibold">App Store</div>
                </div>
              </a>
              <a href={PLAY_STORE_URL} target="_blank" rel="noopener noreferrer" className="store-btn text-white" style={{ background: "var(--green-deep)" }}>
                <svg width="20" height="22" viewBox="0 0 22 24" fill="currentColor"><path d="M1.22.557c-.3.3-.44.75-.44 1.28v20.33c0 .53.15.97.46 1.28l.07.06L12.9 12.03v-.06L1.29.49 1.22.557zM16.78 15.92l-3.88-3.89v-.06l3.88-3.89.09.05 4.6 2.61c1.31.75 1.31 1.97 0 2.71l-4.6 2.61-.09.05v-.19zM16.87 16.11L12.9 12.03 1.36 23.57c.43.46 1.15.52 1.96.08l13.55-7.54zM16.87 7.95L3.32.41C2.51-.03 1.79.03 1.36.49L12.9 12.03l3.97-4.08z"/></svg>
                <div className="text-left">
                  <div className="text-[10px] leading-none opacity-60 font-normal">Disponível no</div>
                  <div className="text-[15px] leading-tight font-semibold">Google Play</div>
                </div>
              </a>
            </div>
          </div>
        </section>

        {/* ─── FOOTER ─── */}
        <footer className="py-10 px-6" style={{ borderTop: "1px solid var(--border)", background: "var(--surface)" }}>
          <div className="mx-auto max-w-4xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <img src="/logo.svg" alt="Click Cannabis" width={120} height={17} loading="lazy" decoding="async" className="opacity-30" />
            <div className="text-center sm:text-right">
              <p className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>Clickcannabis S.A.</p>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)", opacity: 0.6 }}>CNPJ n⁰ 58.090.406/0001-92</p>
              <a href="/app/privacidade" className="text-xs mt-1 inline-block underline" style={{ color: "var(--text-muted)", opacity: 0.6, textUnderlineOffset: 2 }}>Política de Privacidade</a>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
