import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Suporte — ClickCannabis",
  description:
    "Central de suporte do aplicativo ClickCannabis. Tire dúvidas, reporte problemas e fale com nossa equipe.",
};

const SUPPORT_EMAIL = "clickcannabis@clickcannabis.com";

const FAQS = [
  {
    q: "Como instalo o aplicativo ClickCannabis?",
    a: "O ClickCannabis está disponível gratuitamente na App Store (iOS) e na Google Play (Android). Basta procurar por \u201cClickCannabis\u201d na loja do seu dispositivo e tocar em instalar.",
  },
  {
    q: "Preciso pagar alguma coisa para usar o app?",
    a: "Não. O ClickCannabis é totalmente gratuito. Não há assinatura, compras dentro do aplicativo ou anúncios.",
  },
  {
    q: "Como cadastro meus medicamentos e lembretes?",
    a: "Após abrir o aplicativo, toque em \u201cAdicionar medicamento\u201d, informe o nome, dosagem e os horários desejados. O app irá enviar notificações automaticamente nos horários configurados.",
  },
  {
    q: "Não estou recebendo as notificações de lembretes.",
    a: "Verifique se as notificações estão ativadas em Configurações \u2192 Aplicativos \u2192 ClickCannabis \u2192 Notificações. Em alguns aparelhos Android também é necessário desativar a otimização de bateria para o app.",
  },
  {
    q: "Meus dados ficam salvos se eu trocar de celular?",
    a: "Os dados do ClickCannabis são armazenados localmente no seu dispositivo, por questões de privacidade. Ao trocar de aparelho, será necessário cadastrar os medicamentos novamente.",
  },
  {
    q: "Como exporto meu histórico para mostrar ao médico?",
    a: "Dentro do app, acesse \u201cRelatórios\u201d e toque em \u201cExportar\u201d. Você poderá compartilhar um resumo da sua adesão ao tratamento por e-mail, WhatsApp ou outros aplicativos.",
  },
  {
    q: "Encontrei um problema ou tenho uma sugestão. O que faço?",
    a: `Adoramos receber feedback! Envie um e-mail para ${SUPPORT_EMAIL} descrevendo o problema, o modelo do seu celular e a versão do sistema operacional. Vamos responder o quanto antes.`,
  },
] as const;

export default function SuportePage() {
  return (
    <div
      className={inter.className}
      style={{
        minHeight: "100svh",
        background: "#FAFCFB",
        color: "#0A1F12",
      }}
    >
      {/* Nav */}
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          backdropFilter: "blur(16px) saturate(180%)",
          WebkitBackdropFilter: "blur(16px) saturate(180%)",
          background: "rgba(250, 252, 251, 0.85)",
          borderBottom: "1px solid rgba(11, 61, 30, 0.06)",
        }}
      >
        <div
          style={{
            maxWidth: 720,
            margin: "0 auto",
            padding: "16px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <a href="/app">
            <img
              src="/logo.svg"
              alt="Click Cannabis"
              width={140}
              height={20}
            />
          </a>
          <a
            href="/app"
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: "#1B6B3A",
              textDecoration: "none",
            }}
          >
            Voltar ao App
          </a>
        </div>
      </nav>

      {/* Content */}
      <main
        style={{
          maxWidth: 720,
          margin: "0 auto",
          padding: "48px 24px 80px",
        }}
      >
        <div style={{ marginBottom: 32 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 12px",
              borderRadius: 999,
              background: "#E8F5EC",
              color: "#1B6B3A",
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              marginBottom: 16,
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="7" cy="7" r="5.5" />
              <path d="M7 4.5v3M7 9.5h0" />
            </svg>
            Central de Suporte
          </div>
          <h1
            style={{
              fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              lineHeight: 1.15,
              color: "#0B3D1E",
            }}
          >
            Como podemos ajudar?
          </h1>
          <p
            style={{
              marginTop: 12,
              fontSize: 16,
              lineHeight: 1.6,
              color: "#4A6B56",
              maxWidth: 560,
            }}
          >
            Estamos aqui para tirar dúvidas, resolver problemas e ouvir sugestões
            sobre o aplicativo ClickCannabis. Confira as perguntas frequentes ou
            entre em contato conosco diretamente.
          </p>
        </div>

        {/* Contact card */}
        <div
          style={{
            background: "linear-gradient(135deg, #0B3D1E 0%, #14532d 100%)",
            borderRadius: 20,
            padding: 32,
            color: "white",
            position: "relative",
            overflow: "hidden",
            marginBottom: 48,
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "-50%",
              right: "-30%",
              width: "80%",
              height: "200%",
              background:
                "radial-gradient(circle, rgba(46, 204, 113, 0.18) 0%, transparent 60%)",
              pointerEvents: "none",
            }}
          />
          <div style={{ position: "relative" }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: "rgba(255, 255, 255, 0.12)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 20,
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="M3 7l9 6 9-6" />
              </svg>
            </div>
            <h2
              style={{
                fontSize: 20,
                fontWeight: 700,
                marginBottom: 6,
                letterSpacing: "-0.01em",
              }}
            >
              Fale com nossa equipe
            </h2>
            <p
              style={{
                fontSize: 14,
                lineHeight: 1.6,
                color: "rgba(255, 255, 255, 0.75)",
                marginBottom: 20,
              }}
            >
              Envie sua dúvida, sugestão ou relato de problema para o e-mail
              abaixo. Nossa equipe responde em até 2 dias úteis.
            </p>
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                padding: "12px 20px",
                borderRadius: 12,
                background: "white",
                color: "#0B3D1E",
                fontSize: 15,
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="M3 7l9 6 9-6" />
              </svg>
              {SUPPORT_EMAIL}
            </a>
          </div>
        </div>

        {/* Quick info grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 16,
            marginBottom: 56,
          }}
        >
          <div
            style={{
              background: "white",
              border: "1px solid rgba(11, 61, 30, 0.08)",
              borderRadius: 16,
              padding: 20,
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: "#E8F5EC",
                color: "#1B6B3A",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 12,
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 2" />
              </svg>
            </div>
            <p
              style={{
                fontSize: 13,
                color: "#7A9A88",
                marginBottom: 4,
                fontWeight: 500,
              }}
            >
              Tempo de resposta
            </p>
            <p style={{ fontSize: 15, fontWeight: 600, color: "#0A1F12" }}>
              Até 2 dias úteis
            </p>
          </div>

          <div
            style={{
              background: "white",
              border: "1px solid rgba(11, 61, 30, 0.08)",
              borderRadius: 16,
              padding: 20,
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: "#E8F5EC",
                color: "#1B6B3A",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 12,
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="6" y="2" width="12" height="20" rx="2" />
                <path d="M10 18h4" />
              </svg>
            </div>
            <p
              style={{
                fontSize: 13,
                color: "#7A9A88",
                marginBottom: 4,
                fontWeight: 500,
              }}
            >
              Plataformas
            </p>
            <p style={{ fontSize: 15, fontWeight: 600, color: "#0A1F12" }}>
              iOS e Android
            </p>
          </div>

          <div
            style={{
              background: "white",
              border: "1px solid rgba(11, 61, 30, 0.08)",
              borderRadius: 16,
              padding: 20,
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: "#E8F5EC",
                color: "#1B6B3A",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 12,
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2l3 6 6 1-4.5 4.5L18 20l-6-3-6 3 1.5-6.5L3 9l6-1z" />
              </svg>
            </div>
            <p
              style={{
                fontSize: 13,
                color: "#7A9A88",
                marginBottom: 4,
                fontWeight: 500,
              }}
            >
              Custo
            </p>
            <p style={{ fontSize: 15, fontWeight: 600, color: "#0A1F12" }}>
              Gratuito, sem assinatura
            </p>
          </div>
        </div>

        {/* FAQ */}
        <section style={{ marginBottom: 56 }}>
          <h2
            style={{
              fontSize: "clamp(1.5rem, 3vw, 1.875rem)",
              fontWeight: 700,
              color: "#0B3D1E",
              letterSpacing: "-0.02em",
              marginBottom: 8,
            }}
          >
            Perguntas frequentes
          </h2>
          <p
            style={{
              fontSize: 15,
              color: "#7A9A88",
              marginBottom: 24,
            }}
          >
            As dúvidas mais comuns dos nossos usuários.
          </p>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            {FAQS.map((item) => (
              <details
                key={item.q}
                style={{
                  background: "white",
                  border: "1px solid rgba(11, 61, 30, 0.08)",
                  borderRadius: 14,
                  padding: "18px 20px",
                }}
              >
                <summary
                  style={{
                    fontSize: 15,
                    fontWeight: 600,
                    color: "#0A1F12",
                    cursor: "pointer",
                    listStyle: "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 12,
                  }}
                >
                  <span>{item.q}</span>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#1B6B3A"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ flexShrink: 0 }}
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </summary>
                <p
                  style={{
                    marginTop: 12,
                    fontSize: 14,
                    lineHeight: 1.7,
                    color: "#4A6B56",
                  }}
                >
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* Other contacts */}
        <section
          style={{
            background: "white",
            border: "1px solid rgba(11, 61, 30, 0.08)",
            borderRadius: 20,
            padding: 28,
            marginBottom: 32,
          }}
        >
          <h2
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: "#0B3D1E",
              marginBottom: 6,
              letterSpacing: "-0.01em",
            }}
          >
            Outros canais
          </h2>
          <p
            style={{
              fontSize: 14,
              color: "#7A9A88",
              marginBottom: 20,
            }}
          >
            Para assuntos específicos, utilize os contatos abaixo.
          </p>
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              display: "flex",
              flexDirection: "column",
              gap: 14,
            }}
          >
            <li
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 14,
                paddingBottom: 14,
                borderBottom: "1px solid rgba(11, 61, 30, 0.06)",
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: "#E8F5EC",
                  color: "#1B6B3A",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="M3 7l9 6 9-6" />
                </svg>
              </div>
              <div>
                <p
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: "#0A1F12",
                    marginBottom: 2,
                  }}
                >
                  Suporte geral
                </p>
                <a
                  href={`mailto:${SUPPORT_EMAIL}`}
                  style={{
                    fontSize: 14,
                    color: "#1B6B3A",
                    textDecoration: "underline",
                    textUnderlineOffset: 2,
                  }}
                >
                  {SUPPORT_EMAIL}
                </a>
              </div>
            </li>
            <li
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 14,
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: "#E8F5EC",
                  color: "#1B6B3A",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="4" y="4" width="16" height="16" rx="3" />
                  <path d="M9 12l2 2 4-4" />
                </svg>
              </div>
              <div>
                <p
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: "#0A1F12",
                    marginBottom: 2,
                  }}
                >
                  Privacidade e proteção de dados (DPO)
                </p>
                <a
                  href="mailto:privacidade@clickcannabis.com"
                  style={{
                    fontSize: 14,
                    color: "#1B6B3A",
                    textDecoration: "underline",
                    textUnderlineOffset: 2,
                  }}
                >
                  privacidade@clickcannabis.com
                </a>
              </div>
            </li>
          </ul>
        </section>

        {/* Company info */}
        <div
          style={{
            paddingTop: 24,
            borderTop: "1px solid rgba(11, 61, 30, 0.08)",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontSize: 13,
              color: "#7A9A88",
              marginBottom: 4,
              fontWeight: 500,
            }}
          >
            Clickcannabis S.A.
          </p>
          <p
            style={{
              fontSize: 12,
              color: "#7A9A88",
              opacity: 0.7,
              marginBottom: 12,
            }}
          >
            CNPJ n⁰ 58.090.406/0001-92
          </p>
          <a
            href="/app/privacidade"
            style={{
              fontSize: 12,
              color: "#7A9A88",
              textDecoration: "underline",
              textUnderlineOffset: 2,
            }}
          >
            Política de Privacidade
          </a>
        </div>
      </main>
    </div>
  );
}
