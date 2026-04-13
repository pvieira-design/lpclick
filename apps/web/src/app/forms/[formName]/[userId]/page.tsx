"use client";

import { use, useState, useCallback, useRef, useEffect } from "react";
import { upload } from "@vercel/blob/client";

/* ─────────────────────────────────────────────
   Types
   ───────────────────────────────────────────── */

type FieldType = "text" | "email" | "tel" | "textarea" | "multiselect" | "select" | "checkbox" | "video";

interface FieldOption {
  value: string;
  label: string;
  description?: string;
}

interface FormField {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: FieldOption[];
  termsUrl?: string;
  minDurationSec?: number;
  maxSizeMb?: number;
}

type ContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "highlight"; text: string }
  | { type: "prizes"; items: { rank: string; title: string; desc: string }[] }
  | { type: "list"; title?: string; items: string[]; ordered?: boolean }
  | { type: "tips"; items: string[] }
  | { type: "deadline"; text: string };

interface FormStep {
  title: string;
  subtitle?: string;
  fields: FormField[];
  content?: ContentBlock[];
}

interface FormConfig {
  name: string;
  steps: FormStep[];
  completionTitle?: string;
  completionSubtitle?: string;
}

/* ─────────────────────────────────────────────
   Demo Form Config
   ───────────────────────────────────────────── */

const DEMO_FORM: FormConfig = {
  name: "Formulário de Teste",
  steps: [
    {
      title: "Informações pessoais",
      subtitle: "Precisamos de alguns dados básicos para começar.",
      fields: [
        { id: "nome", type: "text", label: "Seu nome completo", placeholder: "Ex: Maria Silva", required: true },
        { id: "email", type: "email", label: "E-mail", placeholder: "seu@email.com", required: true },
        { id: "telefone", type: "tel", label: "Telefone", placeholder: "(21) 99999-9999" },
      ],
    },
    {
      title: "Conte-nos mais",
      subtitle: "Compartilhe um pouco sobre sua experiência.",
      fields: [
        { id: "experiencia", type: "textarea", label: "Como conheceu a cannabis medicinal?", placeholder: "Conte um pouco da sua história e o que te trouxe até aqui...", required: true },
      ],
    },
    {
      title: "Áreas de interesse",
      subtitle: "Selecione todas as opções que se aplicam.",
      fields: [
        {
          id: "condicoes", type: "multiselect", label: "Quais condições você gostaria de tratar?", required: true,
          options: [
            { value: "ansiedade", label: "Ansiedade", description: "Transtornos de ansiedade generalizada" },
            { value: "insonia", label: "Insônia", description: "Dificuldade para dormir" },
            { value: "dor-cronica", label: "Dor Crônica", description: "Dores persistentes no corpo" },
            { value: "depressao", label: "Depressão", description: "Transtorno depressivo" },
            { value: "tdah", label: "TDAH", description: "Déficit de atenção" },
            { value: "enxaqueca", label: "Enxaqueca", description: "Dores de cabeça intensas" },
            { value: "fibromialgia", label: "Fibromialgia", description: "Dor musculoesquelética" },
            { value: "epilepsia", label: "Epilepsia", description: "Crises convulsivas" },
          ],
        },
      ],
    },
    {
      title: "Sua preferência",
      subtitle: "Como prefere receber o acompanhamento?",
      fields: [
        {
          id: "modalidade", type: "select", label: "Modalidade de atendimento", required: true,
          options: [
            { value: "presencial", label: "Presencial", description: "Consulta no consultório" },
            { value: "teleconsulta", label: "Teleconsulta", description: "Atendimento online por vídeo" },
            { value: "hibrido", label: "Híbrido", description: "Alternando entre presencial e online" },
            { value: "sem-preferencia", label: "Sem preferência", description: "Qualquer modalidade me atende" },
          ],
        },
      ],
    },
  ],
};

/* ─────────────────────────────────────────────
   Historia Form Config — Campanha de vídeo
   ───────────────────────────────────────────── */

const HISTORIA_FORM: FormConfig = {
  name: "Conte Sua História",
  completionTitle: "Sua história foi enviada!",
  completionSubtitle: "Obrigado por compartilhar. Sua história pode inspirar milhares de pessoas. Entraremos em contato pelo telefone informado.",
  steps: [
    /* ── Step 1: Welcome ── */
    {
      title: "Conte Sua História, Ela Pode Mudar Vidas",
      subtitle: "Queremos ouvir a sua história! Conte como a cannabis medicinal transformou sua vida e concorra a prêmios.",
      fields: [],
      content: [
        { type: "highlight", text: "Grave um vídeo de 1 a 3 minutos contando sua experiência com o tratamento e como ele mudou sua vida." },
        { type: "deadline", text: "Prazo: até 01/05/2026" },
      ],
    },
    /* ── Step 2: Prizes ── */
    {
      title: "Premiação",
      subtitle: "Confira o que você pode ganhar participando:",
      fields: [],
      content: [
        {
          type: "prizes",
          items: [
            { rank: "1", title: "1º lugar", desc: "12 meses de tratamento grátis (até 4 produtos + consultas) ou valor equivalente em dinheiro" },
            { rank: "2", title: "2º e 3º lugar", desc: "6 meses de tratamento grátis (até 2 produtos + consultas) ou valor equivalente em dinheiro" },
            { rank: "3", title: "4º e 5º lugar", desc: "3 meses de tratamento grátis (1 produto + consulta de retorno) ou valor equivalente em dinheiro" },
          ],
        },
        { type: "highlight", text: "50 primeiros participantes: Frete grátis no próximo pedido" },
        { type: "highlight", text: "Todos os participantes: Consulta de retorno gratuita" },
      ],
    },
    /* ── Step 3: Video script ── */
    {
      title: "Roteiro sugerido",
      subtitle: "Siga esse roteiro para gravar seu vídeo (1 a 3 minutos):",
      fields: [],
      content: [
        {
          type: "list",
          ordered: true,
          items: [
            "Se apresente: nome, idade, de onde você é",
            "O que te levou a buscar o tratamento com cannabis medicinal?",
            "Você tentou outros tratamentos antes? Como foi?",
            "Como era seu dia a dia antes? O que você não conseguia fazer?",
            "Em que momento você percebeu que o tratamento estava funcionando?",
            "Como está sua vida agora? O que mudou na prática?",
            "Como foi sua experiência com a Click? (atendimento, consulta, suporte)",
            "O que você diria para alguém que tem dúvida se deve começar?",
          ],
        },
        {
          type: "tips",
          items: [
            "Grave de dia, perto de uma janela (boa iluminação)",
            "Ambiente silencioso",
            "Celular na vertical, na altura dos olhos",
            "Duração: 1 a 3 minutos",
          ],
        },
      ],
    },
    /* ── Step 4: Personal data ── */
    {
      title: "Seus dados",
      subtitle: "Precisamos de algumas informações para contato.",
      fields: [
        { id: "nome", type: "text", label: "Nome completo", placeholder: "Seu nome completo", required: true },
        { id: "telefone", type: "tel", label: "Telefone", placeholder: "(21) 99999-9999", required: true },
        { id: "instagram", type: "text", label: "Instagram (não obrigatório)", placeholder: "@seuusuario" },
      ],
    },
    /* ── Step 5: Treatment info ── */
    {
      title: "Sobre seu tratamento",
      fields: [
        {
          id: "tempo_paciente", type: "select", label: "Há quanto tempo é paciente Click?", required: true,
          options: [
            { value: "3-6-meses", label: "3 a 6 meses" },
            { value: "6-12-meses", label: "6 a 12 meses" },
            { value: "mais-1-ano", label: "Mais de 1 ano" },
            { value: "mais-2-anos", label: "Mais de 2 anos" },
          ],
        },
        { id: "condicao", type: "text", label: "Qual condição você trata com cannabis medicinal?", placeholder: "Ex: insônia, ansiedade, dor crônica, epilepsia, etc.", required: true },
      ],
    },
    /* ── Step 6: Video upload ── */
    {
      title: "Envie seu vídeo",
      subtitle: "Grave um vídeo de 1 a 3 minutos contando sua história.",
      fields: [
        { id: "video", type: "video", label: "Seu vídeo", required: true, minDurationSec: 60, maxSizeMb: 500 },
      ],
    },
    /* ── Step 7: Authorization ── */
    {
      title: "Autorização de uso de imagem",
      subtitle: "Para participar, precisamos da sua autorização para usar o vídeo.",
      fields: [
        {
          id: "autorizacao",
          type: "checkbox",
          label: "Autorização",
          required: true,
          termsUrl: "/forms/termos-uso-imagem",
          options: [
            { value: "autorizado", label: "Autorizo a Click Cannabis a utilizar minha imagem e vídeo em materiais de comunicação e publicidade, conforme os termos de uso de imagem." },
          ],
        },
      ],
    },
  ],
};

/* ─────────────────────────────────────────────
   Form registry
   ───────────────────────────────────────────── */

const FORM_REGISTRY: Record<string, FormConfig> = {
  demo: DEMO_FORM,
  teste: DEMO_FORM,
  historia: HISTORIA_FORM,
};

/* ─────────────────────────────────────────────
   Content Block Renderer
   ───────────────────────────────────────────── */

function ContentBlocks({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <div className="content-blocks">
      {blocks.map((block, i) => {
        switch (block.type) {
          case "paragraph":
            return <p key={i} className="cb-paragraph">{block.text}</p>;

          case "highlight":
            return (
              <div key={i} className="cb-highlight">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M8 3v5l3 2" /><circle cx="8" cy="8" r="6" /></svg>
                <span>{block.text}</span>
              </div>
            );

          case "deadline":
            return (
              <div key={i} className="cb-deadline">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="2" y="3" width="12" height="11" rx="2" /><path d="M5 1v3M11 1v3M2 7h12" /></svg>
                <span>{block.text}</span>
              </div>
            );

          case "prizes":
            return (
              <div key={i} className="cb-prizes">
                {block.items.map((prize, j) => (
                  <div key={j} className="cb-prize-item">
                    <div className="cb-prize-rank">{prize.rank}</div>
                    <div className="cb-prize-info">
                      <span className="cb-prize-title">{prize.title}</span>
                      <span className="cb-prize-desc">{prize.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            );

          case "list":
            return (
              <div key={i} className="cb-list-wrapper">
                {block.title && <p className="cb-list-title">{block.title}</p>}
                {block.ordered ? (
                  <ol className="cb-list cb-list-ordered">
                    {block.items.map((item, j) => <li key={j}>{item}</li>)}
                  </ol>
                ) : (
                  <ul className="cb-list">
                    {block.items.map((item, j) => <li key={j}>{item}</li>)}
                  </ul>
                )}
              </div>
            );

          case "tips":
            return (
              <div key={i} className="cb-tips">
                <p className="cb-tips-title">Dicas para gravar</p>
                <ul className="cb-tips-list">
                  {block.items.map((item, j) => (
                    <li key={j}>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="var(--green-mid)" strokeWidth="1.5" strokeLinecap="round"><path d="M3 7.5l3 3 5-6" /></svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            );
        }
      })}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Video Upload Component
   ───────────────────────────────────────────── */

function VideoUpload({
  field,
  value,
  onUpload,
  invalid,
}: {
  field: FormField;
  value: string;
  onUpload: (uploadId: string) => void;
  invalid: boolean;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateAndUpload = useCallback(async (selectedFile: File) => {
    setError(null);
    setFile(selectedFile);

    if (!selectedFile.type.startsWith("video/")) {
      setError("Por favor, selecione um arquivo de vídeo.");
      setFile(null);
      return;
    }

    const maxSize = (field.maxSizeMb || 500) * 1024 * 1024;
    if (selectedFile.size > maxSize) {
      setError(`O vídeo deve ter no máximo ${field.maxSizeMb || 500}MB.`);
      setFile(null);
      return;
    }

    // Check duration
    const minDur = field.minDurationSec || 0;
    if (minDur > 0) {
      const dur = await getVideoDuration(selectedFile);
      setDuration(dur);
      if (dur < minDur) {
        setError(`O vídeo deve ter no mínimo ${minDur} segundos. Seu vídeo tem ${Math.floor(dur)} segundos.`);
        return;
      }
    }

    // Upload to Vercel Blob
    setUploading(true);
    setProgress(0);
    try {
      const blob = await upload(selectedFile.name, selectedFile, {
        access: "public",
        handleUploadUrl: "/api/forms/upload",
        onUploadProgress: ({ percentage }) => setProgress(percentage),
      });

      onUpload(blob.url);
    } catch {
      setError("Erro ao enviar o vídeo. Tente novamente.");
    } finally {
      setUploading(false);
    }
  }, [field.maxSizeMb, field.minDurationSec, onUpload]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) validateAndUpload(droppedFile);
  }, [validateAndUpload]);

  const uploaded = !!value;

  return (
    <div className="video-upload-wrapper">
      <input
        ref={inputRef}
        type="file"
        accept="video/*"
        style={{ display: "none" }}
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) validateAndUpload(f);
        }}
      />

      {uploaded ? (
        <div className="video-uploaded">
          <div className="video-uploaded-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--green-mid)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 12l2 2 4-4" /><circle cx="12" cy="12" r="9" />
            </svg>
          </div>
          <div className="video-uploaded-info">
            <p className="video-uploaded-name">{file?.name || "Vídeo enviado"}</p>
            {duration && <p className="video-uploaded-meta">{formatDuration(duration)}</p>}
          </div>
          <button type="button" className="video-replace-btn" onClick={() => {
            onUpload("");
            setFile(null);
            setDuration(null);
            inputRef.current?.click();
          }}>
            Trocar
          </button>
        </div>
      ) : uploading ? (
        <div className="video-uploading">
          <div className="video-progress-bar">
            <div className="video-progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <p className="video-uploading-text">Enviando... {progress}%</p>
        </div>
      ) : (
        <button
          type="button"
          className={`video-dropzone ${invalid ? "video-dropzone-invalid" : ""}`}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="var(--fg-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.5 }}>
            <rect x="6" y="8" width="28" height="24" rx="4" />
            <path d="M16 26l4-4 4 4" />
            <path d="M20 22v-8" />
          </svg>
          <span className="video-dropzone-text">Toque para selecionar seu vídeo</span>
          <span className="video-dropzone-hint">ou arraste o arquivo aqui</span>
        </button>
      )}

      {error && <p className="field-error">{error}</p>}
    </div>
  );
}

function getVideoDuration(file: File): Promise<number> {
  return new Promise((resolve) => {
    const video = document.createElement("video");
    video.preload = "metadata";
    video.onloadedmetadata = () => {
      URL.revokeObjectURL(video.src);
      resolve(video.duration);
    };
    video.onerror = () => resolve(0);
    video.src = URL.createObjectURL(file);
  });
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")} min`;
}

/* ─────────────────────────────────────────────
   Component
   ───────────────────────────────────────────── */

export default function FormPage({
  params,
}: {
  params: Promise<{ formName: string; userId: string }>;
}) {
  const { formName, userId } = use(params);
  return <FormPageInner formName={formName} userId={userId} />;
}

function FormPageInner({ formName, userId }: { formName: string; userId: string }) {
  const form = FORM_REGISTRY[formName];
  const totalSteps = form?.steps.length ?? 0;

  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, string | string[]>>({});
  const [animPhase, setAnimPhase] = useState<"idle" | "exit" | "enter">("idle");
  const [direction, setDirection] = useState<1 | -1>(1);
  const [completed, setCompleted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [touched, setTouched] = useState<Set<string>>(new Set());
  const contentRef = useRef<HTMLDivElement>(null);

  const step = form?.steps[currentStep];

  const goToStep = useCallback(
    (next: number) => {
      if (animPhase !== "idle" || !form) return;
      setDirection(next > currentStep ? 1 : -1);
      setAnimPhase("exit");
      setTimeout(() => {
        setCurrentStep(next);
        setAnimPhase("enter");
        contentRef.current?.scrollTo({ top: 0 });
        setTimeout(() => setAnimPhase("idle"), 280);
      }, 220);
    },
    [animPhase, currentStep, form]
  );

  const submitForm = useCallback(async () => {
    setSubmitting(true);
    try {
      const payload = {
        formData,
        url: { formName, userId },
        meta: {
          submittedAt: new Date().toISOString(),
          userAgent: navigator.userAgent,
          referrer: document.referrer || null,
          url: window.location.href,
        },
      };
      await fetch("/api/forms/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formType: formName, payload }),
      });
    } catch {
      // silently fail — form still shows completion
    } finally {
      setSubmitting(false);
      setCompleted(true);
    }
  }, [formData, formName, userId]);

  const handleNext = useCallback(() => {
    if (!form || submitting) return;
    const stepFields = form.steps[currentStep].fields;

    // Mark all fields as touched
    setTouched((prev) => new Set([...prev, ...stepFields.map((f) => f.id)]));

    // Validate required fields
    const valid = stepFields.every((f) => {
      if (!f.required) return true;
      const val = formData[f.id];
      if (Array.isArray(val)) return val.length > 0;
      return typeof val === "string" && val.trim().length > 0;
    });
    if (!valid) return;

    if (currentStep < totalSteps - 1) {
      goToStep(currentStep + 1);
    } else {
      setAnimPhase("exit");
      setTimeout(() => submitForm(), 220);
    }
  }, [form, currentStep, totalSteps, formData, goToStep, submitting, submitForm]);

  const handleBack = useCallback(() => {
    if (currentStep > 0) goToStep(currentStep - 1);
  }, [currentStep, goToStep]);

  const setValue = useCallback((fieldId: string, value: string) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }));
    setTouched((prev) => new Set([...prev, fieldId]));
  }, []);

  const toggleMulti = useCallback((fieldId: string, value: string) => {
    setFormData((prev) => {
      const arr = (prev[fieldId] as string[]) || [];
      return { ...prev, [fieldId]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value] };
    });
    setTouched((prev) => new Set([...prev, fieldId]));
  }, []);

  const isFieldInvalid = (field: FormField) => {
    if (!field.required || !touched.has(field.id)) return false;
    const val = formData[field.id];
    if (Array.isArray(val)) return val.length === 0;
    return !val || (typeof val === "string" && val.trim().length === 0);
  };

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        const target = e.target as HTMLElement;
        if (target.tagName === "TEXTAREA") return;
        e.preventDefault();
        handleNext();
      }
    },
    [handleNext]
  );

  const getStepStyle = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      transition: "opacity 220ms cubic-bezier(0.16, 1, 0.3, 1), transform 220ms cubic-bezier(0.16, 1, 0.3, 1)",
    };
    if (animPhase === "exit") return { ...base, opacity: 0, transform: `translateX(${direction * -24}px)` };
    if (animPhase === "enter") return { ...base, opacity: 0, transform: `translateX(${direction * 24}px)`, transition: "none" };
    return { ...base, opacity: 1, transform: "translateX(0)" };
  };

  useEffect(() => {
    if (animPhase === "enter") {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setAnimPhase("idle"));
      });
    }
  }, [animPhase]);

  /* ── 404 ── */
  if (!form) {
    return (
      <>
        <style>{STYLES}</style>
        <div className="form-shell">
          <div className="form-card" style={{ textAlign: "center", padding: "80px 32px" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>?</div>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 700, color: "var(--fg)" }}>
              Formulário não encontrado
            </h1>
            <p style={{ color: "var(--fg-muted)", marginTop: 8 }}>
              O formulário <strong>{formName}</strong> não existe.
            </p>
          </div>
        </div>
      </>
    );
  }

  /* ── Completed ── */
  if (completed) {
    return (
      <>
        <style>{STYLES}</style>
        <div className="form-shell">
          <div className="form-card" style={{ textAlign: "center", padding: "60px 32px" }}>
            <div className="check-circle">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 16.5l5 5 9-10" className="check-path" />
              </svg>
            </div>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.4rem, 4vw, 1.75rem)", fontWeight: 700, color: "var(--fg)", marginTop: 24, letterSpacing: "-0.02em" }}>
              {form.completionTitle || "Formulário enviado!"}
            </h1>
            <p style={{ color: "var(--fg-secondary)", marginTop: 8, fontSize: 15, lineHeight: 1.6, maxWidth: 360, marginInline: "auto" }}>
              {form.completionSubtitle || `Obrigado por compartilhar suas informações, ${(formData.nome as string)?.split(" ")[0] || ""}. Entraremos em contato em breve.`}
            </p>
          </div>
        </div>
      </>
    );
  }

  /* ── Main Form ── */
  const progress = ((currentStep + 1) / totalSteps) * 100;
  const isInfoStep = step.fields.length === 0;

  return (
    <>
      <style>{STYLES}</style>
      <div className="form-shell" onKeyDown={handleKeyDown}>
        <div className="progress-fixed">
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="form-card">
          <div className="form-header">
            <div className="form-brand">
              <img src="/logo.svg" alt="Click Cannabis" width={100} height={14} />
            </div>
          </div>

          <div className="step-content" ref={contentRef} style={getStepStyle()}>
            <div className={`step-inner ${isInfoStep ? "step-inner-info" : ""}`}>
              <h1 className="step-title">{step.title}</h1>
              {step.subtitle && <p className="step-subtitle">{step.subtitle}</p>}

              {/* Content blocks (info steps) */}
              {step.content && <ContentBlocks blocks={step.content} />}

              {/* Form fields */}
              {step.fields.length > 0 && (
                <div className={`fields-wrapper ${step.content ? "fields-after-content" : ""}`}>
                  {step.fields.map((field) => (
                    <div key={field.id} className="field-group">
                      {field.type !== "checkbox" && (
                        <label className="field-label" htmlFor={field.id}>
                          {field.label}
                          {field.required && <span className="required-dot" />}
                        </label>
                      )}

                      {/* Text / Email / Tel */}
                      {(field.type === "text" || field.type === "email" || field.type === "tel") && (
                        <input
                          id={field.id}
                          type={field.type}
                          className={`field-input ${isFieldInvalid(field) ? "field-invalid" : ""}`}
                          placeholder={field.placeholder}
                          value={(formData[field.id] as string) || ""}
                          onChange={(e) => setValue(field.id, e.target.value)}
                          autoComplete={field.type === "email" ? "email" : field.type === "tel" ? "tel" : "name"}
                        />
                      )}

                      {/* Textarea */}
                      {field.type === "textarea" && (
                        <textarea
                          id={field.id}
                          className={`field-textarea ${isFieldInvalid(field) ? "field-invalid" : ""}`}
                          placeholder={field.placeholder}
                          value={(formData[field.id] as string) || ""}
                          onChange={(e) => setValue(field.id, e.target.value)}
                          rows={5}
                        />
                      )}

                      {/* Multi-select */}
                      {field.type === "multiselect" && field.options && (
                        <div className="options-grid">
                          {field.options.map((opt) => {
                            const selected = ((formData[field.id] as string[]) || []).includes(opt.value);
                            return (
                              <button key={opt.value} type="button" className={`option-chip ${selected ? "option-selected" : ""}`} onClick={() => toggleMulti(field.id, opt.value)} aria-pressed={selected}>
                                <span className="option-check">
                                  {selected && <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7.5l3 3 5-6" /></svg>}
                                </span>
                                <span className="option-content">
                                  <span className="option-label">{opt.label}</span>
                                  {opt.description && <span className="option-desc">{opt.description}</span>}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      )}

                      {/* Single select */}
                      {field.type === "select" && field.options && (
                        <div className="options-list">
                          {field.options.map((opt) => {
                            const selected = formData[field.id] === opt.value;
                            return (
                              <button key={opt.value} type="button" className={`option-chip option-chip-single ${selected ? "option-selected" : ""}`} onClick={() => setValue(field.id, opt.value)} aria-pressed={selected}>
                                <span className="radio-dot"><span className={`radio-inner ${selected ? "radio-active" : ""}`} /></span>
                                <span className="option-content">
                                  <span className="option-label">{opt.label}</span>
                                  {opt.description && <span className="option-desc">{opt.description}</span>}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      )}

                      {/* Checkbox */}
                      {field.type === "checkbox" && field.options && (
                        <div className="checkbox-wrapper">
                          {field.options.map((opt) => {
                            const checked = formData[field.id] === opt.value;
                            return (
                              <button
                                key={opt.value}
                                type="button"
                                className={`checkbox-item ${checked ? "checkbox-checked" : ""} ${isFieldInvalid(field) ? "checkbox-invalid" : ""}`}
                                onClick={() => setValue(field.id, checked ? "" : opt.value)}
                                aria-pressed={checked}
                              >
                                <span className="checkbox-box">
                                  {checked && <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="M2.5 6.5l2.5 2.5 4.5-5" /></svg>}
                                </span>
                                <span className="checkbox-label">{opt.label}</span>
                              </button>
                            );
                          })}
                          {field.termsUrl && (
                            <a href={field.termsUrl} target="_blank" rel="noopener noreferrer" className="terms-link">
                              Ler termos completos de uso de imagem
                              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M5 3h6v6M11 3L5 9" /></svg>
                            </a>
                          )}
                        </div>
                      )}

                      {/* Video upload */}
                      {field.type === "video" && (
                        <VideoUpload
                          field={field}
                          value={(formData[field.id] as string) || ""}
                          onUpload={(id) => setValue(field.id, id)}
                          invalid={isFieldInvalid(field)}
                        />
                      )}

                      {field.type !== "video" && field.type !== "checkbox" && isFieldInvalid(field) && (
                        <p className="field-error">Este campo é obrigatório</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Navigation — fixed bottom bar */}
        <div className="form-nav-fixed">
          <div className="form-nav">
            <button type="button" className="btn-back" onClick={handleBack} disabled={currentStep === 0} aria-label="Voltar">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4l-5 5 5 5" /></svg>
              Voltar
            </button>
            <button type="button" className="btn-next" onClick={handleNext} disabled={submitting}>
              {submitting ? "Enviando..." : currentStep === totalSteps - 1 ? "Enviar" : isInfoStep ? "Próximo" : "Continuar"}
              {!submitting && (
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M7 4l5 5-5 5" /></svg>
              )}
            </button>
          </div>
          <p className="keyboard-hint">
            Pressione <kbd>Enter ↵</kbd> para continuar
          </p>
        </div>
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────
   Styles
   ───────────────────────────────────────────── */

const STYLES = `
  :root {
    --font-display: var(--font-outfit), 'Outfit', system-ui, sans-serif;
    --green-deep: #0B3D1E;
    --green-mid: #1B6B3A;
    --green-accent: #2ECC71;
    --green-tint: #EDF7F0;
    --green-focus: rgba(27, 107, 58, 0.12);
    --fg: #0A1F12;
    --fg-secondary: #3D5A48;
    --fg-muted: #7A9A88;
    --border: #D0DDD6;
    --border-hover: #A8C4B4;
    --surface: #FAFCFB;
    --card: #FFFFFF;
    --error: #D64545;
    --error-tint: #FEF0F0;
  }

  * { box-sizing: border-box; margin: 0; }

  .form-shell {
    min-height: 100svh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 48px 16px 24px;
    background: var(--surface);
    font-family: var(--font-display);
    position: relative;
  }
  @media (max-width: 520px) {
    .form-shell { padding: 40px 0 16px; justify-content: flex-start; }
  }

  .form-shell::before, .form-shell::after { display: none; }

  .form-card {
    position: relative; width: 100%; max-width: 520px;
    overflow: hidden; display: flex; flex-direction: column;
  }
  @media (max-width: 520px) { .form-card { max-width: 100%; flex: 1; } }

  /* ── Progress ── */
  .progress-fixed { position: fixed; top: 0; left: 0; right: 0; z-index: 50; }
  .progress-track { height: 3px; background: var(--green-tint); }
  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--green-mid), var(--green-accent));
    border-radius: 0 3px 3px 0;
    transition: width 500ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  /* ── Header ── */
  .form-header { padding: 24px 32px 0; }
  @media (max-width: 520px) { .form-header { padding: 20px 20px 0; } }
  .form-brand { margin-bottom: 20px; }
  .step-counter {
    font-size: 13px; font-weight: 600; color: var(--fg-muted);
    letter-spacing: 0.02em; font-variant-numeric: tabular-nums;
  }

  /* ── Step content ── */
  .step-content { flex: 1; overflow-y: auto; padding-bottom: 120px; }
  .step-inner { padding: 0 32px; }
  @media (max-width: 520px) { .step-inner { padding: 0 20px; } }

  .step-title {
    font-size: clamp(1.4rem, 4vw, 1.75rem); font-weight: 700;
    color: var(--fg); letter-spacing: -0.025em; line-height: 1.2; margin-top: 12px;
  }
  .step-subtitle { font-size: 15px; color: var(--fg-secondary); line-height: 1.6; margin-top: 8px; }

  /* ── Info step — clean, minimal ── */
  .step-inner-info .step-title {
    font-size: clamp(1.6rem, 5.5vw, 2rem);
    letter-spacing: -0.03em; line-height: 1.15;
  }
  .step-inner-info .step-subtitle {
    font-size: 15px; line-height: 1.7; margin-top: 14px;
    color: var(--fg-muted);
  }

  /* ── Fields ── */
  .fields-wrapper { margin-top: 28px; display: flex; flex-direction: column; gap: 22px; }
  .fields-after-content { margin-top: 20px; }
  .field-group { display: flex; flex-direction: column; gap: 8px; }
  .field-label { font-size: 14px; font-weight: 600; color: var(--fg); display: flex; align-items: center; gap: 6px; }
  .required-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--green-accent); display: inline-block; }

  /* ── Inputs ── */
  .field-input {
    height: 52px; padding: 0 18px; border-radius: 14px;
    border: 1.5px solid var(--border); background: var(--card);
    font-family: var(--font-display); font-size: 16px; color: var(--fg);
    outline: none; transition: border-color 200ms ease, box-shadow 200ms ease; width: 100%;
  }
  .field-input::placeholder { color: var(--fg-muted); opacity: 0.6; }
  .field-input:focus { border-color: var(--green-mid); box-shadow: 0 0 0 3px var(--green-focus); }
  .field-input.field-invalid { border-color: var(--error); box-shadow: 0 0 0 3px rgba(214, 69, 69, 0.08); }

  .field-textarea {
    padding: 14px 18px; min-height: 140px; border-radius: 14px;
    border: 1.5px solid var(--border); background: var(--card);
    font-family: var(--font-display); font-size: 16px; color: var(--fg);
    outline: none; resize: vertical; line-height: 1.6;
    transition: border-color 200ms ease, box-shadow 200ms ease; width: 100%;
  }
  .field-textarea::placeholder { color: var(--fg-muted); opacity: 0.6; }
  .field-textarea:focus { border-color: var(--green-mid); box-shadow: 0 0 0 3px var(--green-focus); }
  .field-textarea.field-invalid { border-color: var(--error); box-shadow: 0 0 0 3px rgba(214, 69, 69, 0.08); }

  /* ── Options ── */
  .options-grid, .options-list { display: flex; flex-direction: column; gap: 10px; }

  .option-chip {
    display: flex; align-items: flex-start; gap: 12px; padding: 14px 16px;
    border-radius: 14px; border: 1.5px solid var(--border); background: var(--card);
    cursor: pointer; text-align: left; font-family: var(--font-display);
    transition: border-color 180ms ease, background 180ms ease, transform 120ms ease;
    -webkit-tap-highlight-color: transparent;
  }
  @media (hover: hover) and (pointer: fine) {
    .option-chip:hover { border-color: var(--border-hover); background: var(--surface); }
  }
  .option-chip:active { transform: scale(0.97); }
  .option-chip.option-selected { border-color: var(--green-mid); background: var(--green-tint); }

  .option-check {
    width: 22px; height: 22px; min-width: 22px; border-radius: 7px;
    border: 1.5px solid var(--border); display: flex; align-items: center;
    justify-content: center; margin-top: 1px;
    transition: background 180ms ease, border-color 180ms ease; color: white;
  }
  .option-selected .option-check { background: var(--green-mid); border-color: var(--green-mid); }

  .radio-dot {
    width: 22px; height: 22px; min-width: 22px; border-radius: 50%;
    border: 1.5px solid var(--border); display: flex; align-items: center;
    justify-content: center; margin-top: 1px; transition: border-color 180ms ease;
  }
  .option-selected .radio-dot { border-color: var(--green-mid); }
  .radio-inner {
    width: 10px; height: 10px; border-radius: 50%; background: var(--green-mid);
    transform: scale(0); transition: transform 200ms cubic-bezier(0.16, 1, 0.3, 1);
  }
  .radio-inner.radio-active { transform: scale(1); }

  .option-content { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
  .option-label { font-size: 14px; font-weight: 600; color: var(--fg); line-height: 1.3; }
  .option-desc { font-size: 12px; color: var(--fg-muted); line-height: 1.4; }

  .field-error { font-size: 13px; color: var(--error); font-weight: 500; padding-left: 2px; }

  /* ── Checkbox ── */
  .checkbox-wrapper { display: flex; flex-direction: column; gap: 12px; }
  .checkbox-item {
    display: flex; align-items: flex-start; gap: 14px; padding: 16px;
    border-radius: 14px; border: 1.5px solid var(--border); background: var(--card);
    cursor: pointer; text-align: left; font-family: var(--font-display);
    transition: border-color 180ms ease, background 180ms ease;
    -webkit-tap-highlight-color: transparent;
  }
  .checkbox-item.checkbox-checked { border-color: var(--green-mid); background: var(--green-tint); }
  .checkbox-item.checkbox-invalid { border-color: var(--error); }
  .checkbox-box {
    width: 24px; height: 24px; min-width: 24px; border-radius: 7px;
    border: 1.5px solid var(--border); display: flex; align-items: center;
    justify-content: center; margin-top: 1px;
    transition: background 180ms ease, border-color 180ms ease;
  }
  .checkbox-checked .checkbox-box { background: var(--green-mid); border-color: var(--green-mid); }
  .checkbox-label { font-size: 14px; color: var(--fg); line-height: 1.5; }

  .terms-link {
    display: inline-flex; align-items: center; gap: 4px;
    font-size: 13px; color: var(--green-mid); font-weight: 600;
    text-decoration: underline; text-underline-offset: 3px;
    padding-left: 2px;
  }
  @media (hover: hover) and (pointer: fine) {
    .terms-link:hover { color: var(--green-deep); }
  }

  /* ── Video upload ── */
  .video-upload-wrapper { display: flex; flex-direction: column; gap: 10px; }
  .video-dropzone {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    gap: 12px; padding: 40px 24px; border-radius: 16px;
    border: 2px dashed var(--border); background: var(--surface);
    cursor: pointer; transition: border-color 200ms ease, background 200ms ease;
    font-family: var(--font-display);
    -webkit-tap-highlight-color: transparent;
  }
  @media (hover: hover) and (pointer: fine) {
    .video-dropzone:hover { border-color: var(--green-mid); background: var(--green-tint); }
  }
  .video-dropzone-invalid { border-color: var(--error); }
  .video-dropzone-text { font-size: 15px; font-weight: 600; color: var(--fg); }
  .video-dropzone-hint { font-size: 13px; color: var(--fg-muted); }

  .video-uploading {
    padding: 32px 24px; border-radius: 16px; border: 1.5px solid var(--border);
    background: var(--surface); text-align: center;
  }
  .video-progress-bar {
    height: 6px; border-radius: 3px; background: var(--green-tint); overflow: hidden;
  }
  .video-progress-fill {
    height: 100%; background: linear-gradient(90deg, var(--green-mid), var(--green-accent));
    border-radius: 3px; transition: width 200ms ease;
  }
  .video-uploading-text { font-size: 14px; color: var(--fg-secondary); margin-top: 12px; font-weight: 500; }

  .video-uploaded {
    display: flex; align-items: center; gap: 14px; padding: 16px 20px;
    border-radius: 14px; border: 1.5px solid var(--green-mid); background: var(--green-tint);
  }
  .video-uploaded-icon { flex-shrink: 0; }
  .video-uploaded-info { flex: 1; min-width: 0; }
  .video-uploaded-name { font-size: 14px; font-weight: 600; color: var(--fg); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .video-uploaded-meta { font-size: 12px; color: var(--fg-muted); margin-top: 2px; }
  .video-replace-btn {
    font-size: 13px; font-weight: 600; color: var(--green-mid);
    background: none; border: none; cursor: pointer; font-family: var(--font-display);
    text-decoration: underline; text-underline-offset: 3px;
    -webkit-tap-highlight-color: transparent;
  }

  /* ── Content blocks ── */
  /* ── Content blocks — minimal ── */
  .content-blocks { margin-top: 28px; display: flex; flex-direction: column; gap: 16px; }

  .cb-paragraph { font-size: 15px; color: var(--fg-muted); line-height: 1.7; }

  .cb-highlight {
    font-size: 15px; font-weight: 500; color: var(--fg-secondary); line-height: 1.6;
    padding: 14px 0; display: flex; align-items: flex-start; gap: 10px;
  }
  .cb-highlight svg { flex-shrink: 0; margin-top: 5px; color: var(--green-accent); }

  .cb-deadline {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: 13px; font-weight: 600; color: var(--fg-muted);
  }
  .cb-deadline svg { flex-shrink: 0; color: var(--fg-muted); }

  /* ── Prizes — minimal, typography-driven ── */
  .cb-prizes { display: flex; flex-direction: column; gap: 0; }
  .cb-prize-item {
    display: flex; align-items: flex-start; gap: 16px;
    padding: 18px 0;
    border-bottom: 1px solid rgba(0,0,0,0.05);
  }
  .cb-prize-item:last-child { border-bottom: none; }
  .cb-prize-rank {
    width: 32px; min-width: 32px;
    font-size: 28px; font-weight: 800; line-height: 1;
    color: #D0D5D2;
    font-variant-numeric: tabular-nums;
  }
  .cb-prize-item:first-child .cb-prize-rank { color: #D4A440; }
  .cb-prize-item:nth-child(2) .cb-prize-rank { color: #A0A8B0; }
  .cb-prize-item:nth-child(3) .cb-prize-rank { color: #C09070; }
  .cb-prize-info { display: flex; flex-direction: column; gap: 2px; padding-top: 4px; }
  .cb-prize-title { font-size: 15px; font-weight: 700; color: var(--fg); }
  .cb-prize-desc { font-size: 13px; color: var(--fg-muted); line-height: 1.5; }

  /* ── Ordered list — clean flow ── */
  .cb-list-wrapper { }
  .cb-list-title { font-size: 14px; font-weight: 600; color: var(--fg); margin-bottom: 12px; }
  .cb-list {
    display: flex; flex-direction: column; gap: 0;
    list-style: none; padding: 0;
  }
  .cb-list li {
    font-size: 14px; color: var(--fg-secondary); line-height: 1.6;
    padding: 12px 0;
    border-bottom: 1px solid rgba(0,0,0,0.04);
  }
  .cb-list li:last-child { border-bottom: none; }
  .cb-list-ordered { counter-reset: step; }
  .cb-list-ordered li {
    counter-increment: step;
    padding-left: 32px; position: relative;
  }
  .cb-list-ordered li::before {
    content: counter(step);
    position: absolute; left: 0; top: 13px;
    font-size: 12px; font-weight: 700; color: var(--fg-muted);
    width: 20px; text-align: center;
  }

  /* ── Tips — subtle ── */
  .cb-tips {
    padding: 18px 20px; border-radius: 14px;
    background: rgba(0,0,0,0.02);
  }
  .cb-tips-title {
    font-size: 12px; font-weight: 700; color: var(--fg-muted);
    margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.06em;
  }
  .cb-tips-list { list-style: none; padding: 0; display: flex; flex-direction: column; gap: 8px; }
  .cb-tips-list li {
    display: flex; align-items: flex-start; gap: 8px;
    font-size: 13px; color: var(--fg-muted); line-height: 1.5;
  }
  .cb-tips-list li svg { flex-shrink: 0; margin-top: 2px; }

  /* ── Navigation — fixed bottom bar ── */
  .form-nav-fixed {
    position: fixed; bottom: 0; left: 0; right: 0; z-index: 50;
    background: linear-gradient(to top, rgba(250,252,251,1) 60%, rgba(250,252,251,0));
    padding-top: 32px;
  }
  .form-nav {
    display: flex; align-items: center; justify-content: space-between;
    max-width: 520px; margin: 0 auto;
    padding: 0 32px 12px; gap: 12px;
  }
  @media (max-width: 520px) { .form-nav { max-width: 100%; padding: 0 20px 12px; } }

  .btn-back {
    display: flex; align-items: center; gap: 6px; padding: 10px 16px;
    border-radius: 12px; border: none; background: transparent;
    font-family: var(--font-display); font-size: 14px; font-weight: 600;
    color: var(--fg-muted); cursor: pointer;
    transition: color 150ms ease, background 150ms ease;
    -webkit-tap-highlight-color: transparent;
  }
  .btn-back:disabled { opacity: 0; pointer-events: none; }
  @media (hover: hover) and (pointer: fine) {
    .btn-back:not(:disabled):hover { color: var(--fg-secondary); background: var(--surface); }
  }

  .btn-next {
    display: flex; align-items: center; gap: 8px; padding: 14px 28px;
    border-radius: 14px; border: none; background: var(--green-deep);
    font-family: var(--font-display); font-size: 15px; font-weight: 600;
    color: white; cursor: pointer;
    transition: transform 120ms ease, box-shadow 200ms ease, background 200ms ease;
    -webkit-tap-highlight-color: transparent; margin-left: auto;
  }
  .btn-next:disabled { opacity: 0.6; cursor: not-allowed; }
  @media (hover: hover) and (pointer: fine) {
    .btn-next:not(:disabled):hover { background: #0E4A25; box-shadow: 0 4px 20px rgba(11, 61, 30, 0.2); }
  }
  .btn-next:active { transform: scale(0.97); }

  /* ── Keyboard hint ── */
  .keyboard-hint {
    font-size: 12px; color: var(--fg-muted);
    opacity: 0.5; text-align: center; padding-bottom: 16px;
  }
  .keyboard-hint kbd {
    display: inline-flex; align-items: center; padding: 2px 7px;
    border-radius: 5px; border: 1px solid var(--border); background: var(--card);
    font-family: var(--font-display); font-size: 11px; font-weight: 600;
    box-shadow: 0 1px 2px rgba(0,0,0,0.04);
  }
  @media (pointer: coarse) { .keyboard-hint { display: none; } }

  /* ── Completion ── */
  .check-circle {
    width: 64px; height: 64px; border-radius: 50%; background: var(--green-mid);
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto; animation: scaleIn 400ms cubic-bezier(0.16, 1, 0.3, 1) both;
  }
  .check-path { stroke-dasharray: 30; stroke-dashoffset: 30; animation: drawCheck 500ms cubic-bezier(0.65, 0, 0.35, 1) 250ms forwards; }

  @keyframes scaleIn { from { transform: scale(0.5); opacity: 0; } to { transform: scale(1); opacity: 1; } }
  @keyframes drawCheck { to { stroke-dashoffset: 0; } }

  /* ── Reduced motion ── */
  @media (prefers-reduced-motion: reduce) {
    .progress-fill { transition: none; }
    .step-content, .field-input, .field-textarea, .option-chip,
    .btn-next, .btn-back, .radio-inner, .option-check,
    .checkbox-box, .video-progress-fill { transition: none; }
    .check-circle { animation: none; }
    .check-path { animation: none; stroke-dashoffset: 0; }
  }
`;
