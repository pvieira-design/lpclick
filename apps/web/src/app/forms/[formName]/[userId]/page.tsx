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
  | { type: "deadline"; text: string }
  | { type: "message-bubbles"; messages: { text: string; sender: "user" | "other" }[] };

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
    /* ── Step 1: Hook ── */
    {
      title: "Sua história vale mais do que você imagina",
      subtitle: "Diariamente recebemos mensagens de pacientes relatando uma melhor qualidade de vida. Agora, queremos ouvir a sua.",
      fields: [],
      content: [
        {
          type: "message-bubbles",
          messages: [
            { text: "Voltei a caminhar no parque! 🌿", sender: "other" },
            { text: "Minhas noites de sono são outras.", sender: "user" },
            { text: "Meu filho está bem mais calmo...", sender: "other" },
            { text: "As crises de enxaqueca quase sumiram 🙌", sender: "user" },
            { text: "Finalmente consigo brincar com meus netos sem dor.", sender: "other" },
            { text: "Reduzi os remédios tarja preta 🙏", sender: "user" },
            { text: "Minha ansiedade está muito mais controlada.", sender: "other" },
            { text: "Adeus, insônia! Consigo dormir a noite toda.", sender: "user" },
            { text: "A dor crônica diminuiu 80%.", sender: "other" },
            { text: "Consigo focar no trabalho novamente 🧠", sender: "user" },
            { text: "Minha avó voltou a sorrir.", sender: "other" },
            { text: "Não sinto mais aquele peso constante nos ombros.", sender: "user" },
            { text: "As convulsões reduziram drasticamente. Um milagre!", sender: "other" },
            { text: "Voltei a ter apetite, me sinto mais vivo.", sender: "user" },
            { text: "Acordar sem dor é a melhor sensação do mundo.", sender: "other" },
            { text: "Estou retomando minha rotina aos poucos ✨", sender: "user" },
            { text: "Foi a melhor decisão que já tomei.", sender: "other" },
            { text: "O óleo de CBD me devolveu a qualidade de vida.", sender: "user" },
            { text: "Sinto que voltei a ser eu mesmo.", sender: "other" },
            { text: "Obrigado, Click Cannabis! Mudou nossa vida.", sender: "user" },
          ]
        },
      ],
    },
    /* ── Step 2: Reward (High Emphasis) ── */
    {
      title: "Participe e ganhe",
      subtitle: "Valorizamos cada relato. Por isso, preparamos um incentivo especial para você.",
      fields: [],
      content: [
        { type: "highlight", text: "Os 50 primeiros pacientes a enviarem o vídeo ganham FRETE GRÁTIS no próximo pedido." },
        { type: "deadline", text: "Válido até 01/05/2026" },
      ],
    },
    /* ── Step 3: Recording Tips ── */
    {
      title: "Dicas para uma boa gravação",
      subtitle: "Coisas simples que fazem toda a diferença no resultado final.",
      fields: [],
      content: [
        {
          type: "tips",
          items: [
            "Grave em um local bem iluminado (de preferência de frente para uma janela)",
            "Procure um ambiente silencioso",
            "Mantenha o celular na vertical, na altura dos seus olhos",
            "O vídeo tem que ter no mínimo 1 minuto",
          ],
        },
      ],
    },
    /* ── Step 4: Video upload ── */
    {
      title: "Agora, envie seu vídeo",
      subtitle: "Selecione o arquivo que você gravou. Pode levar alguns segundos dependendo da sua internet.",
      fields: [
        { id: "video", type: "video", label: "Seu vídeo", required: true, minDurationSec: 45, maxSizeMb: 500 },
      ],
    },
    /* ── Step 8: Authorization ── */
    {
      title: "Quase pronto!",
      subtitle: "Para finalizar, precisamos do seu aceite nos termos e condições.",
      fields: [
        {
          id: "autorizacao",
          type: "checkbox",
          label: "Autorização",
          required: true,
          termsUrl: "/forms/termos-uso-imagem",
          options: [
            { value: "autorizado", label: "Autorizo o uso da minha imagem e depoimento para fins de comunicação da Click Cannabis." },
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
   Message Bubbles Component
   ───────────────────────────────────────────── */

function MessageBubbles({ messages }: { messages: { text: string; sender: "user" | "other" }[] }) {
  const [activeItems, setActiveItems] = useState([messages[0]]);
  const countRef = useRef(1);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      const nextIndex = countRef.current % messages.length;
      countRef.current += 1;
      setActiveItems((prev) => {
         const next = [...prev, messages[nextIndex]];
         if (next.length > 50) return next.slice(next.length - 50);
         return next;
      });
    }, 2500);
    return () => clearInterval(timer);
  }, [messages]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [activeItems]);

  return (
    <div className="cb-message-bubbles-container" ref={containerRef}>
      <div className="cb-message-bubbles-track">
        {activeItems.map((msg, j) => (
          <div key={countRef.current - activeItems.length + j} className={`cb-bubble cb-bubble-${msg.sender}`}>
            {msg.text}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Content Block Renderer
   ───────────────────────────────────────────── */

function ContentBlocks({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <div className="content-blocks">
      {blocks.map((block, i) => {
        switch (block.type) {
          case "message-bubbles":
            return <MessageBubbles key={i} messages={block.messages as any} />;

          case "paragraph":
            return <p key={i} className="cb-paragraph">{block.text}</p>;

          case "highlight":
            return (
              <div key={i} className="cb-highlight">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4" /><path d="M4 6v12c0 1.1.9 2 2 2h14v-4" /><path d="M18 12a2 2 0 0 0-2 2c0 1.1.9 2 2 2h4v-4h-4z" /></svg>
                <span>{block.text}</span>
              </div>
            );

          case "deadline":
            return (
              <div key={i} className="cb-deadline">
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
            const ICONS = [
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>,
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M22 9l-6 6"/><path d="M16 9l6 6"/></svg>,
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg>,
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
            ];

            return (
              <div key={i} className="cb-tips-grid">
                {block.items.map((item, j) => (
                  <div key={j} className="cb-tip-card" style={{ animationDelay: `${j * 0.15}s` }}>
                    <div className="cb-tip-icon">
                      {ICONS[j % ICONS.length]}
                    </div>
                    <span className="cb-tip-text">{item}</span>
                  </div>
                ))}
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

  const submitForm = useCallback(() => {
    setCompleted(true);

    // Fire-and-forget — save in background, don't block UI
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
    fetch("/api/forms/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ formType: formName, payload }),
    }).catch(() => {});
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
  const isStepValid = step.fields.every((f) => {
    if (!f.required) return true;
    const val = formData[f.id];
    if (Array.isArray(val)) return val.length > 0;
    return typeof val === "string" && val.trim().length > 0;
  });

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
            <button type="button" className="btn-next" onClick={handleNext} disabled={submitting || !isStepValid}>
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
    --fg-muted: #6B8777;
    --border: #D8E2DC;
    --border-hover: #C5D4CC;
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
    padding: 64px 16px 24px;
    background: var(--surface);
    font-family: var(--font-display);
    position: relative;
    color: var(--fg);
  }
  @media (max-width: 520px) {
    .form-shell { padding: 48px 0 16px; justify-content: flex-start; }
  }

  .form-card {
    position: relative; width: 100%; max-width: 480px;
    display: flex; flex-direction: column;
  }
  @media (max-width: 520px) { .form-card { max-width: 100%; flex: 1; } }

  /* ── Progress ── */
  .progress-fixed { position: fixed; top: 0; left: 0; right: 0; z-index: 50; }
  .progress-track { height: 4px; background: var(--green-tint); }
  .progress-fill {
    height: 100%;
    background: var(--green-mid);
    border-radius: 0 4px 4px 0;
    transition: width 600ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  /* ── Header ── */
  .form-header { padding: 0 32px 32px; }
  @media (max-width: 520px) { .form-header { padding: 0 24px 24px; } }
  .form-brand { margin-bottom: 0; opacity: 0.9; }

  /* ── Step content ── */
  .step-content { flex: 1; overflow-y: auto; padding-bottom: 140px; }
  .step-inner { padding: 0 32px; }
  @media (max-width: 520px) { .step-inner { padding: 0 24px; } }

  .step-title {
    font-size: clamp(1.5rem, 5vw, 1.875rem);
    font-weight: 700;
    color: var(--fg);
    letter-spacing: -0.03em;
    line-height: 1.15;
    margin-bottom: 12px;
  }
  .step-subtitle {
    font-size: 16px;
    color: var(--fg-secondary);
    line-height: 1.6;
    margin-bottom: 0;
  }

  /* ── Info step ── */
  .step-inner-info .step-title {
    font-size: clamp(1.75rem, 6vw, 2.25rem);
    letter-spacing: -0.04em;
    line-height: 1.1;
  }
  .step-inner-info .step-subtitle {
    font-size: 17px;
    line-height: 1.6;
    margin-top: 16px;
    color: var(--fg-secondary);
  }

  /* ── Fields ── */
  .fields-wrapper { margin-top: 32px; display: flex; flex-direction: column; gap: 24px; }
  .fields-after-content { margin-top: 32px; border-top: 1px solid var(--border); padding-top: 32px; }
  .field-group { display: flex; flex-direction: column; gap: 10px; }
  .field-label { font-size: 14px; font-weight: 600; color: var(--fg-secondary); display: flex; align-items: center; gap: 6px; }
  .required-dot { width: 4px; height: 4px; border-radius: 50%; background: var(--green-accent); display: inline-block; }

  /* ── Inputs ── */
  .field-input {
    height: 56px; padding: 0 20px; border-radius: 12px;
    border: 1.5px solid var(--border); background: var(--card);
    font-family: var(--font-display); font-size: 16px; color: var(--fg);
    outline: none; transition: all 200ms ease; width: 100%;
    box-shadow: 0 1px 2px rgba(0,0,0,0.02);
  }
  .field-input::placeholder { color: var(--fg-muted); opacity: 0.5; }
  .field-input:focus { border-color: var(--green-mid); box-shadow: 0 0 0 4px var(--green-focus); }
  .field-input.field-invalid { border-color: var(--error); background: var(--error-tint); }

  .field-textarea {
    padding: 16px 20px; min-height: 120px; border-radius: 12px;
    border: 1.5px solid var(--border); background: var(--card);
    font-family: var(--font-display); font-size: 16px; color: var(--fg);
    outline: none; resize: vertical; line-height: 1.6;
    transition: all 200ms ease; width: 100%;
    box-shadow: 0 1px 2px rgba(0,0,0,0.02);
  }
  .field-textarea::placeholder { color: var(--fg-muted); opacity: 0.5; }
  .field-textarea:focus { border-color: var(--green-mid); box-shadow: 0 0 0 4px var(--green-focus); }
  .field-textarea.field-invalid { border-color: var(--error); background: var(--error-tint); }

  /* ── Options ── */
  .options-grid, .options-list { display: flex; flex-direction: column; gap: 12px; }

  .option-chip {
    display: flex; align-items: flex-start; gap: 14px; padding: 16px;
    border-radius: 12px; border: 1.5px solid var(--border); background: var(--card);
    cursor: pointer; text-align: left; font-family: var(--font-display);
    transition: all 180ms ease;
    -webkit-tap-highlight-color: transparent;
    box-shadow: 0 1px 2px rgba(0,0,0,0.02);
  }
  @media (hover: hover) and (pointer: fine) {
    .option-chip:hover { border-color: var(--border-hover); background: var(--surface); }
  }
  .option-chip:active { transform: scale(0.98); }
  .option-chip.option-selected { border-color: var(--green-mid); background: var(--green-tint); box-shadow: none; }

  .option-check {
    width: 20px; height: 20px; min-width: 20px; border-radius: 6px;
    border: 1.5px solid var(--border); display: flex; align-items: center;
    justify-content: center; margin-top: 2px;
    transition: all 180ms ease; color: white;
  }
  .option-selected .option-check { background: var(--green-mid); border-color: var(--green-mid); }

  .radio-dot {
    width: 20px; height: 20px; min-width: 20px; border-radius: 50%;
    border: 1.5px solid var(--border); display: flex; align-items: center;
    justify-content: center; margin-top: 2px; transition: all 180ms ease;
  }
  .option-selected .radio-dot { border-color: var(--green-mid); }
  .radio-inner {
    width: 10px; height: 10px; border-radius: 50%; background: var(--green-mid);
    transform: scale(0); transition: transform 250ms cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  .radio-inner.radio-active { transform: scale(1); }

  .option-content { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
  .option-label { font-size: 15px; font-weight: 600; color: var(--fg); line-height: 1.4; }
  .option-desc { font-size: 13px; color: var(--fg-secondary); line-height: 1.4; opacity: 0.8; }

  .field-error { font-size: 13px; color: var(--error); font-weight: 600; margin-top: 4px; }

  /* ── Checkbox ── */
  .checkbox-wrapper { display: flex; flex-direction: column; gap: 16px; }
  .checkbox-item {
    display: flex; align-items: flex-start; gap: 14px; padding: 18px;
    border-radius: 12px; border: 1.5px solid var(--border); background: var(--card);
    cursor: pointer; text-align: left; font-family: var(--font-display);
    transition: all 180ms ease;
    -webkit-tap-highlight-color: transparent;
  }
  .checkbox-item.checkbox-checked { border-color: var(--green-mid); background: var(--green-tint); }
  .checkbox-box {
    width: 22px; height: 22px; min-width: 22px; border-radius: 6px;
    border: 1.5px solid var(--border); display: flex; align-items: center;
    justify-content: center; margin-top: 2px;
    transition: all 180ms ease;
  }
  .checkbox-checked .checkbox-box { background: var(--green-mid); border-color: var(--green-mid); }
  .checkbox-label { font-size: 14px; color: var(--fg-secondary); line-height: 1.6; }

  .terms-link {
    display: inline-flex; align-items: center; gap: 4px;
    font-size: 13px; color: var(--green-mid); font-weight: 700;
    text-decoration: none; padding-left: 2px;
  }
  .terms-link:hover { text-decoration: underline; }

  /* ── Video upload ── */
  .video-upload-wrapper { display: flex; flex-direction: column; gap: 12px; }
  .video-dropzone {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    gap: 16px; padding: 48px 24px; border-radius: 16px;
    border: 2px dashed var(--border); background: var(--card);
    cursor: pointer; transition: all 200ms ease;
    font-family: var(--font-display);
    -webkit-tap-highlight-color: transparent;
  }
  .video-dropzone:hover { border-color: var(--green-mid); background: var(--green-tint); }
  .video-dropzone-text { font-size: 16px; font-weight: 600; color: var(--fg); }
  .video-dropzone-hint { font-size: 14px; color: var(--fg-muted); }

  .video-uploaded {
    display: flex; align-items: center; gap: 16px; padding: 20px;
    border-radius: 12px; border: 1.5px solid var(--green-mid); background: var(--green-tint);
  }
  .video-uploaded-name { font-size: 15px; font-weight: 700; color: var(--fg); }
  .video-replace-btn {
    font-size: 13px; font-weight: 700; color: var(--green-mid);
    background: white; padding: 6px 12px; border-radius: 8px; border: 1px solid var(--green-mid);
    cursor: pointer; font-family: var(--font-display);
  }

  .video-uploading {
    display: flex; flex-direction: column; gap: 12px; padding: 24px;
    border-radius: 12px; border: 1.5px solid var(--green-mid); background: var(--green-tint);
  }
  .video-progress-bar {
    height: 8px; width: 100%; background: rgba(27, 107, 58, 0.15);
    border-radius: 999px; overflow: hidden;
  }
  .video-progress-fill {
    height: 100%; background: var(--green-mid); border-radius: 999px;
    transition: width 200ms ease;
  }
  .video-uploading-text {
    font-size: 14px; font-weight: 600; color: var(--green-deep); text-align: center;
  }

  /* ── Content blocks ── */
  .content-blocks { margin-top: 32px; display: flex; flex-direction: column; gap: 24px; }

  .cb-paragraph { font-size: 16px; color: var(--fg-secondary); line-height: 1.7; }

  .cb-highlight {
    font-size: 16px; font-weight: 600; color: var(--green-deep); line-height: 1.5;
    padding: 20px; background: var(--green-tint); border-radius: 16px;
    display: flex; align-items: flex-start; gap: 14px;
  }
  .cb-highlight svg { flex-shrink: 0; margin-top: 2px; color: var(--green-mid); }

  .cb-deadline {
    display: inline-flex; align-items: center; gap: 8px;
    font-size: 14px; font-weight: 700; color: var(--fg-muted);
    padding: 8px 12px; background: rgba(0,0,0,0.04); border-radius: 8px; align-self: flex-start;
  }

  /* ── Message Bubbles Animation ── */
  .cb-message-bubbles-container {
    height: 280px; overflow-y: hidden; position: relative;
    padding: 16px 0;
    mask-image: linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%);
    -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%);
  }
  .cb-message-bubbles-track {
    display: flex; flex-direction: column; gap: 14px;
    padding-bottom: 24px;
  }
  .cb-bubble {
    max-width: 85%; padding: 14px 18px; border-radius: 18px;
    font-size: 15px; font-weight: 500; line-height: 1.4;
    animation: bubbleEnter 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  }
  .cb-bubble-other {
    align-self: flex-start; background: var(--card); border: 1px solid var(--border);
    color: var(--fg-secondary); border-bottom-left-radius: 4px;
  }
  .cb-bubble-user {
    align-self: flex-end; background: var(--green-mid);
    color: white; border-bottom-right-radius: 4px;
  }

  @keyframes bubbleEnter {
    0% { opacity: 0; transform: translateY(16px) scale(0.96); }
    100% { opacity: 1; transform: translateY(0) scale(1); }
  }

  /* ── Prizes ── */
  .cb-prizes { display: flex; flex-direction: column; gap: 12px; }
  .cb-prize-item {
    display: flex; align-items: center; gap: 16px;
    padding: 16px; background: var(--card); border-radius: 12px;
    border: 1.5px solid var(--border);
  }
  .cb-prize-rank {
    width: 40px; height: 40px; min-width: 40px; border-radius: 50%;
    background: var(--green-tint); color: var(--green-mid);
    display: flex; align-items: center; justify-content: center;
    font-size: 18px; font-weight: 800;
  }
  .cb-prize-title { font-size: 15px; font-weight: 700; color: var(--fg); display: block; }
  .cb-prize-desc { font-size: 13px; color: var(--fg-secondary); line-height: 1.4; }

  /* ── Lists ── */
  .cb-list-title { font-size: 16px; font-weight: 700; color: var(--fg); margin-bottom: 16px; }
  .cb-list { display: flex; flex-direction: column; gap: 12px; list-style: none; padding: 0; }
  .cb-list li {
    font-size: 15px; color: var(--fg-secondary); line-height: 1.6;
    display: flex; gap: 12px;
  }
  .cb-list-ordered li { counter-increment: step; }
  .cb-list-ordered li::before {
    content: counter(step);
    width: 24px; height: 24px; min-width: 24px; border-radius: 50%;
    background: var(--fg); color: white; display: flex; align-items: center;
    justify-content: center; font-size: 12px; font-weight: 700; margin-top: 1px;
  }

  /* ── Tips ── */
  .cb-tips-grid {
    display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-top: 8px;
  }
  @media (max-width: 480px) {
    .cb-tips-grid { grid-template-columns: 1fr; }
  }
  .cb-tip-card {
    display: flex; flex-direction: column; gap: 14px;
    padding: 20px; background: var(--card);
    border: 1.5px solid var(--border); border-radius: 16px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.02);
    animation: tipEnter 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
  }
  .cb-tip-icon {
    width: 44px; height: 44px; border-radius: 12px;
    background: var(--green-tint); color: var(--green-mid);
    display: flex; align-items: center; justify-content: center;
  }
  .cb-tip-text {
    font-size: 15px; font-weight: 600; color: var(--fg); line-height: 1.5; letter-spacing: -0.01em;
  }

  @keyframes tipEnter {
    0% { opacity: 0; transform: translateY(12px) scale(0.98); }
    100% { opacity: 1; transform: translateY(0) scale(1); }
  }

  /* ── Navigation ── */
  .form-nav-fixed {
    position: fixed; bottom: 0; left: 0; right: 0; z-index: 50;
    background: linear-gradient(to top, var(--surface) 80%, rgba(250,252,251,0));
    padding: 24px 0 32px;
  }
  .form-nav {
    display: flex; align-items: center; justify-content: space-between;
    max-width: 480px; margin: 0 auto; padding: 0 32px; gap: 16px;
  }
  @media (max-width: 520px) { .form-nav { padding: 0 24px; } }

  .btn-back {
    display: flex; align-items: center; gap: 6px; padding: 12px 0;
    background: transparent; border: none; font-family: var(--font-display);
    font-size: 15px; font-weight: 700; color: var(--fg-muted); cursor: pointer;
    transition: color 150ms ease;
  }
  .btn-back:hover { color: var(--fg); }
  .btn-back:disabled { opacity: 0; pointer-events: none; }

  .btn-next {
    flex: 1; display: flex; align-items: center; justify-content: center; gap: 8px;
    height: 56px; border-radius: 14px; border: none; background: var(--green-deep);
    font-family: var(--font-display); font-size: 16px; font-weight: 700;
    color: white; cursor: pointer; transition: all 200ms ease;
    box-shadow: 0 4px 12px rgba(11, 61, 30, 0.15);
  }
  .btn-next:hover { background: #0E4A25; transform: translateY(-1px); box-shadow: 0 6px 16px rgba(11, 61, 30, 0.2); }
  .btn-next:active { transform: translateY(0) scale(0.98); }
  .btn-next:disabled {
    background: var(--border); color: var(--fg-muted); cursor: not-allowed;
    box-shadow: none; transform: none;
  }
  .btn-next:disabled:hover { background: var(--border); transform: none; box-shadow: none; }

  .keyboard-hint { font-size: 12px; color: var(--fg-muted); text-align: center; margin-top: 16px; font-weight: 500; }
  @media (pointer: coarse) { .keyboard-hint { display: none; } }

  /* ── Completion ── */
  .check-circle {
    width: 72px; height: 72px; border-radius: 50%; background: var(--green-mid);
    display: flex; align-items: center; justify-content: center; margin: 0 auto;
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
