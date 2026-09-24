import type { Metadata } from "next";
import Lp12PageContent from "../lp12/Lp12PageContent";

export const metadata: Metadata = {
  title: "Click Cannabis · Consulta online com médico especialista",
  description:
    "Consulta online com médico especialista por R$50 e primeiro acompanhamento grátis. Conheça experiências de pacientes e agende sua consulta.",
  openGraph: {
    title: "Click Cannabis · Consulta online com médico especialista",
    description:
      "Consulta online com médico especialista por R$50 e primeiro acompanhamento grátis.",
    siteName: "Click Cannabis",
    locale: "pt_BR",
    type: "website",
  },
};

export default function Inicio2Page() {
  return <Lp12PageContent variant="inicio" testimonialsLayout="single-row" />;
}
