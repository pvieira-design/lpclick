export type Question = {
  id: number;
  statement: string;
  answer: boolean;
  explanation: string;
  image: {
    src: string;
    alt: string;
  };
};

export const QUESTIONS: Question[] = [
  {
    id: 1,
    statement:
      "Muitos produtos importados de cannabis medicinal vêm de fazendas certificadas na Califórnia e em outros estados dos EUA.",
    answer: true,
    image: {
      src: "/lp7/question-1.jpeg",
      alt: "Cultivo indoor de cannabis medicinal em larga escala",
    },
    explanation:
      "Verdadeiro. Os EUA são um dos principais fornecedores de cannabis medicinal importada. Fabricantes da Califórnia, Colorado, Oregon e outros estados americanos exportam óleos, tinturas e outros produtos para o mercado global.",
  },
  {
    id: 2,
    statement:
      "Existem gomas (jujubas) de cannabis medicinal que podem ajudar no sono.",
    answer: true,
    image: {
      src: "/lp7/question-2.png?v=2",
      alt: "Goma quadrada com cristais de açúcar em close-up macro",
    },
    explanation:
      "Verdadeiro. Existem formatos como gomas, óleos e cápsulas. A escolha depende da avaliação médica, da composição do produto e do objetivo do tratamento.",
  },
  {
    id: 3,
    statement:
      "Tarja preta causa efeitos colaterais indesejados e dependência a longo prazo.",
    answer: true,
    image: {
      src: "/lp7/question-3.png?v=1",
      alt: "Cartelas de medicamentos e receituário médico sobre fundo branco",
    },
    explanation:
      "Verdadeiro. Alguns medicamentos tarja preta podem causar efeitos indesejados e risco de dependência, especialmente com uso prolongado. Qualquer ajuste deve ser feito com orientação médica.",
  },
  {
    id: 4,
    statement:
      "É verdade que é possível realizar tratamento com cannabis medicinal no Brasil há mais de 5 anos?",
    answer: true,
    image: {
      src: "/lp7/question-4.png?v=1",
      alt: "Médico em consultório no Brasil com calendário na parede",
    },
    explanation:
      "Verdadeiro. O acesso regulado a produtos à base de cannabis para fins medicinais existe no Brasil há mais de 5 anos, sempre com prescrição e acompanhamento profissional.",
  },
  {
    id: 5,
    statement:
      "É possível fazer consulta online para avaliar tratamento com cannabis medicinal.",
    answer: true,
    image: {
      src: "/lp7/question-5.png?v=1",
      alt: "Mulher em teleconsulta médica pelo laptop em casa",
    },
    explanation:
      "Verdadeiro. A telemedicina pode ser usada quando segue as regras profissionais e permite que o paciente converse com um médico habilitado sem sair de casa.",
  },
  {
    id: 6,
    statement:
      "Todo medicamento de cannabis medicinal deixa a pessoa \"chapada\".",
    answer: false,
    image: {
      src: "/lp7/question-6.png?v=1",
      alt: "Mulher concentrada e tranquila trabalhando em home office",
    },
    explanation:
      "Falso. Esse efeito está mais associado ao THC em determinadas doses. Muitos produtos têm predominância de CBD ou combinações pensadas para uso terapêutico.",
  },
  {
    id: 7,
    statement:
      "Quem já usa remédio para dormir pode trocar por cannabis medicinal sozinho.",
    answer: false,
    image: {
      src: "/lp7/question-7.png?v=1",
      alt: "Médico e paciente em consulta revisando prescrição juntos",
    },
    explanation:
      "Falso. Nunca é recomendado interromper ou substituir medicamentos por conta própria. Qualquer mudança deve ser orientada pelo médico.",
  },
  {
    id: 8,
    statement:
      "A cannabis medicinal pode ajudar com dor crônica, ansiedade e dificuldades de sono.",
    answer: true,
    image: {
      src: "/lp7/question-8.png?v=1",
      alt: "Pessoa dormindo tranquilamente em cama confortável com roupa de cama branca",
    },
    explanation:
      "Verdadeiro. Dor crônica, ansiedade e dificuldades de sono estão entre os motivos frequentes de busca por avaliação médica, mas a indicação depende do caso individual.",
  },
  {
    id: 9,
    statement:
      "É verdade que a Click Cannabis auxilia no processo de importação dos EUA?",
    answer: true,
    image: {
      src: "/lp7/question-9.png?v=1",
      alt: "Caixa de produto premium sendo entregue na porta de casa",
    },
    explanation:
      "Verdadeiro. A Click orienta o paciente no fluxo de consulta, prescrição, autorização quando necessária e compra internacional para uso próprio.",
  },
  {
    id: 10,
    statement:
      "É proibido o THC nos produtos de cannabis medicinal.",
    answer: false,
    image: {
      src: "/lp7/question-10.png?v=1",
      alt: "Laboratório farmacêutico moderno com cientista analisando produtos",
    },
    explanation:
      "Falso. O THC pode estar presente em produtos de cannabis medicinal quando há indicação, prescrição e enquadramento nas regras aplicáveis.",
  },
  {
    id: 11,
    statement:
      "Cannabis medicinal vicia tanto quanto remédios tarja preta para ansiedade.",
    answer: false,
    image: {
      src: "/lp7/question-11.png?v=1",
      alt: "Paciente em consulta médica discutindo opções de tratamento com confiança",
    },
    explanation:
      "Falso. O perfil de dependência da cannabis medicinal é diferente do de benzodiazepínicos e outros tarja preta. A avaliação médica considera esse aspecto individualmente.",
  },
  {
    id: 12,
    statement:
      "Quem mora em qualquer estado do Brasil pode acessar cannabis medicinal com prescrição.",
    answer: true,
    image: {
      src: "/lp7/question-12.png?v=1",
      alt: "Mapa do Brasil com pontos de conexão em diversas cidades, conceito de acesso à saúde",
    },
    explanation:
      "Verdadeiro. Com a telemedicina e entrega em domicílio, pacientes de todo o país podem ter acesso ao tratamento sem precisar ir a grandes centros.",
  },
  {
    id: 13,
    statement:
      "O CBD não causa efeito psicoativo.",
    answer: true,
    image: {
      src: "/lp7/question-13.png?v=1",
      alt: "Pessoa meditando com expressão tranquila e mente clara, ambiente iluminado",
    },
    explanation:
      "Verdadeiro. O CBD (canabidiol) não provoca o efeito psicoativo associado ao THC. Por isso é amplamente estudado para uso terapêutico sem alterar a percepção.",
  },
  {
    id: 14,
    statement:
      "Com acompanhamento médico, alguns pacientes conseguem reduzir outros medicamentos ao iniciar cannabis medicinal.",
    answer: true,
    image: {
      src: "/lp7/question-14.png?v=1",
      alt: "Médico e paciente revisando organizador de medicamentos juntos em consultório",
    },
    explanation:
      "Verdadeiro. Em alguns casos, com orientação profissional, é possível reavaliar e ajustar o uso de outros medicamentos. Isso nunca deve ser feito sem supervisão.",
  },
  {
    id: 15,
    statement:
      "É difícil encontrar um médico especializado em cannabis medicinal no Brasil.",
    answer: false,
    image: {
      src: "/lp7/question-15.png?v=1",
      alt: "Médico sorridente com jaleco branco e tablet, ambiente de teleconsulta",
    },
    explanation:
      "Falso. Hoje é possível se consultar com médicos habilitados de forma totalmente online. A Click Cannabis conecta pacientes a profissionais experientes com rapidez e praticidade.",
  },
];
