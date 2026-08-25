import { LINKS } from "./config";

export default function Footer() {
  return (
    <footer
      // O respiro grande no fim compensa o CTA fixo expandido (painel de preço),
      // que cobre ~11.5rem do viewport na última seção.
      className="border-t bg-[color:var(--bg)] px-6 pb-[calc(12rem+env(safe-area-inset-bottom))] pt-8 text-center"
      style={{ borderColor: "var(--line)" }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo.svg"
        alt="Click Cannabis"
        width={128}
        height={18}
        loading="lazy"
        decoding="async"
        className="mx-auto h-[18px] w-auto opacity-50"
      />

      <p className="mx-auto mt-4 max-w-[38ch] text-[11.5px] leading-relaxed text-[color:var(--muted)]">
        A Click Cannabis conecta pacientes a médicos prescritores e dá suporte ao processo de
        importação regulamentado pela ANVISA. O tratamento com cannabis medicinal depende de
        avaliação e prescrição médica individual e não representa garantia de resultado. Este
        conteúdo é informativo e não substitui a orientação do seu médico — nenhuma medicação
        em uso deve ser interrompida por conta própria.
      </p>

      <div className="mt-4 flex items-center justify-center gap-4 text-[11.5px] text-[color:var(--muted)]">
        <a
          href={LINKS.privacidade}
          target="_blank"
          rel="noopener noreferrer"
          className="underline-offset-4 hover:underline"
        >
          Privacidade
        </a>
        <span aria-hidden="true">·</span>
        <a
          href={LINKS.termos}
          target="_blank"
          rel="noopener noreferrer"
          className="underline-offset-4 hover:underline"
        >
          Termos de uso
        </a>
      </div>

      <p className="mt-4 text-[11px] text-[color:var(--muted)]">
        CNPJ 58.090.406/0001-92 · © Click Cannabis
      </p>
    </footer>
  );
}
