import { LINKS } from "./config";

// Único bloco da página fora do vídeo: o rodapé legal exigido em toda LP.
export default function Footer() {
  return (
    <footer
      className="border-t bg-[color:var(--bg-soft)] px-6 pb-[calc(2.5rem+env(safe-area-inset-bottom))] pt-8 text-center text-[color:var(--ink)]"
      style={{ borderColor: "var(--line)" }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo.svg"
        alt="Click Cannabis"
        width={140}
        height={20}
        loading="lazy"
        decoding="async"
        className="mx-auto h-[20px] w-auto opacity-60"
      />

      <p className="mx-auto mt-4 max-w-[42ch] text-[11.5px] leading-relaxed text-[color:var(--muted)]">
        A Click Cannabis conecta pacientes a médicos prescritores e dá suporte ao processo de
        importação regulamentado pela ANVISA. O tratamento com cannabis medicinal depende de
        avaliação e prescrição médica individual e não representa garantia de resultado. Este
        conteúdo não substitui orientação médica.
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
