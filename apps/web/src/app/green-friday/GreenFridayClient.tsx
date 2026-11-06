"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { sendGTMEvent } from "@next/third-parties/google";
import { sendLeadToCrm } from "@/lib/crmLead";
import {
  captureLeadObservation,
  sendCorrelatedLeadEvent,
  withLeadObservation,
} from "@/lib/lead-observation";
import { buildWhatsAppUrl, collectLeadData, sendLeadToApi } from "./lead";
import { Cena, SimboloClick, type Pose, type Prop } from "./Ilustra";
import { tocarToque } from "./som";
import Roleta, { PREMIOS, premioSalvo, type PremioId } from "./Roleta";
import type { Depoimento, GoalId } from "./testimonialSelection";

// Green Friday da Click: cópia do quiz da /avaliacao com a primeira dobra
// anunciando a condição especial (sorteada na roleta) e um cronômetro que
// zera todo dia à meia-noite de Brasília, pra dar prazo à oferta.

// Objetivo, nunca doença, na tela; a patologia só existe no payload do CRM.
const GOALS = [
  { id: "sono", label: "Dormir melhor", patologia: "Insônia" },
  { id: "relaxar", label: "Relaxar e ter menos ansiedade", patologia: "Ansiedade" },
  { id: "dores", label: "Aliviar dores", patologia: "Dores" },
  { id: "humor", label: "Melhorar meu humor", patologia: "Depressão" },
  { id: "foco", label: "Ter mais foco", patologia: "TDAH" },
] as const;

const TEMPOS = ["Menos de 6 meses", "De 6 meses a 1 ano", "De 1 a 3 anos", "Mais de 3 anos", "Não sei ao certo"];

type StepId =
  | "inicio"
  | "tratamento"
  | "ajuda-inicio"
  | "retorno"
  | "parabens"
  | "acao-paciente"
  | "para-quem"
  | "objetivo"
  | "prova"
  | "tempo"
  | "contato"
  | "acolhimento"
  | "como-funciona"
  | "duvida"
  | "condicao"
  | "roleta"
  | "premio"
  | "nome";

// Total aproximado de telas por ramo, só pra barra de progresso.
const TOTAL_LEAD = 13;
const TOTAL_PACIENTE = 4;

type Respostas = {
  paciente?: boolean;
  paraQuem?: string;
  objetivos: string[];
  // Texto livre do "Outro"; vai só na mensagem, não no CRM.
  outro?: string;
  tempo?: string;
  jaUsou?: boolean;
  querAgendar?: boolean;
  premio?: PremioId;
  // Fecho da mensagem dos ramos de paciente.
  pedido?: string;
};

const ACOLHIMENTO_MS = 5000;

const EASE: [number, number, number, number] = [0.23, 1, 0.32, 1];

function montarMensagem(nome: string, r: Respostas): string {
  if (r.paciente) return `Olá, me chamo ${nome}.\n\n${r.pedido}`;
  const objetivos = GOALS.filter((g) => r.objetivos.includes(g.id)).map((g) => g.label);
  const linhas = [
    `Olá, me chamo ${nome}.`,
    "",
    "Eu busco:",
    ...[...objetivos, ...(r.outro?.trim() ? [r.outro.trim()] : [])].map((p, i) => `${i + 1}. ${p}`),
    "",
    `Consulta para: ${r.paraQuem === "familiar" ? "Outra pessoa" : "Mim"}`,
    `Há quanto tempo: ${r.tempo?.toLowerCase()}`,
    `Já teve contato com CBD/cannabis: ${r.jaUsou ? "Sim" : "Não"}`,
    "",
    r.querAgendar ? "Já entendi como funciona e quero agendar minha consulta." : "Tenho uma dúvida antes de agendar minha consulta.",
  ];
  if (r.premio) linhas.push(PREMIOS[r.premio].mensagem);
  return linhas.join("\n");
}

export default function GreenFridayClient({ depoimentos }: { depoimentos: Record<GoalId, Depoimento[]> }) {
  const reduce = useReducedMotion();
  const [historico, setHistorico] = useState<StepId[]>(["inicio"]);
  const [r, setR] = useState<Respostas>({ objetivos: [] });
  const [nome, setNome] = useState("");
  const [erroNome, setErroNome] = useState(false);
  const [waUrl, setWaUrl] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const step = historico[historico.length - 1];

  useEffect(() => {
    sendGTMEvent({ event: "quizStep", category: "Quiz", action: "View", label: `Green Friday - ${step}` });
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [step]);

  const ir = useCallback((proximo: StepId) => setHistorico((h) => [...h, proximo]), []);
  // Troca o passo atual em vez de empilhar: voltar do prêmio não reabre a roleta.
  const trocarPor = useCallback((proximo: StepId) => setHistorico((h) => [...h.slice(0, -1), proximo]), []);
  // O acolhimento passa sozinho; trocarPor tira ele do histórico, então voltar não cai nele de novo.
  useEffect(() => {
    if (step !== "acolhimento") return;
    const t = setTimeout(() => trocarPor("como-funciona"), ACOLHIMENTO_MS);
    return () => clearTimeout(t);
  }, [step, trocarPor]);
  const voltar = useCallback(() => setHistorico((h) => (h.length > 1 ? h.slice(0, -1) : h)), []);
  const responder = useCallback(
    (patch: Partial<Respostas>, proximo: StepId) => {
      setR((prev) => ({ ...prev, ...patch }));
      ir(proximo);
    },
    [ir],
  );

  useEffect(() => {
    if (step !== "nome") return;
    const id = setTimeout(() => inputRef.current?.focus({ preventScroll: true }), reduce ? 0 : 300);
    return () => clearTimeout(id);
  }, [step, reduce]);

  const irParaCondicao = useCallback(() => {
    // Quem já girou antes não gira de novo: vai direto pro prêmio salvo.
    const salvo = premioSalvo();
    if (salvo) {
      setR((prev) => ({ ...prev, premio: salvo }));
      ir("premio");
    } else ir("roleta");
  }, [ir]);

  const enviar = useCallback(() => {
    const trimmed = nome.trim();
    if (!trimmed) {
      setErroNome(true);
      inputRef.current?.focus();
      return;
    }
    const texto = montarMensagem(trimmed, r);
    const url = buildWhatsAppUrl(texto);

    if (!r.paciente) {
      const patologias = GOALS.filter((g) => r.objetivos.includes(g.id)).map((g) => g.patologia);
      const leadData = collectLeadData(trimmed, patologias);
      const leadObservationId = captureLeadObservation();
      sendLeadToApi(withLeadObservation(leadData, leadObservationId));
      sendLeadToCrm(trimmed, patologias);
      sendCorrelatedLeadEvent(
        {
          event: "buttonWhatsappClicked",
          category: "Lead",
          action: "Click",
          label: "Enviar no WhatsApp - Green Friday",
          value: patologias.join(", "),
          premio: r.premio ?? "",
          leadData,
        },
        leadObservationId,
      );
    } else {
      sendGTMEvent({ event: "buttonClick", category: "Paciente", action: "Click", label: "Enviar no WhatsApp - Green Friday paciente", value: r.pedido ?? "" });
    }

    setWaUrl(url);
    window.open(url, "_blank", "noopener,noreferrer");
  }, [nome, r]);

  const total = r.paciente ? TOTAL_PACIENTE : TOTAL_LEAD;
  const progresso = step === "inicio" ? 0.04 : Math.min(1, (historico.length - 1) / total);

  return (
    <div className="mx-auto flex min-h-svh w-full max-w-lg flex-col px-5 pb-8 pt-5">
      <header className="mb-5 flex items-center gap-3">
        <button
          type="button"
          onClick={voltar}
          aria-label="Voltar"
          className={`flex size-10 items-center justify-center rounded-full transition-opacity ${historico.length > 1 ? "opacity-100" : "pointer-events-none opacity-0"}`}
          style={{ color: "var(--green-900)" }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 18l-6-6 6-6" /></svg>
        </button>
        <div className="h-2 flex-1 overflow-hidden rounded-full" style={{ background: "#D5E3CC" }} role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progresso * 100)} aria-label="Progresso">
          <motion.div className="h-full rounded-full" style={{ background: "var(--green-700)" }} animate={{ width: `${progresso * 100}%` }} transition={{ duration: 0.4, ease: EASE }} />
        </div>
        <SimboloClick size={30} />
      </header>

      <AnimatePresence mode="wait" initial={false}>
        <motion.main
          key={step}
          className="flex flex-1 flex-col"
          initial={{ opacity: 0, x: reduce ? 0 : 24 }}
          animate={{ opacity: 1, x: 0, transition: { duration: 0.3, ease: EASE } }}
          exit={{ opacity: 0, x: reduce ? 0 : -24, transition: { duration: 0.18, ease: EASE } }}
        >
          {step === "inicio" && (
            <Tela titulo={<>Ganhe uma <b>condição especial</b> na sua consulta.</>} sub="Responda algumas perguntas rápidas e gire a roleta pra liberar o seu benefício." topo={<SeloGreenFriday />}>
              <Cronometro />
              <p className="-mt-2 flex items-center gap-2 text-sm" style={{ color: "var(--muted)" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
                Leva menos de 1 minuto
              </p>
              <Pergunta texto="Como podemos te ajudar?" />
              <Opcoes
                opcoes={[
                  { label: "Quero agendar a 1ª consulta", onClick: () => responder({ paciente: false }, "para-quem") },
                  { label: "Já fiz uma consulta", onClick: () => responder({ paciente: true }, "tratamento") },
                ]}
              />
            </Tela>
          )}

          {/* ===== Ramo paciente ===== */}
          {step === "tratamento" && (
            <Tela titulo={<>Que bom ter você de volta! Você já <b>começou o tratamento?</b></>}>
              <Opcoes
                opcoes={[
                  { label: "Sim, já comecei", onClick: () => ir("retorno") },
                  { label: "Ainda não", onClick: () => ir("ajuda-inicio") },
                ]}
              />
            </Tela>
          )}

          {step === "ajuda-inicio" && (
            <Tela titulo={<>Como a gente pode <b>te ajudar?</b></>}>
              <Opcoes
                opcoes={[
                  { label: "Quero começar meu tratamento", onClick: () => responder({ pedido: "Já passei em consulta e quero ajuda para iniciar meu tratamento." }, "nome") },
                  { label: "Ainda tenho dúvidas", onClick: () => responder({ pedido: "Já passei em consulta e quero tirar uma dúvida antes de iniciar meu tratamento." }, "nome") },
                ]}
              />
            </Tela>
          )}

          {step === "retorno" && (
            <Tela titulo={<>Você já fez sua <b>consulta de retorno?</b></>}>
              <Opcoes
                opcoes={[
                  { label: "Sim, já fiz", onClick: () => ir("acao-paciente") },
                  { label: "Ainda não", onClick: () => responder({ pedido: "Já sou paciente da Click e quero agendar minha primeira consulta de retorno grátis." }, "parabens") },
                ]}
              />
            </Tela>
          )}

          {step === "parabens" && (
            <Tela titulo={<>Parabéns! Sua consulta de retorno é <b>por nossa conta.</b></>} sub="Ela já está garantida pra você. Envie a mensagem que vai aparecer no WhatsApp e agende em poucos minutos." cena={["comemora", "presente"]}>
              <Cta onClick={() => ir("nome")}>Agendar meu retorno grátis</Cta>
            </Tela>
          )}

          {step === "acao-paciente" && (
            <Tela titulo={<>O que você <b>gostaria de fazer?</b></>}>
              <Opcoes
                opcoes={[
                  { label: "Agendar uma nova consulta de retorno", onClick: () => responder({ pedido: "Já sou paciente da Click e quero agendar uma nova consulta de retorno." }, "nome") },
                  { label: "Tirar uma dúvida com um médico especialista", onClick: () => responder({ pedido: "Já sou paciente da Click e quero tirar uma dúvida com um médico especialista." }, "nome") },
                ]}
              />
            </Tela>
          )}

          {/* ===== Ramo lead novo ===== */}
          {step === "para-quem" && (
            <Tela titulo={<>A consulta é <b>para você</b> ou para alguém da família?</>}>
              <Opcoes
                opcoes={[
                  { label: "Para mim", onClick: () => responder({ paraQuem: "mim" }, "objetivo") },
                  { label: "Para um familiar", onClick: () => responder({ paraQuem: "familiar" }, "objetivo") },
                ]}
              />
            </Tela>
          )}

          {step === "objetivo" && (
            <Tela titulo={<>O que {r.paraQuem === "familiar" ? "ele/ela" : "você"} <b>busca melhorar?</b></>} sub="Pode escolher mais de uma opção.">
              <div className="flex flex-col gap-2.5">
                {GOALS.map((g) => {
                  const on = r.objetivos.includes(g.id);
                  return (
                    <button
                      key={g.id}
                      type="button"
                      aria-pressed={on}
                      onClick={() => {
                        tocarToque();
                        setR((prev) => ({
                          ...prev,
                          objetivos: on ? prev.objetivos.filter((x) => x !== g.id) : [...prev.objetivos, g.id],
                        }));
                      }}
                      className="opcao flex items-center justify-between"
                      data-on={on}
                    >
                      <span>{g.label}</span>
                      <span className="check" aria-hidden="true">
                        {on && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5 9-10" /></svg>}
                      </span>
                    </button>
                  );
                })}
                <button
                  type="button"
                  aria-pressed={r.outro !== undefined}
                  onClick={() => { tocarToque(); setR((prev) => ({ ...prev, outro: prev.outro === undefined ? "" : undefined })); }}
                  className="opcao flex items-center justify-between"
                  data-on={r.outro !== undefined}
                >
                  <span>Outro objetivo</span>
                  <span className="check" aria-hidden="true">
                    {r.outro !== undefined && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5 9-10" /></svg>}
                  </span>
                </button>
                {r.outro !== undefined && (
                  <>
                    <label htmlFor="avaliacao-outro" className="sr-only">Qual outro objetivo?</label>
                    <input
                      id="avaliacao-outro"
                      type="text"
                      autoFocus
                      maxLength={120}
                      placeholder="Conte o que você busca melhorar"
                      value={r.outro}
                      onChange={(e) => setR((prev) => ({ ...prev, outro: e.target.value }))}
                      className="w-full rounded-2xl border-2 bg-white px-4 py-3.5 text-base outline-none transition-colors focus:border-[var(--green-500)]"
                      style={{ borderColor: "var(--line)", color: "var(--ink)" }}
                    />
                  </>
                )}
              </div>
              <Cta onClick={() => ir("prova")} disabled={r.objetivos.length === 0 && !r.outro?.trim()}>Continuar</Cta>
            </Tela>
          )}

          {step === "prova" && (
            <Tela titulo={<span className="block whitespace-nowrap text-[clamp(1.125rem,5.6vw,1.5rem)]">Quem já fez, <b>recomenda.</b></span>}>
              <div className="flex items-center rounded-2xl border bg-white px-2 py-4 text-center" style={{ borderColor: "var(--line)" }}>
                {[
                  ["+150 mil", "consultas realizadas"],
                  ["+1 milhão", "de seguidores no Instagram"],
                ].map(([n, t], i) => (
                  <div key={n} className={`flex-1 px-2 ${i ? "border-l" : ""}`} style={{ borderColor: "var(--line)" }}>
                    <p className="font-display whitespace-nowrap text-[clamp(1.375rem,6.6vw,1.875rem)] font-bold" style={{ color: "var(--green-700)" }}>{n}</p>
                    <p className="mt-0.5 text-[13px] leading-snug" style={{ color: "var(--ink)" }}>{t}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-2.5">
                {depoimentos[(r.objetivos[0] ?? "sono") as GoalId].map((d) => (
                  <figure key={d.nome + d.iniciais} className="rounded-2xl border bg-white p-4" style={{ borderColor: "var(--line)" }}>
                    <div className="flex items-center gap-3">
                      <span className="font-display flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-bold" style={{ background: "var(--green-100)", color: "var(--green-700)" }} aria-hidden="true">
                        {d.iniciais}
                      </span>
                      <figcaption className="text-sm font-semibold" style={{ color: "var(--ink)" }}>{d.nome}</figcaption>
                      <span className="ml-auto text-sm tracking-tight" style={{ color: "#E8A317" }} aria-label="5 estrelas">★★★★★</span>
                    </div>
                    <blockquote className="mt-2.5 text-[15px] leading-snug" style={{ color: "var(--ink)" }}>“{d.texto}”</blockquote>
                  </figure>
                ))}
              </div>
              <Cta onClick={() => ir("tempo")}>Continuar</Cta>
              <div className="mt-3 flex items-center justify-center gap-5">
                <div className="flex items-center gap-2">
                  <GoogleIcon />
                  <div className="leading-tight">
                    <p className="flex items-center gap-1 text-sm font-bold" style={{ color: "var(--ink)" }}>
                      4,9 <span className="text-[13px] tracking-tight" style={{ color: "#E8A317" }} aria-hidden="true">★★★★★</span>
                    </p>
                    <p className="text-[11px]" style={{ color: "var(--muted)" }}>nota no Google</p>
                  </div>
                </div>
                <span className="h-8 w-px" style={{ background: "var(--line)" }} aria-hidden="true" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/2.webp" alt="Certificado RA1000 do Reclame Aqui" width={96} height={47} loading="lazy" decoding="async" style={{ mixBlendMode: "multiply" }} />
              </div>
            </Tela>
          )}

          {step === "tempo" && (
            <Tela titulo={<>Há quanto tempo {r.paraQuem === "familiar" ? "ele/ela" : "você"} <b>convive com isso?</b></>}>
              <Opcoes opcoes={TEMPOS.map((t) => ({ label: t, onClick: () => responder({ tempo: t }, "contato") }))} />
            </Tela>
          )}

          {step === "contato" && (
            <Tela titulo={<>{r.paraQuem === "familiar" ? "A pessoa" : "Você"} já teve contato com <b>CBD ou algum tratamento à base de cannabis?</b></>}>
              <Opcoes
                opcoes={[
                  { label: "Sim", onClick: () => responder({ jaUsou: true }, "acolhimento") },
                  { label: "Não", onClick: () => responder({ jaUsou: false }, "acolhimento") },
                ]}
              />
            </Tela>
          )}

          {step === "acolhimento" && (
            <Tela
              titulo={
                <span className="block whitespace-nowrap text-[clamp(1.125rem,5.6vw,1.5rem)]">
                  Obrigado por compartilhar.
                  <br />
                  <b>Você não está sozinho.</b>
                </span>
              }
              sub="Muita gente chega até a gente depois de tentar resolver isso por conta própria. Aqui, cada caso é avaliado com calma por um médico especialista."
              cena={["medita", "coracao"]}
            >
              <div className="h-1.5 overflow-hidden rounded-full" style={{ background: "#D5E3CC" }} aria-hidden="true">
                <motion.div className="h-full rounded-full" style={{ background: "var(--green-500)" }} initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: ACOLHIMENTO_MS / 1000, ease: "linear" }} />
              </div>
            </Tela>
          )}

          {step === "como-funciona" && (
            <Tela titulo={<>Como funciona <b>na Click</b></>}>
              <ol className="flex flex-col gap-2.5">
                {[
                  <>Você agenda sua consulta no WhatsApp com a equipe da Click.</>,
                  <>Consulta online com médico especialista por <b style={{ color: "var(--green-700)" }}>apenas R$50.</b></>,
                  <>Orientação na autorização e documentação, sem custo extra.</>,
                  <>O medicamento chega na sua casa, em qualquer lugar do Brasil.</>,
                  <>Acompanhamento do início ao fim, com consulta de retorno.</>,
                ].map((t, i) => (
                  <li key={i} className="flex items-center gap-3 rounded-2xl border bg-white px-3.5 py-3 text-[clamp(13px,3.9vw,15px)] leading-snug" style={{ borderColor: "var(--line)", color: "var(--ink)" }}>
                    <span className="font-display flex size-7 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white" style={{ background: "var(--green-500)" }} aria-hidden="true">
                      {i + 1}
                    </span>
                    <span>{t}</span>
                  </li>
                ))}
              </ol>
              <Cta onClick={() => ir("duvida")} fixo>Continuar</Cta>
            </Tela>
          )}

          {step === "duvida" && (
            <Tela titulo={<>Ficou alguma dúvida <b>antes de agendar?</b></>}>
              <Opcoes
                opcoes={[
                  { label: "Quero agendar minha consulta", onClick: () => responder({ querAgendar: true }, "condicao") },
                  { label: "Ainda quero tirar uma dúvida", onClick: () => responder({ querAgendar: false }, "condicao") },
                ]}
              />
            </Tela>
          )}

          {step === "condicao" && (
            <Tela titulo={<>Quer garantir sua <b>condição especial de Green Friday?</b></>} sub="Gire a roleta e descubra o seu benefício." cena={["comemora", "presente"]}>
              <Opcoes
                opcoes={[
                  { label: "Sim, quero garantir", onClick: irParaCondicao },
                  { label: "Não, obrigado", onClick: () => { setR((prev) => ({ ...prev, premio: undefined })); ir("nome"); } },
                ]}
              />
            </Tela>
          )}

          {step === "roleta" && (
            <Tela titulo={<>Gire e <b>descubra seu benefício</b></>}>
              <Roleta onResultado={(p) => { setR((prev) => ({ ...prev, premio: p })); trocarPor("premio"); }} />
            </Tela>
          )}

          {step === "premio" && r.premio && (
            <Tela titulo={<span className="block text-[clamp(1.375rem,6.6vw,1.75rem)]">Parabéns! Você ganhou <b>{PREMIOS[r.premio].titulo}.</b></span>} sub={PREMIOS[r.premio].desc} cena={["comemora", "presente"]}>
              {r.premio === "cashback" && (
                <div className="rounded-2xl border-2 border-dashed bg-white p-4 text-center" style={{ borderColor: "var(--green-500)" }}>
                  <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--muted)" }}>Seu cupom</p>
                  <p className="font-display text-2xl font-bold tracking-widest" style={{ color: "var(--green-700)" }}>CASHBACK</p>
                </div>
              )}
              <Cta onClick={() => ir("nome")}>Garantir meu benefício</Cta>
            </Tela>
          )}

          {step === "nome" && (
            <Tela titulo={<>Falta pouco! <b>Como você se chama?</b></>} sub="Pra nossa equipe já te chamar pelo nome no WhatsApp.">
              <label htmlFor="avaliacao-nome" className="sr-only">Seu nome</label>
              <input
                ref={inputRef}
                id="avaliacao-nome"
                type="text"
                autoComplete="given-name"
                placeholder="Digite seu nome"
                value={nome}
                onChange={(e) => { setNome(e.target.value); if (erroNome) setErroNome(false); }}
                onKeyDown={(e) => { if (e.key === "Enter") enviar(); }}
                aria-invalid={erroNome}
                aria-describedby={erroNome ? "avaliacao-nome-erro" : undefined}
                className="w-full rounded-2xl border-2 bg-white px-4 py-4 text-base outline-none transition-colors focus:border-[var(--green-500)]"
                style={{ borderColor: erroNome ? "#C2412D" : "var(--line)", color: "var(--ink)" }}
              />
              {erroNome && <p id="avaliacao-nome-erro" className="-mt-2 text-sm" style={{ color: "#C2412D" }}>Digite seu nome para continuar.</p>}
              <div className="flex gap-3 rounded-2xl p-4" style={{ background: "var(--green-100)" }}>
                <svg className="mt-0.5 shrink-0" width="22" height="22" viewBox="0 0 24 24" fill="var(--green-700)" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2c-1.5 0-3-.4-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2z" /></svg>
                <p className="text-[15px] leading-snug" style={{ color: "var(--ink)" }}>
                  Você vai ser encaminhado para o nosso WhatsApp com uma mensagem pronta com as suas respostas. <b>É só enviar</b>
                  {r.paciente ? " que a nossa equipe te responde." : " para agendar sua consulta em menos de 10 minutos."}
                </p>
              </div>
              <Cta onClick={enviar}>{r.paciente ? "Ir para o WhatsApp" : "Enviar e agendar minha consulta"}</Cta>
              {waUrl && (
                <p className="text-center text-sm" style={{ color: "var(--muted)" }}>
                  O WhatsApp não abriu?{" "}
                  <a href={waUrl} target="_blank" rel="noopener noreferrer" className="font-semibold underline" style={{ color: "var(--green-700)" }}>
                    Toque aqui
                  </a>
                </p>
              )}
            </Tela>
          )}
        </motion.main>
      </AnimatePresence>

      <footer className="mt-8 text-center text-[11px] leading-relaxed" style={{ color: "var(--muted)" }}>
        Click Cannabis · A maior plataforma de telemedicina canábica do Brasil
      </footer>
    </div>
  );
}

function Tela({
  titulo,
  sub,
  cena,
  topo,
  children,
}: {
  titulo: React.ReactNode;
  sub?: string;
  cena?: [Pose, Prop];
  topo?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-5">
      <div>
        {topo}
        <h1 className="titulo font-display text-[1.75rem] leading-[1.15] sm:text-[2rem]">{titulo}</h1>
        {sub && <p className="mt-3 text-[15px] leading-relaxed" style={{ color: "var(--muted)" }}>{sub}</p>}
      </div>
      {cena && <Cena pose={cena[0]} prop={cena[1]} />}
      {children}
    </section>
  );
}

function SeloGreenFriday() {
  return (
    <span className="mb-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-display text-[13px] font-bold uppercase tracking-wide text-white" style={{ background: "var(--green-900)" }}>
      <span aria-hidden="true" className="h-2 w-2 rounded-full" style={{ background: "#7BE08F" }} />
      Green Friday Click
    </span>
  );
}

// Brasília é UTC-3 o ano todo (sem horário de verão desde 2019).
const BRT = 3 * 3600_000;
const DIA = 86_400_000;
const restanteHoje = () => DIA - ((Date.now() - BRT) % DIA);

function Cronometro() {
  // Só calcula no cliente, pra não divergir do HTML do servidor.
  const [ms, setMs] = useState<number | null>(null);
  useEffect(() => {
    setMs(restanteHoje());
    const t = setInterval(() => setMs(restanteHoje()), 1000);
    return () => clearInterval(t);
  }, []);
  const partes = ms === null ? ["--", "--", "--"] : [ms / 3600_000, (ms / 60_000) % 60, (ms / 1000) % 60].map((n) => String(Math.floor(n)).padStart(2, "0"));
  return (
    <div className="-mt-1 flex items-center justify-between gap-3 rounded-2xl px-4 py-3" style={{ background: "var(--green-900)" }}>
      <p className="text-sm font-medium leading-tight text-white">A condição de hoje<br />termina em</p>
      <div className="flex items-center gap-1 font-display tabular-nums text-white" role="timer" aria-label="Tempo restante da condição de hoje">
        {partes.map((p, i) => (
          <span key={i} className="flex items-center gap-1">
            {i > 0 && <span className="text-lg font-bold opacity-70">:</span>}
            <span className="flex flex-col items-center">
              <span className="min-w-[2.4rem] rounded-lg bg-white/15 px-1.5 py-1 text-center text-xl font-bold">{p}</span>
              <span className="mt-0.5 text-[10px] uppercase opacity-70">{["horas", "min", "seg"][i]}</span>
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  );
}

function Pergunta({ texto }: { texto: string }) {
  return <p className="font-display text-lg font-semibold" style={{ color: "var(--ink)" }}>{texto}</p>;
}

function Opcoes({ opcoes }: { opcoes: { label: string; onClick: () => void }[] }) {
  return (
    <div className="flex flex-col gap-2.5">
      {opcoes.map((o) => (
        <button key={o.label} type="button" onClick={() => { tocarToque(); o.onClick(); }} className="opcao flex items-center justify-between">
          <span>{o.label}</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ color: "var(--green-500)" }}><path d="M9 6l6 6-6 6" /></svg>
        </button>
      ))}
    </div>
  );
}

// fixo: gruda no rodapé enquanto a tela for maior que o celular.
function Cta({ onClick, disabled, fixo, children }: { onClick: () => void; disabled?: boolean; fixo?: boolean; children: React.ReactNode }) {
  return (
    <button type="button" onClick={() => { tocarToque(); onClick(); }} disabled={disabled} className={`btn-cta mt-1 w-full disabled:cursor-not-allowed disabled:opacity-40 ${fixo ? "sticky bottom-4 z-10" : ""}`}>
      {children}
    </button>
  );
}
