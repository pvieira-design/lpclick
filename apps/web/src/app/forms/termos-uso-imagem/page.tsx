import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Termos de Uso de Imagem e Voz — Click Cannabis",
  robots: { index: false, follow: false },
};

export default function TermosUsoImagem() {
  return (
    <div style={{ maxWidth: 640, margin: "0 auto", padding: "48px 24px 80px", fontFamily: "'Outfit', system-ui, sans-serif", color: "#0A1F12" }}>
      <style>{`
        .terms-list { padding-left: 20px; margin-top: 10px; margin-bottom: 4px; }
        .terms-list li { margin-bottom: 8px; }
        .terms-section a { color: #1B6B3A; font-weight: 600; }
      `}</style>

      <img src="/logo.svg" alt="Click Cannabis" width={120} height={17} style={{ marginBottom: 32 }} />

      <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.2 }}>
        Termo de Autorização de Uso de Imagem, Voz e Cessão de Direitos
      </h1>

      <p style={{ marginTop: 24, fontSize: 15, lineHeight: 1.7, color: "#3D5A48" }}>
        Ao marcar a caixa de autorização no formulário de participação da campanha{" "}
        <strong>&quot;Conte Sua História&quot;</strong>, o participante declara, de forma livre,
        informada, inequívoca e espontânea, que autoriza a <strong>Clickcannabis S.A.</strong>{" "}
        (CNPJ 58.090.406/0001-92), doravante denominada &quot;Click Cannabis&quot;, a utilizar
        sua imagem, voz, nome e depoimento gravados em vídeo, nos termos abaixo.
      </p>

      <Section title="1. Fundamentação Legal">
        <p>O presente termo fundamenta-se nas seguintes disposições legais:</p>
        <ul className="terms-list">
          <li><strong>Constituição Federal</strong>, Art. 5º, incisos V, X e XXVIII — proteção à imagem, honra e direito de reprodução;</li>
          <li><strong>Código Civil</strong> (Lei nº 10.406/2002), Art. 20 — autorização para uso de imagem com fins comerciais;</li>
          <li><strong>Lei Geral de Proteção de Dados — LGPD</strong> (Lei nº 13.709/2018), Arts. 7º(I), 11(I) e 18 — consentimento para tratamento de dados pessoais e dados sensíveis;</li>
          <li><strong>Marco Civil da Internet</strong> (Lei nº 12.965/2014) — direitos e garantias no uso da internet.</li>
        </ul>
      </Section>

      <Section title="2. Objeto da Autorização">
        <p>
          O participante autoriza a Click Cannabis a captar, armazenar, reproduzir, editar, adaptar,
          traduzir, legendar, dublar, publicar, exibir, transmitir, retransmitir, distribuir e
          veicular a sua imagem, voz, nome e depoimento, conforme vídeo voluntariamente enviado
          no âmbito da campanha &quot;Conte Sua História&quot;.
        </p>
        <p style={{ marginTop: 10 }}>
          A autorização abrange o material original e quaisquer <strong>obras derivadas</strong>,
          incluindo, mas não se limitando a: versões editadas, recortadas, compiladas, montagens,
          adaptações de formato, inclusão de legendas, trilhas sonoras, efeitos visuais e criação
          de peças publicitárias.
        </p>
      </Section>

      <Section title="3. Finalidade e Canais de Veiculação">
        <p>A imagem, voz e depoimento poderão ser utilizados para as seguintes finalidades e nos seguintes canais, sem limitação:</p>
        <ul className="terms-list">
          <li><strong>Redes sociais</strong> — Instagram, Facebook, TikTok, YouTube, X (Twitter), LinkedIn, Pinterest, Threads e quaisquer outras plataformas existentes ou que venham a existir;</li>
          <li><strong>Anúncios pagos e remarketing</strong> — campanhas de mídia paga em plataformas como Meta Ads, Google Ads, TikTok Ads, YouTube Ads e redes de display, incluindo remarketing e retargeting;</li>
          <li><strong>Website e aplicativos</strong> — sites, landing pages, páginas de depoimentos, blogs e aplicativos da Click Cannabis;</li>
          <li><strong>E-mail marketing</strong> — newsletters, campanhas de e-mail, automações e sequências de comunicação;</li>
          <li><strong>Materiais impressos</strong> — folhetos, banners, catálogos, revistas, jornais e materiais de ponto de venda;</li>
          <li><strong>Mídia audiovisual</strong> — televisão aberta e fechada, streaming, podcasts, webinars e transmissões ao vivo;</li>
          <li><strong>Eventos e apresentações</strong> — feiras, congressos, palestras, seminários e apresentações corporativas;</li>
          <li><strong>Páginas públicas de depoimentos</strong> — seções abertas ao público no site ou em plataformas de terceiros com a finalidade de compartilhar experiências de pacientes;</li>
          <li><strong>Comunicação institucional</strong> — relatórios, apresentações para investidores, materiais internos e de imprensa.</li>
        </ul>
      </Section>

      <Section title="4. Sublicenciamento e Parceiros">
        <p>
          O participante autoriza a Click Cannabis a sublicenciar, total ou parcialmente, os direitos
          aqui cedidos a <strong>agências de publicidade, produtoras de conteúdo, veículos de
          comunicação e parceiros comerciais</strong>, exclusivamente para as finalidades previstas
          na Cláusula 3, comprometendo-se a Click Cannabis a exigir de seus sublicenciados o
          cumprimento dos mesmos termos e condições aqui estabelecidos.
        </p>
      </Section>

      <Section title="5. Prazo e Revogação">
        <p>
          A autorização é concedida por <strong>prazo indeterminado</strong>, podendo ser revogada
          a qualquer momento pelo participante mediante comunicação por escrito ao e-mail{" "}
          <a href="mailto:privacidade@clickcannabis.com">privacidade@clickcannabis.com</a>.
        </p>
        <p style={{ marginTop: 10 }}>
          A revogação produzirá efeitos a partir do recebimento da comunicação pela Click Cannabis,
          que terá o prazo de <strong>30 (trinta) dias úteis</strong> para cessar o uso do material
          em novos conteúdos. A revogação <strong>não afetará a licitude do uso</strong> realizado
          anteriormente à data de comunicação, conforme Art. 15, §3º da LGPD, nem obrigará a
          remoção de conteúdos já publicados por terceiros que tenham compartilhado, incorporado
          ou republicado o material enquanto vigente a autorização.
        </p>
      </Section>

      <Section title="6. Território">
        <p>
          A autorização é válida para uso em <strong>território nacional e internacional</strong>,
          em qualquer meio de comunicação, incluindo meios digitais e impressos, sem restrição
          geográfica.
        </p>
      </Section>

      <Section title="7. Gratuidade">
        <p>
          A presente autorização é concedida a <strong>título gratuito</strong>, não gerando
          qualquer direito a remuneração, compensação financeira ou indenização ao participante
          pelo uso de sua imagem, voz e depoimento, salvo os prêmios expressamente previstos
          no regulamento da campanha &quot;Conte Sua História&quot;.
        </p>
      </Section>

      <Section title="8. Edição e Obras Derivadas">
        <p>
          A Click Cannabis poderá editar o vídeo livremente, incluindo, sem limitação: cortes,
          seleção de trechos, inclusão de legendas, tradução, dublagem, adição de trilha sonora,
          filtros, efeitos visuais, adaptações de formato (horizontal, vertical, stories, reels,
          shorts), inserção em compilações e montagens com outros depoimentos, <strong>desde que
          não desvirtue o sentido do depoimento original ou prejudique a honra e a reputação
          do participante</strong>.
        </p>
      </Section>

      <Section title="9. Consentimento para Tratamento de Dados Sensíveis">
        <p>
          O participante declara estar ciente de que, ao enviar vídeo com depoimento sobre seu
          tratamento com cannabis medicinal, está voluntariamente compartilhando{" "}
          <strong>dados pessoais sensíveis referentes à sua saúde</strong>, nos termos do Art. 5º,
          inciso II e Art. 11, inciso I da LGPD.
        </p>
        <p style={{ marginTop: 10 }}>
          O participante consente, de forma <strong>específica, destacada e informada</strong>,
          com o tratamento desses dados sensíveis pela Click Cannabis para as finalidades
          descritas neste termo, estando ciente de que:
        </p>
        <ul className="terms-list">
          <li>O compartilhamento de informações de saúde é <strong>voluntário</strong> e de inteira responsabilidade do participante;</li>
          <li>Uma vez publicado em meios digitais, o conteúdo pode ser <strong>visualizado, copiado, compartilhado ou republicado por terceiros</strong>, sobre os quais a Click Cannabis não tem controle;</li>
          <li>A <strong>remoção completa</strong> de conteúdo já disseminado na internet pode não ser tecnicamente possível, mesmo após a revogação do consentimento;</li>
          <li>Os dados serão tratados com as medidas de segurança adequadas, conforme Art. 46 da LGPD.</li>
        </ul>
      </Section>

      <Section title="10. Direitos do Participante (Art. 18, LGPD)">
        <p>O participante poderá, a qualquer momento, exercer os seguintes direitos junto à Click Cannabis:</p>
        <ul className="terms-list">
          <li>Confirmação da existência de tratamento dos seus dados;</li>
          <li>Acesso aos dados pessoais tratados;</li>
          <li>Correção de dados incompletos, inexatos ou desatualizados;</li>
          <li>Anonimização, bloqueio ou eliminação de dados desnecessários ou excessivos;</li>
          <li>Informação sobre compartilhamento de dados com terceiros;</li>
          <li>Revogação do consentimento, nos termos da Cláusula 5.</li>
        </ul>
        <p style={{ marginTop: 10 }}>
          As solicitações devem ser encaminhadas ao Encarregado de Proteção de Dados (DPO) pelo
          e-mail <a href="mailto:privacidade@clickcannabis.com">privacidade@clickcannabis.com</a>,
          e serão respondidas no prazo de até 15 (quinze) dias, conforme Art. 18, §5º da LGPD.
        </p>
      </Section>

      <Section title="11. Veracidade das Informações">
        <p>
          O participante declara que todas as informações fornecidas e o depoimento gravado em
          vídeo são <strong>verdadeiros, autênticos e de sua inteira responsabilidade</strong>,
          isentando a Click Cannabis de qualquer responsabilidade por declarações inverídicas,
          imprecisas ou que violem direitos de terceiros.
        </p>
      </Section>

      <Section title="12. Ausência de Obrigatoriedade de Uso">
        <p>
          A Click Cannabis não se obriga a utilizar a imagem, voz ou depoimento do participante,
          reservando-se o direito de selecionar, a seu exclusivo critério, os conteúdos que serão
          publicados ou veiculados.
        </p>
      </Section>

      <Section title="13. Proteção de Dados e Segurança">
        <p>
          Os dados pessoais coletados serão tratados em conformidade com a{" "}
          <strong>Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018)</strong> e demais
          normas aplicáveis. A Click Cannabis adota medidas técnicas e administrativas adequadas
          para proteger os dados pessoais contra acessos não autorizados, destruição, perda,
          alteração ou qualquer forma de tratamento inadequado.
        </p>
        <p style={{ marginTop: 10 }}>
          Para mais informações sobre como seus dados são tratados, consulte nossa{" "}
          <a href="/app/privacidade">Política de Privacidade</a>.
        </p>
      </Section>

      <Section title="14. Disposições Gerais">
        <ul className="terms-list">
          <li>Este termo é regido pelas leis da República Federativa do Brasil.</li>
          <li>Eventuais litígios serão dirimidos pelo foro da Comarca da Cidade do Rio de Janeiro/RJ, com renúncia de qualquer outro, por mais privilegiado que seja.</li>
          <li>A nulidade de qualquer cláusula deste termo não invalida as demais disposições, que permanecerão em pleno vigor e efeito.</li>
          <li>A tolerância de qualquer das partes quanto ao descumprimento de obrigações pela outra não importará em novação, renúncia ou alteração do acordado.</li>
        </ul>
      </Section>

      <Section title="15. Contato">
        <p>
          Para dúvidas, solicitações ou exercício de direitos relacionados a este termo,
          entre em contato com o Encarregado de Proteção de Dados (DPO):
        </p>
        <p style={{ marginTop: 10 }}>
          <strong>E-mail:</strong>{" "}
          <a href="mailto:privacidade@clickcannabis.com">privacidade@clickcannabis.com</a>
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
    <div className="terms-section" style={{ marginTop: 28 }}>
      <h2 style={{ fontSize: 17, fontWeight: 700, color: "#0A1F12", marginBottom: 10 }}>{title}</h2>
      <div style={{ fontSize: 15, lineHeight: 1.7, color: "#3D5A48" }}>
        {children}
      </div>
    </div>
  );
}
