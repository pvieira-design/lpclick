import { LINKS } from "./config";

export default function BioFooter() {
  return (
    <footer className="mt-12 border-t pt-7 text-center" style={{ borderColor: "var(--line)" }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo.svg"
        alt="Click Cannabis"
        width={128}
        height={18}
        loading="lazy"
        decoding="async"
        className="mx-auto h-[18px] w-auto opacity-40"
      />

      <p className="mx-auto mt-4 max-w-[30ch] text-[11.5px] leading-relaxed text-[color:var(--muted)]">
        A Click Cannabis conecta pacientes a médicos prescritores e dá suporte ao processo de
        importação regulamentado pela ANVISA. O tratamento com cannabis medicinal depende de
        avaliação e prescrição médica individual. Os relatos são experiências reais de pacientes e
        não representam garantia de resultado.
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
