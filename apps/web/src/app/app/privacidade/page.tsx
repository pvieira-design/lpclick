import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Política de Privacidade — ClickCannabis",
  description:
    "Política de privacidade do aplicativo ClickCannabis. Saiba como tratamos seus dados pessoais, com quem compartilhamos e quais são os seus direitos sob a LGPD.",
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
            <img src="/logo.svg" alt="Click Cannabis" width={140} height={20} />
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
            Última atualização: 5 de setembro de 2026 · Versão 3.1 · Aplicativo ClickCannabis para
            iOS e Android
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
            .privacy h3 {
              font-size: 1.05rem;
              font-weight: 600;
              color: #0B3D1E;
              margin-top: 24px;
              margin-bottom: 8px;
              letter-spacing: -0.005em;
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
              vertical-align: top;
            }
            .privacy blockquote {
              margin: 20px 0;
              padding: 16px 20px;
              background: #E8F5EC;
              border-left: 3px solid #1B6B3A;
              border-radius: 0 12px 12px 0;
              font-size: 14px;
              color: #1B6B3A;
              line-height: 1.65;
            }
            .privacy blockquote strong {
              color: #0B3D1E;
            }
            .privacy ul, .privacy ol {
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
            .privacy code {
              font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, monospace;
              font-size: 13px;
              background: rgba(11, 61, 30, 0.06);
              color: #0B3D1E;
              padding: 1px 6px;
              border-radius: 4px;
            }
            .privacy hr {
              border: none;
              border-top: 1px solid rgba(11, 61, 30, 0.08);
              margin: 40px 0;
            }
            .privacy .summary-card {
              margin: 0 0 32px;
              padding: 24px;
              background: linear-gradient(180deg, #F0F8F2 0%, #E8F5EC 100%);
              border: 1px solid rgba(11, 61, 30, 0.08);
              border-radius: 16px;
            }
            .privacy .summary-card h2 {
              margin-top: 0;
              margin-bottom: 12px;
              font-size: 1.05rem;
              color: #0B3D1E;
            }
            .privacy .summary-card ul {
              margin: 0;
              padding-left: 18px;
            }
            .privacy .summary-card li {
              font-size: 14px;
              line-height: 1.65;
              color: #2C4A38;
              margin-bottom: 10px;
            }
            .privacy .summary-card li:last-child {
              margin-bottom: 0;
            }
            .privacy .summary-card strong {
              color: #0B3D1E;
            }
            .privacy .rev-note {
              margin: 0 0 24px;
              padding: 14px 18px;
              background: rgba(27, 107, 58, 0.04);
              border: 1px solid rgba(27, 107, 58, 0.12);
              border-radius: 12px;
              font-size: 13px;
              line-height: 1.6;
              color: #4A6B56;
            }
          `}</style>

          <div className="privacy">
            <h2>1. Sobre esta política</h2>

            <p>
              Esta Política de Privacidade explica como os dados pessoais são utilizados no
              aplicativo Click Cannabis. Ela se aplica às funcionalidades do app e à sua conexão com
              a plataforma Click. Contratações de consultas, importação de medicamentos e outros
              serviços da Click possuem documentos próprios, disponíveis no site da empresa.
            </p>

            <p>
              O aplicativo ajuda a organizar medicamentos, lembretes e registros de acompanhamento.
              As informações apresentadas não substituem consulta, diagnóstico ou orientação de um
              profissional de saúde.
            </p>

            <h2>2. Responsável pelos dados e contato</h2>

            <p>
              A controladora dos dados tratados pelo aplicativo é a{" "}
              <strong>Clickcannabis S.A.</strong>, inscrita no{" "}
              <strong>CNPJ 58.090.406/0001-92</strong>.
            </p>

            <p>
              O encarregado pelo tratamento de dados pessoais é <strong>Pedro Mota</strong>. Para
              dúvidas e solicitações sobre privacidade, utilize um dos canais:
            </p>

            <ul>
              <li>
                <strong>
                  <a href="mailto:privacidade@clickcannabis.com">privacidade@clickcannabis.com</a>
                </strong>
              </li>
              <li>
                <strong>
                  <a href="mailto:clickcannabis@clickcannabis.com">
                    clickcannabis@clickcannabis.com
                  </a>
                </strong>
              </li>
            </ul>

            <h2>3. Como você pode utilizar o aplicativo</h2>

            <p>
              Você pode utilizar as funções locais de acompanhamento sem informar telefone ou criar
              uma conta. Nesse modo, os registros de medicamentos, doses, humor, condições, sono e
              hidratação permanecem no aparelho e não são enviados à Click. O acesso a conteúdo
              online pode gerar dados técnicos de conexão.
            </p>

            <p>
              Ao optar por conectar-se à Click, você informa seu telefone, confirma o código
              recebido pelo WhatsApp e aceita o aviso de conexão apresentado no aplicativo. A
              conexão permite consultar os pacientes vinculados à sua conta e sincronizar registros
              de acompanhamento com a Click. Quando houver mais de um paciente disponível, você
              escolhe qual acompanhamento deseja acessar.
            </p>

            <p>
              A conexão abrange os pacientes vinculados ao seu cadastro, inclusive os que forem
              vinculados posteriormente. Os registros permanecem separados por paciente. Informações
              registradas sem internet podem ser enviadas quando a conexão for restabelecida;
              registros locais compatíveis também podem ser integrados ao acompanhamento ao conectar
              o aparelho.
            </p>

            <p>
              Você pode interromper a conexão nas configurações do app. Essa ação bloqueia novas
              consultas e sincronizações conectadas, mas não apaga os registros já recebidos pela
              Click. Quando realizada sem internet, a interrupção no aparelho é imediata e sua
              confirmação na Click ocorre ao reconectar.
            </p>

            <h2>4. Quais dados tratamos e para quê</h2>

            <p>Conforme as funcionalidades utilizadas, o aplicativo trata:</p>

            <ul>
              <li>
                <strong>Cadastro e acesso:</strong> telefone, nome, e-mail, data de nascimento,
                identificadores da conta e informações de autenticação, para identificar você e
                permitir o acesso aos dados autorizados.
              </li>
              <li>
                <strong>Saúde e acompanhamento:</strong> medicamentos, prescrições, doses, registros
                de tomadas, humor, satisfação, condições acompanhadas, consultas, respostas de
                anamnese e documentos, para apresentar e organizar o acompanhamento do paciente.
                Registros de sono e hidratação são mantidos no aparelho.
              </li>
              <li>
                <strong>Informações de serviços da Click:</strong> orçamentos, pagamentos, pedidos,
                entregas e indicações, quando disponíveis para consulta no app. O aplicativo não
                recebe número de cartão ou código de segurança do cartão.
              </li>
              <li>
                <strong>Preferências e imagens:</strong> configurações de lembretes, opções de
                comunicação e fotos escolhidas para personalização. Fotos pessoais utilizadas no app
                permanecem no aparelho.
              </li>
              <li>
                <strong>Dados técnicos:</strong> informações de sessão, identificação da instalação,
                token de notificação, plataforma, versão do aplicativo e registros operacionais,
                para autenticação, segurança, funcionamento e suporte. A infraestrutura pode tratar
                IP e informações da conexão.
              </li>
            </ul>

            <p>
              Os dados de saúde são dados pessoais sensíveis. Seu tratamento deve observar as
              hipóteses específicas do artigo 11 da LGPD, incluindo consentimento específico quando
              exigido e as hipóteses aplicáveis de tutela da saúde, obrigação legal e exercício
              regular de direitos. Para cadastro, segurança e prestação das funções do app,
              aplicam-se as bases legais pertinentes do artigo 7º. O aceite desta política não
              representa autorização ilimitada para qualquer uso dos dados.
            </p>

            <h2>5. Crianças, adolescentes e responsáveis</h2>

            <p>
              O acompanhamento de crianças e adolescentes deve ocorrer por seu responsável legal ou
              por pessoa com autorização válida para esse acesso, observando o melhor interesse do
              paciente. O vínculo de um paciente a uma conta não dispensa a autorização necessária
              para representá-lo.
            </p>

            <p>
              Quando o consentimento do responsável for exigido, ele deverá ser obtido de forma
              específica e destacada. Se você identificar acesso indevido ou informações de um menor
              vinculadas incorretamente à sua conta, entre em contato pelos canais de privacidade.
            </p>

            <h2>6. Processamento automatizado de prescrições</h2>

            <p>
              O app pode utilizar recursos de inteligência artificial para organizar o conteúdo das
              prescrições em informações de medicamentos e horários. Quando esse recurso estiver
              habilitado, o processamento pode ocorrer automaticamente durante a disponibilização da
              receita no aplicativo.
            </p>

            <p>
              Para essa finalidade, o texto da receita e os dados dos medicamentos podem ser
              enviados a fornecedores externos de tecnologia. O texto pode conter informações
              pessoais e de saúde presentes na própria receita. Informações da receita e resultados
              do processamento também podem ser armazenados de forma protegida nos sistemas que dão
              suporte ao app.
            </p>

            <p>
              Esse processamento não substitui a prescrição nem autoriza mudanças no tratamento. Em
              caso de informação incorreta ou divergência, consulte a receita original e o
              profissional responsável. Dúvidas sobre o processamento e pedidos de revisão podem ser
              encaminhados pelos canais de privacidade.
            </p>

            <h2>7. Compartilhamento de dados</h2>

            <p>Conforme a função utilizada, os dados podem ser compartilhados com:</p>

            <ul>
              <li>
                <strong>Sistemas da Click e profissionais autorizados</strong>, para disponibilizar
                informações e receber os registros do acompanhamento conectado.
              </li>
              <li>
                <strong>Fornecedores de comunicação</strong>, para envio do código de acesso pelo
                WhatsApp e entrega de notificações.
              </li>
              <li>
                <strong>Fornecedores de hospedagem, armazenamento e tecnologia</strong>, para operar
                o aplicativo, entregar conteúdo e realizar o processamento descrito nesta política.
              </li>
              <li>
                <strong>Autoridades competentes</strong>, quando houver obrigação legal ou
                determinação aplicável.
              </li>
            </ul>

            <p>
              Alguns fornecedores podem processar dados fora do Brasil. Isso inclui serviços de
              comunicação, infraestrutura e processamento automatizado de prescrições. Você pode
              solicitar informações sobre os destinatários, os países envolvidos e o tratamento
              realizado pelos canais de privacidade. As transferências internacionais estão sujeitas
              às exigências da LGPD.
            </p>

            <p>
              Não vendemos dados pessoais nem utilizamos dados de saúde para direcionar publicidade.
            </p>

            <h2>8. Notificações, permissões e conteúdo externo</h2>

            <p>
              Lembretes e notificações dependem das suas escolhas e das permissões do aparelho. Você
              pode ajustar essas permissões nas configurações do dispositivo e as preferências
              disponíveis no aplicativo. O recebimento de ofertas depende de uma escolha separada,
              que pode ser alterada nas configurações de lembretes. Essa escolha não altera os
              avisos necessários ao serviço.
            </p>

            <p>
              O acesso a fotos ocorre ao utilizar funções como personalização ou salvamento de
              imagens. O aplicativo não utiliza HealthKit ou Health Connect nem solicita acesso a
              contatos, microfone ou localização para as funcionalidades descritas nesta política.
            </p>

            <p>
              O aplicativo não utiliza identificadores publicitários ou ferramentas de rastreamento
              comportamental. Sites e serviços externos abertos por links podem utilizar cookies e
              outras tecnologias conforme suas próprias políticas.
            </p>

            <h2>9. Armazenamento e segurança</h2>

            <p>
              Os dados são mantidos conforme a finalidade do tratamento e a necessidade de
              funcionamento da conta e dos recursos utilizados. Obrigações legais e regulatórias e o
              exercício regular de direitos podem justificar a conservação de determinados
              registros. A exclusão da conta do app segue o procedimento abaixo.
            </p>

            <p>
              Utilizamos medidas de proteção como comunicação criptografada, autenticação e
              restrições de acesso. Nenhum sistema é totalmente livre de riscos. Eventuais
              incidentes serão tratados conforme a legislação aplicável, incluindo comunicação à
              ANPD e às pessoas afetadas quando exigida.
            </p>

            <h2>10. Exclusão da conta e dos dados do aplicativo</h2>

            <p>
              Você pode solicitar a <strong>Exclusão da Conta do App</strong> nas configurações do
              aplicativo. O procedimento exige conexão com a internet, confirmação por código e
              confirmação da exclusão.
            </p>

            <p>
              A exclusão remove a conta e os dados associados mantidos pelos sistemas do app,
              encerra suas sessões e inicia a limpeza dos dados locais nos aparelhos vinculados.
              Outros aparelhos precisam voltar à internet para receber o comando de limpeza, cuja
              disponibilidade é temporária. Para aparelhos que permanecerem offline, remova também
              os dados localmente.
            </p>

            <p>
              <strong>
                Excluir a conta do app não exclui consultas, receitas, documentos, pagamentos ou
                registros de acompanhamento já mantidos na plataforma Click.
              </strong>{" "}
              Para exercer direitos sobre esses dados, utilize os canais de privacidade; o pedido
              será analisado conforme as obrigações aplicáveis.
            </p>

            <p>
              Sair da conta ou desconectar-se da Click não equivale a excluir seus dados.
              Desinstalar o aplicativo não solicita a exclusão da conta ou dos dados na Click. Dados
              locais também podem estar sujeitos às configurações de backup e restauração do seu
              aparelho.
            </p>

            <h2>11. Seus direitos</h2>

            <p>
              Você pode solicitar confirmação e acesso aos dados, correção, informações sobre
              compartilhamento, portabilidade quando aplicável, anonimização, bloqueio ou eliminação
              nas hipóteses legais, revogação de consentimento, oposição e revisão de decisões
              automatizadas que afetem seus interesses.
            </p>

            <p>
              As solicitações podem ser enviadas gratuitamente para{" "}
              <strong>
                <a href="mailto:privacidade@clickcannabis.com">privacidade@clickcannabis.com</a>
              </strong>{" "}
              ou{" "}
              <strong>
                <a href="mailto:clickcannabis@clickcannabis.com">clickcannabis@clickcannabis.com</a>
              </strong>
              . Poderemos solicitar informações necessárias para confirmar sua identidade ou
              representação e proteger os dados do paciente. O atendimento observará os prazos
              legais aplicáveis. Você também pode apresentar uma petição à ANPD.
            </p>

            <h2>12. Alterações desta política</h2>

            <p>
              Esta política poderá ser atualizada para refletir mudanças nas funcionalidades ou no
              tratamento de dados. A versão vigente ficará disponível no endereço indicado pelo
              aplicativo. Mudanças relevantes serão comunicadas e, quando necessário, será
              solicitado novo consentimento.
            </p>

            <p>© 2026 Clickcannabis S.A.</p>
          </div>
        </article>
      </main>
    </div>
  );
}
