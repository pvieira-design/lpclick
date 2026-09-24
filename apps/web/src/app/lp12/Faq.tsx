"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import SectionHeading from "./SectionHeading";

const EASE: [number, number, number, number] = [0.23, 1, 0.32, 1];

const FAQS = [
  {
    q: "O tratamento com cannabis medicinal é legal?",
    a: "Sim. Todo o processo é feito dentro da lei, com prescrição de médico e importação regulamentada e acompanhada pela ANVISA. A Click cuida da documentação com você em cada etapa.",
  },
  {
    q: "Como funciona a consulta e quanto custa?",
    a: "A consulta é 100% online, custa R$50 e tem vários horários disponíveis todos os dias, com atendimento 24h. Se você for apto ao tratamento, o médico emite a receita necessária. E a sua primeira consulta de acompanhamento é gratuita.",
  },
  {
    q: "Em quanto tempo o medicamento chega?",
    a: "Após a autorização, a importação é feita direto dos EUA com isenção de impostos e suporte completo da Click. A entrega acontece em até 15 dias úteis.",
  },
  {
    q: "Causa dependência ou efeitos colaterais?",
    a: "O tratamento é prescrito e acompanhado por médico, com dosagem orientada para o seu caso. Muitos pacientes relatam justamente reduzir o uso de tarja preta. Dúvidas sobre efeitos devem ser conversadas com o médico na consulta.",
  },
  {
    q: "Preciso de algum exame ou laudo para começar?",
    a: "Não precisa chegar com laudo pronto. Na consulta, o médico avalia o seu caso e indica o melhor caminho. Se for apto ao tratamento, ele cuida da receita na hora.",
  },
  {
    q: "Quais formas de tratamento existem?",
    a: "Óleo, jujuba e softgel. Cada formato tem uma forma de absorção, e o seu médico indica a melhor opção para a sua rotina e o seu objetivo.",
  },
];

export default function Faq() {
  const reduceMotion = useReducedMotion();

  const list: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: reduceMotion ? 0 : 0.06 } },
  };
  const item: Variants = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } },
  };

  return (
    <section className="bg-white py-14 sm:py-20" id="lp12-faq">
      <div className="mx-auto w-full max-w-3xl px-5">
        <SectionHeading label="Tira-dúvidas" title="Perguntas frequentes" description="O que todo paciente pergunta antes de começar." className="mb-8 sm:mb-12" />

        <motion.div
          variants={list}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
        >
          {FAQS.map(({ q, a }, i) => (
            <motion.details
              key={q}
              variants={item}
              open={i === 0}
              className="group border-b"
              style={{ borderColor: "var(--line)" }}
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-left text-base font-medium text-gray-900 [&::-webkit-details-marker]:hidden">
                {q}
                <span
                  className="flex size-7 shrink-0 items-center justify-center rounded-full border text-lg transition-transform duration-300 group-open:rotate-45 group-open:text-white"
                  style={{ borderColor: "var(--line)", color: "var(--green-600)" }}
                >
                  <span className="transition-colors duration-300 group-open:hidden">+</span>
                  <span
                    className="hidden size-full items-center justify-center rounded-full group-open:flex"
                    style={{ backgroundColor: "var(--green-500)" }}
                  >
                    +
                  </span>
                </span>
              </summary>
              <p className="max-w-[62ch] pb-5 text-sm leading-relaxed text-gray-600">
                {a}
              </p>
            </motion.details>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
