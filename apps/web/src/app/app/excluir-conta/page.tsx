import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Excluir conta — Click Cannabis",
  description: "Solicite a exclusão da sua conta do aplicativo Click Cannabis, mesmo sem o app instalado.",
};

export default function AccountDeletionPage() {
  const requestUrl = "mailto:privacidade@clickcannabis.com?subject=" +
    encodeURIComponent("Exclusão da Conta do App Click Cannabis");

  return (
    <div className="deletion-page">
      <style>{`
.deletion-page { min-height: 100svh; background: #FAFCFB; color: #0A1F12; }
.deletion-nav { border-bottom: 1px solid rgba(11,61,30,.08); background: #FAFCFB; }
.deletion-nav-inner { max-width: 760px; margin: 0 auto; padding: 20px 24px; display: flex; align-items: center; justify-content: space-between; gap: 24px; }
.deletion-back { color: #1B6B3A; font-size: 14px; font-weight: 600; text-decoration: none; }
.deletion-main { max-width: 760px; margin: 0 auto; padding: 64px 24px 72px; }
.deletion-hero { margin-bottom: 32px; }
.deletion-eyebrow { display: block; color: #1B6B3A; font-size: 12px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; margin-bottom: 16px; }
.deletion-hero h1 { font-size: clamp(32px, 5vw, 44px); font-weight: 700; letter-spacing: -.035em; line-height: 1.12; color: #0B3D1E; margin: 0 0 20px; }
.deletion-page p { color: #4A6B56; font-size: 15px; line-height: 1.75; margin: 0 0 16px; }
.deletion-hero p { max-width: 590px; font-size: 17px; line-height: 1.65; margin-bottom: 0; }
.deletion-request { background: #fff; border: 1px solid #DDE9E0; border-radius: 20px; padding: 28px; box-shadow: 0 8px 28px rgba(11,61,30,.035); margin-bottom: 44px; }
.deletion-cta { display: inline-flex; align-items: center; justify-content: center; background: #1B6B3A; color: #fff; font-size: 15px; font-weight: 600; padding: 15px 22px; border-radius: 12px; text-decoration: none; margin-bottom: 20px; min-height: 50px; }
.deletion-cta:hover { background: #124E29; }
.deletion-page a:focus-visible { outline: 3px solid #75A785; outline-offset: 4px; }
.deletion-request p:last-child { margin-bottom: 0; font-size: 14px; }
.deletion-request p a, .deletion-details a { color: #1B6B3A; text-decoration: underline; text-underline-offset: 3px; overflow-wrap: anywhere; }
.deletion-details h2 { font-size: 21px; font-weight: 650; letter-spacing: -.02em; line-height: 1.35; color: #0B3D1E; margin: 32px 0 12px; }
.deletion-details h2:first-child { margin-top: 0; }
.deletion-details > p:last-child { border-top: 1px solid #DDE9E0; margin-top: 32px; padding-top: 24px; font-size: 14px; }
@media (max-width: 520px) {
 .deletion-nav-inner { padding: 18px 20px; gap: 16px; }
 .deletion-nav-inner img { width: 124px; height: auto; }
 .deletion-back { font-size: 12px; }
 .deletion-main { padding: 40px 20px 48px; }
 .deletion-request { padding: 22px; border-radius: 16px; margin-bottom: 32px; }
 .deletion-cta { display: flex; width: 100%; padding-inline: 12px; font-size: 14px; }
 .deletion-hero p { font-size: 16px; }
}
`}</style>
      <nav className="deletion-nav" aria-label="Navegação do aplicativo">
        <div className="deletion-nav-inner">
          <a href="/app"><img src="/logo.svg" alt="Click Cannabis" width={140} height={20} /></a>
          <a className="deletion-back" href="/app">Voltar ao app</a>
        </div>
      </nav>
      <main className="deletion-main">
        <header className="deletion-hero">
          <span className="deletion-eyebrow">Sua privacidade</span>
          <h1>Excluir sua conta do app</h1>
      <p>Você pode solicitar a exclusão da sua conta do aplicativo Click Cannabis sem instalar ou abrir o app.</p>
        </header>
        <section className="deletion-request" aria-label="Solicitar exclusão da conta">

      <a className="deletion-cta" href={requestUrl}>Solicitar exclusão por e-mail</a>
      <p>Envie o pedido para <a href="mailto:privacidade@clickcannabis.com">privacidade@clickcannabis.com</a>, informando o telefone vinculado à conta, com código do país e DDD. Não envie senha, código de acesso, receita ou informações de saúde.</p>
      <p>Podemos solicitar informações para confirmar sua identidade ou representação e proteger os dados do paciente. O atendimento observará os prazos legais aplicáveis. Você também pode escrever para <a href="mailto:clickcannabis@clickcannabis.com">clickcannabis@clickcannabis.com</a>.</p>

        </section>
        <div className="deletion-details">
          <h2>O que será excluído</h2>
      <p>A exclusão remove a conta e os dados associados mantidos pelos sistemas do app, encerra suas sessões e inicia a limpeza dos dados locais nos aparelhos vinculados. Outros aparelhos precisam voltar à internet para receber o comando de limpeza. Para aparelhos que permanecerem offline, remova também os dados localmente.</p>
      <h2>Registros mantidos na plataforma Click</h2>
      <p>Excluir a conta do app não exclui consultas, receitas, documentos, pagamentos ou registros de acompanhamento já mantidos na plataforma Click. Você pode solicitar a análise da exclusão desses dados pelos mesmos canais de privacidade. A análise considera as obrigações de conservação aplicáveis.</p>
      <p>Dados locais também podem estar sujeitos às configurações de backup e restauração do seu aparelho.</p>
      <h2>Se você tem acesso ao app</h2>
      <p>A exclusão também está disponível em Care → Configurações do app → Conta → Excluir conta.</p>
      <p><a href="/app/privacidade">Leia a Política de Privacidade</a></p>

        </div>
      </main>
    </div>
  );
}
