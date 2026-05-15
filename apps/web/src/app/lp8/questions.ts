export type Question = {
  id: number;
  statement: string;
  answer: boolean;
  explanation: string;
  image?: {
    src?: string;
    emoji?: string;
    alt: string;
  };
};

export const QUESTIONS: Question[] = [
  {
    id: 1,
    statement:
      "É verdade que é possível realizar tratamento com cannabis medicinal no Brasil?",
    answer: true,
    image: {
      src: "/lp8/1.png?v=2",
      alt: "Frasco de cannabis medicinal em farmácia brasileira",
    },
    explanation:
      "Verdadeiro. O tratamento com cannabis medicinal é possível no Brasil quando há avaliação, prescrição médica e acesso por vias regularizadas.",
  },
  {
    id: 2,
    statement:
      "Produtos de cannabis medicinal regularizados passam por avaliação da Agência Nacional de Vigilância Sanitária?",
    answer: true,
    image: {
      src: "/lp8/2.png?v=2",
      alt: "Documento regulatório farmacêutico com selo oficial",
    },
    explanation:
      "Verdadeiro. Produtos regularizados seguem critérios sanitários e precisam estar dentro das regras aplicáveis da Anvisa.",
  },
  {
    id: 3,
    statement:
      "Existem gomas, óleos e outros formatos modernos de cannabis medicinal?",
    answer: true,
    image: {
      src: "/lp8/3.png?v=2",
      alt: "Flat-lay de óleo, gomas e cápsulas de cannabis medicinal",
    },
    explanation:
      "Verdadeiro. Além de óleos, existem apresentações como gomas, cápsulas e outros formatos, conforme disponibilidade, composição e indicação médica.",
  },
  {
    id: 4,
    statement:
      "CBD e THC são canabinoides diferentes?",
    answer: true,
    image: {
      src: "/lp8/4.png?v=2",
      alt: "Dois frascos de laboratório lado a lado representando CBD e THC",
    },
    explanation:
      "Verdadeiro. CBD e THC são compostos diferentes da planta, com características, efeitos e indicações que devem ser avaliados por um profissional.",
  },
  {
    id: 5,
    statement:
      "É verdade que existem produtos de cannabis medicinal sem fumaça?",
    answer: true,
    image: {
      src: "/lp8/5.png?v=2",
      alt: "Gota de óleo de cannabis medicinal caindo de um conta-gotas",
    },
    explanation:
      "Verdadeiro. Muitos tratamentos utilizam formatos sem combustão, como óleos, cápsulas e gomas, sempre conforme orientação médica.",
  },
  {
    id: 6,
    statement:
      "É verdade que muitas pessoas usam cannabis medicinal para bem-estar, rotina e qualidade de vida?",
    answer: true,
    image: {
      src: "/lp8/6.png?v=2",
      alt: "Mulher serena praticando alongamento ao nascer do sol",
    },
    explanation:
      "Verdadeiro. Muitas pessoas buscam avaliação para entender se a cannabis medicinal pode apoiar objetivos ligados a bem-estar, rotina e qualidade de vida.",
  },
  {
    id: 7,
    statement:
      "É verdade que posso falar com um médico prescritor ainda hoje?",
    answer: true,
    image: {
      src: "/lp8/7.png?v=2",
      alt: "Médico em consulta online por videochamada",
    },
    explanation:
      "Verdadeiro. A Click Cannabis pode conectar você a um médico prescritor para uma avaliação online, de acordo com a disponibilidade de agenda.",
  },
  {
    id: 8,
    statement:
      "É verdade que, após aprovação médica, a Click Cannabis auxilia todo o processo até a entrega do produto?",
    answer: true,
    image: {
      src: "/lp8/8.png?v=2",
      alt: "Entregador entregando caixa de medicamento na porta de casa",
    },
    explanation:
      "Verdadeiro. Após aprovação médica, a Click orienta as próximas etapas do processo e acompanha o paciente até a entrega do produto.",
  },
  {
    id: 9,
    statement:
      "Todo produto de cannabis medicinal deixa o paciente “chapado”.",
    answer: false,
    image: {
      src: "/lp8/9.png?v=1",
      alt: "Pessoa concentrada trabalhando ao lado de frasco de óleo de CBD",
    },
    explanation:
      "Falso. Esse efeito está associado principalmente ao THC em determinadas doses. Muitos produtos têm predominância de CBD ou combinações pensadas para uso terapêutico, sem efeito psicoativo significativo.",
  },
  {
    id: 10,
    statement:
      "Cannabis medicinal só pode ser usada por pessoas idosas.",
    answer: false,
    image: {
      src: "/lp8/10.png?v=1",
      alt: "Diferentes gerações de uma família brasileira reunidas",
    },
    explanation:
      "Falso. A cannabis medicinal pode ser indicada para pacientes de diferentes faixas etárias, sempre conforme avaliação e prescrição médica para cada caso.",
  },
  {
    id: 11,
    statement:
      "É possível fazer a consulta com o médico prescritor sem sair de casa.",
    answer: true,
    image: {
      src: "/lp8/11.png?v=1",
      alt: "Paciente em consulta online por videochamada no sofá de casa",
    },
    explanation:
      "Verdadeiro. A consulta com médicos prescritores parceiros pode ser feita por telemedicina, de acordo com a disponibilidade de agenda e seguindo as regras profissionais.",
  },
  {
    id: 12,
    statement:
      "A cannabis medicinal pode apoiar tratamentos de dor crônica, ansiedade e dificuldades de sono.",
    answer: true,
    image: {
      src: "/lp8/12.png?v=1",
      alt: "Pessoa serena com a mão no peito em momento de alívio",
    },
    explanation:
      "Verdadeiro. Dor crônica, ansiedade e dificuldades de sono estão entre os motivos frequentes de busca por avaliação médica, mas a indicação depende sempre do caso individual.",
  },
  {
    id: 13,
    statement:
      "Cannabis medicinal causa dependência química igual aos remédios tarja preta.",
    answer: false,
    image: {
      src: "/lp8/13.png?v=1",
      alt: "Frasco com tarja preta lado a lado com frasco âmbar de óleo medicinal",
    },
    explanation:
      "Falso. O perfil de segurança da cannabis medicinal é diferente de medicamentos como benzodiazepínicos. Qualquer ajuste ou substituição deve sempre ser feito com acompanhamento médico.",
  },
  {
    id: 14,
    statement:
      "É verdade que crianças com epilepsias graves podem se beneficiar de prescrições à base de canabidiol?",
    answer: true,
    image: {
      src: "/lp8/14.png?v=1",
      alt: "Mãe abraçando carinhosamente a criança com expressão serena",
    },
    explanation:
      "Verdadeiro. Um dos usos mais estudados do CBD é o apoio em epilepsias graves na infância, sempre com prescrição e acompanhamento médico especializado.",
  },
  {
    id: 15,
    statement:
      "Quem já toma remédio para dormir pode trocar por cannabis medicinal por conta própria.",
    answer: false,
    image: {
      src: "/lp8/15.png?v=1",
      alt: "Pessoa em dúvida segurando dois frascos diferentes de medicamento",
    },
    explanation:
      "Falso. Nunca é recomendado interromper ou substituir medicamentos sem orientação. Qualquer mudança precisa passar pela avaliação de um médico habilitado.",
  },
  {
    id: 16,
    statement:
      "É verdade que a Anvisa regulamenta os produtos de cannabis medicinal disponíveis no Brasil?",
    answer: true,
    image: {
      src: "/lp8/16.png?v=1",
      alt: "Documento regulatório com selo oficial sobre mesa de escritório",
    },
    explanation:
      "Verdadeiro. A Anvisa regulamenta a produção, importação e venda de produtos à base de cannabis com fins terapêuticos no Brasil, dentro das regras aplicáveis.",
  },
];
