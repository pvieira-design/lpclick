"use client";

import { useState } from "react";

const STEPS = [
  {
    chip: "Etapa 1",
    title: "Consulta",
    description: "Médica",
    flipTitle: "Consulta médica",
    flipDescription:
      "Faça sua consulta médica por apenas R$50, todo o processo é 100% online, com médicos de plantão 24h por dia.",
    Illustration: IllustrationStep1,
  },
  {
    chip: "Etapa 2",
    title: "Receita",
    description: "Médica",
    flipTitle: "Receita Médica",
    flipDescription:
      "Se apto para o tratamento, o médico emitirá a receita necessária para que a autorização possa ser solicitada.",
    Illustration: IllustrationStep2,
  },
  {
    chip: "Etapa 3",
    title: "Autorização da",
    description: "Anvisa",
    flipTitle: "Autorização da Anvisa",
    flipDescription:
      "Acompanhamos você em todas as etapas do processo de documentação necessário para a importação dos medicamentos prescritos.",
    Illustration: IllustrationStep3,
  },
  {
    chip: "Etapa 4",
    title: "Importação e",
    description: "Entrega",
    flipTitle: "Importação e entrega",
    flipDescription:
      "Oferecemos suporte completo na importação direta dos EUA, com isenção de impostos e entrega em até 15 dias úteis.",
    Illustration: IllustrationStep4,
  },
];

export default function TreatmentSteps() {
  const [flippedIndex, setFlippedIndex] = useState<number | null>(null);

  const openTreatmentModal = () => {
    window.dispatchEvent(new CustomEvent("treatment:open"));
  };

  return (
    <section className="bg-white py-12 sm:py-16">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-5">
        {/* Header */}
        <header className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto] sm:items-start sm:gap-x-8 sm:gap-y-2">
          <span className="inline-flex w-fit items-center rounded-full bg-[#CDE9D1] px-3 py-1 text-xs font-medium text-[#285E31] sm:col-start-2 sm:row-start-1 sm:justify-self-end sm:text-sm">
            Processos
          </span>
          <h2
            className="text-[2rem] font-light leading-[1.05] tracking-tight text-gray-900 sm:col-start-1 sm:row-span-2 sm:row-start-1 sm:text-[3rem]"
            style={{ fontFamily: "var(--font-geist-sans), system-ui, sans-serif" }}
          >
            Tratamento descomplicado
          </h2>
          <p className="text-xs text-gray-500 sm:col-start-2 sm:row-start-2 sm:text-right sm:text-sm">
            Entenda cada uma das nossas etapas.
          </p>
        </header>

        {/* Cards empilhados */}
        <div className="flex flex-col gap-4">
          {STEPS.map((step, index) => {
            const isFlipped = flippedIndex === index;
            const toggle = () => setFlippedIndex(isFlipped ? null : index);
            const handleKey = (e: React.KeyboardEvent) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                toggle();
              }
            };
            return (
              <div key={step.chip} className="treatment-card-outer w-full">
                <div
                  role="button"
                  tabIndex={0}
                  aria-pressed={isFlipped}
                  aria-label={`${step.chip}: ${step.title} ${step.description}. ${isFlipped ? "Ocultar" : "Mostrar"} mais informações.`}
                  onClick={toggle}
                  onKeyDown={handleKey}
                  className={`treatment-card-inner cursor-pointer select-none outline-none focus-visible:ring-2 focus-visible:ring-[#3E8F4A] focus-visible:ring-offset-2 rounded-3xl ${isFlipped ? "flipped" : ""}`}
                >
                  {/* Frente */}
                  <div className="treatment-card-face flex items-stretch overflow-hidden rounded-3xl bg-[#E5F2E7]">
                    <div className="flex flex-1 flex-col justify-between p-5">
                      <div>
                        <span className="inline-flex h-5 items-center rounded-full bg-[#CDE9D1] px-2 py-[2px] text-xs text-[#285E31]">
                          {step.chip}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-normal text-gray-500">{step.title}</p>
                        <h3
                          className="mb-2 text-[28px] leading-tight text-[#285E31] sm:text-[32px]"
                          style={{ fontFamily: "var(--font-geist-sans), system-ui, sans-serif" }}
                        >
                          {step.description}
                        </h3>
                        <span className="flex items-center gap-2 py-1 text-sm font-medium text-[#3E8F4A]">
                          <IconPlusCircle />
                          <span>Mais informações</span>
                        </span>
                      </div>
                    </div>
                    <div className="relative flex w-[130px] shrink-0 items-start justify-end p-3 sm:w-[160px]">
                      <step.Illustration className="h-auto w-full max-w-[120px] sm:max-w-[140px]" />
                    </div>
                  </div>

                  {/* Verso */}
                  <div className="treatment-card-face treatment-card-back flex flex-col justify-between rounded-3xl bg-[#E5F2E7] p-5">
                    <div>
                      <p className="mb-1 text-base text-gray-500">{step.flipTitle}</p>
                      <p className="text-sm font-normal text-[#285E31]">
                        {step.flipDescription}
                      </p>
                    </div>
                    <span className="flex items-center gap-2 py-1 text-sm font-medium text-[#3E8F4A]">
                      <IconMinusCircle />
                      <span>Menos informações</span>
                    </span>
                  </div>
                </div>
              </div>
            );
          })}

          {/* CTA Card */}
          <div className="relative mt-2 w-full overflow-hidden rounded-3xl bg-[#083b0e]">
            <img
              src="/images/card_precess.webp"
              alt=""
              className="absolute inset-0 h-full w-full object-cover object-center"
              loading="lazy"
              decoding="async"
            />
            <div className="relative flex min-h-[520px] flex-col justify-end gap-5 p-6 sm:min-h-[600px] sm:p-8">
              <p
                className="text-center text-[1.75rem] font-light leading-[1.15] tracking-[-0.5px] text-[#ebedc2] sm:text-[2rem]"
                style={{ fontFamily: "var(--font-geist-sans), system-ui, sans-serif" }}
              >
                Uma jornada de sucesso com quem entende!
              </p>
              <button
                type="button"
                onClick={openTreatmentModal}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-white transition-transform hover:scale-[1.01] active:scale-[0.99]"
              >
                <span className="text-base font-semibold text-[#285E31]">Iniciar jornada</span>
                <IconWhatsapp />
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .treatment-card-outer {
          perspective: 1200px;
        }
        .treatment-card-inner {
          position: relative;
          width: 100%;
          min-height: 180px;
          transform-style: preserve-3d;
          transition: transform 600ms cubic-bezier(0.4, 0, 0.2, 1);
        }
        .treatment-card-inner.flipped {
          transform: rotateY(180deg);
        }
        .treatment-card-face {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        .treatment-card-back {
          transform: rotateY(180deg);
        }
        @media (prefers-reduced-motion: reduce) {
          .treatment-card-inner { transition: none; }
        }
      `}</style>
    </section>
  );
}

function IconPlusCircle() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 8v8M8 12h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function IconMinusCircle() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 12h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function IconWhatsapp() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={18}
      height={18}
      fill="none"
      aria-hidden="true"
    >
      <path
        stroke="#285E31"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13.416 4.492a6.154 6.154 0 0 0-4.38-1.816 6.198 6.198 0 0 0-6.196 6.192 6.178 6.178 0 0 0 .825 3.094l-.878 3.207 3.282-.861a6.18 6.18 0 0 0 2.959.754h.003a6.198 6.198 0 0 0 6.192-6.189 6.15 6.15 0 0 0-1.812-4.38Z"
        clipRule="evenodd"
      />
      <path
        stroke="#285E31"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m9.773 10.1.289-.286a.777.777 0 0 1 .99-.083c.295.209.562.394.81.568a.767.767 0 0 1 .103 1.176l-.256.256M6.259 6.28l.255-.256a.769.769 0 0 1 1.176.103c.173.248.359.515.566.81a.775.775 0 0 1-.081.99l-.286.288"
      />
      <path
        stroke="#285E31"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11.7 11.73c-1.051 1.048-2.82.158-4.215-1.238"
      />
      <path
        stroke="#285E31"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7.485 10.493C6.088 9.097 5.199 7.329 6.246 6.277M7.887 8.223c.227.357.517.71.846 1.039l.001.001c.329.329.682.619 1.04.846"
      />
    </svg>
  );
}

// ============ Ilustrações (SVG inline) ============

type SvgProps = React.SVGProps<SVGSVGElement>;

function IllustrationStep1(props: SvgProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 120 91"
      fill="none"
      aria-hidden="true"
      {...props}
    >
      <path
        fill="#fff"
        d="M94.773 15.01a5.775 5.775 0 0 0-6.402-3.144L32.58 23.668c-3.573.756-5.575 4.59-4.15 7.95l19.593 46.249a5.775 5.775 0 0 0 6.517 3.397l58.213-12.314c3.684-.78 5.668-4.812 4.036-8.203L94.773 15.011Z"
      />
      <path
        stroke="#000"
        strokeOpacity={0.09}
        strokeWidth={0.724}
        d="m88.444 12.22-55.79 11.803c-3.244.686-5.107 4.08-4.007 7.156l.116.297 19.595 46.249a5.414 5.414 0 0 0 6.11 3.184l58.212-12.314c3.345-.708 5.196-4.278 3.917-7.39l-.133-.3-22.017-45.736a5.415 5.415 0 0 0-6.003-2.948Z"
      />
      <path
        fill="#E5F2E7"
        d="M91.86 18.026c.472-3.474-2.631-6.362-6.059-5.637L29.054 24.392a5.09 5.09 0 0 0-3.952 4.074l-9.755 53.922c-.641 3.544 2.504 6.602 6.024 5.858l59.24-12.531a5.09 5.09 0 0 0 3.988-4.294l7.26-53.395Z"
      />
      <path
        fill="#3E8F4A"
        fillOpacity={0.35}
        d="M36.469 60.63c.325-1.632-1.118-3.06-2.743-2.715l-7.173 1.523a2.33 2.33 0 0 0-1.802 1.837l-1.236 6.397c-.314 1.628 1.126 3.046 2.746 2.702l7.133-1.514a2.33 2.33 0 0 0 1.8-1.825l1.275-6.405ZM51.41 57.493c.325-1.632-1.118-3.06-2.743-2.715l-7.173 1.523a2.33 2.33 0 0 0-1.802 1.838l-1.236 6.396c-.314 1.629 1.127 3.046 2.746 2.702l7.134-1.514a2.33 2.33 0 0 0 1.8-1.824l1.274-6.406ZM66.35 54.353c.324-1.632-1.119-3.06-2.744-2.715l-7.173 1.522a2.33 2.33 0 0 0-1.802 1.838l-1.236 6.397c-.314 1.628 1.127 3.045 2.746 2.702l7.134-1.514a2.33 2.33 0 0 0 1.8-1.825l1.274-6.405ZM81.29 51.216c.325-1.632-1.118-3.06-2.743-2.715l-7.173 1.523a2.33 2.33 0 0 0-1.802 1.837l-1.236 6.397c-.314 1.628 1.126 3.046 2.746 2.702l7.133-1.514a2.33 2.33 0 0 0 1.8-1.825l1.275-6.405Z"
      />
      <path
        fill="#3E8F4A"
        d="M59.971 17.496c.37-2.026-1.424-3.774-3.436-3.347l-24.133 5.13a4.373 4.373 0 0 0-3.393 3.516l-4.135 23.37c-.357 2.023 1.434 3.758 3.44 3.332l24.949-5.304a2.915 2.915 0 0 0 2.259-2.328l4.45-24.369Z"
      />
      <path
        fill="#fff"
        d="M46.718 37.605a5.346 5.346 0 0 1-1.9.056 2.741 2.741 0 0 1-1.545-.795c-.43-.434-.725-1.078-.884-1.932-.155-.855-.115-1.973.118-3.353.22-1.308.545-2.496.973-3.566.433-1.07.953-2.008 1.56-2.81a8.713 8.713 0 0 1 2.043-1.984 6.809 6.809 0 0 1 2.424-1.05c.886-.191 1.644-.185 2.272.018.628.203 1.103.568 1.425 1.096.326.527.48 1.173.463 1.938l-2.215.477c-.045-.592-.256-1.038-.635-1.337-.38-.3-.927-.372-1.643-.217-1.09.234-2.02.895-2.792 1.982-.767 1.087-1.297 2.482-1.589 4.185l.109-.023a7.066 7.066 0 0 1 2.508-2.254 5.8 5.8 0 0 1 1.524-.567c.862-.186 1.606-.142 2.232.133.63.268 1.092.728 1.383 1.38.291.652.356 1.455.195 2.412a7.213 7.213 0 0 1-1.085 2.736 8.28 8.28 0 0 1-2.113 2.231 7.274 7.274 0 0 1-2.828 1.244Zm.314-1.9a4.022 4.022 0 0 0 1.604-.755c.498-.38.919-.837 1.26-1.371a4.493 4.493 0 0 0 .664-1.687c.097-.576.057-1.072-.12-1.49a1.634 1.634 0 0 0-.855-.902c-.394-.183-.874-.214-1.44-.092a3.909 3.909 0 0 0-1.24.507c-.392.244-.75.542-1.076.894a5.63 5.63 0 0 0-.824 1.15 4.067 4.067 0 0 0-.434 1.243c-.095.561-.054 1.053.122 1.476.18.422.471.73.872.926.407.19.896.223 1.467.1ZM29.698 41.009l.276-1.64 5.92-6.337a48.882 48.882 0 0 0 1.583-1.787c.427-.51.76-.979 1-1.407.24-.428.398-.861.472-1.3.084-.498.04-.902-.131-1.213a1.29 1.29 0 0 0-.81-.637c-.367-.113-.803-.116-1.307-.007a3.936 3.936 0 0 0-2.522 1.756c-.28.446-.466.937-.557 1.474l-2.142.461a6.24 6.24 0 0 1 1.029-2.527 7.404 7.404 0 0 1 1.982-1.957 7.26 7.26 0 0 1 2.573-1.105c.934-.2 1.725-.19 2.374.032.654.217 1.127.604 1.42 1.161.294.553.373 1.231.237 2.036a5.817 5.817 0 0 1-.587 1.7c-.294.575-.75 1.244-1.368 2.008-.618.758-1.458 1.698-2.52 2.82l-3.482 3.754-.02.11 6.697-1.442-.328 1.939-9.79 2.108Z"
      />
    </svg>
  );
}

function IllustrationStep2(props: SvgProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 120 84"
      fill="none"
      aria-hidden="true"
      {...props}
    >
      <mask
        id="step2mask"
        width={120}
        height={84}
        x={0}
        y={0}
        maskUnits="userSpaceOnUse"
        style={{ maskType: "alpha" }}
      >
        <path fill="#D9D9D9" d="M0 .078h100c11.046 0 20 8.954 20 20v63H0v-83Z" />
      </mask>
      <g mask="url(#step2mask)">
        <path
          fill="#fff"
          d="M61.777 3.428c.32-1.219 1.65-1.955 2.983-1.652l52.063 11.852c1.345.307 2.188 1.556 1.882 2.79L102.949 80.01c-.306 1.235-1.645 1.988-2.99 1.681L46.988 69.632c-1.358-.31-2.201-1.578-1.875-2.82L61.777 3.428Z"
        />
        <path
          fill="#285E31"
          fillOpacity={0.16}
          d="M61.646 3.431c.306-1.235 1.644-1.987 2.99-1.681l52.189 11.88c1.346.307 2.188 1.556 1.882 2.791l-2.432 9.817-57.062-12.99 2.433-9.817Z"
        />
        <ellipse
          cx={3.157}
          cy={3.171}
          fill="#285E31"
          fillOpacity={0.82}
          rx={3.157}
          ry={3.171}
          transform="matrix(.97442 .22182 -.2216 .89438 66.094 5.828)"
        />
        <path
          fill="#3E8F4A"
          d="M64.11 35.331c.335-.502.984-.744 1.613-.6l11.736 2.671c.629.143 1.096.64 1.16 1.232l.14 1.304c.161 1.509.058 3.028-.306 4.497l-1.72 6.94c-.214.864-1.15 1.39-2.092 1.176l-13.507-3.074c-.942-.215-1.532-1.09-1.318-1.954l1.72-6.94c.364-1.469.984-2.87 1.837-4.148l.737-1.104Z"
        />
        <path fill="#FFF6B2" d="m98.987 44.828.676 1.312-2.742 1.28-.59-1.447 2.656-1.145Z" />
        <path fill="#CDE9D1" d="m88.734 45.996 1.656-.935 1.733 2.582-2.105.833-1.284-2.48Z" />
        <path fill="#FFE0E0" d="m93.279 54.469-.938-1.964 2.657-1.145.488 1.861-2.207 1.248Z" />
        <ellipse
          cx={5.368}
          cy={5.369}
          fill="#285E31"
          rx={5.368}
          ry={5.369}
          transform="matrix(.81585 .57664 -.57307 .82066 16.294 25.012)"
        />
        <ellipse
          cx={3.512}
          cy={3.513}
          fill="#CDE9D1"
          fillOpacity={0.42}
          rx={3.512}
          ry={3.513}
          transform="matrix(.81585 .57664 -.57307 .82066 16.58 26.648)"
        />
      </g>
    </svg>
  );
}

function IllustrationStep3(props: SvgProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 120 85"
      fill="none"
      aria-hidden="true"
      {...props}
    >
      <mask
        id="step3mask"
        width={120}
        height={85}
        x={0}
        y={0}
        maskUnits="userSpaceOnUse"
        style={{ maskType: "alpha" }}
      >
        <path fill="#D9D9D9" d="M0 .078h100.606C111.317.078 120 8.761 120 19.472v64.606H0v-84Z" />
      </mask>
      <g mask="url(#step3mask)">
        <path
          fill="#3E8F4A"
          fillOpacity={0.04}
          d="m64.138 29.247-2.543-1.815a3.615 3.615 0 0 0-3.461-.41l-2.895 1.173 1.809-2.555a3.657 3.657 0 0 0 .406-3.476l-1.168-2.906 2.543 1.816c1.01.72 2.314.875 3.46.41l2.896-1.174-1.81 2.556a3.657 3.657 0 0 0-.406 3.476l1.169 2.905Z"
        />
        <path
          fill="#3E8F4A"
          fillOpacity={0.16}
          d="m48.175 23.004-.186-1.258a3.642 3.642 0 0 0-2.104-2.79l-1.151-.518 1.248-.186a3.63 3.63 0 0 0 2.78-2.11l.518-1.16.185 1.257a3.642 3.642 0 0 0 2.105 2.79l1.15.519-1.247.185a3.63 3.63 0 0 0-2.78 2.111l-.518 1.16Z"
        />
        <path
          fill="#3E8F4A"
          d="m31.449 42.524-16.494.108a.603.603 0 0 0-.28.071L9.835 45.29l-3.857 2.062a.606.606 0 0 1-.88-.648l.776-4.152a.607.607 0 0 0-.564-.718l-3.03-.164a2.428 2.428 0 0 1-2.27-2.772L2.36 22.627a2.42 2.42 0 0 1 2.414-2.077l29.829.24a2.428 2.428 0 0 1 2.364 2.874l-3.156 16.883a2.42 2.42 0 0 1-2.362 1.977Z"
        />
        <path
          fill="#CDE9D1"
          d="M25.678 28.967c.9 5.17-7.513 8.111-8.305 8.107-.793-.004-7.456-4.88-5.67-8.572 2.047-4.229 6.975.083 6.975.083s6.257-3.883 7 .382Z"
        />
        <path
          fill="#3E8F4A"
          d="m74.59 19.512 14.459.11c.103.002.205.029.295.08l4.447 2.534 3.466 1.976a.606.606 0 0 0 .897-.632l-.662-3.812a.607.607 0 0 1 .605-.71l2.995.037a2.428 2.428 0 0 0 2.435-2.747l-2.008-15.16a2.42 2.42 0 0 0-2.375-2.105L71.885-1.19a2.428 2.428 0 0 0-2.413 2.844l2.752 15.85a2.42 2.42 0 0 0 2.366 2.008Z"
        />
        <path
          fill="#fff"
          d="M86.485 13.366a.94.94 0 0 0 .1 1.352c.41.345 1.033.3 1.389-.103a.94.94 0 0 0-.1-1.352l-.743-.625-.646.728ZM85.849 3.86l1.4.073.27 5.601 2.969-3.412 1.264.717-3.01 3.622 3.79-.142.095 1.298-11.483-.135-.096-1.298 3.878.053-3.451-3.866 1.183-.79 3.372 3.752-.181-5.474ZM41.58 42.014c12.105-1.871 33.62-3.993 39.895-4.159 5.503 1.697 6.763 8.73 7.201 11.175l.012.07-34.302 12.539-6.334 2.688c-1.61 3.531-5.875 11.901-8.028 13.199-1.839 1.108-2.06-2.274-1.896-4.9-.395 3.133-1.774 7.228-5.108 5.28-3.807-2.226.484-13.775 3.106-19.272l-2.468 2.392c-1.18 2.292-3.45 7.185-3.092 8.416.446 1.539-3.538 6.878-4.267 7.09-.729.214-3.36-.685-2.008-6.924 1.082-4.99 4.534-11.62 6.125-14.311-.655.47-2.21 1.648-3.197 2.604-1.234 1.196-2.468 2.391-5.055 9.825-2.069 5.948-3.855 6.693-4.49 6.322-.877-.3-1.945-3.437.802-13.59C21.909 47.77 33.29 43.297 41.58 42.015Z"
        />
        <path
          fill="#3E8F4A"
          fillOpacity={0.12}
          d="M101.84 26.054 79.715 37.05c3.91 1.572 11.635 8.5 7.706 24.976l24.554-3.881c8.939-9.23 1.384-29.618-10.135-32.091Z"
        />
        <path
          fill="#ECF9EE"
          fillOpacity={0.8}
          d="M47.533 79.503c-20.683 6.05-33.668-4.34-41.166-12.997-.776-1.72-1.784-6.156 2.461-11.57 4.025-6.186 11.736-5.381 15.321-4.483.444.305-4.197 5.505-5.972 10.929-1.96 5.992-1.695 11.346-.483 12.66.99.546 4.596-1.344 7.824-13.138 1.129-1.84 5.013-5.64 5.566-5.802-4.034 5.353-9.337 18.59-5.157 21.54 4.054-.35 6.942-15.385 11.305-18.33 1.17.736-8.464 16.665-3.295 20.16 1.785.327 3.965-4.02 5.79-8.302.505-1.574 1.205-3.17 1.857-4.52.865-2.126 1.506-3.604 1.765-3.441-.151.343-.918 1.685-1.765 3.44-.544 1.334-1.175 2.923-1.856 4.52-1.015 3.169-1.235 6.247 1.327 7.056 1.832 1.063 6.738-11.152 8.047-12.37 1.85-1.723 4.15-2.884 5.682-3.332.436-.406 1.392-2.076 1.725-5.512.334-3.437 3.928-3.653 5.043.194.417-4.295 2.046-7.276 5.236-4.87 1.183-4.52 3.445-6.834 4.79-6.41 2.744.867 1.465 7.918 1.465 7.918 2.811-7.5 6.708-7.854 7.311-6.312 3.22 8.24-10.092 19.646-14.689 20.99-8.493 10.832-14.844 11.855-18.132 11.982Z"
        />
        <path
          fill="#3E8F4A"
          d="m79.754 35.855-9.823 1.296c-.13.018-.145.205-.02.244 5.399 1.678 7.533 4.532 9.124 8.218.212.491 1.158.404 1.32.916 1.436 2.084-.005 3.268.144 4.131 1.157 6.689-.998 13.34-1.573 14.51l8.64-3.185c4.378-15.345-2.995-24.352-7.812-26.13Z"
        />
      </g>
    </svg>
  );
}

function IllustrationStep4(props: SvgProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 120 87"
      fill="none"
      aria-hidden="true"
      {...props}
    >
      <path
        fill="#3E8F4A"
        fillOpacity={0.07}
        d="m90.184 5.845-.685 2.94 15.467 3.588.685-2.94s-1.168-2.982-6.913-4.315c-5.745-1.332-8.554.727-8.554.727Z"
      />
      <ellipse
        cx={7.939}
        cy={3.396}
        fill="#285E31"
        fillOpacity={0.45}
        rx={7.939}
        ry={3.396}
        transform="matrix(.97413 .226 .2269 -.97392 88.643 12.46)"
      />
      <mask
        id="step4mask"
        width={120}
        height={87}
        x={0}
        y={0}
        maskUnits="userSpaceOnUse"
        style={{ maskType: "alpha" }}
      >
        <path fill="#D9D9D9" d="M0 86.078h102.471c9.681 0 17.529-7.848 17.529-17.529V.08H0v86Z" />
      </mask>
      <g mask="url(#step4mask)">
        <path
          fill="#3E8F4A"
          d="m99.885 13.644 5.525 43.003a1.755 1.755 0 0 1-1.951 1.964l-22.318-2.69a2.19 2.19 0 0 1-1.895-1.794l-7.095-40.248a2.192 2.192 0 0 1 2.2-2.57l23.4.425a2.19 2.19 0 0 1 2.134 1.91Z"
        />
        <path
          fill="#fff"
          fillOpacity={0.35}
          d="m83.691 18.3.926 6.267c.105.71-.49 1.328-1.204 1.25l-3.757-.411a1.095 1.095 0 0 1-.961-.912l-1.012-6.188a1.096 1.096 0 0 1 1.177-1.268l3.842.331c.506.044.915.429.99.93Z"
        />
        <path
          fill="#285E31"
          fillOpacity={0.52}
          d="m95.256 18.35 2.914 19.311a.439.439 0 0 1-.505.498l-1.052-.171a.657.657 0 0 1-.544-.554l-2.767-19.038a.439.439 0 0 1 .467-.5l1.087.084c.204.015.37.169.4.37ZM91.506 18.074l1.912 12.117a.438.438 0 0 1-.504.501l-1.05-.17a.657.657 0 0 1-.544-.552l-1.767-11.846a.439.439 0 0 1 .467-.502l1.087.084a.438.438 0 0 1 .4.368Z"
        />
        <path
          fill="#fff"
          d="M40.79 54.084c7.431 13.89 17.977 17.582 26.189 16.798l24.89-21.674c-7.597.393-20.398-2.423-27.004-18.384-6.606-15.96-20.923-19.06-29.726-19.123L6.974 36.35c8.656.676 26.644 4.328 33.816 17.734Z"
        />
        <path
          fill="#E5F2E7"
          d="M41.872 51.157c8.006 13.564 15.591 17.91 23.803 17.123l20.492-17.304c-7.597.395-18.094-5.035-24.018-19.358-5.924-14.322-17.688-16.805-26.49-16.865L13.14 34.507c8.656.673 21.169 3.838 28.731 16.65Z"
        />
        <ellipse
          cx={7.201}
          cy={7.186}
          fill="#3E8F4A"
          fillOpacity={0.22}
          rx={7.201}
          ry={7.186}
          transform="matrix(.99544 -.09533 -.09573 -.99542 43.087 49.672)"
        />
      </g>
      <path
        stroke="#3E8F4A"
        strokeLinecap="round"
        strokeOpacity={0.3}
        strokeWidth={1.099}
        d="m46.154 41.536 1.52 2.067a.733.733 0 0 0 1.088.103l4.688-4.354"
      />
    </svg>
  );
}
