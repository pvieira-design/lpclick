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
import Roleta, { PREMIOS, premioSalvo, type PremioId } from "./Roleta";

// Quiz de triagem: reproduz no site as perguntas que o atendimento faz hoje no
// WhatsApp (fluxo "NOVO PROCESSO V3") e entrega a pessoa no WhatsApp com a
// mensagem pronta. Três ramos: lead novo, paciente que não começou o
// tratamento e paciente em tratamento.

// Objetivo, nunca doença, na tela; a patologia só existe no payload do CRM.
const GOALS = [
  { id: "sono", label: "Dormir melhor", patologia: "Insônia" },
  { id: "relaxar", label: "Relaxar e ter menos ansiedade", patologia: "Ansiedade" },
  { id: "dores", label: "Aliviar dores", patologia: "Dores" },
  { id: "humor", label: "Melhorar meu humor", patologia: "Depressão" },
  { id: "foco", label: "Ter mais foco", patologia: "TDAH" },
] as const;

const TEMPOS = ["Menos de 6 meses", "De 6 meses a 1 ano", "De 1 a 3 anos", "Mais de 3 anos"];

type StepId =
  | "inicio"
  | "tratamento"
  | "ajuda-inicio"
  | "retorno"
  | "parabens"
  | "acao-paciente"
  | "para-quem"
  | "objetivo"
  | "tempo"
  | "acolhimento"
  | "como-funciona"
  | "custo"
  | "duvida"
  | "condicao"
  | "roleta"
  | "premio"
  | "nome";

// Total aproximado de telas por ramo, só pra barra de progresso.
const TOTAL_LEAD = 12;
const TOTAL_PACIENTE = 4;

type Respostas = {
  paciente?: boolean;
  paraQuem?: string;
  objetivos: string[];
  tempo?: string;
  querAgendar?: boolean;
  premio?: PremioId;
  // Fecho da mensagem dos ramos de paciente.
  pedido?: string;
};

const EASE: [number, number, number, number] = [0.23, 1, 0.32, 1];

function montarMensagem(nome: string, r: Respostas): string {
  if (r.paciente) return `Olá, me chamo ${nome}.\n\n${r.pedido}`;
  const patologias = GOALS.filter((g) => r.objetivos.includes(g.id)).map((g) => g.patologia);
  const linhas = [
    `Olá, me chamo ${nome}.`,
    "",
    "Patologias selecionadas:",
    ...patologias.map((p, i) => `${i + 1}. ${p}`),
    "",
    `Para: ${r.paraQuem === "familiar" ? "um familiar" : "mim"}`,
    `Há quanto tempo: ${r.tempo?.toLowerCase()}`,
    "",
    r.querAgendar ? "Já entendi como funciona e quero agendar minha consulta." : "Tenho uma dúvida antes de agendar minha consulta.",
  ];
  if (r.premio) linhas.push(PREMIOS[r.premio].mensagem);
  return linhas.join("\n");
}

export default function AvaliacaoClient() {
  const reduce = useReducedMotion();
  const [historico, setHistorico] = useState<StepId[]>(["inicio"]);
  const [r, setR] = useState<Respostas>({ objetivos: [] });
  const [nome, setNome] = useState("");
  const [erroNome, setErroNome] = useState(false);
  const [waUrl, setWaUrl] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const step = historico[historico.length - 1];

  useEffect(() => {
    sendGTMEvent({ event: "quizStep", category: "Quiz", action: "View", label: `Avaliacao - ${step}` });
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [step]);

  const ir = useCallback((proximo: StepId) => setHistorico((h) => [...h, proximo]), []);
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
          label: "Enviar no WhatsApp - Avaliacao",
          value: patologias.join(", "),
          premio: r.premio ?? "",
          leadData,
        },
        leadObservationId,
      );
    } else {
      sendGTMEvent({ event: "buttonClick", category: "Paciente", action: "Click", label: "Enviar no WhatsApp - Avaliacao paciente", value: r.pedido ?? "" });
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
            <Tela titulo={<>Seu cuidado começa <b>com um clique.</b></>} sub="Responda algumas perguntas rápidas e saia daqui com sua consulta encaminhada pelo WhatsApp." cena={["acena", "conversa"]}>
              <Pergunta texto="Você já fez consulta com a Click?" />
              <Opcoes
                opcoes={[
                  { label: "Sim, já fiz", onClick: () => responder({ paciente: true }, "tratamento") },
                  { label: "Não, ainda não", onClick: () => responder({ paciente: false }, "para-quem") },
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
            <Tela titulo={<>O que você <b>busca melhorar?</b></>} sub="Pode escolher mais de uma opção.">
              <div className="flex flex-col gap-2.5">
                {GOALS.map((g) => {
                  const on = r.objetivos.includes(g.id);
                  return (
                    <button
                      key={g.id}
                      type="button"
                      aria-pressed={on}
                      onClick={() =>
                        setR((prev) => ({
                          ...prev,
                          objetivos: on ? prev.objetivos.filter((x) => x !== g.id) : [...prev.objetivos, g.id],
                        }))
                      }
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
              </div>
              <Cta onClick={() => ir("tempo")} disabled={r.objetivos.length === 0}>Continuar</Cta>
            </Tela>
          )}

          {step === "tempo" && (
            <Tela titulo={<>Há quanto tempo você <b>convive com isso?</b></>}>
              <Opcoes opcoes={TEMPOS.map((t) => ({ label: t, onClick: () => responder({ tempo: t }, "acolhimento") }))} />
            </Tela>
          )}

          {step === "acolhimento" && (
            <Tela
              titulo={<>Obrigado por compartilhar. <b>Você não está sozinho.</b></>}
              sub="Muita gente chega até a gente depois de tentar resolver isso por conta própria. A Click já realizou mais de 150 mil consultas, e cada caso é avaliado com calma por um médico especialista."
              cena={["medita", "coracao"]}
            >
              <Cta onClick={() => ir("como-funciona")}>Ver como funciona</Cta>
            </Tela>
          )}

          {step === "como-funciona" && (
            <Tela titulo={<>Como funciona <b>na Click</b></>} cena={["medico", "calendario"]} compact>
              <ul className="flex flex-col gap-3">
                {[
                  "Consulta online com médico especialista, de segunda a domingo.",
                  "Se o médico indicar o tratamento, nossa equipe cuida da autorização e da documentação, sem custo adicional.",
                  "O medicamento é enviado direto para a sua casa.",
                  "Acompanhamento do início ao fim, com consulta de retorno.",
                ].map((t) => (
                  <li key={t} className="flex gap-3 text-[15px] leading-snug" style={{ color: "var(--ink)" }}>
                    <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full" style={{ background: "var(--green-500)" }} aria-hidden="true">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5 9-10" /></svg>
                    </span>
                    {t}
                  </li>
                ))}
              </ul>
              <Cta onClick={() => ir("custo")}>Continuar</Cta>
            </Tela>
          )}

          {step === "custo" && (
            <Tela titulo={<>Quanto custa <b>a consulta?</b></>} cena={["acena", "celular"]} compact>
              <div className="rounded-2xl border bg-white p-5" style={{ borderColor: "var(--line)" }}>
                <p className="text-sm font-semibold uppercase tracking-wide" style={{ color: "var(--muted)" }}>Consulta online</p>
                <p className="font-display mt-1 text-4xl font-bold" style={{ color: "var(--green-700)" }}>R$50</p>
                <p className="mt-2 text-[15px] leading-snug" style={{ color: "var(--ink)" }}>
                  Com médico especialista e receita inclusa, se o médico indicar o tratamento. Você escolhe o horário depois do pagamento.
                </p>
              </div>
              <Cta onClick={() => ir("duvida")}>Continuar</Cta>
            </Tela>
          )}

          {step === "duvida" && (
            <Tela titulo={<>Ficou alguma dúvida <b>antes de agendar?</b></>}>
              <Opcoes
                opcoes={[
                  { label: "Não, quero agendar minha consulta", onClick: () => responder({ querAgendar: true }, "condicao") },
                  { label: "Sim, quero tirar uma dúvida", onClick: () => responder({ querAgendar: false }, "condicao") },
                ]}
              />
            </Tela>
          )}

          {step === "condicao" && (
            <Tela titulo={<>Quer garantir uma <b>condição especial</b> na sua consulta?</>} sub="Gire a Roleta Click e descubra o seu benefício." cena={["comemora", "presente"]}>
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
              <Roleta onResultado={(p) => { setR((prev) => ({ ...prev, premio: p })); ir("premio"); }} />
            </Tela>
          )}

          {step === "premio" && r.premio && (
            <Tela titulo={<>Parabéns! Você ganhou <b>{PREMIOS[r.premio].titulo}.</b></>} sub={PREMIOS[r.premio].desc} cena={["comemora", "presente"]}>
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
            <Tela titulo={<>Falta pouco! <b>Como você se chama?</b></>}>
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
        <br />O uso de cannabis requer avaliação e prescrição médica.
      </footer>
    </div>
  );
}

function Tela({
  titulo,
  sub,
  cena,
  compact,
  children,
}: {
  titulo: React.ReactNode;
  sub?: string;
  cena?: [Pose, Prop];
  compact?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-5">
      <div>
        <h1 className="titulo font-display text-[1.75rem] leading-[1.15] sm:text-[2rem]">{titulo}</h1>
        {sub && <p className="mt-3 text-[15px] leading-relaxed" style={{ color: "var(--muted)" }}>{sub}</p>}
      </div>
      {cena && <Cena pose={cena[0]} prop={cena[1]} compact={compact} />}
      {children}
    </section>
  );
}

function Pergunta({ texto }: { texto: string }) {
  return <p className="font-display text-lg font-semibold" style={{ color: "var(--ink)" }}>{texto}</p>;
}

function Opcoes({ opcoes }: { opcoes: { label: string; onClick: () => void }[] }) {
  return (
    <div className="flex flex-col gap-2.5">
      {opcoes.map((o) => (
        <button key={o.label} type="button" onClick={o.onClick} className="opcao flex items-center justify-between">
          <span>{o.label}</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ color: "var(--green-500)" }}><path d="M9 6l6 6-6 6" /></svg>
        </button>
      ))}
    </div>
  );
}

function Cta({ onClick, disabled, children }: { onClick: () => void; disabled?: boolean; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick} disabled={disabled} className="btn-cta mt-1 w-full disabled:cursor-not-allowed disabled:opacity-40">
      {children}
    </button>
  );
}
