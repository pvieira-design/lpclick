import type { Metadata } from "next";
import { Inter, Lexend } from "next/font/google";
import IntroSplash from "./IntroSplash";

// Tipografia da marca (aidesignclick): Lexend nos títulos, Inter no corpo.
const lexend = Lexend({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-display",
  display: "swap",
});
const inter = Inter({ subsets: ["latin"], variable: "--font-body", display: "swap" });

export const metadata: Metadata = {
  title: "Click Cannabis · O maior ecossistema de cannabis medicinal da América Latina",
  description:
    "Mais de 100 mil pacientes atendidos. Tratamento com cannabis medicinal 100% online, com acompanhamento médico completo.",
};

// Combinação em uso: "100 mil" versão C + "Nossa história" em tela cheia.
// A página é estática (sem searchParams) pra sair do cache na hora; as outras
// versões continuam navegáveis em /lp18/variantes?v=a|b|c|d&h=1|2|3|4.
export default function LandingPage() {
  return (
    <main className={`lp18 ${lexend.variable} ${inter.variable}`}>
      <IntroSplash stat="c" story="2" />
    </main>
  );
}
