"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { sendGTMEvent } from "@next/third-parties/google";
import { sendLeadToCrm } from "@/lib/crmLead";
import { APPROVED_TESTIMONIALS, type ApprovedTestimonial } from "@/lib/approvedTestimonials";
import InicioReviewCard from "../lp12/InicioReviewCard";

const PHONE = "5521993686082";
const EASE = [0.22, 1, 0.36, 1] as const;

const OBJECTIVES = [
  { label: "Dormir melhor", description: "Pegar no sono e acordar descansado", icon: "moon" },
  { label: "Relaxar", description: "Menos tensão no dia a dia", icon: "wave" },
  { label: "Alívio de dores", description: "Dores crônicas, musculares ou articulares", icon: "heart" },
  { label: "Melhorar meu humor", description: "Mais ânimo e disposição", icon: "sun" },
  { label: "Mais foco e concentração", description: "Render melhor no trabalho e nos estudos", icon: "target" },
] as const;

const POPUP_REVIEW_NAMES_BY_OBJECTIVE: Record<string, readonly string[]> = {
  "Dormir melhor": ["Arthur Marques", "Luciana Pereira", "Angela Nicolau", "Suze Costa"],
  Relaxar: ["Nath Gomes", "Eduarda Carolini", "Meire Marinho", "Rosilda Costa"],
  "Alívio de dores": ["Gislene Spelta", "Marcilene Cardoso", "Ana Paula Machado de Melo", "Vanessa Wankler"],
  "Melhorar meu humor": ["Adriana Monteiro Lopes Buono", "Jheryk Marx", "angela maria carvalho silva cassol", "Jhonat Anschau"],
  "Mais foco e concentração": ["Roseni Santos", "Ricardo Andrade", "Guilherme Lima", "Jeni Lisbeth"],
};

const PAGE_REVIEW_NAMES_BY_OBJECTIVE: Record<string, readonly string[]> = {
  "Dormir melhor": [
    "Arthur Marques", "Luciana Pereira", "Angela Nicolau", "Suze Costa",
    "KA Brasil", "Juliana Leal", "Jorge Moreira", "Fátima Daoualibi",
  ],
  Relaxar: [
    "Nath Gomes", "Eduarda Carolini", "Meire Marinho",
    "Rosilda Costa", "Thiago Jattobá", "Verista Convicto",
  ],
  "Alívio de dores": [
    "Gislene Spelta", "Marcilene Cardoso", "Ana Paula Machado de Melo",
    "Vanessa Wankler", "Fabio Santos", "Lucimara Amandio",
  ],
  "Melhorar meu humor": [
    "Adriana Monteiro Lopes Buono", "Jheryk Marx", "angela maria carvalho silva cassol",
    "Jhonat Anschau", "Danilo Mastroianni", "Eliseu plauth",
  ],
  "Mais foco e concentração": [
    "Roseni Santos", "Ricardo Andrade", "Guilherme Lima",
    "Jeni Lisbeth", "Sandra CardosoBueno", "Leonardo Zerlotti",
  ],
};

// Ordem editorial intercalada: evita blocos consecutivos sobre o mesmo objetivo.
const PAGE_REVIEW_ORDER = (() => {
  const objectiveLabels = OBJECTIVES.map((objective) => objective.label);
  const sleepReviews = PAGE_REVIEW_NAMES_BY_OBJECTIVE["Dormir melhor"];
  const orderedNames: string[] = [];

  for (let round = 0; round < 6; round += 1) {
    objectiveLabels.forEach((objective, objectiveIndex) => {
      orderedNames.push(PAGE_REVIEW_NAMES_BY_OBJECTIVE[objective][round]);
      if (round === 1 && objectiveIndex === 2) orderedNames.push(sleepReviews[6]);
      if (round === 4 && objectiveIndex === 3) orderedNames.push(sleepReviews[7]);
    });
  }

  return orderedNames;
})();

// Cortes adicionais autorizados apenas para os cards grandes desta página.
// O texto-base permanece intacto em approvedTestimonials.ts.
const PAGE_REVIEW_EXCERPTS: Record<string, string> = {
  "Gislene Spelta": "Estou gostando muito , meu sono melhorou bastante ( agora consigo pegar no sono rapidamente), as dores não passaram mas posso dizer que diminuíram por volta de 50% , o que é um grande avanço pra mim. […]",
  "Angela Nicolau": "[…] Na primeira noite, já senti melhora na qualidade do sono. Ajustando a dose, conforme prescrição, hoje durmo às 22:30h e acordo às 6h. […]",
  "Fabio Santos": "[…] ja sinto diferença na qualidade do meu sono e um alivio em minhas dores por conta da artrose no joelho e da estenose lombar. […]",
  "Danilo Mastroianni": "Estou em fase inicial de tratamento, e venho obtendo bons resultados! […] Gratidão por tudo que a Click Cannabis fez por mim!",
  "Fátima Daoualibi": "Vi o anúncio num ônibus e entrei em contato. […] todos que me atenderam foram excepcionais. […] Voltei a dormir a noite toda e acordo descansada.",
  "Rosilda Costa": "Depois 30 dias sentir uma melhora nas minhas dores do joelho que tenho devido a artrose. Tenho sentido menos ansiedade. […]",
  "Adriana Monteiro Lopes Buono": "O processo com a Click Cannabis tem sido fácil, descomplicado e super profissional desde o início. […] senti melhora significativa na qualidade de sono e no humor e a cada dia só melhora.",
  "Marcilene Cardoso": "Estou muito satisfeita e aliviada. Minhas dores diminuíram significativamente. Tenho fibromialgia e consegui voltar a realizar coisas da rotina sem entrar em sofrimento. […]",
  "Sandra CardosoBueno": "Minha experiência foi muito boa. Após usar a medicação, consegui controlar mais a ansiedade, […] durmo melhor e sinto um melhor desemprenho no trabalho e atividade física. […]",
  "Jorge Moreira": "A melhor possível ,tudo dentro da lei e no que eu estava precisando os óleos estão me auxiliando demais, […] Resultado positivos em apenas três dias.",
  "Verista Convicto": "Estou tomando pra ansiedade e tem me ajudado muito. […] Não tive qualquer efeito colateral. Hoje durmo melhor.",
};

const APPROVED_REVIEW_BY_NAME = new Map(APPROVED_TESTIMONIALS.map((review) => [review.name, review]));
const REVIEW_DATE_FORMATTER = new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC" });

function reviewsByName(names: readonly string[]): ApprovedTestimonial[] {
  return names
    .map((name) => APPROVED_REVIEW_BY_NAME.get(name))
    .filter((review): review is ApprovedTestimonial => Boolean(review));
}

function formatReviewDate(publishedAt: string): string {
  return REVIEW_DATE_FORMATTER.format(new Date(`${publishedAt}T12:00:00Z`));
}

const FAQS = [
  ["A consulta é realmente online?", "Sim. Você conversa por videochamada com um médico prescritor, de onde estiver. A consulta custa R$50 e o primeiro acompanhamento é gratuito."],
  ["Preciso chegar com exames ou laudo?", "Não. Na consulta, o médico entende o seu histórico e orienta se precisa de algum documento ou exame complementar."],
  ["A cannabis medicinal é legal no Brasil?", "O acesso pode ser feito com prescrição médica e autorização da Anvisa. A Click acompanha você na documentação e no processo de importação."],
  ["Sou obrigado a iniciar o tratamento depois da consulta?", "Não. A consulta é o espaço para avaliar o seu caso, esclarecer dúvidas e entender possibilidades. A indicação depende da avaliação médica individual."],
  ["Quanto tempo o medicamento leva para chegar?", "Depois da prescrição e da documentação, a entrega costuma acontecer em até 15 dias úteis. O time acompanha cada etapa com você."],
] as const;

const PROCESS_STEPS = [
  {
    number: "01",
    eyebrow: "Consulta",
    title: "Médica",
    detailTitle: "Consulta médica",
    copy: "Faça sua consulta por apenas R$50. O processo é 100% online, com atendimento 24h e vários horários disponíveis.",
  },
  {
    number: "02",
    eyebrow: "Receita",
    title: "Médica",
    detailTitle: "Receita médica",
    copy: "Se houver indicação para o tratamento, o médico emitirá a receita necessária para seguir com a autorização.",
  },
  {
    number: "03",
    eyebrow: "Autorização da",
    title: "Anvisa",
    detailTitle: "Autorização da Anvisa",
    copy: "A Click orienta você em toda a documentação necessária para a importação do medicamento prescrito.",
  },
  {
    number: "04",
    eyebrow: "Importação e",
    title: "Entrega",
    detailTitle: "Importação e entrega",
    copy: "Oferecemos suporte na importação e acompanhamos o processo até a entrega, estimada em até 15 dias úteis.",
  },
] as const;

function Arrow() {
  return <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M4 10h12m-5-5 5 5-5 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function ObjectiveIcon({ name }: { name: string }) {
  const common = { width: 19, height: 19, viewBox: "0 0 24 24", fill: "none", "aria-hidden": true } as const;
  if (name === "moon") return <svg {...common}><path d="M20 15.1A8 8 0 0 1 8.9 4a8.2 8.2 0 1 0 11.1 11.1Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" /></svg>;
  if (name === "wave") return <svg {...common}><path d="M4 9c1.7-2 3.3-2 5 0s3.3 2 5 0M7 15c1.7-2 3.3-2 5 0s3.3 2 5 0" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></svg>;
  if (name === "heart") return <svg {...common}><path d="M12 19s-7-4.1-7-9a3.8 3.8 0 0 1 7-2.1A3.8 3.8 0 0 1 19 10c0 4.9-7 9-7 9Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /><path d="M7.5 12h2l1-2 2 4 1-2h3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>;
  if (name === "sun") return <svg {...common}><circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="1.6" /><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>;
  return <svg {...common}><circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.6" /><circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6" /><circle cx="12" cy="12" r="1.2" fill="currentColor" /></svg>;
}

function Logo({ light = false }: { light?: boolean }) {
  return <Image src="/logo.svg" alt="Click Cannabis" width={230} height={33} priority className={`h-auto ${light ? "w-[160px] brightness-0 invert sm:w-[178px]" : "w-[220px] sm:w-[230px]"}`} />;
}

function scrollToTriage() {
  document.getElementById("click-triage")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function buildWhatsAppUrl(name: string, pathologies: string[]): string {
  // Esta mensagem é o gatilho de atribuição do CRM e precisa permanecer
  // idêntica ao padrão usado pelas demais landing pages.
  const list = pathologies.map((pathology, index) => `${index + 1}. ${pathology}`).join("\n");
  const message = `Olá, me chamo ${name}.\n\nPatologias selecionadas:\n${list}`;
  return `https://api.whatsapp.com/send/?phone=${PHONE}&text=${encodeURIComponent(message)}&type=phone_number&app_absent=0`;
}

export default function ClickLanding() {
  const reduceMotion = useReducedMotion();
  const [selected, setSelected] = useState<Set<string>>(() => new Set());
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [stickyVisible, setStickyVisible] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);

  const canContinue = selected.size > 0;
  const primaryObjective = Array.from(selected)[0] || "Dormir melhor";
  const selectedObjective = OBJECTIVES.find((objective) => objective.label === primaryObjective) ?? OBJECTIVES[0];
  const relevantReviews = reviewsByName(
    POPUP_REVIEW_NAMES_BY_OBJECTIVE[primaryObjective] ?? POPUP_REVIEW_NAMES_BY_OBJECTIVE["Dormir melhor"],
  );
  const featuredReviews = reviewsByName(PAGE_REVIEW_ORDER);

  useEffect(() => {
    const anchor = document.getElementById("click-sticky-anchor");
    if (!anchor) return;
    const observer = new IntersectionObserver(([entry]) => {
      setStickyVisible(entry.isIntersecting || entry.boundingClientRect.top < 0);
    });
    observer.observe(anchor);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (dialogOpen) {
      dialogRef.current?.showModal();
      document.body.style.overflow = "hidden";
      requestAnimationFrame(() => nameRef.current?.focus());
    } else {
      dialogRef.current?.close();
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [dialogOpen]);

  const selectObjective = useCallback((objective: string) => {
    setSelected(new Set([objective]));
    setDialogOpen(true);
    sendGTMEvent({ event: "buttonClick", category: "Lead", action: "Click", label: "Selecionar objetivo - Click" });
  }, []);

  const openLead = () => {
    if (!canContinue) {
      scrollToTriage();
      return;
    }
    setDialogOpen(true);
    sendGTMEvent({ event: "buttonClick", category: "Lead", action: "Click", label: "Abrir contato - Click" });
  };

  const submitLead = () => {
    const cleanName = name.trim();
    if (!cleanName) {
      setNameError(true);
      nameRef.current?.focus();
      return;
    }
    const pathologies = Array.from(selected);
    sendLeadToCrm(cleanName, pathologies);
    sendGTMEvent({ event: "buttonWhatsappClicked", category: "Lead", action: "Click", label: "Continuar no WhatsApp - Click", value: pathologies.join(", ") });
    window.open(buildWhatsAppUrl(cleanName, pathologies), "_blank", "noopener,noreferrer");
  };

  const heroChildren = useMemo(() => ({
    hidden: {},
    visible: { transition: { staggerChildren: reduceMotion ? 0 : 0.08 } },
  }), [reduceMotion]);
  const heroItem = useMemo(() => ({
    hidden: { opacity: 0, y: reduceMotion ? 0 : 18 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.62, ease: EASE } },
  }), [reduceMotion]);

  return (
    <div className="click-page min-h-screen overflow-x-hidden bg-white text-[#173126]">
      <header className="absolute inset-x-0 top-0 z-30">
        <div className="mx-auto flex max-w-[1280px] items-center justify-center px-4 pb-3 pt-6 sm:px-8 sm:pb-4 sm:pt-7 lg:px-12">
          <Logo />
        </div>
      </header>

      <main>
        <section id="click-hero" className="relative overflow-hidden border-b border-[#173126]/10 bg-white">
          <motion.div variants={heroChildren} initial="hidden" animate="visible" className="relative mx-auto grid max-w-[680px] content-start items-center gap-4 px-4 pb-7 pt-[4.5rem] sm:gap-6 sm:px-8 sm:pb-10 sm:pt-20 lg:pb-16 lg:pt-20">
            <motion.header variants={heroItem} className="mx-auto max-w-[580px] text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#cfe3d3] bg-white px-3 py-1.5 text-[11px] font-bold text-[#285e31] sm:text-[13px]">
                <span className="relative flex size-2 items-center justify-center" aria-hidden="true"><span className="absolute inset-0 animate-ping rounded-full bg-[#3e8f4a] opacity-60" /><span className="relative size-2 rounded-full bg-[#3e8f4a]" /></span>
                Médicos online agora · consulta ainda hoje
              </div>
              <h1 className="font-geist mt-4 text-[28px] font-light leading-[1.12] text-[#173126] sm:text-[36px]">Comece o tratamento por apenas <span className="font-semibold text-[#3d714b]">R$50,00</span></h1>
              <p className="mx-auto mt-2 max-w-lg text-sm leading-5 text-[#607168] sm:mt-3 sm:text-base sm:leading-6">Converse com médicos prescritores, 100% online e no conforto da sua casa.</p>
            </motion.header>
            <motion.div id="click-triage" variants={heroItem} className="w-full scroll-mt-4 sm:px-5">
              <div className="mb-3 sm:mb-4">
                <h2 className="font-editorial whitespace-nowrap text-[21px] font-semibold leading-tight text-[#214b31]">Qual é o seu objetivo principal?</h2>
              </div>
              <div role="radiogroup" aria-label="Objetivo principal" className="grid gap-2.5">
                {OBJECTIVES.map((objective) => (
                  <Choice key={objective.label} icon={objective.icon} active={selected.has(objective.label)} onClick={() => selectObjective(objective.label)}>
                    <span className="min-w-0 flex-1"><span className="block text-sm font-semibold leading-[1.2]">{objective.label}</span><span className="mt-1 block text-[11px] font-normal leading-[1.25] text-[#718078]">{objective.description}</span></span>
                  </Choice>
                ))}
              </div>
              <div className="mt-3 flex items-center justify-center gap-2 text-[9px] font-bold text-[#6c7c73] sm:mt-4 sm:gap-3 sm:text-[11px]"><span>4,9 no Google</span><span className="size-1 rounded-full bg-[#93a097]" /><span>RA1000</span><span className="size-1 rounded-full bg-[#93a097]" /><span>100% online</span></div>
            </motion.div>
          </motion.div>
        </section>

        <div id="click-sticky-anchor" aria-hidden="true" className="pointer-events-none h-px" />

        <section className="relative flex min-h-svh items-center overflow-hidden bg-[#285e31] py-12 text-white sm:py-20">
          <div className="relative mx-auto w-full max-w-[1180px]">
            <div className="px-4 text-center sm:px-8">
              <span className="text-[10px] font-black uppercase tracking-[.16em] text-white/60">Comunidade Click</span>
              <h2 className="mx-auto mt-2 max-w-xl whitespace-nowrap font-editorial text-[2rem] font-semibold leading-[1.08] text-white sm:text-5xl">Histórias reais</h2>
              <span className="mt-3 inline-flex items-center gap-2 text-[9px] font-bold uppercase tracking-[.12em] text-white/55 sm:text-[10px]">Arraste para o lado <span aria-hidden="true">→</span></span>
            </div>
            <div className="click-testimonials mt-7 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-3 sm:mt-9 sm:gap-5 sm:px-8" role="region" aria-label="Depoimentos de pacientes">
              {featuredReviews.map((item) => (
                <article key={item.name} className="flex min-w-[calc(100vw-2.5rem)] snap-center flex-col rounded-[1.35rem] bg-white p-5 text-[#173126] shadow-[0_18px_45px_rgba(16,47,31,.2)] sm:min-w-[500px] sm:rounded-[1.6rem] sm:p-7 lg:min-w-[560px]">
                  <div className="flex items-center justify-between gap-4">
                    <div><p className="text-sm font-extrabold text-[#173126]">{item.name}</p><p className="mt-0.5 text-[11px] text-[#748078]">{formatReviewDate(item.publishedAt)}</p></div>
                    <span className="text-xs tracking-[.12em] text-[#3e8f4a]" aria-label="5 estrelas">★★★★★</span>
                  </div>
                  <blockquote className="mt-5 flex-1 text-base font-normal leading-[1.5] text-[#263a2d] sm:text-lg">{PAGE_REVIEW_EXCERPTS[item.name] ?? item.text}</blockquote>
                </article>
              ))}
            </div>
            <p className="mx-auto mt-3 max-w-2xl px-4 text-center text-[10px] leading-4 text-white/55 sm:px-8 sm:text-xs sm:leading-5">Experiências individuais. Resultados variam e não representam garantia de resultado. O tratamento depende de avaliação e prescrição médica.</p>
            <div className="mx-4 mt-8 grid grid-cols-2 border-t border-white/15 sm:mx-8 sm:mt-10">
              <div className="border-r border-white/15 px-2 pt-6 text-center sm:pt-8"><p className="font-editorial text-[2rem] font-semibold leading-none text-white sm:text-5xl">+50 mil</p><p className="mt-2 text-[10px] font-bold uppercase tracking-[.1em] text-white/60 sm:text-xs">pacientes</p></div>
              <div className="px-2 pt-6 text-center sm:pt-8"><p className="font-editorial text-[2rem] font-semibold leading-none text-white sm:text-5xl">+150 mil</p><p className="mt-2 text-[10px] font-bold uppercase tracking-[.1em] text-white/60 sm:text-xs">consultas realizadas</p></div>
            </div>
          </div>
        </section>

        <section id="click-process" className="bg-white px-4 py-14 sm:px-8 sm:py-24">
          <div className="mx-auto max-w-[820px]">
            <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-start sm:gap-x-8">
              <span className="w-fit rounded-full bg-[#cde9d1] px-3 py-1 text-xs font-bold text-[#285e31] sm:col-start-2 sm:row-start-1 sm:justify-self-end">Processos</span>
              <h2 className="font-editorial text-[32px] font-semibold leading-[1.08] text-[#173126] sm:col-start-1 sm:row-span-2 sm:row-start-1 sm:text-[48px]">Tratamento descomplicado</h2>
              <p className="text-sm text-[#67736c] sm:col-start-2 sm:row-start-2 sm:text-right">Entenda cada uma das nossas etapas.</p>
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:gap-4">
              {PROCESS_STEPS.map((step) => <TreatmentStep key={step.number} {...step} />)}
            </div>
          </div>
        </section>

        <section className="bg-[#f7f7f4] px-4 py-14 sm:px-8 sm:py-28">
          <div className="mx-auto max-w-[1180px]">
            <div className="grid max-w-[820px] gap-3 sm:grid-cols-[1fr_auto] sm:items-start sm:gap-x-8">
              <span className="w-fit rounded-full bg-[#cde9d1] px-3 py-1 text-xs font-bold text-[#285e31] sm:col-start-2 sm:row-start-1 sm:justify-self-end">Formatos</span>
              <h2 className="max-w-2xl font-editorial text-[32px] font-semibold leading-[1.08] text-[#173126] sm:col-start-1 sm:row-span-2 sm:row-start-1 sm:text-[48px]">O formato certo é uma decisão médica.</h2>
              <p className="text-sm text-[#67736c] sm:col-start-2 sm:row-start-2 sm:max-w-[15rem] sm:text-right">Conheça as formas de consumo que o médico pode avaliar para o seu caso.</p>
            </div>
            <div className="click-horizontal -mx-4 mt-8 grid snap-x snap-mandatory grid-flow-col auto-cols-[84%] gap-3 overflow-x-auto px-4 pb-3 sm:mx-0 sm:mt-12 sm:auto-cols-[48%] sm:gap-5 sm:px-0 md:grid-flow-row md:grid-cols-3 md:overflow-visible md:pb-0">
              {[
                ['/produtos/oleo-v3.webp', 'Óleo', 'Uso sublingual e ajuste gradual conforme a prescrição.'],
                ['/produtos/jujuba-v3.webp', 'Jujuba', 'Uma opção prática e discreta para algumas rotinas.'],
                ['/produtos/softgel-v3.webp', 'Softgel', 'Dose padronizada em uma apresentação familiar.'],
              ].map(([src, title, copy], index) => <article key={title} className="group snap-center overflow-hidden rounded-[1.5rem] border border-[#173126]/10 bg-[#fffdf8] sm:rounded-[1.75rem]">
                <div className="relative aspect-square overflow-hidden bg-[#e5eadf]"><Image src={src} alt={`Apresentação em ${title.toLowerCase()}`} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition duration-700 group-hover:scale-105" /><span className="absolute left-5 top-5 flex size-9 items-center justify-center rounded-full bg-[#173d2a] text-xs font-black text-white">0{index + 1}</span></div>
                <div className="p-6"><h3 className="font-editorial text-2xl font-semibold">{title}</h3><p className="mt-2 text-sm leading-6 text-[#5d6e65]">{copy}</p></div>
              </article>)}
            </div>
          </div>
        </section>

        <section className="bg-white px-4 py-14 sm:px-8 sm:py-28">
          <div className="mx-auto grid max-w-[1180px] gap-8 sm:gap-12 lg:grid-cols-[.8fr_1.2fr] lg:gap-20">
            <div><span className="w-fit rounded-full bg-[#cde9d1] px-3 py-1 text-xs font-bold text-[#285e31]">Dúvidas</span><h2 className="mt-3 font-editorial text-[32px] font-semibold leading-[1.08] sm:mt-4 sm:text-[48px]">Antes de decidir, pergunte tudo.</h2><p className="mt-3 max-w-sm text-sm leading-6 text-[#5c6d63] sm:mt-4 sm:text-base sm:leading-7">A consulta existe para avaliar possibilidades, não para empurrar um tratamento.</p></div>
            <div>{FAQS.map(([q, a], index) => <details key={q} open={index === 0} className="group border-b border-[#173126]/12 py-5"><summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-bold text-[#173126] [&::-webkit-details-marker]:hidden">{q}<span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-[#173126]/15 text-lg transition group-open:rotate-45">+</span></summary><p className="max-w-2xl pb-2 pt-4 text-sm leading-7 text-[#607168]">{a}</p></details>)}</div>
          </div>
        </section>

      </main>

      <footer className="border-t border-[#173126]/10 bg-white px-4 pb-56 pt-10 text-[#173126] sm:px-8 sm:pb-56 sm:pt-12">
        <div className="mx-auto flex max-w-[1180px] flex-col gap-8 border-b border-[#173126]/10 pb-8 sm:flex-row sm:items-end sm:justify-between"><Logo /><p className="max-w-lg text-xs leading-6 text-[#68766e]">A Click Cannabis conecta pacientes a médicos prescritores e oferece suporte ao processo de importação. O tratamento depende de avaliação e prescrição médica individual.</p></div>
        <div className="mx-auto mt-6 flex max-w-[1180px] flex-col gap-2 text-[11px] text-[#7a867f] sm:flex-row sm:justify-between"><span>© Click Cannabis. Todos os direitos reservados.</span><span>Atendimento online em todo o Brasil.</span></div>
      </footer>

      <AnimatePresence>
        {stickyVisible && <motion.div initial={{ y: "110%", opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: "110%", opacity: 0 }} transition={{ duration: .35, ease: EASE }} className="pointer-events-none fixed inset-x-0 bottom-0 z-40 border-t border-[#173126]/10 bg-white/98 px-4 pb-[max(.9rem,env(safe-area-inset-bottom))] pt-3 shadow-[0_-12px_40px_rgba(23,49,38,.08)] backdrop-blur-xl">
          <div className="mx-auto w-full max-w-xl">
            <p className="mb-1.5 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[.1em] text-[#3d714b]"><span className="size-1.5 rounded-full bg-[#3d8f4a]" aria-hidden="true" />Agenda de hoje aberta <span className="font-semibold normal-case tracking-normal text-[#7b8780]">· horários sujeitos à disponibilidade</span></p>
            <p className="text-left text-[1.05rem] leading-snug text-[#263a2d] sm:text-[1.2rem]">Consulta com médico especialista de <span className="text-[#9ba39e] line-through">R$120,00</span> por apenas <span className="whitespace-nowrap font-extrabold text-[#285e31]">R$50,00</span></p>
            <div className="mt-2.5 flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#cfe3d3] bg-gradient-to-b from-white to-[#f5faf6] px-3 py-1.5 text-[10px] font-bold text-[#1f4f2a] shadow-[0_1px_2px_rgba(40,94,49,.06)] sm:text-xs"><span className="relative flex size-2 items-center justify-center" aria-hidden="true"><span className="absolute inset-0 animate-ping rounded-full bg-[#3d8f4a] opacity-70" /><span className="relative size-2 rounded-full bg-[#3d8f4a]" /></span>100% online</span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#cfe3d3] bg-gradient-to-b from-white to-[#f5faf6] px-3 py-1.5 text-[10px] font-bold text-[#1f4f2a] shadow-[0_1px_2px_rgba(40,94,49,.06)] sm:text-xs"><svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true"><circle cx="6" cy="5.5" r="2.4" stroke="currentColor" strokeWidth="1.4" /><path d="M1.6 13.4c.6-2.4 2.3-3.8 4.4-3.8s3.8 1.4 4.4 3.8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /><circle cx="11.5" cy="4.5" r="1.8" stroke="currentColor" strokeWidth="1.3" opacity=".55" /><path d="M10.4 9.8c1.6.2 2.9 1.4 3.4 3.1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" opacity=".55" /></svg>+50 mil pacientes</span>
            </div>
            <button onClick={openLead} className="click-cta-pulse pointer-events-auto mt-2.5 flex min-h-14 w-full items-center justify-center gap-2 rounded-xl bg-[#3d8f4a] px-5 text-base font-extrabold text-white shadow-[0_8px_24px_rgba(40,94,49,.3)] transition hover:brightness-105 active:scale-[.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3a7a4f] focus-visible:ring-offset-2">Agendar minha consulta <Arrow /></button>
          </div>
        </motion.div>}
      </AnimatePresence>

      <dialog ref={dialogRef} aria-labelledby="click-dialog-title" onClose={() => setDialogOpen(false)} onClick={(event) => { if (event.target === dialogRef.current) setDialogOpen(false); }} className="click-dialog w-[calc(100%-2.5rem)] max-w-[420px] overflow-hidden rounded-[1.5rem] border-0 bg-white p-0 shadow-2xl backdrop:bg-[#10261a]/65">
        <div className="max-h-[calc(100dvh-2rem)] overflow-y-auto p-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:p-6">
          <div className="flex items-center justify-between gap-3"><span className="inline-flex w-fit rounded-full bg-[#cde9d1] px-3 py-1 text-xs font-medium text-[#285e31]">Último passo</span><button onClick={() => setDialogOpen(false)} aria-label="Fechar" className="flex size-8 shrink-0 items-center justify-center rounded-full text-2xl font-light leading-none text-[#6f7d75] transition hover:bg-[#f1f5f2]">×</button></div>
          <h2 id="click-dialog-title" className="mt-4 whitespace-nowrap font-editorial text-[27px] font-semibold leading-none text-[#202a35] sm:text-[32px]">Como você se chama?</h2>
          <div className="mt-4 border-t border-[#e2e8e3] pt-4">
            <label htmlFor="click-name" className="block text-[15px] font-medium text-[#34443a]">Nome <span className="text-[#d33b32]">*</span></label>
            <input ref={nameRef} id="click-name" value={name} onChange={(event) => { setName(event.target.value); if (event.target.value.trim()) setNameError(false); }} onKeyDown={(event) => { if (event.key === "Enter") submitLead(); }} placeholder="Como você se chama?" className="mt-2 min-h-13 w-full rounded-2xl border border-[#d7e2d9] bg-white px-4 text-base outline-none transition focus:border-[#3e8f4a] focus:ring-4 focus:ring-[#3e8f4a]/10" />
          </div>
          {nameError && <p className="mt-2 text-sm font-bold text-[#b33d35]">Digite seu nome para continuar.</p>}
          <div className="mt-4 flex items-center gap-3 rounded-2xl border border-[#cfe3d3] bg-[#f7faf7] px-3 py-2.5 text-[#285e31]"><span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#e5f2e7]"><ObjectiveIcon name={selectedObjective.icon} /></span><div className="min-w-0"><p className="text-[11px] leading-tight text-[#718078]">Seu objetivo principal</p><p className="mt-0.5 text-sm font-extrabold leading-tight">{selectedObjective.label}</p></div></div>
          <button onClick={submitLead} className="mt-4 flex min-h-14 w-full items-center justify-center rounded-2xl bg-[#3d8f4a] px-6 text-base font-semibold text-white shadow-[0_8px_22px_rgba(40,94,49,.2)] transition hover:bg-[#337b40] active:scale-[.98]">Continuar pelo WhatsApp</button>
          <p className="mt-3 whitespace-nowrap text-center text-[10px] leading-4 text-[#78867e] sm:text-[11px]">Você será direcionado ao WhatsApp da Click Cannabis.</p>
          {relevantReviews.length > 0 && (
            <section className="mt-5 border-t border-[#e5eae6] pt-4" aria-label={`Depoimentos relacionados a ${selectedObjective.label}`}>
              <div className="flex items-center justify-between gap-3"><span className="inline-flex rounded-full bg-[#cde9d1] px-3 py-1 text-xs font-medium text-[#285e31]">Depoimentos</span><span className="text-[11px] text-[#7a867f]">Deslize para ler mais</span></div>
              <div className="click-dialog-reviews -mx-1 mt-3 flex snap-x snap-mandatory items-stretch gap-2 overflow-x-auto px-1 pb-2" role="region" aria-label="Carrossel de depoimentos relacionados">
                {relevantReviews.map((review) => (
                  <div key={review.name} className="w-[calc(100%-2rem)] shrink-0 snap-start sm:w-[calc(50%-0.25rem)]">
                    <InicioReviewCard review={review} compact />
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </dialog>

      <style>{`
        .click-page { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
        .click-page .font-geist { font-family: var(--font-geist-sans), system-ui, sans-serif; }
        .click-page .font-editorial { font-family: var(--font-click-display), var(--font-geist-sans), system-ui, sans-serif; letter-spacing:-.02em; }
        .click-page .eyebrow { display:inline-flex; align-items:center; gap:.55rem; font-size:.68rem; font-weight:800; letter-spacing:.16em; text-transform:uppercase; color:#3d714b; }
        .click-page .eyebrow::before { content:""; width:1.75rem; height:1px; background:currentColor; }
        .click-page .eyebrow-light { color:#d8f056; }
        .click-page .click-testimonials { scrollbar-width:none; }
        .click-page .click-testimonials::-webkit-scrollbar { display:none; }
        .click-page .click-horizontal { scrollbar-width:none; }
        .click-page .click-horizontal::-webkit-scrollbar { display:none; }
        .click-dialog-reviews { scrollbar-width:thin; scrollbar-color:#b8c5bc transparent; }
        .click-dialog-reviews::-webkit-scrollbar { height:3px; }
        .click-dialog-reviews::-webkit-scrollbar-thumb { background:#b8c5bc; border-radius:999px; }
        .click-dialog { position:fixed; inset:50% auto auto 50%; transform:translate(-50%,-50%); margin:0; }
        .click-dialog::backdrop { background:rgba(16,38,26,.65); backdrop-filter:blur(4px); }
        @keyframes clickCtaWave { 0% { box-shadow:0 0 0 0 rgba(61,143,74,.5); } 100% { box-shadow:0 0 0 16px rgba(61,143,74,0); } }
        .click-cta-pulse { position:relative; isolation:isolate; }
        .click-cta-pulse::after { content:""; position:absolute; inset:0; z-index:-1; border-radius:inherit; animation:clickCtaWave 1.8s cubic-bezier(.25,.8,.4,1) infinite; pointer-events:none; }
        @media (prefers-reduced-motion: reduce) { .click-page *, .click-page *::before, .click-page *::after { scroll-behavior:auto!important; animation-duration:.01ms!important; transition-duration:.01ms!important; } .click-cta-pulse::after { animation:none; } }
      `}</style>
    </div>
  );
}

function TreatmentStep({
  number,
  eyebrow,
  title,
  detailTitle,
  copy,
}: {
  number: string;
  eyebrow: string;
  title: string;
  detailTitle: string;
  copy: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const reduceMotion = useReducedMotion();

  return (
    <div className="h-[168px] w-full [perspective:1200px] sm:h-[190px]">
      <motion.button
        type="button"
        aria-pressed={expanded}
        aria-label={`Etapa ${Number(number)}: ${eyebrow} ${title}. ${expanded ? "Mostrar menos informações" : "Mostrar mais informações"}.`}
        onClick={() => setExpanded((current) => !current)}
        animate={{ rotateY: expanded ? 180 : 0 }}
        whileTap={reduceMotion ? undefined : { scale: 0.99 }}
        transition={reduceMotion ? { duration: 0 } : { type: "spring", bounce: 0, duration: 0.4 }}
        style={{ transformStyle: "preserve-3d" }}
        className="relative h-full w-full rounded-[1.5rem] text-left outline-none focus-visible:ring-2 focus-visible:ring-[#3e8f4a] focus-visible:ring-offset-2"
      >
        <span style={{ backfaceVisibility: "hidden" }} className="absolute inset-0 flex overflow-hidden rounded-[1.5rem] bg-[#e5f2e7] shadow-[0_1px_2px_rgba(23,27,24,.04)]">
          <span className="flex min-w-0 flex-1 flex-col justify-between p-5 sm:p-6">
            <span className="w-fit rounded-full bg-[#cde9d1] px-2.5 py-1 text-[10px] font-bold text-[#285e31] sm:text-xs">Etapa {Number(number)}</span>
            <span>
              <span className="block text-sm text-[#66746c]">{eyebrow}</span>
              <span className="block font-editorial text-[1.75rem] font-semibold leading-none text-[#285e31] sm:text-[2.1rem]">{title}</span>
              <span className="mt-2 flex items-center gap-1.5 text-xs font-bold text-[#3e8f4a] sm:text-sm"><span className="flex size-4 items-center justify-center rounded-full border border-current text-sm leading-none">+</span> Mais informações</span>
            </span>
          </span>
          <span className="flex w-[6.5rem] shrink-0 items-center justify-center border-l border-[#285e31]/10 bg-[#d9eddd] sm:w-[9rem]">
            <span className="font-editorial text-[3rem] font-semibold leading-none text-[#285e31]/35 sm:text-[4rem]">{number}</span>
          </span>
        </span>

        <span style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }} className="absolute inset-0 flex flex-col justify-between rounded-[1.5rem] bg-[#e5f2e7] p-5 shadow-[0_12px_30px_rgba(40,94,49,.12)] sm:p-6">
          <span>
            <span className="block font-editorial text-lg font-semibold text-[#285e31] sm:text-xl">{detailTitle}</span>
            <span className="mt-2 block max-w-2xl text-[13px] leading-5 text-[#43594a] sm:text-sm sm:leading-6">{copy}</span>
          </span>
          <span className="flex items-center gap-1.5 text-xs font-bold text-[#3e8f4a] sm:text-sm"><span className="flex size-4 items-center justify-center rounded-full border border-current text-sm leading-none">−</span> Menos informações</span>
        </span>
      </motion.button>
    </div>
  );
}

function Choice({ active, onClick, icon, children }: { active: boolean; onClick: () => void; icon: string; children: React.ReactNode }) {
  return <button type="button" role="radio" aria-checked={active} onClick={onClick} className={`group flex min-h-[74px] w-full items-center gap-3 rounded-2xl border px-3.5 py-3 text-left shadow-[0_1px_2px_rgba(23,27,24,.03)] transition duration-150 active:scale-[.985] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3a7a4f] focus-visible:ring-offset-2 sm:min-h-[78px] sm:px-4 ${active ? "border-[#3e8f4a] bg-[#f5faf6] text-[#285e31]" : "border-[#dce4de] bg-white text-[#405248] hover:border-[#8dbb96] hover:bg-[#fafcf9]"}`}><span className={`flex size-10 shrink-0 items-center justify-center rounded-xl transition-colors sm:size-11 ${active ? "bg-[#d9eddd] text-[#285e31]" : "bg-[#edf6ef] text-[#3d8f4a]"}`}><ObjectiveIcon name={icon} /></span>{children}<span className={`flex size-8 shrink-0 items-center justify-center rounded-full transition ${active ? "bg-white text-[#285e31]" : "bg-[#f1f7f2] text-[#3d714b] group-hover:translate-x-0.5"}`} aria-hidden="true">›</span></button>;
}
