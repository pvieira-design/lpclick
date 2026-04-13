import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Termos de Uso de Imagem — Click Cannabis",
  robots: { index: false, follow: false },
};

export default function TermosUsoImagem() {
  return (
    <div style={{ maxWidth: 640, margin: "0 auto", padding: "48px 24px 80px", fontFamily: "'Outfit', system-ui, sans-serif", color: "#0A1F12" }}>
      <img src="/logo.svg" alt="Click Cannabis" width={120} height={17} style={{ opacity: 0.3, marginBottom: 32 }} />

      <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.2 }}>
        Termo de Autorização de Uso de Imagem e Voz
      </h1>

      <p style={{ marginTop: 24, fontSize: 15, lineHeight: 1.7, color: "#3D5A48" }}>
        Ao marcar a caixa de autorização no formulário de participação da campanha{" "}
        <strong>&quot;Conte Sua História&quot;</strong>, você declara, de forma livre e espontânea,
        que autoriza a <strong>Clickcannabis S.A.</strong> (CNPJ 58.090.406/0001-92), doravante
        denominada simplesmente &quot;Click Cannabis&quot;, a utilizar sua imagem, voz e depoimento
        gravados em vídeo, nos termos abaixo:
      </p>

      <Section title="1. Objeto da Autorização">
        <p>
          O presente termo autoriza a Click Cannabis a captar, armazenar, reproduzir, editar e
          veicular a imagem e voz do participante, conforme vídeo voluntariamente enviado pelo
          participante no âmbito da campanha &quot;Conte Sua História&quot;.
        </p>
      </Section>

      <Section title="2. Finalidade">
        <p>A imagem e voz poderão ser utilizadas para as seguintes finalidades:</p>
        <ul>
          <li>Divulgação em redes sociais da Click Cannabis (Instagram, YouTube, TikTok, Facebook e outros);</li>
          <li>Materiais de comunicação institucional;</li>
          <li>Materiais publicitários e de marketing, em qualquer meio ou formato;</li>
          <li>Apresentações corporativas e eventos;</li>
          <li>Website e aplicativo da Click Cannabis.</li>
        </ul>
      </Section>

      <Section title="3. Prazo">
        <p>
          A autorização é concedida por prazo indeterminado, podendo ser revogada a qualquer
          momento pelo participante mediante comunicação por escrito ao e-mail{" "}
          <a href="mailto:privacidade@clickcannabis.com" style={{ color: "#1B6B3A", fontWeight: 600 }}>
            privacidade@clickcannabis.com
          </a>.
          A revogação não afetará o uso já realizado antes da data de comunicação.
        </p>
      </Section>

      <Section title="4. Território">
        <p>
          A autorização é válida para uso em território nacional e internacional, em qualquer
          meio de comunicação, incluindo meios digitais e impressos.
        </p>
      </Section>

      <Section title="5. Gratuidade">
        <p>
          A presente autorização é concedida a título gratuito, não gerando qualquer direito a
          remuneração ou indenização ao participante, salvo os prêmios previstos no regulamento
          da campanha.
        </p>
      </Section>

      <Section title="6. Edição">
        <p>
          A Click Cannabis poderá editar o vídeo, incluindo cortes, legendas, filtros e
          adaptações de formato, desde que não desvirtue o depoimento ou prejudique a imagem
          do participante.
        </p>
      </Section>

      <Section title="7. Proteção de Dados">
        <p>
          Os dados pessoais coletados serão tratados em conformidade com a Lei Geral de Proteção
          de Dados (LGPD — Lei nº 13.709/2018). Para mais informações, consulte nossa{" "}
          <a href="/app/privacidade" style={{ color: "#1B6B3A", fontWeight: 600 }}>
            Política de Privacidade
          </a>.
        </p>
      </Section>

      <Section title="8. Contato">
        <p>
          Para dúvidas ou solicitações relacionadas a este termo, entre em contato pelo e-mail{" "}
          <a href="mailto:privacidade@clickcannabis.com" style={{ color: "#1B6B3A", fontWeight: 600 }}>
            privacidade@clickcannabis.com
          </a>.
        </p>
      </Section>

      <div style={{ marginTop: 40, paddingTop: 24, borderTop: "1px solid #D0DDD6" }}>
        <p style={{ fontSize: 13, color: "#7A9A88" }}>
          Clickcannabis S.A. — CNPJ 58.090.406/0001-92
        </p>
        <p style={{ fontSize: 13, color: "#7A9A88", marginTop: 4 }}>
          Última atualização: Abril de 2026
        </p>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginTop: 28 }}>
      <h2 style={{ fontSize: 17, fontWeight: 700, color: "#0A1F12", marginBottom: 10 }}>{title}</h2>
      <div style={{
        fontSize: 15, lineHeight: 1.7, color: "#3D5A48",
      }}>
        {children}
        <style>{`
          .terms-section ul { padding-left: 20px; margin-top: 8px; }
          .terms-section li { margin-bottom: 6px; }
        `}</style>
      </div>
    </div>
  );
}
