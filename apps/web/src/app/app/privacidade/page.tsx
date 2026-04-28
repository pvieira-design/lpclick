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
            Última atualização: 28 de abril de 2026 · Versão 2.1 · Aplicativo
            ClickCannabis para iOS e Android
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
            <p className="rev-note">
              Esta versão revisa a política 2.0 (também de 28/04/2026) após
              auditoria técnica do código do Aplicativo. O texto foi ajustado
              para descrever, com fidelidade ao código atual, o que efetivamente
              é tratado, sem afirmar medidas de segurança ainda em
              implementação. Pontos materialmente alterados em relação à 2.0:
              descrição precisa da tabela <code>device_token</code>, inclusão da
              Strapi como operador de conteúdo, descrição honesta dos logs
              operacionais (seção 9.2) e do fluxo atual de exclusão de conta
              (seção 11).
            </p>

            <section className="summary-card">
              <h2>Resumo em 30 segundos</h2>
              <ul>
                <li>
                  <strong>O que é:</strong> ClickCannabis é o app do paciente da
                  plataforma Click. Para usar é preciso ter cadastro na
                  plataforma Click. Login por código de 6 dígitos enviado pelo
                  WhatsApp.
                </li>
                <li>
                  <strong>O que tratamos:</strong> dados sensíveis de saúde — é
                  o objetivo do app, organizar seu tratamento. Prescrições,
                  anamnese, consultas, pagamentos e documentos vêm da plataforma
                  Click (mesmo grupo). O servidor do Aplicativo{" "}
                  <strong>só lê</strong> desse banco; nunca grava lá.
                </li>
                <li>
                  <strong>O que fica só no seu celular:</strong> registros de
                  doses tomadas, sono, humor, hidratação e foto de perfil. Esses
                  dados nunca saem do dispositivo. Ao desinstalar o app, são
                  apagados.
                </li>
                <li>
                  <strong>IA:</strong> o conteúdo da sua receita médica em PDF
                  é, <strong>opcionalmente</strong>, enviado à Anthropic
                  (Claude) para preencher os lembretes de doses sem digitação.
                  Você pode optar por adicionar manualmente, sem envio.
                </li>
                <li>
                  <strong>O que não fazemos:</strong> não vendemos dados, não
                  rastreamos comportamento, não usamos analytics, ads ou
                  identificadores publicitários. Não acessamos câmera,
                  microfone, contatos, calendário, localização, biometria,
                  HealthKit/Health Connect.
                </li>
                <li>
                  <strong>Seus direitos:</strong> acesso, correção, eliminação,
                  portabilidade, revogação de consentimento — escreva para{" "}
                  <a href="mailto:privacidade@clickcannabis.com">
                    privacidade@clickcannabis.com
                  </a>
                  , resposta em até 15 dias úteis.
                </li>
              </ul>
            </section>

            <h2>1. Introdução</h2>
            <p>
              A <strong>Clickcannabis S.A.</strong> (&ldquo;Clickcannabis&rdquo;,
              &ldquo;nós&rdquo;) desenvolveu o aplicativo{" "}
              <strong>ClickCannabis</strong> (&ldquo;Aplicativo&rdquo;) para
              Android e iOS como ferramenta complementar à plataforma de
              atendimento médico Click (
              <a href="https://clickatendimento.com">clickatendimento.com</a>).
              O Aplicativo permite ao paciente acompanhar o seu tratamento,
              registrar a tomada de medicamentos prescritos, organizar
              lembretes, consultar prescrições, pagamentos, documentos e
              conteúdo educativo associados ao seu próprio cadastro na
              plataforma Click.
            </p>
            <p>
              Esta política descreve, em conformidade com a{" "}
              <strong>
                Lei Geral de Proteção de Dados Pessoais (Lei 13.709/2018 — LGPD)
              </strong>
              , com as <strong>Diretrizes da Apple App Store</strong> e com as{" "}
              <strong>Políticas do Google Play</strong>, quais dados pessoais
              são coletados, como são utilizados, com quem são compartilhados e
              quais são os direitos do titular.
            </p>
            <blockquote>
              <strong>Aviso importante:</strong> O Aplicativo{" "}
              <strong>não é um dispositivo médico</strong>. Não substitui a
              avaliação, o diagnóstico ou a prescrição realizados pelo
              profissional médico responsável. Funciona como ferramenta de
              organização pessoal e acompanhamento do tratamento prescrito por
              médico habilitado através da plataforma Click.
            </blockquote>
            <p>
              <strong>Faixa etária:</strong> o Aplicativo destina-se
              exclusivamente a pessoas maiores de 18 anos.
            </p>

            <h2>2. Controlador, Encarregado (DPO) e Contato</h2>
            <table>
              <tbody>
                <tr>
                  <th style={{ width: "45%" }}>Razão social</th>
                  <td>Clickcannabis S.A.</td>
                </tr>
                <tr>
                  <th>CNPJ</th>
                  <td>58.090.406/0001-92</td>
                </tr>
                <tr>
                  <th>Endereço eletrônico geral</th>
                  <td>
                    <a href="mailto:clickcannabis@clickcannabis.com">
                      clickcannabis@clickcannabis.com
                    </a>
                  </td>
                </tr>
                <tr>
                  <th>Encarregado pelo Tratamento de Dados (DPO)</th>
                  <td>
                    <a href="mailto:privacidade@clickcannabis.com">
                      privacidade@clickcannabis.com
                    </a>
                  </td>
                </tr>
                <tr>
                  <th>Prazo de resposta a solicitações</th>
                  <td>até 15 (quinze) dias úteis</td>
                </tr>
              </tbody>
            </table>
            <p>
              A Clickcannabis é a <strong>controladora</strong> dos dados
              pessoais tratados no contexto do Aplicativo. Para o tratamento
              integrado entre o Aplicativo e a plataforma Click (mesmo grupo
              econômico), os dados são compartilhados sob base legal de{" "}
              <strong>execução de contrato</strong> com o titular, conforme
              detalhado na seção 7.
            </p>

            <h2>3. Definições</h2>
            <ul>
              <li>
                <strong>Titular:</strong> a pessoa natural a quem se referem os
                dados pessoais (você, paciente).
              </li>
              <li>
                <strong>Dado pessoal:</strong> qualquer informação que permita,
                direta ou indiretamente, identificar uma pessoa natural.
              </li>
              <li>
                <strong>Dado pessoal sensível:</strong> dado sobre saúde, vida
                sexual, dado genético ou biométrico, entre outros (LGPD, Art.
                5º, II).
              </li>
              <li>
                <strong>Tratamento:</strong> toda operação realizada com dados
                pessoais (coleta, armazenamento, uso, compartilhamento,
                eliminação etc.).
              </li>
              <li>
                <strong>Plataforma Click:</strong> sistema de atendimento médico
                operado pela Clickcannabis (
                <a href="https://clickatendimento.com">clickatendimento.com</a>
                ), no qual o titular se cadastra previamente, realiza consultas
                e recebe prescrições.
              </li>
            </ul>

            <h2>4. Quais Dados Tratamos</h2>
            <p>
              O Aplicativo trata as seguintes <strong>categorias</strong> de
              dados pessoais. A coluna &ldquo;Origem&rdquo; indica como o dado
              chega até nós; a coluna &ldquo;Onde fica armazenado&rdquo; indica
              em qual sistema o dado é persistido.
            </p>

            <h3>4.1 Dados de identificação e contato</h3>
            <table>
              <thead>
                <tr>
                  <th>Dado</th>
                  <th>Origem</th>
                  <th>Onde fica armazenado</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Nome completo</td>
                  <td>Cadastro do titular na plataforma Click</td>
                  <td>
                    Banco de dados da plataforma Click (réplica somente leitura)
                    e banco de dados do Aplicativo
                  </td>
                </tr>
                <tr>
                  <td>E-mail</td>
                  <td>Cadastro do titular na plataforma Click</td>
                  <td>Plataforma Click</td>
                </tr>
                <tr>
                  <td>Número de telefone celular (com DDD/DDI)</td>
                  <td>Informado pelo titular no login do Aplicativo</td>
                  <td>
                    Banco de dados do Aplicativo (tabela de usuário e tabela de
                    OTP) e plataforma Click
                  </td>
                </tr>
                <tr>
                  <td>
                    CPF (<code>nationalId</code>)
                  </td>
                  <td>Cadastro do titular na plataforma Click</td>
                  <td>Plataforma Click</td>
                </tr>
                <tr>
                  <td>Data de nascimento, gênero</td>
                  <td>Cadastro do titular na plataforma Click</td>
                  <td>Plataforma Click</td>
                </tr>
                <tr>
                  <td>Avatar (foto de perfil)</td>
                  <td>
                    Selecionada pelo titular a partir da galeria do dispositivo
                  </td>
                  <td>Apenas no dispositivo do titular</td>
                </tr>
              </tbody>
            </table>

            <h3>4.2 Endereço</h3>
            <p>
              Endereço completo (logradouro, número, complemento, bairro, CEP,
              cidade, estado, país), utilizado pela plataforma Click para
              entrega dos produtos prescritos.
            </p>
            <ul>
              <li>
                <strong>Origem:</strong> cadastro do titular na plataforma
                Click.
              </li>
              <li>
                <strong>Armazenamento:</strong> plataforma Click. O Aplicativo
                apenas exibe o endereço quando o titular acessa as telas de
                pedidos/entrega.
              </li>
            </ul>

            <h3>4.3 Dados sensíveis de saúde (LGPD Art. 11)</h3>
            <blockquote>
              O Aplicativo{" "}
              <strong>trata dados pessoais sensíveis de saúde</strong>. O
              tratamento é realizado mediante{" "}
              <strong>consentimento específico</strong> do titular ou sob
              hipóteses do Art. 11, §2º da LGPD (proteção da vida, tutela da
              saúde por profissionais habilitados, ou exercício regular de
              direitos em contrato).
            </blockquote>
            <table>
              <thead>
                <tr>
                  <th>Dado</th>
                  <th>Origem</th>
                  <th>Onde fica armazenado</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Prescrições médicas (PDF/imagem)</td>
                  <td>
                    Plataforma Click, geradas pelo médico responsável
                  </td>
                  <td>
                    Plataforma Click; o Aplicativo recebe o arquivo apenas para
                    exibição e processamento
                  </td>
                </tr>
                <tr>
                  <td>
                    Produtos prescritos (cannabis medicinal: óleos, gomas,
                    tabletes, cápsulas etc.), dosagens, formulações
                  </td>
                  <td>Plataforma Click</td>
                  <td>Plataforma Click</td>
                </tr>
                <tr>
                  <td>Anamnese (questionário médico aplicado pelo médico)</td>
                  <td>Plataforma Click</td>
                  <td>Plataforma Click</td>
                </tr>
                <tr>
                  <td>
                    Prontuário médico, histórico e status de consultas
                  </td>
                  <td>Plataforma Click</td>
                  <td>Plataforma Click</td>
                </tr>
                <tr>
                  <td>
                    Histórico do tratamento informado durante o cadastro: gênero,
                    condição tratada, medicamentos em uso, uso prévio de cannabis,
                    &ldquo;onde conheceu&rdquo;
                  </td>
                  <td>Plataforma Click</td>
                  <td>Plataforma Click</td>
                </tr>
                <tr>
                  <td>Avaliações de consultas e médicos</td>
                  <td>Plataforma Click</td>
                  <td>Plataforma Click</td>
                </tr>
                <tr>
                  <td>
                    Registro de doses tomadas (data, hora, dose, observações)
                  </td>
                  <td>Lançado pelo titular no Aplicativo</td>
                  <td>
                    <strong>Apenas no dispositivo do titular</strong> (banco
                    SQLite local)
                  </td>
                </tr>
                <tr>
                  <td>Diário de bem-estar (humor e anotações)</td>
                  <td>Lançado pelo titular no Aplicativo</td>
                  <td>
                    <strong>Apenas no dispositivo do titular</strong>
                  </td>
                </tr>
                <tr>
                  <td>
                    Registro de sono (hora de deitar, hora de acordar, duração,
                    latência, anotações)
                  </td>
                  <td>Lançado pelo titular no Aplicativo</td>
                  <td>
                    <strong>Apenas no dispositivo do titular</strong>
                  </td>
                </tr>
                <tr>
                  <td>Registro de hidratação (ml por dia)</td>
                  <td>Lançado pelo titular no Aplicativo</td>
                  <td>
                    <strong>Apenas no dispositivo do titular</strong>
                  </td>
                </tr>
                <tr>
                  <td>
                    Respostas a questionários (assessments) eventualmente
                    disponibilizados no Aplicativo
                  </td>
                  <td>Lançado pelo titular no Aplicativo</td>
                  <td>
                    <strong>Apenas no dispositivo do titular</strong>
                  </td>
                </tr>
              </tbody>
            </table>

            <h3>4.4 Documentos do titular</h3>
            <p>
              URLs de referência aos seguintes documentos enviados pelo titular
              à plataforma Click:
            </p>
            <ul>
              <li>Receita médica;</li>
              <li>Documento de identidade (RG/CNH);</li>
              <li>Comprovante de residência;</li>
              <li>Comprovante de situação cadastral (CPF);</li>
              <li>Autorização da Anvisa para importação, quando aplicável.</li>
            </ul>
            <p>
              <strong>Origem:</strong> plataforma Click.{" "}
              <strong>Armazenamento:</strong> plataforma Click. O Aplicativo
              apenas exibe esses documentos ao titular dentro da própria conta.
            </p>

            <h3>4.5 Dados financeiros e de pedidos</h3>
            <table>
              <thead>
                <tr>
                  <th>Dado</th>
                  <th>Origem</th>
                  <th>Onde fica armazenado</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    Histórico de pagamentos (método: PIX, cartão, boleto),
                    status, datas, parcelas
                  </td>
                  <td>Plataforma Click</td>
                  <td>Plataforma Click</td>
                </tr>
                <tr>
                  <td>Faturas e valores</td>
                  <td>Plataforma Click</td>
                  <td>Plataforma Click</td>
                </tr>
                <tr>
                  <td>Orçamentos de produtos, descontos, cupons</td>
                  <td>Plataforma Click</td>
                  <td>Plataforma Click</td>
                </tr>
                <tr>
                  <td>Histórico de reembolsos</td>
                  <td>Plataforma Click</td>
                  <td>Plataforma Click</td>
                </tr>
                <tr>
                  <td>
                    Rastreamento de entregas (código de rastreio, status
                    logístico, observações)
                  </td>
                  <td>Plataforma Click</td>
                  <td>Plataforma Click</td>
                </tr>
                <tr>
                  <td>Dados de cartão de crédito</td>
                  <td colSpan={2}>
                    <strong>Não tratamos.</strong> O processamento de cartão é
                    feito por gateway de pagamento contratado pela plataforma
                    Click; o Aplicativo nunca recebe número de cartão, validade
                    ou CVV.
                  </td>
                </tr>
              </tbody>
            </table>

            <h3>4.6 Programa de indicações</h3>
            <p>
              Quando o titular indica outra pessoa para a plataforma Click, ou é
              indicado por outra pessoa, processamos:
            </p>
            <ul>
              <li>Código de referência do titular;</li>
              <li>
                Lista de pessoas indicadas (nome e ID na plataforma Click) e
                status do pagamento da indicação.
              </li>
            </ul>
            <p>
              <strong>Origem e armazenamento:</strong> plataforma Click.
            </p>

            <h3>4.7 Dados técnicos e de notificações</h3>
            <p>
              A autenticação do Aplicativo é construída sobre a biblioteca{" "}
              <em>better-auth</em> (open source). As tabelas relevantes do banco
              do Aplicativo (PostgreSQL) são <code>user</code>,{" "}
              <code>session</code>, <code>account</code>,{" "}
              <code>verification</code>, <code>otp</code> e{" "}
              <code>device_token</code>.
            </p>
            <table>
              <thead>
                <tr>
                  <th>Dado</th>
                  <th>Origem</th>
                  <th>Finalidade</th>
                  <th>Armazenamento</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <strong>Token de notificação push</strong> (Expo Push Token,
                    encaminhado ao Apple Push Notification service no iOS e ao
                    Firebase Cloud Messaging no Android)
                  </td>
                  <td>
                    Gerado pelo sistema operacional do dispositivo após
                    autorização da permissão de notificações
                  </td>
                  <td>
                    Entregar lembretes de doses, lembretes de renovação de
                    anamnese e comunicações operacionais
                  </td>
                  <td>
                    Tabela <code>device_token</code> (campos:{" "}
                    <code>expo_push_token</code>, <code>platform</code>,{" "}
                    <code>last_seen_at</code>, <code>invalid_at</code>),{" "}
                    <strong>vinculada ao</strong> <code>user.id</code>{" "}
                    <strong>do titular</strong>.{" "}
                    <strong>Não é um identificador anônimo</strong> — identifica
                    o titular.
                  </td>
                </tr>
                <tr>
                  <td>Plataforma do dispositivo (iOS/Android)</td>
                  <td>Detectado no registro do token</td>
                  <td>Identificar o canal de envio correto</td>
                  <td>
                    Coluna <code>platform</code> da tabela{" "}
                    <code>device_token</code>
                  </td>
                </tr>
                <tr>
                  <td>
                    Endereço IP e <em>user-agent</em> das requisições à API
                  </td>
                  <td>
                    Coletado automaticamente pela infraestrutura HTTP no momento
                    de cada requisição autenticada
                  </td>
                  <td>
                    Segurança (mitigação de abuso, auditoria de autenticação)
                  </td>
                  <td>
                    Colunas <code>ip_address</code> e <code>user_agent</code> na
                    tabela <code>session</code>; também presentes nos logs do
                    servidor com retenção limitada
                  </td>
                </tr>
                <tr>
                  <td>Token de sessão (Bearer)</td>
                  <td>
                    Gerado pelo <em>better-auth</em> no login
                  </td>
                  <td>Manter o titular autenticado entre sessões</td>
                  <td>
                    Tabela <code>session</code> (sessão server-side, com{" "}
                    <code>expires_at</code>) e, no dispositivo, em armazenamento
                    local seguro (SecureStore)
                  </td>
                </tr>
                <tr>
                  <td>Código OTP (6 dígitos) e telefone associado</td>
                  <td>Gerado pelo Aplicativo no envio do código</td>
                  <td>
                    Verificar que o número de telefone informado pertence ao
                    titular
                  </td>
                  <td>
                    Tabela <code>otp</code> do banco do Aplicativo, com TTL de
                    15 minutos (<code>expires_at</code>). Após o uso, o registro
                    recebe <code>consumed_at</code> e permanece para fins de
                    auditoria por até 90 dias
                  </td>
                </tr>
              </tbody>
            </table>

            <h3>4.8 Dados que NÃO coletamos</h3>
            <p>
              Para evitar ambiguidade, o Aplicativo{" "}
              <strong>não solicita, não acessa e não trata</strong>:
            </p>
            <ul>
              <li>
                Câmera, microfone, contatos da agenda, calendário,
                biometria/Face ID, sensores corporais, HealthKit/Health Connect;
              </li>
              <li>
                Localização precisa ou aproximada do dispositivo (GPS, Wi-Fi,
                IP-geo);
              </li>
              <li>
                Identificadores publicitários (IDFA, AAID/GAID), pixels de
                rastreamento, cookies de terceiros;
              </li>
              <li>Dados de outros aplicativos instalados no dispositivo;</li>
              <li>Histórico de navegação fora do Aplicativo;</li>
              <li>
                Dados financeiros de cartão (número, validade, CVV), conforme
                item 4.5.
              </li>
            </ul>

            <h2>5. Como Coletamos os Dados</h2>
            <ol>
              <li>
                <strong>Diretamente do titular:</strong> ao informar o número de
                telefone para login; ao registrar doses, sono, humor, hidratação
                ou anotações no Aplicativo; ao escolher uma foto de perfil na
                galeria do dispositivo.
              </li>
              <li>
                <strong>A partir da plataforma Click:</strong> sempre que o
                titular já é cadastrado na plataforma Click e autoriza o login
                no Aplicativo com o mesmo telefone, o Aplicativo lê dados do
                cadastro do titular na plataforma Click (perfil, endereço,
                prescrições, anamnese, pagamentos, documentos, indicações). Essa
                leitura é feita exclusivamente em uma{" "}
                <strong>réplica somente leitura</strong> do banco da plataforma
                Click, sob mesma controladoria.
              </li>
              <li>
                <strong>Automaticamente:</strong> dados técnicos (IP,
                user-agent, plataforma) registrados no momento de cada
                requisição autenticada à API.
              </li>
            </ol>

            <h2>6. Para Que Usamos os Dados (Finalidades) e Bases Legais (LGPD)</h2>
            <table>
              <thead>
                <tr>
                  <th>Finalidade</th>
                  <th>Dados utilizados</th>
                  <th>Base legal LGPD</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Autenticar o titular via OTP por WhatsApp</td>
                  <td>Telefone, código OTP</td>
                  <td>Execução de contrato (Art. 7º, V)</td>
                </tr>
                <tr>
                  <td>
                    Manter sessão autenticada e identificar o titular nas
                    chamadas à API
                  </td>
                  <td>Token de sessão, identificadores internos</td>
                  <td>Execução de contrato (Art. 7º, V)</td>
                </tr>
                <tr>
                  <td>
                    Exibir prescrições, anamnese, prontuário, consultas,
                    pagamentos, documentos e indicações do titular
                  </td>
                  <td>
                    Dados sensíveis de saúde, financeiros e documentais lidos
                    da plataforma Click
                  </td>
                  <td>
                    Execução de contrato (Art. 7º, V) e tutela da saúde por
                    profissionais habilitados (Art. 11, §2º, II, &ldquo;f&rdquo;)
                  </td>
                </tr>
                <tr>
                  <td>
                    Permitir que o titular registre doses, sono, humor,
                    hidratação e use o conteúdo educativo
                  </td>
                  <td>Dados sensíveis lançados localmente pelo titular</td>
                  <td>Consentimento específico (Art. 11, §1º, &ldquo;a&rdquo;)</td>
                </tr>
                <tr>
                  <td>
                    Estruturar automaticamente o medicamento e os lembretes a
                    partir do PDF da receita médica
                  </td>
                  <td>
                    PDF/imagem da receita; lista de produtos prescritos; data de
                    hoje
                  </td>
                  <td>
                    Consentimento específico (Art. 11, §1º, &ldquo;a&rdquo;) e
                    execução de contrato (Art. 7º, V)
                  </td>
                </tr>
                <tr>
                  <td>
                    Enviar lembretes (push) de doses, de renovação de anamnese e
                    comunicações operacionais
                  </td>
                  <td>Push token, identificador do usuário</td>
                  <td>Execução de contrato (Art. 7º, V)</td>
                </tr>
                <tr>
                  <td>
                    Garantir a segurança da operação (prevenção a fraude, abuso,
                    debug)
                  </td>
                  <td>IP, user-agent, logs operacionais</td>
                  <td>Legítimo interesse (Art. 7º, IX)</td>
                </tr>
                <tr>
                  <td>
                    Cumprir obrigações legais e regulatórias (Anvisa, fiscal,
                    registros médicos)
                  </td>
                  <td>Documentos, prescrições, faturas</td>
                  <td>Cumprimento de obrigação legal (Art. 7º, II)</td>
                </tr>
              </tbody>
            </table>
            <p>
              O <strong>consentimento</strong> para tratamento de dados
              sensíveis lançados localmente pelo titular é solicitado no
              primeiro acesso e pode ser{" "}
              <strong>revogado a qualquer momento</strong> desinstalando o
              Aplicativo ou solicitando a eliminação dos dados pelo canal do DPO
              (seção 11).
            </p>

            <h2>7. Compartilhamento com Terceiros</h2>
            <p>
              A Clickcannabis <strong>não vende</strong> dados pessoais. O
              compartilhamento ocorre exclusivamente com os operadores e
              parceiros listados abaixo, todos contratados sob obrigações
              contratuais de confidencialidade e segurança da informação.
            </p>

            <h3>7.1 Plataforma Click Cannabis (mesmo grupo econômico)</h3>
            <ul>
              <li>
                <strong>Finalidade:</strong> o Aplicativo é uma extensão do
                atendimento prestado pela plataforma Click. Lê e exibe dados do
                cadastro do titular na plataforma Click; envia ao Aplicativo os
                dados necessários ao acompanhamento do tratamento.
              </li>
              <li>
                <strong>Base legal:</strong> execução de contrato.
              </li>
              <li>
                <strong>Local de processamento:</strong> Brasil.
              </li>
            </ul>

            <h3>7.2 Gupshup (BoldDesk Inc. / Gupshup Inc.)</h3>
            <ul>
              <li>
                <strong>Função:</strong> <em>operador</em> — envio de mensagens
                transacionais via WhatsApp Business para entrega do código OTP.
              </li>
              <li>
                <strong>Dados compartilhados:</strong> número de telefone do
                titular (formato internacional E.164) e código OTP de 6 dígitos.
              </li>
              <li>
                <strong>Local de processamento:</strong> Estados Unidos / Índia
                (servidores da Gupshup) — vide seção 8.
              </li>
              <li>
                <strong>Retenção:</strong> segundo a política de retenção da
                própria Gupshup, conforme contrato.
              </li>
            </ul>

            <h3>7.3 Anthropic, PBC (Claude API)</h3>
            <ul>
              <li>
                <strong>Função:</strong> <em>operador</em> — extração
                estruturada do conteúdo da prescrição médica (medicamentos,
                dosagens, posologia) a partir do PDF/imagem da receita, para que
                o titular possa configurar os lembretes de doses sem digitação
                manual.
              </li>
              <li>
                <strong>Dados compartilhados:</strong> PDF ou imagem da receita
                médica codificada em base64; lista de produtos prescritos da
                consulta correspondente (apenas título e tipo do produto, do
                catálogo da plataforma Click); data atual (formato{" "}
                <code>YYYY-MM-DD</code>) para apoio no cálculo de datas de
                início. <strong>Não enviamos</strong> nome, CPF, e-mail,
                telefone ou qualquer outro identificador textual do titular
                junto à requisição — qualquer informação pessoal eventualmente
                presente no PDF da receita já é parte do próprio documento.
              </li>
              <li>
                <strong>Modelo utilizado:</strong> Claude Sonnet (
                <code>claude-sonnet-4-6</code>), com <em>prompt caching</em>{" "}
                (modo <em>ephemeral</em>) habilitado para reduzir custo e
                latência. O <em>cache ephemeral</em> não amplia a retenção dos
                dados pela Anthropic além da política padrão.
              </li>
              <li>
                <strong>Local de processamento:</strong> Estados Unidos.
              </li>
              <li>
                <strong>Retenção:</strong> conforme política da Anthropic
                (consultar{" "}
                <a href="https://www.anthropic.com/legal">
                  https://www.anthropic.com/legal
                </a>
                ). A Clickcannabis solicita à Anthropic, contratualmente, que o
                conteúdo enviado por API{" "}
                <strong>não seja utilizado para treinamento de modelos</strong>.
              </li>
              <li>
                <strong>Alternativa para o titular:</strong> caso o titular
                prefira não utilizar a estruturação automatizada, pode adicionar
                e configurar manualmente seus medicamentos no Aplicativo, sem
                que o conteúdo da receita seja enviado à Anthropic.
              </li>
            </ul>

            <h3>7.4 Cloudflare, Inc. (Cloudflare R2)</h3>
            <ul>
              <li>
                <strong>Função:</strong> <em>operador</em> — armazenamento de
                vídeos educativos e imagens de papéis de parede oferecidos pelo
                Aplicativo.{" "}
                <strong>Não armazena dados pessoais do titular.</strong>
              </li>
              <li>
                <strong>Acesso:</strong> os objetos são privados; o Aplicativo
                recebe{" "}
                <strong>URLs assinadas com expiração curta</strong> — vídeos: 2
                horas; papéis de parede: 7 dias.
              </li>
              <li>
                <strong>Local de processamento:</strong> rede global da
                Cloudflare (incluindo Estados Unidos e União Europeia) — vide
                seção 8.
              </li>
            </ul>

            <h3>7.5 Strapi (CMS de conteúdo educativo)</h3>
            <ul>
              <li>
                <strong>Função:</strong> <em>operador</em> — sistema de gestão
                de conteúdo (CMS) que armazena artigos do blog e demais textos
                educativos consumidos pelo Aplicativo, hospedado em{" "}
                <code>api-blog.clickagendamento.com</code>.
              </li>
              <li>
                <strong>Dados compartilhados com o operador:</strong>{" "}
                <strong>nenhum dado pessoal do titular</strong>. O Aplicativo
                apenas <strong>lê</strong> o conteúdo público; não envia dados
                de paciente ao Strapi.
              </li>
              <li>
                <strong>Local de processamento:</strong> Brasil.
              </li>
            </ul>

            <h3>
              7.6 Expo Push Service, Apple Push Notification service (Apple
              Inc.) e Firebase Cloud Messaging (Google LLC)
            </h3>
            <ul>
              <li>
                <strong>Função:</strong> <em>operadores</em> — entrega das
                notificações push aos dispositivos iOS e Android. O Aplicativo
                utiliza o <strong>Expo Push Service</strong> como intermediário
                (<code>https://exp.host/--/api/v2/push/send</code>), que repassa
                para APNs (iOS) e FCM (Android).
              </li>
              <li>
                <strong>Dados compartilhados:</strong> token do dispositivo e
                conteúdo da notificação (título e texto curto do lembrete;{" "}
                <strong>não enviamos dado sensível no payload</strong> — por
                exemplo, o lembrete não menciona nome de princípio ativo de
                forma identificável fora do contexto do Aplicativo).
              </li>
              <li>
                <strong>Local de processamento:</strong> Estados Unidos.
              </li>
            </ul>

            <h3>
              7.7 Provedores de infraestrutura (hospedagem do servidor e do
              banco de dados do Aplicativo)
            </h3>
            <p>
              O servidor do Aplicativo (Hono/bun) e o banco de dados do
              Aplicativo (PostgreSQL) são hospedados em provedor de
              infraestrutura contratado pela Clickcannabis (Veloz). Os dados
              permanecem em datacenters localizados no Brasil sempre que
              possível e replicados conforme as melhores práticas de
              continuidade.
            </p>

            <h3>7.8 Autoridades públicas</h3>
            <p>
              A Clickcannabis poderá compartilhar dados pessoais com autoridades
              públicas (Anvisa, Polícia Federal, Receita Federal, autoridades
              judiciárias) quando exigido por{" "}
              <strong>
                lei, ordem judicial ou requisição regulatória válida
              </strong>
              .
            </p>

            <h2>8. Transferência Internacional de Dados</h2>
            <p>
              Algumas operações exigem que dados pessoais sejam tratados fora do
              Brasil. As transferências ocorrem com base nas hipóteses do{" "}
              <strong>Art. 33 da LGPD</strong> — execução de contrato com o
              titular, cumprimento de obrigação legal ou cláusulas contratuais
              específicas.
            </p>
            <table>
              <thead>
                <tr>
                  <th>Operador</th>
                  <th>País</th>
                  <th>Dado transferido</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Gupshup</td>
                  <td>EUA / Índia</td>
                  <td>Telefone do titular + código OTP</td>
                </tr>
                <tr>
                  <td>Anthropic (Claude API)</td>
                  <td>EUA</td>
                  <td>
                    PDF/imagem da receita médica + lista de produtos prescritos
                  </td>
                </tr>
                <tr>
                  <td>Cloudflare (R2)</td>
                  <td>EUA / UE / global</td>
                  <td>Conteúdo educativo (sem PII do titular)</td>
                </tr>
                <tr>
                  <td>Expo Push Service</td>
                  <td>EUA</td>
                  <td>
                    Token do dispositivo + título e texto da notificação
                  </td>
                </tr>
                <tr>
                  <td>Apple APNs</td>
                  <td>EUA</td>
                  <td>Token do dispositivo + texto da notificação</td>
                </tr>
                <tr>
                  <td>Google FCM</td>
                  <td>EUA</td>
                  <td>Token do dispositivo + texto da notificação</td>
                </tr>
              </tbody>
            </table>
            <p>
              A Clickcannabis avalia continuamente a possibilidade de migrar
              tratamentos para operadores baseados no Brasil sempre que
              tecnicamente viável.
            </p>

            <h2>9. Armazenamento, Segurança e Retenção</h2>

            <h3>9.1 Onde os dados ficam</h3>
            <ul>
              <li>
                <strong>Banco de dados do Aplicativo (PostgreSQL):</strong>{" "}
                tabelas <code>user</code>, <code>session</code>,{" "}
                <code>account</code>, <code>verification</code>,{" "}
                <code>otp</code> e <code>device_token</code>. Contém apenas os
                dados estritamente operacionais do Aplicativo (identificação,
                sessão, OTP, token de notificação). Hospedado em provedor de
                nuvem contratado (Veloz), com datacenter no Brasil.
              </li>
              <li>
                <strong>
                  Réplica somente leitura da plataforma Click (PostgreSQL):
                </strong>{" "}
                dados clínicos, financeiros e documentais. O Aplicativo{" "}
                <strong>nunca grava</strong> nessa réplica — a conexão tem
                privilégios apenas de leitura.
              </li>
              <li>
                <strong>
                  Dispositivo do titular (SQLite local, biblioteca{" "}
                  <em>expo-sqlite</em>):
                </strong>{" "}
                doses, diário de humor, sono, hidratação, configurações do
                titular, foto de perfil (caminho local) e tabelas auxiliares de
                medicamentos e lembretes. O token de sessão fica em
                armazenamento seguro do dispositivo (<em>SecureStore</em>),
                separado do banco SQLite. Os dados locais ficam protegidos pelo{" "}
                <em>sandbox</em> do sistema operacional.{" "}
                <strong>
                  Não são criptografados em repouso por uma camada adicional do
                  Aplicativo;
                </strong>{" "}
                no iOS e no Android atuais, o sandbox por aplicativo aliado à
                criptografia do dispositivo (Data Protection no iOS,{" "}
                <em>file-based encryption</em> no Android moderno) garante o
                isolamento.
              </li>
            </ul>

            <h3>9.2 Medidas de segurança</h3>
            <ul>
              <li>
                Comunicação entre Aplicativo e servidor exclusivamente via{" "}
                <strong>HTTPS/TLS</strong>;
              </li>
              <li>
                Autenticação por <strong>bearer token</strong> com sessão
                server-side e expiração;
              </li>
              <li>
                OTP de 6 dígitos com{" "}
                <strong>TTL de 15 minutos</strong>, consumo atômico (um único
                uso) e janela curta de reuso de código pendente (60 segundos)
                para evitar duplicação no envio;
              </li>
              <li>
                Princípio do menor privilégio nas credenciais de acesso à
                réplica da plataforma Click (somente leitura);
              </li>
              <li>
                Atualizações periódicas de dependências e revisão de segurança
                em mudanças sensíveis;
              </li>
              <li>
                Uso de URLs assinadas e de curta duração para o conteúdo
                armazenado em R2;
              </li>
              <li>
                Acesso aos logs operacionais limitado ao time de engenharia da
                Clickcannabis, com retenção de até 90 dias.
              </li>
            </ul>
            <blockquote>
              <strong>Transparência sobre logs operacionais.</strong> Em sua
              versão atual, o servidor do Aplicativo pode registrar em logs o
              número de telefone do titular e o código OTP em texto durante
              eventos de envio e verificação, com a finalidade de diagnóstico. O
              acesso a esses logs é restrito à equipe de engenharia da
              Clickcannabis, e a retenção é limitada (até 90 dias). A
              Clickcannabis está implementando, como melhoria de privacidade,{" "}
              <strong>mascaramento do telefone</strong> e{" "}
              <strong>omissão do código OTP</strong> nesses logs; até essa
              medida estar concluída, descrevemos a postura atual de forma
              honesta nesta política.
            </blockquote>

            <h3>9.3 Retenção</h3>
            <table>
              <thead>
                <tr>
                  <th>Dado</th>
                  <th>Prazo de retenção</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    Cadastro do titular no Aplicativo (tabela <code>user</code>)
                  </td>
                  <td>
                    Enquanto a conta existir; eliminado mediante solicitação ao
                    DPO (até a funcionalidade in-app de exclusão estar
                    disponível)
                  </td>
                </tr>
                <tr>
                  <td>
                    Sessão (tabela <code>session</code>)
                  </td>
                  <td>
                    Até o logout ou expiração natural (<code>expires_at</code>)
                  </td>
                </tr>
                <tr>
                  <td>
                    Token de dispositivo (tabela <code>device_token</code>)
                  </td>
                  <td>
                    Até ser marcado como inválido (<code>invalid_at</code>) —
                    pelo dispositivo, pelo APNs/FCM ou por solicitação do
                    titular
                  </td>
                </tr>
                <tr>
                  <td>
                    OTP (tabela <code>otp</code>)
                  </td>
                  <td>
                    TTL de 15 minutos; registros consumidos (
                    <code>consumed_at</code>) podem ser mantidos por até 90 dias
                    para auditoria de segurança e depois eliminados
                  </td>
                </tr>
                <tr>
                  <td>
                    Dados clínicos, financeiros e documentais na plataforma
                    Click
                  </td>
                  <td>
                    Conforme política de retenção da plataforma Click e
                    exigência regulatória aplicável (Anvisa, CRM, fiscal)
                  </td>
                </tr>
                <tr>
                  <td>
                    Dados locais no dispositivo (doses, sono, humor, hidratação,
                    diário, configurações)
                  </td>
                  <td>
                    Enquanto o Aplicativo estiver instalado;{" "}
                    <strong>
                      eliminados ao desinstalar (iOS e Android) ou ao limpar os
                      dados do Aplicativo (Android)
                    </strong>
                  </td>
                </tr>
                <tr>
                  <td>
                    Logs operacionais (IP, user-agent, eventos de envio/
                    verificação de OTP)
                  </td>
                  <td>Até 90 dias</td>
                </tr>
              </tbody>
            </table>

            <h2>10. Permissões do Aplicativo</h2>

            <h3>10.1 iOS</h3>
            <table>
              <thead>
                <tr>
                  <th>Permissão</th>
                  <th>Finalidade</th>
                  <th>Obrigatoriedade</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Notificações push</td>
                  <td>
                    Lembretes de doses, anamnese e comunicações operacionais
                  </td>
                  <td>
                    Opcional (concedida pelo titular no primeiro lembrete)
                  </td>
                </tr>
                <tr>
                  <td>
                    Galeria de fotos (<code>NSPhotoLibraryUsageDescription</code>
                    )
                  </td>
                  <td>Selecionar foto de perfil</td>
                  <td>Opcional</td>
                </tr>
                <tr>
                  <td>
                    Salvar na galeria (
                    <code>NSPhotoLibraryAddUsageDescription</code>)
                  </td>
                  <td>Salvar papéis de parede oferecidos pelo Aplicativo</td>
                  <td>Opcional</td>
                </tr>
              </tbody>
            </table>

            <h3>10.2 Android</h3>
            <table>
              <thead>
                <tr>
                  <th>Permissão</th>
                  <th>Finalidade</th>
                  <th>Obrigatoriedade</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <code>INTERNET</code>
                  </td>
                  <td>Comunicação com o servidor</td>
                  <td>Obrigatória</td>
                </tr>
                <tr>
                  <td>
                    <code>READ_MEDIA_IMAGES</code>,{" "}
                    <code>READ_MEDIA_VIDEO</code>,{" "}
                    <code>READ_MEDIA_AUDIO</code>
                  </td>
                  <td>Selecionar foto de perfil; salvar papéis de parede</td>
                  <td>Opcional (concedida no momento do uso)</td>
                </tr>
                <tr>
                  <td>
                    <code>READ_EXTERNAL_STORAGE</code>,{" "}
                    <code>WRITE_EXTERNAL_STORAGE</code>
                  </td>
                  <td>
                    Compatibilidade com versões antigas do Android para acesso à
                    galeria
                  </td>
                  <td>Opcional</td>
                </tr>
                <tr>
                  <td>
                    <code>VIBRATE</code>
                  </td>
                  <td>Feedback tátil em interações</td>
                  <td>Obrigatória (sem coleta de dado)</td>
                </tr>
                <tr>
                  <td>
                    <code>SYSTEM_ALERT_WINDOW</code>
                  </td>
                  <td>Exibição de alertas in-app em casos específicos</td>
                  <td>Opcional</td>
                </tr>
                <tr>
                  <td>Notificações</td>
                  <td>Lembretes de doses e comunicações operacionais</td>
                  <td>Opcional (Android 13+)</td>
                </tr>
              </tbody>
            </table>

            <h3>10.3 Permissões que o Aplicativo NÃO solicita</h3>
            <p>
              Câmera, microfone, contatos, calendário, localização,
              biometria/Face ID, sensores corporais, HealthKit/Health Connect,
              telefone, SMS, agenda, dispositivos Bluetooth pareados.
            </p>

            <h2>11. Direitos do Titular</h2>
            <p>
              Em conformidade com os artigos 17 a 22 da LGPD, o titular pode, a
              qualquer momento, solicitar gratuitamente:
            </p>
            <ol>
              <li>
                <strong>Confirmação</strong> da existência de tratamento;
              </li>
              <li>
                <strong>Acesso</strong> aos dados pessoais que tratamos;
              </li>
              <li>
                <strong>Correção</strong> de dados incompletos, inexatos ou
                desatualizados;
              </li>
              <li>
                <strong>Anonimização, bloqueio ou eliminação</strong> de dados
                desnecessários, excessivos ou tratados em desconformidade com a
                LGPD;
              </li>
              <li>
                <strong>Portabilidade</strong> dos dados a outro fornecedor de
                serviço;
              </li>
              <li>
                <strong>Eliminação</strong> dos dados tratados com base em
                consentimento;
              </li>
              <li>
                <strong>Informação</strong> sobre as entidades públicas e
                privadas com as quais a Clickcannabis compartilhou dados;
              </li>
              <li>
                <strong>Informação</strong> sobre a possibilidade de não
                fornecer consentimento e as consequências dessa recusa;
              </li>
              <li>
                <strong>Revogação do consentimento</strong>, a qualquer tempo;
              </li>
              <li>
                <strong>Revisão</strong> de decisões automatizadas que afetem
                seus interesses (por exemplo, a estruturação automática da
                prescrição feita por IA — o titular pode solicitar revisão
                manual).
              </li>
            </ol>

            <h3>Como exercer</h3>
            <ul>
              <li>
                <strong>Eliminação dos dados locais (no dispositivo):</strong>
                <ul>
                  <li>
                    <strong>iOS:</strong> desinstalar o Aplicativo. Como o iOS
                    apaga o sandbox do app na desinstalação, todos os registros
                    locais (doses, sono, humor, hidratação, foto de perfil,
                    sessão) são eliminados.
                  </li>
                  <li>
                    <strong>Android:</strong> desinstalar o Aplicativo, ou ir em{" "}
                    <em>
                      Configurações → Aplicativos → ClickCannabis →
                      Armazenamento → Limpar dados
                    </em>
                    .
                  </li>
                  <li>
                    Em ambos os sistemas, desativar notificações nas
                    configurações do dispositivo encerra o envio de lembretes (e
                    o Aplicativo, na próxima abertura, marca o token como
                    inválido na tabela <code>device_token</code>).
                  </li>
                </ul>
              </li>
              <li>
                <strong>Exclusão da conta no servidor do Aplicativo:</strong>{" "}
                atualmente, a exclusão da conta criada para uso do Aplicativo
                (registros nas tabelas <code>user</code>, <code>session</code>,{" "}
                <code>device_token</code>, <code>otp</code>) é processada{" "}
                <strong>mediante solicitação ao DPO</strong> em{" "}
                <a href="mailto:privacidade@clickcannabis.com">
                  privacidade@clickcannabis.com
                </a>
                . A Clickcannabis está implementando funcionalidade in-app para
                que o titular possa excluir sua própria conta diretamente pelo
                Aplicativo, em conformidade com as diretrizes da Apple
                (5.1.1(v)) e do Google Play.
              </li>
              <li>
                <strong>
                  Eliminação dos dados na plataforma Click:
                </strong>{" "}
                os dados clínicos, financeiros e documentais residem na
                plataforma Click (mesmo controlador) e seguem a política de
                retenção daquela plataforma e a regulamentação aplicável
                (Anvisa, registros médicos, fiscal). Solicitações de eliminação
                podem ser feitas pelo mesmo canal do DPO.
              </li>
              <li>
                <strong>Pelo DPO:</strong>{" "}
                <a href="mailto:privacidade@clickcannabis.com">
                  privacidade@clickcannabis.com
                </a>
                . Responderemos em até <strong>15 dias úteis</strong>.
              </li>
              <li>
                <strong>ANPD:</strong> o titular tem direito de peticionar à
                Autoridade Nacional de Proteção de Dados em caso de não
                atendimento.
              </li>
            </ul>

            <h2>12. Cookies e Rastreamento</h2>
            <p>
              O Aplicativo <strong>não utiliza</strong> cookies, pixels, SDKs de
              analytics (Google Analytics, Firebase Analytics, Mixpanel,
              Amplitude, Segment, Sentry, Crashlytics, PostHog etc.),
              identificadores publicitários (IDFA, GAID), redes sociais
              embarcadas, <em>fingerprinting</em> nem qualquer outra tecnologia
              de rastreamento comportamental.
            </p>

            <h2>13. Menores de Idade</h2>
            <p>
              O Aplicativo é destinado <strong>exclusivamente</strong> a maiores
              de 18 anos, em consonância com o Estatuto da Criança e do
              Adolescente (Lei 8.069/1990) e com a regulamentação aplicável ao
              uso terapêutico de cannabis no Brasil. A Clickcannabis não trata,
              conscientemente, dados pessoais de menores. Caso identifique
              tratamento indevido, eliminará os dados.
            </p>

            <h2>14. Inteligência Artificial e Decisões Automatizadas</h2>
            <p>
              O Aplicativo utiliza o modelo{" "}
              <strong>
                Claude Sonnet (<code>claude-sonnet-4-6</code>) da Anthropic
              </strong>{" "}
              para <strong>estruturar automaticamente</strong> o conteúdo da
              receita médica (extração de medicamentos, dosagens, posologia e
              periodicidade) em um formato que facilita a configuração dos
              lembretes pelo titular. Essa estruturação:
            </p>
            <ul>
              <li>
                <strong>Não substitui</strong> a prescrição do médico — a fonte
                de verdade clínica continua sendo o documento emitido pelo
                profissional;
              </li>
              <li>
                <strong>Não recomenda</strong> dose, frequência ou produto
                distintos do que foi prescrito; o modelo é instruído a
                transcrever o que está na receita, não a inferir terapêutica;
              </li>
              <li>
                Pode ser <strong>revisada e corrigida</strong> manualmente pelo
                titular antes que qualquer lembrete seja gravado;
              </li>
              <li>
                É <strong>opcional</strong>: o titular pode inserir manualmente
                seus medicamentos, hipótese em que o conteúdo da receita{" "}
                <strong>não é enviado à Anthropic</strong>.
              </li>
            </ul>
            <p>
              Em conformidade com o <strong>Art. 20 da LGPD</strong>, o titular
              tem direito de solicitar a{" "}
              <strong>revisão por pessoa natural</strong> das decisões tomadas
              com base em tratamento automatizado. No fluxo do Aplicativo, isso
              significa: (i) revisar e ajustar manualmente o resultado da
              estruturação automática antes de salvar; ou (ii) solicitar
              avaliação ao DPO em{" "}
              <a href="mailto:privacidade@clickcannabis.com">
                privacidade@clickcannabis.com
              </a>
              .
            </p>
            <p>
              A IA do Aplicativo{" "}
              <strong>
                não realiza diagnóstico, não emite recomendações clínicas e não
                tem efeito vinculante sobre o tratamento
              </strong>
              .
            </p>

            <h2>15. Segurança em Caso de Incidentes</h2>
            <p>
              Em caso de incidente de segurança que possa acarretar{" "}
              <strong>risco ou dano relevante</strong> aos titulares, a
              Clickcannabis comunicará a ocorrência:
            </p>
            <ul>
              <li>
                À <strong>ANPD</strong>, em prazo razoável e na forma exigida
                pela autoridade;
              </li>
              <li>
                Aos <strong>titulares afetados</strong>, indicando a natureza
                dos dados envolvidos, as medidas técnicas e de segurança
                adotadas, os riscos e as medidas para mitigação.
              </li>
            </ul>
            <p>
              Canal para comunicação de incidentes ou suspeitas:{" "}
              <a href="mailto:privacidade@clickcannabis.com">
                privacidade@clickcannabis.com
              </a>
              .
            </p>

            <h2>16. Alterações desta Política</h2>
            <p>
              Esta política pode ser atualizada para refletir mudanças no
              Aplicativo, na legislação ou nas operações da Clickcannabis. As
              atualizações serão comunicadas por:
            </p>
            <ul>
              <li>Atualização da data e da versão no topo do documento;</li>
              <li>
                Aviso dentro do próprio Aplicativo nas hipóteses de mudança
                material;
              </li>
              <li>
                Publicação da versão atualizada em{" "}
                <code>clickatendimento.com/app/privacidade</code>.
              </li>
            </ul>
            <p>
              O uso continuado do Aplicativo após a publicação implica aceitação
              das alterações que não dependam de novo consentimento. Quando a
              alteração depender de novo consentimento (por exemplo, nova
              categoria de dado sensível), o consentimento será solicitado
              especificamente.
            </p>

            <h2>17. Legislação Aplicável e Foro</h2>
            <p>Esta política é regida pela:</p>
            <ul>
              <li>
                <strong>Lei 13.709/2018</strong> — Lei Geral de Proteção de
                Dados Pessoais (LGPD);
              </li>
              <li>
                <strong>Lei 12.965/2014</strong> — Marco Civil da Internet;
              </li>
              <li>
                <strong>Lei 8.078/1990</strong> — Código de Defesa do
                Consumidor;
              </li>
              <li>
                <strong>Lei 8.069/1990</strong> — Estatuto da Criança e do
                Adolescente;
              </li>
              <li>
                <strong>Resolução RDC 660/2022 e correlatas</strong> — Anvisa,
                no que tange à importação e ao uso terapêutico de produtos à
                base de cannabis.
              </li>
            </ul>
            <p>
              Eventuais disputas serão dirimidas no foro da sede da
              Clickcannabis, ressalvado o direito do consumidor de acionar o
              foro de seu domicílio.
            </p>

            <hr />

            <p
              style={{
                fontSize: 13,
                color: "#7A9A88",
                textAlign: "center",
              }}
            >
              © 2026 Clickcannabis S.A. Todos os direitos reservados.
            </p>
          </div>
        </article>
      </main>
    </div>
  );
}
