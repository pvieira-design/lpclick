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
            Última atualização: 2 de abril de 2026 — Aplicativo ClickCannabis
            para iOS e Android
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
              A <strong>Clickcannabis S.A.</strong> (&ldquo;nós&rdquo;,
              &ldquo;nosso&rdquo; ou &ldquo;Empresa&rdquo;), pessoa jurídica
              de direito privado, inscrita no CNPJ sob o n⁰ 58.090.406/0001-92,
              responsável pelo aplicativo <strong>ClickCannabis</strong>,
              disponível para os sistemas operacionais Android (Google Play) e iOS (Apple App Store),
              tem o compromisso de proteger a privacidade e os dados dos seus
              usuários.
            </p>
            <p>
              Esta Política de Privacidade descreve de forma clara e
              transparente quais informações são — ou não são — coletadas, como
              são utilizadas, armazenadas, protegidas e eliminadas, em
              conformidade com a{" "}
              <strong>Lei Geral de Proteção de Dados Pessoais</strong> (Lei
              nº 13.709/2018 — LGPD), as diretrizes da{" "}
              <strong>Apple App Store Review Guidelines</strong> e as{" "}
              <strong>Políticas do Programa para Desenvolvedores do Google Play</strong>.
            </p>
            <p>
              Ao utilizar o aplicativo ClickCannabis, você declara estar ciente
              e de acordo com os termos desta Política.
            </p>
            <blockquote>
              <strong>Aviso importante:</strong> O ClickCannabis{" "}
              <strong>não é um dispositivo médico</strong> e não se destina a
              diagnosticar, tratar, curar ou prevenir qualquer doença ou condição
              de saúde. O aplicativo é uma ferramenta de organização pessoal para
              auxiliar o usuário no acompanhamento de seu tratamento prescrito por
              profissional de saúde habilitado.
            </blockquote>

            <h2>2. Controlador de dados e Encarregado (DPO)</h2>
            <p>
              Para os fins da LGPD, o <strong>controlador</strong> dos dados é:
            </p>
            <ul>
              <li><strong>Razão social:</strong> Clickcannabis S.A.</li>
              <li><strong>CNPJ:</strong> 58.090.406/0001-92</li>
              <li><strong>E-mail do Encarregado de Dados (DPO):</strong>{" "}
                <a href="mailto:privacidade@clickcannabis.com">privacidade@clickcannabis.com</a>
              </li>
            </ul>
            <p>
              O Encarregado de Proteção de Dados (DPO) é o canal de comunicação
              entre o titular dos dados, a Clickcannabis S.A. e a Autoridade
              Nacional de Proteção de Dados (ANPD). Qualquer solicitação
              relacionada à proteção de dados pessoais pode ser encaminhada ao
              e-mail acima.
            </p>

            <h2>3. Dados que NÃO coletamos</h2>
            <p>
              O aplicativo ClickCannabis{" "}
              <strong>não coleta, transmite ou processa em servidores externos</strong>{" "}
              quaisquer dados pessoais identificáveis dos seus usuários. Isto inclui,
              mas não se limita a:
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
                  <td>Dados de saúde (prescrições, diagnósticos, tratamentos)</td>
                  <td>Não coletado pelo servidor</td>
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
                  <td>Dados biométricos (impressão digital, reconhecimento facial)</td>
                  <td>Não coletado</td>
                </tr>
                <tr>
                  <td>Fotos, arquivos ou conteúdos do dispositivo</td>
                  <td>Não coletado</td>
                </tr>
                <tr>
                  <td>Identificadores de publicidade (IDFA, GAID)</td>
                  <td>Não coletado</td>
                </tr>
                <tr>
                  <td>Cookies ou tecnologias de rastreamento</td>
                  <td>Não utilizado</td>
                </tr>
              </tbody>
            </table>
            <blockquote>
              O ClickCannabis <strong>não utiliza</strong> os dados dos usuários para
              fins de publicidade, marketing, mineração de dados, criação de perfis
              comportamentais ou qualquer outra finalidade além da funcionalidade
              direta do aplicativo.
            </blockquote>

            <h2>4. Dados armazenados localmente no dispositivo</h2>
            <p>
              Para oferecer suas funcionalidades — como o registro de doses,
              configuração de lembretes e acompanhamento da adesão ao tratamento —
              o aplicativo armazena informações{" "}
              <strong>exclusivamente no dispositivo do usuário</strong> (armazenamento
              local).
            </p>
            <p>
              Esses dados <strong>nunca são transmitidos</strong> para nossos
              servidores ou para qualquer terceiro. Eles permanecem sob o controle
              total do usuário e são eliminados automaticamente ao desinstalar o
              aplicativo ou ao limpar os dados do app nas configurações do dispositivo.
            </p>
            <table>
              <thead>
                <tr>
                  <th>Dado local</th>
                  <th>Finalidade</th>
                  <th>Transmitido a servidores?</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Registro de doses</td>
                  <td>Controle de adesão ao tratamento</td>
                  <td>Não</td>
                </tr>
                <tr>
                  <td>Configuração de lembretes</td>
                  <td>Notificações locais de horário</td>
                  <td>Não</td>
                </tr>
                <tr>
                  <td>Preferências do app</td>
                  <td>Personalização da experiência</td>
                  <td>Não</td>
                </tr>
              </tbody>
            </table>
            <blockquote>
              Importante: como esses dados existem apenas no dispositivo, a
              Clickcannabis S.A. <strong>não tem acesso</strong> a eles e{" "}
              <strong>não pode recuperá-los</strong> em caso de perda, troca de
              aparelho ou desinstalação do aplicativo.
            </blockquote>

            <h2>5. Dados técnicos — Notificações push</h2>
            <p>
              Para o envio de notificações push, o aplicativo utiliza o serviço{" "}
              <strong>Firebase Cloud Messaging (FCM)</strong> do Google (em dispositivos
              Android) e o <strong>Apple Push Notification Service (APNs)</strong> (em
              dispositivos iOS). Ao aceitar receber notificações, um{" "}
              <strong>token de registro do dispositivo</strong> é gerado
              automaticamente pelo serviço correspondente.
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
                  <th>Processado por</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Token FCM (Android)</td>
                  <td>Envio de notificações ao dispositivo</td>
                  <td>Google (Firebase)</td>
                </tr>
                <tr>
                  <td>Token APNs (iOS)</td>
                  <td>Envio de notificações ao dispositivo</td>
                  <td>Apple</td>
                </tr>
              </tbody>
            </table>
            <p>
              O usuário pode revogar a permissão de notificações a qualquer
              momento por meio das configurações do sistema operacional do seu
              dispositivo, o que invalida automaticamente o token associado.
            </p>

            <h2>6. Base legal para tratamento de dados (LGPD)</h2>
            <p>
              O tratamento dos dados técnicos mínimos descritos nesta Política
              ocorre com base nas seguintes hipóteses legais previstas na LGPD:
            </p>
            <table>
              <thead>
                <tr>
                  <th>Dado</th>
                  <th>Base legal (LGPD)</th>
                  <th>Artigo</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Token de push notification</td>
                  <td>Consentimento do titular</td>
                  <td>Art. 7º, I</td>
                </tr>
                <tr>
                  <td>Dados locais do dispositivo</td>
                  <td>Execução de contrato / Consentimento</td>
                  <td>Art. 7º, V e I</td>
                </tr>
              </tbody>
            </table>
            <p>
              <strong>Nota sobre dados sensíveis:</strong> Embora o ClickCannabis
              auxilie na organização de tratamentos de saúde, os dados de tratamento
              são armazenados <strong>exclusivamente no dispositivo do usuário</strong>,
              sem qualquer transmissão a servidores externos. Dessa forma, a
              Clickcannabis S.A. <strong>não realiza tratamento de dados pessoais sensíveis</strong>{" "}
              conforme definido pelo Art. 11 da LGPD.
            </p>

            <h2>7. Compartilhamento com terceiros</h2>
            <p>
              O ClickCannabis{" "}
              <strong>
                não compartilha, vende, aluga ou divulga
              </strong>{" "}
              quaisquer dados dos seus usuários a terceiros, sejam empresas,
              anunciantes, parceiros comerciais ou quaisquer outras entidades.
            </p>
            <p>
              As únicas interações técnicas com serviços externos são:
            </p>
            <table>
              <thead>
                <tr>
                  <th>Serviço</th>
                  <th>Provedor</th>
                  <th>Finalidade</th>
                  <th>Dados envolvidos</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Firebase Cloud Messaging</td>
                  <td>Google LLC</td>
                  <td>Notificações push (Android)</td>
                  <td>Token anônimo do dispositivo</td>
                </tr>
                <tr>
                  <td>Apple Push Notification Service</td>
                  <td>Apple Inc.</td>
                  <td>Notificações push (iOS)</td>
                  <td>Token anônimo do dispositivo</td>
                </tr>
              </tbody>
            </table>
            <p>
              Nenhum dado pessoal, dado de saúde ou informação identificável
              é transmitido a esses ou quaisquer outros serviços.
            </p>

            <h2>8. Transferência internacional de dados</h2>
            <p>
              Os tokens de notificação push podem ser processados em servidores do
              Google (Firebase) e da Apple localizados fora do Brasil, incluindo os
              Estados Unidos da América.
            </p>
            <p>
              Esses provedores operam em conformidade com padrões internacionais de
              proteção de dados e possuem cláusulas contratuais adequadas para
              transferências internacionais, em conformidade com o Art. 33 da LGPD.
              Para mais informações, consulte:
            </p>
            <ul>
              <li>
                <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
                  Política de Privacidade do Google
                </a>
              </li>
              <li>
                <a href="https://www.apple.com/legal/privacy/" target="_blank" rel="noopener noreferrer">
                  Política de Privacidade da Apple
                </a>
              </li>
            </ul>

            <h2>9. Armazenamento, retenção e exclusão de dados</h2>
            <p>
              <strong>Dados em nossos servidores:</strong> O aplicativo não coleta
              dados pessoais, portanto{" "}
              <strong>não há dados pessoais armazenados</strong> em nossos servidores
              ou em quaisquer sistemas sob nossa gestão.
            </p>
            <p>
              <strong>Dados locais no dispositivo:</strong> Os registros de doses,
              lembretes e preferências ficam armazenados exclusivamente no dispositivo
              do usuário e são eliminados ao desinstalar o aplicativo ou limpar os
              dados do app.
            </p>
            <p>
              <strong>Tokens de notificação:</strong> Gerenciados diretamente pelo
              Google (FCM) e pela Apple (APNs), estão sujeitos às políticas de
              retenção dos respectivos provedores. São automaticamente invalidados
              quando o usuário desinstala o aplicativo ou desativa as notificações.
            </p>

            <h2>10. Direitos do titular dos dados</h2>
            <p>
              Em conformidade com os artigos 17 a 22 da LGPD, você possui os
              seguintes direitos em relação aos seus dados pessoais:
            </p>
            <table>
              <thead>
                <tr>
                  <th>Direito</th>
                  <th>Descrição</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Confirmação e acesso</td>
                  <td>Saber se tratamos seus dados e obter cópia deles</td>
                </tr>
                <tr>
                  <td>Correção</td>
                  <td>Solicitar a correção de dados incompletos ou desatualizados</td>
                </tr>
                <tr>
                  <td>Anonimização ou eliminação</td>
                  <td>Solicitar a anonimização ou eliminação de dados desnecessários</td>
                </tr>
                <tr>
                  <td>Portabilidade</td>
                  <td>Solicitar a transferência dos seus dados a outro fornecedor</td>
                </tr>
                <tr>
                  <td>Eliminação</td>
                  <td>Solicitar a exclusão dos dados tratados com base em consentimento</td>
                </tr>
                <tr>
                  <td>Revogação do consentimento</td>
                  <td>Revogar o consentimento dado anteriormente, a qualquer momento</td>
                </tr>
                <tr>
                  <td>Oposição</td>
                  <td>Opor-se ao tratamento quando realizado com base em hipótese diferente de consentimento</td>
                </tr>
                <tr>
                  <td>Informação sobre compartilhamento</td>
                  <td>Saber com quais entidades seus dados são compartilhados</td>
                </tr>
              </tbody>
            </table>
            <p>
              Como o ClickCannabis não coleta dados pessoais em seus servidores,
              a maioria desses direitos já é atendida por padrão. Ainda assim, para
              exercer qualquer um desses direitos ou tirar dúvidas, entre em contato
              com nosso Encarregado de Dados (DPO) pelo e-mail{" "}
              <a href="mailto:privacidade@clickcannabis.com">
                privacidade@clickcannabis.com
              </a>
              . Toda solicitação será respondida no prazo máximo de{" "}
              <strong>15 (quinze) dias úteis</strong>.
            </p>

            <h2>11. Exclusão de dados e desinstalação</h2>
            <p>
              O usuário pode eliminar todos os dados associados ao aplicativo
              realizando as seguintes ações:
            </p>
            <ul>
              <li>
                <strong>Excluir dados locais:</strong> Acesse Configurações do
                dispositivo &rarr; Aplicativos &rarr; ClickCannabis &rarr;
                Armazenamento &rarr; Limpar dados. Isso apaga todos os registros
                de doses, lembretes e preferências.
              </li>
              <li>
                <strong>Desativar notificações push:</strong> Acesse Configurações
                do dispositivo &rarr; Aplicativos &rarr; ClickCannabis &rarr;
                Notificações &rarr; Desativar. Isso invalida o token de push
                automaticamente.
              </li>
              <li>
                <strong>Desinstalar o aplicativo:</strong> A desinstalação remove
                todos os dados locais do aplicativo e invalida o token de push
                notification.
              </li>
            </ul>
            <p>
              Caso deseje fazer uma solicitação formal de exclusão de dados ou tenha
              qualquer dúvida, entre em contato pelo e-mail{" "}
              <a href="mailto:privacidade@clickcannabis.com">
                privacidade@clickcannabis.com
              </a>
              .
            </p>

            <h2>12. Segurança</h2>
            <p>
              Adotamos medidas técnicas e organizacionais para proteger as informações
              dos usuários, incluindo:
            </p>
            <ul>
              <li>Comunicação criptografada via HTTPS/TLS em todas as conexões de rede</li>
              <li>Armazenamento local protegido pelo sistema operacional do dispositivo (sandbox)</li>
              <li>Atualização periódica de dependências e bibliotecas</li>
              <li>Revisão de código e boas práticas de desenvolvimento seguro</li>
              <li>Ausência de coleta de dados pessoais em servidores, eliminando riscos de vazamento</li>
            </ul>

            <h2>13. Menores de idade</h2>
            <p>
              O aplicativo ClickCannabis é destinado exclusivamente a{" "}
              <strong>pessoas maiores de 18 anos</strong>. O aplicativo não é
              direcionado a crianças ou adolescentes e não coleta intencionalmente
              dados de menores de idade, em conformidade com o Estatuto da Criança
              e do Adolescente (Lei nº 8.069/1990) e com a LGPD.
            </p>
            <p>
              Caso identifiquemos qualquer uso indevido por menor de idade,
              tomaremos as medidas cabíveis para impedir esse acesso.
            </p>

            <h2>14. Permissões do aplicativo</h2>
            <p>
              O ClickCannabis solicita apenas as seguintes permissões ao
              dispositivo:
            </p>
            <table>
              <thead>
                <tr>
                  <th>Permissão</th>
                  <th>Plataforma</th>
                  <th>Finalidade</th>
                  <th>Obrigatória</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Notificações (POST_NOTIFICATIONS)</td>
                  <td>Android</td>
                  <td>Lembretes de doses e comunicações ao usuário</td>
                  <td>Opcional</td>
                </tr>
                <tr>
                  <td>Notificações push</td>
                  <td>iOS</td>
                  <td>Lembretes de doses e comunicações ao usuário</td>
                  <td>Opcional</td>
                </tr>
              </tbody>
            </table>
            <p>
              Nenhuma outra permissão é solicitada. O aplicativo{" "}
              <strong>não acessa</strong> câmera, microfone, contatos, galeria de fotos,
              localização, HealthKit, Health Connect, dados biométricos ou qualquer outro
              recurso do dispositivo além das notificações.
            </p>

            <h2>15. Cookies e tecnologias de rastreamento</h2>
            <p>
              O aplicativo ClickCannabis{" "}
              <strong>não utiliza cookies, pixels de rastreamento, SDKs de analytics,
              identificadores de publicidade (IDFA/GAID) ou qualquer outra tecnologia
              de rastreamento</strong>.
            </p>
            <p>
              Não realizamos rastreamento entre aplicativos (cross-app tracking) e
              não participamos de redes de publicidade. A página web da Política de
              Privacidade também não utiliza cookies de terceiros.
            </p>

            <h2>16. Alterações nesta Política</h2>
            <p>
              A Clickcannabis S.A. reserva-se o direito de atualizar esta
              Política de Privacidade a qualquer momento. Quaisquer alterações
              significativas serão comunicadas por meio de:
            </p>
            <ul>
              <li>Atualização da data de revisão no topo deste documento</li>
              <li>Notificação dentro do aplicativo, quando aplicável</li>
              <li>Publicação da versão atualizada nesta página</li>
            </ul>
            <p>
              Recomendamos que os usuários consultem esta página periodicamente.
              O uso continuado do aplicativo após a publicação de alterações constitui
              aceitação da Política revisada.
            </p>

            <h2>17. Contato</h2>
            <ul>
              <li>
                <strong>Razão social:</strong> Clickcannabis S.A.
              </li>
              <li>
                <strong>CNPJ n⁰:</strong> 58.090.406/0001-92
              </li>
              <li>
                <strong>Aplicativo:</strong> ClickCannabis
              </li>
              <li>
                <strong>E-mail geral:</strong>{" "}
                <a href="mailto:clickcannabis@clickcannabis.com">
                  clickcannabis@clickcannabis.com
                </a>
              </li>
              <li>
                <strong>E-mail do DPO (Encarregado de Dados):</strong>{" "}
                <a href="mailto:privacidade@clickcannabis.com">
                  privacidade@clickcannabis.com
                </a>
              </li>
              <li>
                <strong>Prazo de resposta:</strong> Até 15 dias úteis
              </li>
            </ul>

            <h2>18. Legislação aplicável e foro</h2>
            <p>
              Esta Política de Privacidade é regida pela legislação brasileira,
              em especial pela Lei Geral de Proteção de Dados Pessoais (Lei nº
              13.709/2018 — LGPD), o Marco Civil da Internet (Lei nº 12.965/2014)
              e o Código de Defesa do Consumidor (Lei nº 8.078/1990).
            </p>
            <p>
              Eventuais disputas serão dirimidas no foro da comarca da sede da
              Empresa, ressalvado o direito do consumidor de optar pelo foro do
              seu domicílio, conforme Art. 101, I, do Código de Defesa do Consumidor.
            </p>

            <hr />

            <p style={{ fontSize: 13, color: "#7A9A88", textAlign: "center" }}>
              © 2026 Clickcannabis S.A. Todos os direitos reservados.
            </p>
          </div>
        </article>
      </main>
    </div>
  );
}
