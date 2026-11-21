import type { Metadata } from "next";
import { Inter, Lexend } from "next/font/google";
import { DEPOIMENTOS } from "../avaliacao/testimonialSelection";
import IntroSplash from "./IntroSplash";
import Lp18Shell from "./Lp18Shell";

// Tipografia da marca (aidesignclick): Lexend nos títulos, Inter no corpo.
// Lexend vai como fonte variável (um arquivo só): a abertura usa 500 e 600, o
// formulário usa 400, 600 e 700.
const lexend = Lexend({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});
const inter = Inter({ subsets: ["latin"], variable: "--font-body", display: "swap" });

export const metadata: Metadata = {
  title: "Click Cannabis · O maior ecossistema de cannabis medicinal da América Latina",
  description:
    "Mais de 100 mil pacientes atendidos. Tratamento com cannabis medicinal 100% online, com acompanhamento médico completo.",
};

// Combinação em uso: "100 mil" versão C + fotos em tela cheia. Depois do
// Sim / Não, o Lp18Shell troca a abertura pelos passos do formulário (o quiz da
// /avaliacao em fundo branco), que termina no envio pelo WhatsApp.
// A página é estática; as outras versões da abertura continuam em
// /lp18/variantes?v=a|b|c|d&h=1|2|3|4.
export const revalidate = false;

export default function LandingPage() {
  return (
    <Lp18Shell fontClass={`${lexend.variable} ${inter.variable}`} depoimentos={DEPOIMENTOS}>
      <IntroSplash stat="c" story="2" />
    </Lp18Shell>
  );
}
