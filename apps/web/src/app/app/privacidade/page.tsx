import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Política de Privacidade — ClickCannabis",
  description:
    "Política de privacidade do aplicativo ClickCannabis. Saiba como tratamos seus dados.",
};

export default function PrivacidadePage() {
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
        <div style={{ marginBottom: 40 }}>
          <h1
            style={{
              fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              lineHeight: 1.15,
              color: "#0B3D1E",
            }}
          >
            Política de Privacidade
          </h1>
          <p
            style={{
              marginTop: 12,
              fontSize: 14,
              color: "#7A9A88",
            }}
          >
            Última atualização: 1 de abril de 2026 — Aplicativo ClickCannabis
            para Android
          </p>
        </div>

        <article>
          <style>{`
            .privacy h2 {
              font-size: 1.25rem;
              font-weight: 700;
              color: #0B3D1E;
              margin-top: 40px;
              margin-bottom: 12px;
              letter-spacing: -0.01em;
            }
            .privacy p {
              font-size: 15px;
              line-height: 1.7;
              color: #4A6B56;
              margin-bottom: 16px;
            }
            .privacy strong {
              color: #0A1F12;
              font-weight: 600;
            }
            .privacy table {
              width: 100%;
              border-collapse: collapse;
              margin: 16px 0 24px;
              font-size: 14px;
            }
            .privacy th {
              text-align: left;
              padding: 10px 12px;
              background: #E8F5EC;
              color: #1B6B3A;
              font-weight: 600;
              border-bottom: 2px solid rgba(11, 61, 30, 0.1);
            }
            .privacy td {
              padding: 10px 12px;
              border-bottom: 1px solid rgba(11, 61, 30, 0.06);
              color: #4A6B56;
            }
            .privacy blockquote {
              margin: 20px 0;
              padding: 16px 20px;
              background: #E8F5EC;
              border-left: 3px solid #1B6B3A;
              border-radius: 0 12px 12px 0;
              font-size: 14px;
              color: #1B6B3A;
              font-weight: 500;
            }
            .privacy ul {
              padding-left: 20px;
              margin: 8px 0 16px;
            }
            .privacy li {
              font-size: 15px;
              line-height: 1.7;
              color: #4A6B56;
              margin-bottom: 6px;
            }
            .privacy a {
              color: #1B6B3A;
              text-decoration: underline;
              text-underline-offset: 2px;
            }
            .privacy hr {
              border: none;
              border-top: 1px solid rgba(11, 61, 30, 0.08);
              margin: 40px 0;
            }
          `}</style>

          <div className="privacy">
            <h2>1. Introdução</h2>
            <p>
              A <strong>HEALTH MEDIA LTDA</strong> (&ldquo;nós&rdquo;,
              &ldquo;nosso&rdquo; ou &ldquo;Empresa&rdquo;), pessoa jurídica
              responsável pelo aplicativo <strong>ClickCannabis</strong>, tem o
              compromisso de proteger a privacidade e os dados dos seus
              usuários.
            </p>
            <p>
              Esta Política de Privacidade descreve de forma clara e
              transparente quais informações são — ou não são — coletadas, como
              são utilizadas, armazenadas, protegidas e eliminadas, em
              conformidade com a Lei Geral de Proteção de Dados Pessoais (Lei
              nº 13.709/2018 — LGPD) e as políticas de dados do Google Play.
            </p>
            <p>
              Ao utilizar o aplicativo ClickCannabis, você declara estar ciente
              e de acordo com os termos desta Política.
            </p>

            <h2>2. Dados que não coletamos</h2>
            <p>
              O aplicativo ClickCannabis{" "}
              <strong>não coleta, armazena ou processa</strong> quaisquer dados
              pessoais identificáveis dos seus usuários. Isto inclui, mas não
              se limita a:
            </p>
            <table>
              <thead>
                <tr>
                  <th>Categoria de dados</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Dados pessoais (nome, CPF, e-mail, telefone)</td>
                  <td>Não coletado</td>
                </tr>
                <tr>
                  <td>
                    Dados de saúde (prescrições, diagnósticos, tratamentos)
                  </td>
                  <td>Não coletado</td>
                </tr>
                <tr>
                  <td>Dados financeiros (cartão de crédito, dados bancários)</td>
                  <td>Não coletado</td>
                </tr>
                <tr>
                  <td>Dados de localização (GPS, geolocalização)</td>
                  <td>Não coletado</td>
                </tr>
                <tr>
                  <td>
                    Dados biométricos (impressão digital, reconhecimento facial)
                  </td>
                  <td>Não coletado</td>
                </tr>
                <tr>
                  <td>Fotos, arquivos ou conteúdos do dispositivo</td>
                  <td>Não coletado</td>
                </tr>
              </tbody>
            </table>
            <blockquote>
              O ClickCannabis não acessa, coleta, utiliza, armazena nem
              compartilha nenhuma informação relacionada à saúde dos usuários.
            </blockquote>

            <h2>3. Dados técnicos — Notificações push</h2>
            <p>
              Para o envio de notificações push, o aplicativo utiliza o serviço{" "}
              <strong>Firebase Cloud Messaging (FCM)</strong> do Google. Ao
              aceitar receber notificações, um{" "}
              <strong>token de registro do dispositivo</strong> é gerado
              automaticamente pelo serviço do Google.
            </p>
            <p>
              Este token é um identificador técnico anônimo, utilizado
              exclusivamente para a entrega de notificações, e{" "}
              <strong>não permite identificar o usuário pessoalmente</strong>.
            </p>
            <table>
              <thead>
                <tr>
                  <th>Informação técnica</th>
                  <th>Finalidade</th>
                  <th>Compartilhamento</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Token de push notification (FCM)</td>
                  <td>Envio de notificações ao dispositivo</td>
                  <td>Apenas Google (Firebase)</td>
                </tr>
              </tbody>
            </table>
            <p>
              O usuário pode revogar a permissão de notificações a qualquer
              momento por meio das configurações do sistema Android, o que
              invalida automaticamente o token associado.
            </p>

            <h2>4. Compartilhamento com terceiros</h2>
            <p>
              O ClickCannabis{" "}
              <strong>
                não compartilha, vende, aluga ou divulga
              </strong>{" "}
              quaisquer dados dos seus usuários a terceiros, sejam empresas,
              anunciantes, parceiros comerciais ou quaisquer outras entidades.
            </p>
            <p>
              A única interação técnica com serviço externo é o Firebase Cloud
              Messaging (Google), utilizado exclusivamente para a
              funcionalidade de notificações push.
            </p>

            <h2>5. Armazenamento e retenção de dados</h2>
            <p>
              Uma vez que o aplicativo não coleta dados pessoais,{" "}
              <strong>não há dados pessoais armazenados</strong> em nossos
              servidores ou em quaisquer sistemas sob nossa gestão.
            </p>
            <p>
              O token de notificação push (FCM) é gerenciado diretamente pelo
              Google e está sujeito às políticas de privacidade e retenção do
              Google. Este token é automaticamente invalidado quando o usuário
              desinstala o aplicativo ou desativa as notificações.
            </p>

            <h2>6. Exclusão de dados</h2>
            <p>
              Como o ClickCannabis não coleta nem armazena dados pessoais,{" "}
              <strong>não há dados pessoais a serem excluídos</strong>.
            </p>
            <p>
              Caso o usuário deseje eliminar qualquer informação técnica
              associada ao aplicativo, pode realizar as seguintes ações:
            </p>
            <p>
              <strong>Desativar notificações push:</strong> Acesse
              Configurações do Android &rarr; Aplicativos &rarr; ClickCannabis
              &rarr; Notificações &rarr; Desativar. Isso invalida o token FCM
              automaticamente.
            </p>
            <p>
              <strong>Desinstalar o aplicativo:</strong> A desinstalação remove
              todos os dados locais do aplicativo e invalida o token de push
              notification.
            </p>
            <p>
              Ainda assim, caso o usuário deseje fazer uma solicitação formal
              de exclusão de dados ou tenha qualquer dúvida, poderá entrar em
              contato pelo e-mail{" "}
              <a href="mailto:clickcannabis@clickcannabis.com">
                clickcannabis@clickcannabis.com
              </a>
              . Toda solicitação será respondida no prazo máximo de{" "}
              <strong>15 (quinze) dias úteis</strong>.
            </p>

            <h2>7. Segurança</h2>
            <p>
              Embora o aplicativo não colete dados pessoais, adotamos boas
              práticas de segurança no desenvolvimento e na manutenção do
              ClickCannabis, incluindo a utilização de comunicação
              criptografada (HTTPS) e a atualização periódica de dependências
              e bibliotecas.
            </p>

            <h2>8. Menores de idade</h2>
            <p>
              O aplicativo ClickCannabis é destinado exclusivamente a{" "}
              <strong>pessoas maiores de 18 anos</strong>. Não coletamos
              intencionalmente dados de menores de idade. Caso identifiquemos
              qualquer uso por menor, tomaremos as medidas cabíveis para
              impedir esse acesso.
            </p>

            <h2>9. Permissões do aplicativo</h2>
            <p>
              O ClickCannabis solicita apenas a seguinte permissão ao
              dispositivo:
            </p>
            <table>
              <thead>
                <tr>
                  <th>Permissão</th>
                  <th>Finalidade</th>
                  <th>Obrigatória</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Notificações (POST_NOTIFICATIONS)</td>
                  <td>
                    Enviar comunicações, avisos e atualizações ao usuário
                  </td>
                  <td>Opcional</td>
                </tr>
              </tbody>
            </table>
            <p>
              Nenhuma outra permissão é solicitada. O aplicativo não acessa
              câmera, microfone, contatos, galeria de fotos, localização ou
              qualquer outro recurso do dispositivo.
            </p>

            <h2>10. Alterações nesta Política</h2>
            <p>
              A HEALTH MEDIA LTDA reserva-se o direito de atualizar esta
              Política de Privacidade a qualquer momento. Quaisquer alterações
              serão publicadas nesta página, com a data de atualização revisada
              no topo do documento. Recomendamos que os usuários consultem esta
              página periodicamente.
            </p>

            <h2>11. Contato</h2>
            <ul>
              <li>
                <strong>Empresa:</strong> HEALTH MEDIA LTDA
              </li>
              <li>
                <strong>CNPJ n⁰:</strong> 41.247.190/0001-23
              </li>
              <li>
                <strong>Aplicativo:</strong> ClickCannabis
              </li>
              <li>
                <strong>E-mail:</strong>{" "}
                <a href="mailto:clickcannabis@clickcannabis.com">
                  clickcannabis@clickcannabis.com
                </a>
              </li>
              <li>
                <strong>Prazo de resposta:</strong> Até 15 dias úteis
              </li>
            </ul>

            <h2>12. Legislação aplicável</h2>
            <p>
              Esta Política de Privacidade é regida pela legislação brasileira,
              em especial pela Lei Geral de Proteção de Dados Pessoais (Lei nº
              13.709/2018 — LGPD). Eventuais disputas serão dirimidas no foro
              da comarca da sede da Empresa.
            </p>

            <hr />

            <p style={{ fontSize: 13, color: "#7A9A88", textAlign: "center" }}>
              © 2026 HEALTH MEDIA LTDA. Todos os direitos reservados.
            </p>
          </div>
        </article>
      </main>
    </div>
  );
}
