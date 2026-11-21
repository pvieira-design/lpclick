import type { Metadata } from "next";
import { DEPOIMENTOS } from "../avaliacao/testimonialSelection";
import IntroSplash from "./IntroSplash";
import Lp18Shell from "./Lp18Shell";
import { inter, lexend } from "./fonts";

export const metadata: Metadata = {
  title: "Click Cannabis · O maior ecossistema de cannabis medicinal da América Latina",
  description:
    "Mais de 100 mil pacientes atendidos. Tratamento com cannabis medicinal 100% online, com acompanhamento médico completo.",
};

// Combinação em uso: "100 mil" versão C, sem a cena das fotos nem a do
// Instagram (escondidas por enquanto). No fim da abertura a tela fica branca e o Lp18Shell troca a abertura pelo funil (o quiz
// da /avaliacao em fundo branco), que termina no envio pelo WhatsApp.
// A página é estática; as outras versões da abertura continuam em
// /lp18/variantes?v=a|b|c|d&h=1|2|3|4.
export const revalidate = false;

export default function LandingPage() {
  return (
    <Lp18Shell fontClass={`${lexend.variable} ${inter.variable}`} depoimentos={DEPOIMENTOS}>
      <IntroSplash stat="c" />
    </Lp18Shell>
  );
}
