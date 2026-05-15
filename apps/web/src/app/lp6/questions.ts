export type Question = {
  id: number;
  statement: string;
  answer: boolean;
  explanation: string;
};

export const QUESTIONS: Question[] = [
  {
    id: 1,
    statement: "O CBD é uma substância natural extraída da planta cannabis.",
    answer: true,
    explanation:
      "Verdadeiro. O canabidiol (CBD) é um dos mais de 100 canabinoides presentes na Cannabis sativa, extraído da planta para uso medicinal.",
  },
  {
    id: 2,
    statement: "O CBD causa o efeito de 'barato' associado à maconha recreativa.",
    answer: false,
    explanation:
      "Falso. Quem causa o efeito psicoativo é o THC. O CBD não tem ação psicoativa e é seguro para uso terapêutico, inclusive durante o dia.",
  },
  {
    id: 3,
    statement:
      "Insônia crônica é diagnosticada quando ocorre 3 ou mais noites por semana, por pelo menos 3 meses.",
    answer: true,
    explanation:
      "Verdadeiro. Esse é o critério clínico oficial. Se você convive com insônia há mais de 3 meses, está na hora de buscar tratamento médico.",
  },
  {
    id: 4,
    statement:
      "O CBD pode auxiliar na regulação do ciclo do sono e melhorar a qualidade do descanso.",
    answer: true,
    explanation:
      "Verdadeiro. Estudos mostram que o CBD atua no sistema endocanabinoide, ajudando a regular o ritmo circadiano e a reduzir a ansiedade que atrapalha o sono.",
  },
  {
    id: 5,
    statement:
      "Só pessoas com mais de 60 anos podem usar cannabis medicinal no Brasil.",
    answer: false,
    explanation:
      "Falso. A cannabis medicinal pode ser prescrita para pacientes de qualquer idade, desde crianças com epilepsia até idosos com dores crônicas — basta avaliação médica.",
  },
  {
    id: 6,
    statement:
      "É necessária prescrição médica para acessar o tratamento com cannabis medicinal.",
    answer: true,
    explanation:
      "Verdadeiro. O tratamento com cannabis medicinal exige prescrição de um médico habilitado. Na Click, conectamos você a médicos prescritores especializados.",
  },
  {
    id: 7,
    statement:
      "O CBD causa dependência química como os remédios tarja preta usados para dormir.",
    answer: false,
    explanation:
      "Falso. Diferente dos benzodiazepínicos (Rivotril, Clonazepam, etc.), o CBD não causa dependência química nem tolerância — segundo a OMS, tem perfil de segurança favorável.",
  },
  {
    id: 8,
    statement:
      "A privação crônica de sono pode afetar memória, humor e sistema imunológico.",
    answer: true,
    explanation:
      "Verdadeiro. Dormir mal aumenta o risco de doenças cardiovasculares, diabetes, depressão e enfraquece a imunidade. Sono é remédio.",
  },
  {
    id: 9,
    statement:
      "Cannabis medicinal só é receitada para pacientes em estágio terminal.",
    answer: false,
    explanation:
      "Falso. A cannabis medicinal é prescrita para diversas condições: insônia, ansiedade, dor crônica, epilepsia, fibromialgia, TDAH, entre outras.",
  },
  {
    id: 10,
    statement:
      "A Anvisa regulamenta os produtos à base de cannabis comercializados no Brasil.",
    answer: true,
    explanation:
      "Verdadeiro. Desde 2019, a Anvisa regulamenta a produção, importação e venda de produtos à base de cannabis com fins terapêuticos no Brasil.",
  },
  {
    id: 11,
    statement:
      "Higiene do sono — evitar telas, cafeína e luzes fortes antes de dormir — faz parte do tratamento da insônia.",
    answer: true,
    explanation:
      "Verdadeiro. A higiene do sono é a primeira linha de tratamento e potencializa qualquer terapia, inclusive a cannabis medicinal.",
  },
  {
    id: 12,
    statement:
      "Insônia não tem tratamento eficaz — quem tem insônia precisa aprender a conviver com ela.",
    answer: false,
    explanation:
      "Falso. Insônia tem tratamento e cura. Com acompanhamento médico, mudanças de hábito e, quando indicado, cannabis medicinal, o sono pode ser totalmente restaurado.",
  },
  {
    id: 13,
    statement: "Em média, um adulto precisa de 7 a 9 horas de sono por noite.",
    answer: true,
    explanation:
      "Verdadeiro. Essa é a faixa recomendada pela National Sleep Foundation para adultos saudáveis. Menos do que isso, de forma crônica, é fator de risco para várias doenças.",
  },
  {
    id: 14,
    statement: "Tomar café após as 16h pode prejudicar o sono à noite, mesmo em quem se considera resistente.",
    answer: true,
    explanation:
      "Verdadeiro. A meia-vida da cafeína no organismo é de 5 a 6 horas — ou seja, metade ainda está ativa quando você vai dormir, atrasando o início e reduzindo a profundidade do sono.",
  },
  {
    id: 15,
    statement: "Beber álcool antes de dormir é uma boa estratégia para ter um sono profundo.",
    answer: false,
    explanation:
      "Falso. O álcool até induz sonolência, mas fragmenta o sono REM, causa despertares noturnos e piora a qualidade do descanso. É um dos vilões do sono.",
  },
  {
    id: 16,
    statement: "O CBD também pode auxiliar no tratamento de ansiedade, que muitas vezes acompanha a insônia.",
    answer: true,
    explanation:
      "Verdadeiro. Estudos mostram que o CBD atua em receptores ligados à modulação da ansiedade. Como ansiedade e insônia caminham juntas, tratar uma ajuda na outra.",
  },
  {
    id: 17,
    statement: "Quem trabalha em turnos noturnos tem maior risco de desenvolver insônia crônica.",
    answer: true,
    explanation:
      "Verdadeiro. Trabalho noturno desregula o ritmo circadiano (relógio biológico), aumentando o risco de insônia, problemas metabólicos e cardiovasculares.",
  },
  {
    id: 18,
    statement: "Dormir várias sonecas longas durante o dia ajuda a recuperar uma noite mal dormida.",
    answer: false,
    explanation:
      "Falso. Sonecas longas durante o dia atrapalham o sono noturno e mantêm o ciclo de insônia. Sonecas curtas (até 20-30 min) podem ajudar; longas só pioram.",
  },
  {
    id: 19,
    statement: "Cannabis medicinal pode ser prescrita para crianças com epilepsia refratária.",
    answer: true,
    explanation:
      "Verdadeiro. Um dos usos mais consolidados do CBD é no tratamento de epilepsias graves em crianças — como na Síndrome de Dravet — com aprovação inclusive do FDA e da Anvisa.",
  },
  {
    id: 20,
    statement: "Praticar exercícios físicos regulares melhora a qualidade do sono.",
    answer: true,
    explanation:
      "Verdadeiro. Exercícios reduzem ansiedade, regulam hormônios e melhoram a profundidade do sono. Só evite atividades intensas nas 2 horas antes de dormir.",
  },
  {
    id: 21,
    statement: "Insônia é só 'frescura' — não é uma condição médica de verdade.",
    answer: false,
    explanation:
      "Falso. Insônia é reconhecida pela OMS como distúrbio do sono e pode estar associada a depressão, ansiedade, hipertensão e diabetes. Merece tratamento sério.",
  },
  {
    id: 22,
    statement: "THC e CBD são a mesma substância — só muda o nome.",
    answer: false,
    explanation:
      "Falso. THC é psicoativo (causa o 'barato'); CBD não é. Ambos são canabinoides da cannabis, mas têm efeitos terapêuticos e mecanismos diferentes.",
  },
  {
    id: 23,
    statement: "Manter o quarto escuro, silencioso e fresco favorece um sono de qualidade.",
    answer: true,
    explanation:
      "Verdadeiro. Escuridão estimula a melatonina, baixa temperatura ajuda no início do sono e silêncio reduz despertares. É a base da higiene do sono.",
  },
  {
    id: 24,
    statement: "Telas de celular e TV antes de dormir reduzem a produção natural de melatonina.",
    answer: true,
    explanation:
      "Verdadeiro. A luz azul das telas inibe a produção de melatonina, hormônio do sono. Por isso a recomendação é desligar as telas pelo menos 1h antes de dormir.",
  },
  {
    id: 25,
    statement: "Cannabis medicinal pode causar overdose fatal, como acontece com opioides.",
    answer: false,
    explanation:
      "Falso. Não existem mortes registradas por overdose de cannabis. Diferente dos opioides, ela tem alta margem de segurança terapêutica.",
  },
  {
    id: 26,
    statement: "O sistema endocanabinoide existe naturalmente no corpo humano e regula sono, humor e dor.",
    answer: true,
    explanation:
      "Verdadeiro. Todos temos um sistema endocanabinoide com receptores CB1 e CB2 espalhados pelo corpo. O CBD age nele para restaurar o equilíbrio do organismo.",
  },
  {
    id: 27,
    statement: "O tratamento da insônia se resume a tomar um remédio para dormir.",
    answer: false,
    explanation:
      "Falso. O tratamento moderno combina higiene do sono, terapia cognitivo-comportamental para insônia (TCC-I) e, quando necessário, medicação — incluindo cannabis medicinal.",
  },
  {
    id: 28,
    statement: "Insônia pode aumentar o risco de doenças cardiovasculares e diabetes tipo 2.",
    answer: true,
    explanation:
      "Verdadeiro. A privação crônica de sono está associada a maior risco de infarto, AVC, hipertensão, obesidade e diabetes. Dormir bem é prevenção.",
  },
];
