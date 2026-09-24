/**
 * Base editorial aprovada pelo usuário em 24/09/2026 para NOVAS páginas.
 * 77 relatos integrais + 35 excertos, com omissões sinalizadas por […].
 * Fonte congelada: triagem-122-avaliacoes-2026-09-24; não puxar texto da base bruta.
 * Regras e histórico: docs/depoimentos-aprovados.md.
 */
export type ApprovedTestimonial = {
  name: string;
  text: string;
  photo: string;
  tags: string[];
  publishedAt: string;
  approvedVersion: "full" | "excerpt";
  sourceReviewId: number;
};

export const APPROVED_TESTIMONIALS: ApprovedTestimonial[] = [
  {
    "name": "Arthur Marques",
    "photo": "https://lh3.googleusercontent.com/a-/ALV-UjXPouVB9i7UvB05rFF5QtGH32AyCz_xxS5MlwQQVHFZYr7bwWwa=s96-c-rp-mo-br100",
    "publishedAt": "2024-08-01",
    "tags": [
      "Insônia"
    ],
    "text": "Demorei para avaliar pq estava ocupado dormindo! […] Atendimento nota 1000 e médicos super atenciosos, tive uma boa experiência com eles.",
    "approvedVersion": "excerpt",
    "sourceReviewId": 1
  },
  {
    "name": "Verista Convicto",
    "photo": "https://lh3.googleusercontent.com/a-/ALV-UjUFUHpBX3tRXzZCyEMEvkheDK-1zTzBrX44yeyMwG_YHycxg9fG=s96-c-rp-mo-ba2-br100",
    "publishedAt": "2024-04-05",
    "tags": [
      "Insônia",
      "Ansiedade"
    ],
    "text": "Estou tomando pra ansiedade e tem me ajudado muito. No começo fiquei meio receoso, mas é um ótimo produto, não causa nenhum barato, é totalmente seguro. Não tive qualquer efeito colateral. Hoje durmo melhor.",
    "approvedVersion": "full",
    "sourceReviewId": 2
  },
  {
    "name": "Nath Gomes",
    "photo": "https://lh3.googleusercontent.com/a-/ALV-UjWn39k1vGabrkl8lrp3d3Xz03mZD3AtBreXtnYW1K5X5HgdZFQ-Tw=s96-c-rp-mo-br100",
    "publishedAt": "2024-04-06",
    "tags": [
      "Insônia",
      "Ansiedade"
    ],
    "text": "Mesmo com pouco tempo de tratamento já tenho observado uma grande melhora na minha qualidade de sono e diminuição das crises de ansiedade.",
    "approvedVersion": "full",
    "sourceReviewId": 3
  },
  {
    "name": "Jhonat Anschau",
    "photo": "https://lh3.googleusercontent.com/a-/ALV-UjVVNJyfIcnUVY8vYk_NH3Ke-WtsIpQq6SeiGL4V120nyUxxQ4rY=s96-c-rp-mo-br100",
    "publishedAt": "2025-05-19",
    "tags": [
      "Insônia",
      "Humor"
    ],
    "text": "O Atendimento é ótimo, dão atenção total. […] Após uns 45 dias alteramos as dosagem para reequilibrar, mas sempre com acompanhanto. Demonstraram interesse, atenção e profissionalismo.",
    "approvedVersion": "excerpt",
    "sourceReviewId": 4
  },
  {
    "name": "Verinha Azeredo",
    "photo": "https://lh3.googleusercontent.com/a-/ALV-UjVFFlhouybjbHsZQFaixaiNmIw-QPwHTbKw1g6kEdmdVfKR-F-PYw=s96-c-rp-mo-br100",
    "publishedAt": "2025-07-16",
    "tags": [
      "Insônia",
      "Humor"
    ],
    "text": "Olá, boa noite! Estou muito satisfeita com o tratamento que iniciei na última 4a-feira (28/ago), e nítida a chave emocional que virou dentro de mim. Voltei a dormir e sinto-me bem relaxada após iniciar a minha medicação de CBD. Gratidão a todos vocês. Vera Lucia Teixeira de Azeredo",
    "approvedVersion": "full",
    "sourceReviewId": 5
  },
  {
    "name": "Juliana Leal",
    "photo": "https://lh3.googleusercontent.com/a-/ALV-UjWNS0avSn4zNm0g6fP1ToknkN2VEFgiD4zvmsnVSvG6-Q7VaAQs=s96-c-rp-mo-br100",
    "publishedAt": "2024-04-27",
    "tags": [
      "Insônia"
    ],
    "text": "Excelente atendimento e serviço! Estou amando meu tratamento com cannabis. […] Obrigado ClickCannabis",
    "approvedVersion": "excerpt",
    "sourceReviewId": 6
  },
  {
    "name": "Duda Santana",
    "photo": "https://lh3.googleusercontent.com/a-/ALV-UjVJ_LVKIu6ZgrXYAbvIP1y_pE2pqJg89SlgPgXrumc169z-o3jcLw=s96-c-rp-mo-ba2-br100",
    "publishedAt": "2025-02-10",
    "tags": [
      "Insônia",
      "Ansiedade",
      "Dor"
    ],
    "text": "Tenho sentido os efeitos benéficos da Cannabis para o meu tratamento de Insônia, TAG, TDAH e dor crônica da Endométriose. Simplesmente recomendo muito. Principalmente a equipe da Click Cannabis que tem dado todo o suporte necessário :)",
    "approvedVersion": "full",
    "sourceReviewId": 7
  },
  {
    "name": "Jorge Moreira",
    "photo": "https://lh3.googleusercontent.com/a-/ALV-UjVHYZMKG_LytwrDqQCkzZuslwAn3LmAO64zd8uuSPXMw1s_jq2M=s96-c-rp-mo-br100",
    "publishedAt": "2025-07-16",
    "tags": [
      "Insônia"
    ],
    "text": "A melhor possível ,tudo dentro da lei e no que eu estava precisando os óleos estão me auxiliando demais, peguei um pra regularizar o meu sono e um pra tentar para de fumar Resultado positivos em apenas três dias.",
    "approvedVersion": "full",
    "sourceReviewId": 8
  },
  {
    "name": "Luciana Pereira",
    "photo": "https://lh3.googleusercontent.com/a-/ALV-UjUiAJcs-Is_zgYWF7mHzAbbGeHNkhrX5gLFjWu9FtUGMwzTlmR1=s96-c-rp-mo-br100",
    "publishedAt": "2025-05-26",
    "tags": [
      "Insônia",
      "Ansiedade"
    ],
    "text": "Desde o primeiro momento, muito bem atendida! Com 30 dias em uso do óleo, melhorou a qualidade do meu sono e já não me sinto tão ansiosa quanto antes do tratamento! Grata à Click cannabis! 💚",
    "approvedVersion": "full",
    "sourceReviewId": 9
  },
  {
    "name": "Didi da Silva",
    "photo": "https://lh3.googleusercontent.com/a/ACg8ocLwAgJQ1Wi9G8EZllSXQehsAArH7hbaLMuq5z26SFnW6PbrRQ=s96-c-rp-mo-br100",
    "publishedAt": "2025-10-02",
    "tags": [
      "Insônia",
      "Ansiedade",
      "Depressão"
    ],
    "text": "Sofro com insônia, ansiedade e depressão. […] Está sendo uma experiência e tanto, desde que comecei o tratamento, meu sono melhorou consideravelmente, […] Indico muito. Só tenho a agradecer.",
    "approvedVersion": "excerpt",
    "sourceReviewId": 10
  },
  {
    "name": "ILZA CRISTIANE CARDOZO",
    "photo": "https://lh3.googleusercontent.com/a-/ALV-UjVa7AcHRDRvJ3kWbZfpzbI6G5jomWeQwjtE9YS5jgAtG_aCfbWLDA=s96-c-rp-mo-br100",
    "publishedAt": "2026-03-06",
    "tags": [
      "Insônia",
      "Ansiedade",
      "Depressão"
    ],
    "text": "Eu conheci a clínica através de uma amiga. […] mas na primeira dose já senti uma melhora. […]",
    "approvedVersion": "excerpt",
    "sourceReviewId": 11
  },
  {
    "name": "Gislene Spelta",
    "photo": "https://lh3.googleusercontent.com/a/ACg8ocJ3pCvGFz5O9jqx9zaWlsrbTsmxq-gnx1qhuN1Tt8pl-ioNXQ=s96-c-rp-mo-br100",
    "publishedAt": "2025-09-27",
    "tags": [
      "Insônia",
      "Dor"
    ],
    "text": "Estou gostando muito , meu sono melhorou bastante ( agora consigo pegar no sono rapidamente), as dores não passaram mas posso dizer que diminuíram por volta de 50% , o que é um grande avanço pra mim. Resumindo , dormindo melhor e com menos dores posso dizer que estou feliz e que consigo me sentir mais viva agora.",
    "approvedVersion": "full",
    "sourceReviewId": 12
  },
  {
    "name": "Angela Nicolau",
    "photo": "https://lh3.googleusercontent.com/a-/ALV-UjXeUZ6pk_QyGqdRglIrJrRjAMYBvBuagiKhxJx5ClF5hBQ_zYmVUw=s96-c-rp-mo-br100",
    "publishedAt": "2025-11-26",
    "tags": [
      "Insônia"
    ],
    "text": "Comecei o tratamento a um pouco mais de 7 dias. Insônia crônica pela menopausa a 6 meses. Na primeira noite, já senti melhora na qualidade do sono. Ajustando a dose, conforme prescrição, hoje durmo às 22:30h e acordo às 6h. Não há preço que pague isso. Obrigado a Click e a todos os envolvidos. Angela Nicolau",
    "approvedVersion": "full",
    "sourceReviewId": 13
  },
  {
    "name": "Suze Costa",
    "photo": "https://lh3.googleusercontent.com/a-/ALV-UjVcfJ0sbQJD50ek-u1bxUpm5H7PlV0rWfrtrepYWplYO5PdOnvSzA=s96-c-rp-mo-br100",
    "publishedAt": "2025-05-08",
    "tags": [
      "Insônia",
      "Ansiedade"
    ],
    "text": "Faz um mês que faço uso da cannabis, […] o sono é gostoso e satisfatório, quando acordo de madrugada é só fechar os olhos e adormeço novamente. Gratidão a todos da equipe!",
    "approvedVersion": "excerpt",
    "sourceReviewId": 14
  },
  {
    "name": "Rosilda Costa",
    "photo": "https://lh3.googleusercontent.com/a-/ALV-UjV8EvbDrxXexHjs-Us71esqNXeXVcaWnBNSLbIipuhkltNFyx9WKQ=s96-c-rp-mo-br100",
    "publishedAt": "2025-12-07",
    "tags": [
      "Insônia",
      "Ansiedade",
      "Artrite"
    ],
    "text": "Depois 30 dias sentir uma melhora nas minhas dores do joelho que tenho devido a artrose. Tenho sentido menos ansiedade. O sono ainda tá melhorando dias sim durma bem dias sim não..Mais creio que é devido preocupações do dia a dia. […]",
    "approvedVersion": "excerpt",
    "sourceReviewId": 15
  },
  {
    "name": "françoise Alves",
    "photo": "https://lh3.googleusercontent.com/a/ACg8ocLb6NeT956T3jbLQO3e1zNNIZTFUYQIv_Lcx5EAj38LmpdfpA=s96-c-rp-mo-br100",
    "publishedAt": "2025-10-01",
    "tags": [
      "Insônia",
      "Fibromialgia"
    ],
    "text": "Um mês de click e finalmente consigo sentir alívio para dormir e esperança que estou no caminho certo, a fibromialgia é dura, mas agora consigo ter esperança que em breve a qualidade de vida vai ficar 100% de novo. Muito boa a empresa, atenciosa e super atenta as nossas dificuldades, recomendo demais",
    "approvedVersion": "full",
    "sourceReviewId": 16
  },
  {
    "name": "Ana Paula Machado de Melo",
    "photo": "https://lh3.googleusercontent.com/a-/ALV-UjWalNwlwkahdtWQzeDzEeQybK-SRq5ltQJN_Ne3yaqk0tJBL0_tpA=s96-c-rp-mo-br100",
    "publishedAt": "2026-03-31",
    "tags": [
      "Insônia",
      "Ansiedade",
      "Dor na coluna"
    ],
    "text": "Estou me sentindo muito bem. […] Durmo a noite toda. Esse óleo de canabidiol é muito bom. […]",
    "approvedVersion": "excerpt",
    "sourceReviewId": 17
  },
  {
    "name": "KA Brasil",
    "photo": "https://lh3.googleusercontent.com/a-/ALV-UjVR22rDBhC7Nh8aegoTpwU50E6sYvfR9vKR394i4CFAYmWAPA8f=s96-c-rp-mo-br100",
    "publishedAt": "2026-04-01",
    "tags": [
      "Insônia"
    ],
    "text": "[…] Meu sono melhorou significativamente e meus dias estão muito mais produtivos. Fiquei impressionado com a qualidade do atendimento e a total transparência em todo o processo. Recomendo! […]",
    "approvedVersion": "excerpt",
    "sourceReviewId": 18
  },
  {
    "name": "Fabio Santos",
    "photo": "https://lh3.googleusercontent.com/a-/ALV-UjUHy-_5tvHfHhmvPfVOKKWZI1sD3xHc1TEGuM_kC3rG1zLcjTVo=s96-c-rp-mo-br100",
    "publishedAt": "2026-04-28",
    "tags": [
      "Insônia",
      "Artrite",
      "Dor na coluna"
    ],
    "text": "Me chamo Fabio tenho 53 anos e estou usando a pouco tempo (12 dias),mas ja sinto diferença na qualidade do meu sono e um alivio em minhas dores por conta da artrose no joelho e da estenose lombar. E o suporte da empresa click cannabis e da transportadora tre star express sao nota 10",
    "approvedVersion": "full",
    "sourceReviewId": 19
  },
  {
    "name": "Mirna Ribeiro",
    "photo": "https://lh3.googleusercontent.com/a-/ALV-UjVS3Ig_3GDdQmKpr3EK1VeSCrNiBQAS2j5Dt9dHj_6y4U92B6na3A=s96-c-rp-mo-br100",
    "publishedAt": "2026-04-01",
    "tags": [
      "Insônia",
      "Ansiedade",
      "Pânico"
    ],
    "text": "Apenas 15 dias e já durmo bem, […] Indico muito, estou realmente muito satisfeita!",
    "approvedVersion": "excerpt",
    "sourceReviewId": 20
  },
  {
    "name": "Juliana Lopes",
    "photo": "https://lh3.googleusercontent.com/a-/ALV-UjWmqQ3MmUnlBpqRJb_uXUel2PrcjREUz2s2-PY0w-4PnqIMtHI1=s96-c-rp-mo-br100",
    "publishedAt": "2025-09-18",
    "tags": [
      "Insônia",
      "Ansiedade",
      "Tea"
    ],
    "text": "[…] também mantenho uma rotina de alimentação e atividades físicas ! Melhorou muito a minha constância nessas e outras atividades.",
    "approvedVersion": "excerpt",
    "sourceReviewId": 21
  },
  {
    "name": "Vanessa Wankler",
    "photo": "https://lh3.googleusercontent.com/a-/ALV-UjWswlqO_7yZkYcI5hVze16n4xb2pP-LKLGcFGw5I7F0Gv9QJnM=s96-c-rp-mo-ba2-br100",
    "publishedAt": "2025-07-16",
    "tags": [
      "Insônia",
      "Ansiedade",
      "Artrite"
    ],
    "text": "Hoje faz um mês que iniciei o tratamento com canabidiol, […] Dores nas articulações diminuíram muito! Estou muito feliz com os resultados!",
    "approvedVersion": "excerpt",
    "sourceReviewId": 22
  },
  {
    "name": "Danilo Mastroianni",
    "photo": "https://lh3.googleusercontent.com/a-/ALV-UjV6zg9GbeXFror66yPwVNelt12hh80fhNXmm5w3sUH1_Oee7ypp=s96-c-rp-mo-br100",
    "publishedAt": "2025-10-19",
    "tags": [
      "Insônia",
      "Depressão"
    ],
    "text": "Estou em fase inicial de tratamento, e venho obtendo bons resultados! Através da Click Cannabis iniciei o tratamento para depressão e insônia com o uso do Óleo Full Spectrum Canna River e está realmente funcionando! Gratidão por tudo que a Click Cannabis fez por mim!",
    "approvedVersion": "full",
    "sourceReviewId": 23
  },
  {
    "name": "jordi font",
    "photo": "https://lh3.googleusercontent.com/a/ACg8ocL5vy4y6CumZBJpcNThKZ50wO__a39-hFz2WeG-LzGzFW6x8Q=s96-c-rp-mo-br100",
    "publishedAt": "2025-04-25",
    "tags": [
      "Insônia"
    ],
    "text": "Boa tarde, estou muito grato pelo tratamento da insônia com o uso do cannabis,um mês do uso e estou conseguindo dormir melhor […] Gratidao a toda a equipe do click são muito atenciosos acompanhando todo o tratamento.grato",
    "approvedVersion": "excerpt",
    "sourceReviewId": 24
  },
  {
    "name": "marina",
    "photo": "https://lh3.googleusercontent.com/a/ACg8ocIC_HIW5AJg67DO8Ue-0twvPXbi9F9j0wBrHMpYmzrfYRpXOA=s96-c-rp-mo-br100",
    "publishedAt": "2026-01-28",
    "tags": [
      "Insônia",
      "Ansiedade"
    ],
    "text": "Estou fazendo uso do óleo á 25 dias, estou bem melhor da ansiedade […] A gominha uso só em períodos de insônia, mas quase não uso pq estou dormindo melhor depois de iniciar o tratamento com o óleo de cbd.",
    "approvedVersion": "excerpt",
    "sourceReviewId": 25
  },
  {
    "name": "luiz carlos pizani",
    "photo": "https://lh3.googleusercontent.com/a/ACg8ocLubb3OyMY-mlK8_hcfw2JqIWYUy5sclrpzY-hm2rvIleovNw=s96-c-rp-mo-br100",
    "publishedAt": "2026-04-20",
    "tags": [
      "Insônia",
      "Dor"
    ],
    "text": "Gostei demais. Fui muito bem recebido por toda equipe e tive uma excelente consulta médica. Estou tomando a medicação e tenho verificado uma melhora muito grande na qualidade do meu sono e no combate a dores de articulação causadas pela prática de esporte",
    "approvedVersion": "full",
    "sourceReviewId": 26
  },
  {
    "name": "Pri Luz",
    "photo": "https://lh3.googleusercontent.com/a-/ALV-UjUTB3dat2zf9Jz10_EaWOZXXCkDMp7cSfkyIlxrh02Y0llr_o6gHQ=s96-c-rp-mo-br100",
    "publishedAt": "2026-03-30",
    "tags": [
      "Insônia",
      "Ansiedade",
      "Foco"
    ],
    "text": "Após 20 dias de tratamento com o óleo e a goma, parece que minha mente \"clareou\". […] Agradeço imensamente a esquipe da Click pelo cuidado, atenção e prontidão no atendimento.",
    "approvedVersion": "excerpt",
    "sourceReviewId": 27
  },
  {
    "name": "Thiago Jattobá",
    "photo": "https://lh3.googleusercontent.com/a-/ALV-UjUA-_QcyYK0KEvH2yot8Lv6XbolCfOkTx6dlFoPnj3j7hqjmmIO3Q=s96-c-rp-mo-ba3-br100",
    "publishedAt": "2025-01-21",
    "tags": [
      "Insônia",
      "Ansiedade"
    ],
    "text": "Excelente e rápido atendimento. […] Hoje completo minha primeira semana de tratamento e já sinto menos ansiedade, melhoria na qualidade do meu sono e melhor apetite!",
    "approvedVersion": "excerpt",
    "sourceReviewId": 28
  },
  {
    "name": "Lorena Carvalho da Silva",
    "photo": "https://lh3.googleusercontent.com/a-/ALV-UjWYqgYrRdQxiffO1KV8e_ggKjBLOOtzQGMFpoUUc2ny8qYHnYuN=s96-c-rp-mo-br100",
    "publishedAt": "2025-09-19",
    "tags": [
      "Insônia",
      "Ansiedade",
      "Pânico"
    ],
    "text": "Recomendo muito! Estou tendo resultados em menos de 2 meses. […] Estou muito feliz! O atendimento médico e suporte administrativo são maravilhosos. Estão sempre dispostos a ajudar e tirar dúvidas",
    "approvedVersion": "excerpt",
    "sourceReviewId": 30
  },
  {
    "name": "Cyco Engel",
    "photo": "https://lh3.googleusercontent.com/a-/ALV-UjVo4t6eF69gATFZrVjMXN3kS6d07rbBX0QdUdPAfXoLYPX6xLIEwA=s96-c-rp-mo-ba2-br100",
    "publishedAt": "2025-09-18",
    "tags": [
      "Insônia",
      "Dor"
    ],
    "text": "Muito boa a interação com a click cannabis, ótimo atendimento e suporte. […]",
    "approvedVersion": "excerpt",
    "sourceReviewId": 31
  },
  {
    "name": "carmen feix",
    "photo": "https://lh3.googleusercontent.com/a-/ALV-UjVv8H2Z9BXw2_O-g6--azz86vHKf1tYy6SnH8cbpL9bIsZGodWVMw=s96-c-rp-mo-ba3-br100",
    "publishedAt": "2025-12-16",
    "tags": [
      "Insônia",
      "Ansiedade",
      "Enxaqueca"
    ],
    "text": "Atendimento atencioso, cordial, eficiente e ágil. A medicação chegou em 1 semana. Eu estou em tratamento há 15 dias e já sinto os efeitos positivos. […] Recomendo!",
    "approvedVersion": "excerpt",
    "sourceReviewId": 32
  },
  {
    "name": "Mayara de Lucca",
    "photo": "https://lh3.googleusercontent.com/a/ACg8ocJzdmvHsXTtw9FPZhu6BNn0ETbubpl5hk4jcrMZ-KEQC4ClPQ=s96-c-rp-mo-br100",
    "publishedAt": "2025-06-30",
    "tags": [
      "Insônia",
      "Ansiedade",
      "Pânico"
    ],
    "text": "[…] Durmo bem, acordo bem e ainda tenho disposição durante o dia. […]",
    "approvedVersion": "excerpt",
    "sourceReviewId": 33
  },
  {
    "name": "Fátima Daoualibi",
    "photo": "https://lh3.googleusercontent.com/a-/ALV-UjVmKWeqksAfO9sj1_I-_QXetkwlZBPt0ZPKzqQyYXvoGRlTZ2EG=s96-c-rp-mo-br100",
    "publishedAt": "2024-05-18",
    "tags": [
      "Insônia"
    ],
    "text": "Vi o anúncio num ônibus e entrei em contato. Foi uma experiência que eu quero repetir outras vezes, todos que me atenderam foram excepcionais. O processo é 100% legal e o resultado maravilhoso. Voltei a dormir a noite toda e acordo descansada.",
    "approvedVersion": "full",
    "sourceReviewId": 34
  },
  {
    "name": "Aldinei Machado",
    "photo": "https://lh3.googleusercontent.com/a-/ALV-UjXGhrBF69t_E5Q59C83LPLNr611st2ssZ7nTDcSxT3lqVZs_SJT=s96-c-rp-mo-br100",
    "publishedAt": "2025-05-09",
    "tags": [
      "Insônia",
      "Ansiedade",
      "Dor"
    ],
    "text": "Ótima , medicamento muito bom ,as pessoas super educadas e atenciosas, […] estou me sentindo muito bem no sono no apetite nas dores, mente super tranquila , menos ansiosa estou gostando muito",
    "approvedVersion": "excerpt",
    "sourceReviewId": 35
  },
  {
    "name": "Leder Masselai",
    "photo": "https://lh3.googleusercontent.com/a-/ALV-UjVW3T_GbtjQe0zlUIPpCd5MPZGn6uPDZ3RgacNGnjHUaTNuFMlf=s96-c-rp-mo-br100",
    "publishedAt": "2025-12-23",
    "tags": [
      "Insônia",
      "Ansiedade",
      "Artrite"
    ],
    "text": "Logo nos primeiros dias já senti melhora na ansiedade e nas dores na coluna causadas pela artrose. Depois de um mês de tratamento posso afirmar que tive umas melhora de 80% nos sintomas, fora o sono com noites tranquilas e reparadoras.",
    "approvedVersion": "full",
    "sourceReviewId": 36
  },
  {
    "name": "Miguel Menezes",
    "photo": "https://lh3.googleusercontent.com/a-/ALV-UjXoyEb-akP2s5JtR4z5Wf1lyy9Zdg7l5z5AjNA0vBfPMlFz45ll5g=s96-c-rp-mo-br100",
    "publishedAt": "2024-05-16",
    "tags": [
      "Insônia"
    ],
    "text": "Atendimento excelente! Iniciei meu tratamento há um mês e já consigo notar a melhora na minha qualidade de vida. Hoje, fumo menos, durmo melhor e acordo mais disposto! Vejo que já estou próximo do meu objetivo que é parar de fumar.",
    "approvedVersion": "full",
    "sourceReviewId": 38
  },
  {
    "name": "Adriana Monteiro Lopes Buono",
    "photo": "https://lh3.googleusercontent.com/a/ACg8ocJW47hRcwgjKF9_u7-yvaH9WgXC5NEr2uFnNHNo65b7f59uyw=s96-c-rp-mo-br100",
    "publishedAt": "2025-07-07",
    "tags": [
      "Insônia",
      "Humor"
    ],
    "text": "O processo com a Click Cannabis tem sido fácil, descomplicado e super profissional desde o início. Adorando. Após um mês de uso do full spectrum senti melhora significativa na qualidade de sono e no humor e a cada dia só melhora.",
    "approvedVersion": "full",
    "sourceReviewId": 39
  },
  {
    "name": "Vera Oliveira",
    "photo": "https://lh3.googleusercontent.com/a-/ALV-UjVH110wNZ6mcSVUmzaeNpKEbyJH3s4Rs56gWnXm0JzMZn5QQSHZ8g=s96-c-rp-mo-ba2-br100",
    "publishedAt": "2025-05-12",
    "tags": [
      "Insônia",
      "Ansiedade"
    ],
    "text": "Boa Noite !! Hoje faz um mês que estou tomando este medicamento, […] e já estou vem resultado, na ansiedade e para dormir, vou seguir com este o tratamento.",
    "approvedVersion": "excerpt",
    "sourceReviewId": 40
  },
  {
    "name": "Marcilene Cardoso",
    "photo": "https://lh3.googleusercontent.com/a/ACg8ocLYrpHzfZj9lw9c9lYt1VqzKCEnSW_SX3YzXSeeviMbMXl8FA=s96-c-rp-mo-br100",
    "publishedAt": "2026-02-23",
    "tags": [
      "Insônia",
      "Dor",
      "Fibromialgia"
    ],
    "text": "Estou muito satisfeita e aliviada. Minhas dores diminuíram significativamente. Tenho fibromialgia e consegui voltar a realizar coisas da rotina sem entrar em sofrimento. O sono também regularizou. Ganhei qualidade de vida.",
    "approvedVersion": "full",
    "sourceReviewId": 41
  },
  {
    "name": "Charles Alves",
    "photo": "https://lh3.googleusercontent.com/a-/ALV-UjU1yuhM9tm3B8n1KpXqeQdlY_dhMMQ3oFwsRPg_YSJKk1whXjBJ=s96-c-rp-mo-br100",
    "publishedAt": "2026-02-02",
    "tags": [
      "Insônia",
      "Ansiedade"
    ],
    "text": "Minha experiência com click está sendo maravilhosa […] e fico menos ansioso com mais facilidade para dormir, adorei canabis é vida!.",
    "approvedVersion": "excerpt",
    "sourceReviewId": 42
  },
  {
    "name": "Denise Justino",
    "photo": "https://lh3.googleusercontent.com/a-/ALV-UjWYgQF63z7Q_MuyqCGvS3uELlA9nGyqFdb6UlaNXztR5Mi4DeHG=s96-c-rp-mo-br100",
    "publishedAt": "2025-10-01",
    "tags": [
      "Insônia",
      "Humor"
    ],
    "text": "Estou muito feliz, […] o suporte e valores são justos, […] e passei dormir muito bem.",
    "approvedVersion": "excerpt",
    "sourceReviewId": 43
  },
  {
    "name": "Raquel Castro Adv",
    "photo": "https://lh3.googleusercontent.com/a-/ALV-UjXNHuOCkmgdxqZYwDTG0FwIc-o0VfZMvanewk-2cZpAiJuu1EYw=s96-c-rp-mo-br100",
    "publishedAt": "2024-07-25",
    "tags": [
      "Insônia"
    ],
    "text": "O atendimento foi super rápido e eficaz! A equipe me ajudou em todo o processo de compra do medicamento, até o recebimento. […] Super indico!",
    "approvedVersion": "excerpt",
    "sourceReviewId": 44
  },
  {
    "name": "Sandra CardosoBueno",
    "photo": "https://lh3.googleusercontent.com/a-/ALV-UjUy_UI7V1cnd4LGAavmK48a3nZg3zn5d_v5Id7gQhHgoEhOXFkj_g=s96-c-rp-mo-br100",
    "publishedAt": "2025-09-12",
    "tags": [
      "Insônia",
      "Ansiedade",
      "Foco"
    ],
    "text": "Minha experiência foi muito boa. Após usar a medicação, consegui controlar mais a ansiedade, não estou comendo muito,durmo melhor e sinto um melhor desemprenho no trabalho e atividade física. Estou bem calma.. Obrigada .",
    "approvedVersion": "full",
    "sourceReviewId": 45
  },
  {
    "name": "Talita Luciana",
    "photo": "https://lh3.googleusercontent.com/a-/ALV-UjWN_g5pun0Xd5SKIei_XmesyL49f_4sfHf84b4w96bSoYNIokTo6Q=s96-c-rp-mo-br100",
    "publishedAt": "2025-03-06",
    "tags": [
      "Insônia",
      "Ansiedade"
    ],
    "text": "Já estou na 2ª semana de tratamento e foi a melhor escolha que fiz, estou dormindo a noite toda sem acordar com insônia , me Sinto Mais leve durante o dia […] Estou me sentido bem tranquila .",
    "approvedVersion": "excerpt",
    "sourceReviewId": 46
  },
  {
    "name": "Frederico Guilhon",
    "photo": "https://lh3.googleusercontent.com/a-/ALV-UjWorCKHNBB9LXu6hNg3sw4lOxGbZE9CsNZxidYiLE2P3okUyc6pGg=s96-c-rp-mo-br100",
    "publishedAt": "2025-02-21",
    "tags": [
      "Insônia",
      "Dor"
    ],
    "text": "Fazendo uso a uma semana só, observo a musculatura mais relaxada e dores muito menores o que facilita o meu caminhar já sem rigidez e dores quase nenhuma é sono reparador. Tenho sequelas de crises de E.M. Recomendo.",
    "approvedVersion": "full",
    "sourceReviewId": 47
  },
  {
    "name": "valquiria Barbosa Brant",
    "photo": "https://lh3.googleusercontent.com/a-/ALV-UjUtfn49WuI9sLU1cUXQMWeQnmk0YiYVTErZ12hrf2zqf2gOHH0=s96-c-rp-mo-br100",
    "publishedAt": "2025-09-17",
    "tags": [
      "Insônia"
    ],
    "text": "Bom dia! Faz um ano que comecei a ter alguns episódios de insônia, foi quando procurei o atendimento no click Cannabis, estou muito satisfeita com o óleo de cannabis, estou com um sono reparador todos os dias!!🙌",
    "approvedVersion": "full",
    "sourceReviewId": 48
  },
  {
    "name": "Ana Kokanj",
    "photo": "https://lh3.googleusercontent.com/a-/ALV-UjVIqMQ8H3w1gesvdducL61waKRb8iIRSl4eNHQBfJ1J-rsaE5g=s96-c-rp-mo-br100",
    "publishedAt": "2026-04-06",
    "tags": [
      "Insônia",
      "Ansiedade",
      "Dor"
    ],
    "text": "Estou em tratamento a 15 dias e sinto uma melhora significativa no sono,sem acordar tanto a noite e voltando a dormir rapidamente qdo deito novamente. Percebo estar com menos dores e menos ansiosa durante o dia.",
    "approvedVersion": "full",
    "sourceReviewId": 49
  },
  {
    "name": "Jacaré Junior",
    "photo": "https://lh3.googleusercontent.com/a-/ALV-UjWNArQ_dA1IlEwGCtff03MGSI0aqnTu5c203ZgcWT8CjAK6qEk5fQ=s96-c-rp-mo-br100",
    "publishedAt": "2024-04-19",
    "tags": [
      "Insônia",
      "Dor na coluna",
      "Dor"
    ],
    "text": "Totalmente satisfeito com a Click Cannabis e o medicamento receitado... durmo a noite toda e minha dor na lombar melhorou consideravelmente. Agradeço a todas equipe...foi super rápido todo o processo. Obrigado",
    "approvedVersion": "full",
    "sourceReviewId": 50
  },
  {
    "name": "Guilherme Lima",
    "photo": "https://lh3.googleusercontent.com/a-/ALV-UjXgafsPe-Svdn79b8Lz8PsYtFXT9pHwmExjjIrtHuDI6SWGfk2J5g=s96-c-rp-mo-br100",
    "publishedAt": "2026-04-20",
    "tags": [
      "Insônia",
      "Foco"
    ],
    "text": "Praticamente 1 mês utilizando o CDB oil e os benefícios são incríveis, desde que comecei usar meu sono melhorou, […] ajudou também eu meu foco com as atividades diárias.",
    "approvedVersion": "excerpt",
    "sourceReviewId": 51
  },
  {
    "name": "Cilene Frias",
    "photo": "https://lh3.googleusercontent.com/a/ACg8ocLI5JPcDNh-dHUSoiIo4mcZAg_qxDhClGVjVlGEENfiokHr8Q=s96-c-rp-mo-ba2-br100",
    "publishedAt": "2025-05-12",
    "tags": [
      "Insônia",
      "Ansiedade"
    ],
    "text": "Hoje faz um mês que iniciei meu tratamento com a click cannabis Me sinto outra pessoa Consigo dormir bem, sono tranquilo e sempre na paz com a minha mente . Melhor escolha tratamento com a click cannabis",
    "approvedVersion": "full",
    "sourceReviewId": 52
  },
  {
    "name": "Vandir Villar",
    "photo": "https://lh3.googleusercontent.com/a-/ALV-UjVzzUKfgzobitdJg4POQdir2pYVGoasamIKIYncKaY2qAylbLo8vg=s96-c-rp-mo-ba2-br100",
    "publishedAt": "2026-03-31",
    "tags": [
      "Insônia",
      "Impulsividade"
    ],
    "text": "Muito bom! Estou completando meu peimeiro mês de tratamento com Canabidiol. Meu sono está bem mais regularizado e também estou nitidamente menos impulsivo. Sem qualquer efeito colateral até o momento.",
    "approvedVersion": "full",
    "sourceReviewId": 53
  },
  {
    "name": "Monica Cozendey",
    "photo": "https://lh3.googleusercontent.com/a-/ALV-UjXksb7km0T1nhQleHOsjVXjFzodLQReHUHyV5plO-4-HdjABEIGtQ=s96-c-rp-mo-br100",
    "publishedAt": "2024-09-06",
    "tags": [
      "Insônia",
      "Ansiedade",
      "Dor"
    ],
    "text": "[…] Gostaria também de ressaltar o o atendimento impecável desta conceituada empresa.",
    "approvedVersion": "excerpt",
    "sourceReviewId": 54
  },
  {
    "name": "Oliver Yassuo",
    "photo": "https://lh3.googleusercontent.com/a-/ALV-UjX7krypOQAR6bRSMHFN6eoLvvAmG2zwQtK6UBwP_eeM8ZqLsRvBlw=s96-c-rp-mo-br100",
    "publishedAt": "2025-08-19",
    "tags": [
      "Insônia",
      "Ansiedade"
    ],
    "text": "[…] e a ansiedade também deu uma bela controlada em paralelo. […]",
    "approvedVersion": "excerpt",
    "sourceReviewId": 55
  },
  {
    "name": "João Paulo dos Santos",
    "photo": "https://lh3.googleusercontent.com/a-/ALV-UjWZGpTbl61gt_mxr8KKjzsLfqaEX2lIKLx4wKrrU46nJdEu0-ib=s96-c-rp-mo-br100",
    "publishedAt": "2026-01-18",
    "tags": [
      "Insônia",
      "Ansiedade",
      "Estresse"
    ],
    "text": "Comecei o tratamento a poucos dias, mas já senti uma melhora na ansiedade que sentia e na insônia, também me sinto mas alegre e menos estressado, por enquanto o tratamento está me surpreendendo",
    "approvedVersion": "full",
    "sourceReviewId": 56
  },
  {
    "name": "Ketlyn Gonçalves",
    "photo": "https://lh3.googleusercontent.com/a-/ALV-UjXuMn8JX1p87oA7ltWo6y8mMFAXDrrTb9W_GE2JoUQ7T0esVhiqlg=s96-c-rp-mo-br100",
    "publishedAt": "2025-07-17",
    "tags": [
      "Insônia",
      "Ansiedade"
    ],
    "text": "Tem sido um diferencial essa experiência, quantas coisas eu não conseguia enxergar por viver ansiosa, por estar exausta por não conseguir dormir. Continuo firme e feliz como cada dia evoluindo!",
    "approvedVersion": "full",
    "sourceReviewId": 57
  },
  {
    "name": "Uri Pellegrini",
    "photo": "https://lh3.googleusercontent.com/a-/ALV-UjVlCZi4XZIsCTFVZChNOdP5KfbeeF1rTYNmi3bMdE7AZMJZjGftfw=s96-c-rp-mo-ba3-br100",
    "publishedAt": "2025-12-15",
    "tags": [
      "Insônia",
      "Ansiedade"
    ],
    "text": "Um mês de uso e meu sono mudou drasticamente para melhor! ansiedade diminuiu bastante tb. Só tenho a agradecer o excelente trabalho da Click e dos profissionais que estão na linha de frente!!!",
    "approvedVersion": "full",
    "sourceReviewId": 58
  },
  {
    "name": "Leonardo Zerlotti",
    "photo": "https://lh3.googleusercontent.com/a/ACg8ocI26xS_u80JvVq7jWrF7YR0eBMyGVEEeDXCugJXBvokH246ow=s96-c-rp-mo-br100",
    "publishedAt": "2025-05-09",
    "tags": [
      "Insônia",
      "Ansiedade",
      "Foco"
    ],
    "text": "Caria dia que passa me sinto mais calmo, meu sono está regrado, minha mente tem foco. Surreal! Parabéns a clínica que faz esse trabalho muito importante. Suporte incrível do começo ao fim!!",
    "approvedVersion": "full",
    "sourceReviewId": 59
  },
  {
    "name": "Maria Eleonora Rabêllo",
    "photo": "https://lh3.googleusercontent.com/a-/ALV-UjXxCrQXPQKzhH1oRcXNRlUxlwu4wXyNjDO3vikG1Qwcd9-UdLGC=s96-c-rp-mo-br100",
    "publishedAt": "2025-05-30",
    "tags": [
      "Insônia",
      "Dor"
    ],
    "text": "Estou há apenas um mês fazendo uso do Canabidiol e já sinto melhoras significativas na dor crônica aue tenho há mais de 30 anos , e na qualidade do meu sono ! Viva a medicina canábica!!",
    "approvedVersion": "full",
    "sourceReviewId": 60
  },
  {
    "name": "Augusto Siqueira",
    "photo": "https://lh3.googleusercontent.com/a-/ALV-UjWzPkzhm0HYvLx5aKU5EfNJn0y1lMmtR_s97mNSxz6YGUNt_r4=s96-c-rp-mo-br100",
    "publishedAt": "2025-03-28",
    "tags": [
      "Insônia",
      "Ansiedade",
      "Dor"
    ],
    "text": "Gostei da experiência de poder ter acesso a esses medicamentos, minhas dores crônicas do ombro quebrado e operado diminuíram, tenho tido boas noites de sono e me sinto menos ansioso.",
    "approvedVersion": "full",
    "sourceReviewId": 61
  },
  {
    "name": "William Oliveira Olivera",
    "photo": "https://lh3.googleusercontent.com/a/ACg8ocI47hrh77PscUeweEspNaMTIsaZKQ4L-RQ4ifySZ3veRdnL8g=s96-c-rp-mo-br100",
    "publishedAt": "2025-09-10",
    "tags": [
      "Insônia"
    ],
    "text": "Bom, primeiro mês ainda não sei dizer quais os efeitos positivos ou negativos, mas oque posso dizer é que em relação ao sono tem melhorado, na questão de acordar várias vezes a noite",
    "approvedVersion": "full",
    "sourceReviewId": 62
  },
  {
    "name": "Alessandra Rodrigues",
    "photo": "https://lh3.googleusercontent.com/a/ACg8ocJ3jZGlQ4ge117hEnUgxeWaeFXLQSmXsgDmHldfLU0K6N9T3w=s96-c-rp-mo-br100",
    "publishedAt": "2025-02-27",
    "tags": [
      "Insônia"
    ],
    "text": "Comecei a dormir melhor e estou mais animada pra fazer as coisas qt a minha doença Aida não percebi nada de melhora mais só estou tomando a uma semana acho que é cedo pra falar",
    "approvedVersion": "full",
    "sourceReviewId": 63
  },
  {
    "name": "lu maia",
    "photo": "https://lh3.googleusercontent.com/a-/ALV-UjXy_M5EdkJKcPjyAVwCMiq0s8LmXeLmvqPcxAZC8WsavFfSec5S=s96-c-rp-mo-br100",
    "publishedAt": "2025-10-09",
    "tags": [
      "Insônia"
    ],
    "text": "Estou gostando bastante, precisei aumentar a dose aos poucos, como foi recomendado e estou conseguindo dormir melhor...acredito que logo, conseguirei dormir a noite toda🙏🌿",
    "approvedVersion": "full",
    "sourceReviewId": 65
  },
  {
    "name": "Michael Marocco",
    "photo": "https://lh3.googleusercontent.com/a/ACg8ocLvJqy622MuxXmupi8xy7erTnCjDZPvb7CRgoHsSSFXe_lOyg=s96-c-rp-mo-ba2-br100",
    "publishedAt": "2025-06-06",
    "tags": [
      "Insônia",
      "Ansiedade",
      "Dor"
    ],
    "text": "A utilização do CDB mudou meu bem estar. Hoje tenho qualidade do sono e minhas dores estão controladas, além de ter reduzido minha ansiedade. Eu mais que recomendo..",
    "approvedVersion": "full",
    "sourceReviewId": 68
  },
  {
    "name": "Sergio Faria Jr",
    "photo": "https://lh3.googleusercontent.com/a-/ALV-UjURUJtf4S8OPDpB_n3gZ2u3pY9CjDTLlhqpPdqU5D9S7fBeg_siSA=s96-c-rp-mo-ba4-br100",
    "publishedAt": "2024-08-29",
    "tags": [
      "Insônia",
      "Ansiedade",
      "Depressão"
    ],
    "text": "Consulta com valor acessível. O médico que me atendeu foi muito atencioso. O tratamento está dando super certo para depressão, ansiedade e insônia. Super recomendo.",
    "approvedVersion": "full",
    "sourceReviewId": 69
  },
  {
    "name": "Jhunyor Psicólogo",
    "photo": "https://lh3.googleusercontent.com/a-/ALV-UjWHq_3bRPlvNHdb9jpzzWyXKjYWyXH-awTL7TmJCt4xYuwa7i9B-A=s96-c-rp-mo-ba4-br100",
    "publishedAt": "2025-01-21",
    "tags": [
      "Insônia",
      "Ansiedade"
    ],
    "text": "Atendimento excelente e extremamente acolhedor. […]",
    "approvedVersion": "excerpt",
    "sourceReviewId": 70
  },
  {
    "name": "Meire Marinho",
    "photo": "https://lh3.googleusercontent.com/a-/ALV-UjUUx2NAFdd_spdHWumkNkADai-8HjyI8gVwvr50FA6Qaixm2kS0fw=s96-c-rp-mo-br100",
    "publishedAt": "2025-09-15",
    "tags": [
      "Insônia",
      "Ansiedade",
      "Pânico"
    ],
    "text": "Ainda estou no começo do tratamento de insônia e ansiedade, meu cérebro está se adaptando. A ansiedade (taquicardia) agora só às vezes 🙌 e estou dormindo bem melhor",
    "approvedVersion": "full",
    "sourceReviewId": 71
  },
  {
    "name": "Eduarda Carolini",
    "photo": "https://lh3.googleusercontent.com/a-/ALV-UjX6iRpogMUSIL_AIa4U25e-2wu6XusB9daFoe7NTpmWwgs_CThk=s96-c-rp-mo-br100",
    "publishedAt": "2025-02-12",
    "tags": [
      "Insônia",
      "Ansiedade"
    ],
    "text": "Depois de uma semana tomando o cbd senti uma melhora significativa na qualidade do meu sono e também sinto uma diminuição significativa na ansiedade do dia a dia.",
    "approvedVersion": "full",
    "sourceReviewId": 72
  },
  {
    "name": "angela maria carvalho silva cassol",
    "photo": "https://lh3.googleusercontent.com/a-/ALV-UjXVk9JrIcs7O1QT5QLgQamooUWqtE1H5SPIZ3bEeaidwqzl4UTukw=s96-c-rp-mo-ba4-br100",
    "publishedAt": "2025-07-07",
    "tags": [
      "Insônia",
      "Humor"
    ],
    "text": "Estou melhorando meus sintomas, acredito que vou melhorar mais pois tomo uma dose bem pequena. Melhorou minha disposição e meu humor e a qualidade do sono .",
    "approvedVersion": "full",
    "sourceReviewId": 73
  },
  {
    "name": "Ricardo Andrade",
    "photo": "https://lh3.googleusercontent.com/a-/ALV-UjVGV5BiU_yQSDEKpRwVFkblOMeADiRsWzLNUBFqsH0Cmbjg6L7tew=s96-c-rp-mo-ba3-br100",
    "publishedAt": "2025-05-05",
    "tags": [
      "Insônia",
      "Estresse",
      "Foco"
    ],
    "text": "Excelente, já no primeiro mês de tratamento uma melhora significativa. Sono melhor, diminuindo o stress e já focando em meus afazeres. Gostando muito.",
    "approvedVersion": "full",
    "sourceReviewId": 74
  },
  {
    "name": "Alex Silva",
    "photo": "https://lh3.googleusercontent.com/a-/ALV-UjVUcLJnQVwIbQpnaPuJZH1iUvqMGfZVaeHys4WqRTn7G6q-XycR0w=s96-c-rp-mo-br100",
    "publishedAt": "2025-03-06",
    "tags": [
      "Insônia"
    ],
    "text": "Meu tratamento está ainda no começo, mas já senti o potencial enorme que vai ser muito bom! Já senti da diferença principalmente na parte da insônia!",
    "approvedVersion": "full",
    "sourceReviewId": 76
  },
  {
    "name": "Brenda Iochem",
    "photo": "https://lh3.googleusercontent.com/a-/ALV-UjV6gnFbMUtCIaqaiUyEfxe75NIURRJJ2IYf29GQkgbvP6ihvymP=s96-c-rp-mo-br100",
    "publishedAt": "2025-02-24",
    "tags": [
      "Insônia",
      "Irritacao"
    ],
    "text": "estou há uma semana fazendo o uso do óleo e já vi muita melhoria no meu sono, mais facilidade para dormir e vi muita melhora na minha irritabilidade",
    "approvedVersion": "full",
    "sourceReviewId": 77
  },
  {
    "name": "Keysa Secatti",
    "photo": "https://lh3.googleusercontent.com/a/ACg8ocKmb1W7bQGUy27HARKDpykalJnzmXbR-wHEp4Jssr8P65S42g=s96-c-rp-mo-br100",
    "publishedAt": "2025-12-10",
    "tags": [
      "Insônia",
      "Dor"
    ],
    "text": "Experiência do consumidor excelente, e eficácia da medicação ainda estamos avaliando. A medicação está sendo ministrada para dor crônica e insônia.",
    "approvedVersion": "full",
    "sourceReviewId": 78
  },
  {
    "name": "Fábio Veras",
    "photo": "https://lh3.googleusercontent.com/a/ACg8ocKD1xbzzbJYdnlSG9ADJD4pW5u_pHYrBAaP5LRCSUz3lJivyg=s96-c-rp-mo-ba2-br100",
    "publishedAt": "2024-10-02",
    "tags": [
      "Insônia",
      "Depressão"
    ],
    "text": "Eu posso dizer que o canabidiol mudou a minha vida, […] durmo melhor, a qualidade de vida é outra, so tenho a agradecer.",
    "approvedVersion": "excerpt",
    "sourceReviewId": 80
  },
  {
    "name": "Kelven Bittencourt",
    "photo": "https://lh3.googleusercontent.com/a-/ALV-UjV7q0fTIWUaaO_90vcrRXCVYTB-_gN3T5PdRUHThzgPNj5eZMaGeg=s96-c-rp-mo-br100",
    "publishedAt": "2025-03-04",
    "tags": [
      "Insônia",
      "Ansiedade",
      "Estresse"
    ],
    "text": "Depois de uma semana, os resultados estão aparecendo, já consigo dormir melhor, os picos de estresse e ansiedade diminuíram, tem sido maravilhoso",
    "approvedVersion": "full",
    "sourceReviewId": 81
  },
  {
    "name": "Ana Karina Santos",
    "photo": "https://lh3.googleusercontent.com/a/ACg8ocKCSkUrHY9d1hBQ5lB2SFy262nP9J2XKuYdtHop8dtS0Qm0Fw=s96-c-rp-mo-br100",
    "publishedAt": "2025-05-09",
    "tags": [
      "Insônia"
    ],
    "text": "Senti um melhora no meu sono com o gummy, eu acordava muito durante a noite e atualmente percebi que tenho dormido melhor e acordando bem menos.",
    "approvedVersion": "full",
    "sourceReviewId": 82
  },
  {
    "name": "Elizangela Barbara Moraes",
    "photo": "https://lh3.googleusercontent.com/a-/ALV-UjWLzBm6jeRBUAAq_zMjQO2NslgewbgxiCH42Vk4POczVLLIC4_X8g=s96-c-rp-mo-br100",
    "publishedAt": "2025-05-22",
    "tags": [
      "Insônia",
      "Artrite",
      "Dor"
    ],
    "text": "Tem me ajudado muito a controlar a insônia, e as dores articulares diminuíram e ainda não estou na dose máxima recomendada. […]",
    "approvedVersion": "excerpt",
    "sourceReviewId": 83
  },
  {
    "name": "Lipe diogenes silva",
    "photo": "https://lh3.googleusercontent.com/a/ACg8ocLFMtu5TOA9tpqJIyJ4fzaI8MM72-1J8akjCvhG9KCd4QWp9w=s96-c-rp-mo-br100",
    "publishedAt": "2026-01-12",
    "tags": [
      "Insônia"
    ],
    "text": "estou satisfeita, me sentindo melhor, consigo dormir a noite toda , desde o início do tratamento, a equipe muito atenciosa, excelente feedback.",
    "approvedVersion": "full",
    "sourceReviewId": 84
  },
  {
    "name": "Ricardo marin",
    "photo": "https://lh3.googleusercontent.com/a-/ALV-UjVwtUc85-y1HiZJZIpVGlSvUWC_8AE1oHONCdazLzdNKdcbDoQO=s96-c-rp-mo-br100",
    "publishedAt": "2026-01-14",
    "tags": [
      "Insônia",
      "Dor"
    ],
    "text": "estou usando a 30 dias. percebi que meu sono melhorou, estou mais tranquilo, e a dor no meu quadril que foi a minha reclamação dimunui bastente",
    "approvedVersion": "full",
    "sourceReviewId": 85
  },
  {
    "name": "Wadson Brito",
    "photo": "https://lh3.googleusercontent.com/a-/ALV-UjWyXKKuUWjHbhJdPtJExyrQ6z50Bx92SlPhfGdwfRjpiUPNXuez=s96-c-rp-mo-br100",
    "publishedAt": "2026-04-02",
    "tags": [
      "Insônia",
      "Ansiedade",
      "Dor"
    ],
    "text": "Depois que comecei o tratamento, a ansiedade diminuiu, o sono está se ficado regular e as dores que sentia com frequência diminuíram bastante",
    "approvedVersion": "full",
    "sourceReviewId": 86
  },
  {
    "name": "Jheryk Marx",
    "photo": "https://lh3.googleusercontent.com/a-/ALV-UjV4Ifms2UBQtBbom5W98h0SEDNfxEwOENuci2LVNo3_HUe-hahk=s96-c-rp-mo-br100",
    "publishedAt": "2026-04-01",
    "tags": [
      "Insônia",
      "Humor"
    ],
    "text": "Estou muito satisfeito pelo tratamento Consigo ter uma qualidade de sono melhor Até o meu humor melhorou Melhor qualidade de vida 🙂‍↔️😌",
    "approvedVersion": "full",
    "sourceReviewId": 87
  },
  {
    "name": "Júlia Peixoto",
    "photo": "https://lh3.googleusercontent.com/a-/ALV-UjUaHwAYCsKT1Ya2O4huRIezAeLvgllJ0bM97POJ9cz3PPgoPX9s=s96-c-rp-mo-br100",
    "publishedAt": "2024-04-19",
    "tags": [
      "Insônia",
      "Ansiedade",
      "Enxaqueca"
    ],
    "text": "Eu estou me sentindo ótima com o medicamento, estou muito mais tranquila, calma, durmo muito melhor, […] Amei",
    "approvedVersion": "excerpt",
    "sourceReviewId": 88
  },
  {
    "name": "Vinicius Rodrigues",
    "photo": "https://lh3.googleusercontent.com/a-/ALV-UjUPKpbuxcPnHK497X74DUFTZjcQPB3Oe21upybboCTnxjXS3Hl9=s96-c-rp-mo-br100",
    "publishedAt": "2025-01-23",
    "tags": [
      "Insônia",
      "Dor",
      "Estresse"
    ],
    "text": "Me sinto bem melhor, estou reduzindo o consumo de cerveja, sinto menos dores e estresse no dia a dia, e com mais qualidade no sono ...",
    "approvedVersion": "full",
    "sourceReviewId": 89
  },
  {
    "name": "Bruno Assis",
    "photo": "https://lh3.googleusercontent.com/a-/ALV-UjV8a3ycy14q2dR3IqPLGAVKQHjlu16xl3KxCbCZrWgLrboOv3mcZA=s96-c-rp-mo-ba2-br100",
    "publishedAt": "2026-04-07",
    "tags": [
      "Insônia"
    ],
    "text": "Meu sono melhorou muito estou fazendo uso a 15 dias, ainda em adaptação z porém, já consigo perceber algumas mudanças positivas.",
    "approvedVersion": "full",
    "sourceReviewId": 90
  },
  {
    "name": "Newton Alexandre Chaves de Souza",
    "photo": "https://lh3.googleusercontent.com/a/ACg8ocL-QYAtFFuuEpChP9WYrELEcet5UcfTAH6Go1peTJERgHAfgg=s96-c-rp-mo-br100",
    "publishedAt": "2025-09-12",
    "tags": [
      "Insônia"
    ],
    "text": "Eu me senti bem melhor a insônia diminuiu bastante a vontade de fumar cigarro tb e a disposição melhorou bastante",
    "approvedVersion": "full",
    "sourceReviewId": 91
  },
  {
    "name": "Ana Marta de Moraes Lopes",
    "photo": "https://lh3.googleusercontent.com/a-/ALV-UjUSMtgJZVdd5XTVVNaVnGQdP6l9Z4D4htsoJREMEMwPga5yO85FZA=s96-c-rp-mo-ba3-br100",
    "publishedAt": "2025-09-29",
    "tags": [
      "Insônia",
      "Ansiedade",
      "Artrite"
    ],
    "text": "Está sendo muito bom, já consigo dormir uma noite inteira, e diminuiu a ansiedade e a dor nas articulações. Muito obrigado 🙏😊",
    "approvedVersion": "full",
    "sourceReviewId": 92
  },
  {
    "name": "Katiany Vilarinho",
    "photo": "https://lh3.googleusercontent.com/a-/ALV-UjX-mWO_RAomyqtGzVyDLPZl11ZiJKM3lbOQ9KhE2m6lVU9ChIErgA=s96-c-rp-mo-ba4-br100",
    "publishedAt": "2024-04-05",
    "tags": [
      "Insônia"
    ],
    "text": "Estou bem no inicio do tratamento mas tenho percebido que consigo relaxar mais porque tenho uma noite de sono muito agitada.",
    "approvedVersion": "full",
    "sourceReviewId": 94
  },
  {
    "name": "Lucia Ruas vilas boas",
    "photo": "https://lh3.googleusercontent.com/a-/ALV-UjWaJDH2MBKCGWI4ruClaJCah4MO772LSIw8RWuGXxspnjat7xo9kw=s96-c-rp-mo-br100",
    "publishedAt": "2026-04-03",
    "tags": [
      "Insônia",
      "Ansiedade",
      "Fibromialgia"
    ],
    "text": "Ainda recente o uso do medicamento! Mas percebo uma leve melhora! na anciedade,no sono e uma leve melhora na fibromialgia!",
    "approvedVersion": "full",
    "sourceReviewId": 95
  },
  {
    "name": "Clemilson Gomes Melo Gomes",
    "photo": "https://lh3.googleusercontent.com/a-/ALV-UjW93F4KMqi_aFxd7G--6tMFgOYX0yL4-KNZfVAS-x4rdKJIx_rXBg=s96-c-rp-mo-br100",
    "publishedAt": "2025-05-05",
    "tags": [
      "Insônia"
    ],
    "text": "Eu estou ficando bem melhor em algum requisito meu sono tá bem melhor,e eu recomendo para aqueles que querem se tratando.",
    "approvedVersion": "full",
    "sourceReviewId": 96
  },
  {
    "name": "Lucas Braz",
    "photo": "https://lh3.googleusercontent.com/a-/ALV-UjWqJG4fZ_CKto2SqBNRyr6U0o3m2P_5q0v7HDoW_76HG0L94W2Zmw=s96-c-rp-mo-br100",
    "publishedAt": "2026-03-31",
    "tags": [
      "Insônia",
      "Ansiedade"
    ],
    "text": "Já estou me sentindo bem melhor! Menos ansiedade […] Sono melhorou muito!",
    "approvedVersion": "excerpt",
    "sourceReviewId": 97
  },
  {
    "name": "Eliseu plauth",
    "photo": "https://lh3.googleusercontent.com/a/ACg8ocIeLTR4LuvAAsBaJf8fKsKN6gMKnx7xFTWuJoozO4XOJufbuQ=s96-c-rp-mo-br100",
    "publishedAt": "2025-05-07",
    "tags": [
      "Insônia",
      "Humor"
    ],
    "text": "o tratamento está ajudando bastante meus quadros de humor está ficando mais normalizados e meu sono está impecável",
    "approvedVersion": "full",
    "sourceReviewId": 98
  },
  {
    "name": "Evaldo queiroz",
    "photo": "https://lh3.googleusercontent.com/a/ACg8ocItsQRoOWKJVX6pOrRzyYrg0bd_PDXSsk8TelhGZd6U-3T9lQ=s96-c-rp-mo-br100",
    "publishedAt": "2025-05-23",
    "tags": [
      "Insônia",
      "Dor"
    ],
    "text": "Com um mês de tratamento minha vida deu uma melhora muita boa. Voltei a dormir bem e as dores estão quase sumindo.",
    "approvedVersion": "full",
    "sourceReviewId": 99
  },
  {
    "name": "Roseni Santos",
    "photo": "https://lh3.googleusercontent.com/a/ACg8ocIytM6anLTjR4AxVqyAKHpbgPTB8i_q8dkSykprak6xnfCCJQ=s96-c-rp-mo-br100",
    "publishedAt": "2025-09-03",
    "tags": [
      "Insônia",
      "Ansiedade",
      "Foco"
    ],
    "text": "Tem sido maravilhoso, sono mais tranquilo, concentração foco na atividades e principalmente ansiedade controlando",
    "approvedVersion": "full",
    "sourceReviewId": 100
  },
  {
    "name": "RENAN ARRUDA",
    "photo": "https://lh3.googleusercontent.com/a/ACg8ocIepX_m1vmSAOYc7iGT-xZBH9Ks9lHSD5MIsVhLFXKgM-BEycXs=s96-c-rp-mo-br100",
    "publishedAt": "2026-02-12",
    "tags": [
      "Insônia",
      "Ansiedade",
      "Pânico"
    ],
    "text": "Muito bom! Meus picos de ansiedade durante o dia e minhas noites de sono graças a Deus estão controlados. Paz!",
    "approvedVersion": "full",
    "sourceReviewId": 102
  },
  {
    "name": "Jeni Lisbeth",
    "photo": "https://lh3.googleusercontent.com/a-/ALV-UjUaW_vj-4ik-P3zypRUryxJaYAhTC2sAvN9YUiN3f6cZC6mEGYhRw=s96-c-rp-mo-br100",
    "publishedAt": "2025-03-10",
    "tags": [
      "Insônia",
      "Ansiedade",
      "Dor"
    ],
    "text": "Estou há um mês usando, tenho percebido que estou menos dolorida, durmo bem, tenho mais foco e menos ansiedade",
    "approvedVersion": "full",
    "sourceReviewId": 103
  },
  {
    "name": "Sandra Araujo",
    "photo": "https://lh3.googleusercontent.com/a-/ALV-UjVRr_xHhmvdHdYru1-a7mpHGmgltUSF5ECY2kZdMysJRoWl-FQl_g=s96-c-rp-mo-br100",
    "publishedAt": "2026-02-14",
    "tags": [
      "Insônia"
    ],
    "text": "Olá. Hj é o meu 4o dia de uso. Meu sono melhorou bastante, tenho dormido bem! Espero qualidade de vida melhor!",
    "approvedVersion": "full",
    "sourceReviewId": 104
  },
  {
    "name": "Lucimara Amandio",
    "photo": "https://lh3.googleusercontent.com/a-/ALV-UjVtALnXWfU0egQCoLSVWfokAqZKm760g61lt9hKPaDhvsrNUewEnQ=s96-c-rp-mo-br100",
    "publishedAt": "2025-05-28",
    "tags": [
      "Insônia",
      "Dor"
    ],
    "text": "Já senti muita diferença em 30 dias de tratamento,minhas dores ficaram mais amenas e o sono melhorou muuuito!",
    "approvedVersion": "full",
    "sourceReviewId": 105
  },
  {
    "name": "kevin ribeiro",
    "photo": "https://lh3.googleusercontent.com/a/ACg8ocKDrcz2uycaxtycE4IsXyz7fpztRmBdRvBwABzxOCdsI0OeQQ=s96-c-rp-mo-br100",
    "publishedAt": "2025-05-10",
    "tags": [
      "Insônia",
      "Ansiedade"
    ],
    "text": "Até o momento está sendo incrível, boa parte da minha ansiedade reduziu e meu sono está cada vez melhor",
    "approvedVersion": "full",
    "sourceReviewId": 106
  },
  {
    "name": "Suelen Moiano",
    "photo": "https://lh3.googleusercontent.com/a-/ALV-UjWGRbmHhnySiIF4AZXHUh5Yy-zJARu8cXoM606hXOZPX4E4Hl0zvg=s96-c-rp-mo-br100",
    "publishedAt": "2025-05-15",
    "tags": [
      "Insônia",
      "Ansiedade"
    ],
    "text": "Eu estou gostando muito estou mais estou conseguindo dormir melhor e a ansiedade estou controlada.",
    "approvedVersion": "full",
    "sourceReviewId": 107
  },
  {
    "name": "Alan Paulo Moura",
    "photo": "https://lh3.googleusercontent.com/a-/ALV-UjWW8bUAU-fTlsyACs70PbFHSrH1M5kFrjgWpdQzzWS16ugckxJ2Iw=s96-c-rp-mo-br100",
    "publishedAt": "2026-02-09",
    "tags": [
      "Insônia"
    ],
    "text": "Gente eu gostei muito . No meu caso era só um ajuste p higienizar o meu sono e está funcionando",
    "approvedVersion": "full",
    "sourceReviewId": 108
  },
  {
    "name": "Natã Bernardo",
    "photo": "https://lh3.googleusercontent.com/a-/ALV-UjUcUSkZ0VHm1E_CIxiGjV4q-T4ZUgUuJOPnwDx_Uucn2NL1b9U=s96-c-rp-mo-br100",
    "publishedAt": "2025-03-04",
    "tags": [
      "Insônia",
      "Ansiedade"
    ],
    "text": "Já senti uma grande diferença na qualidade do sono e a ansiedade está um pouco mais controlada.",
    "approvedVersion": "full",
    "sourceReviewId": 109
  },
  {
    "name": "Leandro Bernardo",
    "photo": "https://lh3.googleusercontent.com/a-/ALV-UjVggF7H9d6_bUeTk1IDku68AeL49Yw5ylgEt-mytWuDFqyXfzad0Q=s96-c-rp-mo-br100",
    "publishedAt": "2026-04-07",
    "tags": [
      "Insônia",
      "Ansiedade"
    ],
    "text": "Melhora significativa na ansiedade e qualidade do sono depois que comeceia a usar o CDB .",
    "approvedVersion": "full",
    "sourceReviewId": 110
  },
  {
    "name": "Lizandra Barbuto",
    "photo": "https://lh3.googleusercontent.com/a-/ALV-UjV5PL9zz5LzifdSd5c98lZmndICVeDGcT8hGWVMBvHDhqSAN1pmow=s96-c-rp-mo-br100",
    "publishedAt": "2026-01-27",
    "tags": [
      "Insônia"
    ],
    "text": "Atendimento super humano, o tratamento esta me ajudando muito na insônia da menopausa.",
    "approvedVersion": "full",
    "sourceReviewId": 111
  },
  {
    "name": "Ande",
    "photo": "https://lh3.googleusercontent.com/a-/ALV-UjX6RY1dO_JW9bN_-k3J6xArynL4tK02_bDen-OMF2grHrp_on0=s96-c-rp-mo-br100",
    "publishedAt": "2026-01-21",
    "tags": [
      "Insônia",
      "Depressão",
      "Dor"
    ],
    "text": "[…] Estou mais disposta, durmo melhor. […]",
    "approvedVersion": "excerpt",
    "sourceReviewId": 112
  },
  {
    "name": "ROBERTA VALERIA DE MORAES MARCELINO",
    "photo": "https://lh3.googleusercontent.com/a-/ALV-UjWySwKl6exv5Cu5MTegyml4gvAq42rz68mlcSjrrM04X1kNd3M=s96-c-rp-mo-br100",
    "publishedAt": "2025-09-22",
    "tags": [
      "Insônia",
      "Dor"
    ],
    "text": "Excelente resultado, hoje eu consigo dormir melhor e não sinto dores como antes",
    "approvedVersion": "full",
    "sourceReviewId": 113
  },
  {
    "name": "Luiz Monteiro",
    "photo": "https://lh3.googleusercontent.com/a-/ALV-UjX73f0JCC4BLWucKNdPeflgoYDrUtThX1pwfVCwcDypq6Vj1o3l=s96-c-rp-mo-br100",
    "publishedAt": "2025-05-06",
    "tags": [
      "Insônia"
    ],
    "text": "To bem no início e já estou com 90% do resultado para insônia. Gostei",
    "approvedVersion": "full",
    "sourceReviewId": 115
  },
  {
    "name": "Davi Amorim",
    "photo": "https://lh3.googleusercontent.com/a-/ALV-UjULu-4PSjENgC6VIG3eB9KnYBuZl5gpmqrtBfOqhB4gb8cpZczglA=s96-c-rp-mo-ba2-br100",
    "publishedAt": "2026-04-28",
    "tags": [
      "Insônia"
    ],
    "text": "Excelente produto, eficiente e, está mudando o meu sono para melhor…",
    "approvedVersion": "full",
    "sourceReviewId": 116
  },
  {
    "name": "Rai Freitas",
    "photo": "https://lh3.googleusercontent.com/a-/ALV-UjUrtDFXuSWkXk3Ly8xMWhNQdMxpa9VSS-JFLnC0CpANtQ0TwR-l=s96-c-rp-mo-ba4-br100",
    "publishedAt": "2025-09-12",
    "tags": [
      "Insônia"
    ],
    "text": "A qualidade do sono melhorou muito em um mês de tratamento,recomendo",
    "approvedVersion": "full",
    "sourceReviewId": 117
  },
  {
    "name": "jaiede nicacio",
    "photo": "https://lh3.googleusercontent.com/a-/ALV-UjXtIot3OhEJDzYqnjMX3A1EB89lcJIqRMFqcnPnQ1cwAbgTYwo=s96-c-rp-mo-br100",
    "publishedAt": "2025-09-19",
    "tags": [
      "Insônia"
    ],
    "text": "Melhora do sono bem importante. Resultados logo na primeira semana",
    "approvedVersion": "full",
    "sourceReviewId": 118
  },
  {
    "name": "Roger Net",
    "photo": "https://lh3.googleusercontent.com/a-/ALV-UjXG0QYLbHoCHSbOoMZwP2n5u2F6RIiHeUSosEmpQGGKhCA3zZFqVg=s96-c-rp-mo-ba3-br100",
    "publishedAt": "2025-01-21",
    "tags": [
      "Insônia"
    ],
    "text": "Durante a primeira semana de tratamento meu sono melhorou bastante",
    "approvedVersion": "full",
    "sourceReviewId": 119
  },
  {
    "name": "nelson santos",
    "photo": "https://lh3.googleusercontent.com/a-/ALV-UjVIi-cUrfee0-RYYOqV5BRX8VGYZoX7qP7tSkTtAg_H1ReoMAtY=s96-c-rp-mo-br100",
    "publishedAt": "2025-02-12",
    "tags": [
      "Insônia",
      "Humor"
    ],
    "text": "Em uma semana consigui perceber uma melhora no meu sono e humor",
    "approvedVersion": "full",
    "sourceReviewId": 120
  },
  {
    "name": "Alysson Teixeira",
    "photo": "https://lh3.googleusercontent.com/a-/ALV-UjWQznws4mWwWrUTKoxztg7EtezDQQKIDwSzdYTJOKN8oauSXBoI=s96-c-rp-mo-br100",
    "publishedAt": "2025-09-19",
    "tags": [
      "Insônia"
    ],
    "text": "Um mês de tratamento e percebi que meu sono está bem melhor.",
    "approvedVersion": "full",
    "sourceReviewId": 121
  },
  {
    "name": "Guilherme Leite Coura",
    "photo": "https://lh3.googleusercontent.com/a-/ALV-UjX3l9J2I0maA0MEXQQfb1a9ypCWOvgprhjeprlwXjVvLG7DeKBG=s96-c-rp-mo-br100",
    "publishedAt": "2025-06-30",
    "tags": [
      "Insônia",
      "Ansiedade"
    ],
    "text": "Tô gostando e tá auxiliando na qualidade de sono e ansiedade",
    "approvedVersion": "full",
    "sourceReviewId": 122
  }
];
