import type { Metadata } from "next";
import IntroSplash, { type StatVariant, type StoryVariant } from "../IntroSplash";
import { inter, lexend } from "../fonts";

// Página interna de validação: ?v=a|b|c|d troca a versão do ato "100 mil" e
// ?h=1|2|3|4 a de "Nossa história". A /lp18 pública é estática, fixa em c e sem a cena das fotos.

export const metadata: Metadata = {
  title: "LP18 · variantes",
  robots: { index: false, follow: false },
};

const STAT_VARIANTS: StatVariant[] = ["a", "b", "c", "d"];
const STORY_VARIANTS: StoryVariant[] = ["1", "2", "3", "4"];

export default async function VariantsPage({
  searchParams,
}: {
  searchParams: Promise<{ v?: string; h?: string }>;
}) {
  const { v, h } = await searchParams;
  const stat = STAT_VARIANTS.find((s) => s === v) ?? "c";
  const story = STORY_VARIANTS.find((s) => s === h) ?? "2";

  return (
    <main className={`lp18 ${lexend.variable} ${inter.variable}`}>
      <IntroSplash stat={stat} story={story} />
    </main>
  );
}
