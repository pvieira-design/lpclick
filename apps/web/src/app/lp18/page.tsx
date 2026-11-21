import type { Metadata } from "next";
import { Inter, Lexend } from "next/font/google";
import IntroSplash, { type StatVariant, type StoryVariant } from "./IntroSplash";

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

// Em validação: ?v=a|b|c|d troca a versão do ato "100 mil" e ?h=1|2|3|4 a de
// "Nossa história". Quando forem escolhidas, fixar aqui e remover o
// searchParams (a página volta a ser estática).
const STAT_VARIANTS: StatVariant[] = ["a", "b", "c", "d"];
const STORY_VARIANTS: StoryVariant[] = ["1", "2", "3", "4"];

export default async function LandingPage({
  searchParams,
}: {
  searchParams: Promise<{ v?: string; h?: string }>;
}) {
  const { v, h } = await searchParams;
  const stat = STAT_VARIANTS.find((s) => s === v) ?? "a";
  const story = STORY_VARIANTS.find((s) => s === h) ?? "1";

  return (
    <main className={`lp18 ${lexend.variable} ${inter.variable}`}>
      <IntroSplash stat={stat} story={story} />
    </main>
  );
}
